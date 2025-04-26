// backend/utils/seeder.js - Data seeding script
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';
import connectDB from '../config/db.js';

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// Sample data
// backend/utils/seeder.js - Slug'lar eklenmiş restaurants dizisi
// Önceki restaurants dizisi yerine slug'lı versiyonu

const restaurants = [
    {
      name: 'BELEDİYE YANI SOSYAL TESİSLERİ',
      slug: 'belediye-yani',
      address: 'Küçükçekmece Belediyesi Yanı, İstanbul',
      description: 'Belediye yanında bulunan sosyal tesislerimiz',
      isActive: true,
    },
    {
      name: 'HALKALI SOSYAL TESİSLERİ',
      slug: 'halkali',
      address: 'Halkalı, İstanbul',
      description: 'Halkalı semtindeki sosyal tesislerimiz',
      isActive: true,
    },
    {
      name: 'MACERA SOSYAL TESİSLERİ',
      slug: 'macera',
      address: 'Macera Park, İstanbul',
      description: 'Macera parkı içindeki sosyal tesislerimiz',
      isActive: true,
    },
    {
      name: 'MENEKŞE SOSYAL TESİSLERİ',
      slug: 'menekse',
      address: 'Menekşe Mahallesi, İstanbul',
      description: 'Menekşe mahallesindeki sosyal tesislerimiz',
      isActive: true,
    },
    {
      name: 'SELÇUKLU SOSYAL TESİSLERİ',
      slug: 'selcuklu',
      address: 'Selçuklu Caddesi, İstanbul',
      description: 'Selçuklu caddesindeki sosyal tesislerimiz',
      isActive: true,
    },
    {
      name: 'LAGÜN CAFE & RESTAURANT',
      slug: 'lagun',
      address: 'Küçükçekmece Gölü Kenarı, İstanbul',
      description: 'Küçükçekmece gölü kenarında hizmet veren sosyal tesisimiz',
      isActive: true,
    },
  ];
  
const categories = [
  {
    name: 'Kahvaltılar',
    imageUrl: '/uploads/category-breakfast.jpg',
    orderIndex: 1,
    isActive: true,
  },
  {
    name: 'Ana Yemekler',
    imageUrl: '/uploads/category-main-courses.jpg',
    orderIndex: 2,
    isActive: true,
  },
  {
    name: 'Salatalar',
    imageUrl: '/uploads/category-salads.jpg',
    orderIndex: 3,
    isActive: true,
  },
  {
    name: 'Tatlılar',
    imageUrl: '/uploads/category-desserts.jpg',
    orderIndex: 4,
    isActive: true,
  },
  {
    name: 'Sıcak İçecekler',
    imageUrl: '/uploads/category-hot-drinks.jpg',
    orderIndex: 5,
    isActive: true,
  },
  {
    name: 'Soğuk İçecekler',
    imageUrl: '/uploads/category-cold-drinks.jpg',
    orderIndex: 6,
    isActive: true,
  },
];

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Restaurant.deleteMany();
    await Category.deleteMany();
    await MenuItem.deleteMany();

    console.log('Data cleared...'.red.inverse);

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      isAdmin: true,
    });

    console.log('Admin user created...'.green);

    // Create restaurants
    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log('Restaurants created...'.green);

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories created...'.green);

    // Sample menu items data with references to created categories
    const menuItems = [
      // Kahvaltılar (Breakfast)
      {
        name: 'Serpme Kahvaltı',
        description: 'Zengin içerikli serpme kahvaltı tabağı. 2 kişiliktir.',
        price: 180,
        imageUrl: '/uploads/menu-serpme-kahvalti.jpg',
        weight: '800 g',
        category: createdCategories[0]._id,
        allergens: ['Gluten', 'Süt', 'Yumurta'],
        orderIndex: 1,
        isActive: true,
      },
      {
        name: 'Omlet',
        description: 'Tereyağında pişirilmiş 3 yumurtalı sade omlet',
        price: 45,
        imageUrl: '/uploads/menu-omlet.jpg',
        weight: '250 g',
        category: createdCategories[0]._id,
        allergens: ['Yumurta'],
        orderIndex: 2,
        isActive: true,
      },
      {
        name: 'Menemen',
        description: 'Domates, biber ve yumurta ile hazırlanan geleneksel Türk kahvaltısı',
        price: 55,
        imageUrl: '/uploads/menu-menemen.jpg',
        weight: '300 g',
        category: createdCategories[0]._id,
        allergens: ['Yumurta'],
        orderIndex: 3,
        isActive: true,
      },
      
      // Ana Yemekler (Main Dishes)
      {
        name: 'Izgara Köfte',
        description: 'El yapımı ızgara köfte, yanında pilav ve ızgara sebze ile',
        price: 90,
        imageUrl: '/uploads/menu-kofte.jpg',
        weight: '350 g',
        category: createdCategories[1]._id,
        allergens: ['Gluten', 'Süt'],
        orderIndex: 1,
        isActive: true,
      },
      {
        name: 'Tavuk Şiş',
        description: 'Marine edilmiş tavuk şiş, yanında pilav ve ızgara sebze ile',
        price: 85,
        imageUrl: '/uploads/menu-tavuk-sis.jpg',
        weight: '350 g',
        category: createdCategories[1]._id,
        allergens: [],
        orderIndex: 2,
        isActive: true,
      },
      {
        name: 'Mantı',
        description: 'El yapımı Türk mantısı, yoğurt ve tereyağlı sos ile',
        price: 75,
        imageUrl: '/uploads/menu-manti.jpg',
        weight: '300 g',
        category: createdCategories[1]._id,
        allergens: ['Gluten', 'Süt', 'Yumurta'],
        orderIndex: 3,
        isActive: true,
      },
      
      // Salatalar (Salads)
      {
        name: 'Sezar Salata',
        description: 'Izgara tavuk parçaları, kruton, parmesan peyniri ve özel Sezar sos ile',
        price: 65,
        imageUrl: '/uploads/menu-sezar-salata.jpg',
        weight: '350 g',
        category: createdCategories[2]._id,
        allergens: ['Gluten', 'Süt', 'Yumurta'],
        orderIndex: 1,
        isActive: true,
      },
      {
        name: 'Çoban Salata',
        description: 'Domates, salatalık, biber, soğan ve zeytinyağı ile',
        price: 45,
        imageUrl: '/uploads/menu-coban-salata.jpg',
        weight: '300 g',
        category: createdCategories[2]._id,
        allergens: [],
        orderIndex: 2,
        isActive: true,
      },
      
      // Tatlılar (Desserts)
      {
        name: 'Künefe',
        description: 'Geleneksel şerbetli tel kadayıf tatlısı, dondurma ile servis edilir',
        price: 60,
        imageUrl: '/uploads/menu-kunefe.jpg',
        weight: '200 g',
        category: createdCategories[3]._id,
        allergens: ['Gluten', 'Süt'],
        orderIndex: 1,
        isActive: true,
      },
      {
        name: 'Sütlaç',
        description: 'Geleneksel Türk pirinç pudingi, tarçın ile',
        price: 40,
        imageUrl: '/uploads/menu-sutlac.jpg',
        weight: '200 g',
        category: createdCategories[3]._id,
        allergens: ['Süt'],
        orderIndex: 2,
        isActive: true,
      },
      
      // Sıcak İçecekler (Hot Drinks)
      {
        name: 'Türk Kahvesi',
        description: 'Geleneksel Türk kahvesi, isteğe göre sade, orta veya şekerli',
        price: 25,
        imageUrl: '/uploads/menu-turk-kahvesi.jpg',
        weight: '100 ml',
        category: createdCategories[4]._id,
        allergens: [],
        orderIndex: 1,
        isActive: true,
      },
      {
        name: 'Çay',
        description: 'Demlik çay',
        price: 10,
        imageUrl: '/uploads/menu-cay.jpg',
        weight: '200 ml',
        category: createdCategories[4]._id,
        allergens: [],
        orderIndex: 2,
        isActive: true,
      },
      
      // Soğuk İçecekler (Cold Drinks)
      {
        name: 'Ayran',
        description: 'Geleneksel Türk yoğurt içeceği',
        price: 15,
        imageUrl: '/uploads/menu-ayran.jpg',
        weight: '250 ml',
        category: createdCategories[5]._id,
        allergens: ['Süt'],
        orderIndex: 1,
        isActive: true,
      },
      {
        name: 'Limonata',
        description: 'Ev yapımı taze limonata',
        price: 30,
        imageUrl: '/uploads/menu-limonata.jpg',
        weight: '300 ml',
        category: createdCategories[5]._id,
        allergens: [],
        orderIndex: 2,
        isActive: true,
      },
    ];

    await MenuItem.insertMany(menuItems);
    console.log('Menu items created...'.green);

    console.log('Data imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Restaurant.deleteMany();
    await Category.deleteMany();
    await MenuItem.deleteMany();

    console.log('Data destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Check command line argument for import or destroy
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}