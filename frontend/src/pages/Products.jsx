import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import brandService from '../services/brandService';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1;
    const urlCategory = searchParams.get("category") || "";
    const urlBrand = searchParams.get("brand") || "";
    const urlSearch = searchParams.get("search") || "";
    const urlMin = searchParams.get("minPrice") || "";
    const urlMax = searchParams.get("maxPrice") || "";
    const urlSort = searchParams.get("sort") || "-createdAt";

    setSelectedCategory(urlCategory);
    setSelectedBrand(urlBrand);
    setSearchQuery(urlSearch);
    setCurrentPage(urlPage);
    setMinPrice(urlMin);
    setMaxPrice(urlMax);
    setSortBy(urlSort);

    fetchProducts({
      category: urlCategory,
      brand: urlBrand,
      search: urlSearch,
      page: urlPage,
      minPrice: urlMin,
      maxPrice: urlMax,
      sort: urlSort,
    });
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const data = await brandService.getBrands();
      setBrands(data.data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchProducts = async ({ category, brand, search, page, minPrice, maxPrice, sort } = {}) => {
    try {
      setLoading(true);
      const params = { page: page || 1, limit: 12 };
      if (category) params.category = category;
      if (brand) params.brand = brand;
      if (search) params.search = search;
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);
      if (sort === 'featured') {
        params.featured = true;
      } else if (sort) {
        params.sort = sort;
      }

      const response = await productService.getProducts(params);
      let fetchedProducts = response.data || [];
      if (sort === 'price') {
        fetchedProducts = fetchedProducts.sort((a, b) => {
        const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
        const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
        return priceA - priceB;
      });
      } else if (sort === '-price') {
        fetchedProducts = fetchedProducts.sort((a, b) => {
        const priceA = a.discount ? a.price - (a.price * a.discount / 100) : a.price;
        const priceB = b.discount ? b.price - (b.price * b.discount / 100) : b.price;
        return priceB - priceA;
        });
      }
      setProducts(fetchedProducts);

      const pages = response.totalPages || response.pagination?.pages || response.pagination?.totalPages || 1;
      const total = response.total || response.pagination?.total || response.pagination?.totalProducts || fetchedProducts.length;

      setTotalPages(pages);
      setTotalProducts(total);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) params.set('category', categoryId);
    else params.delete('category');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleBrandChange = (brandId) => {
    const params = new URLSearchParams(searchParams);
    if (brandId) params.set('brand', brandId);
    else params.delete('brand');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePriceRange = (min, max) => {
    const params = new URLSearchParams(searchParams);
    if (min) params.set('minPrice', min);
    else params.delete('minPrice');
    if (max) params.set('maxPrice', max);
    else params.delete('maxPrice');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSort = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set('sort', value);
    else params.delete('sort');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const activeFiltersCount = [selectedCategory, selectedBrand, minPrice, maxPrice, searchQuery].filter(Boolean).length;

  const getPageTitle = () => {
    if (searchQuery) return `SEARCH: "${searchQuery.toUpperCase()}"`;
    if (selectedBrand) {
      const brand = brands.find(b => b._id === selectedBrand);
      return brand?.name.toUpperCase() || 'PRODUCTS';
    }
    if (selectedCategory) {
      const cat = categories.find(c => c._id === selectedCategory);
      return cat?.name.toUpperCase() || 'PRODUCTS';
    }
    return 'ALL PRODUCTS';
  };

  const BrandFilter = ({ onSelect }) => (
    <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
      <h3 className="font-athletic font-black italic text-lg text-[#00171f] mb-4">BRANDS</h3>
      <div className="space-y-2">
        <button
          onClick={() => { handleBrandChange(''); onSelect?.(); }}
          className={`w-full text-left px-4 py-2 rounded font-bold transition ${
            selectedBrand === '' ? 'bg-[#00a8e8] text-white' : 'hover:bg-slate-100 text-gray-700'
          }`}
        >
          All Brands
        </button>
        {brands.map((brand) => (
          <button
            key={brand._id}
            onClick={() => { handleBrandChange(brand._id); onSelect?.(); }}
            className={`w-full text-left px-4 py-2 rounded font-bold transition flex items-center gap-2 ${
              selectedBrand === brand._id ? 'bg-[#00a8e8] text-white' : 'hover:bg-slate-100 text-gray-700'
            }`}
          >
            {brand.logo && (
              <img src={brand.logo} alt={brand.name} className="w-5 h-5 object-contain rounded" />
            )}
            {brand.name}
          </button>
        ))}
      </div>
    </div>
  );

  const Pagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) startPage = Math.max(1, endPage - maxVisiblePages + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
          className="p-2 rounded-lg border-2 border-slate-300 hover:border-[#00a8e8] disabled:opacity-50 disabled:cursor-not-allowed transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
        {startPage > 1 && (
          <>
            <button onClick={() => handlePageChange(1)} className="px-4 py-2 rounded-lg border-2 border-slate-300 font-bold hover:border-[#00a8e8] transition">1</button>
            {startPage > 2 && <span className="px-2 text-slate-400">...</span>}
          </>
        )}
        {pages.map((page) => (
          <button key={page} onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-lg border-2 font-bold transition ${
              currentPage === page ? 'bg-[#00a8e8] text-white border-[#00a8e8]' : 'border-slate-300 hover:border-[#00a8e8]'
            }`}>
            {page}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-slate-400">...</span>}
            <button onClick={() => handlePageChange(totalPages)} className="px-4 py-2 rounded-lg border-2 border-slate-300 font-bold hover:border-[#00a8e8] transition">{totalPages}</button>
          </>
        )}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
          className="p-2 rounded-lg border-2 border-slate-300 hover:border-[#00a8e8] disabled:opacity-50 disabled:cursor-not-allowed transition">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="diagonal-bg min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={`skeleton-${i}`} className="animate-pulse">
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
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black italic font-athletic text-[#00171f] mb-2">
            {getPageTitle()}
          </h1>
          <p className="text-[#00a8e8] font-bold italic">
            {totalProducts} {totalProducts === 1 ? 'ITEM' : 'ITEMS'} FOUND
            {totalPages > 1 && (
              <span className="text-slate-600 ml-2">(Page {currentPage} of {totalPages})</span>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 space-y-6">
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters}
                className="w-full bg-slate-200 text-slate-800 font-black italic py-3 rounded hover:bg-slate-300 transition">
                CLEAR ALL ({activeFiltersCount})
              </button>
            )}
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
              <h3 className="font-athletic font-black italic text-lg text-[#00171f] mb-4">CATEGORIES</h3>
              <div className="space-y-2">
                <button onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-4 py-2 rounded font-bold transition ${
                    selectedCategory === '' ? 'bg-[#00a8e8] text-white' : 'hover:bg-slate-100 text-gray-700'
                  }`}>
                  All Products
                </button>
                {categories.map((category) => (
                  <button key={category._id || category.id || category.slug}
                    onClick={() => handleCategoryChange(category._id || category.id)}
                    className={`w-full text-left px-4 py-2 rounded font-bold transition ${
                      selectedCategory === (category._id || category.id) ? 'bg-[#00a8e8] text-white' : 'hover:bg-slate-100 text-gray-700'
                    }`}>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            {brands.length > 0 && <BrandFilter />}

            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
              <h3 className="font-athletic font-black italic text-lg text-[#00171f] mb-4">PRICE RANGE</h3>
              <div className="space-y-1">
                {[
                  { label: 'Under ₹5,000', min: '', max: '5000' },
                  { label: '₹5,000 - ₹10,000', min: '5000', max: '10000' },
                  { label: '₹10,000 - ₹20,000', min: '10000', max: '20000' },
                  { label: 'Above ₹20,000', min: '20000', max: '' },
                ].map((range, idx) => (
                  <button key={`price-range-${idx}`} onClick={() => handlePriceRange(range.min, range.max)}
                    className="w-full text-left px-4 py-2 rounded hover:bg-slate-100 text-gray-700 text-sm transition">
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <button onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-300 rounded-lg font-black italic">
                <Filter className="w-4 h-4" />
                FILTERS
                {activeFiltersCount > 0 && (
                  <span className="bg-[#00a8e8] text-white text-xs px-2 py-0.5 rounded-full">{activeFiltersCount}</span>
                )}
              </button>
              <select value={sortBy} onChange={(e) => handleSort(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-slate-300 rounded-lg font-black italic text-sm cursor-pointer focus:border-[#00a8e8] focus:ring-0">
                <option value="-createdAt">NEWEST</option>
                <option value="price">PRICE: LOW-HIGH</option>
                <option value="-price">PRICE: HIGH-LOW</option>
                <option value="-rating">TOP RATED</option>
                <option value="featured">FEATURED</option>
              </select>
            </div>

            <div className="hidden lg:flex justify-end mb-6 -mt-[65px]">
              <select value={sortBy} onChange={(e) => handleSort(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-slate-300 rounded-lg font-black italic cursor-pointer focus:border-[#00a8e8] focus:ring-0">
                <option value="-createdAt">NEWEST FIRST</option>
                <option value="price">PRICE: LOW TO HIGH</option>
                <option value="-price">PRICE: HIGH TO LOW</option>
                <option value="-rating">HIGHEST RATED</option>
                <option value="featured">FEATURED</option>
              </select>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-md border border-slate-100">
                <p className="text-2xl font-bold text-gray-500 mb-4">NO PRODUCTS FOUND</p>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-[#00a8e8] font-bold hover:underline">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <ProductCard key={product._id || product.id || `product-${index}`} product={product} />
                  ))}
                </div>
                <Pagination />
              </>
            )}
          </main>
        </div>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
                <h2 className="font-athletic font-black italic text-xl">FILTERS</h2>
                <button onClick={() => setShowMobileFilters(false)}><X className="w-6 h-6" /></button>
              </div>

              <div className="p-4 space-y-6">
                <div>
                  <h3 className="font-athletic font-black italic text-lg mb-3">CATEGORIES</h3>
                  <div className="space-y-2">
                    <button onClick={() => { handleCategoryChange(''); setShowMobileFilters(false); }}
                      className={`w-full text-left px-4 py-2 rounded font-bold ${
                        selectedCategory === '' ? 'bg-[#00a8e8] text-white' : 'hover:bg-slate-100'
                      }`}>
                      All Products
                    </button>
                    {categories.map((category) => (
                      <button key={category._id || category.id || category.slug}
                        onClick={() => { handleCategoryChange(category._id || category.id); setShowMobileFilters(false); }}
                        className={`w-full text-left px-4 py-2 rounded font-bold ${
                          selectedCategory === (category._id || category.id) ? 'bg-[#00a8e8] text-white' : 'hover:bg-slate-100'
                        }`}>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {brands.length > 0 && (
                  <div>
                    <h3 className="font-athletic font-black italic text-lg mb-3">BRANDS</h3>
                    <div className="space-y-2">
                      <button onClick={() => { handleBrandChange(''); setShowMobileFilters(false); }}
                        className={`w-full text-left px-4 py-2 rounded font-bold ${
                          selectedBrand === '' ? 'bg-[#00a8e8] text-white' : 'hover:bg-slate-100'
                        }`}>
                        All Brands
                      </button>
                      {brands.map((brand) => (
                        <button key={brand._id}
                          onClick={() => { handleBrandChange(brand._id); setShowMobileFilters(false); }}
                          className={`w-full text-left px-4 py-2 rounded font-bold flex items-center gap-2 ${
                            selectedBrand === brand._id ? 'bg-[#00a8e8] text-white' : 'hover:bg-slate-100'
                          }`}>
                          {brand.logo && <img src={brand.logo} alt={brand.name} className="w-5 h-5 object-contain rounded" />}
                          {brand.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-athletic font-black italic text-lg mb-3">PRICE RANGE</h3>
                  <div className="space-y-1">
                    {[
                      { label: 'Under ₹5,000', min: '', max: '5000' },
                      { label: '₹5,000 - ₹10,000', min: '5000', max: '10000' },
                      { label: '₹10,000 - ₹20,000', min: '10000', max: '20000' },
                      { label: 'Above ₹20,000', min: '20000', max: '' },
                    ].map((range, idx) => (
                      <button key={`mobile-price-${idx}`}
                        onClick={() => { handlePriceRange(range.min, range.max); setShowMobileFilters(false); }}
                        className="w-full text-left px-4 py-2 rounded hover:bg-slate-100 text-gray-700 text-sm">
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <button onClick={() => { clearFilters(); setShowMobileFilters(false); }}
                    className="w-full bg-slate-200 text-slate-800 font-black py-3 rounded">
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