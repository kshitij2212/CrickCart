import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, XCircle, ChevronRight, Calendar, MapPin } from 'lucide-react';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, delivered, cancelled

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.orderStatus === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00a8e8] mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-[#00a8e8]/10 to-[#00a8e8]/5 rounded-full flex items-center justify-center">
            <Package className="w-20 h-20 text-[#00a8e8]" />
          </div>
          
          <h2 className="text-4xl font-black italic text-[#00171f] mb-4">
            NO ORDERS YET
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Start shopping and your orders will appear here!
          </p>
          
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00a8e8] to-[#0095d1] text-white font-black italic px-8 py-4 rounded-lg hover:shadow-xl hover:shadow-[#00a8e8]/20 hover:scale-105 transition-all duration-300"
          >
            <Package className="w-5 h-5" />
            START SHOPPING
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-black italic text-[#00171f] mb-3">
            MY ORDERS
          </h1>
          <p className="text-[#00a8e8] font-bold italic text-lg">
            {orders.length} {orders.length === 1 ? 'ORDER' : 'ORDERS'}
          </p>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border-2 border-slate-100">
              <p className="text-xl font-bold text-slate-500">
                No {filter !== 'all' ? filter : ''} orders found
              </p>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-slate-100 hover:border-[#00a8e8]/30 hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-slate-50 to-white p-6 border-b-2 border-slate-100">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(order.orderStatus)}
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                          Order ID
                        </p>
                        <p className="font-black text-[#00171f]">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-lg border-2 ${getStatusColor(order.orderStatus)} font-black italic text-sm uppercase`}>
                        {order.orderStatus}
                      </div>
                      <Link
                        to={`/orders/${order._id}`}
                        className="flex items-center gap-2 bg-[#00171f] text-white px-5 py-2 rounded-lg hover:bg-[#00a8e8] transition-all font-black italic text-sm"
                      >
                        VIEW DETAILS
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Ordered On</p>
                        <p className="font-bold text-[#00171f]">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Shipping To</p>
                        <p className="font-bold text-[#00171f] line-clamp-1">
                          {order.shippingAddress?.street}, {order.shippingAddress?.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Total Amount</p>
                        <p className="font-black text-2xl text-[#00a8e8]">
                          ₹{Math.round(order.pricing?.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <p className="text-xs font-black uppercase text-slate-500 mb-4">
                    {order.orderItems?.length || 0} {order.orderItems?.length === 1 ? 'ITEM' : 'ITEMS'}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {order.orderItems?.slice(0, 4).map((item) => (
                      <div key={item._id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 border-2 border-slate-200 group-hover:border-[#00a8e8] transition">
                          <img
                            src={item.product?.images?.[0] || 'https://via.placeholder.com/200'}
                            alt={item.product?.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="absolute top-2 right-2 bg-[#00a8e8] text-white text-xs font-black px-2 py-1 rounded-lg">
                          x{item.quantity}
                        </div>
                      </div>
                    ))}
                    {order.orderItems?.length > 5 && (
                      <div className="aspect-square rounded-lg bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                        <p className="text-slate-500 font-black text-lg">
                          +{order.orderItems.length - 4}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Orders;