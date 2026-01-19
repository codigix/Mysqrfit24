import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ensureUploadDirs = () => {
  const uploadsDir = process.env.UPLOADS_PATH || path.join(__dirname, '../uploads');
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
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.svg': 'image/svg+xml',
    '.zip': 'application/zip',
  };
  return mimeTypes[ext] || 'application/octet-stream';
};

export const getFullUrl = (filePath) => {
  if (!filePath) return '';

  // 1. Force cleanup: if the path has "localhost:5000", remove it
  let pathOnly = filePath;
  if (typeof filePath === 'string' && filePath.includes('localhost:5000')) {
    pathOnly = filePath.split('localhost:5000').pop();
  } else if (typeof filePath === 'string' && filePath.startsWith('http')) {
    // If it's already a correct external URL, return it
    return filePath;
  }

  // 2. Determine the Base URL
  // We hardcode your production domain as the primary fallback for VPS
  let baseUrl = process.env.BASE_URL;
  
  if (!baseUrl || baseUrl.includes('localhost')) {
    if (process.env.NODE_ENV === 'production') {
      baseUrl = 'https://mysqft24.codigix.co';
    } else {
      baseUrl = baseUrl || `http://localhost:${process.env.PORT || 5000}`;
    }
  }

  // 3. Clean up slashes
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanFilePath = pathOnly.startsWith('/') ? pathOnly.slice(1) : pathOnly;

  return `${cleanBaseUrl}/${cleanFilePath}`;
};
