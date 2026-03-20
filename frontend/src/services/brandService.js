import api from './api';

export const brandService = {
  // Get all brands
  getBrands: async () => {
    const { data } = await api.get('/brands');
    return data;
  },

  // Get single brand by ID
  getBrandById: async (id) => {
    const { data } = await api.get(`/brands/${id}`);
    return data;
  },

  // Create brand (Admin only)
  createBrand: async (brandData) => {
    const { data } = await api.post('/brands', brandData);
    return data;
  },

  // Update brand (Admin only)
  updateBrand: async (id, brandData) => {
    const { data } = await api.put(`/brands/${id}`, brandData);
    return data;
  },

  // Delete brand (Admin only)
  deleteBrand: async (id) => {
    const { data } = await api.delete(`/brands/${id}`);
    return data;
  },
};

export default brandService;