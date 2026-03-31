import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import ConfirmDialog from '../components/common/ConfirmDialog';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, fetchCart, updateCartItem, removeFromCart, loading } = useCart();
  const [updating, setUpdating] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    itemId: null,
    itemName: '',
  });

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);

  const totalPrice = cart?.items?.reduce((sum, item) =>
    sum + (item.product?.finalPrice || item.product?.price || item.price) * item.quantity, 0
  ) || 0;

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating({ ...updating, [itemId]: true });
    try {
      await updateCartItem(itemId, newQuantity);
      toast.success('Quantity updated!', { duration: 1500 });
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setUpdating({ ...updating, [itemId]: false });
    }
  };

  const handleRemoveClick = (item) => {
    setConfirmDialog({
      isOpen: true,
      itemId: item.id,
      itemName: item.product?.name || 'this item',
    });
  };

  const handleRemoveConfirm = async () => {
    try {
      await removeFromCart(confirmDialog.itemId);
      setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
    } catch (error) {
      toast.error('Failed to remove item');
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
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
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
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.items.map((item) => {
                const itemPrice = item.product?.finalPrice || item.product?.price || item.price;
                const originalPrice = item.product?.price;
                const hasDiscount = item.product?.discount > 0;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex gap-6">
                      <img
                        src={item.product?.images?.[0]}
                        alt={item.product?.name}
                        className="w-24 h-24 object-cover rounded"
                      />

                      <div className="flex-1">
                        <h3 className="text-lg font-black italic font-athletic">
                          {item.product?.name}
                        </h3>

                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-[#00a8e8] font-bold text-xl">
                            ₹{Math.round(itemPrice)}
                          </p>
                          {hasDiscount && (
                            <>
                              <p className="text-gray-400 line-through text-sm">
                                ₹{originalPrice}
                              </p>
                              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded font-bold">
                                -{item.product.discount}%
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center border-2 border-gray-300 rounded">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={updating[item.id]}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 transition"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 font-bold">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updating[item.id]}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveClick(item)}
                            className="flex items-center gap-2 text-red-500 hover:text-red-700 transition font-bold"
                          >
                            <Trash2 className="w-5 h-5" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Subtotal</p>
                        <p className="text-2xl font-black italic">
                          ₹{Math.round(itemPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-black italic font-athletic mb-6">
                ORDER SUMMARY
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">₹{Math.round(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-bold">TBD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-bold">₹{Math.round(totalPrice * 0.18)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-black">TOTAL</span>
                    <span className="text-2xl font-black text-[#00a8e8]">
                      ₹{Math.round(totalPrice + 100 + Math.round(totalPrice * 0.18))}
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

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, itemId: null, itemName: '' })}
        onConfirm={handleRemoveConfirm}
        title="REMOVE FROM CART"
        message={`Are you sure you want to remove "${confirmDialog.itemName}" from your cart?`}
        type="danger"
      />
    </div>
  );
};

export default Cart;