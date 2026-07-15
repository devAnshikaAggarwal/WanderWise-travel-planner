import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSuitcase,
  FaHeart,
  FaMapMarkedAlt,
  FaSearch,
  FaExchangeAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import api from "../services/api";
import styles from "../styles/Profile.module.css";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [tripCount, setTripCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    planned: 0,
    ongoing: 0,
    completed: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [tripsRes, wishlistRes] = await Promise.all([
        api.get("/trips"),
        api.get("/wishlist"),
      ]);
      const trips = tripsRes.data || [];
      setTripCount(trips.length);
      setStatusCounts({
        planned: trips.filter((t) => t.status === "planned").length,
        ongoing: trips.filter((t) => t.status === "ongoing").length,
        completed: trips.filter((t) => t.status === "completed").length,
      });
      setWishlistCount((wishlistRes.data || []).length);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const initial = (user.name || "T").charAt(0).toUpperCase();

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.avatar}>{initial}</div>
        <h1 className={styles.name}>{user.name || "Traveler"}</h1>
        <p className={styles.email}>{user.email}</p>
      </div>

      <div className={styles.content}>
        {/* STATS */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{tripCount}</span>
            <span className={styles.statLabel}>Trips</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{statusCounts.completed}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{wishlistCount}</span>
            <span className={styles.statLabel}>Wishlisted</span>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Account details */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Account</h2>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Full name</span>
              <span className={styles.detailValue}>{user.name || "—"}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Email</span>
              <span className={styles.detailValue}>{user.email || "—"}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Trips planned</span>
              <span className={styles.detailValue}>{statusCounts.planned}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Trips ongoing</span>
              <span className={styles.detailValue}>{statusCounts.ongoing}</span>
            </div>

            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* Shortcuts */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Shortcuts</h2>
            <div className={styles.shortcuts}>
              <button
                className={styles.shortcut}
                onClick={() => navigate("/dashboard")}
              >
                <FaSuitcase className={styles.inlineIcon} /> My Trips
              </button>
              <button
                className={styles.shortcut}
                onClick={() => navigate("/wishlist")}
              >
                <FaHeart className={styles.inlineIcon} /> My Wishlist
              </button>
              <button
                className={styles.shortcut}
                onClick={() => navigate("/trip-planner")}
              >
                <FaMapMarkedAlt className={styles.inlineIcon} /> Plan a new trip
              </button>
              <button
                className={styles.shortcut}
                onClick={() => navigate("/destinations")}
              >
                <FaSearch className={styles.inlineIcon} /> Explore destinations
              </button>
              <button
                className={styles.shortcut}
                onClick={() => navigate("/converter")}
              >
                <FaExchangeAlt className={styles.inlineIcon} /> Currency
                converter
              </button>
              <button
                className={styles.shortcut}
                onClick={() => navigate("/emergency")}
              >
                <FaExclamationTriangle className={styles.inlineIcon} />{" "}
                Emergency contacts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
