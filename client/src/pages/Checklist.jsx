import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaBox,
  FaTshirt,
  FaPumpSoap,
  FaFileAlt,
  FaLaptop,
  FaPills,
  FaCheckSquare,
  FaRegSquare,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../services/api";
import styles from "../styles/Checklist.module.css";

const CATEGORY_ICONS = {
  general: <FaBox />,
  clothing: <FaTshirt />,
  toiletries: <FaPumpSoap />,
  documents: <FaFileAlt />,
  electronics: <FaLaptop />,
  medicine: <FaPills />,
};

function Checklist() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ item: "", category: "general" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchChecklist();
  }, []);

  const fetchChecklist = async () => {
    try {
      const res = await api.get(`/checklist/${tripId}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.item) return setError("Item name is required");
    try {
      await api.post(`/checklist/${tripId}`, form);
      setForm({ item: "", category: form.category });
      setSuccess("Item added!");
      fetchChecklist();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item");
    }
  };

  const handleToggle = async (itemId) => {
    try {
      await api.put(`/checklist/${tripId}/${itemId}`, {});
      fetchChecklist();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await api.delete(`/checklist/${tripId}/${itemId}`);
      fetchChecklist();
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    "general",
    "clothing",
    "toiletries",
    "documents",
    "electronics",
    "medicine",
  ];
  const checked = items.filter((i) => i.checked).length;
  const total = items.length;

  // Group by category
  const grouped = items.reduce((acc, item) => {
    const cat = item.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Travel Checklist</h1>
        <p className={styles.subtitle}>Never forget your essentials</p>
      </div>

      <div className={styles.content}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/dashboard")}
        >
          ← Back to dashboard
        </button>

        {/* Progress */}
        {total > 0 && (
          <div className={styles.progressCard}>
            <div className={styles.progressTop}>
              <span className={styles.progressText}>
                {checked} of {total} items packed
              </span>
              <span className={styles.progressPct}>
                {Math.round((checked / total) * 100)}%
              </span>
            </div>
            <div className={styles.progressBg}>
              <div
                className={`${styles.progressBar} ${checked === total ? styles.progressDone : ""}`}
                style={{ width: `${(checked / total) * 100}%` }}
              />
            </div>
            {checked === total && total > 0 && (
              <p className={styles.allDone}>
                <FaCheckCircle className={styles.inlineIcon} /> All packed and
                ready to go!
              </p>
            )}
          </div>
        )}

        <div className={styles.grid}>
          {/* ADD FORM */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Add Item</h2>
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.successBox}>{success}</div>}
            <form onSubmit={handleAdd} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Item *</label>
                <input
                  type="text"
                  value={form.item}
                  placeholder="e.g. Passport, Sunscreen..."
                  onChange={(e) => setForm({ ...form, item: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className={styles.input}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className={styles.submitBtn}>
                + Add Item
              </button>
            </form>

            {/* Quick add suggestions */}
            <div className={styles.suggestions}>
              <p className={styles.suggestTitle}>Quick add:</p>
              <div className={styles.suggestGrid}>
                {[
                  "Passport",
                  "Phone charger",
                  "Sunscreen",
                  "First aid kit",
                  "Camera",
                  "Travel adapter",
                ].map((s) => (
                  <button
                    key={s}
                    className={styles.suggestBtn}
                    onClick={() => setForm({ ...form, item: s })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CHECKLIST */}
          <div>
            {loading && (
              <p className={styles.loadingText}>Loading checklist...</p>
            )}

            {!loading && total === 0 && (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>
                  <FaCheckSquare />
                </span>
                <p className={styles.emptyText}>
                  No items yet. Add your first one!
                </p>
              </div>
            )}

            {Object.entries(grouped).map(([category, catItems]) => (
              <div key={category} className={styles.categoryCard}>
                <h3 className={styles.categoryTitle}>
                  <span className={styles.categoryName}>
                    <span className={styles.categoryIcon}>
                      {CATEGORY_ICONS[category] || <FaBox />}
                    </span>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                  <span className={styles.categoryCount}>
                    {catItems.filter((i) => i.checked).length}/{catItems.length}
                  </span>
                </h3>
                {catItems.map((item) => (
                  <div key={item._id} className={styles.checkItem}>
                    <div
                      className={styles.checkLeft}
                      onClick={() => handleToggle(item._id)}
                    >
                      <span
                        className={
                          item.checked
                            ? styles.checkboxChecked
                            : styles.checkbox
                        }
                      >
                        {item.checked ? <FaCheckSquare /> : <FaRegSquare />}
                      </span>
                      <span
                        className={`${styles.itemText} ${item.checked ? styles.itemChecked : ""}`}
                      >
                        {item.item}
                      </span>
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(item._id)}
                      title="Delete item"
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

export default Checklist;
