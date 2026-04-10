import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  TrendingUp,
  Eye,
  Loader2,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Overview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const requests = [
          api.get('/products?limit=1'),
          api.get('/orders?limit=5'),
          api.get('/admin/users?count=true'),
        ];

        const [pRes, oRes, uRes] = await Promise.allSettled(requests);

        let totalProducts = 0;
        if (pRes.status === 'fulfilled') {
          totalProducts = pRes.value.data?.total ?? 0;
        }

        let orders = [];
        let totalOrders = 0;
        let totalRevenue = 0;
        if (oRes.status === 'fulfilled') {
          orders = oRes.value.data?.data || [];
          totalOrders = oRes.value.data?.total ?? orders.length;
          totalRevenue = orders.reduce((sum, o) => sum + (o.pricing?.totalPrice || 0), 0);
        }

        let totalUsers = 0;
        if (uRes.status === 'fulfilled') {
          const d = uRes.value.data;
          totalUsers = Array.isArray(d) ? d.length : d?.total ?? 0;
        }

        setStats({ totalProducts, totalOrders, totalUsers, totalRevenue });
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        toast.error('Failed to load dashboard stats');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-500', trend: '+12%', path: '/admin/products' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-green-500', trend: '+8%', path: '/admin/orders' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-purple-500', trend: '+23%', path: '/admin/users' },
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'bg-[#00a8e8]', trend: '+15%' },
  ];

  const statusColors = {
    Delivered: 'bg-green-100 text-green-600',
    Processing: 'bg-yellow-100 text-yellow-700',
    Cancelled: 'bg-red-100 text-red-600',
    Shipped: 'bg-blue-100 text-blue-700',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#00a8e8] animate-spin mb-4" />
        <p className="text-gray-500 font-bold italic animate-pulse">
          FETCHING DASHBOARD DATA...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black italic font-athletic text-[#00171f]">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome, Admin!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => {
          const card = (
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                  <TrendingUp className="w-4 h-4" />
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>
              <p className="text-3xl font-black">{stat.value}</p>
            </div>
          );

          return stat.path ? (
            <Link to={stat.path} key={idx} className="block">
              {card}
            </Link>
          ) : (
            <div key={idx}>{card}</div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-black italic font-athletic mb-4">RECENT ORDERS</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-bold">Order ID</th>
                <th className="text-left py-3 px-4 font-bold">Customer</th>
                <th className="text-left py-3 px-4 font-bold">Amount</th>
                <th className="text-left py-3 px-4 font-bold">Status</th>
                <th className="text-left py-3 px-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-3 px-4 text-center text-gray-500">No recent orders</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id || order.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">#{(order.orderNumber || order._id || order.id)?.toString().slice(-6).toUpperCase()}</td>
                    <td className="py-3 px-4">{order.user?.name || 'Unknown'}</td>
                    <td className="py-3 px-4 font-bold">₹{(order.pricing?.totalPrice || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-600'} text-xs font-bold rounded`}>
                        {order.orderStatus || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
