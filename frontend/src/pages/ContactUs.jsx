import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ChevronRight, Instagram, Twitter, Youtube, Package, Headphones } from 'lucide-react';
import toast from 'react-hot-toast';
import { href } from 'react-router-dom';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Message sent successfully! 🎉');
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'CALL US',
      value: '+91 98765 43210',
      sub: 'Mon–Sat, 9AM–7PM IST',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Mail,
      label: 'EMAIL US',
      value: 'support@crickcart.in',
      sub: 'Reply within 24 hours',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: MapPin,
      label: 'VISIT US',
      value: 'Pimpri, Maharashtra',
      sub: 'India – 411018',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Clock,
      label: 'WORKING HOURS',
      value: '9:00 AM – 7:00 PM',
      sub: 'Monday to Saturday',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const faqs = [
    { 
      q: 'How long does delivery take?', 
      a: 'Standard delivery takes 3–5 business days across India. Express shipping (1-2 days) available at checkout for major cities.' 
    },
    { 
      q: 'What is your return policy?', 
      a: 'We accept returns within 7 days of delivery for all unused products in original packaging with tags intact.' 
    },
    { 
      q: 'Do you ship internationally?', 
      a: 'Currently we ship across India only. International shipping coming soon!' 
    },
    { 
      q: 'How do I track my order?', 
      a: 'Visit "My Orders" section in your account to get real-time tracking updates and order status.' 
    },
    { 
      q: 'What payment methods do you accept?', 
      a: 'We accept Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery for orders across India.' 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#ffffff] via-[#001f3f] to-[#ffffff] py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Headphones className="w-6 h-6 text-[#00a8e8]" />
              <p className="text-[#00a8e8] font-black italic text-sm tracking-widest uppercase">
                24/7 Support Available
              </p>
            </div>
            <h1 className="text-6xl md:text-7xl font-black italic text-white mb-6 tracking-tight">
              GET IN <span className="text-[#00a8e8]">TOUCH</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto font-bold">
              Got questions about your order or cricket gear? Our team of cricket enthusiasts is here to help you find the perfect equipment.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-xl border-2 border-slate-100 hover:border-[#00a8e8] hover:shadow-2xl transition-all duration-300 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  {item.label}
                </p>
                <p className="font-black text-[#00171f] text-base leading-tight mb-1">
                  {item.value}
                </p>
                <p className="text-xs text-slate-500 font-bold">
                  {item.sub}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Contact Form - 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl border-2 border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-[#00a8e8]/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-[#00a8e8]" />
                </div>
                <div>
                  <h2 className="text-3xl font-black italic text-[#00171f] uppercase">
                    SEND A MESSAGE
                  </h2>
                  <p className="text-sm text-slate-600 font-bold mt-1">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black italic text-[#00171f] mb-3">
                    MESSAGE SENT! 🎉
                  </h3>
                  <p className="text-slate-600 font-bold text-lg mb-2">
                    Thanks for reaching out!
                  </p>
                  <p className="text-slate-500">
                    We'll get back to you at{' '}
                    <span className="font-black text-[#00a8e8]">{formData.email}</span>
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#00a8e8] focus:outline-none focus:ring-2 focus:ring-[#00a8e8]/20 transition font-bold"
                        placeholder="Virat Kohli"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength="10"
                        className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#00a8e8] focus:outline-none focus:ring-2 focus:ring-[#00a8e8]/20 transition font-bold"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#00a8e8] focus:outline-none focus:ring-2 focus:ring-[#00a8e8]/20 transition font-bold"
                      placeholder="virat@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#00a8e8] focus:outline-none focus:ring-2 focus:ring-[#00a8e8]/20 transition font-bold text-slate-700"
                    >
                      <option value="">Select a topic...</option>
                      <option value="order">Order Issue</option>
                      <option value="return">Return / Refund</option>
                      <option value="product">Product Query</option>
                      <option value="shipping">Shipping Info</option>
                      <option value="payment">Payment Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#00a8e8] focus:outline-none focus:ring-2 focus:ring-[#00a8e8]/20 transition font-bold resize-none"
                      placeholder="Tell us how we can help you dominate on the pitch..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-[#00a8e8] to-[#0095d1] text-white py-5 rounded-xl font-black italic uppercase text-lg shadow-2xl shadow-[#00a8e8]/30 hover:shadow-[#00a8e8]/50 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                        SENDING MESSAGE...
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        SEND MESSAGE
                        <ChevronRight className="w-6 h-6" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-slate-500 mt-4">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right Sidebar - 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* FAQs */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-100">
              <h2 className="text-2xl font-black italic text-[#00171f] mb-6 uppercase">
                QUICK ANSWERS
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <details 
                    key={i} 
                    className="group border-b border-slate-200 pb-4 last:border-0 last:pb-0"
                  >
                    <summary className="flex items-start justify-between cursor-pointer list-none">
                      <span className="font-black text-sm text-[#00171f] pr-4 group-open:text-[#00a8e8] transition">
                        {faq.q}
                      </span>
                      <ChevronRight className="w-5 h-5 text-[#00a8e8] flex-shrink-0 group-open:rotate-90 transition-transform mt-0.5" />
                    </summary>
                    <p className="mt-3 text-sm text-slate-600 font-medium leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
  <h2 className="text-2xl font-black italic text-[#00171f] mb-2 uppercase">
    FOLLOW US
  </h2>
  <p className="text-slate-600 text-sm font-bold mb-6">
    Stay updated with new launches, deals & cricket tips
  </p>
  <div className="space-y-3">
  {[
    {
      icon: Instagram,
      label: '@crickcart.official',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      href: 'https://www.instagram.com/crickcart.official',
    },
    {
      icon: Twitter,
      label: '@CrickCart',
      color: 'bg-gradient-to-br from-sky-400 to-blue-500',
      href: 'https://twitter.com',
    },
    {
      icon: Youtube,
      label: 'CrickCart Official',
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      href: 'https://www.youtube.com',
    }
    ].map((s) => {
    const Icon = s.icon;
    return (
      <a
        key={s.label}
        href={s.href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center gap-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-5 py-3.5 transition-all group hover:scale-[1.02]"
      >
        <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-[#00171f] font-black text-sm">{s.label}</span>
        <ChevronRight className="w-5 h-5 text-slate-400 ml-auto group-hover:text-[#00a8e8] transition" />
      </a>
                    );
                })}
            </div>
        </div>

            {/* Order Help CTA */}
            <div className="bg-gradient-to-br from-[#00a8e8]/10 to-[#00a8e8]/5 border-2 border-[#00a8e8]/30 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-3 mb-4">
                <Package className="w-6 h-6 text-[#00a8e8] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-[#00171f] mb-1 text-lg">
                    Order-related issue?
                  </p>
                  <p className="text-sm text-slate-600 font-bold">
                    Check your order status directly from your account before contacting support.
                  </p>
                </div>
              </div>
              
                <a href="/orders"
                className="inline-flex items-center gap-2 bg-[#00171f] text-white font-black italic text-sm px-6 py-3 rounded-lg hover:bg-[#00a8e8] transition-all hover:scale-105 shadow-lg"
              >
                VIEW MY ORDERS
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;