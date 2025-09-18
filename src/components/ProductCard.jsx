import { motion } from "framer-motion";

export default function ProductCard({ product, onSelect }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-sm shadow hover:shadow-md cursor-pointer overflow-hidden border"
      onClick={() => onSelect(product)}
    >
      {/* Product Image */}
      <div className="flex justify-center items-center h-52 p-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="max-h-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="px-4 pb-4 text-left">
        {/* Title */}
        <h3 className="font-medium text-sm text-gray-800 line-clamp-2 h-10">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
            {product.rating} ★
          </span>
          <span className="text-xs text-gray-500">( {product.stock} left )</span>
        </div>

        {/* Price */}
        <div className="mt-1">
          <span className="text-lg font-semibold text-gray-900">₹{product.price}</span>
          <span className="ml-2 text-sm text-gray-500 line-through">
            ₹{Math.round(product.price * 1.2)}
          </span>
          <span className="ml-2 text-sm text-green-600 font-semibold">20% off</span>
        </div>
      </div>
    </motion.div>
  );
}
