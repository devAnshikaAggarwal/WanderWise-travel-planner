import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Emergency() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async (query = '') => {
    try {
      const res = await api.get(`/emergency${query ? `?country=${query}` : ''}`);
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchContacts(search);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>🚨 Emergency Contacts</h1>
        <p style={styles.subtitle}>Local emergency numbers for your destination</p>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by country..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>Search</button>
          {search && (
            <button type="button" style={styles.clearBtn}
              onClick={() => { setSearch(''); fetchContacts(''); }}>
              Clear
            </button>
          )}
        </form>
      </div>

      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>

        <div style={styles.warningBox}>
          ⚠️ Always save local emergency numbers before traveling to a new country.
        </div>

        {loading && <p style={{ color: '#993C1D' }}>Loading emergency contacts...</p>}

        {!loading && contacts.length === 0 && (
          <p style={{ color: '#993C1D', textAlign: 'center', padding: '40px' }}>
            No contacts found for "{search}"
          </p>
        )}

        <div style={styles.grid}>
          {contacts.map(contact => (
            <div key={contact._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.flag}>🌍</span>
                <h3 style={styles.country}>{contact.country}</h3>
              </div>
              <div style={styles.numbers}>
                <div style={styles.numberItem}>
                  <span style={styles.numberIcon}>🚔</span>
                  <div>
                    <p style={styles.numberLabel}>Police</p>
                    <p style={styles.numberValue}>{contact.policeNo}</p>
                  </div>
                </div>
                <div style={styles.numberItem}>
                  <span style={styles.numberIcon}>🚑</span>
                  <div>
                    <p style={styles.numberLabel}>Ambulance</p>
                    <p style={styles.numberValue}>{contact.ambulanceNo}</p>
                  </div>
                </div>
                <div style={styles.numberItem}>
                  <span style={styles.numberIcon}>🔥</span>
                  <div>
                    <p style={styles.numberLabel}>Fire</p>
                    <p style={styles.numberValue}>{contact.fireNo}</p>
                  </div>
                </div>
                <div style={styles.numberItem}>
                  <span style={styles.numberIcon}>✈️</span>
                  <div>
                    <p style={styles.numberLabel}>Tourist Helpline</p>
                    <p style={styles.numberValue}>{contact.touristHelpline}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#FFF8F5', fontFamily: 'Arial, sans-serif' },
  header: { background: 'linear-gradient(135deg, #3D1A0E, #993C1D)', padding: '50px 40px', textAlign: 'center' },
  title: { fontFamily: 'Georgia, serif', fontSize: '36px', color: '#FFF8F5', margin: '0 0 8px 0' },
  subtitle: { fontSize: '14px', color: '#F0997B', margin: '0 0 24px 0' },
  searchForm: { display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto', justifyContent: 'center' },
  searchInput: { flex: 1, padding: '10px 16px', borderRadius: '8px', border: 'none', fontSize: '14px', outline: 'none', background: '#FFF8F5', color: '#3D1A0E' },
  searchBtn: { padding: '10px 18px', background: '#D85A30', color: '#FFF8F5', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
  clearBtn: { padding: '10px 14px', background: 'transparent', color: '#F0997B', border: '1px solid #F0997B', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  content: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
  backBtn: { background: 'transparent', color: '#D85A30', border: '1px solid #D85A30', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', marginBottom: '20px', fontFamily: 'Arial, sans-serif' },
  warningBox: { background: '#FFF3CD', border: '1px solid #F39C12', color: '#856404', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: { background: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #FAECE7', boxShadow: '0 2px 12px rgba(216,90,48,0.08)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #FAECE7' },
  flag: { fontSize: '24px' },
  country: { fontFamily: 'Georgia, serif', fontSize: '20px', color: '#3D1A0E', margin: 0 },
  numbers: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  numberItem: { display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px', background: '#FFF8F5', borderRadius: '8px' },
  numberIcon: { fontSize: '18px', flexShrink: 0 },
  numberLabel: { fontSize: '10px', color: '#993C1D', margin: '0 0 2px 0', textTransform: 'uppercase', letterSpacing: '1px' },
  numberValue: { fontSize: '16px', color: '#3D1A0E', margin: 0, fontWeight: 'bold', fontFamily: 'Georgia, serif' },
};

export default Emergency;