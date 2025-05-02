// backend/middleware/uploadMiddleware.js - Görsel optimizasyonu düzeltme
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

// Dizinin var olduğundan emin ol
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Uploads directory created at ${uploadDir}`);
  } catch (err) {
    console.error(`Error creating uploads directory: ${err}`);
  }
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Dosya adındaki boşlukları kaldır ve tarih ekleyerek benzersiz yap
    const fileName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(fileName)}`
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
    const extname = path.extname(filePath).toLowerCase();
    const optimizedFilePath = `${filePath.split('.')[0]}-optimized${extname}`;
    
    // Orijinal uzantıya göre format seç
    let sharpInstance = sharp(filePath)
      .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true });
    
    if (extname === '.jpg' || extname === '.jpeg') {
      sharpInstance = sharpInstance.jpeg({ quality: 80 });
    } else if (extname === '.png') {
      sharpInstance = sharpInstance.png({ quality: 80 });
    } else if (extname === '.webp') {
      sharpInstance = sharpInstance.webp({ quality: 80 });
    } else {
      // Desteklenmeyen formatlar için jpeg kullan
      sharpInstance = sharpInstance.jpeg({ quality: 80 });
    }
    
    await sharpInstance.toFile(optimizedFilePath);
    
    // Orijinal dosyayı sil ve optimize edilmiş dosyayla değiştir
    fs.unlinkSync(filePath);
    fs.renameSync(optimizedFilePath, filePath);
    
    next();
  } catch (error) {
    console.error('Görsel optimizasyon hatası:', error);
    // Hata olsa bile işleme devam et, kritik değil
    next();
  }
};

// Upload tamamlandıktan sonra hata kontrolü
const checkUploadSuccess = (req, res, next) => {
  if (!req.file && req.method === 'POST') {
    // Form isteğinde dosya yoksa, form değerlerini kontrol et
    console.warn('No file uploaded in form request');
    console.log('Form fields:', req.body);
  }
  next();
};

// Optimize edilmiş upload fonksiyonu
const optimizedUpload = (fieldName) => {
  return [
    upload.single(fieldName),
    checkUploadSuccess,
    optimizeImage
  ];
};

export { optimizedUpload };
export default upload;