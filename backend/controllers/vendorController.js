const Product = require('../models/Product');
const Order = require('../models/Order');

const getDashboard = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const products = await Product.countDocuments({ vendor: vendorId });
    const orders = await Order.find({ 'items.vendor': vendorId });
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid' || o.paymentMethod === 'COD')
      .reduce((acc, o) => {
        const vendorItems = o.items.filter(i => i.vendor && i.vendor.toString() === vendorId.toString());
        return acc + vendorItems.reduce((s, i) => s + i.price * i.quantity, 0);
      }, 0);

    res.json({
      success: true,
      stats: {
        totalProducts: products,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders: orders.filter(o => ['Order Placed', 'Payment Confirmed', 'Processing'].includes(o.orderStatus)).length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user._id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.vendor': req.user._id })
      .populate('user', 'name email phone')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const hasItems = order.items.some(i => i.vendor && i.vendor.toString() === req.user._id.toString());
    if (!hasItems && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    order.orderStatus = status;
    const step = order.trackingSteps.find(s => s.status === status);
    if (step) { step.isCompleted = true; step.timestamp = new Date(); }
    if (status === 'Delivered' && order.paymentMethod === 'COD') order.paymentStatus = 'paid';
    await order.save();
    res.json({ success: true, message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, getVendorProducts, getVendorOrders, updateOrderStatus };
