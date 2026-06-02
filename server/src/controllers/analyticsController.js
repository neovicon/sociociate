const Analytics = require('../models/Analytics');
const Post = require('../models/Post');
const SocialAccount = require('../models/SocialAccount');

exports.getDashboardStats = async (req, res) => {
  try {
    const analytics = await Analytics.find({ user: req.user.id });
    
    let impressions = 0;
    let engagement = 0;
    let linkClicks = 0;

    analytics.forEach(a => {
      impressions += a.metrics.views || 0;
      engagement += (a.metrics.likes || 0) + (a.metrics.comments || 0) + (a.metrics.shares || 0);
      linkClicks += a.metrics.clicks || 0;
    });

    const engagementRate = impressions > 0 ? ((engagement / impressions) * 100).toFixed(1) : 0;
    
    // Total scheduled posts
    const scheduledPostsCount = await Post.countDocuments({ user: req.user.id, status: 'scheduled' });
    
    // Total published posts
    const publishedPostsCount = await Post.countDocuments({ user: req.user.id, status: 'posted' });

    // Mock audience for now, or calculate if we had follower counts in SocialAccount
    const accounts = await SocialAccount.find({ user: req.user.id });
    let totalAudience = 0; // If we had followers, we'd sum them here. 

    res.json({
      impressions,
      engagementRate,
      scheduledPosts: scheduledPostsCount,
      publishedPosts: publishedPostsCount,
      linkClicks,
      totalAudience
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
