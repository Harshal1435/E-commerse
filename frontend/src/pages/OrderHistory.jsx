import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import API from '../api/axios';
import toast from 'react-hot-toast';

const statusColors = {
  'Order Placed': 'text-blue-600', 'Payment Confirmed': 'text-indigo-600',
  'Processing': 'text-yellow-600', 'Packed': 'text-orange-600',
  'Shipped': 'text-purple-600', 'Out for Delivery': 'text-cyan-600',
  'Delivered': 'text-[#388e3c]', 'Cancelled': 'text-red-500',
  'Return Requested': 'text-pink-600', 'Returned': 'text-gray-500',
};
const statusDots = {
  'Delivered': 'bg-[#388e3c]', 'Cancelled': 'bg-red-500', 'Shipped': 'bg-purple-500',
  'Out for Delivery': 'bg-cyan-500', 'Processing': 'bg-yellow-500',
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/my');
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await API.put(`/orders/${orderId}/cancel`, { reason: 'Cancelled by customer' });
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel order'); }
  };

  const handleReturn = async (orderId) => {
    const reason = window.prompt('Reason for return:');
    if (!reason) return;
    try {
      await API.put(`/orders/${orderId}/return`, { reason });
      toast.success('Return request submitted');
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot return order'); }
  };

  if (loading) return <div className="min-h-screen bg-[#f1f3f6]"><Navbar /><Spinner /></div>;

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">My Orders</h1>
        {orders.length === 0 ? (
          <div className="bg-white text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-lg font-semibold text-gray-600 mb-2">No orders yet</h2>
            <Link to="/products" className="bg-[#2874f0] text-white px-8 py-2.5 font-semibold text-sm inline-block mt-4 hover:bg-blue-700 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order._id} className="bg-white border border-gray-200">
                {/* Order header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="flex gap-6 text-xs text-gray-500">
                    <div><p className="uppercase font-semibold text-gray-400 text-[10px]">Order Placed</p><p className="text-gray-700 font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
                    <div><p className="uppercase font-semibold text-gray-400 text-[10px]">Total</p><p className="text-gray-700 font-medium">₹{order.totalAmount?.toLocaleString()}</p></div>
                    <div><p className="uppercase font-semibold text-gray-400 text-[10px]">Order #</p><p className="text-gray-700 font-medium">{order.orderNumber}</p></div>
                  </div>
                </div>

                {/* Items */}
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-0">
                    <img src={item.image || 'https://placehold.co/60'} alt={item.name}
                      className="w-16 h-16 object-contain flex-shrink-0"
                      onError={(e) => { e.target.src = 'https://placehold.co/60'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      {/* Status */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={`w-2 h-2 rounded-full ${statusDots[order.orderStatus] || 'bg-blue-500'}`}></span>
                        <span className={`text-sm font-semibold ${statusColors[order.orderStatus] || 'text-blue-600'}`}>{order.orderStatus}</span>
                      </div>
                      {order.orderStatus === 'Delivered' && (
                        <p className="text-xs text-gray-500 mt-0.5">Your item has been delivered</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Link to={`/orders/${order._id}/track`}
                        className="text-sm text-[#2874f0] font-semibold hover:underline whitespace-nowrap">
                        Track Order
                      </Link>
                      {['Order Placed', 'Payment Confirmed', 'Processing'].includes(order.orderStatus) && (
                        <button onClick={() => handleCancel(order._id)}
                          className="text-xs text-red-500 hover:underline">Cancel</button>
                      )}
                      {order.orderStatus === 'Delivered' && (
                        <button onClick={() => handleReturn(order._id)}
                          className="text-xs text-gray-500 hover:underline">Return</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistory;
