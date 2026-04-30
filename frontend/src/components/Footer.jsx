import { Link } from 'react-router-dom';
import { FiTwitter, FiYoutube, FiFacebook, FiInstagram } from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-[#172337] text-gray-300 mt-8">
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
        <div>
          <h4 className="text-gray-500 font-semibold uppercase tracking-widest mb-3 text-[11px]">About</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white transition">About ShopZone</Link></li>
            <li><Link to="/products" className="hover:text-white transition">Careers</Link></li>
            <li><Link to="/" className="hover:text-white transition">Press</Link></li>
            <li><Link to="/" className="hover:text-white transition">Corporate Information</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-500 font-semibold uppercase tracking-widest mb-3 text-[11px]">Help</h4>
          <ul className="space-y-2">
            <li><Link to="/orders" className="hover:text-white transition">Payments</Link></li>
            <li><Link to="/orders" className="hover:text-white transition">Shipping</Link></li>
            <li><Link to="/orders" className="hover:text-white transition">Cancellation & Returns</Link></li>
            <li><Link to="/orders" className="hover:text-white transition">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-500 font-semibold uppercase tracking-widest mb-3 text-[11px]">Policy</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white transition">Return Policy</Link></li>
            <li><Link to="/" className="hover:text-white transition">Terms of Use</Link></li>
            <li><Link to="/" className="hover:text-white transition">Security</Link></li>
            <li><Link to="/" className="hover:text-white transition">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-500 font-semibold uppercase tracking-widest mb-3 text-[11px]">Social</h4>
          <ul className="space-y-2">
            <li><a href="#" className="flex items-center gap-2 hover:text-white transition"><FiFacebook size={13} /> Facebook</a></li>
            <li><a href="#" className="flex items-center gap-2 hover:text-white transition"><FiTwitter size={13} /> Twitter</a></li>
            <li><a href="#" className="flex items-center gap-2 hover:text-white transition"><FiYoutube size={13} /> YouTube</a></li>
            <li><a href="#" className="flex items-center gap-2 hover:text-white transition"><FiInstagram size={13} /> Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex flex-wrap gap-6 items-center">
          <Link to="/signup" className="flex items-center gap-2 hover:text-white transition">
            <span className="text-yellow-400">🏪</span> Sell on ShopZone
          </Link>
          <Link to="/vendor/dashboard" className="flex items-center gap-2 hover:text-white transition">
            <span>📦</span> Advertise
          </Link>
          <span className="flex items-center gap-2">
            <span>💳</span> ShopZone Pay
          </span>
        </div>
        <p>© {new Date().getFullYear()} ShopZone.com</p>
      </div>
    </div>
  </footer>
);

export default Footer;
