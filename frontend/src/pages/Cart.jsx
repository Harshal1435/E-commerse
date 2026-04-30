import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { MdFlashOn } from 'react-icons/md';

const Cart = () => {
  const { cart, cartLoading, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const shippingCharge = cart.totalAmount > 499 ? 0 : 49;
  const finalTotal = (cart.totalAmount || 0) + shippingCharge;

  if (cartLoading) return <div className="min-h-screen bg-[#f1f3f6]"><Navbar /><Spinner /></div>;

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-4">
        {!cart.items?.length ? (
          <div className="bg-white text-center py-20">
            <FiShoppingBag size={80} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty!</h2>
            <p className="text-gray-400 text-sm mb-6">Add items to it now.</p>
            <Link to="/products" className="bg-[#2874f0] hover:bg-blue-700 text-white px-10 py-3 font-semibold text-sm transition">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-white">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h1 className="text-lg font-semibold text-gray-800">My Cart ({cart.items?.length} items)</h1>
                </div>
                {cart.items.map((item) => (
                  <div key={item.product?._id} className="flex gap-4 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition">
                    <Link to={`/products/${item.product?._id}`}>
                      <img src={item.product?.image || 'https://placehold.co/80?text=No'} alt={item.product?.name}
                        className="w-24 h-24 object-contain flex-shrink-0"
                        onError={(e) => { e.target.src = 'https://placehold.co/80?text=No'; }} />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product?._id}`} className="text-sm text-gray-800 hover:text-[#2874f0] line-clamp-2 font-medium">{item.product?.name}</Link>
                      <p className="text-xs text-gray-500 mt-0.5">Seller: ShopZone</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-gray-900">₹{item.price?.toLocaleString()}</span>
                        <span className="text-xs text-[#388e3c] font-medium">Free Delivery</span>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition rounded-l">
                            <FiMinus size={12} />
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold border-x border-gray-300">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
                            disabled={item.quantity >= item.product?.stock}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 disabled:opacity-40 transition rounded-r">
                            <FiPlus size={12} />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.product?._id)}
                          className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition">
                          <FiTrash2 size={14} /> REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-6 py-4 flex justify-end border-t border-gray-100">
                  <button onClick={() => navigate('/checkout')}
                    className="bg-[#fb641b] hover:bg-orange-600 text-white px-16 py-3 font-semibold text-sm transition">
                    PLACE ORDER
                  </button>
                </div>
              </div>
            </div>

            {/* Price details */}
            <div className="bg-white h-fit">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Price Details</h2>
              </div>
              <div className="px-5 py-4 space-y-3 text-sm border-b border-gray-100">
                <div className="flex justify-between text-gray-700">
                  <span>Price ({cart.items?.length} items)</span>
                  <span>₹{cart.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Discount</span>
                  <span className="text-[#388e3c]">− ₹0</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Charges</span>
                  <span className={shippingCharge === 0 ? 'text-[#388e3c]' : ''}>
                    {shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}
                  </span>
                </div>
              </div>
              <div className="px-5 py-4 flex justify-between font-bold text-base border-b border-gray-100">
                <span>Total Amount</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
              {shippingCharge === 0 && (
                <div className="px-5 py-3 text-[#388e3c] text-sm font-medium">
                  🎉 You will save ₹49 on this order
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
