import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import API from '../api/axios';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [openSections, setOpenSections] = useState({ category: true, price: true, sort: true });

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit: 20 });
        if (keyword) params.set('keyword', keyword);
        if (category) params.set('category', category);
        if (sort) params.set('sort', sort);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        const { data } = await API.get(`/products?${params}`);
        setProducts(Array.isArray(data?.products) ? data.products : []);
        setTotal(data?.total || 0);
        setPages(data?.pages || 1);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, [keyword, category, sort, minPrice, maxPrice, page]);

  useEffect(() => {
    API.get('/categories').then(({ data }) => setCategories(Array.isArray(data?.categories) ? data.categories : [])).catch(console.error);
  }, []);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});
  const toggle = (s) => setOpenSections(p => ({ ...p, [s]: !p[s] }));

  const FilterPanel = () => (
    <div className="bg-white border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-bold text-gray-800 text-base">Filters</h3>
        <button onClick={clearFilters} className="text-xs text-[#2874f0] font-semibold hover:underline">CLEAR ALL</button>
      </div>

      {/* Sort */}
      <div className="border-b">
        <button onClick={() => toggle('sort')} className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-gray-700">
          Sort By {openSections.sort ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        {openSections.sort && (
          <div className="px-4 pb-3 space-y-2">
            {[
              { value: '', label: 'Relevance' },
              { value: 'price_asc', label: 'Price — Low to High' },
              { value: 'price_desc', label: 'Price — High to Low' },
              { value: 'rating', label: 'Top Rated' },
            ].map(opt => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="sort" checked={sort === opt.value} onChange={() => updateParam('sort', opt.value)} className="accent-[#2874f0]" />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="border-b">
        <button onClick={() => toggle('category')} className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-gray-700">
          Category {openSections.category ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        {openSections.category && (
          <div className="px-4 pb-3 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="cat" checked={!category} onChange={() => updateParam('category', '')} className="accent-[#2874f0]" />
              <span className="text-sm text-gray-700">All</span>
            </label>
            {categories.map(cat => (
              <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="cat" checked={category === cat._id} onChange={() => updateParam('category', cat._id)} className="accent-[#2874f0]" />
                <span className="text-sm text-gray-700">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="border-b">
        <button onClick={() => toggle('price')} className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-gray-700">
          Price {openSections.price ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        {openSections.price && (
          <div className="px-4 pb-3">
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={minPrice} onChange={(e) => updateParam('minPrice', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#2874f0]" />
              <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#2874f0]" />
            </div>
            {[
              { label: 'Under ₹500', min: '', max: '500' },
              { label: '₹500 – ₹2,000', min: '500', max: '2000' },
              { label: '₹2,000 – ₹10,000', min: '2000', max: '10000' },
              { label: 'Above ₹10,000', min: '10000', max: '' },
            ].map(r => (
              <button key={r.label} onClick={() => { updateParam('minPrice', r.min); updateParam('maxPrice', r.max); }}
                className="block w-full text-left text-sm text-gray-600 hover:text-[#2874f0] py-1 mt-1">
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {keyword ? `Results for "${keyword}"` : category ? categories.find(c => c._id === category)?.name || 'Products' : 'All Products'}
            </h1>
            <p className="text-sm text-gray-500">{total} results found</p>
          </div>
          <button onClick={() => setShowFilter(!showFilter)} className="md:hidden flex items-center gap-2 bg-white border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700">
            <FiFilter size={14} /> Filters
          </button>
        </div>

        <div className="flex gap-4">
          {/* Desktop Filter */}
          <div className="hidden md:block w-60 flex-shrink-0"><FilterPanel /></div>

          {/* Mobile Filter Drawer */}
          {showFilter && (
            <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setShowFilter(false)}>
              <div className="absolute left-0 top-0 h-full w-72 bg-white overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="font-bold">Filters</span>
                  <button onClick={() => setShowFilter(false)}><FiX /></button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1">
            {loading ? <Spinner /> : products.length === 0 ? (
              <div className="bg-white text-center py-20 text-gray-400">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg font-medium text-gray-600">No results found</p>
                <button onClick={clearFilters} className="mt-4 text-[#2874f0] hover:underline text-sm">Clear all filters</button>
              </div>
            ) : (
              <>
                <div className="bg-white border border-gray-200">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-l border-t border-gray-200">
                    {products.map(p => (
                      <div key={p._id} className="border-r border-b border-gray-200">
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                </div>
                {pages > 1 && (
                  <div className="flex justify-center gap-1 mt-4">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => updateParam('page', p)}
                        className={`w-9 h-9 text-sm font-medium border transition ${page === p ? 'bg-[#2874f0] text-white border-[#2874f0]' : 'bg-white text-gray-700 border-gray-300 hover:border-[#2874f0] hover:text-[#2874f0]'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
