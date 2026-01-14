import express from 'express';
import {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage,
  getContactStats,
} from '../controllers/contactController.js';
import { adminRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createContactMessage);
router.get('/stats', adminRequired, getContactStats);
router.get('/', adminRequired, getContactMessages);
router.get('/:id', adminRequired, getContactMessageById);
router.put('/:id', adminRequired, updateContactMessage);
router.delete('/:id', adminRequired, deleteContactMessage);

export default router;
