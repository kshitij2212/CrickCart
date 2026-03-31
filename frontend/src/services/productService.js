import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const { data } = await api.get('/products', { params });
    return data;
  },

  getProductById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  getProductBySlug: async (slug) => {
    const { data } = await api.get(`/products/slug/${slug}`);
    return data;
  },

  getFeaturedProducts: async () => {
    const { data } = await api.get('/products/featured');
    return data;
  },

  searchProducts: async (query) => {
    const { data } = await api.get('/products', {
      params: { search: query },
    });
    return data;
  },

  deleteProduct: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  updateProduct: async (id, productData) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  },
};

export default productService;