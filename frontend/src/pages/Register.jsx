import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
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
    <div className="min-h-screen flex items-center justify-center diagonal-bg px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-black italic font-athletic text-center mb-8 text-[#00171f] dark:text-white">
          REGISTER
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">NAME</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-[#00a8e8] focus:outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

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
            <label className="block text-sm font-bold mb-2">PHONE</label>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-[#00a8e8] focus:outline-none"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">PASSWORD</label>
            <input
              type="password"
              required
              minLength="6"
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
            {loading ? 'REGISTERING...' : 'REGISTER'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00a8e8] font-bold">
            LOGIN
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;