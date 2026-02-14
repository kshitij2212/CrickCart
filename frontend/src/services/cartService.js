import api from './api';

export const cartService = {
  // Get user cart
  getCart: async () => {
    const { data } = await api.get('/cart');
    return data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    const { data } = await api.post('/cart/add', { productId, quantity });
    return data;
  },

  // Update cart item
  updateCartItem: async (itemId, quantity) => {
    const { data } = await api.put(`/cart/${itemId}`, { quantity });
    return data;
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    const { data } = await api.delete(`/cart/${itemId}`);
    return data;
  },

  // Clear cart
  clearCart: async () => {
    const { data } = await api.delete('/cart');
    return data;
  },
};

export default cartService;