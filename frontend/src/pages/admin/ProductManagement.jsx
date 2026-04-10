import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import productService from '../../services/productService';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AddProductModal from './AddProductModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    productId: null,
    productName: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const [totalProducts, setTotalProducts] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch]);

  const fetchProducts = async (searchParam) => {
    setLoading(true);
    try {
      const params = { limit: ITEMS_PER_PAGE, page: currentPage };
      const searchValue = typeof searchParam === 'string' ? searchParam : debouncedSearch;
      if (searchValue && searchValue.trim()) params.search = searchValue.trim();

      const data = await productService.getProducts(params);
      setProducts(data.data || []);
      setTotalProducts(data.total || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setConfirmDialog({
      isOpen: true,
      productId: product.id,
      productName: product.name,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await productService.deleteProduct(confirmDialog.productId);
      toast.success(`"${confirmDialog.productName}" deleted successfully!`);
      setConfirmDialog({ isOpen: false, productId: null, productName: '' });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  const paginatedProducts = products;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black italic font-athletic text-[#00171f]">
          PRODUCT MANAGEMENT
        </h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#00a8e8] text-white px-6 py-3 font-bold rounded hover:bg-[#0095d1] transition"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00a8e8] focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-bold">Image</th>
                <th className="text-left py-4 px-6 font-bold">Name</th>
                <th className="text-left py-4 px-6 font-bold">Price</th>
                <th className="text-left py-4 px-6 font-bold">Stock</th>
                <th className="text-left py-4 px-6 font-bold">Category</th>
                <th className="text-left py-4 px-6 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a8e8] mx-auto"></div>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-4 px-6 font-medium">{product.name}</td>
                    <td className="py-4 px-6 font-bold">₹{product.price}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded text-xs font-bold ${
                        product.countInStock > 10
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {product.countInStock}
                      </span>
                    </td>
                    <td className="py-4 px-6">{product.category?.name || 'N/A'}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)} of {totalProducts} products
        </p>
        <div className="flex items-center gap-2">
            <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border-2 border-slate-200 hover:border-[#00a8e8] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg border-2 font-bold text-sm transition ${
                        currentPage === page
                            ? 'bg-[#00a8e8] text-white border-[#00a8e8]'
                            : 'border-slate-200 hover:border-[#00a8e8]'
                    }`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border-2 border-slate-200 hover:border-[#00a8e8] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    </div>
    )}
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchProducts}
        product={editingProduct}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, productId: null, productName: '' })}
        onConfirm={handleDeleteConfirm}
        title="DELETE PRODUCT"
        message={`Are you sure you want to delete "${confirmDialog.productName}"? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
};

export default ProductManagement;