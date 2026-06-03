const Post = require('../models/Post');
const OpenAI = require('openai');
const { publishToPlatforms } = require('../services/social/publishService');

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

// Get all posts for a user, with optional status filter
exports.getPosts = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user.id };
    if (status && status !== 'all') {
      filter.status = status;
    }
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recent posts for dashboard
exports.getRecentPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(5);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, platforms, status, scheduledAt, media } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: "Content is required", missingField: "content", stage: "validation" });
    }
    if (!platforms || platforms.length === 0) {
      return res.status(400).json({ error: "At least one platform is required", missingField: "platforms", stage: "validation" });
    }

    const post = new Post({
      user: req.user.id,
      content,
      platforms,
      status: status || 'draft',
      scheduledAt,
      media: media || []
    });

    if (status === 'posted') {
      const { allSuccess, results } = await publishToPlatforms(req.user.id, content, media || [], platforms);
      post.platformResults = results;
      
      if (!allSuccess) {
        post.status = 'failed';
        await post.save();
        
        // Return structured error if it's an ACCOUNT_NOT_FOUND error
        const notFoundError = results.find(r => r.error && r.error.error && r.error.error.endsWith('_ACCOUNT_NOT_FOUND'));
        if (notFoundError) {
          return res.status(400).json(notFoundError.error);
        }

        return res.status(400).json({ 
          error: 'Failed to publish to one or more platforms. Check post details.', 
          stage: 'api',
          results,
          post
        });
      }
      post.publishedAt = new Date();
    }

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0];
      return res.status(400).json({
        error: firstError.message,
        missingField: firstError.path,
        stage: "validation"
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { status, content, platforms, scheduledAt, media } = req.body;
    
    let updateFields = {};
    if (status) updateFields.status = status;
    if (content) updateFields.content = content;
    if (platforms) updateFields.platforms = platforms;
    if (scheduledAt) updateFields.scheduledAt = scheduledAt;
    if (media) updateFields.media = media;
    if (status === 'posted') {
      const postToUpdate = await Post.findOne({ _id: req.params.id, user: req.user.id });
      if (!postToUpdate) return res.status(404).json({ message: 'Post not found' });
      
      const finalContent = content || postToUpdate.content;
      const finalMedia = media || postToUpdate.media;
      const finalPlatforms = platforms || postToUpdate.platforms;
      
      if (!finalContent) {
        return res.status(400).json({ error: "Content is required", missingField: "content", stage: "validation" });
      }
      if (!finalPlatforms || finalPlatforms.length === 0) {
        return res.status(400).json({ error: "At least one platform is required", missingField: "platforms", stage: "validation" });
      }

      const { allSuccess, results } = await publishToPlatforms(req.user.id, finalContent, finalMedia, finalPlatforms);
      updateFields.platformResults = results;
      
      if (!allSuccess) {
        updateFields.status = 'failed';
        const updatedPost = await Post.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, updateFields, { new: true });
        
        const notFoundError = results.find(r => r.error && r.error.error && r.error.error.endsWith('_ACCOUNT_NOT_FOUND'));
        if (notFoundError) {
          return res.status(400).json(notFoundError.error);
        }

        return res.status(400).json({ 
          error: 'Failed to publish to one or more platforms. Check post details.', 
          stage: 'api',
          results,
          post: updatedPost
        });
      }
      updateFields.publishedAt = new Date();
    }

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateFields,
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0];
      return res.status(400).json({
        error: firstError.message,
        missingField: firstError.path,
        stage: "validation"
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate post via OpenAI (NVIDIA)
exports.generatePost = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
      messages: [{"role":"user","content": prompt}],
      temperature: 0.6,
      top_p: 0.95,
      max_tokens: 1024,
      stream: false,
    });
    
    const content = completion.choices[0]?.message?.content || '';
    res.json({ content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error generating post' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
