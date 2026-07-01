import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

function Destinations() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDestinations = async (query = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/destinations${query ? `?search=${query}` : ''}`);
      setDestinations(res.data);
    } catch (err) {
      setError('Failed to load destinations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations(search);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDestinations(search);
  };

  const climateColors = {
    Tropical: '#27AE60',
    Mediterranean: '#2980B9',
    Temperate: '#8E44AD',
    Arid: '#E67E22',
    Alpine: '#16A085',
    Desert: '#D35400',
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Explore Destinations</h1>
        <p style={styles.subtitle}>Discover amazing places around the world</p>

        {/* SEARCH */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or country..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>Search 🔍</button>
          {search && (
            <button
              type="button"
              style={styles.clearButton}
              onClick={() => { setSearch(''); fetchDestinations(''); }}
            >
              Clear ✕
            </button>
          )}
        </form>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        {loading && (
          <div style={styles.center}>
            <p style={styles.loadingText}>Loading destinations...</p>
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>{error}</div>
        )}

        {!loading && !error && destinations.length === 0 && (
          <div style={styles.center}>
            <p style={styles.emptyText}>No destinations found for "{search}"</p>
            <button style={styles.searchButton} onClick={() => { setSearch(''); fetchDestinations(''); }}>
              Show all destinations
            </button>
          </div>
        )}

        {!loading && destinations.length > 0 && (
          <>
            <p style={styles.resultCount}>{destinations.length} destination{destinations.length !== 1 ? 's' : ''} found</p>
            <div style={styles.grid}>
              {destinations.map((dest) => (
                <div
                  key={dest._id}
                  style={styles.card}
                  onClick={() => navigate(`/destinations/${dest._id}`)}
                >
                  {/* Card image placeholder */}
                  <div style={styles.cardImage}>
                    <span style={styles.cardEmoji}>
                      {dest.climate === 'Tropical' ? '🌴' :
                       dest.climate === 'Mediterranean' ? '🏛️' :
                       dest.climate === 'Temperate' ? '⛩️' :
                       dest.climate === 'Arid' ? '🏰' :
                       dest.climate === 'Alpine' ? '🏔️' :
                       dest.climate === 'Desert' ? '🌆' : '✈️'}
                    </span>
                  </div>

                  {/* Card body */}
                  <div style={styles.cardBody}>
                    <div style={styles.cardTop}>
                      <div>
                        <h3 style={styles.cardName}>{dest.name}</h3>
                        <p style={styles.cardCountry}>📍 {dest.country}</p>
                      </div>
                      <span style={{
                        ...styles.climateBadge,
                        background: climateColors[dest.climate] + '20',
                        color: climateColors[dest.climate],
                      }}>
                        {dest.climate}
                      </span>
                    </div>

                    <p style={styles.cardDesc}>{dest.description}</p>

                    <div style={styles.cardFooter}>
                      <span style={styles.bestTime}>🗓️ Best time: {dest.bestTime}</span>
                      <button
                        style={styles.viewButton}
                        onClick={(e) => { e.stopPropagation(); navigate(`/destinations/${dest._id}`); }}
                      >
                        View →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#FFF8F5', fontFamily: 'Arial, sans-serif' },

  header: {
    background: 'linear-gradient(135deg, #3D1A0E, #993C1D)',
    padding: '50px 40px 40px',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Georgia, serif',
    fontSize: '36px',
    color: '#FFF8F5',
    margin: '0 0 8px 0',
  },
  subtitle: { fontSize: '14px', color: '#F0997B', margin: '0 0 28px 0' },

  searchForm: {
    display: 'flex',
    gap: '8px',
    maxWidth: '500px',
    margin: '0 auto',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    minWidth: '260px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    background: '#FFF8F5',
    color: '#3D1A0E',
    outline: 'none',
  },
  searchButton: {
    padding: '12px 20px',
    background: '#D85A30',
    color: '#FFF8F5',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
  },
  clearButton: {
    padding: '12px 16px',
    background: 'transparent',
    color: '#F0997B',
    border: '1px solid #F0997B',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },

  content: { maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' },
  center: { textAlign: 'center', padding: '60px 0' },
  loadingText: { color: '#993C1D', fontSize: '16px' },
  emptyText: { color: '#993C1D', fontSize: '16px', marginBottom: '20px' },
  errorBox: {
    background: '#FAECE7',
    border: '1px solid #F0997B',
    color: '#712B13',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  resultCount: { color: '#993C1D', fontSize: '13px', marginBottom: '20px' },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #FAECE7',
    boxShadow: '0 2px 12px rgba(216,90,48,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  cardImage: {
    height: '140px',
    background: 'linear-gradient(135deg, #FAECE7, #F0997B)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: { fontSize: '56px' },
  cardBody: { padding: '20px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  cardName: {
    fontFamily: 'Georgia, serif',
    fontSize: '20px',
    color: '#3D1A0E',
    margin: '0 0 4px 0',
  },
  cardCountry: { fontSize: '12px', color: '#993C1D', margin: 0 },
  climateBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  cardDesc: {
    fontSize: '13px',
    color: '#5F5E5A',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
  },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  bestTime: { fontSize: '11px', color: '#993C1D' },
  viewButton: {
    background: '#D85A30',
    color: '#FFF8F5',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
  },
};

export default Destinations;