import { useState, useEffect } from 'react';
import { User, Mail, Phone, Edit2, Check, X, ShoppingBag, MapPin, Heart, LogOut, Shield, Plus, Trash2, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import addressService from '../services/addressService';
import authService from '../services/authService';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir',
  'Ladakh','Lakshadweep','Puducherry',
];

const EMPTY_FORM = { name: '', phone: '', street: '', city: '', state: '', pincode: '', isDefault: false };

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  // ── Address state ──────────────────────────────────────────────────────────
  const [addresses, setAddresses]       = useState([]);
  const [addrLoading, setAddrLoading]   = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm]         = useState(EMPTY_FORM);
  const [savingAddr, setSavingAddr]     = useState(false);
  const [updating, setUpdating]         = useState(false);

  useEffect(() => {
    if (user) setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
  }, [user]);

  // Load addresses when tab becomes active
  useEffect(() => {
    if (activeTab !== 'addresses') return;
    const load = async () => {
      setAddrLoading(true);
      try {
        const res = await addressService.getAddresses();
        const addrs = res.data || [];
        setAddresses(addrs);
        if (addrs.length === 0) setShowAddrForm(true);
      } catch {
        toast.error('Failed to load addresses');
      } finally {
        setAddrLoading(false);
      }
    };
    load();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Name cannot be empty'); return; }
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error('Phone number is invalid'); return;
    }
    setUpdating(true);
    try {
      await authService.updateProfile({ name: formData.name, phone: formData.phone });
      updateUser({ name: formData.name, phone: formData.phone });
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // ── Address handlers ───────────────────────────────────────────────────────
  const handleSaveAddress = async () => {
    const { name, phone, street, city, state, pincode } = addrForm;
    if (!name.trim() || !phone || !street.trim() || !city.trim() || !state || !pincode) {
      toast.error('Please fill all address fields'); return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) { toast.error('Enter a valid 10-digit mobile number'); return; }
    if (!/^[1-9][0-9]{5}$/.test(pincode)) { toast.error('Enter a valid 6-digit pincode'); return; }
    setSavingAddr(true);
    try {
      const res = await addressService.addAddress(addrForm);
      setAddresses(res.data || []);
      setAddrForm(EMPTY_FORM);
      setShowAddrForm(false);
      toast.success('Address saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSavingAddr(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await addressService.deleteAddress(id);
      const addrs = res.data || [];
      setAddresses(addrs);
      if (addrs.length === 0) setShowAddrForm(true);
      toast.success('Address removed');
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await addressService.setDefaultAddress(id);
      setAddresses(res.data || []);
      toast.success('Default address updated');
    } catch {
      toast.error('Failed to update default address');
    }
  };

  const tabs = [
    { id: 'profile',   label: 'Profile',   icon: User },
    { id: 'orders',    label: 'Orders',     icon: ShoppingBag, link: '/orders' },
    { id: 'addresses', label: 'Addresses',  icon: MapPin },
    { id: 'wishlist',  label: 'Wishlist',   icon: Heart, link: '/wishlist' },
  ];

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  // ── Addresses panel ────────────────────────────────────────────────────────
  const renderAddresses = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-black italic text-[#00171f]">MY ADDRESSES</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage your delivery addresses</p>
        </div>
        {addresses.length > 0 && addresses.length < 5 && !showAddrForm && (
          <button
            onClick={() => setShowAddrForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00a8e8] text-white rounded font-bold text-sm hover:bg-[#0095d1] transition"
          >
            <Plus className="w-4 h-4" /> ADD NEW
          </button>
        )}
      </div>

      <div className="p-6">
        {addrLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a8e8]"></div>
          </div>
        ) : (
          <>
            {/* Saved address cards */}
            {addresses.length > 0 && (
              <div className="space-y-3 mb-6">
                {addresses.map((addr) => (
                  <div key={addr._id} className="relative p-4 rounded-xl border-2 border-slate-200 hover:border-[#00a8e8]/40 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-sm uppercase text-[#00171f]">{addr.name}</p>
                          {addr.isDefault && (
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase bg-[#00a8e8]/10 text-[#00a8e8] px-2 py-0.5 rounded-full">
                              <Star className="w-2.5 h-2.5" /> DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{addr.street}, {addr.city}</p>
                        <p className="text-sm text-slate-600">{addr.state} — {addr.pincode}</p>
                        <p className="text-xs text-slate-500 mt-1">📞 {addr.phone}</p>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefault(addr._id)}
                            className="text-xs font-bold text-[#00a8e8] hover:underline whitespace-nowrap"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition self-end"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New address form */}
            {showAddrForm && (
              <div className={addresses.length > 0 ? 'border-t-2 border-slate-100 pt-6' : ''}>
                {addresses.length > 0 && (
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">NEW ADDRESS</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">Full Name *</label>
                    <input type="text" value={addrForm.name}
                      onChange={e => setAddrForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                      placeholder="Virat Kohli" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">Address *</label>
                    <input type="text" value={addrForm.street}
                      onChange={e => setAddrForm(p => ({ ...p, street: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                      placeholder="123 Cricket Stadium Road" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">City *</label>
                    <input type="text" value={addrForm.city}
                      onChange={e => setAddrForm(p => ({ ...p, city: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                      placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">State *</label>
                    <select value={addrForm.state}
                      onChange={e => setAddrForm(p => ({ ...p, state: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition text-slate-700">
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">Pin Code *</label>
                    <input type="text" inputMode="numeric" value={addrForm.pincode}
                      onChange={e => setAddrForm(p => ({ ...p, pincode: e.target.value.replace(/\D/g,'').slice(0,6) }))}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                      placeholder="400001" maxLength="6" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">Phone *</label>
                    <input type="tel" inputMode="numeric" value={addrForm.phone}
                      onChange={e => setAddrForm(p => ({ ...p, phone: e.target.value.replace(/\D/g,'').slice(0,10) }))}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-[#00a8e8] focus:outline-none transition"
                      placeholder="9876543210" maxLength="10" />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input type="checkbox" id="isDefault" checked={addrForm.isDefault}
                      onChange={e => setAddrForm(p => ({ ...p, isDefault: e.target.checked }))}
                      className="w-4 h-4 accent-[#00a8e8]" />
                    <label htmlFor="isDefault" className="text-sm font-bold text-slate-600 cursor-pointer">
                      Set as default address
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  {addresses.length > 0 && (
                    <button onClick={() => { setShowAddrForm(false); setAddrForm(EMPTY_FORM); }}
                      className="flex-1 py-3 border-2 border-slate-200 rounded-xl font-black text-slate-600 hover:bg-slate-50 transition text-sm uppercase">
                      Cancel
                    </button>
                  )}
                  <button onClick={handleSaveAddress} disabled={savingAddr}
                    className="flex-1 py-3 bg-[#00a8e8] text-white rounded-xl font-black uppercase text-sm hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2">
                    {savingAddr
                      ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</>
                      : <><Check className="w-4 h-4" /> Save Address</>
                    }
                  </button>
                </div>
              </div>
            )}

            {/* Empty state */}
            {addresses.length === 0 && !showAddrForm && (
              <div className="text-center py-10">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-black text-slate-400 uppercase text-sm">No addresses saved</p>
                <button onClick={() => setShowAddrForm(true)}
                  className="mt-4 px-5 py-2.5 bg-[#00a8e8] text-white font-black text-sm rounded-lg hover:bg-[#0095d1] transition">
                  + ADD ADDRESS
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen diagonal-bg py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-black italic font-athletic text-[#00171f]">MY PROFILE</h1>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border-2 border-red-200 text-red-500 hover:bg-red-50 transition rounded font-black text-sm">
            <LogOut className="w-4 h-4" /> LOGOUT
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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

              <div>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return tab.link ? (
                    <Link key={tab.id} to={tab.link}
                      className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition text-gray-600 hover:text-[#00a8e8] font-bold text-sm">
                      <Icon className="w-4 h-4" /> {tab.label}
                    </Link>
                  ) : (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 transition font-bold text-sm ${
                        isActive
                          ? 'bg-[#00a8e8]/5 text-[#00a8e8] border-l-4 border-l-[#00a8e8]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#00a8e8]'
                      }`}>
                      <Icon className="w-4 h-4" /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="md:col-span-2">
            {activeTab === 'addresses' ? renderAddresses() : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl font-black italic text-[#00171f]">PERSONAL INFORMATION</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Manage your account details</p>
                  </div>
                  {!editing ? (
                    <button onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#00a8e8] text-white rounded font-bold text-sm hover:bg-[#0095d1] transition">
                      <Edit2 className="w-4 h-4" /> EDIT
                    </button>
                  ) : (
                    <button onClick={() => setEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded font-bold text-sm hover:bg-gray-50 transition">
                      <X className="w-4 h-4" /> CANCEL
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {editing ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">NAME</label>
                        <input type="text" value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#00a8e8] focus:outline-none font-bold transition" />
                      </div>
                      <div>
                        <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">EMAIL</label>
                        <input type="email" value={formData.email} disabled
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg bg-gray-50 text-gray-400 font-bold cursor-not-allowed" />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-xs font-black tracking-widest text-gray-500 mb-2">PHONE</label>
                        <input type="tel" inputMode="numeric" value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#00a8e8] focus:outline-none font-bold transition"
                          maxLength="10" placeholder="9876543210" />
                      </div>
                      <button type="submit"
                        disabled={updating} className="flex items-center gap-2 px-6 py-3 bg-[#00a8e8] text-white font-black rounded-lg hover:bg-[#0095d1] transition disabled:opacity-50">
                        {updating
                          ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</>
                          : <><Check className="w-4 h-4" /> SAVE CHANGES</>
                        }
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
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;