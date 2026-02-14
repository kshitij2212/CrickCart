import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Import hooks
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/products/${product.id}`}
        className="bg-white dark:bg-slate-900 card-hover transition-all duration-300 border border-slate-100 dark:border-slate-800 relative group block"
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="metallic-badge text-[10px] font-black px-2 py-0.5 text-[#00171f] italic uppercase">
              Performance
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 italic">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
          <img
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            src={product.images?.[0] || 'https://via.placeholder.com/400'}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg md:text-xl font-black italic font-athletic line-clamp-2">
              {product.name}
            </h4>
            <button
              onClick={handleWishlist}
              className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {renderStars(Math.round(product.rating || 0))}
          </div>

          {/* Price & Cart */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl md:text-3xl font-black italic text-[#00171f] dark:text-white">
                ₹{product.finalPrice || product.price}
              </span>
              {product.discount > 0 && (
                <span className="text-sm text-slate-400 line-through ml-2">
                  ₹{product.price}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-[#00171f] dark:bg-[#00a8e8] p-3 text-white dark:text-[#00171f] hover:scale-110 transition-transform"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;