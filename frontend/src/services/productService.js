import api from './api';

export const productService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const { data } = await api.get('/products', { params });
    return data;
  },

  // Get single product by ID
  getProductById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    const { data } = await api.get(`/products/slug/${slug}`);
    return data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const { data } = await api.get('/products/featured');
    return data;
  },

  // Search products
  searchProducts: async (query) => {
    const { data } = await api.get('/products', {
      params: { search: query },
    });
    return data;
  },
};

export default productService;