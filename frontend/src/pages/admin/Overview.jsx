import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, IndianRupee, TrendingUp } from 'lucide-react';

const Overview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    setStats({
      totalProducts: 145,
      totalOrders: 89,
      totalUsers: 234,
      totalRevenue: 567890,
    });
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      trend: '+8%',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      trend: '+23%',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'bg-[#00a8e8]',
      trend: '+15%',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black italic font-athletic text-[#00171f]">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-2">Welcome, Admin!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
          >
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
        ))}
      </div>

      {/* Recent Orders */}
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
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">#ORD-001</td>
                <td className="py-3 px-4">John Doe</td>
                <td className="py-3 px-4 font-bold">₹15,000</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded">
                    Delivered
                  </span>
                </td>
                <td className="py-3 px-4">14 Feb 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;