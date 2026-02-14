import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategorySection = () => {
  const categories = [
    {
      name: 'BATS',
      image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=600',
      path: '/products?category=bats',
    },
    {
      name: 'BALLS',
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600',
      path: '/products?category=balls',
    },
    {
      name: 'PROTECTION',
      image: 'https://images.unsplash.com/photo-1593766787879-e63e9935c1ed?w=600',
      path: '/products?category=protection',
    },
    {
      name: 'CLOTHING',
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600',
      path: '/products?category=clothing',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="mb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {categories.map((category) => (
          <motion.div key={category.name} variants={itemVariants}>
            <Link
              to={category.path}
              className="group relative h-64 overflow-hidden card-hover transition-all duration-300 cursor-pointer border-b-4 border-[#00a8e8] block"
            >
              <img
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                src={category.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00171f] to-transparent opacity-80"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-2xl md:text-3xl font-black italic font-athletic">
                  {category.name}
                </h3>
                <div className="w-8 h-1 bg-[#00a8e8] mt-1 group-hover:w-20 transition-all duration-500"></div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CategorySection;