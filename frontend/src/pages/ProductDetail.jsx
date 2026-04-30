import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { MdFlashOn } from 'react-icons/md';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [thumbStart, setThumbStart] = useState(0); // for scrolling thumbnail strip
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) { toast.error('Please login'); navigate('/login'); return; }
    if (user.role !== 'user') { toast.error('Only customers can add to cart'); return; }
    addToCart(product._id, qty);
  };

  const handleBuyNow = () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'user') { toast.error('Only customers can buy'); return; }
    // Go directly to checkout with this product — don't touch the cart
    navigate('/checkout', { state: { buyNow: { productId: product._id, quantity: qty, product } } });
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    setSubmittingReview(true);
    try {
      await API.post(`/products/${id}/review`, review);
      toast.success('Review submitted!');
      const { data } = await API.get(`/products/${id}`);
      setProduct(data.product);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmittingReview(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#f1f3f6]"><Navbar /><Spinner /></div>;
  if (!product) return <div className="min-h-screen bg-[#f1f3f6]"><Navbar /><div className="text-center py-20">Product not found</div></div>;

  // Build gallery: use images[] if available, else fall back to image
  const gallery = product.images?.length > 0 ? product.images : product.image ? [product.image] : [];
  const THUMB_VISIBLE = 5;
  const canScrollUp   = thumbStart > 0;
  const canScrollDown = thumbStart + THUMB_VISIBLE < gallery.length;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* ── Main product card ── */}
        <div className="bg-white">
          <div className="grid md:grid-cols-5 gap-0">

            {/* ── Image gallery panel ── */}
            <div className="md:col-span-2 border-r border-gray-100 p-4 flex flex-col items-center sticky top-16 self-start">
              <div className="flex gap-3 w-full">

                {/* Thumbnail strip */}
                {gallery.length > 1 && (
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    {/* Scroll up */}
                    <button type="button" onClick={() => setThumbStart(s => Math.max(0, s - 1))}
                      disabled={!canScrollUp}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-20 transition py-0.5">
                      <FiChevronUp size={16} />
                    </button>

                    {gallery.slice(thumbStart, thumbStart + THUMB_VISIBLE).map((img, i) => {
                      const realIdx = thumbStart + i;
                      return (
                        <button key={realIdx} type="button" onClick={() => setActiveImg(realIdx)}
                          className={`w-14 h-14 border-2 flex-shrink-0 bg-white flex items-center justify-center transition ${activeImg === realIdx ? 'border-[#2874f0]' : 'border-gray-200 hover:border-gray-400'}`}>
                          <img src={img} alt={`thumb-${realIdx}`}
                            className="max-w-full max-h-full object-contain p-1"
                            onError={(e) => { e.target.src = 'https://placehold.co/56?text=?'; }} />
                        </button>
                      );
                    })}

                    {/* Scroll down */}
                    <button type="button" onClick={() => setThumbStart(s => s + 1)}
                      disabled={!canScrollDown}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-20 transition py-0.5">
                      <FiChevronDown size={16} />
                    </button>
                  </div>
                )}

                {/* Main image */}
                <div className="flex-1 flex items-center justify-center bg-white min-h-72 relative overflow-hidden group">
                  <img
                    src={gallery[activeImg] || 'https://placehold.co/400?text=No+Image'}
                    alt={product.name}
                    className="max-h-72 max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://placehold.co/400?text=No+Image'; }}
                  />
                  {/* Image counter badge */}
                  {gallery.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                      {activeImg + 1}/{gallery.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Dot indicators for mobile */}
              {gallery.length > 1 && (
                <div className="flex gap-1.5 mt-3 md:hidden">
                  {gallery.map((_, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-2 h-2 rounded-full transition ${i === activeImg ? 'bg-[#2874f0]' : 'bg-gray-300'}`} />
                  ))}
                </div>
              )}

              {/* Action buttons */}
              {product.stock > 0 && (
                <div className="flex gap-3 w-full mt-5">
                  <button onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#ff9f00] hover:bg-[#f0930a] text-white py-3 font-bold text-sm transition">
                    <FiShoppingCart size={18} /> ADD TO CART
                  </button>
                  <button onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#fb641b] hover:bg-[#e85d18] text-white py-3 font-bold text-sm transition">
                    <MdFlashOn size={18} /> BUY NOW
                  </button>
                </div>
              )}
            </div>

            {/* ── Details panel ── */}
            <div className="md:col-span-3 p-6">
              <p className="text-sm text-gray-500 mb-1">{product.category?.name}</p>
              <h1 className="text-xl font-medium text-gray-800 mb-2 leading-snug">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#388e3c] text-white text-sm px-2 py-0.5 rounded font-semibold">
                  {product.ratings?.toFixed(1)} ★
                </span>
                <span className="text-sm text-gray-500">{product.numReviews} Ratings & Reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-medium text-gray-900">₹{product.price?.toLocaleString()}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</span>
                    <span className="text-lg text-[#388e3c] font-semibold">{discount}% off</span>
                  </>
                )}
              </div>

              {/* Offers */}
              <div className="border-t border-b border-gray-100 py-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Available offers</h3>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  <li className="flex gap-2"><span className="text-[#388e3c] font-bold">Bank Offer</span> 10% off on HDFC Bank Cards</li>
                  <li className="flex gap-2"><span className="text-[#388e3c] font-bold">Special Price</span> Get extra {discount > 0 ? discount : 5}% off</li>
                  <li className="flex gap-2"><span className="text-[#388e3c] font-bold">No Cost EMI</span> ₹{Math.round(product.price / 6).toLocaleString()}/month</li>
                </ul>
              </div>

              {/* Delivery */}
              <div className="flex items-center gap-3 mb-4 text-sm">
                <FiTruck className="text-gray-500" size={16} />
                <span className="text-gray-600">Delivery by <strong>Tomorrow</strong></span>
                {product.price >= 499 && <span className="text-[#388e3c] font-medium">Free</span>}
              </div>

              {/* Stock */}
              <div className={`text-sm font-semibold mb-4 ${product.stock > 0 ? 'text-[#388e3c]' : 'text-red-500'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </div>

              {/* Qty */}
              {product.stock > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 transition"><FiMinus size={13} /></button>
                    <span className="px-4 py-1.5 text-sm font-semibold border-x border-gray-300">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 transition"><FiPlus size={13} /></button>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Highlights */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { icon: <FiTruck size={20} className="text-[#2874f0]" />, label: 'Free Delivery' },
                  { icon: <FiRefreshCw size={20} className="text-[#2874f0]" />, label: '7 Day Return' },
                  { icon: <FiShield size={20} className="text-[#2874f0]" />, label: '1 Year Warranty' },
                ].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded text-center">
                    {h.icon}
                    <span className="text-xs text-gray-600">{h.label}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-4">Sold by: <span className="text-gray-600 font-medium">{product.vendor?.name}</span></p>
            </div>
          </div>
        </div>

        {/* ── All product images strip (like Flipkart's image section) ── */}
        {gallery.length > 1 && (
          <div className="bg-white mt-4 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h2>
            <div className="flex flex-wrap gap-3">
              {gallery.map((img, i) => (
                <button key={i} type="button" onClick={() => { setActiveImg(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-24 h-24 border-2 bg-white flex items-center justify-center transition hover:border-[#2874f0] ${i === activeImg ? 'border-[#2874f0]' : 'border-gray-200'}`}>
                  <img src={img} alt={`img-${i}`} className="max-w-full max-h-full object-contain p-1"
                    onError={(e) => { e.target.src = 'https://placehold.co/96?text=?'; }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Reviews ── */}
        <div className="bg-white mt-4 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ratings & Reviews</h2>

          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-800">{product.ratings?.toFixed(1)}</div>
              <div className="text-[#388e3c] font-semibold text-sm mt-1">{'★'.repeat(Math.round(product.ratings || 0))}</div>
              <div className="text-xs text-gray-500 mt-1">{product.numReviews} Reviews</div>
            </div>
          </div>

          {user?.role === 'user' && (
            <form onSubmit={handleReview} className="bg-gray-50 p-4 rounded mb-6">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm">Write a Review</h3>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} type="button" onClick={() => setReview({ ...review, rating: s })}
                    className={`text-2xl transition ${s <= review.rating ? 'text-[#ff9f00]' : 'text-gray-300'}`}>★</button>
                ))}
              </div>
              <textarea value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} required rows={3}
                placeholder="Share your experience with this product..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0] resize-none" />
              <button type="submit" disabled={submittingReview}
                className="mt-3 bg-[#2874f0] hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded text-sm font-semibold transition">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {product.reviews?.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-5">
              {product.reviews?.map((r, i) => (
                <div key={i} className="border-b border-gray-100 pb-5 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#388e3c] text-white text-xs px-1.5 py-0.5 rounded font-semibold">{r.rating} ★</span>
                    <span className="text-sm font-semibold text-gray-800">{r.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
