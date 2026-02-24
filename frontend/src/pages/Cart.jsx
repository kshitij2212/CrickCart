import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth'; // add this

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // add this
  const { cart, fetchCart, updateCartItem, removeFromCart, loading } = useCart();
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    if (isAuthenticated) { // only fetch if logged in
      fetchCart();
    }
  }, [isAuthenticated]); // depend on isAuthenticated

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating({ ...updating, [itemId]: true });
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setUpdating({ ...updating, [itemId]: false });
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      try {
        await removeFromCart(itemId);
      } catch (error) {
        console.error('Remove error:', error);
      }
    }
  };

  const handleCheckout = () => {
    if (!cart?.items?.length) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a8e8]"></div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center diagonal-bg">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-3xl font-black italic font-athletic text-[#00171f] mb-4">
            YOUR CART IS EMPTY
          </h2>
          <p className="text-gray-600 mb-8">
            Add some products to get started!
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-4 bg-[#00a8e8] text-white font-black italic hover:bg-[#0095d1] transition"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen diagonal-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-black italic font-athletic text-[#00171f] mb-8">
          YOUR CART
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <img
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                      alt={item.product?.name}
                      className="w-24 h-24 object-cover rounded"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-black italic font-athletic">
                        {item.product?.name}
                      </h3>
                      <p className="text-[#00a8e8] font-bold text-xl mt-2">
                        ₹{item.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border-2 border-gray-300 rounded">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={updating[item.id]}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-bold">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updating[item.id]}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="text-2xl font-black italic">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-black italic font-athletic mb-6">
                ORDER SUMMARY
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">₹{cart.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-bold">₹100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-bold">
                    ₹{Math.round(cart.totalPrice * 0.18)}
                  </span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-black">TOTAL</span>
                    <span className="text-2xl font-black text-[#00a8e8]">
                      ₹{cart.totalPrice + 100 + Math.round(cart.totalPrice * 0.18)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#00a8e8] text-white font-black py-4 italic hover:bg-[#0095d1] transition transform hover:scale-105"
              >
                PROCEED TO CHECKOUT
              </button>

              <Link
                to="/products"
                className="block text-center mt-4 text-[#00a8e8] font-bold hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;