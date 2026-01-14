import express from 'express';
import multer from 'multer';
import * as fileController from '../controllers/fileController.js';
import { adminRequired } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/zip',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
});

router.post('/upload', adminRequired, upload.single('file'), fileController.uploadFile);
router.get('/', adminRequired, fileController.getFiles);
router.delete('/:fileId', adminRequired, fileController.deleteFile);

export default router;
