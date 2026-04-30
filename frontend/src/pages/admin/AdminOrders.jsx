import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Spinner from '../../components/Spinner';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const statusColors = {
  'Order Placed': 'bg-blue-100 text-blue-700', 'Payment Confirmed': 'bg-indigo-100 text-indigo-700',
  'Processing': 'bg-yellow-100 text-yellow-700', 'Packed': 'bg-orange-100 text-orange-700',
  'Shipped': 'bg-purple-100 text-purple-700', 'Out for Delivery': 'bg-cyan-100 text-cyan-700',
  'Delivered': 'bg-green-100 text-green-700', 'Cancelled': 'bg-red-100 text-red-700',
  'Return Requested': 'bg-pink-100 text-pink-700', 'Returned': 'bg-gray-100 text-gray-700',
};

const allStatuses = ['Order Placed', 'Payment Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = () => {
    API.get('/admin/orders').then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch { toast.error('Failed to update status'); }
  };

  const handleRefund = async (orderId) => {
    if (!window.confirm('Process refund for this order?')) return;
    try {
      await API.put(`/admin/orders/${orderId}/refund`);
      toast.success('Refund processed');
      fetchOrders();
    } catch { toast.error('Failed to process refund'); }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">All Orders ({orders.length})</h1>
        {loading ? <Spinner /> : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl text-gray-500">No orders found</div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                  <div>
                    <p className="font-bold text-gray-800">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.user?.name} · {order.user?.email}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>{order.orderStatus}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : order.paymentStatus === 'refunded' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.paymentStatus}</span>
                    <span className="font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
                {expandedOrder === order._id && (
                  <div className="border-t p-4 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2 text-sm">Items</h4>
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 mb-2">
                            <img src={item.image || 'https://placehold.co/32'} alt="" className="w-8 h-8 rounded object-cover" onError={(e) => { e.target.src = 'https://placehold.co/32'; }} />
                            <span className="text-xs text-gray-700">{item.name} ×{item.quantity}</span>
                            <span className="text-xs font-medium ml-auto">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2 text-sm">Delivery Address</h4>
                        <p className="text-xs text-gray-600">{order.deliveryAddress?.name}</p>
                        <p className="text-xs text-gray-600">{order.deliveryAddress?.street}</p>
                        <p className="text-xs text-gray-600">{order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-medium text-gray-700">Update Status:</span>
                      <select value={order.orderStatus} onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                        {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {order.refundStatus === 'requested' && (
                        <button onClick={() => handleRefund(order._id)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm transition">Process Refund</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
