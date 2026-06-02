/**
 * Posts content to Instagram using user's OAuth tokens
 * Note: Instagram Basic Display API does not support publishing.
 * This assumes the account is connected via Instagram Graph API.
 * @param {Object} account - The SocialAccount mongoose document
 * @param {String} content - The text content of the post
 * @param {Array} media - Array of media objects
 * @returns {String} - The ID of the published post
 */
const postToInstagram = async (account, content, media) => {
  const igUserId = account.platformId;
  const containerUrl = `https://graph.facebook.com/v18.0/${igUserId}/media`;
  
  // Instagram requires an image or video
  const imageUrl = media && media.length > 0 ? media[0].url : null;
  if (!imageUrl) {
    throw new Error('Instagram requires at least one image or video media attached.');
  }

  const containerBody = {
    image_url: imageUrl,
    caption: content,
    access_token: account.accessToken
  };

  const containerRes = await fetch(containerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(containerBody)
  });
  
  const containerData = await containerRes.json();
  
  if (!containerRes.ok || containerData.error) {
    console.error('Instagram API Container Error:', containerData.error);
    throw new Error(containerData.error?.message || 'Failed to create Instagram media container');
  }

  if (!containerData.id) {
    throw new Error('Failed to get container ID from Instagram API');
  }

  // Publish the container
  const publishUrl = `https://graph.facebook.com/v18.0/${igUserId}/media_publish`;
  const publishBody = {
    creation_id: containerData.id,
    access_token: account.accessToken
  };

  const publishRes = await fetch(publishUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(publishBody)
  });

  const publishData = await publishRes.json();

  if (!publishRes.ok || publishData.error) {
    console.error('Instagram API Publish Error:', publishData.error);
    throw new Error(publishData.error?.message || 'Failed to publish Instagram media');
  }

  return publishData.id;
};

module.exports = {
  postToInstagram
};
