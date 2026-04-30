const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment, confirmCOD, getRazorpayKey } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/razorpay/key', getRazorpayKey);
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);
router.post('/cod/confirm', confirmCOD);

module.exports = router;
