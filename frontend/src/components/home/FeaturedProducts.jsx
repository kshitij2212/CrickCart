import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Grid, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '../products/ProductCard';
import productService from '../../services/productService';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);
const PLACEHOLDER_PRODUCTS = [
  { id: 1, name: 'Cricket Bat', price: 1299, image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=300&h=400&fit=crop', badge: 'PRO' },
  { id: 2, name: 'Cricket Ball', price: 399,  image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&h=400&fit=crop', badge: 'NEW' },
  { id: 3, name: 'Cricket Helmet', price: 2499, image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300&h=400&fit=crop', badge: 'SAFE' },
  { id: 4, name: 'Cricket Gloves', price: 799, image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=300&h=400&fit=crop', badge: 'HOT' },
  { id: 5, name: 'Cricket Jersey', price: 899, image: 'https://images.unsplash.com/photo-1562077981-4d7eafd44932?w=300&h=400&fit=crop', badge: 'ELITE' },
  { id: 6, name: 'Cricket Shoes', price: 1799, image: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=300&h=400&fit=crop', badge: 'GRIP' },
  { id: 7, name: 'Cricket Pads', price: 1099, image: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=300&h=400&fit=crop', badge: 'PRO' },
  { id: 8, name: 'Cricket Bag', price: 2199, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop', badge: 'CARRY' },
];

// ─── Carousel Item ─────────────────────────────────────────────────────────────
const CarouselItem = ({ product, index }) => {
  const [hovered, setHovered] = useState(false);
  const productId = product.id || product._id;
  return (
    <div
      className="carousel-item relative flex-shrink-0 cursor-pointer group"
      style={{ width: 300, height: 420 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl">
        <img
          src={product.images?.[0] || product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#00171f] via-transparent to-transparent opacity-80" />

        {/* Badge */}
        <div className="absolute top-4 left-4 bg-[#00a8e8] text-[#00171f] text-xs font-black tracking-widest px-3 py-1">
          {product.badge || 'FEATURED'}
        </div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-[#00a8e8] text-xs font-bold tracking-widest uppercase mb-1">
            Pro Gear
          </p>
          <h3 className="text-white font-black text-xl italic leading-tight">
            {product.name}
          </h3>
          {product.price && (
            <p className="text-white/80 font-bold mt-1">
              ₹{product.price?.toLocaleString?.() ?? product.price}
            </p>
          )}
        </div>

        {/* Hover CTA */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <Link to={`/products/${productId}`} className="block">
          <button className="bg-[#00a8e8] text-[#00171f] font-black italic px-6 py-3 flex items-center gap-2 hover:bg-white transition-colors">
            VIEW PRODUCT <ArrowRight className="w-4 h-4" />
          </button></Link>
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-slate-200 dark:bg-slate-700 h-80 rounded-2xl mb-3" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
      </div>
    ))}
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('carousel'); // 'grid' | 'carousel'
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselRef = useRef(null);
  const scrollTweenRef = useRef(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getFeaturedProducts();
        setProducts(data.data?.length ? data.data : PLACEHOLDER_PRODUCTS);
      } catch {
        setProducts(PLACEHOLDER_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ── GSAP Carousel Setup ────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || mode !== 'carousel' || !carouselRef.current) return;

    const cont = carouselRef.current;
    // Small delay to let DOM settle
    const timer = setTimeout(() => {
      const items = cont.querySelectorAll('.carousel-item');
      if (!items.length) return;

      // Horizontal scroll tween
      scrollTweenRef.current = gsap.to(items, {
        ease: 'none',
        x: () => -(cont.scrollWidth - window.innerWidth + 200),
        scrollTrigger: {
          trigger: cont,
          pin: true,
          start: 'center center',
          end: () => '+=' + (cont.scrollWidth - window.innerWidth),
          scrub: 0.3,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (products.length - 1));
            setActiveIndex(idx);
          },
        },
      });

      // Per-item entrance animations
      items.forEach((item, index) => {
        gsap.timeline({
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            containerAnimation: scrollTweenRef.current,
            end: 'center 25%',
            scrub: true,
          },
        }).fromTo(
          item,
          { rotate: 14 + 8 * (index % 3), yPercent: 20 * (index % 2), opacity: 0.5, scale: 0.9 },
          { rotate: 0, yPercent: 0, opacity: 1, scale: 1 }
        );
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loading, mode, products.length]);

  // ── Grid navigation (prev/next) ────────────────────────────────────────────
  const [page, setPage] = useState(0);
  const PER_PAGE = 4;
  const totalPages = Math.ceil(products.length / PER_PAGE);
  const visibleProducts = products.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="mb-20 relative">

      {/* ── Section Header ── */}
      <div className="flex items-end justify-between mb-10 border-b-2 border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-black italic text-[#00171f] dark:text-white leading-none">
            FEATURED GEAR
          </h2>
          <p className="text-[#00a8e8] font-bold italic tracking-widest mt-1">
            THE PRO SELECTION
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex gap-1 border-2 border-slate-200 dark:border-slate-800 p-1">
            <button
              onClick={() => setMode('grid')}
              className={`p-2 transition-all ${mode === 'grid' ? 'bg-[#00171f] text-white' : 'text-slate-400 hover:text-[#00a8e8]'}`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMode('carousel')}
              className={`p-2 transition-all ${mode === 'carousel' ? 'bg-[#00171f] text-white' : 'text-slate-400 hover:text-[#00a8e8]'}`}
              title="Carousel view"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* Prev/Next (grid mode only) */}
          {mode === 'grid' && (
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-[#00a8e8] text-[#00171f] dark:text-white transition-all disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-3 bg-[#00171f] text-white hover:bg-[#00a8e8] hover:text-[#00171f] transition-all disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Loading State ── */}
      {loading && <SkeletonGrid />}

      {/* ── Grid Mode ── */}
      {!loading && mode === 'grid' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {visibleProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Carousel Mode ── */}
      {!loading && mode === 'carousel' && (
        <div>
          {/* Scroll hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-slate-400 italic text-sm mb-6 tracking-widest"
          >
            ↓ SCROLL TO EXPLORE THE COLLECTION ↓
          </motion.p>

          {/* GSAP pinned carousel */}
          <div className="overflow-hidden">
            <div
              ref={carouselRef}
              className="flex flex-row gap-10 px-[10vw] items-center"
              style={{ willChange: 'transform' }}
            >
              {products.map((product, index) => (
                <CarouselItem key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {products.map((_, i) => (
              <div
                key={i}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === activeIndex ? 24 : 8,
                  height: 8,
                  background: i === activeIndex ? '#00a8e8' : '#cbd5e1',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Page indicator (grid mode) */}
      {!loading && mode === 'grid' && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === page ? 24 : 8,
                height: 8,
                background: i === page ? '#00a8e8' : '#cbd5e1',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;