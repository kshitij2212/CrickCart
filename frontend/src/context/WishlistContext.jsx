import { createContext, useState } from 'react';
import wishlistService from '../services/wishlistService';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const data = await wishlistService.getWishlist();
            setWishlist(data.data.items || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = async (productId) => {
        try {
            const data = await wishlistService.toggleWishlist(productId);
            setWishlist(data.data.items || []);
            toast.success(data.message);
        } catch (error) {
            toast.error('Error updating wishlist');
            throw error;
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const data = await wishlistService.removeFromWishlist(productId);
            setWishlist(data.data.items || []);
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Error removing from wishlist');
            throw error;
        }
    };

    const isWishlisted = (productId) => {
        return wishlist.some(item =>
            item.product?.id === productId ||
            item.product?._id === productId ||
            item.product === productId
        );
    };

    const value = {
        wishlist,
        loading,
        fetchWishlist,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        itemCount: wishlist.length,
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};