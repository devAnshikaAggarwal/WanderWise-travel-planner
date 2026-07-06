import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import styles from '../styles/Auth.module.css';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const data = await registerUser(form.name, form.email, form.password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>

      {/* LEFT — photo panel */}
      <div className={styles.photoPanel}>
        <img
          src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1200&q=80&auto=format&fit=crop"
          alt="Traveler with map planning a journey"
          className={styles.photo}
        />
        <div className={styles.photoOverlay}>
          <h2 className={styles.photoTitle}>Your journey starts here.</h2>
          <p className={styles.photoText}>
            Join WanderWise and turn dream destinations into real plans — itineraries,
            budgets, checklists, and more.
          </p>
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div className={styles.formPanel}>
        <div className={`${styles.card} fadeUp`}>

          <div className={styles.logo}>
            <span className={styles.logoText}>Wander<span className={styles.logoAccent}>Wise</span></span>
            <p className={styles.tagline}>roam smart. go far.</p>
          </div>

          <h2 className={styles.title}>Create your account</h2>
          <p className={styles.subtitle}>Start planning your dream trips today</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Anshika Aggarwal"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.passwordWrap}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className={styles.footer}>
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;