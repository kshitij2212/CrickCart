import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const user = await login(formData.email, formData.password);
    console.log('✅ Login returned user:', user); // ADD THIS
    console.log('✅ Navigating to:', user.role === 'admin' ? '/admin' : '/');
    
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  } catch (error) {
    console.error('Login error:', error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center diagonal-bg px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-black italic font-athletic text-center mb-8 text-[#00171f] dark:text-white">
          LOGIN
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">EMAIL</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-[#00a8e8] focus:outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">PASSWORD</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-[#00a8e8] focus:outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00a8e8] text-white font-black py-3 rounded hover:bg-[#0095d1] transition disabled:opacity-50"
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
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