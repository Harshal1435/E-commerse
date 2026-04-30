import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import API from '../api/axios';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const catIcons = {
  'Electronics': '📱', 'Fashion': '👗', 'Home & Kitchen': '🏠',
  'Books': '📚', 'Sports & Fitness': '🏋️', 'Beauty & Health': '💄',
  'Toys & Games': '🎮', 'Automotive': '🚗',
};

const banners = [
  { bg: 'from-blue-600 to-blue-800', title: 'Electronics Sale', sub: 'Up to 40% off on mobiles & laptops', emoji: '📱', link: '/products?category=' },
  { bg: 'from-pink-500 to-rose-600', title: 'Fashion Week', sub: 'Trending styles at best prices', emoji: '👗', link: '/products' },
  { bg: 'from-green-500 to-emerald-700', title: 'Home Essentials', sub: 'Upgrade your home today', emoji: '🏠', link: '/products' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get('/products?limit=10'),
          API.get('/categories'),
        ]);
        setProducts(Array.isArray(prodRes.data?.products) ? prodRes.data.products : []);
        setCategories(Array.isArray(catRes.data?.categories) ? catRes.data.categories : []);
      } catch (err) {
        setProducts([]); setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const t = setInterval(() => setActiveBanner(b => (b + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?keyword=${searchQuery}`);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />

      {/* Category strip */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 hover:text-[#2874f0] transition group"
              >
                <span className="text-2xl">{catIcons[cat.name] || '🛍️'}</span>
                <span className="text-xs font-medium text-gray-700 group-hover:text-[#2874f0] whitespace-nowrap">{cat.name}</span>
                <div className="h-0.5 w-0 group-hover:w-full bg-[#2874f0] transition-all duration-200 rounded" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* Banner */}
          <div className="lg:col-span-3">
            <div className={`relative bg-gradient-to-r ${banners[activeBanner].bg} rounded-sm overflow-hidden h-56 md:h-72 flex items-center px-10`}>
              <div className="text-white z-10">
                <p className="text-sm font-medium opacity-80 mb-1">Limited Time Offer</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{banners[activeBanner].title}</h2>
                <p className="text-base opacity-90 mb-4">{banners[activeBanner].sub}</p>
                <Link to={banners[activeBanner].link} className="bg-white text-[#2874f0] px-6 py-2 rounded font-bold text-sm hover:bg-gray-100 transition inline-flex items-center gap-2">
                  Shop Now <FiArrowRight />
                </Link>
              </div>
              <div className="absolute right-10 text-9xl opacity-20 select-none">{banners[activeBanner].emoji}</div>
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {banners.map((_, i) => (
                  <button key={i} onClick={() => setActiveBanner(i)} className={`w-2 h-2 rounded-full transition ${i === activeBanner ? 'bg-white' : 'bg-white/40'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Side banners */}
          <div className="hidden lg:flex flex-col gap-4">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-sm p-5 text-white flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium opacity-80">New Arrivals</p>
                <h3 className="text-xl font-bold mt-1">Best Deals</h3>
                <p className="text-xs opacity-80 mt-1">Grab before they're gone</p>
              </div>
              <Link to="/products" className="text-xs font-bold bg-white text-orange-500 px-3 py-1.5 rounded inline-block mt-3 hover:bg-gray-100 transition">
                Explore →
              </Link>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-sm p-5 text-white flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium opacity-80">Sell Online</p>
                <h3 className="text-xl font-bold mt-1">Become a Seller</h3>
                <p className="text-xs opacity-80 mt-1">Reach millions of buyers</p>
              </div>
              <Link to="/signup" className="text-xs font-bold bg-white text-purple-600 px-3 py-1.5 rounded inline-block mt-3 hover:bg-gray-100 transition">
                Start Selling →
              </Link>
            </div>
          </div>
        </div>

        {/* Features strip */}
        <div className="bg-white rounded-sm mt-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {[
            { icon: <FiTruck className="text-[#2874f0]" size={22} />, title: 'Free Delivery', desc: 'On orders above ₹499' },
            { icon: <FiShield className="text-[#2874f0]" size={22} />, title: 'Secure Payment', desc: '100% secure transactions' },
            { icon: <FiRefreshCw className="text-[#2874f0]" size={22} />, title: 'Easy Returns', desc: '7-day return policy' },
            { icon: <FiHeadphones className="text-[#2874f0]" size={22} />, title: '24/7 Support', desc: 'Always here to help' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              {f.icon}
              <div>
                <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Products */}
        <div className="bg-white rounded-sm mt-4 p-4">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
            <Link to="/products" className="text-sm text-[#2874f0] font-semibold hover:underline flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <Spinner />
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📦</div>
              <p>No products yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0 border-l border-t border-gray-200">
              {products.map((p) => (
                <div key={p._id} className="border-r border-b border-gray-200">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category sections */}
        {categories.slice(0, 4).map((cat) => {
          const catProducts = products.filter(p => p.category?._id === cat._id || p.category?.name === cat.name).slice(0, 4);
          if (catProducts.length === 0) return null;
          return (
            <div key={cat._id} className="bg-white rounded-sm mt-4 p-4">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h2 className="text-xl font-bold text-gray-800">{catIcons[cat.name] || '🛍️'} {cat.name}</h2>
                <Link to={`/products?category=${cat._id}`} className="text-sm text-[#2874f0] font-semibold hover:underline flex items-center gap-1">
                  See All <FiArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-l border-t border-gray-200">
                {catProducts.map(p => (
                  <div key={p._id} className="border-r border-b border-gray-200">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
