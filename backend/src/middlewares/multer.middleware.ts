import multer, { type StorageEngine, type FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs/promises';

const ensureUploadFolder = async (folderPath: string) => {
  try {
    await fs.mkdir(folderPath, { recursive: true });
  } catch (err) {
    console.error('Failed to create upload folder:', err);
    throw err;
  }
};

const UPLOAD_DIR = path.join(__dirname, '../uploads');
const initUploadDir = async () => {
  await ensureUploadFolder(UPLOAD_DIR);
};
initUploadDir();

const sanitizeFilename = (name: string) => name.replace(/[^a-zA-Z0-9.\-_]/g, '_');

const storage: StorageEngine = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename(_req, file, cb) {
    const timestamp = Date.now();
    const safeOriginalName = sanitizeFilename(file.originalname);
    cb(null, `${timestamp}-${safeOriginalName}`);
  },
});

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']; // security enhacment Some hackers upload .jpg that is actually .exe

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image format'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 3,
  },
});

export default upload;
