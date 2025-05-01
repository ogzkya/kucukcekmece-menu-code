// backend/middleware/uploadMiddleware.js - Görsel optimizasyonu ekleme
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp'; // Sharp kütüphanesi
import fs from 'fs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Yükleme dizini
const uploadDir = path.join(__dirname, '../uploads/');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images only (jpeg, jpg, png, webp)!');
  }
};

// Multer middleware
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Görsel optimizasyon middleware'i
const optimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  
  try {
    const filePath = req.file.path;
    const optimizedFilePath = `${filePath.split('.')[0]}-optimized${path.extname(filePath)}`;
    
    // Görseli optimize et - boyutunu küçült ve kalitesini düşür
    await sharp(filePath)
      .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(optimizedFilePath);
    
    // Orijinal dosyayı sil ve optimize edilmiş dosyayla değiştir
    fs.unlinkSync(filePath);
    fs.renameSync(optimizedFilePath, filePath);
    
    next();
  } catch (error) {
    console.error('Görsel optimizasyon hatası:', error);
    next(error);
  }
};

// Optimize edilmiş upload fonksiyonu
const optimizedUpload = (fieldName) => {
  return [upload.single(fieldName), optimizeImage];
};

export { optimizedUpload };
export default upload;