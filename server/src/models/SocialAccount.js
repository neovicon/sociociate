const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, enum: ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok', 'youtube'], required: true },
  platformId: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  profileName: { type: String },
  profilePicture: { type: String },
  expiresAt: { type: Date },
  active: { type: Boolean, default: true },
  requiresPageSelection: { type: Boolean, default: false },
  pageId: { type: String }
}, { timestamps: true });

// Ensure no duplicate accounts per user per platform
socialAccountSchema.index({ userId: 1, platform: 1, platformId: 1 }, { unique: true });

module.exports = mongoose.model('SocialAccount', socialAccountSchema);
