const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  media: [{
    url: String,
    type: { type: String, enum: ['image', 'video'] },
    public_id: String
  }],
  platforms: [{ type: String, enum: ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok', 'youtube'] }],
  status: { type: String, enum: ['draft', 'scheduled', 'posted', 'failed'], default: 'posted' },
  scheduledAt: { type: Date },
  publishedAt: { type: Date },
  platformResults: [{
    platform: String,
    status: String,
    postId: String,
    error: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
