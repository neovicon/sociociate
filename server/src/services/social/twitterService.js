const { TwitterApi } = require('twitter-api-v2');

/**
 * Posts content to Twitter using user's OAuth tokens
 * @param {Object} account - The SocialAccount mongoose document
 * @param {String} content - The text content of the post
 * @param {Array} media - Array of media objects
 * @returns {String} - The ID of the published tweet
 */
const postToTwitter = async (account, content, media) => {
  // In a real scenario, you'd decrypt the accessToken and check if you need to refresh it
  // using refreshToken. For now, assuming accessToken is valid.
  
  const client = new TwitterApi(account.accessToken);

  try {
    // Media upload logic would go here if media array has elements
    // e.g. client.v1.uploadMedia(...)
    
    const tweet = await client.v2.tweet(content);
    return tweet.data.id;
  } catch (error) {
    console.error('Twitter API Error:', error);
    throw new Error(error.message || 'Failed to post to Twitter');
  }
};

module.exports = {
  postToTwitter
};
