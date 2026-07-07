import { Link } from "react-router-dom";
import logo from "../assets/logo/logo.png";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand column */}
        <div className={styles.brandCol}>
          <div className={styles.brandRow}>
            <span className={styles.logoChip}>
              <img src={logo} alt="WanderWise" className={styles.logoImg} />
            </span>
            <span className={styles.brandName}>
              Wander<span className={styles.brandAccent}>Wise</span>
            </span>
          </div>
          <p className={styles.tagline}>roam smart. go far.</p>
          <p className={styles.blurb}>
            Your smart travel companion — search destinations, build
            itineraries, track budgets, and travel confidently.
          </p>
        </div>

        {/* Explore column */}
        <div className={styles.linkCol}>
          <h4 className={styles.colTitle}>Explore</h4>
          <Link to="/destinations" className={styles.footLink}>
            Destinations
          </Link>
          <Link to="/trip-planner" className={styles.footLink}>
            Trip Planner
          </Link>
          <Link to="/wishlist" className={styles.footLink}>
            Wishlist
          </Link>
        </div>

        {/* Tools column */}
        <div className={styles.linkCol}>
          <h4 className={styles.colTitle}>Tools</h4>
          <Link to="/dashboard" className={styles.footLink}>
            My Trips
          </Link>
          <Link to="/converter" className={styles.footLink}>
            Currency Converter
          </Link>
          <Link to="/emergency" className={styles.footLink}>
            Emergency Contacts
          </Link>
        </div>

        {/* Account column */}
        <div className={styles.linkCol}>
          <h4 className={styles.colTitle}>Account</h4>
          <Link to="/login" className={styles.footLink}>
            Login
          </Link>
          <Link to="/register" className={styles.footLink}>
            Register
          </Link>
          <Link to="/profile" className={styles.footLink}>
            Profile
          </Link>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p className={styles.copyright}>
          WanderWise © {year} — built with the MERN stack
        </p>
      </div>
    </footer>
  );
}
