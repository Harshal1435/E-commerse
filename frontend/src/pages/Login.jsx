import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success('Welcome back!');
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl flex shadow-lg rounded overflow-hidden">
        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-between bg-[#2874f0] text-white p-10 w-2/5">
          <div>
            <h1 className="text-3xl font-bold mb-3">Login</h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Get access to your Orders, Wishlist and Recommendations
            </p>
          </div>
          <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/login_img_c4a81e.png" alt="login" className="w-48 mx-auto opacity-80" onError={(e) => e.target.style.display = 'none'} />
        </div>

        {/* Right panel */}
        <div className="flex-1 bg-white p-8 flex flex-col justify-center">
          <div className="md:hidden text-center mb-6">
            <span className="text-2xl font-bold text-[#2874f0]">ShopZone</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter Email"
                className="w-full border-b-2 border-gray-300 focus:border-[#2874f0] px-1 py-2 text-sm outline-none transition" />
            </div>
            <div>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter Password"
                className="w-full border-b-2 border-gray-300 focus:border-[#2874f0] px-1 py-2 text-sm outline-none transition" />
            </div>
            <p className="text-xs text-gray-500">
              By continuing, you agree to ShopZone's{' '}
              <span className="text-[#2874f0] cursor-pointer">Terms of Use</span> and{' '}
              <span className="text-[#2874f0] cursor-pointer">Privacy Policy</span>.
            </p>
            <button type="submit" disabled={loading}
              className="w-full bg-[#fb641b] hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded font-semibold text-sm transition">
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="text-center text-sm text-gray-500">OR</div>
            <Link to="/signup"
              className="block w-full text-center border border-[#2874f0] text-[#2874f0] py-3 rounded font-semibold text-sm hover:bg-blue-50 transition">
              Create New Account
            </Link>
          </form>
          <div className="mt-5 p-3 bg-blue-50 rounded text-xs text-blue-700 border border-blue-100">
            <strong>Demo:</strong> admin@shopzone.com / admin123 &nbsp;|&nbsp; user1@shopzone.com / user123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
