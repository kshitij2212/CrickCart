import api from './api';

const orderService = {
  getMyOrders: async (params = {}) => {
    const { data } = await api.get('/orders/myorders', { params });
    return data;
  },

  getOrderById: async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  createOrder: async (orderData) => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  cancelOrder: async (id) => {
    const { data } = await api.put(`/orders/${id}/cancel`);
    return data;
  },

  requestReturn: async (id, reason) => {
    const { data } = await api.put(`/orders/${id}/return`, { reason });
    return data;
  },
};

export default orderService;