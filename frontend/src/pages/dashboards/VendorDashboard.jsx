import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VendorSidebar from '../../components/VendorSidebar';
import Spinner from '../../components/Spinner';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { MdInventory, MdShoppingBag, MdAttachMoney, MdPending } from 'react-icons/md';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get('/vendor/dashboard'), API.get('/vendor/orders')])
      .then(([dashRes, ordersRes]) => {
        setStats(dashRes.data.stats);
        setRecentOrders(ordersRes.data.orders.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Products', value: stats.totalProducts, icon: <MdInventory />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <MdShoppingBag />, color: 'bg-purple-100 text-purple-600' },
    { label: 'Revenue', value: `₹${stats.totalRevenue?.toLocaleString()}`, icon: <MdAttachMoney />, color: 'bg-green-100 text-green-600' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: <MdPending />, color: 'bg-orange-100 text-orange-600' },
  ] : [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <VendorSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user?.name}</p>
        </div>
        {loading ? <Spinner /> : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((s, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-5">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3 ${s.color}`}>{s.icon}</div>
                  <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-800">Recent Orders</h2>
                  <Link to="/vendor/orders" className="text-sm text-orange-500 hover:underline">View All</Link>
                </div>
                {recentOrders.length === 0 ? <p className="text-gray-500 text-sm text-center py-4">No orders yet</p> : (
                  <div className="space-y-3">
                    {recentOrders.map(order => (
                      <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">#{order.orderNumber}</p>
                          <p className="text-xs text-gray-500">{order.user?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">₹{order.totalAmount?.toLocaleString()}</p>
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{order.orderStatus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link to="/vendor/products/add" className="flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition">
                    <span className="text-2xl">➕</span>
                    <div><p className="font-medium text-gray-800 text-sm">Add New Product</p><p className="text-xs text-gray-500">List a new product for sale</p></div>
                  </Link>
                  <Link to="/vendor/products" className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                    <span className="text-2xl">📦</span>
                    <div><p className="font-medium text-gray-800 text-sm">Manage Products</p><p className="text-xs text-gray-500">Edit or delete your products</p></div>
                  </Link>
                  <Link to="/vendor/orders" className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition">
                    <span className="text-2xl">🚚</span>
                    <div><p className="font-medium text-gray-800 text-sm">Update Order Status</p><p className="text-xs text-gray-500">Process and ship orders</p></div>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
