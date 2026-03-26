import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import categoryService from "../../services/categoryService";

const TICKER_ITEMS = [
  "FREE SHIPPING ON ORDERS OVER ₹999",
  "NEW SEASON BATS JUST DROPPED",
  "OFFICIAL SHREY HELMETS",
  "SALE — Upto 90% OFF",
  "SAME DAY DISPATCH BEFORE 2PM",
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]); // ✅ Dynamic categories
  const { isAuthenticated } = useAuth();

  // ✅ Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div>
      {/* Ticker */}
      <div className="bg-[#00a8e8] h-7 overflow-hidden flex items-center">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "ticker 20s linear infinite" }}
        >
          {[...Array(2)].map((_, i) => (
            <span key={`ticker-set-${i}`} className="flex">
              {TICKER_ITEMS.map((item, j) => (
                <span
                  key={`ticker-${i}-${j}`}
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
              className="text-3xl font-black italic tracking-tighter hover:opacity-80 transition"
            >
              CRICK<span className="text-[#00a8e8]">CART</span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  className="w-full pl-4 pr-10 py-2 border-2 border-slate-700 bg-slate-900 focus:border-[#00a8e8] focus:ring-0 text-sm placeholder-slate-500 italic font-bold transition-colors rounded"
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
                title="Wishlist"
              >
                <span className="material-symbols-outlined text-[24px] leading-none">
                  favorite
                </span>
              </Link>

              {/* Profile / Login */}
              <Link
                to={isAuthenticated ? '/profile' : '/login'}
                className="flex items-center justify-center w-10 h-10 hover:text-[#00a8e8] transition"
                title={isAuthenticated ? 'Profile' : 'Login'}
              >
                <span className="material-symbols-outlined text-[24px] leading-none">
                  person
                </span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="flex items-center justify-center w-10 h-10 hover:text-[#00a8e8] transition"
                title="Cart"
              >
                <span className="material-symbols-outlined text-[24px] leading-none">
                  shopping_cart
                </span>
              </Link>

              {/* Mobile Menu */}
              <button
                className="md:hidden p-2 hover:text-[#00a8e8] transition"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <span className="material-symbols-outlined text-[26px]">
                  {menuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links - ✅ DYNAMIC */}
        <nav className="hidden md:block bg-[#00a8e8]/10 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex justify-center space-x-8 py-3">
            <Link
              to="/"
              className="text-xs font-black italic text-slate-400 hover:text-white transition-colors"
            >
              HOME
            </Link>
            
            {categories.map((category) => (
              <Link
                key={category._id || category.id}
                to={`/products?category=${category._id || category.id}`}
                className="text-xs font-black italic text-slate-400 hover:text-[#00a8e8] transition-colors uppercase"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-white/10">
            <div className="px-4 py-3 border-b border-white/10">
              <input
                className="w-full pl-4 pr-10 py-2 border-2 border-slate-700 bg-slate-800 focus:border-[#00a8e8] focus:ring-0 text-sm placeholder-slate-500 italic font-bold rounded"
                placeholder="SEARCH ELITE GEAR..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <nav className="px-4 py-4 space-y-3">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-black italic text-slate-400 hover:text-white transition py-2"
              >
                HOME
              </Link>

              {categories.map((category) => (
                <Link
                  key={category._id || category.id}
                  to={`/products?category=${category._id || category.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm font-black italic text-slate-400 hover:text-[#00a8e8] transition py-2 uppercase"
                >
                  {category.name}
                </Link>
              ))}

            </nav>
          </div>
        )}
      </header>
    </div>
  );
}