const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPosts,
  getRecentPosts,
  createPost,
  updatePost,
  deletePost,
  generatePost
} = require('../controllers/postController');

router.use(protect);

router.route('/')
  .get(getPosts)
  .post(createPost);

router.get('/recent', getRecentPosts);

router.post('/generate', generatePost);

router.route('/:id')
  .patch(updatePost)
  .delete(deletePost);

module.exports = router;
