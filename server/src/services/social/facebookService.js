/**
 * Posts content to Facebook using user's OAuth tokens
 * @param {Object} account - The SocialAccount mongoose document
 * @param {String} content - The text content of the post
 * @param {Array} media - Array of media objects
 * @returns {String} - The ID of the published post
 */
const postToFacebook = async (account, content, media) => {
  if (account.requiresPageSelection) {
    throw new Error('Please select a Facebook Page from the dashboard before posting.');
  }

  if (!account.pageId) {
    throw new Error('Facebook account configuration is incomplete. No page ID found.');
  }

  // Use the stored Page Access Token and Page ID
  const pageId = account.pageId;
  const pageAccessToken = account.accessToken;

  // Post to the page's feed using the Page Access Token
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
