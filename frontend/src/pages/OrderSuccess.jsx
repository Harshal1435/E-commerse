import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import API from '../api/axios';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${orderId}`).then(({ data }) => setOrder(data.order)).finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="min-h-screen bg-[#f1f3f6]"><Navbar /><Spinner /></div>;

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white border border-gray-200">
          {/* Success header */}
          <div className="bg-[#388e3c] text-white px-8 py-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl flex-shrink-0">✅</div>
            <div>
              <h1 className="text-xl font-bold">Order Confirmed!</h1>
              <p className="text-green-100 text-sm mt-0.5">Order #{order?.orderNumber}</p>
              <p className="text-green-100 text-sm">
                Estimated delivery:{' '}
                <strong>{order?.estimatedDeliveryDate
                  ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
                  : '5-7 business days'}</strong>
              </p>
            </div>
          </div>

          {order && (
            <div className="p-6 space-y-5">
              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Items Ordered</h3>
                <div className="space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center border border-gray-100 rounded p-3">
                      <img src={item.image || 'https://placehold.co/48'} alt={item.name} className="w-12 h-12 object-contain" onError={(e) => { e.target.src = 'https://placehold.co/48'; }} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Address */}
                <div className="border border-gray-100 rounded p-4">
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm">Delivery Address</h3>
                  <p className="text-sm font-medium text-gray-800">{order.deliveryAddress?.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{order.deliveryAddress?.street}</p>
                  <p className="text-xs text-gray-600">{order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</p>
                </div>
                {/* Payment */}
                <div className="border border-gray-100 rounded p-4">
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm">Payment</h3>
                  <p className="text-sm text-gray-600">Method: <span className="font-medium capitalize">{order.paymentMethod}</span></p>
                  <p className="text-sm text-gray-600">Status: <span className={`font-medium capitalize ${order.paymentStatus === 'paid' ? 'text-[#388e3c]' : 'text-yellow-600'}`}>{order.paymentStatus}</span></p>
                  <p className="text-sm font-bold text-gray-800 mt-2">Total: ₹{order.totalAmount?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex border-t border-gray-100">
            <Link to={`/orders/${orderId}/track`} className="flex-1 py-4 text-center text-[#2874f0] font-semibold text-sm hover:bg-blue-50 transition border-r border-gray-100">
              Track Order
            </Link>
            <Link to="/products" className="flex-1 py-4 text-center text-[#2874f0] font-semibold text-sm hover:bg-blue-50 transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
