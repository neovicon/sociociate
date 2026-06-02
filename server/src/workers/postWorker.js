const Post = require('../models/Post');
const { publishToPlatforms } = require('../services/social/publishService');

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
      
      const { allSuccess, results } = await publishToPlatforms(
        post.user,
        post.content,
        post.media,
        post.platforms
      );

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
