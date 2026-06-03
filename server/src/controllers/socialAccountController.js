const SocialAccount = require('../models/SocialAccount');

exports.getConnectedAccounts = async (req, res) => {
  try {
    const accounts = await SocialAccount.find({ userId: req.user.id });
    res.json(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
