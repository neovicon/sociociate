/**
 * Posts content to Facebook using user's OAuth tokens
 * @param {Object} account - The SocialAccount mongoose document
 * @param {String} content - The text content of the post
 * @param {Array} media - Array of media objects
 * @returns {String} - The ID of the published post
 */
const postToFacebook = async (account, content, media) => {
  // 1. Fetch user's pages to get a Page Access Token
  const pagesRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${account.accessToken}`);
  const pagesData = await pagesRes.json();
  
  if (pagesData.error) {
    throw new Error(`Failed to fetch Facebook Pages: ${pagesData.error.message}`);
  }

  if (!pagesData.data || pagesData.data.length === 0) {
    throw new Error('You do not manage any Facebook Pages. Facebook no longer allows apps to post directly to personal profiles. Please create a Facebook Page first.');
  }

  // For simplicity, we use the first page the user manages. 
  // (In a more advanced setup, you'd let the user select which page to connect in the UI).
  const targetPage = pagesData.data[0];
  const pageId = targetPage.id;
  const pageAccessToken = targetPage.access_token;

  // 2. Post to the page's feed using the Page Access Token
  const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;
  const body = {
    message: content,
    access_token: pageAccessToken
  };

  // Note: Handling media would require uploading to /{page_id}/photos or videos.
  // We'll stick to simple feed posts for now. If there's a single image, we could use /{page_id}/photos.
  if (media && media.length > 0 && media[0].type === 'image') {
    body.url = media[0].url; // Attach media url if provided
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  
  if (!response.ok || data.error) {
    console.error('Facebook API Error:', data.error);
    throw new Error(data.error?.message || 'Failed to post to Facebook');
  }
  
  if (!data.id) {
    throw new Error('Facebook API returned success but no post ID');
  }
  
  return data.id;
};

module.exports = {
  postToFacebook
};
