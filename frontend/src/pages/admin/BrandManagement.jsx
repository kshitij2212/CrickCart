import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import brandService from '../../services/brandService';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: '',
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    brandId: null,
    brandName: '',
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await brandService.getBrands();
      setBrands(data.data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log('Submitting brand:', formData);
  
  try {
    if (editingBrand) {
      await brandService.updateBrand(editingBrand._id, formData);
      toast.success('Brand updated successfully!');
    } else {
      console.log('Creating new brand...');
      const response = await brandService.createBrand(formData);
      console.log('✅ Brand created:', response);
      toast.success('Brand created successfully!');
    }
    setShowModal(false);
    setFormData({ name: '', slug: '', logo: '' });
    setEditingBrand(null);
    fetchBrands();
  } catch (error) {
    console.error('Brand error:', error);
    console.error('Error response:', error.response?.data);
    toast.error(error.response?.data?.message || 'Failed to save brand');
  }
};

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
    });
    setShowModal(true);
  };

  const handleDeleteClick = (brand) => {
    setConfirmDialog({
      isOpen: true,
      brandId: brand._id,
      brandName: brand.name,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await brandService.deleteBrand(confirmDialog.brandId);
      toast.success(`Brand "${confirmDialog.brandName}" deleted successfully!`);
      fetchBrands();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete brand');
    }
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, name, slug });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black italic font-athletic text-[#00171f]">
          BRAND MANAGEMENT
        </h1>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingBrand(null);
            setFormData({ name: '', slug: '', logo: '' });
          }}
          className="flex items-center gap-2 bg-[#00a8e8] text-white px-6 py-3 font-bold rounded hover:bg-[#0095d1] transition"
        >
          <Plus className="w-5 h-5" />
          Add Brand
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a8e8]"></div>
          </div>
        ) : brands.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No brands found
          </div>
        ) : (
          brands.map((brand) => (
            <div
              key={brand._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition border border-slate-100"
            >
              <div className="relative h-48 bg-slate-50 flex items-center justify-center p-6">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="font-athletic font-black italic text-xl text-[#00171f] mb-1 uppercase">
                  {brand.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">/{brand.slug}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(brand)}
                    className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded transition font-bold text-sm"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(brand)}
                    className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded transition font-bold text-sm"
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-black italic font-athletic mb-6">
              {editingBrand ? 'EDIT BRAND' : 'ADD BRAND'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">BRAND NAME *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-2 border-2 border-slate-300 rounded focus:border-[#00a8e8] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">SLUG *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-slate-300 rounded focus:border-[#00a8e8] focus:outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Auto-generated from name</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">LOGO URL *</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-slate-300 rounded focus:border-[#00a8e8] focus:outline-none"
                  placeholder="https://example.com/logo.png"
                  required
                />
                {formData.logo && (
                  <div className="mt-3 p-3 bg-slate-50 rounded">
                    <img
                      src={formData.logo}
                      alt="Preview"
                      className="max-h-24 mx-auto object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#00a8e8] text-white font-black py-3 rounded hover:bg-[#0095d1] transition"
                >
                  {editingBrand ? 'UPDATE' : 'CREATE'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingBrand(null);
                    setFormData({ name: '', slug: '', logo: '' });
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 font-black py-3 rounded hover:bg-gray-300 transition"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, brandId: null, brandName: '' })}
        onConfirm={handleDeleteConfirm}
        title="DELETE BRAND"
        message={`Are you sure you want to delete brand "${confirmDialog.brandName}"? All products with this brand will be affected.`}
        type="danger"
      />
    </div>
  );
};

export default BrandManagement;