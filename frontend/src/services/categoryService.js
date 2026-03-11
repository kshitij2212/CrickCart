import api from './api';

export const categoryService = {

  getCategories: async () => {
    const { data } = await api.get('/categories');
    return data;
  },

  getCategoryById: async (id) => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },

  uploadImages: async (formData) => {
    const { data } = await api.post(
      '/categories/upload',
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return data;
  },

  createCategory: async (categoryData) => {
    const { data } = await api.post('/categories/create', categoryData);
    return data;
  },

  updateCategory: async (id, data) => {
    const { data: res } = await api.put(`/categories/${id}`, data);
    return res;
  },

  deleteCategory: async (id) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  }

};
export default categoryService;