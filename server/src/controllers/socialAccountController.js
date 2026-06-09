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

exports.getFacebookPages = async (req, res) => {
  try {
    const account = await SocialAccount.findOne({ _id: req.params.id, userId: req.user.id, platform: 'facebook' });
    if (!account) return res.status(404).json({ message: 'Facebook account not found' });

    const pagesRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${account.accessToken}`);
    const pagesData = await pagesRes.json();

    if (pagesData.error) return res.status(400).json({ message: pagesData.error.message });

    res.json(pagesData.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching pages' });
  }
};

exports.selectFacebookPage = async (req, res) => {
  try {
    const { pageId, pageAccessToken, pageName } = req.body;
    if (!pageId || !pageAccessToken || !pageName) {
      return res.status(400).json({ message: 'Missing required page data' });
    }

    const account = await SocialAccount.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id, platform: 'facebook' },
      {
        pageId,
        accessToken: pageAccessToken,
        profileName: pageName,
        requiresPageSelection: false
      },
      { new: true }
    );

    if (!account) return res.status(404).json({ message: 'Facebook account not found' });
    
    res.json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error saving selected page' });
  }
};
