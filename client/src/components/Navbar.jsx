import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo.png";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.linkActive}` : styles.link;

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
        <NavLink to="/destinations" className={linkClass}>
          Explore
        </NavLink>
        <NavLink to="/trip-planner" className={linkClass}>
          Plan
        </NavLink>
        <NavLink to="/dashboard" className={linkClass}>
          Trips
        </NavLink>
        <NavLink to="/converter" className={linkClass}>
          Converter
        </NavLink>

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
