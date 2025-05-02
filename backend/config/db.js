// backend/config/db.js - Güncellenmiş MongoDB bağlantısı
import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kucukcekmece-menu';
    
    // Mongoose 6+ için yeni bağlantı ayarları
    const options = {
      serverSelectionTimeoutMS: 5000 // Zaman aşımı ayarı
    };
    
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    // İsteğe bağlı - Hata durumunda uygulamayı sonlandırmamak için aşağıdaki satırı kaldırabilirsiniz
    // process.exit(1);
    
    // Alternatif olarak - yeniden bağlanma girişimi eklenebilir
    console.log('Attempting to reconnect to MongoDB in 5 seconds...'.yellow);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;