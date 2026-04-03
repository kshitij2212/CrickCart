import api from './api';

export const authService = {

  googleLogin: async (credential) => {
    const { data } = await api.post('/users/google', { credential });
    return data;
  },
  register: async (userData) => {
    const { data } = await api.post('/users/register', userData);
    return data;
  },

  login: async (credentials) => {
    const { data } = await api.post('/users/login', credentials);
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get('/users/me');
    return data;
  },

  updateProfile: async (userData) => {
    const { data } = await api.put('/users/profile', userData);
    return data;
  },

  updatePassword: async (passwords) => {
    const { data } = await api.put('/users/updatepassword', passwords);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;