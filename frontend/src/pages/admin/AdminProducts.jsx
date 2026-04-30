import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Spinner from '../../components/Spinner';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    API.get('/admin/products').then(({ data }) => setProducts(data.products)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete product'); }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">All Products ({products.length})</h1>
        {loading ? <Spinner /> : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>{['Product', 'Category', 'Vendor', 'Price', 'Stock', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y">
                  {products.map(p => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image || 'https://placehold.co/36'} alt={p.name} className="w-9 h-9 rounded-lg object-cover" onError={(e) => { e.target.src = 'https://placehold.co/36'; }} />
                          <span className="font-medium text-gray-800 max-w-36 truncate">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.category?.name}</td>
                      <td className="px-4 py-3 text-gray-600">{p.vendor?.name}</td>
                      <td className="px-4 py-3 font-bold">₹{p.price?.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={p.stock > 0 ? 'text-green-600' : 'text-red-500'}>{p.stock}</span></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><FiTrash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && <div className="text-center py-12 text-gray-500">No products found</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
