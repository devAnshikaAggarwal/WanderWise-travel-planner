import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import styles from "../styles/Auth.module.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(form.email, form.password);
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ _id: data._id, name: data.name, email: data.email }),
      );
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* LEFT — photo panel */}
      <div className={styles.photoPanel}>
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80&auto=format&fit=crop"
          alt="Traveler overlooking mountains"
          className={styles.photo}
        />
        <div className={styles.photoOverlay}>
          <h2 className={styles.photoTitle}>Welcome back, explorer.</h2>
          <p className={styles.photoText}>
            Your itineraries, budgets, and wishlists are right where you left
            them.
          </p>
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div className={styles.formPanel}>
        <div className={`${styles.card} fadeUp`}>
          <div className={styles.logo}>
            <span className={styles.logoText}>
              Wander<span className={styles.logoAccent}>Wise</span>
            </span>
            <p className={styles.tagline}>roam smart. go far.</p>
          </div>

          <h2 className={styles.title}>Welcome back</h2>
          <p className={styles.subtitle}>
            Login to your account to continue planning
          </p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className={styles.footer}>
            Don't have an account?{" "}
            <Link to="/register" className={styles.link}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
