import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const footerLinks = {
    shop: [
      { label: "ALL PRODUCTS", to: "/products" },
      { label: "BATS", to: "/products/bats" },
      { label: "BALLS", to: "/products/balls" },
    ],
    support: [
      { label: "SHIPPING", to: "/shipping" },
      { label: "RETURNS", to: "/returns" },
      { label: "ORDER TRACKING", to: "/track-order" },
    ],
    legacy: [
      { label: "PRIVACY POLICY", to: "/privacy" },
      { label: "TERMS OF PLAY", to: "/terms" },
      { label: "CONTACT US", to: "/contact" },
    ],
  };

  return (
    <footer className="bg-[#00171f] text-white pt-20 pb-10 border-t-4 border-[#00a8e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-3xl text-[#00a8e8]">
                sports_cricket
              </span>
              <h1 className="text-3xl font-black italic tracking-tighter">
                CRICK<span className="text-[#00a8e8]">CART</span>
              </h1>
            </div>

            <p className="text-slate-400 text-sm mb-8 leading-relaxed italic">
              THE ULTIMATE DESTINATION FOR HIGH-PERFORMANCE CRICKET GEAR.
              FORGED IN TRADITION, BUILT FOR THE FUTURE.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/"
                className="w-12 h-12 bg-slate-800 flex items-center justify-center hover:bg-[#00a8e8] hover:text-[#00171f] transition-all"
                target="_blank"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>

              <a
                href="https://www.instagram.com/?hl=en"
                className="w-12 h-12 bg-slate-800 flex items-center justify-center hover:bg-[#00a8e8] hover:text-[#00171f] transition-all"
                target="_blank"
              >
                <FaInstagram className="w-5 h-5" />
              </a>

              <a
                href="https://x.com/"
                className="w-12 h-12 bg-slate-800 flex items-center justify-center hover:bg-[#00a8e8] hover:text-[#00171f] transition-all"
                target="_blank"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* SHOP ELITE */}
          <div>
            <h4 className="text-[#00a8e8] font-black italic text-xl mb-8">
              SHOP ELITE
            </h4>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-white transition text-sm font-bold italic"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ATHLETE SUPPORT */}
          <div>
            <h4 className="text-[#00a8e8] font-black italic text-xl mb-8">
              ATHLETE SUPPORT
            </h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-white transition text-sm font-bold italic"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGACY */}
          <div>
            <h4 className="text-[#00a8e8] font-black italic text-xl mb-8">
              LEGACY
            </h4>
            <ul className="space-y-4">
              {footerLinks.legacy.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-white transition text-sm font-bold italic"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-black italic tracking-widest uppercase">
            © 2026 CRICKCART. DOMINATE THE GAME.
          </p>

          <div className="flex gap-6 opacity-50">
            <span className="material-symbols-outlined text-3xl">
              credit_card
            </span>
            <span className="material-symbols-outlined text-3xl">
              account_balance_wallet
            </span>
            <span className="material-symbols-outlined text-3xl">
              token
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
