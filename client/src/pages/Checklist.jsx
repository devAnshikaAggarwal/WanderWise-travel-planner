import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Checklist() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ item: '', category: 'general' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
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
    setError('');
    if (!form.item) return setError('Item name is required');
    try {
      await api.post(`/checklist/${tripId}`, form);
      setForm({ item: '', category: form.category });
      setSuccess('Item added! ✅');
      fetchChecklist();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
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

  const categories = ['general', 'clothing', 'toiletries', 'documents', 'electronics', 'medicine'];
  const checked = items.filter(i => i.checked).length;
  const total = items.length;

  // Group by category
  const grouped = items.reduce((acc, item) => {
    const cat = item.category || 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categoryIcons = {
    general: '📦',
    clothing: '👕',
    toiletries: '🧴',
    documents: '📄',
    electronics: '💻',
    medicine: '💊',
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Travel Checklist</h1>
        <p style={styles.subtitle}>Never forget your essentials</p>
      </div>

      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back to dashboard</button>

        {/* Progress */}
        {total > 0 && (
          <div style={styles.progressCard}>
            <div style={styles.progressTop}>
              <span style={styles.progressText}>{checked} of {total} items packed</span>
              <span style={styles.progressPct}>{Math.round((checked / total) * 100)}%</span>
            </div>
            <div style={styles.progressBg}>
              <div style={{
                ...styles.progressBar,
                width: `${(checked / total) * 100}%`,
                background: checked === total ? '#27AE60' : '#D85A30',
              }}/>
            </div>
            {checked === total && total > 0 && (
              <p style={styles.allDone}>🎉 All packed and ready to go!</p>
            )}
          </div>
        )}

        <div style={styles.grid}>
          {/* ADD FORM */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Add Item</h2>
            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.successBox}>{success}</div>}
            <form onSubmit={handleAdd} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Item *</label>
                <input
                  type="text"
                  value={form.item}
                  placeholder="e.g. Passport, Sunscreen..."
                  onChange={e => setForm({ ...form, item: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={styles.input}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>
                      {categoryIcons[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" style={styles.submitBtn}>+ Add Item</button>
            </form>

            {/* Quick add suggestions */}
            <div style={styles.suggestions}>
              <p style={styles.suggestTitle}>Quick add:</p>
              <div style={styles.suggestGrid}>
                {['Passport', 'Phone charger', 'Sunscreen', 'First aid kit', 'Camera', 'Travel adapter'].map(s => (
                  <button
                    key={s}
                    style={styles.suggestBtn}
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
            {loading && <p style={{ color: '#993C1D' }}>Loading checklist...</p>}

            {!loading && total === 0 && (
              <div style={styles.emptyState}>
                <span style={{ fontSize: '48px' }}>✅</span>
                <p style={{ color: '#993C1D', marginTop: '12px' }}>No items yet. Add your first one!</p>
              </div>
            )}

            {Object.entries(grouped).map(([category, catItems]) => (
              <div key={category} style={styles.categoryCard}>
                <h3 style={styles.categoryTitle}>
                  {categoryIcons[category] || '📦'} {category.charAt(0).toUpperCase() + category.slice(1)}
                  <span style={styles.categoryCount}>{catItems.filter(i => i.checked).length}/{catItems.length}</span>
                </h3>
                {catItems.map(item => (
                  <div key={item._id} style={styles.checkItem}>
                    <div style={styles.checkLeft} onClick={() => handleToggle(item._id)}>
                      <span style={item.checked ? styles.checkboxChecked : styles.checkbox}>
                        {item.checked ? '✅' : '⬜'}
                      </span>
                      <span style={{
                        ...styles.itemText,
                        textDecoration: item.checked ? 'line-through' : 'none',
                        color: item.checked ? '#999' : '#3D1A0E',
                      }}>
                        {item.item}
                      </span>
                    </div>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(item._id)}>🗑️</button>
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

const styles = {
  page: { minHeight: '100vh', background: '#FFF8F5', fontFamily: 'Arial, sans-serif' },
  header: { background: 'linear-gradient(135deg, #3D1A0E, #993C1D)', padding: '50px 40px', textAlign: 'center' },
  title: { fontFamily: 'Georgia, serif', fontSize: '36px', color: '#FFF8F5', margin: '0 0 8px 0' },
  subtitle: { fontSize: '14px', color: '#F0997B', margin: 0 },
  content: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
  backBtn: { background: 'transparent', color: '#D85A30', border: '1px solid #D85A30', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', marginBottom: '24px', fontFamily: 'Arial, sans-serif' },
  progressCard: { background: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #FAECE7', marginBottom: '24px', boxShadow: '0 2px 8px rgba(216,90,48,0.06)' },
  progressTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  progressText: { fontSize: '14px', color: '#3D1A0E', fontWeight: '500' },
  progressPct: { fontSize: '14px', color: '#D85A30', fontWeight: 'bold' },
  progressBg: { background: '#FAECE7', borderRadius: '20px', height: '10px', overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: '20px', transition: 'width 0.3s ease' },
  allDone: { fontSize: '13px', color: '#27AE60', margin: '8px 0 0 0', textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' },
  card: { background: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid #FAECE7', boxShadow: '0 2px 12px rgba(216,90,48,0.08)' },
  cardTitle: { fontFamily: 'Georgia, serif', fontSize: '20px', color: '#3D1A0E', margin: '0 0 20px 0', paddingBottom: '10px', borderBottom: '1px solid #FAECE7' },
  error: { background: '#FAECE7', border: '1px solid #F0997B', color: '#712B13', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  successBox: { background: '#E8F8EF', border: '1px solid #27AE60', color: '#1A6B3C', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#3D1A0E' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #F0997B', fontSize: '14px', color: '#3D1A0E', background: '#FFF8F5', outline: 'none', fontFamily: 'Arial, sans-serif' },
  submitBtn: { background: '#D85A30', color: '#FFF8F5', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif' },
  suggestions: { borderTop: '1px solid #FAECE7', paddingTop: '16px' },
  suggestTitle: { fontSize: '12px', color: '#993C1D', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' },
  suggestGrid: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  suggestBtn: { background: '#FAECE7', color: '#993C1D', border: 'none', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' },
  emptyState: { textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #FAECE7' },
  categoryCard: { background: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #FAECE7', marginBottom: '16px', boxShadow: '0 2px 8px rgba(216,90,48,0.06)' },
  categoryTitle: { fontFamily: 'Georgia, serif', fontSize: '16px', color: '#3D1A0E', margin: '0 0 14px 0', paddingBottom: '8px', borderBottom: '1px solid #FAECE7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  categoryCount: { fontSize: '12px', color: '#D85A30', fontFamily: 'Arial, sans-serif' },
  checkItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #FFF8F5' },
  checkLeft: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 },
  checkbox: { fontSize: '18px' },
  checkboxChecked: { fontSize: '18px' },
  itemText: { fontSize: '14px', transition: 'all 0.2s' },
  deleteBtn: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px' },
};

export default Checklist;