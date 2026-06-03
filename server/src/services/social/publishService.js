const SocialAccount = require('../../models/SocialAccount');
const { postToTwitter } = require('./twitterService');
const { postToFacebook } = require('./facebookService');
const { postToInstagram } = require('./instagramService');

/**
 * Publishes content to multiple social platforms
 * @param {String} userId - The ID of the user
 * @param {String} content - The text content
 * @param {Array} media - Media objects
 * @param {Array} platforms - Array of platform names (e.g. ['twitter', 'facebook'])
 * @returns {Object} - { allSuccess: Boolean, results: Array }
 */
const publishToPlatforms = async (userId, content, media, platforms) => {
  let allSuccess = true;
  const results = [];

  for (const platform of platforms) {
    try {
      const account = await SocialAccount.findOne({ userId, platform, active: true });
      if (!account) {
        const errorObj = {
          error: `${platform.toUpperCase()}_ACCOUNT_NOT_FOUND`,
          message: `${platform.charAt(0).toUpperCase() + platform.slice(1)} account is not connected or not active`,
          details: { userId, provider: platform }
        };
        throw new Error(JSON.stringify(errorObj));
      }

      let platformPostId;
      if (platform === 'twitter') {
        platformPostId = await postToTwitter(account, content, media);
      } else if (platform === 'facebook') {
        platformPostId = await postToFacebook(account, content, media);
      } else if (platform === 'instagram') {
        platformPostId = await postToInstagram(account, content, media);
      } else {
        throw new Error(`Platform ${platform} not yet implemented for publishing`);
      }

      results.push({ platform, status: 'success', postId: platformPostId });
      console.log(`Successfully posted to ${platform} with ID ${platformPostId}`);
    } catch (error) {
      console.error(`Failed to post to ${platform}:`, error.message);
      
      let parsedError = error.message;
      try {
        parsedError = JSON.parse(error.message);
      } catch (e) {
        // Not a JSON error, keep as string
      }
      
      results.push({ platform, status: 'failed', error: parsedError });
      allSuccess = false;
    }
  }

  return { allSuccess, results };
};

module.exports = {
  publishToPlatforms
};
