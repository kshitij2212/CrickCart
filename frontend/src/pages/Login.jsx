import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

const validate = ({ email, password }) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) errors.email = 'Email address is required.';
  else if (!emailRegex.test(email.trim())) errors.email = 'Enter a valid email address.';

  if (!password) errors.password = 'Password is required.';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters.';

  return errors;
};

const inputStyle = (hasError, isValid) => ({
  background: hasError
    ? 'rgba(229,57,53,0.05)'
    : isValid
    ? 'rgba(0,168,232,0.05)'
    : 'rgba(255,255,255,0.6)',
  border: `1.5px solid ${
    hasError
      ? 'rgba(229,57,53,0.55)'
      : isValid
      ? 'rgba(0,168,232,0.45)'
      : 'rgba(0,168,232,0.2)'
  }`,
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleBlur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const fieldErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [key]: fieldErrors[key] }));
  };

  const handleChange = (key, value) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    setApiError('');
    if (touched[key]) {
      const fieldErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [key]: fieldErrors[key] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const allErrors = validate(formData);
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;

    setLoading(true);
    setApiError('');
    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (error) {
      setApiError(
        error?.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (email, password) => {
    setLoading(true);
    setApiError('');
    setErrors({});
    setTouched({ email: true, password: true });
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (error) {
      setApiError(error?.response?.data?.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'you@example.com',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/>
        </svg>
      ),
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
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
        <h2 className="text-center text-2xl font-black italic tracking-widest mb-6 text-[#00171f]">
          LOGIN
        </h2>

        <div className="flex gap-3 mb-4">
          <button
            type="button"
            onClick={() => demoLogin('admin@gmail.com', 'Admin@123')}
            className="flex-1 py-2.5 rounded-[10px] text-xs font-black tracking-widest uppercase transition-all"
            style={{
              background: '#fff4e6',
              color: '#ea580c',
              border: '1px solid rgba(234,88,12,0.08)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#ffe6cc';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(234,88,12,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff4e6';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            DEMO ADMIN
          </button>

          <button
            type="button"
            onClick={() => demoLogin('user@gmail.com', 'User@123')}
            className="flex-1 py-2.5 rounded-[10px] text-xs font-black tracking-widest uppercase transition-all"
            style={{
              background: '#e6f7ff',
              color: '#00a8e8',
              border: '1px solid rgba(0,168,232,0.08)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#d9f3ff';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,168,232,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#e6f7ff';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            DEMO USER
          </button>
        </div>

        <div className="flex items-center my-4">
          <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.06)' }} />
          <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.06)' }} />
        </div>

        {apiError && (
          <div
            className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(229,57,53,0.08)', color: '#c62828', border: '1px solid rgba(229,57,53,0.25)' }}
          >
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {fields.map(({ key, label, type, placeholder, icon }) => {
            const isPassword = key === 'password';
            const hasError = touched[key] && errors[key];
            const isValid = touched[key] && !errors[key] && formData[key];
            const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

            return (
              <div key={key}>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-[#5a7a8a]">
                  {label}
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: hasError ? '#e53935' : '#00a8e8', opacity: 0.7 }}
                  >
                    {icon}
                  </span>

                  <input
                    type={inputType}
                    placeholder={placeholder}
                    autoComplete={isPassword ? 'current-password' : 'email'}
                    className="w-full py-3 pl-10 pr-10 rounded-[10px] text-sm text-[#00171f] outline-none transition-all"
                    style={inputStyle(hasError, isValid)}
                    onFocus={(e) => {
                      if (!hasError) {
                        e.target.style.borderColor = '#00a8e8';
                        e.target.style.background = 'rgba(0,168,232,0.06)';
                      }
                    }}
                    onBlur={(e) => {
                      handleBlur(key);
                      if (!errors[key]) {
                        e.target.style.borderColor = 'rgba(0,168,232,0.2)';
                        e.target.style.background = 'rgba(255,255,255,0.6)';
                      }
                    }}
                    value={formData[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />

                  {isPassword && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: '#00a8e8', opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      tabIndex={-1}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  )}

                  {!isPassword && isValid && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#2e7d32', fontSize: 14 }}>
                      ✓
                    </span>
                  )}
                </div>

                {hasError && (
                  <p className="mt-1.5 text-xs font-medium" style={{ color: '#e53935' }}>
                    {errors[key]}
                  </p>
                )}
              </div>
            );
          })}

          <br/>
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