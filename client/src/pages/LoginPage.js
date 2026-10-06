import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../hooks/useApi';

export function LoginPage({ setPage }) {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      setPage('Profile');
    }
  }, [isLoggedIn, setPage]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const validateLogin = () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and include a special character.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await loginUser({ email, password });
      login(res.data.user);
      if (setPage) setPage('Profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const identifier = window.prompt('Enter your email or username to reset your password:');
    if (!identifier) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const apiBase = process.env.REACT_APP_API_URL || '';
      const resp = await fetch(`${apiBase}/api/auth/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      const data = await resp.json();
      if (data && data.success) setSuccess(data.message || 'Password reset requested.');
      else setError(data.message || 'Unable to process request.');
    } catch (err) {
      setError('Unable to reach server. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    const base = process.env.REACT_APP_API_URL || '';
    const authUrl = `${base}/auth/google`.replace(/\/\//g, '/').replace(':/', '://');
    window.location.href = authUrl;
  };

  return (
    <div className="page-anim auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', fontSize: 32, marginBottom: 8 }}>🌍</div>
        <h2 className="auth-title">Welcome Back!</h2>
        <p className="auth-sub">Log in to continue your journey</p>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="arjun@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, fontSize: 13 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input type="checkbox" /> <span style={{ color: 'var(--muted)' }}>Remember Me</span>
            </label>
            <span onClick={handleForgotPassword} className="auth-link" style={{ cursor: 'pointer' }}>Forgot Password?</span>
          </div>
          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In →'}
          </button>
        </form>

        <div className="auth-divider">or</div>
        {success && (
          <div style={{ background: '#ECFDF5', color: '#065F46', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
            {success}
          </div>
        )}
        <button onClick={handleGoogle} style={{ width: '100%', padding: 11, borderRadius: 40, border: '1.5px solid #E5E7EB', background: '#fff', fontFamily: "'Poppins',sans-serif", fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          🔵 Continue with Google
        </button>
        <div className="auth-switch">
          New here? <span style={{cursor:"pointer",color:"var(--teal)",fontWeight:600}} className="auth-link">Create Account</span>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm]     = useState({ firstName: '', lastName: '', username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const { login }           = useAuth();

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await loginUser({ email: form.email, password: form.password });
      login({ ...res.data.user, name: `${form.firstName} ${form.lastName}`, handle: `@${form.username}`, initials: `${form.firstName[0]}${form.lastName[0]}`.toUpperCase() });
      setPage?.('Profile');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-anim auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', fontSize: 32, marginBottom: 8 }}>🌍</div>
        <h2 className="auth-title">Join TourismConnect</h2>
        <p className="auth-sub">Create your account and start your journey</p>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" placeholder="Arjun" value={form.firstName} onChange={set('firstName')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" placeholder="Kumar" value={form.lastName} onChange={set('lastName')} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" placeholder="@arjun_travels" value={form.username} onChange={set('username')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="arjun@email.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Profile Picture</label>
            <div className="upload-zone" style={{ padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>📸</div>
              <div className="upload-text">
                <strong>Click to upload</strong> or drag &amp; drop<br />
                <span style={{ fontSize: 12 }}>PNG, JPG up to 5MB</span>
              </div>
            </div>
          </div>
          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account 🚀'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <span style={{cursor:"pointer",color:"var(--teal)",fontWeight:600}} className="auth-link">Log In</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
