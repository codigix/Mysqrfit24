import express from 'express';
import { createInquiry, getInquiries, deleteInquiry } from '../controllers/chatbotController.js';
import { adminRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/inquiries', createInquiry);
router.get('/inquiries', adminRequired, getInquiries);
router.delete('/inquiries/:id', adminRequired, deleteInquiry);

export default router;
