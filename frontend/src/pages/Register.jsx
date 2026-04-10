import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
    label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '9876543210',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>,
  },
  {
    label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 8 characters',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  },
];

const validate = (formData) => {
  const errors = {};

  const name = formData.name.trim();
  if (!name) {
    errors.name = 'Full name is required.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    errors.name = 'Name can only contain letters, spaces, hyphens, or apostrophes.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  const phone = formData.phone.trim();
  if (!phone) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  }

  const pwd = formData.password;
  if (!pwd) {
    errors.password = 'Password is required.';
  } else if (pwd.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  } else if (!/[A-Z]/.test(pwd)) {
    errors.password = 'Include at least one uppercase letter.';
  } else if (!/[0-9]/.test(pwd)) {
    errors.password = 'Include at least one number.';
  } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) {
    errors.password = 'Include at least one special character.';
  }

  return errors;
};

const getPasswordStrength = (pwd) => {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) score++;
  return score;
};

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#e53935', '#fb8c00', '#f9a825', '#2e7d32'];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const passwordStrength = getPasswordStrength(formData.password);

  const handleBlur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const fieldErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [key]: fieldErrors[key] }));
  };

  const handleChange = (key, value) => {
    if (key === 'phone') value = value.replace(/\D/g, '').slice(0, 10);

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

    setTouched({ name: true, email: true, phone: true, password: true });

    const allErrors = validate(formData);
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) return;

    setLoading(true);
    setApiError('');
    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      setApiError(error?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
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
        <h2 className="text-center text-2xl font-black italic tracking-widest mb-6 text-[#00171f]">
          REGISTER
        </h2>

        {apiError && (
          <div
            className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(229,57,53,0.08)', color: '#c62828', border: '1px solid rgba(229,57,53,0.25)' }}
          >
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {fields.map(({ label, key, type, placeholder, icon }) => {
            const isPassword = key === 'password';
            const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
            const hasError = touched[key] && errors[key];
            const isValid = touched[key] && !errors[key] && formData[key];

            return (
              <div key={key}>
                <label
                  className="block text-xs font-bold uppercase tracking-widest mb-1.5"
                  style={{ color: '#4a80a0' }}
                >
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
                    autoComplete={isPassword ? 'new-password' : undefined}
                    className="w-full py-3 pl-10 pr-10 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: hasError
                        ? 'rgba(229,57,53,0.05)'
                        : isValid
                        ? 'rgba(0,168,232,0.05)'
                        : 'rgba(255,255,255,0.65)',
                      border: `1.5px solid ${
                        hasError
                          ? 'rgba(229,57,53,0.55)'
                          : isValid
                          ? 'rgba(0,168,232,0.45)'
                          : 'rgba(0,168,232,0.2)'
                      }`,
                      color: '#00304a',
                    }}
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
                        e.target.style.background = 'rgba(255,255,255,0.65)';
                      }
                    }}
                    value={formData[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    inputMode={key === 'phone' ? 'numeric' : undefined}
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
                    <span
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: '#2e7d32', fontSize: 14 }}
                    >
                      ✓
                    </span>
                  )}
                </div>

                {isPassword && formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="flex-1 h-1 rounded-full transition-all"
                          style={{
                            background: i <= passwordStrength ? strengthColor[passwordStrength] : 'rgba(0,0,0,0.1)',
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: strengthColor[passwordStrength] }}>
                      {strengthLabel[passwordStrength]}
                    </p>
                  </div>
                )}

                {hasError && (
                  <p className="mt-1.5 text-xs font-medium" style={{ color: '#e53935' }}>
                    {errors[key]}
                  </p>
                )}
              </div>
            );
          })}

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
          Already have an account?{' '}
          <Link to="/login" className="font-bold" style={{ color: '#00a8e8' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;