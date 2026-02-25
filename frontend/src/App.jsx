import { Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Dashboard from "./pages/admin/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        <Routes>

          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ===== PROTECTED USER ROUTES ===== */}
          <Route
            path="/cart"
            element={<ProtectedRoute> <Cart/> </ProtectedRoute>}
          />

          <Route
            path="/checkout"
            element={<ProtectedRoute> <Checkout/> </ProtectedRoute>}
          />

          <Route
            path="/orders"
            element={<ProtectedRoute> <Orders/> </ProtectedRoute>}
          />

          <Route
            path="/orders/:id"
            element={<ProtectedRoute> <OrderDetails/> </ProtectedRoute>}
          />

          <Route
            path="/wishlist"
            element={<ProtectedRoute> <Wishlist/> </ProtectedRoute>}
          />

          <Route
            path="/orders/:id"
            element={<ProtectedRoute> <OrderDetails/> </ProtectedRoute>}
          />

          <Route
            path="/profile"
            element={<ProtectedRoute> <Profile/> </ProtectedRoute>}
          />

          {/* ===== ADMIN ROUTE ===== */}
          <Route
            path="/admin"
            element={<ProtectedRoute> <Dashboard/> </ProtectedRoute>}
          />

        </Routes>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
