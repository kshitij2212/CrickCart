import { useState, useEffect } from 'react';
import { X, Upload, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    countInStock: '',
    category: '',
    brand: '',
    rating: 0,
    numReviews: 0,
    isFeatured: false,
  });

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data || []);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
    toast.success(`${files.length} image(s) selected`);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discount: '',
      countInStock: '',
      category: '',
      brand: '',
      rating: 0,
      numReviews: 0,
      isFeatured: false,
    });
    setImageFiles([]);
    setImagePreviews([]);
    setHoveredStar(0);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Upload images
      let imageUrls = [];
      if (imageFiles.length > 0) {
        const formDataImg = new FormData();
        imageFiles.forEach(file => formDataImg.append('images', file));
        const { data: uploadRes } = await api.post('/products/upload', formDataImg, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrls = uploadRes.images;
      }

      // Step 2: Create product
      await api.post('/products/create', {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        discount: Number(formData.discount) || 0,
        countInStock: Number(formData.countInStock),
        category: formData.category,
        brand: formData.brand,
        rating: Number(formData.rating),
        numReviews: Number(formData.numReviews),
        isFeatured: formData.isFeatured,
        images: imageUrls,
      });

      toast.success('Product added successfully!');
      handleClose();
      onSuccess();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black italic text-[#00171f]">ADD NEW PRODUCT</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Name */}
          <div>
            <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">PRODUCT NAME *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded focus:border-[#00a8e8] focus:outline-none"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">DESCRIPTION *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded focus:border-[#00a8e8] focus:outline-none"
              placeholder="Enter product description"
            />
          </div>

          {/* Price, Discount, Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">PRICE (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded focus:border-[#00a8e8] focus:outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">DISCOUNT (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded focus:border-[#00a8e8] focus:outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">STOCK *</label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded focus:border-[#00a8e8] focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">CATEGORY *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded focus:border-[#00a8e8] focus:outline-none"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">BRAND *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded focus:border-[#00a8e8] focus:outline-none"
                placeholder="Enter brand name"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">
              RATING — {formData.rating}/5
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredStar || formData.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {formData.rating > 0 && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: 0 }))}
                  className="ml-2 text-xs text-gray-400 hover:text-red-500 transition"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Num Reviews */}
            <div className="mt-3">
              <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">NUMBER OF REVIEWS</label>
              <input
                type="number"
                name="numReviews"
                value={formData.numReviews}
                onChange={handleChange}
                min="0"
                className="w-40 px-4 py-2 border-2 border-gray-200 rounded focus:border-[#00a8e8] focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 accent-[#00a8e8]"
            />
            <label htmlFor="isFeatured" className="text-sm font-bold">MARK AS FEATURED</label>
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">PRODUCT IMAGES *</label>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mb-3">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="border-dashed border-2 border-gray-300 p-6 text-center block cursor-pointer rounded hover:border-[#00a8e8] transition">
              <Upload className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">
                {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'Click to upload images'}
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded font-bold hover:bg-gray-50 transition"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#00a8e8] text-white font-bold rounded hover:bg-[#0095d1] transition disabled:opacity-50"
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