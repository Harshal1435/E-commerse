import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Spinner from '../../components/Spinner';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiLink, FiUpload } from 'react-icons/fi';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [imageMode, setImageMode] = useState('url');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    API.get('/categories').then(({ data }) => setCategories(data.categories)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setEditCat(null);
    setForm({ name: '', description: '' });
    setImageUrl(''); setImageFile(null); setImagePreview(''); setImageMode('url');
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditCat(cat);
    setForm({ name: cat.name, description: cat.description || '' });
    setImageUrl(cat.image || ''); setImagePreview(cat.image || '');
    setImageFile(null); setImageMode('url');
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); setImageUrl(''); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl.trim()) {
        formData.append('imageUrl', imageUrl.trim());
      }

      if (editCat) {
        await API.put(`/categories/${editCat._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category updated');
      } else {
        await API.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category created');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch { toast.error('Failed to delete category'); }
  };

  return (
    <div className="flex min-h-screen bg-[#f1f3f6]">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-gray-800">Categories</h1>
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#2874f0] hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition">
            <FiPlus /> Add Category
          </button>
        </div>

        {loading ? <Spinner /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(cat => (
              <div key={cat._id} className="bg-white border border-gray-200 p-4">
                {cat.image && (
                  <img src={cat.image} alt={cat.name} className="w-full h-24 object-contain mb-3 bg-gray-50"
                    onError={(e) => { e.target.style.display = 'none'; }} />
                )}
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm">{cat.name}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(cat)} className="p-1 text-[#2874f0] hover:bg-blue-50 rounded transition"><FiEdit2 size={13} /></button>
                    <button onClick={() => handleDelete(cat._id)} className="p-1 text-red-500 hover:bg-red-50 rounded transition"><FiTrash2 size={13} /></button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{cat.description || 'No description'}</p>
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
            {categories.length === 0 && <div className="col-span-4 text-center py-12 text-gray-500">No categories yet</div>}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-xl p-6 w-full max-w-md rounded">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">{editCat ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]" placeholder="e.g. Electronics" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0] resize-none" placeholder="Optional description..." />
              </div>

              {/* Image */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Image</label>
                <div className="flex border border-gray-300 rounded overflow-hidden w-fit mb-2">
                  <button type="button" onClick={() => { setImageMode('url'); setImageFile(null); }}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition ${imageMode === 'url' ? 'bg-[#2874f0] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                    <FiLink size={11} /> URL
                  </button>
                  <button type="button" onClick={() => { setImageMode('file'); setImageUrl(''); setImagePreview(''); }}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition ${imageMode === 'file' ? 'bg-[#2874f0] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                    <FiUpload size={11} /> Upload
                  </button>
                </div>

                {imageMode === 'url' ? (
                  <input type="url" value={imageUrl}
                    onChange={(e) => { setImageUrl(e.target.value); setImagePreview(e.target.value); }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]" />
                ) : (
                  <input type="file" accept="image/*" onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                )}

                {imagePreview && (
                  <img src={imagePreview} alt="preview" className="mt-2 w-20 h-20 object-contain border border-gray-200 rounded bg-gray-50"
                    onError={(e) => { e.target.style.display = 'none'; }} />
                )}
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#2874f0] hover:bg-blue-700 disabled:bg-blue-300 text-white py-2.5 font-semibold text-sm transition">
                  {saving ? 'Saving...' : editCat ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5 text-sm transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
