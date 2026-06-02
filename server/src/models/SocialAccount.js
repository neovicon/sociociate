const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, enum: ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok', 'youtube'], required: true },
  platformId: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  profileName: { type: String },
  profilePicture: { type: String },
  expiresAt: { type: Date },
  status: { type: String, enum: ['active', 'expired', 'disconnected'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('SocialAccount', socialAccountSchema);
