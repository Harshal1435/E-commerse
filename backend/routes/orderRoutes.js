const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, cancelOrder, returnOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', authorize('user'), createOrder);
router.get('/my', authorize('user'), getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', authorize('user'), cancelOrder);
router.put('/:id/return', authorize('user'), returnOrder);

module.exports = router;
