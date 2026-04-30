const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const defaultTrackingSteps = () => [
  { status: 'Order Placed', description: 'Your order has been placed successfully', isCompleted: true, timestamp: new Date() },
  { status: 'Payment Confirmed', description: 'Payment has been confirmed', isCompleted: false },
  { status: 'Processing', description: 'Your order is being processed', isCompleted: false },
  { status: 'Packed', description: 'Your order has been packed', isCompleted: false },
  { status: 'Shipped', description: 'Your order has been shipped', isCompleted: false },
  { status: 'Out for Delivery', description: 'Your order is out for delivery', isCompleted: false },
  { status: 'Delivered', description: 'Your order has been delivered', isCompleted: false },
];

const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, shippingCharge = 0, discount = 0, notes } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: 'No items in order' });

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      // Atomic stock decrement — only succeeds if stock >= quantity
      const product = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity }, isActive: true },
        { $inc: { stock: -item.quantity } },
        { new: true }
      ).populate('vendor', '_id');

      if (!product) {
        // Either not found or stock was insufficient (race condition caught here)
        const exists = await Product.findById(item.product).select('name stock');
        if (!exists) return res.status(404).json({ success: false, message: 'Product not found' });
        return res.status(400).json({ success: false, message: `"${exists.name}" is out of stock or has insufficient quantity` });
      }

      orderItems.push({
        product: product._id, vendor: product.vendor._id,
        name: product.name, image: product.image,
        price: product.price, quantity: item.quantity,
      });
      totalAmount += product.price * item.quantity;
    }

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

    const trackingSteps = defaultTrackingSteps();
    if (paymentMethod === 'COD') {
      trackingSteps[1].isCompleted = true;
      trackingSteps[1].timestamp = new Date();
    }

    const order = await Order.create({
      user: req.user._id, items: orderItems,
      totalAmount: totalAmount + Number(shippingCharge) - Number(discount),
      shippingCharge, discount, paymentMethod,
      paymentStatus: 'pending', orderStatus: 'Order Placed',
      trackingSteps, estimatedDeliveryDate, deliveryAddress, notes,
    });

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalAmount: 0 });
    await order.populate('items.product', 'name image');
    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image price');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role === 'user')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    const cancellableStatuses = ['Order Placed', 'Payment Confirmed', 'Processing'];
    if (!cancellableStatuses.includes(order.orderStatus))
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    order.orderStatus = 'Cancelled';
    order.cancelReason = req.body.reason || 'Cancelled by customer';
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
    await order.save();
    res.json({ success: true, message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const returnOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    if (order.orderStatus !== 'Delivered')
      return res.status(400).json({ success: false, message: 'Only delivered orders can be returned' });
    order.orderStatus = 'Return Requested';
    order.returnReason = req.body.reason || 'Return requested by customer';
    order.refundStatus = 'requested';
    await order.save();
    res.json({ success: true, message: 'Return request submitted', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, cancelOrder, returnOrder };
