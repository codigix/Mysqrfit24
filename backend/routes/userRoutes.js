import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { adminRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/', adminRequired, getUsers);
router.get('/:id', adminRequired, getUserById);
router.put('/:id', adminRequired, updateUser);
router.delete('/:id', adminRequired, deleteUser);

export default router;
