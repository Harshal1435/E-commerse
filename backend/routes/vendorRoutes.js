const express = require('express');
const router = express.Router();
const { getDashboard, getVendorProducts, getVendorOrders, updateOrderStatus } = require('../controllers/vendorController');
const { protect, authorize, vendorApproved } = require('../middleware/authMiddleware');

router.use(protect, authorize('vendor', 'admin'), vendorApproved);
router.get('/dashboard', getDashboard);
router.get('/products', getVendorProducts);
router.get('/orders', getVendorOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
