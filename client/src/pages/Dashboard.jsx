import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkedAlt,
  FaHeart,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPlane,
  FaClipboardList,
  FaWallet,
  FaCheckSquare,
  FaTrash,
  FaGlobe,
} from "react-icons/fa";
import api from "../services/api";
import styles from "../styles/Dashboard.module.css";

const STATUS_CLASS = {
  planned: "statusPlanned",
  ongoing: "statusOngoing",
  completed: "statusCompleted",
};

function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [weatherMap, setWeatherMap] = useState({}); // { cityName: { temperature, icon } }
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await api.get("/trips");
      setTrips(res.data);
      fetchWeatherForTrips(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // One lightweight weather call per unique destination
  const fetchWeatherForTrips = async (tripList) => {
    const cities = [
      ...new Set(tripList.map((t) => t.destinationId?.name).filter(Boolean)),
    ];
    for (const city of cities) {
      try {
        const res = await api.get(`/weather?city=${city}`);
        setWeatherMap((prev) => ({ ...prev, [city]: res.data }));
      } catch {
        /* weather chip simply won't show for this city */
      }
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Delete this trip?")) return;
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips(trips.filter((t) => t._id !== tripId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Days until trip starts (null if no date or already started)
  const daysUntil = (startDate) => {
    if (!startDate) return null;
    const diff = Math.ceil(
      (new Date(startDate) - new Date()) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? diff : null;
  };

  const quickLinks = [
    { icon: <FaSearch />, label: "Explore", path: "/destinations" },
    { icon: <FaMapMarkedAlt />, label: "Plan Trip", path: "/trip-planner" },
    { icon: <FaHeart />, label: "Wishlist", path: "/wishlist" },
    { icon: <FaExclamationTriangle />, label: "Emergency", path: "/emergency" },
  ];

  const stats = [
    { num: trips.length, label: "Total Trips" },
    {
      num: trips.filter((t) => t.status === "planned").length,
      label: "Planned",
    },
    {
      num: trips.filter((t) => t.status === "ongoing").length,
      label: "Ongoing",
    },
    {
      num: trips.filter((t) => t.status === "completed").length,
      label: "Completed",
    },
  ];

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.greeting}>
              Welcome back, {user.name?.split(" ")[0] || "Traveler"}
            </h1>
            <p className={styles.subGreeting}>Ready for your next adventure?</p>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* STATS */}
        <div className={styles.statsRow}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* QUICK LINKS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.quickLinks}>
            {quickLinks.map((link) => (
              <div
                key={link.label}
                className={styles.quickCard}
                onClick={() => navigate(link.path)}
              >
                <span className={styles.quickIcon}>{link.icon}</span>
                <span className={styles.quickLabel}>{link.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TRIPS */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>My Trips</h2>
            <button
              className={styles.newTripBtn}
              onClick={() => navigate("/trip-planner")}
            >
              + New Trip
            </button>
          </div>

          {loading && (
            <p className={styles.loadingText}>Loading your trips...</p>
          )}

          {!loading && trips.length === 0 && (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>
                <FaMapMarkedAlt />
              </span>
              <h3 className={styles.emptyTitle}>No trips yet</h3>
              <p className={styles.emptyText}>
                Start planning your first adventure!
              </p>
              <button
                className={styles.newTripBtn}
                onClick={() => navigate("/trip-planner")}
              >
                Plan your first trip
              </button>
            </div>
          )}

          {!loading && trips.length > 0 && (
            <div className={styles.tripsGrid}>
              {trips.map((trip) => {
                const dest = trip.destinationId;
                const weather = dest ? weatherMap[dest.name] : null;
                const countdown = daysUntil(trip.startDate);

                return (
                  <div key={trip._id} className={styles.tripCard}>
                    {/* Destination photo header */}
                    {dest?.image && (
                      <div className={styles.tripPhotoWrap}>
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className={styles.tripPhoto}
                          loading="lazy"
                        />
                        {countdown && (
                          <span className={styles.countdownBadge}>
                            <FaPlane className={styles.badgeIcon} /> in{" "}
                            {countdown} day{countdown !== 1 ? "s" : ""}
                          </span>
                        )}
                        {weather && (
                          <span className={styles.weatherChip}>
                            <img
                              src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                              alt={weather.description}
                              className={styles.weatherChipIcon}
                            />
                            {Math.round(weather.temperature)}°C
                          </span>
                        )}
                      </div>
                    )}

                    <div className={styles.tripBody}>
                      <div className={styles.tripCardTop}>
                        <div>
                          <h3 className={styles.tripName}>{trip.title}</h3>
                          {dest && (
                            <p className={styles.tripDest}>
                              <FaMapMarkerAlt className={styles.inlineIcon} />{" "}
                              {dest.name}, {dest.country}
                            </p>
                          )}
                        </div>
                        <span
                          className={`${styles.statusBadge} ${styles[STATUS_CLASS[trip.status]]}`}
                        >
                          {trip.status}
                        </span>
                      </div>

                      {trip.startDate && (
                        <p className={styles.tripDates}>
                          <FaCalendarAlt className={styles.inlineIcon} />{" "}
                          {new Date(trip.startDate).toLocaleDateString()} →{" "}
                          {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                      )}

                      <div className={styles.tripActions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => navigate(`/itinerary/${trip._id}`)}
                        >
                          <FaClipboardList className={styles.inlineIcon} />{" "}
                          Itinerary
                        </button>
                        <button
                          className={styles.actionBtn}
                          onClick={() => navigate(`/budget/${trip._id}`)}
                        >
                          <FaWallet className={styles.inlineIcon} /> Budget
                        </button>
                        <button
                          className={styles.actionBtn}
                          onClick={() => navigate(`/checklist/${trip._id}`)}
                        >
                          <FaCheckSquare className={styles.inlineIcon} />{" "}
                          Checklist
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteTrip(trip._id)}
                          title="Delete trip"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      {/* Destination shortcuts */}
                      {dest && (
                        <div className={styles.tripLinks}>
                          <button
                            className={styles.tripLink}
                            onClick={() =>
                              navigate(`/destinations/${dest._id}`)
                            }
                          >
                            <FaGlobe className={styles.inlineIcon} /> View
                            destination
                          </button>
                          <button
                            className={styles.tripLink}
                            onClick={() =>
                              navigate(
                                `/emergency?country=${encodeURIComponent(dest.country)}`,
                              )
                            }
                          >
                            <FaExclamationTriangle
                              className={styles.inlineIcon}
                            />{" "}
                            Emergency info
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
