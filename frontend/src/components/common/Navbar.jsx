import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const TICKER_ITEMS = [
  "FREE SHIPPING ON ORDERS OVER ₹999",
  "NEW SEASON BATS JUST DROPPED",
  "OFFICIAL SHREY HELMETS",
  "SALE — UP TO 40% OFF",
  "SAME DAY DISPATCH BEFORE 2PM",
];

const NAV_LINKS = [
  { label: "HOME", to: "/", active: true },
  { label: "BATS", to: "/bats" },
  { label: "BALLS", to: "/balls" },
  { label: "OTHERS", to: "/others" },
  { label: "SALE", to: "/sale", highlight: true },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Ticker */}
      <div className="bg-[#00a8e8] h-7 overflow-hidden flex items-center">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "ticker 20s linear infinite" }}
        >
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex">
              {TICKER_ITEMS.map((item, j) => (
                <span
                  key={j}
                  className="text-[11px] tracking-widest text-[#00171f] px-8 flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-[#00171f] opacity-40" />
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-[#001f3f] border-b-2 border-[#00a8e8] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link
              to="/"
              className="text-3xl font-black italic tracking-tighter">
              CRICK<span className="text-[#00a8e8]">CART</span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  className="w-full pl-4 pr-10 py-2 border-2 border-slate-700 bg-slate-900 focus:border-[#00a8e8] focus:ring-0 text-sm placeholder-slate-500 italic font-bold transition-colors"
                  placeholder="SEARCH ELITE GEAR..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#00a8e8] text-[20px]">
                  search
                </span>
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-6">

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="flex items-center justify-center w-10 h-10 hover:text-red-500 transition"
              >
                <span className="material-symbols-outlined text-[24px] leading-none">
                  favorite
                </span>
              </Link>

              {/* Profile / Login */}
              <Link
                to={isAuthenticated ? '/profile' : '/login'}
                className="flex items-center justify-center w-10 h-10 hover:text-[#00a8e8] transition">
                <span className="material-symbols-outlined text-[24px] leading-none">
                  person
                </span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="flex items-center justify-center w-10 h-10 hover:text-[#00a8e8] transition">
                <span className="material-symbols-outlined text-[24px] leading-none">
                  shopping_cart
                </span>
              </Link>

              {/* Mobile Menu */}
              <button
                className="md:hidden p-2 hover:text-[#00a8e8] transition"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="material-symbols-outlined text-[26px]">
                  {menuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="bg-[#00a8e8]/10 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex justify-center space-x-8 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-xs font-black italic transition-colors ${
                  link.highlight
                    ? "text-red-500 hover:text-red-200"
                    : link.active
                    ? "text-[#00a8e8] border-b-2 border-[#00a8e8]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Search */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-white/10">
            <div className="px-4 py-3">
              <input
                className="w-full pl-4 pr-10 py-2 border-2 border-slate-700 bg-slate-800 focus:border-[#00a8e8] text-sm placeholder-slate-500 italic font-bold"
                placeholder="SEARCH ELITE GEAR..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}
      </header>
    </div>
  );
}