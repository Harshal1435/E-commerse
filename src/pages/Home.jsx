import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/ProductGrid";
import ProductDetail from "../components/ProductDetail";
import FilterBar from "../components/FilterBar";
import SortBar from "../components/SortBar";
import SearchBar from "../components/EcommerceHeader";
import Loader from "../components/Loader";
import HeroSection from "../components/HeroSection";
import EcommerceHeader from "../components/EcommerceHeader";

export default function Home() {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  const { products, categories, loading, error } = useProducts(
    category,
    sort,
    page,
    12,
    query
  );

  return (
    <div className="bg-[#f1f3f6] min-h-screen">
      {/* ✅ Flipkart-style Header */}
      <EcommerceHeader
        cartItemCount={2}
        onCartClick={() => alert("Go to cart")}
        onSearch={(q) => { setQuery(q); setPage(0); }}
      />

      {/* ✅ Hero Banner */}
  
      <HeroSection />

      {/* ✅ Categories Row */}
      <FilterBar categories={categories} selected={category} onSelect={setCategory} />

      {/* ✅ Sorting Bar */}
      <SortBar sort={sort} onSort={setSort} />

      {/* ✅ Products */}
      {loading && <Loader />}
      {error && <p className="text-red-600 text-center">{error}</p>}
      {!loading && !error && (
        <div className="px-4">
          <ProductGrid products={products} onSelect={setSelected} />
        </div>
      )}

      {/* ✅ Pagination */}
      <div className="flex justify-center gap-2 p-4">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-[#2874f0] text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-[#2874f0] text-white rounded"
        >
          Next
        </button>
      </div>

      <ProductDetail product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
