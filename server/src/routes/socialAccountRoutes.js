const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getConnectedAccounts } = require('../controllers/socialAccountController');

router.use(protect);

router.get('/', getConnectedAccounts);

module.exports = router;
