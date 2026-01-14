import express from 'express';
import * as legalController from '../controllers/legalController.js';
import { authenticateToken, adminRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/', legalController.getLegalContent);
router.get('/:id', legalController.getLegalContentById);

router.post('/', adminRequired, legalController.createLegalContent);
router.put('/:id', adminRequired, legalController.updateLegalContent);
router.delete('/:id', adminRequired, legalController.deleteLegalContent);

export default router;
