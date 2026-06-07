const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getConnectedAccounts, disconnectAccount } = require('../controllers/socialAccountController');

router.use(protect);

router.get('/', getConnectedAccounts);
router.delete('/:id', disconnectAccount);

module.exports = router;
