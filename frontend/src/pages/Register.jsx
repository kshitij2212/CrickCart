import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const fields = [
  {
    label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your Name',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
  {
    label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>,
  },
  {
    label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 98765 43210',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>,
  },
  {
    label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 8 characters',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  },
];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
    >
    
      <div
        className="relative z-10 w-full max-w-md rounded-3xl px-8 py-10"
        style={{
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.85)',
          boxShadow: '0 8px 40px rgba(0,100,180,0.12), inset 0 1px 0 rgba(255,255,255,0.95)',
        }}
      >

        <h2 className="text-center text-2xl font-black italic tracking-widest mb-1 text-[#00171f]">REGISTER</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map(({ label, key, type, placeholder, icon }) => (
            <div key={key}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#4a80a0' }}>
                {label}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#00a8e8', opacity: 0.6 }}>
                  {icon}
                </span>
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  className="w-full py-3 pl-10 pr-4 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.65)', border: '1.5px solid rgba(0,168,232,0.2)', color: '#00304a' }}
                  onFocus={e => { e.target.style.borderColor = '#00a8e8'; e.target.style.background = 'rgba(0,168,232,0.06)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(0,168,232,0.2)'; e.target.style.background = 'rgba(255,255,255,0.65)'; }}
                  value={formData[key]}
                  onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white text-sm font-bold tracking-widest uppercase transition-all disabled:opacity-50 mt-2"
            style={{ background: '#00a8e8', boxShadow: '0 4px 20px rgba(0,168,232,0.3)' }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: '#6b9ab5' }}>
          Already have an account?{'     '}
          <Link to="/login" className="font-bold" style={{ color: '#00a8e8' }}>Login  </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;