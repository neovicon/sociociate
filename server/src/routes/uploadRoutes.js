const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadMiddleware, uploadFile } = require('../controllers/uploadController');

router.post('/', protect, uploadMiddleware, uploadFile);

module.exports = router;
