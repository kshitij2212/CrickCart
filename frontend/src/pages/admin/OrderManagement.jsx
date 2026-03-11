import { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // TODO: Fetch orders from API
    setTimeout(() => {
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-2026-001',
          user: { name: 'John Doe', email: 'john@example.com' },
          totalPrice: 15000,
          orderStatus: 'Delivered',
          createdAt: '2026-02-14',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // TODO: Update order status API call
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-black italic font-athletic text-[#00171f] mb-8">
        ORDER MANAGEMENT
      </h1>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders by order number or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00a8e8] focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-bold">Order #</th>
                <th className="text-left py-4 px-6 font-bold">Customer</th>
                <th className="text-left py-4 px-6 font-bold">Amount</th>
                <th className="text-left py-4 px-6 font-bold">Status</th>
                <th className="text-left py-4 px-6 font-bold">Date</th>
                <th className="text-left py-4 px-6 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a8e8] mx-auto"></div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{order.orderNumber}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium">{order.user.name}</p>
                        <p className="text-sm text-gray-500">{order.user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="px-3 py-1 border-2 border-gray-300 rounded font-bold text-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">{order.createdAt}</td>
                    <td className="py-4 px-6">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
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

export default OrderManagement;