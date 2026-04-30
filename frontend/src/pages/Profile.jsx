import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiSave, FiPackage, FiMapPin } from 'react-icons/fi';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: user?.address?.street || '', city: user?.address?.city || '',
    state: user?.address?.state || '', pincode: user?.address?.pincode || '',
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/users/profile', {
        name: form.name, phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
      });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwords.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await API.put('/users/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed! Please login again.');
      logout();
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setLoading(false); }
  };

  const tabs = [
    { id: 'profile', icon: <FiUser size={16} />, label: 'Personal Info' },
    { id: 'address', icon: <FiMapPin size={16} />, label: 'Manage Addresses' },
    { id: 'password', icon: <FiLock size={16} />, label: 'Change Password' },
    { id: 'orders', icon: <FiPackage size={16} />, label: 'My Orders', link: '/orders' },
  ];

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Sidebar */}
          <div className="bg-white border border-gray-200 h-fit">
            <div className="flex items-center gap-3 p-5 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#2874f0] flex items-center justify-center text-white text-xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-500">Hello,</p>
                <p className="font-bold text-gray-800 text-sm">{user?.name}</p>
              </div>
            </div>
            <nav className="py-2">
              {tabs.map(t => (
                t.link ? (
                  <a key={t.id} href={t.link} className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2874f0] transition">
                    {t.icon} {t.label}
                  </a>
                ) : (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`flex items-center gap-3 px-5 py-3 text-sm w-full text-left transition ${tab === t.id ? 'text-[#2874f0] bg-blue-50 border-l-2 border-[#2874f0] font-semibold' : 'text-gray-700 hover:bg-blue-50 hover:text-[#2874f0]'}`}>
                    {t.icon} {t.label}
                  </button>
                )
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3 bg-white border border-gray-200 p-6">
            {tab === 'profile' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Personal Information</h2>
                <p className="text-xs text-gray-500 mb-5">Manage your personal information</p>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Mobile Number</label>
                      <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Email Address (cannot change)</label>
                      <input type="email" value={user?.email} disabled
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 text-gray-400" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="flex items-center gap-2 bg-[#2874f0] hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-2.5 rounded font-semibold text-sm transition">
                    <FiSave size={14} /> {loading ? 'Saving...' : 'Save'}
                  </button>
                </form>
              </>
            )}

            {tab === 'address' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Manage Addresses</h2>
                <p className="text-xs text-gray-500 mb-5">Add and manage your delivery addresses</p>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Street Address</label>
                      <input type="text" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]" />
                    </div>
                    {[{ key: 'city', label: 'City' }, { key: 'state', label: 'State' }, { key: 'pincode', label: 'Pincode' }].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                        <input type="text" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]" />
                      </div>
                    ))}
                  </div>
                  <button type="submit" disabled={loading}
                    className="flex items-center gap-2 bg-[#2874f0] hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-2.5 rounded font-semibold text-sm transition">
                    <FiSave size={14} /> {loading ? 'Saving...' : 'Save Address'}
                  </button>
                </form>
              </>
            )}

            {tab === 'password' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Change Password</h2>
                <p className="text-xs text-gray-500 mb-5">For your account's security, do not share your password</p>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
                  {[{ key: 'currentPassword', label: 'Current Password' }, { key: 'newPassword', label: 'New Password' }, { key: 'confirmPassword', label: 'Confirm New Password' }].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                      <input type="password" value={passwords[f.key]} onChange={(e) => setPasswords({ ...passwords, [f.key]: e.target.value })} required
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]" />
                    </div>
                  ))}
                  <button type="submit" disabled={loading}
                    className="flex items-center gap-2 bg-[#2874f0] hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-2.5 rounded font-semibold text-sm transition">
                    <FiLock size={14} /> {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
