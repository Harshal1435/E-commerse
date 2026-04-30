const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalVendors, totalProducts, totalOrders, orders] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'vendor' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find().select('totalAmount paymentStatus'),
    ]);
    const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.totalAmount, 0);
    const pendingVendors = await User.countDocuments({ role: 'vendor', isApproved: false });
    const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, stats: { totalUsers, totalVendors, totalProducts, totalOrders, totalRevenue, pendingVendors }, recentOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const approveVendor = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);
    if (!vendor || vendor.role !== 'vendor')
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    vendor.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : true;
    await vendor.save();
    res.json({ success: true, message: `Vendor ${vendor.isApproved ? 'approved' : 'rejected'}`, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin' });
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (status) {
      order.orderStatus = status;
      const step = order.trackingSteps.find(s => s.status === status);
      if (step) { step.isCompleted = true; step.timestamp = new Date(); }
    }
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();
    res.json({ success: true, message: 'Order updated', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('vendor', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const processRefund = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.refundStatus = 'refunded';
    order.paymentStatus = 'refunded';
    await order.save();
    res.json({ success: true, message: 'Refund processed', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, getUsers, getVendors, approveVendor, deleteUser, getAllOrders, updateOrderStatus, getAllProducts, processRefund };
