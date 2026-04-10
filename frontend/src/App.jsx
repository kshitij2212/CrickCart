import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

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
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Navbar />} />
      </Routes>

      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>

            <Route path="/" element={<ProtectedRoute userOnly><Home /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute userOnly><Products /></ProtectedRoute>} />
            <Route path="/products/:id" element={<ProtectedRoute userOnly><ProductDetails /></ProtectedRoute>} />
            <Route path="/login" element={<ProtectedRoute userOnly><Login /></ProtectedRoute>} />
            <Route path="/register" element={<ProtectedRoute userOnly><Register /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute userOnly><ContactUs /></ProtectedRoute>} />
            <Route path="/privacy" element={<ProtectedRoute userOnly><PrivacyPolicy /></ProtectedRoute>} />
            <Route path="/terms" element={<ProtectedRoute userOnly><TermsOfPlay /></ProtectedRoute>} />

            <Route
              path="/cart"
              element={
                <ProtectedRoute requireAuth userOnly>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute requireAuth userOnly>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute requireAuth userOnly>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute requireAuth userOnly>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute requireAuth userOnly>
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute requireAuth userOnly>
                  <Profile />
                </ProtectedRoute>
              }
            />

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

      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Footer />} />
      </Routes>
    </div>
  );
}