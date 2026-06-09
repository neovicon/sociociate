/**
 * Posts content to LinkedIn using user's OAuth tokens
 * @param {Object} account - The SocialAccount mongoose document
 * @param {String} content - The text content of the post
 * @param {Array} media - Array of media objects
 * @returns {String} - The ID of the published post
 */
const postToLinkedIn = async (account, content, media) => {
  // LinkedIn modern share endpoint (Version 202306 or standard /posts)
  // Author is the person's URN: urn:li:person:<platformId>
  const urn = account.platformId.startsWith('urn:li:') 
    ? account.platformId 
    : `urn:li:person:${account.platformId}`;

  const url = 'https://api.linkedin.com/v2/posts';
  
  const body = {
    author: urn,
    commentary: content,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: []
    },
    lifecycleState: 'PUBLISHED'
  };

  // If there's an image, attach it as content metadata
  if (media && media.length > 0) {
    const firstMedia = media[0];
    body.content = {
      media: {
        title: 'Shared Media',
        id: firstMedia.url // In a real API we would register and upload assets, but we pass URL here.
      }
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${account.accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0'
    },
    body: JSON.stringify(body)
  });

  // LinkedIn returns 201 Created on success with x-linkedin-id header
  if (!response.ok && response.status !== 201) {
    const errorText = await response.text();
    let errorObj;
    try {
      errorObj = JSON.parse(errorText);
    } catch (e) {}

    console.error('LinkedIn API Error:', errorObj || errorText);
    throw new Error(errorObj?.message || errorObj?.error_description || `LinkedIn API error (Status ${response.status})`);
  }

  const postIdHeader = response.headers.get('x-linkedin-id') || 'linkedin-post-success';
  return postIdHeader;
};

module.exports = {
  postToLinkedIn
};
