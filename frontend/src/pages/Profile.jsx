import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
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
    // TODO: Implement update profile API
    toast.success('Profile updated successfully!');
    setEditing(false);
  };

  return (
    <div className="min-h-screen diagonal-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-black italic font-athletic text-[#00171f] mb-8">
          MY PROFILE
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-[#00a8e8] rounded-full mx-auto flex items-center justify-center text-white text-4xl font-black">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-black italic mt-4">{user?.name}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-[#00a8e8] text-white text-xs font-bold rounded">
                  {user?.role?.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-bold">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-bold">
                  Orders
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-bold">
                  Addresses
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-bold">
                  Wishlist
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black italic font-athletic">
                  PERSONAL INFORMATION
                </h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-[#00a8e8] hover:text-[#0095d1] transition"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">NAME</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-[#00a8e8] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">EMAIL</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-[#00a8e8] focus:outline-none"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">PHONE</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-[#00a8e8] focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-[#00a8e8] text-white font-black py-3 rounded hover:bg-[#0095d1] transition"
                    >
                      SAVE CHANGES
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="flex-1 bg-gray-200 text-gray-800 font-black py-3 rounded hover:bg-gray-300 transition"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <User className="w-5 h-5 text-[#00a8e8]" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-bold">{user?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-[#00a8e8]" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-bold">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-[#00a8e8]" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-bold">{user?.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;