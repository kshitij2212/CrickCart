import { useState, useEffect } from 'react';
import { User, Mail, Phone, Edit2, Check, X, ShoppingBag, MapPin, Heart, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, link: '/orders' },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, link: '/wishlist' },
  ];

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <div className="min-h-screen diagonal-bg py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-black italic font-athletic text-[#00171f]">
            MY PROFILE
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border-2 border-red-200 text-red-500 hover:bg-red-50 transition rounded font-black text-sm"
          >
            <LogOut className="w-4 h-4" />
            LOGOUT
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

              {/* User Info */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#00a8e8] to-[#0070a0] rounded-full flex items-center justify-center text-white text-3xl font-black mb-3 shadow-md shadow-[#00a8e8]/20">
                    {initials}
                  </div>
                  <h2 className="text-lg font-black italic text-[#00171f]">{user?.name}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-[#00a8e8] text-white text-xs font-black rounded-full">
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Nav Tabs */}
              <div>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return tab.link ? (
                    <Link
                      key={tab.id}
                      to={tab.link}
                      className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition text-gray-600 hover:text-[#00a8e8] font-bold text-sm"
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </Link>
                  ) : (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 transition font-bold text-sm ${
                        isActive
                          ? 'bg-[#00a8e8]/5 text-[#00a8e8] border-l-4 border-l-[#00a8e8]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#00a8e8]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-black italic text-[#00171f]">
                    PERSONAL INFORMATION
                  </h2>
                  <p className="text-sm text-gray-400 mt-0.5">Manage your account details</p>
                </div>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00a8e8] text-white rounded font-bold text-sm hover:bg-[#0095d1] transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    EDIT
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded font-bold text-sm hover:bg-gray-50 transition"
                  >
                    <X className="w-4 h-4" />
                    CANCEL
                  </button>
                )}
              </div>

              <div className="p-6">
                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">NAME</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#00a8e8] focus:outline-none font-bold transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">EMAIL</label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg bg-gray-50 text-gray-400 font-bold cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">PHONE</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#00a8e8] focus:outline-none font-bold transition"
                      />
                    </div>

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 bg-[#00a8e8] text-white font-black rounded-lg hover:bg-[#0095d1] transition"
                    >
                      <Check className="w-4 h-4" />
                      SAVE CHANGES
                    </button>
                  </form>
                ) : (
                  <div className="divide-y divide-gray-100">
                    <div className="flex items-center gap-4 py-5">
                      <div className="w-10 h-10 rounded-full bg-[#00a8e8]/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-[#00a8e8]" />
                      </div>
                      <div>
                        <p className="text-xs font-black tracking-widest text-gray-400 uppercase">Name</p>
                        <p className="font-bold text-[#00171f] mt-0.5">{user?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 py-5">
                      <div className="w-10 h-10 rounded-full bg-[#00a8e8]/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-[#00a8e8]" />
                      </div>
                      <div>
                        <p className="text-xs font-black tracking-widest text-gray-400 uppercase">Email</p>
                        <p className="font-bold text-[#00171f] mt-0.5">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 py-5">
                      <div className="w-10 h-10 rounded-full bg-[#00a8e8]/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-[#00a8e8]" />
                      </div>
                      <div>
                        <p className="text-xs font-black tracking-widest text-gray-400 uppercase">Phone</p>
                        <p className="font-bold text-[#00171f] mt-0.5">{user?.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 py-5">
                      <div className="w-10 h-10 rounded-full bg-[#00a8e8]/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-[#00a8e8]" />
                      </div>
                      <div>
                        <p className="text-xs font-black tracking-widest text-gray-400 uppercase">Account Type</p>
                        <span className="inline-block mt-1 px-3 py-1 bg-[#00a8e8] text-white text-xs font-black rounded-full">
                          {user?.role?.toUpperCase()}
                        </span>
                      </div>
                    </div>
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

export default Profile;