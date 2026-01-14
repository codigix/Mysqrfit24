import express from 'express';
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import { adminRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTeamMembers);
router.get('/:id', getTeamMemberById);
router.post('/', adminRequired, createTeamMember);
router.put('/:id', adminRequired, updateTeamMember);
router.delete('/:id', adminRequired, deleteTeamMember);

export default router;
