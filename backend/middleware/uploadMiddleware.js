const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Reusable factory — pass a folder name per resource type
const makeUpload = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `shopzone/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|gif|webp/;
      if (allowed.test(file.mimetype)) cb(null, true);
      else cb(new Error('Only image files are allowed'));
    },
  });
};

// Named exports for each resource
const uploadProduct  = makeUpload('products');
const uploadCategory = makeUpload('categories');
const uploadAvatar   = makeUpload('avatars');

// Default export keeps backward-compat with any existing `upload.single(...)` calls
module.exports = uploadProduct;
module.exports.uploadProduct  = uploadProduct;
module.exports.uploadCategory = uploadCategory;
module.exports.uploadAvatar   = uploadAvatar;

// Helper: delete an image from Cloudinary by its URL
module.exports.deleteImage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary')) return;
  try {
    // Extract public_id from URL  e.g. shopzone/products/abc123
    const parts = imageUrl.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return;
    // Skip version segment (v1234567) if present
    const afterUpload = parts.slice(uploadIndex + 1);
    const withoutVersion = afterUpload[0]?.startsWith('v') ? afterUpload.slice(1) : afterUpload;
    const publicId = withoutVersion.join('/').replace(/\.[^/.]+$/, ''); // strip extension
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};
