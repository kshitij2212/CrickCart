import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/categories`;
        console.log('Fetching from:', apiUrl);
        
        const { data } = await axios.get(apiUrl);
        console.log('Categories data:', data);
        
        setCategories(data.data || data.categories || data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=600&fit=crop';
  };

  const getImageUrl = (category) => {
    const imageUrl = 
      category.image?.url || 
      category.image || 
      category.images?.[0]?.url || 
      category.images?.[0] ||
      category.imageUrl ||
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=600&fit=crop';
    
    console.log('Image URL for', category.name, ':', imageUrl);
    return imageUrl;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-600 mt-4">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-xl">No categories found</p>
      </div>
    );
  }

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-10 border-b-2 border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-black italic text-[#00171f] dark:text-white leading-none">
            CATEGORIES
          </h2>
          <p className="text-[#00a8e8] font-bold italic tracking-widest mt-1">
            ALL YOU NEED.....
          </p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {categories.map((category) => (
          <motion.div key={category._id} variants={itemVariants}>
            <Link
              to={`/products?category=${category.slug || category._id}`}
              className="group relative h-64 overflow-hidden card-hover transition-all duration-300 cursor-pointer border-b-4 border-primary block rounded-lg"
            >
              <img
                alt={category.name || 'Category'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                src={getImageUrl(category)}
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-80"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-2xl md:text-3xl font-black italic">
                  {category.name?.toUpperCase() || 'CATEGORY'}
                </h3>
                <div className="w-8 h-1 bg-primary mt-1 group-hover:w-20 transition-all duration-500"></div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CategorySection;