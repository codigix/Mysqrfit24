import express from 'express';
import {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/locationController.js';
import { adminRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getLocations);
router.get('/:id', getLocationById);
router.post('/', adminRequired, createLocation);
router.put('/:id', adminRequired, updateLocation);
router.delete('/:id', adminRequired, deleteLocation);

export default router;
