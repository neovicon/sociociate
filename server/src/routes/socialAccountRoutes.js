const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getConnectedAccounts, disconnectAccount, getFacebookPages, selectFacebookPage } = require('../controllers/socialAccountController');

router.use(protect);

router.get('/', getConnectedAccounts);
router.delete('/:id', disconnectAccount);

// Facebook specific routes
router.get('/facebook/:id/pages', getFacebookPages);
router.put('/facebook/:id/select-page', selectFacebookPage);

module.exports = router;
