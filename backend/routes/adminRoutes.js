const express = require('express');
const router = express.Router();
const { getDashboard, getUsers, getVendors, approveVendor, deleteUser, getAllOrders, updateOrderStatus, getAllProducts, processRefund } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));
router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/vendors', getVendors);
router.put('/vendors/:id/approve', approveVendor);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/refund', processRefund);
router.get('/products', getAllProducts);

module.exports = router;
