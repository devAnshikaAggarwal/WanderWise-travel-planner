import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaClipboardList, FaTrash } from "react-icons/fa";
import api from "../services/api";
import styles from "../styles/Itinerary.module.css";

function Itinerary() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    dayNumber: 1,
    activity: "",
    note: "",
    time: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchItinerary();
  }, []);

  const fetchItinerary = async () => {
    try {
      const res = await api.get(`/itinerary/${tripId}`);
      setItinerary(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.activity) return setError("Activity is required");
    try {
      await api.post(`/itinerary/${tripId}`, form);
      setSuccess("Activity added!");
      setForm({ dayNumber: form.dayNumber, activity: "", note: "", time: "" });
      fetchItinerary();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add activity");
    }
  };

  const handleDelete = async (activityId) => {
    try {
      await api.delete(`/itinerary/${tripId}/${activityId}`);
      fetchItinerary();
    } catch (err) {
      console.error(err);
    }
  };

  const totalDays = Object.keys(itinerary).length;
  const totalActivities = Object.values(itinerary).flat().length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Trip Itinerary</h1>
        <p className={styles.subtitle}>Plan your day-by-day activities</p>
      </div>

      <div className={styles.content}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/dashboard")}
        >
          ← Back to dashboard
        </button>

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{totalDays}</span>
            <span className={styles.statLabel}>Days planned</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{totalActivities}</span>
            <span className={styles.statLabel}>Activities</span>
          </div>
        </div>

        <div className={styles.grid}>
          {/* ADD FORM */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Add Activity</h2>
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.successBox}>{success}</div>}
            <form onSubmit={handleAdd} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Day Number</label>
                <input
                  type="number"
                  min="1"
                  value={form.dayNumber}
                  onChange={(e) =>
                    setForm({ ...form, dayNumber: parseInt(e.target.value) })
                  }
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Activity *</label>
                <input
                  type="text"
                  value={form.activity}
                  placeholder="e.g. Visit Eiffel Tower"
                  onChange={(e) =>
                    setForm({ ...form, activity: e.target.value })
                  }
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Time</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Note</label>
                <input
                  type="text"
                  value={form.note}
                  placeholder="Optional note..."
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className={styles.input}
                />
              </div>
              <button type="submit" className={styles.submitBtn}>
                + Add Activity
              </button>
            </form>
          </div>

          {/* ITINERARY LIST */}
          <div>
            {loading && (
              <p className={styles.loadingText}>Loading itinerary...</p>
            )}
            {!loading && totalActivities === 0 && (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>
                  <FaClipboardList />
                </span>
                <p className={styles.emptyText}>
                  No activities yet. Add your first one!
                </p>
              </div>
            )}
            {Object.entries(itinerary).map(([day, activities]) => (
              <div key={day} className={styles.dayCard}>
                <h3 className={styles.dayTitle}>{day}</h3>
                {activities.map((act) => (
                  <div key={act._id} className={styles.activityItem}>
                    <div className={styles.activityLeft}>
                      {act.time && (
                        <span className={styles.actTime}>{act.time}</span>
                      )}
                      <div>
                        <p className={styles.actName}>{act.activity}</p>
                        {act.note && (
                          <p className={styles.actNote}>{act.note}</p>
                        )}
                      </div>
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(act._id)}
                      title="Delete activity"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Itinerary;
