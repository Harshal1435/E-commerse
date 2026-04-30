const crypto = require('crypto');
const Order = require('../models/Order');

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id') return null;
  const Razorpay = require('razorpay');
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
};

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    const razorpay = getRazorpayInstance();
    if (!razorpay) return res.status(400).json({ success: false, message: 'Razorpay not configured. Add keys to .env' });
    const options = { amount: Math.round(amount * 100), currency: 'INR', receipt: orderId };
    const razorpayOrder = await razorpay.orders.create(options);
    await Order.findByIdAndUpdate(orderId, { razorpayOrderId: razorpayOrder.id });
    res.json({ success: true, order: razorpayOrder, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body).digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.paymentStatus = 'paid';
    order.transactionId = razorpay_payment_id;
    order.orderStatus = 'Payment Confirmed';
    const step = order.trackingSteps.find(s => s.status === 'Payment Confirmed');
    if (step) { step.isCompleted = true; step.timestamp = new Date(); }
    await order.save();
    res.json({ success: true, message: 'Payment verified successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const confirmCOD = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.orderStatus = 'Processing';
    const step = order.trackingSteps.find(s => s.status === 'Processing');
    if (step) { step.isCompleted = true; step.timestamp = new Date(); }
    await order.save();
    res.json({ success: true, message: 'COD order confirmed', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRazorpayKey = async (req, res) => {
  res.json({ success: true, key: process.env.RAZORPAY_KEY_ID || '' });
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment, confirmCOD, getRazorpayKey };
