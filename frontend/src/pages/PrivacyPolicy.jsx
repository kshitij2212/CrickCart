import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Eye, Database, Share2, Lock, Bell, Trash2,
  Cookie, Globe, Mail, ChevronRight, Shield, UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  {
    id: 'overview',
    icon: Eye,
    number: '01',
    title: 'OVERVIEW',
    color: 'bg-[#00a8e8]',
    content: [
      {
        heading: 'Who We Are',
        text: 'CrickCart ("we", "our", "us") is an online cricket equipment store operated from Mumbai, India. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our website or mobile application.',
      },
      {
        heading: 'Our Commitment',
        text: 'We believe your privacy is a fundamental right. We collect only what we need, protect it seriously, and never sell it to anyone. This policy is written in plain language — if anything is unclear, reach out to us directly.',
      },
      {
        heading: 'Scope',
        text: 'This policy applies to all users of CrickCart — visitors, registered users, and customers. It covers data collected via our website, app, emails, and any other interactions you have with us.',
      },
    ],
  },
  {
    id: 'collection',
    icon: Database,
    number: '02',
    title: 'WHAT WE COLLECT',
    color: 'bg-emerald-500',
    content: [
      {
        heading: 'Information You Give Us',
        text: 'When you register, place orders, or contact us, we collect: full name, email address, phone number, delivery address, payment method details (we never store full card numbers), and any messages or reviews you submit.',
      },
      {
        heading: 'Information Collected Automatically',
        text: 'When you browse CrickCart, we automatically collect: IP address, browser type and version, device information, pages visited and time spent, referring URLs, and purchase history. This helps us improve your experience.',
      },
      {
        heading: 'Information from Third Parties',
        text: 'If you sign in via Google or social platforms, we may receive your name and email from those services. Payment processors may share transaction status with us. We do not receive your full payment credentials from these partners.',
      },
      {
        heading: 'Sensitive Information',
        text: 'We do not intentionally collect sensitive personal data such as biometric information, health data, or government ID numbers. Please do not share such information with us via the Platform.',
      },
    ],
  },
  {
    id: 'usage',
    icon: UserCheck,
    number: '03',
    title: 'HOW WE USE IT',
    color: 'bg-violet-500',
    content: [
      {
        heading: 'Order Processing',
        text: 'Your name, address, phone, and payment information are used solely to process, confirm, and deliver your orders. We also use this data to handle returns, refunds, and warranty claims.',
      },
      {
        heading: 'Account Management',
        text: 'We use your email and phone to send account-related communications: order confirmations, shipping updates, delivery notifications, and account security alerts. These are essential and cannot be opted out of.',
      },
      {
        heading: 'Improving Our Platform',
        text: 'Anonymized browsing data helps us understand which products are popular, how customers navigate the site, and where we can improve. No personally identifiable information is used in these analytics.',
      },
      {
        heading: 'Marketing Communications',
        text: 'With your consent, we may send promotional emails about new arrivals, sales, and cricket news. You can opt out of marketing emails at any time via the unsubscribe link or from account settings. Opting out does not affect transactional emails.',
      },
    ],
  },
  {
    id: 'sharing',
    icon: Share2,
    number: '04',
    title: 'WHO WE SHARE WITH',
    color: 'bg-amber-500',
    content: [
      {
        heading: 'We Never Sell Your Data',
        text: 'CrickCart does not sell, rent, or trade your personal information to any third party for their marketing purposes. Period. Your data is not a product.',
      },
      {
        heading: 'Delivery Partners',
        text: 'We share your name, address, and phone number with our courier partners (such as Delhivery, Shiprocket) solely to fulfill your delivery. These partners are bound by confidentiality agreements.',
      },
      {
        heading: 'Payment Processors',
        text: 'Payment data is processed by secure third-party gateways. We share only what is necessary to complete a transaction. These processors are PCI-DSS compliant and do not receive your full browsing or order history.',
      },
      {
        heading: 'Legal Requirements',
        text: 'We may disclose your information if required by law, court order, or government authority. We will notify you of such requests where legally permissible before disclosing.',
      },
      {
        heading: 'Business Transfers',
        text: 'If CrickCart is acquired or merges with another company, your data may be transferred as part of that transaction. We will notify you via email before your data becomes subject to a different privacy policy.',
      },
    ],
  },
  {
    id: 'security',
    icon: Lock,
    number: '05',
    title: 'HOW WE PROTECT IT',
    color: 'bg-[#00a8e8]',
    content: [
      {
        heading: 'Encryption',
        text: 'All data transmitted between your browser and CrickCart is protected with SSL/TLS encryption. Sensitive information at rest is encrypted using industry-standard AES-256 encryption.',
      },
      {
        heading: 'Access Controls',
        text: 'Access to personal data is restricted to employees who need it to perform their job. All staff with data access are trained in data protection and bound by confidentiality agreements.',
      },
      {
        heading: 'Payment Security',
        text: 'We never store full credit or debit card numbers on our servers. All payment processing is handled by PCI-DSS certified payment gateways. CrickCart only stores a tokenized reference to your payment method.',
      },
      {
        heading: 'Incident Response',
        text: 'In the unlikely event of a data breach affecting your personal information, we will notify you within 72 hours via email and take immediate steps to contain and remediate the breach.',
      },
    ],
  },
  {
    id: 'cookies',
    icon: Cookie,
    number: '06',
    title: 'COOKIES & TRACKING',
    color: 'bg-orange-500',
    content: [
      {
        heading: 'What Are Cookies',
        text: 'Cookies are small files stored on your device that help websites remember your preferences and understand how you use them. CrickCart uses cookies to make your shopping experience smoother.',
      },
      {
        heading: 'Essential Cookies',
        text: 'These cookies are necessary for the Platform to function — keeping you logged in, remembering your cart, and securing your session. These cannot be disabled without breaking core functionality.',
      },
      {
        heading: 'Analytics Cookies',
        text: 'We use analytics tools (such as Google Analytics) to understand how users interact with our site. These cookies collect anonymized data about pages visited, time on site, and traffic sources.',
      },
      {
        heading: 'Managing Cookies',
        text: 'You can control cookies via your browser settings. Blocking all cookies may affect the functionality of CrickCart. Most browsers allow you to accept, reject, or delete cookies at any time.',
      },
    ],
  },
  {
    id: 'rights',
    icon: Shield,
    number: '07',
    title: 'YOUR RIGHTS',
    color: 'bg-teal-500',
    content: [
      {
        heading: 'Access Your Data',
        text: 'You have the right to request a copy of all personal data we hold about you. Submit a request via your account settings or email us at privacy@crickcart.in. We will respond within 30 days.',
      },
      {
        heading: 'Correct Your Data',
        text: 'If any information we hold is inaccurate or incomplete, you can update it directly from your account settings or by contacting us. We will correct it promptly.',
      },
      {
        heading: 'Delete Your Data',
        text: 'You may request deletion of your account and associated personal data at any time. Note that we may retain certain data as required by law (e.g., transaction records for tax purposes) even after account deletion.',
      },
      {
        heading: 'Withdraw Consent',
        text: 'Where we rely on your consent to process data (e.g., marketing emails), you can withdraw that consent at any time without affecting the lawfulness of prior processing.',
      },
      {
        heading: 'Data Portability',
        text: 'You may request your personal data in a structured, machine-readable format (CSV or JSON). This allows you to transfer your data to another service if you choose.',
      },
    ],
  },
  {
    id: 'notifications',
    icon: Bell,
    number: '08',
    title: 'COMMUNICATIONS',
    color: 'bg-pink-500',
    content: [
      {
        heading: 'Transactional Emails',
        text: 'Order confirmations, shipping updates, and account alerts are essential communications. These are sent automatically and cannot be opted out of as long as your account is active.',
      },
      {
        heading: 'Marketing Emails',
        text: 'We send promotional emails only with your explicit consent. These include new product launches, sale announcements, and cricket tips. You can unsubscribe at any time via the link in every email.',
      },
      {
        heading: 'SMS & WhatsApp',
        text: 'With your consent, we may send order updates via SMS or WhatsApp. These are limited to transactional messages. Reply STOP to any SMS to opt out. Data charges from your carrier may apply.',
      },
    ],
  },
  {
    id: 'retention',
    icon: Trash2,
    number: '09',
    title: 'DATA RETENTION',
    color: 'bg-red-500',
    content: [
      {
        heading: 'How Long We Keep Data',
        text: 'We retain your personal data for as long as your account is active or as needed to provide services. Account data is deleted within 30 days of an account deletion request, subject to legal retention obligations.',
      },
      {
        heading: 'Transaction Records',
        text: 'Financial transaction records (order history, invoices, payment references) are retained for 7 years as required by Indian tax law under the GST regime. These records are secured and not used for marketing.',
      },
      {
        heading: 'Analytics Data',
        text: 'Anonymized analytics data may be retained indefinitely as it cannot be linked back to an individual. Identified behavioral data (e.g., browsing linked to your account) is deleted after 2 years of account inactivity.',
      },
    ],
  },
  {
    id: 'international',
    icon: Globe,
    number: '10',
    title: 'INTERNATIONAL & UPDATES',
    color: 'bg-[#00a8e8]',
    content: [
      {
        heading: 'Data Location',
        text: 'CrickCart stores and processes data primarily in India on servers compliant with Indian data protection regulations. We do not transfer your data internationally except where necessary for payment processing, in which case GDPR-equivalent safeguards apply.',
      },
      {
        heading: 'Governing Law',
        text: 'This Privacy Policy is governed by the Information Technology Act, 2000, and the IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, applicable in India.',
      },
      {
        heading: 'Policy Updates',
        text: 'We may update this Privacy Policy from time to time. Significant changes will be communicated via email or a prominent notice on the Platform. The updated policy will be effective from the date shown at the top of this page.',
      },
      {
        heading: 'Contact the Privacy Team',
        text: 'For any privacy-related questions, requests, or complaints, contact our Privacy Officer at privacy@crickcart.in or write to us at CrickCart Pvt. Ltd., Mumbai, Maharashtra – 400001. We aim to respond within 72 hours.',
      },
    ],
  },
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = window.scrollY;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);

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
      <div
        className="fixed top-0 left-0 z-50 h-1 bg-[#00a8e8] transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />
      <div className="bg-[#00171f] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-white"
              style={{
                width: `${200 + i * 120}px`,
                height: `${200 + i * 120}px`,
                top: '-20%',
                right: '-5%',
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                transform: `rotate(${i * 15}deg)`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-0 relative z-10">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link to="/" className="hover:text-[#00a8e8] transition font-bold">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#00a8e8] font-bold">Privacy Policy</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-12">
            <div>
              <p className="text-[#00a8e8] font-black italic text-xs tracking-[0.3em] mb-3 uppercase">
                Legal — Last Updated March 2026
              </p>
              <h1 className="text-6xl md:text-8xl font-black italic text-white leading-none mb-4">
                PRIVACY<br />
                <span className="text-[#00a8e8]">POLICY</span>
              </h1>
              <div className="flex items-center gap-3 mt-6">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                  <Lock className="w-3.5 h-3.5 text-[#00a8e8]" />
                  <span className="text-xs font-black text-white">SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                  <Shield className="w-3.5 h-3.5 text-[#00a8e8]" />
                  <span className="text-xs font-black text-white">No Data Selling</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                  <Eye className="w-3.5 h-3.5 text-[#00a8e8]" />
                  <span className="text-xs font-black text-white">Full Transparency</span>
                </div>
              </div>
            </div>
            <div className="lg:max-w-xs pb-4">
              <p className="text-slate-400 font-medium leading-relaxed text-sm">
                Your data. Your rights. Our responsibility. This policy explains exactly what we collect, why we collect it, and how we keep it safe.
              </p>
            </div>
          </div>

          <div className="border-t border-white/10">
            <div className="py-3 flex items-center gap-4 overflow-x-auto no-scrollbar">
              {sections.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`flex items-center gap-1.5 text-xs font-black whitespace-nowrap transition-all py-1 border-b-2 ${
                      activeSection === s.id
                        ? 'text-[#00a8e8] border-[#00a8e8]'
                        : 'text-slate-500 border-transparent hover:text-slate-300'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {s.number}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-12">

          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Contents</p>
              <nav className="space-y-0.5">
                {sections.map((s) => {
                  const Icon = s.icon;
                  const isActive = activeSection === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-[#00a8e8]/10 text-[#00a8e8]'
                          : 'text-slate-500 hover:text-[#00171f] hover:bg-slate-50'
                      }`}
                    >
                      <span className={`text-xs font-black tabular-nums w-5 ${isActive ? 'text-[#00a8e8]' : 'text-slate-300'}`}>
                        {s.number}
                      </span>
                      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#00a8e8]' : 'text-slate-400'}`} />
                      <span className="text-xs font-black leading-tight truncate">{s.title}</span>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00a8e8] flex-shrink-0" />}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 p-4 bg-[#00171f] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-[#00a8e8]" />
                  <p className="text-xs font-black text-white">Privacy Officer</p>
                </div>
                <p className="text-xs text-[#00a8e8] font-black mb-1">privacy@crickcart.in</p>
                <p className="text-xs text-slate-400">Responds within 72 hours</p>
              </div>

              <div className="mt-4 space-y-1">
                <Link
                  to="/terms"
                  className="flex items-center gap-2 text-xs text-slate-500 hover:text-[#00a8e8] font-black transition px-3 py-2"
                >
                  <ChevronRight className="w-3 h-3" /> Terms of Play
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center gap-2 text-xs text-slate-500 hover:text-[#00a8e8] font-black transition px-3 py-2"
                >
                  <ChevronRight className="w-3 h-3" /> Contact Support
                </Link>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
            >
              {[
                { icon: Lock, title: 'We never sell your data', sub: 'Not to anyone. Ever.', bg: 'bg-[#00a8e8]/5 border-[#00a8e8]/20' },
                { icon: Shield, title: 'AES-256 encryption', sub: 'Data at rest & in transit', bg: 'bg-emerald-50 border-emerald-200' },
                { icon: UserCheck, title: 'Your data, your rights', sub: 'Access, edit, or delete anytime', bg: 'bg-violet-50 border-violet-200' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className={`${item.bg} border-2 rounded-xl p-5`}>
                    <Icon className="w-5 h-5 text-[#00a8e8] mb-3" />
                    <p className="font-black text-[#00171f] text-sm">{item.title}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">{item.sub}</p>
                  </div>
                );
              })}
            </motion.div>

            <div className="space-y-16">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-start gap-5 mb-8 pb-6 border-b-2 border-slate-100">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-[#00171f] rounded-2xl flex items-center justify-center">
                          <Icon className="w-7 h-7 text-[#00a8e8]" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#00a8e8] tracking-widest mb-1">
                          SECTION {section.number}
                        </p>
                        <h2 className="text-2xl md:text-3xl font-black italic text-[#00171f]">
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {section.content.map((item, idx) => (
                        <div
                          key={idx}
                          className="relative pl-6 border-l-2 border-slate-100 hover:border-[#00a8e8] transition-colors duration-200"
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

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-20 bg-[#00171f] rounded-2xl p-10 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.04]">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute border border-white rounded-full"
                    style={{
                      width: `${150 + i * 100}px`,
                      height: `${150 + i * 100}px`,
                      bottom: '-20%',
                      right: '5%',
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                  <p className="text-[#00a8e8] font-black italic text-xs tracking-widest mb-2">
                    EFFECTIVE — MARCH 2026
                  </p>
                  <h3 className="text-3xl font-black italic text-white mb-2">
                    YOUR PRIVACY MATTERS
                  </h3>
                  <p className="text-slate-400 font-medium text-sm max-w-md">
                    Questions about how we handle your data? Our Privacy Officer responds within 72 hours.
                  </p>
                </div>
                <div className="flex flex-col gap-3 flex-shrink-0">
                  <a
                    href="mailto:privacy@crickcart.in"
                    className="flex items-center gap-2 bg-[#00a8e8] text-white font-black italic px-6 py-3 rounded-lg hover:bg-[#0095d1] transition-all hover:scale-105"
                  >
                    <Mail className="w-4 h-4" />
                    EMAIL PRIVACY TEAM
                  </a>
                  <Link
                    to="/terms"
                    className="flex items-center justify-center gap-2 border-2 border-white/20 text-white font-black italic px-6 py-3 rounded-lg hover:border-[#00a8e8] transition-all text-sm"
                  >
                    VIEW TERMS OF PLAY <ChevronRight className="w-4 h-4" />
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

export default PrivacyPolicy;