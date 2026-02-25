import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Fix #2: safe id
  const productId = product.id || product._id;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await addToCart(productId, 1);
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(productId);
    } catch (error) {
      console.error('Wishlist error:', error);
    }
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

  const imageUrl = product.images?.[0] || 'https://placehold.co/400x400?text=No+Image';

  // Fix #3: wishlisted check
  const wishlisted = isWishlisted(productId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Fix #1: Link only wraps image + title, not buttons */}
      <div className="bg-white dark:bg-slate-900 card-hover transition-all duration-300 border border-slate-100 dark:border-slate-800 relative group">

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="metallic-badge text-[10px] font-black px-2 py-0.5 text-[#00171f] italic uppercase">
              Performance
            </span>
          )}
          {product.discount && product.discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 italic">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist button — top right */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Image + Name → clickable link */}
        <Link to={`/products/${productId}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
            <img
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              src={imageUrl}
              onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
            />
          </div>

          <div className="px-6 pt-6 pb-2">
            <h4 className="text-lg md:text-xl font-black italic font-athletic line-clamp-2">
              {product.name}
            </h4>
            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              {renderStars(Math.round(product.rating || 0))}
            </div>
          </div>
        </Link>

        {/* Price & Cart — outside Link */}
        <div className="px-6 pb-6 pt-2 flex items-center justify-between">
          <div>
            <span className="text-2xl md:text-3xl font-black italic text-[#00171f] dark:text-white">
              ₹{product.finalPrice || product.price}
            </span>
            {product.discount && product.discount > 0 && (
              <span className="text-sm text-slate-400 line-through ml-2">
                ₹{product.price}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-[#00171f] dark:bg-[#00a8e8] p-3 text-white hover:scale-110 transition-transform"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default ProductCard;