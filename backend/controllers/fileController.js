import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';
import { ensureUploadDirs } from '../utils/fileUpload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { docsDir, imagesDir } = ensureUploadDirs();
    const userId = req.user.id;
    const file = req.file;

    const originalName = file.originalname;
    const fileId = uuidv4();
    const ext = path.extname(originalName);
    const storedName = `${fileId}${ext}`;

    const isImage = file.mimetype.startsWith('image/');
    const uploadDir = isImage ? imagesDir : docsDir;
    const fileRelPath = isImage ? `uploads/images/${storedName}` : `uploads/documents/${storedName}`;
    const filePath = path.join(uploadDir, storedName);

    fs.writeFileSync(filePath, file.buffer);

    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO files (id, original_filename, stored_filename, file_path, file_size, file_type, mime_type, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [fileId, originalName, storedName, fileRelPath, file.size, ext.slice(1), file.mimetype, userId]
    );
    connection.release();

    res.status(201).json({
      id: fileId,
      filename: originalName,
      storedName,
      fileSize: file.size,
      fileType: ext.slice(1),
      url: `/${fileRelPath}`,
      uploadedAt: new Date(),
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

export const getFiles = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [files] = await connection.query('SELECT * FROM files ORDER BY created_at DESC LIMIT 100');
    connection.release();

    res.json(files);
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const connection = await pool.getConnection();
    
    const [fileRecord] = await connection.query('SELECT * FROM files WHERE id = ?', [fileId]);
    
    if (fileRecord.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'File not found' });
    }

    const file = fileRecord[0];
    const uploadsDir = path.join(__dirname, '../uploads');
    const fullPath = path.join(uploadsDir, file.file_path.replace('uploads/', ''));

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await connection.query('DELETE FROM files WHERE id = ?', [fileId]);
    connection.release();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};
