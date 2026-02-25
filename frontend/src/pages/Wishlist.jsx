import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const Wishlist = () => {
  const { wishlist, fetchWishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Remove error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a8e8]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen diagonal-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="text-4xl md:text-5xl font-black italic font-athletic text-[#00171f] mb-2">
          MY WISHLIST
        </h1>
        <p className="text-[#00a8e8] font-bold italic mb-8">
          {wishlist.length} ITEMS
        </p>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart className="w-20 h-20 text-gray-300 mb-4" />
            <h2 className="text-2xl font-black italic text-gray-400 mb-4">YOUR WISHLIST IS EMPTY</h2>
            <p className="text-gray-500 mb-8">Save items you love to your wishlist</p>
            <Link
              to="/products"
              className="px-8 py-4 bg-[#00a8e8] text-white font-black italic hover:bg-[#0095d1] transition"
            >
              SHOP NOW
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const product = item.product;
              if (!product) return null;
              const productId = product.id || product._id;
              const imageUrl = product.images?.[0] || product.image || 'https://placehold.co/400x400?text=No+Image';

              return (
                <motion.div
                  key={item._id || item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-100 group relative"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(productId)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Image */}
                  <Link to={`/products/${productId}`}>
                    <div className="aspect-square overflow-hidden bg-slate-50">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
                      />
                    </div>

                    <div className="px-4 pt-4 pb-2">
                      <h4 className="font-black italic font-athletic line-clamp-2 text-[#00171f]">
                        {product.name}
                      </h4>
                      <p className="text-xl font-black italic text-[#00171f] mt-1">
                        ₹{product.finalPrice || product.price}
                      </p>
                    </div>
                  </Link>

                  {/* Add to cart */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleAddToCart(productId)}
                      className="w-full flex items-center justify-center gap-2 bg-[#00171f] text-white font-black py-2.5 hover:bg-[#00a8e8] transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      ADD TO CART
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;