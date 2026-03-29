import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Lazy-loaded pages
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfPlay = lazy(() => import("./pages/TermsOfPlay"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-[#00171f] font-semibold">
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar - Hide on admin pages */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Navbar />} />
      </Routes>

      {/* Main Content */}
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ===== PUBLIC ROUTES ===== */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfPlay />} />

            {/* ===== PROTECTED USER ROUTES ===== */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* ===== ADMIN ROUTES ===== */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute adminOnly>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>

      {/* Footer - Hide on admin pages */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Footer />} />
      </Routes>
    </div>
  );
}