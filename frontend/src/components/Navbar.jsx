import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiChevronDown } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?keyword=${searchQuery}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'vendor') return '/vendor/dashboard';
    return '/dashboard';
  };

  return (
    <nav className="bg-[#2874f0] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 h-14">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex flex-col leading-none">
            <span className="text-white font-bold text-xl tracking-tight">ShopZone</span>
            <span className="text-[#ffe500] text-[10px] italic font-medium">Explore <span className="text-white">Plus</span> ✦</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="flex w-full bg-white rounded overflow-hidden shadow-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more"
                className="flex-1 px-4 py-2 text-sm text-gray-800 focus:outline-none"
              />
              <button type="submit" className="bg-white px-4 py-2 text-[#2874f0] hover:bg-gray-50 transition border-l">
                <FiSearch size={20} />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Login / User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 bg-white text-[#2874f0] px-4 py-1.5 rounded text-sm font-semibold hover:bg-gray-50 transition"
                >
                  <FiUser size={15} />
                  <span className="hidden md:block">{user.name?.split(' ')[0]}</span>
                  <FiChevronDown size={13} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded shadow-xl py-1 z-50 border border-gray-100">
                    <div className="px-4 py-2 border-b">
                      <p className="text-xs text-gray-500">Hello,</p>
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    </div>
                    <Link to={getDashboardLink()} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-sm text-gray-700"><MdDashboard size={15} /> Dashboard</Link>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-sm text-gray-700"><FiUser size={15} /> My Profile</Link>
                    {user.role === 'user' && (
                      <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-sm text-gray-700"><FiPackage size={15} /> My Orders</Link>
                    )}
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-sm text-red-500 w-full"><FiLogOut size={15} /> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-white text-[#2874f0] px-6 py-1.5 rounded text-sm font-bold hover:bg-gray-50 transition">
                Login
              </Link>
            )}

            {/* Become Seller */}
            <Link to="/signup" className="hidden md:block text-white text-sm font-medium hover:text-yellow-300 transition whitespace-nowrap">
              Become a Seller
            </Link>

            {/* Cart */}
            {user?.role === 'user' && (
              <Link to="/cart" className="flex items-center gap-1.5 text-white hover:text-yellow-300 transition px-2">
                <div className="relative">
                  <FiShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#ff6161] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium">Cart</span>
              </Link>
            )}

            {/* Mobile menu */}
            <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {menuOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="flex bg-white rounded overflow-hidden mb-2">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="flex-1 px-3 py-2 text-sm text-gray-800 focus:outline-none" />
              <button type="submit" className="px-3 text-[#2874f0]"><FiSearch size={18} /></button>
            </form>
            <div className="flex flex-col gap-1 text-sm text-white">
              <Link to="/products" onClick={() => setMenuOpen(false)} className="py-1 hover:text-yellow-300">All Products</Link>
              {!user && <Link to="/signup" onClick={() => setMenuOpen(false)} className="py-1 hover:text-yellow-300">Become a Seller</Link>}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
