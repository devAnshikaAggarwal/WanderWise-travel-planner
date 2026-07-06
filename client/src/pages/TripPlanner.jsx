import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "../styles/TripPlanner.module.css";

function TripPlanner() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    destinationId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await api.get("/destinations");
      setDestinations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title) {
      return setError("Trip title is required");
    }
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      return setError("End date cannot be before start date");
    }

    setLoading(true);
    try {
      const res = await api.post("/trips", form);
      setSuccess("Trip created successfully! 🎉");
      setTimeout(() => navigate(`/dashboard`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  // Preview card for the selected destination
  const selectedDest = destinations.find((d) => d._id === form.destinationId);

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>Plan a New Trip</h1>
        <p className={styles.subtitle}>
          Fill in the details and start your adventure
        </p>
      </div>

      <div className={styles.content}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/dashboard")}
        >
          ← Back to dashboard
        </button>

        <div className={styles.grid}>
          {/* FORM */}
          <div className={styles.formCard}>
            <h2 className={styles.cardTitle}>Trip Details</h2>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.successBox}>{success}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Trip Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Bali Summer Trip"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Destination (optional)</label>
                <select
                  name="destinationId"
                  value={form.destinationId}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">Select a destination</option>
                  {destinations.map((dest) => (
                    <option key={dest._id} value={dest._id}>
                      {dest.name}, {dest.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Live preview of the chosen destination */}
              {selectedDest?.image && (
                <div className={styles.destPreview}>
                  <img
                    src={selectedDest.image}
                    alt={selectedDest.name}
                    className={styles.destPreviewImg}
                  />
                  <div className={styles.destPreviewInfo}>
                    <span className={styles.destPreviewName}>
                      {selectedDest.name}, {selectedDest.country}
                    </span>
                    <span className={styles.destPreviewMeta}>
                      🗓️ Best time: {selectedDest.bestTime}
                    </span>
                  </div>
                </div>
              )}

              <div className={styles.dateRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Creating trip..." : "🗺️ Create Trip"}
              </button>
            </form>
          </div>

          {/* TIPS */}
          <div className={styles.tipsCard}>
            <h2 className={styles.cardTitle}>Planning tips</h2>
            <div className={styles.tipsList}>
              {[
                {
                  icon: "📍",
                  tip: "Choose a destination from our curated list",
                },
                {
                  icon: "📅",
                  tip: "Set your travel dates to track the duration",
                },
                { icon: "💰", tip: "Add a budget after creating the trip" },
                { icon: "📋", tip: "Build a day-by-day itinerary" },
                { icon: "✅", tip: "Create a packing checklist" },
                {
                  icon: "🚨",
                  tip: "Check emergency contacts for your destination",
                },
              ].map((item, i) => (
                <div key={i} className={styles.tip}>
                  <span className={styles.tipIcon}>{item.icon}</span>
                  <span className={styles.tipText}>{item.tip}</span>
                </div>
              ))}
            </div>

            <div className={styles.exploreBox}>
              <p className={styles.exploreText}>Not sure where to go?</p>
              <button
                className={styles.exploreBtn}
                onClick={() => navigate("/destinations")}
              >
                Browse destinations →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripPlanner;
