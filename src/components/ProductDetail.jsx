import { motion } from "framer-motion";

export default function ProductDetail({ product, onClose }) {
  if (!product) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-md shadow-lg max-w-5xl w-full relative flex flex-col md:flex-row"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* LEFT: Image Section */}
        <div className="w-full md:w-1/2 border-r flex flex-col items-center p-4">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-80 object-contain"
          />

          {/* Thumbnails if available */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className="h-20 w-20 object-contain border rounded-md cursor-pointer hover:border-blue-500"
                />
              ))}
            </div>
          )}

          {/* Add to Cart / Buy Buttons */}
          <div className="flex gap-4 mt-6 w-full">
            <button className="flex-1 bg-orange-500 text-white font-semibold py-3 rounded hover:bg-orange-600">
              🛒 Add to Cart
            </button>
            <button className="flex-1 bg-yellow-500 text-black font-semibold py-3 rounded hover:bg-yellow-600">
              ⚡ Buy Now
            </button>
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-semibold">{product.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{product.brand} | {product.category}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-green-600 text-white text-sm px-2 py-1 rounded">
              {product.rating} ★
            </span>
            <span className="text-gray-500 text-sm">( {product.stock} in stock )</span>
          </div>

          {/* Price */}
          <div className="mt-4">
            <span className="text-3xl font-bold text-gray-800">₹{product.price}</span>
            <span className="ml-2 text-sm text-gray-500 line-through">
              ₹{Math.round(product.price * 1.2)}
            </span>
            <span className="ml-2 text-green-600 font-semibold">20% off</span>
          </div>

          {/* Description */}
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Product Description</h3>
            <p className="text-gray-700 text-sm">{product.description}</p>
          </div>

          {/* Offers */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-green-700">Available Offers</h3>
            <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
              <li>Special Price: Get extra 10% off on first order</li>
              <li>Bank Offer: 5% Unlimited Cashback on Flipkart Axis Bank Card</li>
              <li>No Cost EMI starting from ₹500/month</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
