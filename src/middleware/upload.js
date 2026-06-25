import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');

['profiles', 'documents', 'videos', 'recordings', 'tickets'].forEach((dir) => {
  const p = path.join(uploadDir, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'documents';
    if (file.mimetype.startsWith('image/')) folder = 'profiles';
    if (file.mimetype.startsWith('video/')) folder = 'videos';
    if (file.mimetype.startsWith('audio/')) folder = 'recordings';
    cb(null, path.join(uploadDir, folder));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf|mp4|webm|mp3|wav|m4a/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype) || file.mimetype.includes('pdf');
    cb(null, ext || mime);
  },
});

export const getFileUrl = (filename, folder = 'documents') =>
  `/uploads/${folder}/${filename}`;
