import express from 'express';
import {
  getSettings,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting,
} from '../controllers/settingsController.js';
import { adminRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/', adminRequired, getSettings);
router.get('/:key', adminRequired, getSetting);
router.post('/', adminRequired, createSetting);
router.put('/:key', adminRequired, updateSetting);
router.delete('/:key', adminRequired, deleteSetting);

export default router;
