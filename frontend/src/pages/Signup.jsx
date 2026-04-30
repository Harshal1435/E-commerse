import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password, form.role);
      toast.success(data.message);
      if (data.user.role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl flex shadow-lg rounded overflow-hidden">
        {/* Left */}
        <div className="hidden md:flex flex-col justify-between bg-[#2874f0] text-white p-10 w-2/5">
          <div>
            <h1 className="text-3xl font-bold mb-3">Looks like you're new here!</h1>
            <p className="text-blue-100 text-sm leading-relaxed">Sign up with your details to get started</p>
          </div>
          <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/login_img_c4a81e.png" alt="" className="w-48 mx-auto opacity-80" onError={(e) => e.target.style.display = 'none'} />
        </div>

        {/* Right */}
        <div className="flex-1 bg-white p-8">
          <div className="md:hidden text-center mb-6">
            <span className="text-2xl font-bold text-[#2874f0]">ShopZone</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter Full Name"
              className="w-full border-b-2 border-gray-300 focus:border-[#2874f0] px-1 py-2 text-sm outline-none transition" />
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter Email"
              className="w-full border-b-2 border-gray-300 focus:border-[#2874f0] px-1 py-2 text-sm outline-none transition" />
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter Password (min 6 chars)"
              className="w-full border-b-2 border-gray-300 focus:border-[#2874f0] px-1 py-2 text-sm outline-none transition" />

            {/* Role */}
            <div>
              <p className="text-xs text-gray-500 mb-2">I want to</p>
              <div className="flex gap-3">
                {[{ value: 'user', label: '🛍️ Shop', desc: 'Buy products' }, { value: 'vendor', label: '🏪 Sell', desc: 'Sell products' }].map(opt => (
                  <button key={opt.value} type="button" onClick={() => setForm({ ...form, role: opt.value })}
                    className={`flex-1 p-3 rounded border-2 text-center text-sm transition ${form.role === opt.value ? 'border-[#2874f0] bg-blue-50 text-[#2874f0]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <div className="text-lg">{opt.label.split(' ')[0]}</div>
                    <div className="font-semibold">{opt.label.split(' ')[1]}</div>
                    <div className="text-xs text-gray-400">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {form.role === 'vendor' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-700">
                ⚠️ Vendor accounts require admin approval before you can start selling.
              </div>
            )}

            <p className="text-xs text-gray-500">
              By continuing, you agree to ShopZone's <span className="text-[#2874f0]">Terms of Use</span> and <span className="text-[#2874f0]">Privacy Policy</span>.
            </p>

            <button type="submit" disabled={loading}
              className="w-full bg-[#fb641b] hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded font-semibold text-sm transition">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <div className="text-center text-sm text-gray-500">OR</div>
            <Link to="/login" className="block w-full text-center border border-[#2874f0] text-[#2874f0] py-3 rounded font-semibold text-sm hover:bg-blue-50 transition">
              Existing User? Log in
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
