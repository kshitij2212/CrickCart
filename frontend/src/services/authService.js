import api from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    const { data } = await api.post('/users/register', userData);
    return data;
  },

  // Login user
  login: async (credentials) => {
    const { data } = await api.post('/users/login', credentials);
    return data;
  },

  // Get current user
  getProfile: async () => {
    const { data } = await api.get('/users/me');
    return data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const { data } = await api.put('/users/updateprofile', userData);
    return data;
  },

  // Update password
  updatePassword: async (passwords) => {
    const { data } = await api.put('/users/updatepassword', passwords);
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;