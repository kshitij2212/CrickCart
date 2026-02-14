import api from './api';

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  // Get user orders
  getMyOrders: async (params = {}) => {
    const { data } = await api.get('/orders/myorders', { params });
    return data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const { data } = await api.put(`/orders/${id}/cancel`);
    return data;
  },

  // Request return
  requestReturn: async (id, reason) => {
    const { data } = await api.put(`/orders/${id}/return`, { reason });
    return data;
  },
};

export default orderService;