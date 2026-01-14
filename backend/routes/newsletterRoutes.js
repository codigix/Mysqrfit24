import express from 'express';
import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getSubscribers,
  deleteSubscriber,
} from '../controllers/newsletterController.js';
import { adminRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', subscribeToNewsletter);
router.post('/unsubscribe', unsubscribeFromNewsletter);
router.get('/', adminRequired, getSubscribers);
router.delete('/:id', adminRequired, deleteSubscriber);

export default router;
