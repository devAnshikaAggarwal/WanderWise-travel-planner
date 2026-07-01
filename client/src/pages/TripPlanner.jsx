import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function TripPlanner() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    destinationId: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await api.get('/destinations');
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
    setError('');
    setSuccess('');

    if (!form.title) {
      return setError('Trip title is required');
    }
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      return setError('End date cannot be before start date');
    }

    setLoading(true);
    try {
      const res = await api.post('/trips', form);
      setSuccess('Trip created successfully! 🎉');
      setTimeout(() => navigate(`/dashboard`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Plan a New Trip</h1>
        <p style={styles.subtitle}>Fill in the details and start your adventure</p>
      </div>

      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back to dashboard
        </button>

        <div style={styles.grid}>

          {/* FORM */}
          <div style={styles.formCard}>
            <h2 style={styles.cardTitle}>Trip Details</h2>

            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.successBox}>{success}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Trip Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Bali Summer Trip"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Destination (optional)</label>
                <select
                  name="destinationId"
                  value={form.destinationId}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select a destination</option>
                  {destinations.map(dest => (
                    <option key={dest._id} value={dest._id}>
                      {dest.name}, {dest.country}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.dateRow}>
                <div style={styles.field}>
                  <label style={styles.label}>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Creating trip...' : '🗺️ Create Trip'}
              </button>
            </form>
          </div>

          {/* TIPS */}
          <div style={styles.tipsCard}>
            <h2 style={styles.cardTitle}>Planning tips</h2>
            <div style={styles.tipsList}>
              {[
                { icon: '📍', tip: 'Choose a destination from our curated list' },
                { icon: '📅', tip: 'Set your travel dates to track the duration' },
                { icon: '💰', tip: 'Add a budget after creating the trip' },
                { icon: '📋', tip: 'Build a day-by-day itinerary' },
                { icon: '✅', tip: 'Create a packing checklist' },
                { icon: '🚨', tip: 'Check emergency contacts for your destination' },
              ].map((item, i) => (
                <div key={i} style={styles.tip}>
                  <span style={styles.tipIcon}>{item.icon}</span>
                  <span style={styles.tipText}>{item.tip}</span>
                </div>
              ))}
            </div>

            <div style={styles.exploreBox}>
              <p style={styles.exploreText}>Not sure where to go?</p>
              <button style={styles.exploreBtn} onClick={() => navigate('/destinations')}>
                Browse destinations →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#FFF8F5', fontFamily: 'Arial, sans-serif' },
  header: {
    background: 'linear-gradient(135deg, #3D1A0E, #993C1D)',
    padding: '50px 40px',
    textAlign: 'center',
  },
  title: { fontFamily: 'Georgia, serif', fontSize: '36px', color: '#FFF8F5', margin: '0 0 8px 0' },
  subtitle: { fontSize: '14px', color: '#F0997B', margin: 0 },

  content: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
  backBtn: {
    background: 'transparent',
    color: '#D85A30',
    border: '1px solid #D85A30',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '24px',
    fontFamily: 'Arial, sans-serif',
  },

  grid: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' },

  formCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '28px',
    border: '1px solid #FAECE7',
    boxShadow: '0 2px 12px rgba(216,90,48,0.08)',
  },
  tipsCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '28px',
    border: '1px solid #FAECE7',
    boxShadow: '0 2px 12px rgba(216,90,48,0.06)',
  },
  cardTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '20px',
    color: '#3D1A0E',
    margin: '0 0 20px 0',
    paddingBottom: '12px',
    borderBottom: '1px solid #FAECE7',
  },

  error: {
    background: '#FAECE7',
    border: '1px solid #F0997B',
    color: '#712B13',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  successBox: {
    background: '#E8F8EF',
    border: '1px solid #27AE60',
    color: '#1A6B3C',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
  },

  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#3D1A0E' },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #F0997B',
    fontSize: '14px',
    color: '#3D1A0E',
    background: '#FFF8F5',
    outline: 'none',
    fontFamily: 'Arial, sans-serif',
  },
  dateRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  submitBtn: {
    background: '#D85A30',
    color: '#FFF8F5',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    marginTop: '8px',
  },

  tipsList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' },
  tip: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
  tipIcon: { fontSize: '18px', flexShrink: 0 },
  tipText: { fontSize: '13px', color: '#5F5E5A', lineHeight: '1.5' },

  exploreBox: {
    background: '#FAECE7',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
  },
  exploreText: { fontSize: '13px', color: '#993C1D', margin: '0 0 10px 0' },
  exploreBtn: {
    background: '#D85A30',
    color: '#FFF8F5',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
  },
};

export default TripPlanner;