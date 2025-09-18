import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onSelect }) {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
    >
      {products.map((p) => (
        <motion.div
          key={p.id}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <ProductCard product={p} onSelect={onSelect} />
        </motion.div>
      ))}
    </motion.div>
  );
}
