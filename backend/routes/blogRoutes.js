import express from 'express';
import {
  getBlogPosts,
  getBlogPostById,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../controllers/blogController.js';
import { adminRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBlogPosts);
router.get('/slug/:slug', getBlogPostBySlug);
router.get('/:id', getBlogPostById);
router.post('/', adminRequired, createBlogPost);
router.put('/:id', adminRequired, updateBlogPost);
router.delete('/:id', adminRequired, deleteBlogPost);

export default router;
