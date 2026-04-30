import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to cart'); return; }
    if (user.role !== 'user') { toast.error('Only customers can add to cart'); return; }
    addToCart(product._id, 1);
  };

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative bg-white flex items-center justify-center h-48 p-4 overflow-hidden">
        <img
          src={product.image || 'https://placehold.co/300x200?text=No+Image'}
          alt={product.name}
          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://placehold.co/300x200?text=No+Image'; }}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-gray-500 font-semibold text-sm border border-gray-400 px-3 py-1">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 border-t border-gray-100">
        <h3 className="text-sm text-gray-800 line-clamp-2 mb-1 leading-snug">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-1">
          <span className="bg-[#388e3c] text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5 font-medium">
            {product.ratings?.toFixed(1) || '0.0'} ★
          </span>
          <span className="text-xs text-gray-400">({product.numReviews || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap mt-auto">
          <span className="text-base font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
          {discount > 0 && (
            <>
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</span>
              <span className="text-xs text-[#388e3c] font-semibold">{discount}% off</span>
            </>
          )}
        </div>

        {/* Free delivery */}
        {product.price >= 499 && (
          <p className="text-xs text-gray-500 mt-1">Free delivery</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
