import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getSimilarProperties,
} from '../controllers/propertyController.js';
import { adminRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.get('/:id/similar', getSimilarProperties);
router.post('/', adminRequired, createProperty);
router.put('/:id', adminRequired, updateProperty);
router.delete('/:id', adminRequired, deleteProperty);

export default router;
