import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo.png"; // ← adjust if your path differs
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo — links home */}
      <Link to="/" className={styles.logoLink}>
        <span className={styles.logoChip}>
          <img src={logo} alt="WanderWise" className={styles.logoImg} />
        </span>
        <span className={styles.logoText}>
          Wander<span className={styles.logoTextAccent}>Wise</span>
        </span>
      </Link>

      {/* Nav links */}
      <div className={styles.links}>
        <Link to="/destinations" className={styles.link}>
          Explore
        </Link>
        <Link to="/planner" className={styles.link}>
          Plan
        </Link>
        <Link to="/dashboard" className={styles.link}>
          Trips
        </Link>
        <Link to="/converter" className={styles.link}>
          Converter
        </Link>

        {isLoggedIn ? (
          <button className={styles.ctaBtn} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button
            className={styles.ctaBtn}
            onClick={() => navigate("/register")}
          >
            Get started
          </button>
        )}
      </div>
    </nav>
  );
}
