const Product = require('../models/Product');
const { deleteImage } = require('../middleware/uploadMiddleware');

// Helper: build images array from uploaded files + pasted URLs
const buildImages = (files, imageUrlsStr) => {
  const fromFiles = (files || []).map(f => f.path);
  const fromUrls  = (imageUrlsStr || '')
    .split(',')
    .map(u => u.trim())
    .filter(u => u.length > 0);
  return [...fromFiles, ...fromUrls];
};

const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (keyword) query.name = { $regex: keyword, $options: 'i' };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { ratings: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('vendor', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('vendor', 'name email')
      .populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, stock, brand, tags, imageUrls } = req.body;
    const allImages = buildImages(req.files, imageUrls);
    // First image is the primary thumbnail
    const image  = allImages[0] || '';
    const images = allImages;

    const product = await Product.create({
      name, description, price, originalPrice, category, stock, brand,
      vendor: req.user._id, image, images,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
    });
    await product.populate('category', 'name');
    res.status(201).json({ success: true, message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const fields = ['name', 'description', 'price', 'originalPrice', 'category', 'stock', 'brand', 'isActive'];
    fields.forEach(f => { if (req.body[f] !== undefined) product[f] = req.body[f]; });
    if (req.body.tags) product.tags = req.body.tags.split(',').map(t => t.trim());

    // Build new images list
    const newImages = buildImages(req.files, req.body.imageUrls);

    if (newImages.length > 0) {
      // keepImages: existing images the vendor wants to keep (sent as JSON array string)
      let keepImages = [];
      try { keepImages = JSON.parse(req.body.keepImages || '[]'); } catch {}

      // Delete Cloudinary images that are being removed
      const toDelete = product.images.filter(img => !keepImages.includes(img));
      await Promise.all(toDelete.map(deleteImage));

      product.images = [...keepImages, ...newImages];
      product.image  = product.images[0] || '';
    } else if (req.body.keepImages) {
      // No new uploads but vendor reordered/removed existing ones
      let keepImages = [];
      try { keepImages = JSON.parse(req.body.keepImages); } catch {}
      const toDelete = product.images.filter(img => !keepImages.includes(img));
      await Promise.all(toDelete.map(deleteImage));
      product.images = keepImages;
      product.image  = keepImages[0] || '';
    }

    await product.save();
    res.json({ success: true, message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await Promise.all((product.images || []).map(deleteImage));
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ success: false, message: 'Product already reviewed' });
    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview };
