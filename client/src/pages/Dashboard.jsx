import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      setTrips(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips(trips.filter(t => t._id !== tripId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const statusColor = {
    planned: '#2980B9',
    ongoing: '#27AE60',
    completed: '#7F8C8D',
  };

  const quickLinks = [
    { icon: '🔍', label: 'Explore', path: '/destinations' },
    { icon: '🗺️', label: 'Plan Trip', path: '/trip-planner' },
    { icon: '❤️', label: 'Wishlist', path: '/wishlist' },
    { icon: '🚨', label: 'Emergency', path: '/emergency' },
  ];

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.greeting}>
              Welcome back, {user.name?.split(' ')[0] || 'Traveler'} 👋
            </h1>
            <p style={styles.subGreeting}>Ready for your next adventure?</p>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>

        {/* STATS */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statNum}>{trips.length}</span>
            <span style={styles.statLabel}>Total Trips</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNum}>{trips.filter(t => t.status === 'planned').length}</span>
            <span style={styles.statLabel}>Planned</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNum}>{trips.filter(t => t.status === 'ongoing').length}</span>
            <span style={styles.statLabel}>Ongoing</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNum}>{trips.filter(t => t.status === 'completed').length}</span>
            <span style={styles.statLabel}>Completed</span>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.quickLinks}>
            {quickLinks.map(link => (
              <div
                key={link.label}
                style={styles.quickCard}
                onClick={() => navigate(link.path)}
              >
                <span style={styles.quickIcon}>{link.icon}</span>
                <span style={styles.quickLabel}>{link.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TRIPS */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>My Trips</h2>
            <button style={styles.newTripBtn} onClick={() => navigate('/trip-planner')}>
              + New Trip
            </button>
          </div>

          {loading && <p style={styles.loadingText}>Loading your trips...</p>}

          {!loading && trips.length === 0 && (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>🗺️</span>
              <h3 style={styles.emptyTitle}>No trips yet</h3>
              <p style={styles.emptyText}>Start planning your first adventure!</p>
              <button style={styles.newTripBtn} onClick={() => navigate('/trip-planner')}>
                Plan your first trip
              </button>
            </div>
          )}

          {!loading && trips.length > 0 && (
            <div style={styles.tripsGrid}>
              {trips.map(trip => (
                <div key={trip._id} style={styles.tripCard}>
                  <div style={styles.tripCardTop}>
                    <div>
                      <h3 style={styles.tripName}>{trip.title}</h3>
                      {trip.destinationId && (
                        <p style={styles.tripDest}>📍 {trip.destinationId.name}, {trip.destinationId.country}</p>
                      )}
                    </div>
                    <span style={{
                      ...styles.statusBadge,
                      background: statusColor[trip.status] + '20',
                      color: statusColor[trip.status],
                    }}>
                      {trip.status}
                    </span>
                  </div>

                  {trip.startDate && (
                    <p style={styles.tripDates}>
                      🗓️ {new Date(trip.startDate).toLocaleDateString()} →{' '}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                  )}

                  <div style={styles.tripActions}>
                    <button style={styles.actionBtn} onClick={() => navigate(`/itinerary/${trip._id}`)}>
                      📋 Itinerary
                    </button>
                    <button style={styles.actionBtn} onClick={() => navigate(`/budget/${trip._id}`)}>
                      💰 Budget
                    </button>
                    <button style={styles.actionBtn} onClick={() => navigate(`/checklist/${trip._id}`)}>
                      ✅ Checklist
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDeleteTrip(trip._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#FFF8F5', fontFamily: 'Arial, sans-serif' },

  header: {
    background: 'linear-gradient(135deg, #3D1A0E, #993C1D)',
    padding: '32px 40px',
  },
  headerContent: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontFamily: 'Georgia, serif',
    fontSize: '28px',
    color: '#FFF8F5',
    margin: '0 0 4px 0',
  },
  subGreeting: { fontSize: '14px', color: '#F0997B', margin: 0 },
  logoutBtn: {
    background: 'transparent',
    color: '#F0997B',
    border: '1px solid #F0997B',
    borderRadius: '8px',
    padding: '8px 20px',
    fontSize: '13px',
    cursor: 'pointer',
  },

  content: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },

  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #FAECE7',
    boxShadow: '0 2px 8px rgba(216,90,48,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statNum: {
    fontFamily: 'Georgia, serif',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#D85A30',
  },
  statLabel: { fontSize: '12px', color: '#993C1D', textTransform: 'uppercase', letterSpacing: '1px' },

  section: { marginBottom: '32px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '22px',
    color: '#3D1A0E',
    margin: '0 0 16px 0',
  },

  quickLinks: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' },
  quickCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #FAECE7',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 8px rgba(216,90,48,0.06)',
  },
  quickIcon: { fontSize: '28px' },
  quickLabel: { fontSize: '13px', color: '#3D1A0E', fontWeight: '500' },

  newTripBtn: {
    background: '#D85A30',
    color: '#FFF8F5',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
  },

  loadingText: { color: '#993C1D', fontSize: '14px' },

  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #FAECE7',
  },
  emptyIcon: { fontSize: '48px', display: 'block', marginBottom: '12px' },
  emptyTitle: { fontFamily: 'Georgia, serif', fontSize: '20px', color: '#3D1A0E', margin: '0 0 8px 0' },
  emptyText: { fontSize: '13px', color: '#993C1D', margin: '0 0 20px 0' },

  tripsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  tripCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #FAECE7',
    boxShadow: '0 2px 8px rgba(216,90,48,0.06)',
  },
  tripCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  tripName: { fontFamily: 'Georgia, serif', fontSize: '18px', color: '#3D1A0E', margin: '0 0 4px 0' },
  tripDest: { fontSize: '12px', color: '#993C1D', margin: 0 },
  statusBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'capitalize' },
  tripDates: { fontSize: '12px', color: '#5F5E5A', margin: '0 0 16px 0' },

  tripActions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  actionBtn: {
    background: '#FAECE7',
    color: '#993C1D',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  deleteBtn: {
    background: '#FCEBEB',
    color: '#791F1F',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '12px',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
};

export default Dashboard;