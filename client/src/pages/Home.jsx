import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/destinations?search=${search}`);
    } else {
      navigate('/destinations');
    }
  };

  const features = [
    { icon: '🗺️', title: 'Plan Itineraries', desc: 'Build day-by-day trip plans with ease' },
    { icon: '💰', title: 'Track Budget', desc: 'Monitor spending and stay within budget' },
    { icon: '❤️', title: 'Save Wishlist', desc: 'Save destinations you want to visit' },
    { icon: '☁️', title: 'Weather Info', desc: 'Check weather and best time to visit' },
    { icon: '📋', title: 'Travel Checklist', desc: 'Never forget essentials with smart lists' },
    { icon: '🚨', title: 'Emergency Contacts', desc: 'Stay safe with local emergency numbers' },
  ];

  const popularDestinations = [
    { name: 'Bali', country: 'Indonesia', emoji: '🌴', climate: 'Tropical' },
    { name: 'Santorini', country: 'Greece', emoji: '🏛️', climate: 'Mediterranean' },
    { name: 'Kyoto', country: 'Japan', emoji: '⛩️', climate: 'Temperate' },
    { name: 'Dubai', country: 'UAE', emoji: '🌆', climate: 'Desert' },
  ];

  return (
    <div style={styles.page}>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.heroTag}>✈️ Your smart travel companion</p>
          <h1 style={styles.heroTitle}>
            Plan trips smarter.<br />
            <span style={styles.heroAccent}>Explore further.</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Search destinations, build itineraries, track budgets, and travel confidently — all in one place.
          </p>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destinations... (Bali, Paris, Japan)"
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton}>
              Search 🔍
            </button>
          </form>

          <div style={styles.heroStats}>
            <div style={styles.stat}>
              <span style={styles.statNum}>8+</span>
              <span style={styles.statLabel}>Destinations</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <span style={styles.statNum}>100%</span>
              <span style={styles.statLabel}>Free to use</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <span style={styles.statNum}>6+</span>
              <span style={styles.statLabel}>Features</span>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Popular Destinations</h2>
        <p style={styles.sectionSubtitle}>Hand-picked places loved by travelers worldwide</p>
        <div style={styles.destGrid}>
          {popularDestinations.map((dest) => (
            <div
              key={dest.name}
              style={styles.destCard}
              onClick={() => navigate('/destinations')}
            >
              <div style={styles.destEmoji}>{dest.emoji}</div>
              <h3 style={styles.destName}>{dest.name}</h3>
              <p style={styles.destCountry}>{dest.country}</p>
              <span style={styles.destBadge}>{dest.climate}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ ...styles.section, background: '#FAECE7', padding: '60px 40px' }}>
        <h2 style={styles.sectionTitle}>Everything you need to travel smart</h2>
        <p style={styles.sectionSubtitle}>WanderWise brings all your travel planning tools together</p>
        <div style={styles.featGrid}>
          {features.map((f) => (
            <div key={f.title} style={styles.featCard}>
              <div style={styles.featIcon}>{f.icon}</div>
              <h3 style={styles.featTitle}>{f.title}</h3>
              <p style={styles.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to plan your next adventure?</h2>
        <p style={styles.ctaSubtitle}>Join WanderWise and start planning smarter today</p>
        <div style={styles.ctaButtons}>
          <button style={styles.ctaPrimary} onClick={() => navigate('/register')}>
            Get started free
          </button>
          <button style={styles.ctaSecondary} onClick={() => navigate('/destinations')}>
            Browse destinations
          </button>
        </div>
      </section>

    </div>
  );
}

const styles = {
  page: { fontFamily: 'Arial, sans-serif', background: '#FFF8F5' },

  // Hero
  hero: {
    background: 'linear-gradient(135deg, #3D1A0E 0%, #993C1D 60%, #D85A30 100%)',
    padding: '80px 40px',
    textAlign: 'center',
  },
  heroContent: { maxWidth: '700px', margin: '0 auto' },
  heroTag: { color: '#F0997B', fontSize: '14px', letterSpacing: '2px', marginBottom: '16px' },
  heroTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#FFF8F5',
    margin: '0 0 16px 0',
    lineHeight: '1.2',
  },
  heroAccent: { color: '#F0997B' },
  heroSubtitle: {
    fontSize: '16px',
    color: '#FAECE7',
    margin: '0 0 36px 0',
    lineHeight: '1.6',
  },

  // Search
  searchForm: {
    display: 'flex',
    gap: '0',
    maxWidth: '560px',
    margin: '0 auto 40px auto',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  searchInput: {
    flex: 1,
    padding: '16px 20px',
    fontSize: '15px',
    border: 'none',
    outline: 'none',
    background: '#FFF8F5',
    color: '#3D1A0E',
    fontFamily: 'Arial, sans-serif',
  },
  searchButton: {
    padding: '16px 24px',
    background: '#D85A30',
    color: '#FFF8F5',
    border: 'none',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
  },

  // Stats
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '24px',
  },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: '28px', fontWeight: 'bold', color: '#FFF8F5', fontFamily: 'Georgia, serif' },
  statLabel: { fontSize: '11px', color: '#F0997B', letterSpacing: '1px' },
  statDivider: { width: '1px', height: '40px', background: '#F0997B', opacity: 0.4 },

  // Sections
  section: { padding: '60px 40px', maxWidth: '1100px', margin: '0 auto' },
  sectionTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '32px',
    color: '#3D1A0E',
    textAlign: 'center',
    margin: '0 0 8px 0',
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#993C1D',
    textAlign: 'center',
    margin: '0 0 40px 0',
  },

  // Destination cards
  destGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  destCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '28px 20px',
    textAlign: 'center',
    border: '1px solid #FAECE7',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 2px 12px rgba(216,90,48,0.08)',
  },
  destEmoji: { fontSize: '40px', marginBottom: '12px' },
  destName: {
    fontFamily: 'Georgia, serif',
    fontSize: '20px',
    color: '#3D1A0E',
    margin: '0 0 4px 0',
  },
  destCountry: { fontSize: '13px', color: '#993C1D', margin: '0 0 12px 0' },
  destBadge: {
    background: '#FAECE7',
    color: '#D85A30',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 'bold',
  },

  // Feature cards
  featGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  featCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '28px 24px',
    border: '1px solid #F0997B',
    boxShadow: '0 2px 12px rgba(216,90,48,0.06)',
  },
  featIcon: { fontSize: '32px', marginBottom: '12px' },
  featTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '18px',
    color: '#3D1A0E',
    margin: '0 0 8px 0',
  },
  featDesc: { fontSize: '13px', color: '#993C1D', margin: 0, lineHeight: '1.6' },

  // CTA
  cta: {
    background: '#3D1A0E',
    padding: '80px 40px',
    textAlign: 'center',
  },
  ctaTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '36px',
    color: '#FFF8F5',
    margin: '0 0 12px 0',
  },
  ctaSubtitle: {
    fontSize: '15px',
    color: '#F0997B',
    margin: '0 0 36px 0',
  },
  ctaButtons: { display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' },
  ctaPrimary: {
    background: '#D85A30',
    color: '#FFF8F5',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 32px',
    fontSize: '15px',
    fontFamily: 'Georgia, serif',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  ctaSecondary: {
    background: 'transparent',
    color: '#F0997B',
    border: '2px solid #F0997B',
    borderRadius: '8px',
    padding: '14px 32px',
    fontSize: '15px',
    fontFamily: 'Georgia, serif',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default Home;