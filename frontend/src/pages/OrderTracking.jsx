import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import API from '../api/axios';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#f1f3f6]"><Navbar /><Spinner /></div>;
  if (!order) return <div className="min-h-screen bg-[#f1f3f6]"><Navbar /><div className="text-center py-20">Order not found</div></div>;

  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="bg-white border border-gray-200 mb-4">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex gap-8 text-xs">
              <div><p className="text-gray-400 uppercase text-[10px] font-semibold">Order Placed</p><p className="text-gray-700 font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
              <div><p className="text-gray-400 uppercase text-[10px] font-semibold">Total</p><p className="text-gray-700 font-medium">₹{order.totalAmount?.toLocaleString()}</p></div>
              <div><p className="text-gray-400 uppercase text-[10px] font-semibold">Order #</p><p className="text-gray-700 font-medium">{order.orderNumber}</p></div>
            </div>
          </div>

          {/* Items */}
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
              <img src={item.image || 'https://placehold.co/64'} alt={item.name} className="w-16 h-16 object-contain" onError={(e) => { e.target.src = 'https://placehold.co/64'; }} />
              <div>
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} · ₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}

          {/* Tracking timeline */}
          <div className="px-6 py-6">
            {isCancelled ? (
              <div className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-700">
                ❌ Order Cancelled: {order.cancelReason}
              </div>
            ) : (
              <>
                {!isCancelled && (
                  <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded p-3 mb-6 text-sm text-[#2e7d32]">
                    📅 Estimated Delivery:{' '}
                    <strong>{order.estimatedDeliveryDate
                      ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
                      : 'Within 5-7 days'}</strong>
                  </div>
                )}
                <div className="flex items-start justify-between relative">
                  {/* Progress line */}
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0">
                    <div className="h-full bg-[#388e3c] transition-all"
                      style={{ width: `${(order.trackingSteps?.filter(s => s.isCompleted).length / (order.trackingSteps?.length || 1)) * 100}%` }} />
                  </div>
                  {order.trackingSteps?.map((step, index) => (
                    <div key={index} className="flex flex-col items-center z-10 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 ${step.isCompleted ? 'bg-[#388e3c] border-[#388e3c] text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                        {step.isCompleted ? <FiCheckCircle size={16} /> : <FiCircle size={16} />}
                      </div>
                      <p className={`text-[10px] text-center mt-2 max-w-16 leading-tight ${step.isCompleted ? 'text-[#388e3c] font-semibold' : 'text-gray-400'}`}>{step.status}</p>
                      {step.isCompleted && step.timestamp && (
                        <p className="text-[9px] text-gray-400 text-center mt-0.5">{new Date(step.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-white border border-gray-200 p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-3">Delivery Address</h2>
          <p className="font-semibold text-gray-800 text-sm">{order.deliveryAddress?.name}</p>
          <p className="text-sm text-gray-600 mt-1">{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</p>
          <p className="text-sm text-gray-600">{order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</p>
          <p className="text-sm text-gray-600 mt-1">📞 {order.deliveryAddress?.phone}</p>
        </div>

        <div className="flex gap-3">
          <Link to="/orders" className="flex-1 border border-[#2874f0] text-[#2874f0] py-3 font-semibold text-sm text-center hover:bg-blue-50 transition">
            All Orders
          </Link>
          <Link to="/products" className="flex-1 bg-[#fb641b] hover:bg-orange-600 text-white py-3 font-semibold text-sm text-center transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
