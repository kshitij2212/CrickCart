import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Navbar from "./components/common/Navbar";

// import ProductDetails from "./pages/ProductDetails";
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Orders from "./pages/Orders";
// import OrderDetails from "./pages/OrderDetails";
// import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        {/* Public Pages */}a
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        {/* <Route path="/products/:id" element={<ProductDetails />} /> */}

        {/* Auth */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}

        {/* User */}
        {/* <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/profile" element={<Profile />} /> */}

      </Routes>
    </BrowserRouter>
  );
}
