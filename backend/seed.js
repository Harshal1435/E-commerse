const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const categoryData = [
  { name: 'Electronics',      description: 'Phones, laptops, gadgets and more' },
  { name: 'Fashion',          description: 'Clothing, shoes and accessories' },
  { name: 'Home & Kitchen',   description: 'Furniture, appliances and decor' },
  { name: 'Books',            description: 'Fiction, non-fiction, textbooks' },
  { name: 'Sports & Fitness', description: 'Equipment, clothing and accessories' },
  { name: 'Beauty & Health',  description: 'Skincare, makeup and wellness' },
  { name: 'Toys & Games',     description: 'For kids and adults' },
  { name: 'Automotive',       description: 'Car accessories and tools' },
];

const userData = [
  { name: 'Admin User',     email: 'admin@shopzone.com',   password: 'admin123',  role: 'admin',  isApproved: true },
  { name: 'TechMart India', email: 'vendor1@shopzone.com', password: 'vendor123', role: 'vendor', isApproved: true,  phone: '9876543210' },
  { name: 'FashionHub',     email: 'vendor2@shopzone.com', password: 'vendor123', role: 'vendor', isApproved: true,  phone: '9876543211' },
  { name: 'HomeEssentials', email: 'vendor3@shopzone.com', password: 'vendor123', role: 'vendor', isApproved: true,  phone: '9876543212' },
  { name: 'BookWorld',      email: 'vendor4@shopzone.com', password: 'vendor123', role: 'vendor', isApproved: true,  phone: '9876543213' },
  { name: 'SportZone',      email: 'vendor5@shopzone.com', password: 'vendor123', role: 'vendor', isApproved: false, phone: '9876543214' },
  { name: 'Rahul Sharma',   email: 'user1@shopzone.com',   password: 'user123',   role: 'user',   isApproved: true,  phone: '9123456781', address: { street: '12 MG Road',    city: 'Mumbai',    state: 'Maharashtra', pincode: '400001' } },
  { name: 'Priya Patel',    email: 'user2@shopzone.com',   password: 'user123',   role: 'user',   isApproved: true,  phone: '9123456782', address: { street: '45 Brigade Rd', city: 'Bangalore', state: 'Karnataka',   pincode: '560001' } },
  { name: 'Amit Kumar',     email: 'user3@shopzone.com',   password: 'user123',   role: 'user',   isApproved: true,  phone: '9123456783', address: { street: '7 Park Street', city: 'Kolkata',   state: 'West Bengal', pincode: '700016' } },
];

function makeProducts(cats, vendors) {
  const c = (name) => cats.find(x => x.name === name)._id;
  const v = (i) => vendors[i]._id;

  return [
    // ── ELECTRONICS ──
    {
      name: 'iPhone 15 Pro Max 256GB',
      description: 'Apple iPhone 15 Pro Max with A17 Pro chip, 48MP main camera with 5x optical zoom, titanium design, Action Button, USB-C with USB 3 speeds. Available in Natural Titanium, Blue Titanium, White Titanium, and Black Titanium.',
      price: 134900, originalPrice: 159900, category: c('Electronics'), vendor: v(0), stock: 1,
      brand: 'Apple', tags: ['iphone','apple','5g','smartphone'],
      ratings: 4.8, numReviews: 3,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Samsung Galaxy S24 Ultra with Snapdragon 8 Gen 3, 200MP quad camera, built-in S Pen, 6.8-inch Dynamic AMOLED 2X display, 5000mAh battery with 45W fast charging.',
      price: 124999, originalPrice: 134999, category: c('Electronics'), vendor: v(0), stock: 18,
      brand: 'Samsung', tags: ['samsung','android','spen','5g'],
      ratings: 4.6, numReviews: 2,
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'MacBook Air 15" M3 Chip',
      description: 'Supercharged by M3 chip. 15.3-inch Liquid Retina display, up to 18 hours battery life, 16GB unified memory, 512GB SSD. Fanless design, MagSafe charging, two Thunderbolt ports.',
      price: 149900, originalPrice: 164900, category: c('Electronics'), vendor: v(0), stock: 12,
      brand: 'Apple', tags: ['macbook','laptop','apple','m3'],
      ratings: 4.9, numReviews: 2,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'Sony WH-1000XM5 Headphones',
      description: 'Industry-leading noise cancelling with Auto NC Optimizer. 30-hour battery life, multipoint connection, speak-to-chat technology. Foldable design with premium carrying case.',
      price: 24990, originalPrice: 34990, category: c('Electronics'), vendor: v(0), stock: 45,
      brand: 'Sony', tags: ['headphones','anc','wireless','sony'],
      ratings: 4.7, numReviews: 2,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'OnePlus 12 5G 256GB',
      description: 'Snapdragon 8 Gen 3, 50MP Hasselblad triple camera, 100W SUPERVOOC charging, 5400mAh battery, 6.82-inch 2K ProXDR display with 120Hz refresh rate.',
      price: 64999, originalPrice: 69999, category: c('Electronics'), vendor: v(0), stock: 30,
      brand: 'OnePlus', tags: ['oneplus','5g','android','fast-charging'],
      ratings: 4.5, numReviews: 1,
      image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'iPad Pro 12.9" M2 WiFi 256GB',
      description: 'Apple M2 chip, Liquid Retina XDR display with ProMotion, 12MP Wide + 10MP Ultra Wide cameras, LiDAR Scanner, Thunderbolt port, Wi-Fi 6E, all-day battery life.',
      price: 112900, originalPrice: 124900, category: c('Electronics'), vendor: v(0), stock: 15,
      brand: 'Apple', tags: ['ipad','tablet','apple','m2'],
      ratings: 4.7, numReviews: 1,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'Dell XPS 15 Laptop i7 RTX 4060',
      description: 'Intel Core i7-13700H, NVIDIA RTX 4060 8GB, 16GB DDR5 RAM, 512GB NVMe SSD, 15.6-inch OLED 3.5K display, Windows 11 Home. Perfect for creators and professionals.',
      price: 149990, originalPrice: 169990, category: c('Electronics'), vendor: v(0), stock: 8,
      brand: 'Dell', tags: ['laptop','dell','gaming','rtx'],
      ratings: 4.6, numReviews: 1,
      image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'boAt Airdopes 141 TWS Earbuds',
      description: 'True wireless earbuds with 42H total playback, BEAST Mode for low latency gaming, IPX4 water resistance, instant voice assistant, and ENx technology for clear calls.',
      price: 1299, originalPrice: 4490, category: c('Electronics'), vendor: v(0), stock: 200,
      brand: 'boAt', tags: ['earbuds','tws','wireless','boat'],
      ratings: 4.2, numReviews: 2,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
      ],
    },

    // ── FASHION ──
    {
      name: "Levi's 511 Slim Fit Jeans",
      description: "Levi's 511 slim fit jeans in stretch denim. Sits below waist, slim through thigh and leg opening. 98% cotton, 2% elastane. Available in multiple washes.",
      price: 2499, originalPrice: 3999, category: c('Fashion'), vendor: v(1), stock: 150,
      brand: "Levi's", tags: ['jeans','men','denim','slim'],
      ratings: 4.3, numReviews: 2,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'Nike Air Max 270 Running Shoes',
      description: "Nike Air Max 270 features Nike's biggest heel Air unit yet for a super-soft ride. Lightweight mesh upper with foam midsole. Available in multiple colorways.",
      price: 9995, originalPrice: 12995, category: c('Fashion'), vendor: v(1), stock: 75,
      brand: 'Nike', tags: ['shoes','nike','running','airmax'],
      ratings: 4.6, numReviews: 2,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop',
      ],
    },
    {
      name: "Women's Floral Anarkali Kurti",
      description: 'Beautiful floral print Anarkali kurti in pure cotton. Perfect for casual and festive occasions. Features 3/4 sleeves, round neck, and side slits for comfort.',
      price: 899, originalPrice: 1799, category: c('Fashion'), vendor: v(1), stock: 200,
      brand: 'Biba', tags: ['kurti','women','ethnic','cotton'],
      ratings: 4.4, numReviews: 2,
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'Ray-Ban Aviator Classic Sunglasses',
      description: 'Iconic Ray-Ban Aviator with gold metal frame and classic G-15 green lenses. UV400 protection, spring hinges, adjustable nose pads. Includes case and cleaning cloth.',
      price: 6490, originalPrice: 8490, category: c('Fashion'), vendor: v(1), stock: 60,
      brand: 'Ray-Ban', tags: ['sunglasses','rayban','aviator','uv'],
      ratings: 4.5, numReviews: 1,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'Fossil Gen 6 Smartwatch',
      description: 'Wear OS by Google smartwatch with Snapdragon Wear 4100+ processor, heart rate monitoring, SpO2 tracking, GPS, NFC payments, 1.28-inch AMOLED display.',
      price: 19995, originalPrice: 24995, category: c('Fashion'), vendor: v(1), stock: 35,
      brand: 'Fossil', tags: ['smartwatch','fossil','wearos','nfc'],
      ratings: 4.3, numReviews: 1,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
      ],
    },

    // ── HOME & KITCHEN ──
    {
      name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker 6L',
      description: '7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, saute pan, yogurt maker and warmer. 6 quart capacity, 13 built-in smart programs.',
      price: 8999, originalPrice: 12999, category: c('Home & Kitchen'), vendor: v(2), stock: 40,
      brand: 'Instant Pot', tags: ['cooker','kitchen','pressure','instant-pot'],
      ratings: 4.7, numReviews: 2,
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'Philips Air Fryer HD9200 4.1L',
      description: 'Rapid Air Technology for up to 90% less fat. 4.1L capacity, 1400W, digital touchscreen, 7 preset programs, dishwasher-safe parts. Cook crispy food with little to no oil.',
      price: 7995, originalPrice: 11995, category: c('Home & Kitchen'), vendor: v(2), stock: 55,
      brand: 'Philips', tags: ['airfryer','philips','kitchen','healthy'],
      ratings: 4.5, numReviews: 2,
      image: 'https://images.unsplash.com/photo-1648146956409-a5e7e5e5e5e5?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1648146956409-a5e7e5e5e5e5?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'Dyson V15 Detect Cordless Vacuum',
      description: 'Laser Detect technology reveals microscopic dust. Piezo sensor counts and sizes particles in real time. Up to 60 minutes run time, HEPA filtration, LCD screen.',
      price: 52900, originalPrice: 62900, category: c('Home & Kitchen'), vendor: v(2), stock: 18,
      brand: 'Dyson', tags: ['vacuum','dyson','cordless','hepa'],
      ratings: 4.8, numReviews: 1,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'Wipro 9W LED Smart Bulb Pack of 4',
      description: 'WiFi enabled smart LED bulbs, 16 million colors, works with Alexa and Google Home. 9W = 60W equivalent, 800 lumens, 25000 hours lifespan. No hub required.',
      price: 1799, originalPrice: 2799, category: c('Home & Kitchen'), vendor: v(2), stock: 300,
      brand: 'Wipro', tags: ['bulb','smart','led','wifi'],
      ratings: 4.2, numReviews: 1,
      image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop',
      ],
    },

    // ── BOOKS ──
    {
      name: 'Atomic Habits by James Clear',
      description: "The #1 New York Times bestseller. James Clear reveals how tiny changes in behavior can lead to remarkable results. Learn how to build good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
      price: 399, originalPrice: 699, category: c('Books'), vendor: v(3), stock: 500,
      brand: 'Penguin', tags: ['self-help','habits','bestseller','productivity'],
      ratings: 4.9, numReviews: 3,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'Rich Dad Poor Dad by Robert Kiyosaki',
      description: "Robert Kiyosaki's personal finance classic. What the rich teach their kids about money that the poor and middle class do not. The #1 personal finance book of all time.",
      price: 349, originalPrice: 595, category: c('Books'), vendor: v(3), stock: 400,
      brand: 'Plata Publishing', tags: ['finance','investing','money','bestseller'],
      ratings: 4.7, numReviews: 2,
      image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'The Psychology of Money by Morgan Housel',
      description: 'Timeless lessons on wealth, greed, and happiness. 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of one of life\'s most important topics.',
      price: 299, originalPrice: 499, category: c('Books'), vendor: v(3), stock: 350,
      brand: 'Jaico Publishing', tags: ['finance','psychology','money','investing'],
      ratings: 4.8, numReviews: 2,
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=400&fit=crop',
      ],
    },

    // ── SPORTS & FITNESS ──
    {
      name: 'Boldfit Yoga Mat 6mm Anti-Slip',
      description: 'Premium TPE yoga mat with alignment lines, 6mm thickness for joint support, non-slip surface on both sides, moisture resistant, includes carrying strap. 183cm x 61cm.',
      price: 799, originalPrice: 1999, category: c('Sports & Fitness'), vendor: v(0), stock: 200,
      brand: 'Boldfit', tags: ['yoga','mat','fitness','exercise'],
      ratings: 4.4, numReviews: 2,
      image: 'https://images.unsplash.com/photo-1601925228008-f5e4c5e5e5e5?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1601925228008-f5e4c5e5e5e5?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'Bowflex SelectTech 552 Adjustable Dumbbells',
      description: 'Replaces 15 sets of weights. Adjusts from 5 to 52.5 lbs in 2.5 lb increments. Innovative dial system, durable molding around metal plates, 2-year warranty.',
      price: 24999, originalPrice: 32999, category: c('Sports & Fitness'), vendor: v(0), stock: 25,
      brand: 'Bowflex', tags: ['dumbbells','gym','weights','adjustable'],
      ratings: 4.6, numReviews: 1,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'Decathlon Kiprun KS500 Running Shoes',
      description: 'Designed for regular runners covering 30-60km/week. Cushioned midsole with FOAM LIGHT technology, breathable mesh upper, rubber outsole for grip on all surfaces.',
      price: 3999, originalPrice: 5999, category: c('Sports & Fitness'), vendor: v(0), stock: 80,
      brand: 'Decathlon', tags: ['shoes','running','decathlon','sports'],
      ratings: 4.3, numReviews: 1,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      ],
    },

    // ── BEAUTY & HEALTH ──
    {
      name: 'Minimalist 10% Niacinamide Face Serum 30ml',
      description: 'High-strength niacinamide serum that visibly reduces pores, controls excess sebum, and improves uneven skin tone. Suitable for all skin types. Fragrance-free, paraben-free.',
      price: 599, originalPrice: 799, category: c('Beauty & Health'), vendor: v(1), stock: 300,
      brand: 'Minimalist', tags: ['serum','niacinamide','skincare','face'],
      ratings: 4.5, numReviews: 2,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'Oral-B Pro 3000 Electric Toothbrush',
      description: '3D cleaning action removes up to 100% more plaque vs manual brush. Pressure sensor protects gums, 3 cleaning modes, 2-minute timer, compatible with all Oral-B brush heads.',
      price: 2999, originalPrice: 4499, category: c('Beauty & Health'), vendor: v(1), stock: 90,
      brand: 'Oral-B', tags: ['toothbrush','electric','oral-b','dental'],
      ratings: 4.4, numReviews: 1,
      image: 'https://images.unsplash.com/photo-1559591937-abc3e3e5e5e5?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1559591937-abc3e3e5e5e5?w=400&h=400&fit=crop',
      ],
    },

    // ── TOYS & GAMES ──
    {
      name: 'LEGO Technic Bugatti Chiron 42083',
      description: 'Build the iconic Bugatti Chiron in 1:8 scale with 3599 pieces. Features working 8-speed gearbox, W16 engine with moving pistons, rear spoiler, and detailed interior.',
      price: 29999, originalPrice: 34999, category: c('Toys & Games'), vendor: v(2), stock: 20,
      brand: 'LEGO', tags: ['lego','technic','bugatti','car'],
      ratings: 4.9, numReviews: 1,
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'UNO Classic Card Game',
      description: 'The classic card game of matching colors and numbers. 112 cards, 2-10 players, ages 7+. Includes Wild, Draw Two, Skip, and Reverse cards. Perfect for family game nights.',
      price: 299, originalPrice: 499, category: c('Toys & Games'), vendor: v(2), stock: 500,
      brand: 'Mattel', tags: ['uno','cards','family','game'],
      ratings: 4.6, numReviews: 2,
      image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400&h=400&fit=crop',
      ],
    },

    // ── AUTOMOTIVE ──
    {
      name: 'Vantrue E1 Lite 4K Dash Cam',
      description: '4K UHD front dash cam with Sony STARVIS 2 sensor, 170-degree wide angle, built-in GPS, WiFi, 24-hour parking mode, loop recording, G-sensor, supports 256GB max.',
      price: 8999, originalPrice: 12999, category: c('Automotive'), vendor: v(0), stock: 50,
      brand: 'Vantrue', tags: ['dashcam','4k','gps','wifi'],
      ratings: 4.5, numReviews: 1,
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=400&fit=crop',
      ],
    },
    {
      name: 'Michelin Tyre Inflator Portable 150 PSI',
      description: 'Digital portable tyre inflator with auto shut-off at preset pressure, LED light, 12V DC power, 3 nozzle adapters for cars, bikes, and sports equipment. 150 PSI max.',
      price: 2499, originalPrice: 3999, category: c('Automotive'), vendor: v(0), stock: 100,
      brand: 'Michelin', tags: ['tyre','inflator','portable','car'],
      ratings: 4.3, numReviews: 1,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      ],
    },
  ];
}

function trackingSteps(upToIndex) {
  const steps = [
    { status: 'Order Placed',      description: 'Your order has been placed successfully' },
    { status: 'Payment Confirmed', description: 'Payment has been confirmed' },
    { status: 'Processing',        description: 'Your order is being processed' },
    { status: 'Packed',            description: 'Your order has been packed' },
    { status: 'Shipped',           description: 'Your order has been shipped' },
    { status: 'Out for Delivery',  description: 'Your order is out for delivery' },
    { status: 'Delivered',         description: 'Your order has been delivered' },
  ];
  return steps.map((s, i) => ({
    ...s,
    isCompleted: i <= upToIndex,
    timestamp: i <= upToIndex ? new Date(Date.now() - (upToIndex - i) * 86400000) : undefined,
  }));
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}), Category.deleteMany({}),
      Product.deleteMany({}), Order.deleteMany({}), Cart.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    const categories = [];
    for (const cat of categoryData) {
      categories.push(await Category.create(cat));
    }
    console.log(`Created ${categories.length} categories`);

    const users = [];
    for (const u of userData) users.push(await User.create(u));
    console.log(`Created ${users.length} users`);

    const vendors   = users.filter(u => u.role === 'vendor');
    const customers = users.filter(u => u.role === 'user');

    const productDefs = makeProducts(categories, vendors);
    const products = [];
    for (const p of productDefs) {
      const reviews = customers.slice(0, p.numReviews || 0).map((c, i) => ({
        user: c._id, name: c.name,
        rating: Math.min(5, Math.round(p.ratings) + (i % 2 === 0 ? 0 : -1)),
        comment: ['Great product! Highly recommend.', 'Good value for money.', 'Excellent quality, fast delivery.'][i % 3],
      }));
      products.push(await Product.create({ ...p, reviews, numReviews: reviews.length }));
    }
    console.log(`Created ${products.length} products`);

    // Sample orders
    const orderScenarios = [
      {
        user: customers[0]._id,
        items: [
          { product: products[0]._id, vendor: products[0].vendor, name: products[0].name, image: products[0].image, price: products[0].price, quantity: 1 },
          { product: products[3]._id, vendor: products[3].vendor, name: products[3].name, image: products[3].image, price: products[3].price, quantity: 1 },
        ],
        totalAmount: products[0].price + products[3].price,
        paymentMethod: 'razorpay', paymentStatus: 'paid', orderStatus: 'Delivered',
        trackingSteps: trackingSteps(6),
        deliveryAddress: { name: 'Rahul Sharma', phone: '9123456781', street: '12 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
        estimatedDeliveryDate: new Date(Date.now() - 2 * 86400000),
      },
      {
        user: customers[0]._id,
        items: [{ product: products[2]._id, vendor: products[2].vendor, name: products[2].name, image: products[2].image, price: products[2].price, quantity: 1 }],
        totalAmount: products[2].price,
        paymentMethod: 'razorpay', paymentStatus: 'paid', orderStatus: 'Shipped',
        trackingSteps: trackingSteps(4),
        deliveryAddress: { name: 'Rahul Sharma', phone: '9123456781', street: '12 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
        estimatedDeliveryDate: new Date(Date.now() + 2 * 86400000),
      },
      {
        user: customers[1]._id,
        items: [
          { product: products[8]._id, vendor: products[8].vendor, name: products[8].name, image: products[8].image, price: products[8].price, quantity: 2 },
          { product: products[10]._id, vendor: products[10].vendor, name: products[10].name, image: products[10].image, price: products[10].price, quantity: 1 },
        ],
        totalAmount: products[8].price * 2 + products[10].price,
        paymentMethod: 'COD', paymentStatus: 'pending', orderStatus: 'Processing',
        trackingSteps: trackingSteps(2),
        deliveryAddress: { name: 'Priya Patel', phone: '9123456782', street: '45 Brigade Rd', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
        estimatedDeliveryDate: new Date(Date.now() + 4 * 86400000),
      },
    ];

    for (const o of orderScenarios) await Order.create(o);
    console.log(`Created ${orderScenarios.length} orders`);

    await Cart.create({
      user: customers[0]._id,
      items: [
        { product: products[1]._id, quantity: 1, price: products[1].price },
        { product: products[7]._id, quantity: 2, price: products[7].price },
      ],
      totalAmount: products[1].price + products[7].price * 2,
    });
    console.log('Created sample cart');

    console.log('\n=== SEED COMPLETE ===');
    console.log('Admin:    admin@shopzone.com   / admin123');
    console.log('Vendor:   vendor1@shopzone.com / vendor123');
    console.log('Customer: user1@shopzone.com   / user123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
