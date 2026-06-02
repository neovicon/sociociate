const Post = require('../models/Post');

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
    
    const post = new Post({
      user: req.user.id,
      content,
      platforms,
      status: status || 'draft',
      scheduledAt,
      media: media || []
    });

    if (status === 'posted') {
      post.publishedAt = new Date();
      // In a real app, this is where we would call the social media APIs to publish
    }

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update post status
exports.updatePostStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        status, 
        ...(status === 'posted' ? { publishedAt: new Date() } : {})
      },
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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
