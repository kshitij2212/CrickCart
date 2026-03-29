import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Clock, Send, MessageSquare,
  ChevronRight, Instagram, Twitter, Youtube, Shield,
  Package, RotateCcw, Truck, Star, HeadphonesIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const contactChannels = [
  {
    icon: Phone,
    label: 'CALL US',
    value: '+91 98765 43210',
    sub: 'Mon–Sat, 9AM–7PM IST',
    action: 'tel:+919876543210',
    actionLabel: 'Call Now',
  },
  {
    icon: Mail,
    label: 'EMAIL US',
    value: 'support@crickcart.in',
    sub: 'Reply within 24 hours',
    action: 'mailto:support@crickcart.in',
    actionLabel: 'Send Email',
  },
  {
    icon: MapPin,
    label: 'HEADQUARTERS',
    value: 'Mumbai, Maharashtra',
    sub: 'India – 400001',
    action: null,
    actionLabel: null,
  },
  {
    icon: Clock,
    label: 'WORKING HOURS',
    value: '9:00 AM – 7:00 PM',
    sub: 'Monday to Saturday',
    action: null,
    actionLabel: null,
  },
];

const topics = [
  { icon: Package, label: 'Order Issue', value: 'order', color: 'bg-blue-500/10 border-blue-500/20 text-blue-600' },
  { icon: RotateCcw, label: 'Return / Refund', value: 'return', color: 'bg-amber-500/10 border-amber-500/20 text-amber-600' },
  { icon: Truck, label: 'Shipping Info', value: 'shipping', color: 'bg-purple-500/10 border-purple-500/20 text-purple-600' },
  { icon: Star, label: 'Product Query', value: 'product', color: 'bg-green-500/10 border-green-500/20 text-green-600' },
  { icon: Shield, label: 'Warranty Claim', value: 'warranty', color: 'bg-red-500/10 border-red-500/20 text-red-600' },
  { icon: MessageSquare, label: 'Other', value: 'other', color: 'bg-slate-500/10 border-slate-500/20 text-slate-600' },
];

const faqs = [
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3–5 business days. Express (1–2 days) and Next Day options are available at checkout for an additional charge.' },
  { q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for all unused products in original packaging with tags intact.' },
  { q: 'Do you ship internationally?', a: 'Currently we ship across India only. International shipping is on our roadmap — stay tuned!' },
  { q: 'How do I track my order?', a: 'Visit the My Orders section in your account to get real-time tracking updates on every shipment.' },
  { q: 'Are all products genuine?', a: 'Yes — 100%. Every product is sourced directly from authorized manufacturers or verified distributors. We never sell replicas.' },
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTopicSelect = (value) => {
    setFormData({ ...formData, subject: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1800));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you soon 🏏");
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-[#00171f] relative overflow-hidden">

        {/* Pitch lines background */}
        <div className="absolute inset-0 opacity-[0.04]">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-r border-white"
              style={{ left: `${10 + i * 16}%` }}
            />
          ))}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white" />
          <div className="absolute bottom-8 left-0 right-0 h-px bg-white" />
          <div className="absolute bottom-16 left-0 right-0 h-px bg-white" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 relative z-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-10">
            <Link to="/" className="hover:text-[#00a8e8] transition font-bold">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#00a8e8] font-bold">Contact Us</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className="text-[#00a8e8] font-black italic text-xs tracking-[0.3em] mb-3 uppercase">
                Support — Available Mon–Sat
              </p>
              <h1 className="text-6xl md:text-8xl font-black italic text-white leading-none">
                CONTACT<br />
                <span className="text-[#00a8e8]">US</span>
              </h1>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-3 mt-8">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                  <Clock className="w-3.5 h-3.5 text-[#00a8e8]" />
                  <span className="text-xs font-black text-white">24hr Response</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                  <Shield className="w-3.5 h-3.5 text-[#00a8e8]" />
                  <span className="text-xs font-black text-white">Expert Support</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                  <HeadphonesIcon className="w-3.5 h-3.5 text-[#00a8e8]" />
                  <span className="text-xs font-black text-white">6 Days a Week</span>
                </div>
              </div>
            </div>

            <div className="lg:max-w-sm pb-2">
              <p className="text-slate-400 font-medium leading-relaxed text-sm">
                Got a question about your order, gear, or anything else? Our cricket experts are standing by — we typically respond within 24 hours on business days.
              </p>
            </div>
          </div>
        </div>

        {/* Channel strip */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {contactChannels.map((ch) => {
              const Icon = ch.icon;
              return (
                <div
                  key={ch.label}
                  className="flex items-center gap-2 text-xs font-black whitespace-nowrap px-4 py-4 border-b-2 border-transparent"
                >
                  <Icon className="w-3.5 h-3.5 text-[#00a8e8]" />
                  <span className="text-white">{ch.value}</span>
                  <span className="text-slate-500 hidden sm:inline">— {ch.sub}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {contactChannels.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-100 hover:border-[#00a8e8]/40 transition-all group"
              >
                <div className="w-12 h-12 bg-[#00a8e8]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00a8e8] transition-all">
                  <Icon className="w-5 h-5 text-[#00a8e8] group-hover:text-white transition-all" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                <p className="font-black text-[#00171f] text-sm leading-tight">{item.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">{item.sub}</p>
                {item.action && (
                  <a
                    href={item.action}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-[#00a8e8] hover:underline"
                  >
                    {item.actionLabel} <ChevronRight className="w-3 h-3" />
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* LEFT — Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-3/5"
          >
            <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-100 overflow-hidden">

              {/* Light header */}
              <div className="bg-slate-50 border-b-2 border-slate-100 p-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#00a8e8]/10 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-7 h-7 text-[#00a8e8]" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#00a8e8] tracking-widest mb-1 uppercase">Get In Touch</p>
                    <h2 className="text-2xl font-black italic text-[#00171f]">SEND A MESSAGE</h2>
                    <p className="text-slate-500 text-sm font-medium">We'll get back to you within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-24 h-24 bg-[#00171f] rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-[#00a8e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-black italic text-[#00171f] mb-2">MESSAGE SENT!</h3>
                    <p className="text-slate-500 font-medium mb-1">Our team will reach out to you at</p>
                    <p className="font-black text-[#00a8e8] text-lg mb-8">{formData.email}</p>
                    <button
                      onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                      className="bg-[#00171f] text-white font-black italic px-8 py-3 rounded-lg hover:bg-[#00a8e8] transition-all"
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Full Name *</label>
                        <input
                          type="text" name="name" value={formData.name} onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#00a8e8] focus:outline-none transition font-medium text-[#00171f]"
                          placeholder="Virat Kohli"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Phone Number</label>
                        <input
                          type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength="10"
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#00a8e8] focus:outline-none transition font-medium text-[#00171f]"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email Address *</label>
                      <input
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#00a8e8] focus:outline-none transition font-medium text-[#00171f]"
                        placeholder="virat@example.com"
                      />
                    </div>

                    {/* Topic chips */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">What's this about?</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {topics.map((t) => {
                          const Icon = t.icon;
                          const isSelected = formData.subject === t.value;
                          return (
                            <button
                              type="button" key={t.value} onClick={() => handleTopicSelect(t.value)}
                              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-black transition-all ${
                                isSelected
                                  ? 'bg-[#00171f] border-[#00171f] text-white'
                                  : `${t.color} hover:opacity-80`
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                              {t.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Message *</label>
                      <textarea
                        name="message" value={formData.message} onChange={handleChange} rows={5}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#00a8e8] focus:outline-none transition font-medium resize-none text-[#00171f]"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <button
                      type="submit" disabled={submitting}
                      className="w-full bg-[#00171f] text-white py-4 rounded-xl font-black italic uppercase text-lg hover:bg-[#00a8e8] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60"
                    >
                      {submitting ? (
                        <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> SENDING...</>
                      ) : (
                        <><Send className="w-5 h-5" /> SEND MESSAGE <ChevronRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-2/5 space-y-6"
          >

            {/* FAQ */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-100 overflow-hidden">
              <div className="bg-slate-50 border-b-2 border-slate-100 px-8 py-6">
                <p className="text-xs font-black text-[#00a8e8] tracking-widest mb-1 uppercase">Help Center</p>
                <h2 className="text-xl font-black italic text-[#00171f]">QUICK ANSWERS</h2>
              </div>
              <div className="p-6 space-y-1">
                {faqs.map((faq, i) => (
                  <div key={i} className="border-b border-slate-100 last:border-0">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between py-4 text-left group"
                    >
                      <span className="font-black text-sm text-[#00171f] pr-4 group-hover:text-[#00a8e8] transition-colors">{faq.q}</span>
                      <ChevronRight className={`w-4 h-4 text-[#00a8e8] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-90' : ''}`} />
                    </button>
                    {openFaq === i && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-slate-600 font-medium leading-relaxed pb-4"
                      >
                        {faq.a}
                      </motion.p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-slate-100">
              <div className="bg-slate-50 border-b-2 border-slate-100 px-8 py-6">
                <p className="text-xs font-black text-[#00a8e8] tracking-widest mb-1 uppercase">Stay Connected</p>
                <h2 className="text-xl font-black italic text-[#00171f]">FOLLOW CRICKCART</h2>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { icon: Instagram, label: '@crickcart.in', sub: 'Instagram', color: 'bg-pink-500' },
                  { icon: Twitter, label: '@CrickCart', sub: 'Twitter / X', color: 'bg-sky-500' },
                  { icon: Youtube, label: 'CrickCart Official', sub: 'YouTube', color: 'bg-red-500' },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.label}
                      className="w-full flex items-center gap-4 bg-slate-50 hover:bg-[#00a8e8]/5 border-2 border-slate-100 hover:border-[#00a8e8]/30 rounded-xl px-5 py-3 transition-all group"
                    >
                      <div className={`w-9 h-9 ${s.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-[#00171f] font-black text-sm leading-tight">{s.label}</p>
                        <p className="text-slate-400 text-xs font-medium">{s.sub}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-[#00a8e8] transition" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order CTA */}
            <div className="bg-[#00a8e8]/5 border-2 border-[#00a8e8]/20 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-5">
                <Package className="w-6 h-6 text-[#00a8e8] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-[#00171f] mb-1">Order-related issue?</p>
                  <p className="text-sm text-slate-600 font-medium">
                    Check your order status directly — faster than waiting for support.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  to="/orders"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#00171f] text-white font-black italic text-sm px-5 py-2.5 rounded-lg hover:bg-[#00a8e8] transition"
                >
                  VIEW MY ORDERS <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/terms"
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-[#00171f]/20 text-[#00171f] font-black italic text-sm px-5 py-2.5 rounded-lg hover:border-[#00a8e8] hover:text-[#00a8e8] transition"
                >
                  TERMS OF PLAY
                </Link>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;