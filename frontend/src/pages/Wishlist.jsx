import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlist, loading, fetchWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleAddToCart = (item) => {
    const product = item.product || item;
    const productId = product._id || product.id;
    addToCart(productId, 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a8e8]"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-32 h-32 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-6xl text-slate-400">
              favorite_border
            </span>
          </motion.div>
          <h2 className="text-3xl font-black italic text-[#00171f] mb-4">
            YOUR WISHLIST IS EMPTY
          </h2>
          <p className="text-gray-600 mb-8">
            Start adding your favorite cricket gear!
          </p>
          <Link
            to="/products"
            className="inline-block bg-[#00a8e8] text-white font-black italic px-8 py-3 rounded hover:bg-[#0095d1] transition"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic text-[#00171f] mb-2">
              MY WISHLIST
            </h1>
            <p className="text-[#00a8e8] font-bold italic">
              {wishlist.length} {wishlist.length === 1 ? 'ITEM' : 'ITEMS'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const product = item.product || item;
            const productId = product._id || product.id;

            return (
              <motion.div
                key={item._id || productId}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition border border-slate-100"
              >
                <div className="relative overflow-hidden rounded-t-xl">
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(productId); }}
                    className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur p-2 rounded-full hover:bg-red-50 transition group"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition" />
                  </button>

                  <Link to={`/products/${productId}`}>
                    <div className="h-64 bg-slate-100">
                      <img
                        src={product.images?.[0]}
                        alt={product.name || 'Product'}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                </div>

                <div className="p-4">
                  <Link to={`/products/${productId}`}>
                    <h3 className="font-athletic font-black italic text-lg text-[#00171f] mb-2 uppercase line-clamp-2 hover:text-[#00a8e8] transition">
                      {product.name || 'Product Name'}
                    </h3>
                  </Link>

                  <div className="mb-4">
                    {product.discount && product.discount > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-[#00a8e8]">
                          ₹{Math.round(product.price * (1 - product.discount / 100))}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.price}
                        </span>
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded font-bold">
                          -{product.discount}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-black text-[#00a8e8]">
                        ₹{product.price || 0}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-[#00171f] text-white font-black italic py-3 rounded hover:bg-[#00a8e8] transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    ADD TO CART
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;