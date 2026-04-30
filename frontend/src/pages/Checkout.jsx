import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiMapPin } from 'react-icons/fi';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Buy Now mode: single product bypassing cart
  const buyNow = location.state?.buyNow || null;

  // Items to display and submit
  const checkoutItems = buyNow
    ? [{ product: buyNow.product, price: buyNow.product.price, quantity: buyNow.quantity }]
    : cart.items || [];

  const subtotal = buyNow
    ? buyNow.product.price * buyNow.quantity
    : cart.totalAmount || 0;

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [address, setAddress] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: user?.address?.street || '', city: user?.address?.city || '',
    state: user?.address?.state || '', pincode: user?.address?.pincode || '', country: 'India',
  });

  const shippingCharge = subtotal > 499 ? 0 : 49;
  const total = subtotal + shippingCharge;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!checkoutItems.length) { toast.error('No items to order'); return; }
    setLoading(true);
    try {
      const orderItems = checkoutItems.map(item => ({
        product: item.product._id || item.product,
        quantity: item.quantity,
      }));
      const { data } = await API.post('/orders', { items: orderItems, deliveryAddress: address, paymentMethod, shippingCharge });
      // Only clear cart if this was a normal cart checkout (not Buy Now)
      if (!buyNow) await clearCart();
      if (paymentMethod === 'COD') navigate(`/order-success/${data.order._id}`);
      else navigate(`/payment/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-4">
        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery Address */}
              <div className="bg-white">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                  <FiMapPin className="text-[#2874f0]" size={18} />
                  <h2 className="font-semibold text-gray-800">Delivery Address</h2>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  {[
                    { name: 'name', label: 'Full Name', col: 1 },
                    { name: 'phone', label: 'Mobile Number', col: 1 },
                    { name: 'pincode', label: 'Pincode', col: 1 },
                    { name: 'city', label: 'City', col: 1 },
                    { name: 'street', label: 'Address (Area and Street)', col: 2 },
                    { name: 'state', label: 'State', col: 1 },
                    { name: 'country', label: 'Country', col: 1 },
                  ].map(field => (
                    <div key={field.name} className={field.col === 2 ? 'col-span-2' : ''}>
                      <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                      <input type="text" name={field.name} value={address[field.name]}
                        onChange={(e) => setAddress({ ...address, [e.target.name]: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0] transition" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800">Payment Options</h2>
                </div>
                <div className="p-6 space-y-3">
                  {[
                    { value: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives at your door', icon: '💵' },
                    { value: 'razorpay', label: 'Online Payment', desc: 'UPI, Credit/Debit Card, Net Banking via Razorpay', icon: '💳' },
                  ].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-4 p-4 border-2 rounded cursor-pointer transition ${paymentMethod === opt.value ? 'border-[#2874f0] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} className="accent-[#2874f0]" />
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white h-fit">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Price Details</h2>
              </div>
              <div className="px-5 py-4 space-y-3 text-sm border-b border-gray-100">
                {checkoutItems.map((item, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <img src={item.product?.image || 'https://placehold.co/32'} alt="" className="w-8 h-8 object-contain" onError={(e) => { e.target.src = 'https://placehold.co/32'; }} />
                    <span className="flex-1 text-xs text-gray-700 line-clamp-1">{item.product?.name}</span>
                    <span className="text-xs font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 space-y-3 text-sm border-b border-gray-100">
                <div className="flex justify-between text-gray-700"><span>Price ({checkoutItems.length} items)</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-700"><span>Delivery Charges</span><span className={shippingCharge === 0 ? 'text-[#388e3c]' : ''}>{shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}</span></div>
              </div>
              <div className="px-5 py-4 flex justify-between font-bold text-base border-b border-gray-100">
                <span>Total Amount</span><span>₹{total.toLocaleString()}</span>
              </div>
              <div className="px-5 py-4">
                <button type="submit" disabled={loading}
                  className="w-full bg-[#fb641b] hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 font-bold text-sm transition">
                  {loading ? 'Placing Order...' : paymentMethod === 'COD' ? 'PLACE ORDER' : 'PROCEED TO PAYMENT'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
