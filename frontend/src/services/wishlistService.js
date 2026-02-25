import api from './api';

const wishlistService = {
    getWishlist: async () => {
        const { data } = await api.get('/wishlist');
        return data;
    },

    toggleWishlist: async (productId) => {
        const { data } = await api.post('/wishlist/toggle', { productId });
        return data;
    },

    removeFromWishlist: async (productId) => {
        const { data } = await api.delete(`/wishlist/${productId}`);
        return data;
    }
};

export default wishlistService;