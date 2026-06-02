const Post = require('../models/Post');
const SocialAccount = require('../models/SocialAccount');
const { postToTwitter } = require('../services/social/twitterService');

module.exports = function(agenda) {
  agenda.define('publish_post', async (job) => {
    const { postId } = job.attrs.data;
    
    try {
      const post = await Post.findById(postId);
      if (!post || post.status !== 'scheduled') {
        console.log(`Post ${postId} not found or not in scheduled state.`);
        return;
      }

      console.log(`Starting to publish post: ${postId}`);
      let allSuccess = true;
      const results = [];

      for (const platform of post.platforms) {
        // Find user's active account for this platform
        const account = await SocialAccount.findOne({ user: post.user, platform, isActive: true });
        
        if (!account) {
          console.error(`No active ${platform} account found for user ${post.user}`);
          results.push({ platform, status: 'failed', error: 'No active account found' });
          allSuccess = false;
          continue;
        }

        try {
          let platformPostId;
          
          if (platform === 'twitter') {
            platformPostId = await postToTwitter(account, post.content, post.media);
          } else {
            throw new Error(`Platform ${platform} not yet implemented for publishing`);
          }

          results.push({ platform, status: 'success', postId: platformPostId });
          console.log(`Successfully posted to ${platform} with ID ${platformPostId}`);
        } catch (error) {
          console.error(`Failed to post to ${platform}:`, error);
          results.push({ platform, status: 'failed', error: error.message });
          allSuccess = false;
        }
      }

      post.status = allSuccess ? 'posted' : 'failed';
      post.publishedAt = new Date();
      post.platformResults = results;
      await post.save();

      console.log(`Finished processing post ${postId}. Status: ${post.status}`);
    } catch (err) {
      console.error(`Job execution failed for post ${postId}:`, err);
      throw err;
    }
  });
};
