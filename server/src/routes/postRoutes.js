const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPosts,
  getRecentPosts,
  createPost,
  updatePostStatus,
  deletePost
} = require('../controllers/postController');

router.use(protect);

router.route('/')
  .get(getPosts)
  .post(createPost);

router.get('/recent', getRecentPosts);

router.route('/:id')
  .patch(updatePostStatus)
  .delete(deletePost);

module.exports = router;
