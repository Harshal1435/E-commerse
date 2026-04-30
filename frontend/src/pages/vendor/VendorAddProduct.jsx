import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import VendorSidebar from '../../components/VendorSidebar';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiUpload, FiLink, FiX, FiPlus, FiStar } from 'react-icons/fi';

// One image entry: { type: 'file'|'url', file?: File, url: string, preview: string }
const VendorAddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);          // array of image entries
  const [urlInput, setUrlInput] = useState('');      // current URL being typed
  const [activeImg, setActiveImg] = useState(0);     // index of large preview
  const [form, setForm] = useState({
    name: '', description: '', price: '', originalPrice: '',
    category: '', stock: '', brand: '', tags: '', isActive: true,
  });

  useEffect(() => {
    API.get('/categories').then(({ data }) => setCategories(data.categories));
    if (isEdit) {
      API.get(`/products/${id}`).then(({ data }) => {
        const p = data.product;
        setForm({
          name: p.name, description: p.description, price: p.price,
          originalPrice: p.originalPrice || '', category: p.category?._id || '',
          stock: p.stock, brand: p.brand || '', tags: p.tags?.join(', ') || '',
          isActive: p.isActive,
        });
        // Load existing images as URL entries
        const existing = (p.images?.length ? p.images : p.image ? [p.image] : [])
          .map(url => ({ type: 'url', url, preview: url }));
        setImages(existing);
      });
    }
  }, [id, isEdit]);

  // Add files from file picker
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const newEntries = files.map(file => ({
      type: 'file', file, url: '', preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newEntries].slice(0, 6));
    e.target.value = '';
  };

  // Add URL
  const addUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (images.length >= 6) { toast.error('Max 6 images allowed'); return; }
    setImages(prev => [...prev, { type: 'url', url: trimmed, preview: trimmed }]);
    setUrlInput('');
  };

  // Remove image
  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setActiveImg(prev => Math.max(0, prev - (idx <= prev ? 1 : 0)));
  };

  // Move image to first (make primary)
  const makePrimary = (idx) => {
    setImages(prev => {
      const arr = [...prev];
      const [item] = arr.splice(idx, 1);
      arr.unshift(item);
      return arr;
    });
    setActiveImg(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));

      const urlImages = [];
      const keepImages = []; // existing URLs to keep on edit

      images.forEach(img => {
        if (img.type === 'file' && img.file) {
          formData.append('images', img.file);
        } else if (img.type === 'url' && img.url) {
          urlImages.push(img.url);
          if (isEdit) keepImages.push(img.url);
        }
      });

      if (urlImages.length > 0) formData.append('imageUrls', urlImages.join(','));
      if (isEdit) formData.append('keepImages', JSON.stringify(keepImages));

      if (isEdit) {
        await API.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated!');
      } else {
        await API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created!');
      }
      navigate('/vendor/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen bg-[#f1f3f6]">
      <VendorSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-xl font-bold text-gray-800 mb-5">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <div className="bg-white border border-gray-200 p-6 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Multi-image manager ── */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Product Images <span className="text-gray-400 font-normal">(up to 6 — first image is the main thumbnail)</span>
              </label>

              <div className="flex gap-4">
                {/* Thumbnail strip */}
                <div className="flex flex-col gap-2">
                  {images.map((img, i) => (
                    <div key={i} onClick={() => setActiveImg(i)}
                      className={`relative w-16 h-16 border-2 cursor-pointer flex-shrink-0 bg-gray-50 ${activeImg === i ? 'border-[#2874f0]' : 'border-gray-200 hover:border-gray-400'}`}>
                      <img src={img.preview} alt="" className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = 'https://placehold.co/64?text=?'; }} />
                      {i === 0 && (
                        <span className="absolute top-0 left-0 bg-[#2874f0] text-white text-[8px] px-1 leading-4">MAIN</span>
                      )}
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-600 z-10">
                        <FiX size={8} />
                      </button>
                    </div>
                  ))}

                  {/* Add slot */}
                  {images.length < 6 && (
                    <button type="button" onClick={() => fileInputRef.current.click()}
                      className="w-16 h-16 border-2 border-dashed border-gray-300 hover:border-[#2874f0] flex items-center justify-center text-gray-400 hover:text-[#2874f0] transition flex-shrink-0">
                      <FiPlus size={20} />
                    </button>
                  )}
                </div>

                {/* Large preview */}
                <div className="flex-1 border border-gray-200 bg-gray-50 flex items-center justify-center min-h-56 relative">
                  {images[activeImg] ? (
                    <>
                      <img src={images[activeImg].preview} alt="preview"
                        className="max-h-56 max-w-full object-contain p-4"
                        onError={(e) => { e.target.src = 'https://placehold.co/300?text=Invalid+URL'; }} />
                      {activeImg !== 0 && (
                        <button type="button" onClick={() => makePrimary(activeImg)}
                          className="absolute bottom-2 right-2 flex items-center gap-1 bg-[#2874f0] text-white text-xs px-2 py-1 hover:bg-blue-700 transition">
                          <FiStar size={10} /> Set as Main
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-gray-400 p-8">
                      <FiUpload size={32} className="mx-auto mb-2 opacity-40" />
                      <p className="text-sm">Add images below</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add controls */}
              <div className="mt-3 flex gap-2">
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-1.5 border border-gray-300 text-gray-600 hover:border-[#2874f0] hover:text-[#2874f0] px-3 py-1.5 text-xs font-medium transition">
                  <FiUpload size={12} /> Upload Files
                </button>
                <div className="flex flex-1 gap-2">
                  <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
                    placeholder="Paste image URL and press Add"
                    className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#2874f0]" />
                  <button type="button" onClick={addUrl}
                    className="bg-[#2874f0] hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-semibold transition">
                    Add
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">{images.length}/6 images added</p>
            </div>

            {/* ── Product fields ── */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Product Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]" placeholder="e.g. iPhone 15 Pro" />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Description *</label>
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0] resize-none" placeholder="Describe your product..." />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Price (₹) *</label>
                <input type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]" placeholder="999" />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Original Price (₹)</label>
                <input type="number" min="0" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]" placeholder="1299" />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Category *</label>
                <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Stock *</label>
                <input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]" placeholder="100" />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Brand</label>
                <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]" placeholder="Apple" />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Tags (comma separated)</label>
                <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2874f0]" placeholder="phone, apple, 5g" />
              </div>

              {isEdit && (
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-[#2874f0]" />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Product is active (visible to customers)</label>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={loading}
                className="bg-[#fb641b] hover:bg-orange-600 disabled:bg-orange-300 text-white px-8 py-2.5 font-semibold text-sm transition">
                {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" onClick={() => navigate('/vendor/products')}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 text-sm transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorAddProduct;
