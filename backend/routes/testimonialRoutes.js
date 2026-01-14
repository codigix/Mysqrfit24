import express from 'express';
import {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { adminRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTestimonials);
router.get('/:id', getTestimonialById);
router.post('/', adminRequired, createTestimonial);
router.put('/:id', adminRequired, updateTestimonial);
router.delete('/:id', adminRequired, deleteTestimonial);

export default router;
