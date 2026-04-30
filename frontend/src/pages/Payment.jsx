import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    API.get(`/orders/${orderId}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleRazorpayPayment = async () => {
    setProcessing(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Failed to load payment gateway'); setProcessing(false); return; }

      const { data } = await API.post('/payment/razorpay/create-order', { amount: order.totalAmount, orderId });
      if (!data.success) { toast.error(data.message || 'Payment setup failed'); setProcessing(false); return; }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: 'INR',
        name: 'ShopZone',
        description: `Order #${order.orderNumber}`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verifyRes = await API.post('/payment/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });
            if (verifyRes.data.success) {
              toast.success('Payment successful!');
              navigate(`/order-success/${orderId}`);
            }
          } catch {
            toast.error('Payment verification failed');
            navigate(`/order-success/${orderId}`);
          }
        },
        prefill: { name: order.deliveryAddress?.name, contact: order.deliveryAddress?.phone },
        theme: { color: '#f97316' },
        modal: { ondismiss: () => { setProcessing(false); toast.error('Payment cancelled'); } },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Spinner /></div>;
  if (!order) return <div className="min-h-screen bg-gray-50"><Navbar /><div className="text-center py-20">Order not found</div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">💳</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h1>
          <p className="text-gray-500 text-sm mb-6">Order #{order.orderNumber}</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-600">Order Total</span><span className="font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Payment Method</span><span className="font-medium capitalize">{order.paymentMethod}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Deliver to</span><span className="font-medium">{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</span></div>
          </div>
          {order.paymentMethod === 'razorpay' && (
            <button onClick={handleRazorpayPayment} disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-xl font-bold text-lg transition">
              {processing ? 'Processing...' : `Pay ₹${order.totalAmount?.toLocaleString()}`}
            </button>
          )}
          <button onClick={() => navigate(`/order-success/${orderId}`)} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 underline">
            Skip for now (view order)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
