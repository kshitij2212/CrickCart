import { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FolderTree,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// Admin Pages
import Overview from './Overview';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import CategoryManagement from './CategoryManagement';
import UserManagement from './UserManagement';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      name: 'Overview',
      icon: LayoutDashboard,
      path: '/admin',
      end: true,
    },
    {
      name: 'Products',
      icon: Package,
      path: '/admin/products',
    },
    {
      name: 'Orders',
      icon: ShoppingCart,
      path: '/admin/orders',
    },
    {
      name: 'Categories',
      icon: FolderTree,
      path: '/admin/categories',
    },
    {
      name: 'Users',
      icon: Users,
      path: '/admin/users',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#00171f] text-white transition-all duration-300 flex flex-col fixed h-screen z-50`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          {sidebarOpen && (
            <h1 className="text-2xl font-black italic font-athletic">
              CRICK<span className="text-[#00a8e8]">CART</span>
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-4 px-4 py-3 rounded hover:bg-white/10 transition group"
            >
              <item.icon className="w-5 h-5 text-[#00a8e8]" />
              {sidebarOpen && (
                <span className="font-bold">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-[#00a8e8] rounded-full flex items-center justify-center font-black">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-bold">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded hover:bg-red-500/20 transition text-red-400"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-bold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        } transition-all duration-300`}
      >
        <div className="p-8">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;