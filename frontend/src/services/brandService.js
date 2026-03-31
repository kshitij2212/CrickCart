import api from './api';

export const brandService = {
  getBrands: async () => {
    const { data } = await api.get('/brands');
    return data;
  },

  getBrandById: async (id) => {
    const { data } = await api.get(`/brands/${id}`);
    return data;
  },

  createBrand: async (brandData) => {
    const { data } = await api.post('/brands', brandData);
    return data;
  },

  updateBrand: async (id, brandData) => {
    const { data } = await api.put(`/brands/${id}`, brandData);
    return data;
  },

  deleteBrand: async (id) => {
    const { data } = await api.delete(`/brands/${id}`);
    return data;
  },
};

export default brandService;