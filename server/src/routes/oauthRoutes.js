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
    res.redirect(process.env.FRONTEND_URL + '/dashboard?connected=twitter');
  } catch (error) {
    console.error('Error handling Twitter callback:', error);
    res.redirect(process.env.FRONTEND_URL + '/dashboard?error=twitter_connect_failed');
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

  const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=public_profile,pages_manage_posts,pages_read_engagement,pages_show_list`;
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

    const pagesRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`);
    const pagesData = await pagesRes.json();
    
    if (pagesData.error) throw new Error(pagesData.error.message);
    
    let requiresPageSelection = false;
    let pageId = null;
    let accountAccessToken = tokenData.access_token; // default to user token
    let profileName = profileData.name;

    if (pagesData.data && pagesData.data.length === 1) {
      pageId = pagesData.data[0].id;
      accountAccessToken = pagesData.data[0].access_token;
      profileName = pagesData.data[0].name;
    } else {
      requiresPageSelection = true;
      profileName = "Pending Page Selection";
    }

    await SocialAccount.findOneAndUpdate(
      { userId: userId, platform: 'facebook', platformId: profileData.id },
      {
        profileName,
        accessToken: accountAccessToken,
        expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
        active: true,
        requiresPageSelection,
        pageId
      },
      { upsert: true, new: true }
    );
    
    if (requiresPageSelection) {
      res.redirect(process.env.FRONTEND_URL + '/dashboard?connected=facebook&select_facebook_page=true');
    } else {
      res.redirect(process.env.FRONTEND_URL + '/dashboard?connected=facebook');
    }
  } catch (error) {
    console.error('Facebook OAuth Error:', error);
    res.redirect(process.env.FRONTEND_URL + '/dashboard?error=facebook_connect_failed');
  }
});

// ==========================================
// INSTAGRAM OAUTH (Via Facebook Graph API for Publishing)
// ==========================================
router.get('/instagram/connect', auth, (req, res) => {
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const redirectUri = getCallbackUrl('instagram');
  const state = req.user.id;

  if (!clientId) return res.status(500).json({ error: 'Facebook API not configured' });

  const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=public_profile,pages_show_list,instagram_basic,instagram_content_publish`;
  res.json({ url });
});

router.get('/instagram/callback', async (req, res) => {
  const { code, state: userId } = req.query;
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
  const redirectUri = getCallbackUrl('instagram');

  try {
    const tokenRes = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`);
    const tokenData = await tokenRes.json();
    if (tokenData.error) throw new Error(tokenData.error.message);

    const userAccessToken = tokenData.access_token;

    // Fetch user's pages and their linked Instagram Business Accounts
    const pagesRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&access_token=${userAccessToken}`);
    const pagesData = await pagesRes.json();
    
    if (pagesData.error) throw new Error(pagesData.error.message);
    
    let igAccounts = [];
    if (pagesData.data) {
       for (const page of pagesData.data) {
         if (page.instagram_business_account) {
           igAccounts.push({
             pageId: page.id,
             pageName: page.name,
             pageAccessToken: page.access_token,
             igId: page.instagram_business_account.id,
             igUsername: page.instagram_business_account.username
           });
         }
       }
    }

    if (igAccounts.length === 0) {
      // No linked Instagram account found
      return res.redirect(process.env.FRONTEND_URL + '/dashboard?error=no_linked_instagram_found');
    }

    // Default to the first linked Instagram account
    const selectedIg = igAccounts[0];

    await SocialAccount.findOneAndUpdate(
      { userId: userId, platform: 'instagram', platformId: selectedIg.igId },
      {
        profileName: selectedIg.igUsername,
        accessToken: selectedIg.pageAccessToken, // Page access token is required for IG publishing
        expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
        active: true,
        pageId: selectedIg.pageId
      },
      { upsert: true, new: true }
    );
    
    res.redirect(process.env.FRONTEND_URL + '/dashboard?connected=instagram');
  } catch (error) {
    console.error('Instagram (via FB) OAuth Error:', error);
    res.redirect(process.env.FRONTEND_URL + '/dashboard?error=instagram_connect_failed');
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
    res.redirect(process.env.FRONTEND_URL + '/dashboard?connected=tiktok');
  } catch (error) {
    console.error('TikTok OAuth Error:', error);
    res.redirect(process.env.FRONTEND_URL + '/dashboard?error=tiktok_connect_failed');
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
    res.redirect(process.env.FRONTEND_URL + '/dashboard?connected=youtube');
  } catch (error) {
    console.error('YouTube OAuth Error:', error);
    res.redirect(process.env.FRONTEND_URL + '/dashboard?error=youtube_connect_failed');
  }
});

// ==========================================
// LINKEDIN OAUTH
// ==========================================
router.get('/linkedin/connect', auth, (req, res) => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = getCallbackUrl('linkedin');
  const state = req.user.id;

  if (!clientId) return res.status(500).json({ error: 'LinkedIn API not configured' });

  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=openid%20profile%20w_member_social%20email`;
  res.json({ url });
});

router.get('/linkedin/callback', async (req, res) => {
  const { code, state: userId } = req.query;
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = getCallbackUrl('linkedin');

  try {
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
      })
    });
    const tokenData = await tokenRes.json();
    if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);

    // Fetch user profile info
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const profileData = await profileRes.json();

    await SocialAccount.findOneAndUpdate(
      { userId: userId, platform: 'linkedin', platformId: profileData.sub },
      {
        profileName: profileData.name || `${profileData.given_name} ${profileData.family_name}`,
        profilePicture: profileData.picture,
        accessToken: tokenData.access_token,
        expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
        active: true
      },
      { upsert: true, new: true }
    );
    res.redirect(process.env.FRONTEND_URL + '/dashboard?connected=linkedin');
  } catch (error) {
    console.error('LinkedIn OAuth Error:', error);
    res.redirect(process.env.FRONTEND_URL + '/dashboard?error=linkedin_connect_failed');
  }
});

module.exports = router;

