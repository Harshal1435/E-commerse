const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview } = require('../controllers/productController');
const { protect, authorize, vendorApproved } = require('../middleware/authMiddleware');
const { uploadProduct: upload } = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('vendor', 'admin'), vendorApproved, upload.array('images', 6), createProduct);
router.put('/:id', protect, authorize('vendor', 'admin'), vendorApproved, upload.array('images', 6), updateProduct);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteProduct);
router.post('/:id/review', protect, authorize('user'), addReview);

module.exports = router;
