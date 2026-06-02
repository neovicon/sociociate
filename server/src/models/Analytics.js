const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  platform: { type: String, enum: ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok', 'youtube'], required: true },
  platformPostId: { type: String },
  metrics: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
  },
  lastSyncedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for querying analytics by post and platform
analyticsSchema.index({ post: 1, platform: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
