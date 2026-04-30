import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Spinner from '../../components/Spinner';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiTrash2, FiCheck, FiX } from 'react-icons/fi';

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = () => {
    API.get('/admin/vendors').then(({ data }) => setVendors(data.vendors)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchVendors(); }, []);

  const handleApprove = async (id, isApproved) => {
    try {
      await API.put(`/admin/vendors/${id}/approve`, { isApproved });
      toast.success(`Vendor ${isApproved ? 'approved' : 'rejected'}`);
      fetchVendors();
    } catch { toast.error('Failed to update vendor'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vendor?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('Vendor deleted');
      fetchVendors();
    } catch { toast.error('Failed to delete vendor'); }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Vendors ({vendors.length})</h1>
        {loading ? <Spinner /> : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>{['Vendor', 'Email', 'Status', 'Joined', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y">
                  {vendors.map(v => (
                    <tr key={v._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600">{v.name?.charAt(0)}</div>
                          <span className="font-medium text-gray-800">{v.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{v.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${v.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {v.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{new Date(v.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {!v.isApproved
                            ? <button onClick={() => handleApprove(v._id, true)} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition" title="Approve"><FiCheck size={14} /></button>
                            : <button onClick={() => handleApprove(v._id, false)} className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition" title="Reject"><FiX size={14} /></button>
                          }
                          <button onClick={() => handleDelete(v._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><FiTrash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {vendors.length === 0 && <div className="text-center py-12 text-gray-500">No vendors found</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVendors;
