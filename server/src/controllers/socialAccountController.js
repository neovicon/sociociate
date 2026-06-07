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

exports.disconnectAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const deleted = await SocialAccount.findOneAndDelete({ _id: accountId, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Account not found or already disconnected' });
    }
    res.json({ message: 'Account disconnected successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
