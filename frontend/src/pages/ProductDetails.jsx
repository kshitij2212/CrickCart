import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Minus, Plus, ChevronRight, Star, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import productService from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isWishlisted: checkIsWishlisted, isToggling } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);

  const wishlisted = product ? checkIsWishlisted(product.id) : false;
  const isOutOfStock = product?.countInStock === 0;

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data.data);

      if (data.data.category) {
        const related = await productService.getProducts({
          category: data.data.category.id,
          limit: 4,
        });
        setRelatedProducts(related.data.filter((p) => p.id !== id).slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      const res = await addToCart(product.id, quantity);
      if (res?.success) {
        toast.success('Added to cart!', { duration: 1500 });
      } else {
        toast.error(res?.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    setBuyingNow(true);
    try {
      const res = await addToCart(product.id, quantity);
      if (res?.success) {
        navigate('/checkout');
      } else {
        toast.error(res?.message || 'Cannot proceed to checkout');
      }
    } finally {
      setBuyingNow(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(product.id);
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.countInStock) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Only ${product.countInStock} items available`);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={`star-${i}`}
        className={`w-4 h-4 ${
          i < Math.round(rating) ? 'text-yellow-400 fill-yellow-300' : 'text-slate-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen diagonal-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00a8e8]"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#e6f6ff] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#00171f]">
      <nav className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24 pt-8 pb-4">
        <div className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold font-athletic italic text-gray-600">
          <Link to="/" className="hover:text-[#00a8e8] transition">SHOP</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/products?category=${product.category?.slug}`} className="hover:text-[#00a8e8] transition">
            {product.category?.name || 'PRODUCTS'}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#00a8e8]">{product.name}</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24 pb-20">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          <motion.section
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-[60%] space-y-6"
          >
            <div className="relative aspect-[3/3] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden group border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
              {product.isFeatured && (
                <div className="absolute top-6 left-6 z-10 bg-[#00a8e8] text-white font-athletic font-black italic px-4 py-1 transform -skew-x-12 shadow-lg">
                  <span className="inline-block transform skew-x-12 uppercase tracking-tighter">NEW RELEASE</span>
                </div>
              )}

              {product.discount > 0 && (
                <div className="absolute top-6 right-6 z-10 bg-[#ef4444] text-white font-athletic font-black italic px-3 py-1 transform -skew-x-12 shadow-lg">
                  <span className="inline-block transform skew-x-12">{product.discount}% OFF</span>
                </div>
              )}

              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-white text-[#00171f] font-black italic text-xl px-6 py-2 transform -skew-x-12">
                    <span className="inline-block skew-x-12">OUT OF STOCK</span>
                  </span>
                </div>
              )}

              <img
                alt={product.name}
                className={`w-full h-full object-contain p-4 transition-all duration-700 ${!isOutOfStock ? 'group-hover:scale-110 group-hover:rotate-[1deg]' : ''}`}
                src={product.images?.[selectedImage]}
              />
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-tr from-[#00a8e8]/10 to-transparent"></div>
            </div>

            <div className="flex gap-4 overflow-x-auto">
              {product.images?.map((image, index) => (
                <div
                  key={`thumb-${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                    selectedImage === index
                      ? 'border-[#00a8e8] shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img className="w-full h-full object-contain p-4" src={image} alt={`${product.name} view ${index + 1}`} />
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-[40%] space-y-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-athletic font-black italic uppercase leading-none text-[#00171f] mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex">{renderStars(product.rating || 0)}</div>
                <span className="text-xs font-semibold text-gray-600">
                  ({product.numReviews || 0} REVIEWS)
                </span>
              </div>
            </div>

            <div className="p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl">
              <div className="flex flex-col space-y-1">
                {product.discount > 0 && (
                  <span className="text-sm text-gray-600 line-through decoration-[#ef4444] decoration-2">
                    ₹{product.price}
                  </span>
                )}
                <div className="flex items-baseline space-x-4">
                  <span className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
                    ₹{Math.round(product.finalPrice || product.price)}
                  </span>
                  {product.discount > 0 && (
                    <span className="bg-[#ef4444] text-white px-2 py-1 rounded text-xs font-black font-athletic italic transform -skew-x-12">
                      <span className="inline-block transform skew-x-12">{product.discount}% OFF</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                {!isOutOfStock ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#10b981]" />
                    <span className="text-[#10b981] font-bold text-xs uppercase tracking-wider">In Stock</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-[#ef4444]" />
                    <span className="text-[#ef4444] font-bold text-xs uppercase tracking-wider">Out of Stock</span>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-y-4 mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-600 uppercase">
                  <span className="text-lg">🚚</span><span>Minimal Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-600 uppercase">
                  <span className="text-lg">↩️</span><span>Easy Returns</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-600 uppercase">
                  <span className="text-lg">🛡️</span><span>1yr Warranty</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-600 uppercase">
                  <span className="text-lg">✓</span><span>Authentic</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className={`flex items-center rounded-2xl border border-slate-200 bg-white shadow-sm p-1 ${isOutOfStock ? 'opacity-40' : ''}`}>
                <button
                  onClick={decrementQuantity}
                  disabled={isOutOfStock}
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 rounded-lg transition-colors text-slate-600 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-xl font-athletic italic text-[#00171f]">
                  {String(quantity).padStart(2, '0')}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={isOutOfStock}
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 rounded-lg transition-colors text-slate-600 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleWishlist}
                disabled={isToggling(product.id)}
                className="w-11 h-11 bg-white/80 backdrop-blur rounded-full shadow-md hover:scale-110 transition-all flex items-center justify-center text-slate-400 hover:text-red-500 disabled:opacity-50"
              >
                {isToggling(product.id) ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400" />
                ) : (
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                className={`w-full py-4 rounded-2xl font-black italic font-athletic text-white text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg disabled:cursor-not-allowed ${
                  isOutOfStock ? 'bg-gray-400' : 'bg-[#00a8e8] hover:brightness-110 hover:scale-[1.03] hover:shadow-xl'
                }`}
              >
              {addingToCart
                ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /><span>ADDING...</span></>
                : <><ShoppingCart className="w-5 h-5 flex-shrink-0" /><span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}</span></>
              }
              </button>

              <div className="relative group">
                <div className="absolute inset-0 speed-lines opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`w-full py-4 rounded-2xl font-black italic font-athletic text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-md active:scale-[0.97] ${
                    isOutOfStock
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#00171f] hover:scale-[1.03] hover:shadow-xl'
                  }`}
                >
                  {buyingNow
                    ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /><span>PROCESSING...</span></>
                    : <>{!isOutOfStock && <span className="text-lg leading-none">⚡</span>}<span>{isOutOfStock ? 'UNAVAILABLE' : 'BUY NOW'}</span></>
                  }
                </button>
              </div>
            </div>
          </motion.section>
        </div>

        <section className="mt-24">
          <div className="flex space-x-8 mb-1 border-b border-slate-100 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 font-athletic font-black italic uppercase tracking-widest transition-colors relative ${
                activeTab === 'description' ? 'text-[#00a8e8]' : 'text-slate-400 hover:text-[#00171f]'
              }`}
            >
              DESCRIPTION
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 w-full h-[8px] bg-gradient-to-r from-[#00a8e8] to-transparent transform -skew-x-12 translate-y-1/2"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 font-athletic font-black italic uppercase tracking-widest transition-colors relative ${
                activeTab === 'reviews' ? 'text-[#00a8e8]' : 'text-slate-400 hover:text-[#00171f]'
              }`}
            >
              REVIEWS ({product.numReviews || 0})
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 w-full h-[8px] bg-gradient-to-r from-[#00a8e8] to-transparent transform -skew-x-12 translate-y-1/2"></div>
              )}
            </button>
          </div>

          <div className="mt-8 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg p-8">
            {activeTab === 'description' ? (
              <div>
                <h3 className="font-athletic font-black italic text-2xl uppercase text-[#00a8e8] mb-6">
                  PRODUCT DESCRIPTION
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            ) : (
              <div>
                <h3 className="font-athletic font-black italic text-2xl uppercase text-[#00a8e8] mb-6">
                  CUSTOMER REVIEWS
                </h3>
                <div className="text-center py-12">
                  <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="text-4xl font-athletic font-black italic uppercase tracking-tighter mb-10 flex items-center space-x-4">
              <span className="text-[#00171f]">YOU MAY ALSO LIKE</span>
              <div className="flex-grow h-[2px] bg-gradient-to-r from-[#00a8e8]/20 to-transparent"></div>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      <style>{`
        .mesh-texture {
          background-image: radial-gradient(circle at 2px 2px, rgba(0, 168, 232, 0.08) 1px, transparent 0);
          background-size: 24px 24px;
        }
        .speed-lines {
          background-image: repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0, 168, 232, 0.05) 10px, rgba(0, 168, 232, 0.05) 12px);
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;