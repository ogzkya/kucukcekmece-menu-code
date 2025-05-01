// backend/models/Restaurant.js - Tesis tipleri eklendi
import mongoose from 'mongoose';
import { FACILITY_TYPES } from './constants.js';

// Tesis türleri için sabit değerler
export const FACILITY_TYPES = {
  SOCIAL: 'social',      // Sosyal Tesis
  RETIREMENT: 'retirement' // Emekliler Cafesi
};

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    facilityType: {
      type: String,
      enum: Object.values(FACILITY_TYPES),
      default: FACILITY_TYPES.SOCIAL,
      required: true
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Slug oluşturma fonksiyonu - ismi slug'a dönüştürür
restaurantSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    return next();
  }
  
  // Eğer slug manuel olarak ayarlanmamışsa, isimden oluştur
  if (!this.slug) {
    // Türkçe karakterleri değiştir
    let slug = this.name.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/Ğ/g, 'G')
      .replace(/Ü/g, 'U')
      .replace(/Ş/g, 'S')
      .replace(/İ/g, 'I')
      .replace(/Ö/g, 'O')
      .replace(/Ç/g, 'C');
    
    // Boşlukları ve özel karakterleri tire ile değiştir
    slug = slug.replace(/\s+/g, '-')           // Boşlukları tire ile değiştir
              .replace(/[^\w\-]+/g, '')        // Alfanümerik olmayan karakterleri kaldır
              .replace(/\-\-+/g, '-')          // Birden fazla tireyi tek tire yap
              .replace(/^-+/, '')              // Baştaki tireleri kaldır
              .replace(/-+$/, '');             // Sondaki tireleri kaldır
    
    this.slug = slug;
  }
  
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;