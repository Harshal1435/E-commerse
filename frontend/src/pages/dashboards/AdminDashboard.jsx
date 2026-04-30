import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import Spinner from '../../components/Spinner';
import API from '../../api/axios';
import { MdPeople, MdStorefront, MdInventory, MdShoppingBag, MdAttachMoney, MdPending } from 'react-icons/md';

const statusColors = {
  'Order Placed': 'bg-blue-100 text-blue-700',
  'Delivered': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
  'Shipped': 'bg-purple-100 text-purple-700',
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard').then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, []);

  const statCards = data ? [
    { label: 'Total Users', value: data.stats.totalUsers, icon: <MdPeople />, color: 'bg-blue-100 text-blue-600', link: '/admin/users' },
    { label: 'Total Vendors', value: data.stats.totalVendors, icon: <MdStorefront />, color: 'bg-purple-100 text-purple-600', link: '/admin/vendors' },
    { label: 'Total Products', value: data.stats.totalProducts, icon: <MdInventory />, color: 'bg-orange-100 text-orange-600', link: '/admin/products' },
    { label: 'Total Orders', value: data.stats.totalOrders, icon: <MdShoppingBag />, color: 'bg-green-100 text-green-600', link: '/admin/orders' },
    { label: 'Revenue', value: `₹${data.stats.totalRevenue?.toLocaleString()}`, icon: <MdAttachMoney />, color: 'bg-emerald-100 text-emerald-600', link: '/admin/orders' },
    { label: 'Pending Vendors', value: data.stats.pendingVendors, icon: <MdPending />, color: 'bg-yellow-100 text-yellow-600', link: '/admin/vendors' },
  ] : [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Platform overview and management</p>
        </div>
        {loading ? <Spinner /> : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {statCards.map((s, i) => (
                <Link key={i} to={s.link} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3 ${s.color}`}>{s.icon}</div>
                  <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </Link>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Recent Orders</h2>
                <Link to="/admin/orders" className="text-sm text-orange-500 hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      {['Order #', 'Customer', 'Amount', 'Status', 'Date'].map(h => <th key={h} className="pb-3 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data?.recentOrders?.map(order => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="py-3 font-medium text-orange-500">#{order.orderNumber}</td>
                        <td className="py-3 text-gray-700">{order.user?.name}</td>
                        <td className="py-3 font-bold">₹{order.totalAmount?.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>{order.orderStatus}</span>
                        </td>
                        <td className="py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
