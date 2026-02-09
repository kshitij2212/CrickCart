import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black text-white">
      <Link to="/" className="text-xl font-bold">
        CrickCart 🏏
      </Link>

      <div className="flex gap-4">
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}
