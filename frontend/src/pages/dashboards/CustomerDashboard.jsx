import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Spinner from '../../components/Spinner';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { FiPackage, FiShoppingCart, FiTruck } from 'react-icons/fi';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my').then(({ data }) => setOrders(Array.isArray(data?.orders) ? data.orders : [])).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: <FiPackage />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Delivered', value: orders.filter(o => o.orderStatus === 'Delivered').length, icon: <FiTruck />, color: 'bg-green-100 text-green-600' },
    { label: 'In Progress', value: orders.filter(o => !['Delivered', 'Cancelled', 'Returned'].includes(o.orderStatus)).length, icon: <FiShoppingCart />, color: 'bg-orange-100 text-orange-600' },
    { label: 'Cancelled', value: orders.filter(o => o.orderStatus === 'Cancelled').length, icon: <FiPackage />, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-6 text-white mb-8">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-300 mt-1">Here's your shopping overview</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
            <Link to="/orders" className="text-sm text-orange-500 hover:underline">View All</Link>
          </div>
          {loading ? <Spinner /> : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No orders yet.</p>
              <Link to="/products" className="text-orange-500 hover:underline text-sm mt-2 inline-block">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">₹{order.totalAmount?.toLocaleString()}</span>
                    <Link to={`/orders/${order._id}/track`} className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600 transition">Track</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
