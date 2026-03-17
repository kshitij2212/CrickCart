// src/components/admin/AddProductModal.jsx
import { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    countInStock: '',
    category: '',
    brand: '',
    images: [],
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data || data.categories || data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // ✅ Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      
      if (!validTypes.includes(file.type)) {
        toast.error(
          `❌ ${file.name} format not supported!\nPlease use: JPG, PNG, WebP, or GIF`, 
          {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: '#fff',
            }
          }
        );
        return;
      }

      // ✅ Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          `❌ ${file.name} is too large!\nMax size: 5MB`, 
          {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff',
            }
          }
        );
        return;
      }

      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
        toast.success(`✅ ${file.name} added!`, { duration: 2000 });
      };
      
      reader.onerror = () => {
        toast.error(`Failed to read ${file.name}`);
      };
      
      reader.readAsDataURL(file);
    });

    // Reset input value to allow re-uploading same file
    e.target.value = '';
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    toast.success('Image removed', { duration: 1500 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
        category: formData.category,
        brand: formData.brand,
        images: formData.images,
      };

      const { data } = await api.post('/products', productData);
      
      toast.success('Product added successfully!', {
        icon: '🎉',
        duration: 3000,
      });

      setFormData({
        name: '',
        description: '',
        price: '',
        countInStock: '',
        category: '',
        brand: '',
        images: [],
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black italic text-navy">ADD NEW PRODUCT</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">PRODUCT NAME *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-primary focus:outline-none"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">DESCRIPTION *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-primary focus:outline-none"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">PRICE (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-primary focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">STOCK *</label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-primary focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">CATEGORY *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-primary focus:outline-none"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">BRAND</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-primary focus:outline-none"
                placeholder="Enter brand name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              PRODUCT IMAGES (JPG, PNG, WebP only)
            </label>
            
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded p-6 cursor-pointer hover:border-primary transition">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">Click to upload images</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <p className="text-xs text-gray-500 mt-2">
              📌 Supported: JPG, PNG, WebP, GIF • Max size: 5MB per image
            </p>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded font-bold hover:bg-gray-50 transition"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-navy font-bold rounded hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {loading ? 'ADDING...' : 'ADD PRODUCT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;