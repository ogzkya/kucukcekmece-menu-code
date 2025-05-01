// backend/utils/optimizeImages.js - Mevcut görselleri optimize etme script'i
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../uploads');

// Desteklenen görsel formatları
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

// Tüm görselleri optimize et
const optimizeAllImages = async () => {
  try {
    console.log('Görsel optimizasyonu başlatılıyor...');
    
    // Uploads klasöründeki tüm dosyaları al
    const files = fs.readdirSync(uploadsDir);
    
    let optimizedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Her dosya için
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const fileExt = path.extname(file).toLowerCase();
      
      // Eğer dosya bir görsel ise
      if (imageExtensions.includes(fileExt) && fs.statSync(filePath).isFile()) {
        try {
          // Optimize edilecek dosyanın bilgilerini al
          const fileStats = fs.statSync(filePath);
          const originalSize = fileStats.size;
          
          // Geçici dosya yolu oluştur
          const tempFilePath = path.join(uploadsDir, `temp-${file}`);
          
          // Görseli optimize et
          await sharp(filePath)
            .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(tempFilePath);
          
          // Optimize edilmiş dosyanın boyutunu kontrol et
          const optimizedStats = fs.statSync(tempFilePath);
          const newSize = optimizedStats.size;
          
          // Dosyayı değiştir
          fs.unlinkSync(filePath);
          fs.renameSync(tempFilePath, filePath);
          
          // Sonuçları yazdır
          const savingsPercent = ((originalSize - newSize) / originalSize * 100).toFixed(2);
          console.log(`✅ ${file}: ${(originalSize / 1024).toFixed(2)} KB -> ${(newSize / 1024).toFixed(2)} KB (${savingsPercent}% tasarruf)`);
          
          optimizedCount++;
        } catch (err) {
          console.error(`❌ ${file} dosyası optimize edilemedi:`, err.message);
          errorCount++;
        }
      } else {
        skippedCount++;
      }
    }
    
    console.log(`\nOptimizasyon tamamlandı:`);
    console.log(`✅ ${optimizedCount} görsel optimize edildi.`);
    console.log(`⏭️ ${skippedCount} dosya atlandı.`);
    console.log(`❌ ${errorCount} görsel işlenirken hata oluştu.`);
    
  } catch (error) {
    console.error('Görsel optimizasyonu sırasında hata oluştu:', error);
  }
};

// Script'i çalıştır
optimizeAllImages();