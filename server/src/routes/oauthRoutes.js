const express = require('express');
const router = express.Router();
const { TwitterApi } = require('twitter-api-v2');
const SocialAccount = require('../models/SocialAccount');
// Ensure we have authentication middleware
const { protect: auth } = require('../middleware/authMiddleware'); 

// Generate dynamic callback URL based on environment
const getCallbackUrl = (provider) => {
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const baseOAuth = process.env.OAUTH_CALLBACK_BASE || '/api/oauth';
  return `${baseUrl}${baseOAuth}/${provider}/callback`;
};

// Temporary store for code verifiers (in production, use Redis or DB session)
const codeVerifiers = {};

router.get('/twitter/connect', auth, async (req, res) => {
  try {
    const clientId = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'Twitter API credentials not configured' });
    }

    const client = new TwitterApi({ clientId, clientSecret });
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(getCallbackUrl('twitter'), {
      scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']
    });

    // Store verifier linked to state and user ID
    codeVerifiers[state] = { codeVerifier, userId: req.user.id };

    res.json({ url });
  } catch (error) {
    console.error('Error initiating Twitter OAuth:', error);
    res.status(500).json({ error: 'Failed to initiate OAuth flow' });
  }
});

router.get('/twitter/callback', async (req, res) => {
  const { state, code } = req.query;

  try {
    const sessionData = codeVerifiers[state];
    if (!sessionData) {
      return res.status(400).send('Invalid state or session expired.');
    }

    const { codeVerifier, userId } = sessionData;
    const clientId = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;
    const client = new TwitterApi({ clientId, clientSecret });

    let loginResult;
    try {
      // Exchange code for tokens
      loginResult = await client.loginWithOAuth2({
        code,
        codeVerifier,
        redirectUri: getCallbackUrl('twitter')
      });
    } catch (apiError) {
      console.error('Twitter API Token Exchange Error:', apiError.response?.data || apiError.message);
      throw new Error(`Token exchange failed: ${apiError.message}`);
    }

    const { client: loggedClient, accessToken, refreshToken, expiresIn } = loginResult;

    // Get user info
    const me = await loggedClient.v2.me();

    // Store in Database
    await SocialAccount.findOneAndUpdate(
      { userId: userId, platform: 'twitter', platformId: me.data.id },
      {
        profileName: me.data.username,
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
        active: true
      },
      { upsert: true, new: true }
    );

    // Clean up memory
    delete codeVerifiers[state];

    // Redirect back to frontend dashboard
    res.redirect(process.env.FRONTEND_URL + '/dashboard/profile?connected=twitter');
  } catch (error) {
    console.error('Error handling Twitter callback:', error);
    res.redirect(process.env.FRONTEND_URL + '/dashboard/profile?error=twitter_connect_failed');
  }
});

// ==========================================
// FACEBOOK OAUTH
// ==========================================
router.get('/facebook/connect', auth, (req, res) => {
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const redirectUri = getCallbackUrl('facebook');
  const state = req.user.id;

  if (!clientId) return res.status(500).json({ error: 'Facebook API not configured' });

  const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=public_profile,pages_manage_posts,pages_read_engagement`;
  res.json({ url });
});

router.get('/facebook/callback', async (req, res) => {
  const { code, state: userId } = req.query;
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
  const redirectUri = getCallbackUrl('facebook');

  try {
    const tokenRes = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`);
    const tokenData = await tokenRes.json();
    if (tokenData.error) throw new Error(tokenData.error.message);

    const profileRes = await fetch(`https://graph.facebook.com/me?fields=id,name&access_token=${tokenData.access_token}`);
    const profileData = await profileRes.json();

    await SocialAccount.findOneAndUpdate(
      { userId: userId, platform: 'facebook', platformId: profileData.id },
      {
        profileName: profileData.name,
        accessToken: tokenData.access_token,
        expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
        active: true
      },
      { upsert: true, new: true }
    );
    res.redirect(process.env.FRONTEND_URL + '/dashboard/profile?connected=facebook');
  } catch (error) {
    console.error('Facebook OAuth Error:', error);
    res.redirect(process.env.FRONTEND_URL + '/dashboard/profile?error=facebook_connect_failed');
  }
});

// ==========================================
// INSTAGRAM OAUTH (Basic Display API)
// ==========================================
router.get('/instagram/connect', auth, (req, res) => {
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const redirectUri = getCallbackUrl('instagram');
  const state = req.user.id;

  if (!clientId) return res.status(500).json({ error: 'Instagram API not configured' });

  const url = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code&state=${state}`;
  res.json({ url });
});

router.get('/instagram/callback', async (req, res) => {
  const { code, state: userId } = req.query;
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
  const redirectUri = getCallbackUrl('instagram');

  try {
    const formData = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code
    });

    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: formData
    });
    const tokenData = await tokenRes.json();
    if (tokenData.error_message) throw new Error(tokenData.error_message);

    const profileRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`);
    const profileData = await profileRes.json();

    await SocialAccount.findOneAndUpdate(
      { userId: userId, platform: 'instagram', platformId: profileData.id },
      {
        profileName: profileData.username,
        accessToken: tokenData.access_token,
        active: true
      },
      { upsert: true, new: true }
    );
    res.redirect(process.env.FRONTEND_URL + '/dashboard/profile?connected=instagram');
  } catch (error) {
    console.error('Instagram OAuth Error:', error);
    res.redirect(process.env.FRONTEND_URL + '/dashboard/profile?error=instagram_connect_failed');
  }
});

// ==========================================
// TIKTOK OAUTH
// ==========================================
router.get('/tiktok/connect', auth, (req, res) => {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = getCallbackUrl('tiktok');
  const state = req.user.id;

  if (!clientKey) return res.status(500).json({ error: 'TikTok API not configured' });

  const url = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&scope=user.info.basic,video.upload&redirect_uri=${redirectUri}&state=${state}`;
  res.json({ url });
});

router.get('/tiktok/callback', async (req, res) => {
  const { code, state: userId } = req.query;
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = getCallbackUrl('tiktok');

  try {
    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    });
    const tokenData = await tokenRes.json();
    if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);

    const profileRes = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    });
    const profileData = await profileRes.json();

    await SocialAccount.findOneAndUpdate(
      { userId: userId, platform: 'tiktok', platformId: profileData.data.user.open_id },
      {
        profileName: profileData.data.user.display_name,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
        active: true
      },
      { upsert: true, new: true }
    );
    res.redirect(process.env.FRONTEND_URL + '/dashboard/profile?connected=tiktok');
  } catch (error) {
    console.error('TikTok OAuth Error:', error);
    res.redirect(process.env.FRONTEND_URL + '/dashboard/profile?error=tiktok_connect_failed');
  }
});

// ==========================================
// YOUTUBE OAUTH
// ==========================================
const { OAuth2Client } = require('google-auth-library');

router.get('/youtube/connect', auth, (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = getCallbackUrl('youtube');
  const state = req.user.id;

  if (!clientId) return res.status(500).json({ error: 'Google API not configured' });

  const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/userinfo.profile'
    ],
    state
  });

  res.json({ url });
});

router.get('/youtube/callback', async (req, res) => {
  const { code, state: userId } = req.query;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = getCallbackUrl('youtube');

  try {
    const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Fetch user profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const profileData = await profileRes.json();

    await SocialAccount.findOneAndUpdate(
      { userId: userId, platform: 'youtube', platformId: profileData.sub },
      {
        profileName: profileData.name || 'YouTube Account',
        profilePicture: profileData.picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        active: true
      },
      { upsert: true, new: true }
    );
    res.redirect(process.env.FRONTEND_URL + '/dashboard/profile?connected=youtube');
  } catch (error) {
    console.error('YouTube OAuth Error:', error);
    res.redirect(process.env.FRONTEND_URL + '/dashboard/profile?error=youtube_connect_failed');
  }
});

module.exports = router;

