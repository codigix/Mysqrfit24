import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ensureUploadDirs = () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  const docsDir = path.join(uploadsDir, 'documents');
  const imagesDir = path.join(uploadsDir, 'images');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  return { uploadsDir, docsDir, imagesDir };
};

export const generateFilename = (originalFilename) => {
  const ext = path.extname(originalFilename);
  const name = uuidv4();
  return `${name}${ext}`;
};

export const saveFile = (buffer, uploadDir, filename) => {
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

export const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
};

export const getFileMimeType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.zip': 'application/zip',
  };
  return mimeTypes[ext] || 'application/octet-stream';
};
