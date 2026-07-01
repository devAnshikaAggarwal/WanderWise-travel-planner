import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(form.email, form.password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logo}>
          <span style={styles.logoText}>Wander<span style={styles.logoAccent}>Wise</span></span>
          <p style={styles.tagline}>roam smart. go far.</p>
        </div>

        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.subtitle}>Login to your account to continue planning</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#FFF8F5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 4px 24px rgba(216,90,48,0.10)',
    border: '1px solid #FAECE7',
  },
  logo: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  logoText: {
    fontFamily: 'Georgia, serif',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#3D1A0E',
  },
  logoAccent: {
    color: '#D85A30',
  },
  tagline: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '11px',
    color: '#993C1D',
    letterSpacing: '3px',
    margin: '4px 0 0 0',
  },
  title: {
    fontFamily: 'Georgia, serif',
    fontSize: '22px',
    color: '#3D1A0E',
    margin: '0 0 6px 0',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px',
    color: '#993C1D',
    textAlign: 'center',
    margin: '0 0 24px 0',
  },
  error: {
    background: '#FAECE7',
    border: '1px solid #F0997B',
    color: '#712B13',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px',
    fontWeight: '500',
    color: '#3D1A0E',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #F0997B',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    color: '#3D1A0E',
    background: '#FFF8F5',
    outline: 'none',
  },
  button: {
    background: '#D85A30',
    color: '#FFF8F5',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '15px',
    fontFamily: 'Georgia, serif',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },
  footer: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px',
    color: '#993C1D',
    marginTop: '20px',
  },
  link: {
    color: '#D85A30',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
};

export default Login;