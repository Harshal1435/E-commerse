import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VendorSidebar from '../../components/VendorSidebar';
import Spinner from '../../components/Spinner';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    API.get('/vendor/products').then(({ data }) => setProducts(data.products)).finally(() => setLoading(false));
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
      <VendorSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
          <Link to="/vendor/products/add" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            <FiPlus /> Add Product
          </Link>
        </div>
        {loading ? <Spinner /> : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-gray-500 mb-4">No products yet</p>
            <Link to="/vendor/products/add" className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm">Add Your First Product</Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>{['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y">
                  {products.map(p => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image || 'https://placehold.co/40'} alt={p.name} className="w-10 h-10 rounded-lg object-cover" onError={(e) => { e.target.src = 'https://placehold.co/40'; }} />
                          <span className="font-medium text-gray-800 max-w-40 truncate">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.category?.name}</td>
                      <td className="px-4 py-3 font-bold text-gray-800">₹{p.price?.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={p.stock > 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>{p.stock}</span></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link to={`/vendor/products/edit/${p._id}`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"><FiEdit2 size={14} /></Link>
                          <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><FiTrash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProducts;
