import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Itinerary() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ dayNumber: 1, activity: '', note: '', time: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
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
    setError('');
    if (!form.activity) return setError('Activity is required');
    try {
      await api.post(`/itinerary/${tripId}`, form);
      setSuccess('Activity added! ✅');
      setForm({ dayNumber: form.dayNumber, activity: '', note: '', time: '' });
      fetchItinerary();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add activity');
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
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Trip Itinerary</h1>
        <p style={styles.subtitle}>Plan your day-by-day activities</p>
      </div>

      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back to dashboard</button>

        <div style={styles.statsRow}>
          <div style={styles.stat}><span style={styles.statNum}>{totalDays}</span><span style={styles.statLabel}>Days planned</span></div>
          <div style={styles.stat}><span style={styles.statNum}>{totalActivities}</span><span style={styles.statLabel}>Activities</span></div>
        </div>

        <div style={styles.grid}>
          {/* ADD FORM */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Add Activity</h2>
            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.successBox}>{success}</div>}
            <form onSubmit={handleAdd} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Day Number</label>
                <input type="number" min="1" value={form.dayNumber}
                  onChange={e => setForm({ ...form, dayNumber: parseInt(e.target.value) })}
                  style={styles.input}/>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Activity *</label>
                <input type="text" value={form.activity} placeholder="e.g. Visit Eiffel Tower"
                  onChange={e => setForm({ ...form, activity: e.target.value })}
                  style={styles.input}/>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Time</label>
                <input type="time" value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  style={styles.input}/>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Note</label>
                <input type="text" value={form.note} placeholder="Optional note..."
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  style={styles.input}/>
              </div>
              <button type="submit" style={styles.submitBtn}>+ Add Activity</button>
            </form>
          </div>

          {/* ITINERARY LIST */}
          <div>
            {loading && <p style={{ color: '#993C1D' }}>Loading itinerary...</p>}
            {!loading && totalActivities === 0 && (
              <div style={styles.emptyState}>
                <span style={{ fontSize: '48px' }}>📋</span>
                <p style={{ color: '#993C1D', marginTop: '12px' }}>No activities yet. Add your first one!</p>
              </div>
            )}
            {Object.entries(itinerary).map(([day, activities]) => (
              <div key={day} style={styles.dayCard}>
                <h3 style={styles.dayTitle}>{day}</h3>
                {activities.map(act => (
                  <div key={act._id} style={styles.activityItem}>
                    <div style={styles.activityLeft}>
                      {act.time && <span style={styles.actTime}>{act.time}</span>}
                      <div>
                        <p style={styles.actName}>{act.activity}</p>
                        {act.note && <p style={styles.actNote}>{act.note}</p>}
                      </div>
                    </div>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(act._id)}>🗑️</button>
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
  statsRow: { display: 'flex', gap: '16px', marginBottom: '24px' },
  stat: { background: '#FFFFFF', borderRadius: '12px', padding: '16px 24px', border: '1px solid #FAECE7', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '120px' },
  statNum: { fontFamily: 'Georgia, serif', fontSize: '28px', color: '#D85A30', fontWeight: 'bold' },
  statLabel: { fontSize: '11px', color: '#993C1D', textTransform: 'uppercase', letterSpacing: '1px' },
  grid: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' },
  card: { background: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid #FAECE7', boxShadow: '0 2px 12px rgba(216,90,48,0.08)' },
  cardTitle: { fontFamily: 'Georgia, serif', fontSize: '20px', color: '#3D1A0E', margin: '0 0 20px 0', paddingBottom: '10px', borderBottom: '1px solid #FAECE7' },
  error: { background: '#FAECE7', border: '1px solid #F0997B', color: '#712B13', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  successBox: { background: '#E8F8EF', border: '1px solid #27AE60', color: '#1A6B3C', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#3D1A0E' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #F0997B', fontSize: '14px', color: '#3D1A0E', background: '#FFF8F5', outline: 'none', fontFamily: 'Arial, sans-serif' },
  submitBtn: { background: '#D85A30', color: '#FFF8F5', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif' },
  emptyState: { textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #FAECE7' },
  dayCard: { background: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #FAECE7', marginBottom: '16px', boxShadow: '0 2px 8px rgba(216,90,48,0.06)' },
  dayTitle: { fontFamily: 'Georgia, serif', fontSize: '18px', color: '#D85A30', margin: '0 0 14px 0', paddingBottom: '8px', borderBottom: '1px solid #FAECE7' },
  activityItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #FFF8F5' },
  activityLeft: { display: 'flex', gap: '12px', alignItems: 'flex-start' },
  actTime: { background: '#FAECE7', color: '#D85A30', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap' },
  actName: { fontSize: '14px', color: '#3D1A0E', margin: '0 0 2px 0', fontWeight: '500' },
  actNote: { fontSize: '12px', color: '#993C1D', margin: 0 },
  deleteBtn: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#791F1F' },
};

export default Itinerary;