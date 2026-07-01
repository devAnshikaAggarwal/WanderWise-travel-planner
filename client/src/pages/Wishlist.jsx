import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
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
      setItems(items.filter(i => i.destinationId?._id !== destinationId));
    } catch (err) {
      console.error(err);
    }
  };

  const climateEmoji = {
    Tropical: '🌴', Mediterranean: '🏛️', Temperate: '⛩️',
    Arid: '🏰', Alpine: '🏔️', Desert: '🌆',
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Wishlist ❤️</h1>
        <p style={styles.subtitle}>Destinations you want to visit</p>
      </div>

      <div style={styles.content}>
        <div style={styles.topRow}>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
          <button style={styles.exploreBtn} onClick={() => navigate('/destinations')}>+ Add destinations</button>
        </div>

        {loading && <p style={{ color: '#993C1D' }}>Loading wishlist...</p>}

        {!loading && items.length === 0 && (
          <div style={styles.emptyState}>
            <span style={{ fontSize: '56px' }}>❤️</span>
            <h3 style={styles.emptyTitle}>Your wishlist is empty</h3>
            <p style={styles.emptyText}>Browse destinations and save the ones you love</p>
            <button style={styles.exploreBtn} onClick={() => navigate('/destinations')}>
              Browse destinations
            </button>
          </div>
        )}

        <div style={styles.grid}>
          {items.map(item => {
            const dest = item.destinationId;
            if (!dest) return null;
            return (
              <div key={item._id} style={styles.card}>
                <div style={styles.cardImage}>
                  <span style={styles.cardEmoji}>{climateEmoji[dest.climate] || '✈️'}</span>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.cardTop}>
                    <div>
                      <h3 style={styles.cardName}>{dest.name}</h3>
                      <p style={styles.cardCountry}>📍 {dest.country}</p>
                    </div>
                    <span style={styles.climateBadge}>{dest.climate}</span>
                  </div>
                  <p style={styles.cardDesc}>{dest.description}</p>
                  <p style={styles.bestTime}>🗓️ Best time: {dest.bestTime}</p>
                  <div style={styles.cardActions}>
                    <button style={styles.planBtn} onClick={() => navigate('/trip-planner')}>
                      🗺️ Plan trip
                    </button>
                    <button style={styles.removeBtn} onClick={() => handleRemove(dest._id)}>
                      🗑️ Remove
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

const styles = {
  page: { minHeight: '100vh', background: '#FFF8F5', fontFamily: 'Arial, sans-serif' },
  header: { background: 'linear-gradient(135deg, #3D1A0E, #993C1D)', padding: '50px 40px', textAlign: 'center' },
  title: { fontFamily: 'Georgia, serif', fontSize: '36px', color: '#FFF8F5', margin: '0 0 8px 0' },
  subtitle: { fontSize: '14px', color: '#F0997B', margin: 0 },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  backBtn: { background: 'transparent', color: '#D85A30', border: '1px solid #D85A30', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' },
  exploreBtn: { background: '#D85A30', color: '#FFF8F5', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif' },
  emptyState: { textAlign: 'center', padding: '80px 20px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #FAECE7', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  emptyTitle: { fontFamily: 'Georgia, serif', fontSize: '22px', color: '#3D1A0E', margin: 0 },
  emptyText: { fontSize: '14px', color: '#993C1D', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
  card: { background: '#FFFFFF', borderRadius: '12px', overflow: 'hidden', border: '1px solid #FAECE7', boxShadow: '0 2px 12px rgba(216,90,48,0.08)' },
  cardImage: { height: '130px', background: 'linear-gradient(135deg, #FAECE7, #F0997B)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardEmoji: { fontSize: '52px' },
  cardBody: { padding: '20px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  cardName: { fontFamily: 'Georgia, serif', fontSize: '20px', color: '#3D1A0E', margin: '0 0 4px 0' },
  cardCountry: { fontSize: '12px', color: '#993C1D', margin: 0 },
  climateBadge: { background: '#FAECE7', color: '#D85A30', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap' },
  cardDesc: { fontSize: '13px', color: '#5F5E5A', lineHeight: '1.6', margin: '0 0 8px 0' },
  bestTime: { fontSize: '11px', color: '#993C1D', margin: '0 0 14px 0' },
  cardActions: { display: 'flex', gap: '8px' },
  planBtn: { flex: 1, background: '#D85A30', color: '#FFF8F5', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif' },
  removeBtn: { background: '#FCEBEB', color: '#791F1F', border: 'none', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', cursor: 'pointer' },
};

export default Wishlist;