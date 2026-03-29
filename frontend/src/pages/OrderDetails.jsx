import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, MapPin, CreditCard, Truck, ChevronLeft, Calendar, Phone, User } from 'lucide-react';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(id);
      setOrder(data.data);
      console.log('Shipping:', JSON.stringify(data.data.shippingAddress, null, 2));
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00a8e8]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-black italic text-[#00171f] mb-4">
            ORDER NOT FOUND
          </h2>
          <button
            onClick={() => navigate('/orders')}
            className="bg-[#00a8e8] text-white font-black italic px-8 py-3 rounded-lg hover:bg-[#0095d1] transition"
          >
            BACK TO ORDERS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-slate-600 hover:text-[#00a8e8] mb-8 font-bold transition"
        >
          <ChevronLeft className="w-5 h-5" />
          BACK TO ORDERS
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black italic text-[#00171f] mb-2">
            ORDER DETAILS
          </h1>
          <p className="text-[#00a8e8] font-bold italic">
            Order ID: #{order._id.slice(-8).toUpperCase()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">

            {/* Items */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-100">
              <h2 className="text-2xl font-black italic text-[#00171f] mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-[#00a8e8]" />
                ORDER ITEMS
              </h2>

              <div className="space-y-4">
                {order.orderItems?.map((item) => {
                  const product = item.product || {};
                  return (
                    <div key={item._id} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={product.images?.[0] || 'https://via.placeholder.com/100'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-lg uppercase line-clamp-2">
                          {product.name}
                        </h4>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm bg-slate-100 px-3 py-1 rounded-lg font-bold">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-black text-xl text-[#00a8e8]">
                            ₹{Math.round(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-100">
              <h2 className="text-2xl font-black italic text-[#00171f] mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[#00a8e8]" />
                SHIPPING ADDRESS
              </h2>


              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-400" />
                  <span className="font-bold">{order.shippingAddress?.name}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <p className="font-bold">{order.shippingAddress?.street}</p>
                    <p className="text-slate-600">
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="font-bold">{order.shippingAddress?.phone}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-100 sticky top-24">
              <h2 className="text-xl font-black italic text-[#00171f] mb-6">
                ORDER SUMMARY
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Ordered On</p>
                    <p className="font-black">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                  <CreditCard className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Payment Method</p>
                    <p className="font-black uppercase">{order.payment?.method}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                  <Truck className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Status</p>
                    <p className="font-black uppercase text-[#00a8e8]">{order.orderStatus}</p>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 font-bold">Subtotal</span>
                    <span className="font-black">₹{Math.round(order.pricing?.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 font-bold">Shipping</span>
                    <span className="font-black text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm border-t-2 border-slate-200 pt-4">
                    <span className="text-base font-black uppercase">Total</span>
                    <span className="text-3xl font-black text-[#00a8e8]">₹{Math.round(order.pricing?.totalPrice)}</span>
                  </div>
                </div>

                {order.payment?.status === 'Completed' && (
                  <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <p className="text-green-800 font-bold text-center">
                      ✓ Payment Completed
                    </p>
                  </div>
                )}

                {!order.payment?.status === 'Completed' && order.payment?.method === 'cod' && (
                  <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-bold text-center text-sm">
                      Cash on Delivery
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetails;