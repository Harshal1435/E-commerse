import { useState, useEffect } from 'react';
import VendorSidebar from '../../components/VendorSidebar';
import Spinner from '../../components/Spinner';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const statusOptions = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
const statusColors = {
  'Order Placed': 'bg-blue-100 text-blue-700', 'Payment Confirmed': 'bg-indigo-100 text-indigo-700',
  'Processing': 'bg-yellow-100 text-yellow-700', 'Packed': 'bg-orange-100 text-orange-700',
  'Shipped': 'bg-purple-100 text-purple-700', 'Out for Delivery': 'bg-cyan-100 text-cyan-700',
  'Delivered': 'bg-green-100 text-green-700', 'Cancelled': 'bg-red-100 text-red-700',
};

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState('');

  const fetchOrders = () => {
    API.get('/vendor/orders').then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await API.put(`/vendor/orders/${orderId}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally { setUpdating(''); }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <VendorSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>
        {loading ? <Spinner /> : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl"><div className="text-5xl mb-4">📦</div><p className="text-gray-500">No orders yet</p></div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-bold text-gray-800">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.user?.name} · {order.user?.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>{order.orderStatus}</span>
                    <span className="font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                      <img src={item.image || 'https://placehold.co/36'} alt={item.name} className="w-9 h-9 rounded object-cover" onError={(e) => { e.target.src = 'https://placehold.co/36'; }} />
                      <div>
                        <p className="text-xs font-medium max-w-24 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">×{item.quantity} · ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="text-gray-600 font-medium">Update Status:</span>
                  {statusOptions.map(status => (
                    <button key={status} onClick={() => handleStatusUpdate(order._id, status)}
                      disabled={updating === order._id || order.orderStatus === status || order.orderStatus === 'Cancelled' || order.orderStatus === 'Delivered'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${order.orderStatus === status ? 'bg-orange-500 text-white' : 'border border-gray-300 text-gray-600 hover:border-orange-400 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed'}`}>
                      {updating === order._id ? '...' : status}
                    </button>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-500">📍 {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;
