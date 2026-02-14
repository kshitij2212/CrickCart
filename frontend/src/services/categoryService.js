import api from './api';

export const categoryService = {
  // Get all categories
  getCategories: async () => {
    const { data } = await api.get('/categories');
    return data;
  },

  // Get single category
  getCategoryById: async (id) => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },
};

export default categoryService;