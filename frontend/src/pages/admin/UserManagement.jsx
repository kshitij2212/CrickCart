import { useState, useEffect } from 'react';
import { Search, Shield, ShieldOff, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const UserManagement = () => {
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    userId: null,
    userName: '',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setTimeout(() => {
        setUsers([
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '9876543210',
            role: 'user',
            isActive: true,
            createdAt: '2026-01-15',
          },
          {
            id: '2',
            name: 'Admin User',
            email: 'admin@crickcart.com',
            phone: '9999999999',
            role: 'admin',
            isActive: true,
            createdAt: '2026-01-01',
          },
          {
            id: '3',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '9876543211',
            role: 'user',
            isActive: false,
            createdAt: '2026-02-01',
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteClick = (user) => {
    setConfirmDialog({
      isOpen: true,
      userId: user.id,
      userName: user.name,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      toast.success(`User "${confirmDialog.userName}" deleted successfully!`);
      setConfirmDialog({ isOpen: false, userId: null, userName: '' });
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <h1 className="text-4xl font-black italic font-athletic text-[#00171f] mb-8">
        USER MANAGEMENT
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00a8e8] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00a8e8] focus:outline-none font-bold"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">Total Users</p>
          <p className="text-3xl font-black">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">Active Users</p>
          <p className="text-3xl font-black text-green-600">
            {users.filter((u) => u.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">Admins</p>
          <p className="text-3xl font-black text-[#00a8e8]">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-bold">User</th>
                <th className="text-left py-4 px-6 font-bold">Contact</th>
                <th className="text-left py-4 px-6 font-bold">Role</th>
                <th className="text-left py-4 px-6 font-bold">Status</th>
                <th className="text-left py-4 px-6 font-bold">Joined</th>
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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#00a8e8] rounded-full flex items-center justify-center text-white font-black">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm">{user.phone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleRoleToggle(user.id, user.role)}
                        className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-bold ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {user.role === 'admin' ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <ShieldOff className="w-3 h-3" />
                        )}
                        {user.role.toUpperCase()}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleStatusToggle(user.id, user.isActive)}
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          user.isActive
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{user.createdAt}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, userId: null, userName: '' })}
        onConfirm={handleDeleteConfirm}
        title="DELETE USER"
        message={`Are you sure you want to delete user "${confirmDialog.userName}"? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
};

export default UserManagement;