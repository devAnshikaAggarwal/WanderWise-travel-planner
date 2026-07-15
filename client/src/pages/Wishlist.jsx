import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaTrash,
  FaPlane,
  FaUmbrellaBeach,
  FaLandmark,
  FaLeaf,
  FaSun,
  FaMosque,
  FaMountain,
  FaCity,
} from "react-icons/fa";
import api from "../services/api";
import styles from "../styles/Wishlist.module.css";

const CLIMATE_ICON = {
  Tropical: <FaUmbrellaBeach />,
  Mediterranean: <FaLandmark />,
  Temperate: <FaLeaf />,
  Arid: <FaSun />,
  "Semi-arid": <FaMosque />,
  Alpine: <FaMountain />,
  Desert: <FaCity />,
};

function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (destinationId) => {
    try {
      await api.delete(`/wishlist/${destinationId}`);
      setItems(items.filter((i) => i.destinationId?._id !== destinationId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          My Wishlist <FaHeart className={styles.titleIcon} />
        </h1>
        <p className={styles.subtitle}>Destinations you want to visit</p>
      </div>

      <div className={styles.content}>
        <div className={styles.topRow}>
          <button
            className={styles.backBtn}
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>
          <button
            className={styles.exploreBtn}
            onClick={() => navigate("/destinations")}
          >
            + Add destinations
          </button>
        </div>

        {loading && <p className={styles.loadingText}>Loading wishlist...</p>}

        {!loading && items.length === 0 && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <FaHeart />
            </span>
            <h3 className={styles.emptyTitle}>Your wishlist is empty</h3>
            <p className={styles.emptyText}>
              Browse destinations and save the ones you love
            </p>
            <button
              className={styles.exploreBtn}
              onClick={() => navigate("/destinations")}
            >
              Browse destinations
            </button>
          </div>
        )}

        <div className={styles.grid}>
          {items.map((item) => {
            const dest = item.destinationId;
            if (!dest) return null;
            return (
              <div key={item._id} className={styles.card}>
                {/* Photo with fallback icon */}
                <div
                  className={styles.cardImage}
                  onClick={() => navigate(`/destinations/${dest._id}`)}
                >
                  {dest.image ? (
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className={styles.cardImg}
                      loading="lazy"
                    />
                  ) : (
                    <span className={styles.cardIcon}>
                      {CLIMATE_ICON[dest.climate] || <FaPlane />}
                    </span>
                  )}
                  <span className={styles.climateBadge}>{dest.climate}</span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <h3 className={styles.cardName}>{dest.name}</h3>
                    <p className={styles.cardCountry}>
                      <FaMapMarkerAlt className={styles.inlineIcon} />{" "}
                      {dest.country}
                    </p>
                  </div>
                  <p className={styles.cardDesc}>{dest.description}</p>
                  <p className={styles.bestTime}>
                    <FaCalendarAlt className={styles.inlineIcon} /> Best time:{" "}
                    {dest.bestTime}
                  </p>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.planBtn}
                      onClick={() => navigate("/trip-planner")}
                    >
                      <FaMapMarkedAlt className={styles.inlineIcon} /> Plan trip
                    </button>
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemove(dest._id)}
                    >
                      <FaTrash className={styles.inlineIcon} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
