import { createContext, useState } from 'react';
import wishlistService from '../services/wishlistService';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const data = await wishlistService.getWishlist();
            setWishlist(data.data?.items || data.data || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            setWishlist([]);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    const toggleWishlist = async (productId) => {
        try {
            const data = await wishlistService.toggleWishlist(productId);
            await fetchWishlist(false);
            toast.success(data.message || 'Wishlist updated');
        } catch (error) {
            console.error('Toggle error:', error);
            toast.error('Error updating wishlist');
            throw error;
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            setWishlist(prev => prev.filter(item =>
                (item.product?._id || item.product?.id || item.product) !== productId
            ));
            await wishlistService.removeFromWishlist(productId);
            await fetchWishlist(false);
            toast.success('Removed from wishlist');
        } catch (error) {
            console.error('Remove error:', error);
            toast.error('Error removing from wishlist');
            await fetchWishlist(false);
            throw error;
        }
    };

    const isWishlisted = (productId) => {
        return wishlist.some(item =>
            item.product?.id === productId ||
            item.product?._id === productId ||
            item.id === productId ||
            item._id === productId ||
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