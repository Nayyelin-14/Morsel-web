import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { config } from '../config/env';

// ─── Ensure upload directory exists ──────────────────────────
const uploadDir = path.resolve(config.upload.dir);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ─── Storage: disk — named by userId + timestamp ──────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req: Request, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const userId = (req as any).user?.userId ?? 'unknown';
    const uniqueName = `photo_${userId}_${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// ─── File filter: images only ─────────────────────────────────
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowed.test(ext) && allowed.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
};

// ─── Exported multer instance ─────────────────────────────────
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSizeMb * 1024 * 1024,
  },
});
