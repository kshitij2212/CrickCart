import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Shield, ShoppingBag, Truck, RotateCcw, Lock, AlertTriangle, FileText, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  {
    id: 'acceptance',
    icon: FileText,
    number: '01',
    title: 'ACCEPTANCE OF TERMS',
    content: [
      {
        heading: 'Agreement to Terms',
        text: 'By accessing or using CrickCart ("Platform"), you agree to be bound by these Terms of Play. If you do not agree to these terms, you may not use our services. These terms apply to all visitors, users, and others who access or use the Platform.',
      },
      {
        heading: 'Age Requirement',
        text: 'You must be at least 18 years of age, or the age of majority in your jurisdiction, to use this Platform. By using CrickCart, you represent and warrant that you meet this requirement.',
      },
      {
        heading: 'Changes to Terms',
        text: 'CrickCart reserves the right to modify these Terms of Play at any time. We will provide notice of significant changes by updating the date at the top of this page. Your continued use of the Platform following changes constitutes acceptance of the revised terms.',
      },
    ],
  },
  {
    id: 'accounts',
    icon: Users,
    number: '02',
    title: 'ACCOUNTS & REGISTRATION',
    content: [
      {
        heading: 'Account Creation',
        text: 'To place orders or access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.',
      },
      {
        heading: 'Account Security',
        text: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify CrickCart immediately of any unauthorized use of your account. CrickCart will not be liable for any loss resulting from unauthorized account access.',
      },
      {
        heading: 'Account Termination',
        text: 'CrickCart reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or for any other reason at our sole discretion, with or without notice.',
      },
    ],
  },
  {
    id: 'orders',
    icon: ShoppingBag,
    number: '03',
    title: 'ORDERS & PAYMENTS',
    content: [
      {
        heading: 'Order Placement',
        text: 'All orders placed on CrickCart are subject to availability and acceptance. We reserve the right to refuse or cancel any order for any reason, including but not limited to product unavailability, errors in pricing or product description, or suspected fraudulent activity.',
      },
      {
        heading: 'Pricing & Taxes',
        text: 'All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. CrickCart reserves the right to change prices at any time without notice. Price changes will not affect orders already confirmed.',
      },
      {
        heading: 'Payment Methods',
        text: 'We accept Credit/Debit Cards, UPI, and Cash on Delivery (COD). By providing payment information, you authorize CrickCart to charge the specified amount. All transactions are secured with SSL encryption.',
      },
      {
        heading: 'Order Confirmation',
        text: 'An order is confirmed only after you receive a confirmation email or notification from CrickCart. Receipt of an order does not constitute acceptance. We reserve the right to reject orders after confirmation in cases of pricing errors or stock discrepancies.',
      },
    ],
  },
  {
    id: 'shipping',
    icon: Truck,
    number: '04',
    title: 'SHIPPING & DELIVERY',
    content: [
      {
        heading: 'Delivery Timelines',
        text: 'Standard delivery takes 3–5 business days. Express and next-day options are available at additional cost. Delivery timelines are estimates and CrickCart is not liable for delays caused by courier partners, weather, or circumstances beyond our control.',
      },
      {
        heading: 'Shipping Coverage',
        text: 'We currently ship across India only. International shipping is not available at this time. Certain remote locations may attract additional shipping charges or extended delivery windows.',
      },
      {
        heading: 'Delivery Responsibility',
        text: 'Risk of loss and title for products pass to you upon delivery. If a package is marked as delivered but not received, please contact us within 48 hours. CrickCart will investigate and work with the courier to resolve such issues.',
      },
    ],
  },
  {
    id: 'returns',
    icon: RotateCcw,
    number: '05',
    title: 'RETURNS & REFUNDS',
    content: [
      {
        heading: 'Return Window',
        text: 'Returns are accepted within 7 days of delivery. Products must be unused, in original packaging, and in the same condition as received. Products showing signs of use, damage, or missing tags will not be accepted for return.',
      },
      {
        heading: 'Non-Returnable Items',
        text: 'The following items cannot be returned: consumables (grip tape, bat oil), personalized/customized products, items purchased during clearance sales, and products with tampered or missing MRP labels.',
      },
      {
        heading: 'Refund Process',
        text: 'Approved refunds are processed within 5–7 business days to the original payment method. COD orders will be refunded via bank transfer. CrickCart is not responsible for delays caused by banking institutions.',
      },
      {
        heading: 'Damaged or Wrong Products',
        text: 'If you receive a damaged or incorrect product, contact us within 48 hours of delivery with photo evidence. We will arrange a replacement or full refund at no additional cost to you.',
      },
    ],
  },
  {
    id: 'privacy',
    icon: Lock,
    number: '06',
    title: 'PRIVACY & DATA',
    content: [
      {
        heading: 'Data Collection',
        text: 'We collect personal information such as name, email, phone number, and address to process orders and improve your experience. We do not sell your personal data to third parties.',
      },
      {
        heading: 'Data Usage',
        text: 'Your data is used to process transactions, send order updates, and for internal analytics. With your consent, we may send promotional communications. You can opt out at any time via account settings or by contacting support.',
      },
      {
        heading: 'Cookies',
        text: 'CrickCart uses cookies to enhance browsing experience, remember preferences, and analyze site traffic. By using our Platform, you consent to our use of cookies as described in our Cookie Policy.',
      },
    ],
  },
  {
    id: 'conduct',
    icon: Shield,
    number: '07',
    title: 'USER CONDUCT',
    content: [
      {
        heading: 'Prohibited Activities',
        text: 'You agree not to: use the Platform for any unlawful purpose, attempt to gain unauthorized access to any portion of the Platform, transmit harmful or malicious code, engage in any activity that disrupts or interferes with the Platform\'s functionality.',
      },
      {
        heading: 'Intellectual Property',
        text: 'All content on CrickCart including logos, product images, text, and graphics are the intellectual property of CrickCart or its licensors. Unauthorized reproduction, distribution, or use of any content is strictly prohibited.',
      },
      {
        heading: 'User Content',
        text: 'By submitting reviews, comments, or other content, you grant CrickCart a non-exclusive, royalty-free license to use, display, and distribute such content. You are responsible for ensuring your content does not infringe third-party rights.',
      },
    ],
  },
  {
    id: 'liability',
    icon: AlertTriangle,
    number: '08',
    title: 'LIMITATION OF LIABILITY',
    content: [
      {
        heading: 'Disclaimer',
        text: 'CrickCart provides the Platform "as is" without warranties of any kind, express or implied. We do not warrant that the Platform will be uninterrupted, error-free, or free of viruses or harmful components.',
      },
      {
        heading: 'Liability Cap',
        text: 'To the maximum extent permitted by law, CrickCart\'s total liability for any claims arising from your use of the Platform shall not exceed the amount paid by you for the specific order giving rise to the claim.',
      },
      {
        heading: 'Governing Law',
        text: 'These Terms of Play are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts located in Mumbai, Maharashtra.',
      },
    ],
  },
  {
    id: 'quality',
    icon: Star,
    number: '09',
    title: 'PRODUCT QUALITY PLEDGE',
    content: [
      {
        heading: 'Our Commitment',
        text: 'Every product on CrickCart is sourced directly from authorized manufacturers or verified distributors. We are committed to selling only genuine, quality cricket equipment that meets the performance standards expected by players of all levels.',
      },
      {
        heading: 'Authenticity Guarantee',
        text: 'All branded products carry manufacturer warranty where applicable. If you suspect a product is counterfeit or not as described, contact us immediately and we will investigate and take corrective action.',
      },
      {
        heading: 'Manufacturer Warranty',
        text: 'Warranty claims for manufacturing defects must be submitted within the warranty period specified by the manufacturer. CrickCart acts as a facilitator for warranty claims and is not responsible for manufacturer decisions on warranty coverage.',
      },
    ],
  },
];

const TermsOfPlay = () => {
  const [activeSection, setActiveSection] = useState('acceptance');
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = window.scrollY;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);

      // Update active section based on scroll
      sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) {
          const { top } = el.getBoundingClientRect();
          if (top < 200) setActiveSection(id);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 z-50 h-1 bg-[#00a8e8] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />

      {/* Hero */}
      <div className="bg-[#00171f] relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Cricket pitch lines */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-full bg-white/5" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-full border-x border-white/5" />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-80 h-24 border border-white/5 rounded-t-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <Link to="/" className="hover:text-[#00a8e8] transition font-bold">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#00a8e8] font-bold">Terms of Play</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-[#00a8e8] font-black italic text-xs tracking-[0.3em] mb-3 uppercase">Legal — Last Updated March 2026</p>
                <h1 className="text-6xl md:text-8xl font-black italic text-white leading-none">
                  TERMS<br />
                  <span className="text-[#00a8e8]">OF PLAY</span>
                </h1>
              </div>
              <div className="md:max-w-xs">
                <p className="text-slate-400 font-medium leading-relaxed text-sm">
                  These are the rules of the game — how CrickCart operates, what you can expect from us, and what we expect from you.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Section strip — outside hero so overflow-hidden doesn't block clicks */}
      <div className="bg-[#00171f] border-t border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`flex items-center gap-2 text-xs font-black whitespace-nowrap transition-all px-3 py-4 border-b-2 cursor-pointer ${
                  isActive
                    ? 'text-[#00a8e8] border-[#00a8e8]'
                    : 'text-slate-400 border-transparent hover:text-white hover:border-white/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.number}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-12">

          {/* Sticky Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Jump to Section</p>
              <nav className="space-y-1">
                {sections.map((s) => {
                  const Icon = s.icon;
                  const isActive = activeSection === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                        isActive
                          ? 'bg-[#00a8e8]/10 text-[#00a8e8]'
                          : 'text-slate-500 hover:text-[#00171f] hover:bg-slate-50'
                      }`}
                    >
                      <span className={`text-xs font-black tabular-nums ${isActive ? 'text-[#00a8e8]' : 'text-slate-300'}`}>
                        {s.number}
                      </span>
                      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#00a8e8]' : 'text-slate-400'}`} />
                      <span className="text-xs font-black leading-tight">{s.title}</span>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00a8e8]" />}
                    </button>
                  );
                })}
              </nav>

              {/* Contact CTA */}
              <div className="mt-8 p-4 bg-[#00171f] rounded-xl">
                <p className="text-xs font-black text-white mb-1">Got Questions?</p>
                <p className="text-xs text-slate-400 mb-3">Our support team can help clarify any terms.</p>
                <Link
                  to="/contact"
                  className="flex items-center gap-1.5 text-[#00a8e8] text-xs font-black hover:underline"
                >
                  Contact Support <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main ref={contentRef} className="flex-1 min-w-0">

            {/* Intro banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#00a8e8]/5 border-2 border-[#00a8e8]/20 rounded-2xl p-6 mb-12 flex gap-4"
            >
              <Shield className="w-8 h-8 text-[#00a8e8] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-[#00171f] mb-1">Plain Language Commitment</p>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  We've written these terms as clearly as possible. No hidden clauses, no confusing legalese. If anything is unclear, reach out to us at <span className="text-[#00a8e8] font-black">support@crickcart.in</span> and we'll explain it in plain Hindi or English.
                </p>
              </div>
            </motion.div>

            {/* Sections */}
            <div className="space-y-16">
              {sections.map((section, sIdx) => {
                const Icon = section.icon;
                return (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ delay: 0.05 }}
                  >
                    {/* Section Header */}
                    <div className="flex items-start gap-5 mb-8 pb-6 border-b-2 border-slate-100">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-[#00171f] rounded-2xl flex items-center justify-center">
                          <Icon className="w-7 h-7 text-[#00a8e8]" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#00a8e8] tracking-widest mb-1">SECTION {section.number}</p>
                        <h2 className="text-2xl md:text-3xl font-black italic text-[#00171f]">
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    {/* Sub-sections */}
                    <div className="space-y-6">
                      {section.content.map((item, idx) => (
                        <div
                          key={idx}
                          className="relative pl-6 border-l-2 border-slate-100 hover:border-[#00a8e8] transition-colors"
                        >
                          <h3 className="font-black text-[#00171f] mb-2 text-sm uppercase tracking-wide">
                            {item.heading}
                          </h3>
                          <p className="text-slate-600 font-medium leading-relaxed text-sm">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                );
              })}
            </div>

            {/* Footer CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-20 bg-[#00171f] rounded-2xl p-10 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white rounded-full" />
              </div>
              <div className="relative z-10">
                <p className="text-[#00a8e8] font-black italic text-xs tracking-widest mb-3">LAST UPDATED — MARCH 2026</p>
                <h3 className="text-3xl font-black italic text-white mb-3">PLAY BY THE RULES</h3>
                <p className="text-slate-400 font-medium text-sm mb-8 max-w-md mx-auto">
                  By using CrickCart, you agree to these Terms of Play. Questions? Our team is always happy to help.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/contact"
                    className="bg-[#00a8e8] text-white font-black italic px-8 py-3 rounded-lg hover:bg-[#0095d1] transition-all hover:scale-105 flex items-center gap-2"
                  >
                    CONTACT SUPPORT <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/"
                    className="border-2 border-white/20 text-white font-black italic px-8 py-3 rounded-lg hover:border-[#00a8e8] transition-all"
                  >
                    BACK TO HOME
                  </Link>
                </div>
              </div>
            </motion.div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default TermsOfPlay;