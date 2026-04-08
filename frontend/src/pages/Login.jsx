import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
    >
      <div
        className="relative z-10 w-full max-w-md rounded-[20px] px-8 py-10"
        style={{
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.75)',
          boxShadow: '0 8px 32px rgba(0,120,200,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        <h2 className="text-center text-2xl font-black italic tracking-widest mb-1 text-[#00171f]">
          LOGIN
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-[#5a7a8a]">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-[10px] text-sm text-[#00171f] outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.6)',
                border: '1.5px solid rgba(0,168,232,0.2)',
              }}
              onFocus={e => e.target.style.borderColor = '#00a8e8'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,168,232,0.2)'}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-[#5a7a8a]">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-[10px] text-sm text-[#00171f] outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.6)',
                border: '1.5px solid rgba(0,168,232,0.2)',
              }}
              onFocus={e => e.target.style.borderColor = '#00a8e8'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,168,232,0.2)'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <br />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[10px] text-white text-sm font-black tracking-widest uppercase transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #00a8e8, #0090cc)',
              boxShadow: '0 4px 16px rgba(0,168,232,0.35)',
            }}
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: 'rgba(0,100,150,0.15)' }} />
          <span className="text-xs font-bold tracking-widest text-[#8aaabb]">OR CONTINUE WITH</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(0,100,150,0.15)' }} />
        </div>

        <GoogleAuthButton />

        <p className="text-center mt-6 text-sm text-[#6b8a9a]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#00a8e8] font-bold">
            REGISTER
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;