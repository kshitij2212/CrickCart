import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Subscribed successfully!');
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="mb-20 bg-[#00171f] relative overflow-hidden transform -skew-x-2 border-l-8 border-primary shadow-2xl">
      <div className="absolute inset-0 mesh-texture opacity-10"></div>
      
      <div className="flex flex-col md:flex-row items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="p-12 md:p-20 md:w-3/5 text-white transform skew-x-2"
        >
          <h2 className="text-5xl md:text-6xl font-black italic mb-6 leading-none font-athletic">
            JOIN THE <span className="text-primary">PROS.</span>
          </h2>
          <p className="text-slate-300 text-xl font-medium mb-10 italic max-w-lg">
            UNLOCK ELITE STATUS. GET 15% OFF YOUR FIRST ORDER AND EXCLUSIVE DROP ALERTS.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 bg-white/10 border-2 border-white/20 text-white placeholder-slate-400 focus:border-primary focus:outline-none italic font-bold"
              placeholder="YOUR EMAIL ADDRESS"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-primary text-[#00171f] font-black text-lg italic hover:bg-white transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="hidden md:block w-2/5 h-full self-stretch transform skew-x-2"
        >
          <img
            alt="Cricket Gear"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;