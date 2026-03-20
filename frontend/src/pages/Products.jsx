import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [onSale, setOnSale] = useState(searchParams.get('sale') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, onSale, sortBy, searchQuery]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      console.log('📂 Categories:', data);
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params = {};
      
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);
      if (onSale) params.sale = true;
      if (sortBy) params.sort = sortBy;
      
      console.log('📤 Fetching with params:', params);
      
      const response = await productService.getProducts(params);
      
      console.log('📥 API Response:', response);
      
      const productList = response.data || [];
      
      console.log('✅ Products:', productList);
      
      setProducts(productList);
      
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    console.log('🔄 Category selected:', categoryId);
    setSelectedCategory(categoryId);
    
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
      console.log('🔄 Category selected:', categoryId);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const handlePriceRange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    
    const params = new URLSearchParams(searchParams);
    if (min) {
      params.set('minPrice', min);
    } else {
      params.delete('minPrice');
    }
    if (max) {
      params.set('maxPrice', max);
    } else {
      params.delete('maxPrice');
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setOnSale(false);
    setSortBy('');
    setSearchQuery('');
    setSearchParams({});
  };

  const activeFiltersCount = [
    selectedCategory,
    minPrice,
    maxPrice,
    onSale,
    searchQuery,
  ].filter(Boolean).length;

  const getPageTitle = () => {
    if (searchQuery) return `SEARCH: "${searchQuery.toUpperCase()}"`;
    if (selectedCategory) {
      const cat = categories.find((c) => c._id === selectedCategory);
      return cat?.name.toUpperCase() || 'PRODUCTS';
    }
    if (onSale) return 'SALE ITEMS';
    return 'ALL PRODUCTS';
  };

  if (loading) {
    return (
      <div className="diagonal-bg min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="diagonal-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black italic font-athletic text-[#00171f] mb-2">
            {getPageTitle()}
          </h1>
          <p className="text-[#00a8e8] font-bold italic">
            {products.length} {products.length === 1 ? 'ITEM' : 'ITEMS'} FOUND
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 space-y-6">
            
            {/* Categories */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
              <h3 className="font-athletic font-black italic text-lg text-[#00171f] mb-4">
                CATEGORIES
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-4 py-2 rounded font-bold transition ${
                    selectedCategory === ''
                      ? 'bg-[#00a8e8] text-white'
                      : 'hover:bg-slate-100 text-gray-700'
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id || category.id}
                    onClick={() => handleCategoryChange(category._id)}
                    className={`w-full text-left px-4 py-2 rounded font-bold transition ${
                      selectedCategory === category._id
                        ? 'bg-[#00a8e8] text-white'
                        : 'hover:bg-slate-100 text-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
              <h3 className="font-athletic font-black italic text-lg text-[#00171f] mb-4">
                PRICE RANGE
              </h3>
              <div className="mb-1">
                  <button
                    onClick={() => handlePriceRange('', '5000')}
                    className="w-full text-left px-4 py-2 rounded hover:bg-slate-100 text-gray-700 text-sm"
                  >
                    Under ₹5,000
                  </button>
                  <button
                    onClick={() => handlePriceRange('5000', '10000')}
                    className="w-full text-left px-4 py-2 rounded hover:bg-slate-100 text-gray-700 text-sm"
                  >
                    ₹5,000 - ₹10,000
                  </button>
                  <button
                    onClick={() => handlePriceRange('10000', '20000')}
                    className="w-full text-left px-4 py-2 rounded hover:bg-slate-100 text-gray-700 text-sm"
                  >
                    ₹10,000 - ₹20,000
                  </button>
                  <button
                    onClick={() => handlePriceRange('20000', '')}
                    className="w-full text-left px-4 py-2 rounded hover:bg-slate-100 text-gray-700 text-sm"
                  >
                    Above ₹20,000
                  </button>
              </div>
            </div>

            {/* Sale Filter */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onSale}
                  onChange={(e) => setOnSale(e.target.checked)}
                  className="w-5 h-5 text-[#00a8e8] rounded focus:ring-[#00a8e8]"
                />
                <span className="font-black italic text-[#ef4444]">SALE ONLY</span>
              </label>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="w-full bg-slate-200 text-slate-800 font-black italic py-3 rounded hover:bg-slate-300 transition"
              >
                CLEAR ALL ({activeFiltersCount})
              </button>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            
            {/* Mobile Controls */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-300 rounded-lg font-black italic"
              >
                <Filter className="w-4 h-4" />
                FILTERS
                {activeFiltersCount > 0 && (
                  <span className="bg-[#00a8e8] text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-slate-300 rounded-lg font-black italic text-sm cursor-pointer focus:border-[#00a8e8] focus:ring-0"
              >
                <option value="">FEATURED</option>
                <option value="-createdAt">NEWEST</option>
                <option value="price">PRICE: LOW-HIGH</option>
                <option value="-price">PRICE: HIGH-LOW</option>
                <option value="-rating">TOP RATED</option>
              </select>
            </div>

            {/* Desktop Sort */}
            <div className="hidden lg:flex justify-end mb-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-slate-300 rounded-lg font-black italic cursor-pointer focus:border-[#00a8e8] focus:ring-0"
              >
                <option value="">FEATURED</option>
                <option value="-createdAt">NEWEST FIRST</option>
                <option value="price">PRICE: LOW TO HIGH</option>
                <option value="-price">PRICE: HIGH TO LOW</option>
                <option value="-rating">HIGHEST RATED</option>
              </select>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-md border border-slate-100">
                <p className="text-2xl font-bold text-gray-500 mb-4">NO PRODUCTS FOUND</p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-[#00a8e8] font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id || product._id}
                    product={product} 
                  />
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={() => setShowMobileFilters(false)} 
            />
            
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
              
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
                <h2 className="font-athletic font-black italic text-xl">FILTERS</h2>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Filters Content */}
              <div className="p-4 space-y-6">
                
                {/* Categories */}
                <div>
                  <h3 className="font-athletic font-black italic text-lg mb-3">CATEGORIES</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleCategoryChange('');
                        setShowMobileFilters(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded font-bold ${
                        selectedCategory === '' 
                          ? 'bg-[#00a8e8] text-white' 
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      All Products
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category._id || category.id}
                        onClick={() => {
                          handleCategoryChange(category._id);
                          setShowMobileFilters(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded font-bold ${
                          selectedCategory === category._id
                            ? 'bg-[#00a8e8] text-white' 
                            : 'hover:bg-slate-100'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-athletic font-black italic text-lg mb-3">PRICE RANGE</h3>
                      <button
                        onClick={() => {
                          handlePriceRange('', '5000');
                          setShowMobileFilters(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded hover:bg-slate-100 text-gray-700 text-sm"
                      >
                        Under ₹5,000
                      </button>
                      <button
                        onClick={() => {
                          handlePriceRange('5000', '10000');
                          setShowMobileFilters(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded hover:bg-slate-100 text-gray-700 text-sm"
                      >
                        ₹5,000 - ₹10,000
                      </button>
                      <button
                        onClick={() => {
                          handlePriceRange('10000', '20000');
                          setShowMobileFilters(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded hover:bg-slate-100 text-gray-700 text-sm"
                      >
                        ₹10,000 - ₹20,000
                      </button>
                      <button
                        onClick={() => {
                          handlePriceRange('20000', '');
                          setShowMobileFilters(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded hover:bg-slate-100 text-gray-700 text-sm"
                      >
                        Above ₹20,000
                      </button>
                </div>

                {/* Sale Filter */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onSale}
                      onChange={(e) => setOnSale(e.target.checked)}
                      className="w-5 h-5 text-[#00a8e8] rounded"
                    />
                    <span className="font-black italic text-[#ef4444]">SALE ONLY</span>
                  </label>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      clearFilters();
                      setShowMobileFilters(false);
                    }}
                    className="w-full bg-slate-200 text-slate-800 font-black py-3 rounded"
                  >
                    CLEAR ALL ({activeFiltersCount})
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;