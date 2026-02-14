import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../products/ProductCard';
import productService from '../../services/productService';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const data = await productService.getFeaturedProducts();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      // Fallback dummy data
      setProducts([
        {
          id: '1',
          name: 'SS MAGNUM PRO EDITION',
          price: 15000,
          finalPrice: 13500,
          discount: 10,
          rating: 5,
          images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400'],
          isFeatured: true,
        },
        {
          id: '2',
          name: 'TURF GRADE RED BALL',
          price: 2500,
          finalPrice: 2500,
          discount: 0,
          rating: 4,
          images: ['https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=400'],
          isFeatured: true,
        },
        {
          id: '3',
          name: 'XT PRO BATTING PADS',
          price: 8000,
          finalPrice: 8000,
          discount: 0,
          rating: 5,
          images: ['https://images.unsplash.com/photo-1593766787879-e63e9935c1ed?w=400'],
          isFeatured: true,
        },
        {
          id: '4',
          name: 'ATOMIC 360 HELMET',
          price: 5500,
          finalPrice: 5500,
          discount: 0,
          rating: 4,
          images: ['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400'],
          isFeatured: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="mb-20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-96 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-20">
      <div className="flex items-end justify-between mb-10 border-b-2 border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-black italic text-[#00171f] dark:text-white leading-none font-athletic">
            FEATURED GEAR
          </h2>
          <p className="text-[#00a8e8] font-bold italic tracking-widest mt-1">
            THE PRO SELECTION
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-[#00a8e8] text-[#00171f] dark:text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-3 bg-[#00171f] text-white hover:bg-[#00a8e8] hover:text-[#00171f] transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedProducts;