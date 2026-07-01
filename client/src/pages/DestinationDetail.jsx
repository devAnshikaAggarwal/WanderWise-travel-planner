import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistMsg, setWishlistMsg] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await api.get(`/destinations/${id}`);
        setDestination(res.data);
        fetchWeather(res.data.name);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [id]);

  useEffect(() => {
    if (destination?.coordinates?.lat && mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView(
        [destination.coordinates.lat, destination.coordinates.lng], 6
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      L.marker([destination.coordinates.lat, destination.coordinates.lng])
        .addTo(map)
        .bindPopup(`${destination.name}, ${destination.country}`)
        .openPopup();
      mapInstanceRef.current = map;
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destination]);

  const fetchWeather = async (cityName) => {
    setWeatherLoading(true);
    try {
      const res = await api.get(`/weather?city=${cityName}`);
      setWeather(res.data);
    } catch (err) {
      console.error('Weather fetch failed');
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleWishlist = async () => {
    try {
      await api.post('/wishlist', { destinationId: id });
      setWishlisted(true);
      setWishlistMsg('Added to wishlist ❤️');
    } catch (err) {
      setWishlistMsg(err.response?.data?.message || 'Login to save wishlist');
    }
    setTimeout(() => setWishlistMsg(''), 3000);
  };

  const handlePlanTrip = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate('/trip-planner');
    }
  };

  const climateEmoji = {
    Tropical: '🌴',
    Mediterranean: '🏛️',
    Temperate: '⛩️',
    Arid: '🏰',
    Alpine: '🏔️',
    Desert: '🌆',
  };

  if (loading) return (
    <div style={styles.center}>
      <p style={{ color: '#993C1D' }}>Loading destination...</p>
    </div>
  );

  if (!destination) return (
    <div style={styles.center}>
      <p style={{ color: '#993C1D' }}>Destination not found.</p>
      <button style={styles.backBtn} onClick={() => navigate('/destinations')}>← Back</button>
    </div>
  );

  return (
    <div style={styles.page}>

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroEmoji}>{climateEmoji[destination.climate] || '✈️'}</div>
        <h1 style={styles.heroTitle}>{destination.name}</h1>
        <p style={styles.heroCountry}>📍 {destination.country}</p>
        <span style={styles.climateBadge}>{destination.climate}</span>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate('/destinations')}>
          ← Back to destinations
        </button>

        {wishlistMsg && <div style={styles.wishlistMsg}>{wishlistMsg}</div>}

        <div style={styles.grid}>

          {/* Left — main info */}
          <div style={styles.mainInfo}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>About {destination.name}</h2>
              <p style={styles.description}>{destination.description}</p>
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Travel Info</h2>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoIcon}>🗓️</span>
                  <div>
                    <p style={styles.infoLabel}>Best time to visit</p>
                    <p style={styles.infoValue}>{destination.bestTime}</p>
                  </div>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoIcon}>🌤️</span>
                  <div>
                    <p style={styles.infoLabel}>Climate</p>
                    <p style={styles.infoValue}>{destination.climate}</p>
                  </div>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoIcon}>🌍</span>
                  <div>
                    <p style={styles.infoLabel}>Country</p>
                    <p style={styles.infoValue}>{destination.country}</p>
                  </div>
                </div>
                {destination.coordinates?.lat && (
                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>📌</span>
                    <div>
                      <p style={styles.infoLabel}>Coordinates</p>
                      <p style={styles.infoValue}>
                        {destination.coordinates.lat}°, {destination.coordinates.lng}°
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right — sidebar */}
          <div style={styles.sidebar}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Ready to go?</h2>
              <p style={styles.sidebarText}>
                Start planning your trip to {destination.name} today.
              </p>
              <button style={styles.planBtn} onClick={handlePlanTrip}>
                🗺️ Plan a trip here
              </button>
              <button
                style={wishlisted ? styles.wishlistedBtn : styles.wishlistBtn}
                onClick={handleWishlist}
                disabled={wishlisted}
              >
                {wishlisted ? '❤️ Saved to wishlist' : '🤍 Save to wishlist'}
              </button>
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Quick tips</h2>
              <ul style={styles.tipsList}>
                <li style={styles.tip}>📅 Visit during {destination.bestTime} for best weather</li>
                <li style={styles.tip}>🌤️ Climate is {destination.climate?.toLowerCase()}</li>
                <li style={styles.tip}>💰 Set a budget before booking</li>
                <li style={styles.tip}>📋 Prepare a packing checklist</li>
                <li style={styles.tip}>🚨 Save local emergency numbers</li>
              </ul>
            </div>

            {/* Weather Card */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Current Weather</h2>
              {weatherLoading && (
                <p style={{ color: '#993C1D', fontSize: '13px' }}>Loading weather...</p>
              )}
              {weather && (
                <div style={styles.weatherBox}>
                  <div style={styles.weatherTop}>
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                      alt={weather.description}
                      style={{ width: '60px', height: '60px' }}
                    />
                    <div>
                      <p style={styles.weatherTemp}>{weather.temperature}°C</p>
                      <p style={styles.weatherDesc}>{weather.description}</p>
                    </div>
                  </div>
                  <div style={styles.weatherDetails}>
                    <div style={styles.weatherItem}>
                      <span style={styles.weatherLabel}>Feels like</span>
                      <span style={styles.weatherValue}>{weather.feelsLike}°C</span>
                    </div>
                    <div style={styles.weatherItem}>
                      <span style={styles.weatherLabel}>Humidity</span>
                      <span style={styles.weatherValue}>{weather.humidity}%</span>
                    </div>
                    <div style={styles.weatherItem}>
                      <span style={styles.weatherLabel}>Wind</span>
                      <span style={styles.weatherValue}>{weather.windSpeed} m/s</span>
                    </div>
                    <div style={styles.weatherItem}>
                      <span style={styles.weatherLabel}>Country</span>
                      <span style={styles.weatherValue}>{weather.country}</span>
                    </div>
                  </div>
                </div>
              )}
              {!weatherLoading && !weather && (
                <p style={{ color: '#993C1D', fontSize: '13px' }}>Weather unavailable</p>
              )}
            </div>

            {/* Map Card */}
            {destination.coordinates?.lat && (
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Location</h2>
                <div
                  ref={mapRef}
                  style={{ height: '220px', borderRadius: '8px', overflow: 'hidden' }}
                />
                <p style={{ fontSize: '11px', color: '#993C1D', margin: '8px 0 0 0', textAlign: 'center' }}>
                  📌 {destination.coordinates.lat}°, {destination.coordinates.lng}°
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#FFF8F5', fontFamily: 'Arial, sans-serif' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  hero: { background: 'linear-gradient(135deg, #3D1A0E, #993C1D)', padding: '60px 40px', textAlign: 'center' },
  heroEmoji: { fontSize: '64px', marginBottom: '16px' },
  heroTitle: { fontFamily: 'Georgia, serif', fontSize: '42px', color: '#FFF8F5', margin: '0 0 8px 0' },
  heroCountry: { fontSize: '16px', color: '#F0997B', margin: '0 0 16px 0' },
  climateBadge: { background: '#F0997B', color: '#3D1A0E', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' },
  content: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
  backBtn: { background: 'transparent', color: '#D85A30', border: '1px solid #D85A30', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', marginBottom: '20px', fontFamily: 'Arial, sans-serif' },
  wishlistMsg: { background: '#FAECE7', border: '1px solid #F0997B', color: '#712B13', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' },
  mainInfo: { display: 'flex', flexDirection: 'column', gap: '20px' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { background: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid #FAECE7', boxShadow: '0 2px 12px rgba(216,90,48,0.06)' },
  cardTitle: { fontFamily: 'Georgia, serif', fontSize: '20px', color: '#3D1A0E', margin: '0 0 16px 0', paddingBottom: '10px', borderBottom: '1px solid #FAECE7' },
  description: { fontSize: '14px', color: '#5F5E5A', lineHeight: '1.8', margin: 0 },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  infoItem: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  infoIcon: { fontSize: '20px', marginTop: '2px' },
  infoLabel: { fontSize: '11px', color: '#993C1D', margin: '0 0 2px 0', textTransform: 'uppercase', letterSpacing: '1px' },
  infoValue: { fontSize: '14px', color: '#3D1A0E', margin: 0, fontWeight: '500' },
  sidebarText: { fontSize: '13px', color: '#993C1D', marginBottom: '16px', lineHeight: '1.6' },
  planBtn: { width: '100%', background: '#D85A30', color: '#FFF8F5', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif', marginBottom: '10px' },
  wishlistBtn: { width: '100%', background: 'transparent', color: '#D85A30', border: '2px solid #D85A30', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif' },
  wishlistedBtn: { width: '100%', background: '#FAECE7', color: '#993C1D', border: '2px solid #F0997B', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'not-allowed', fontFamily: 'Georgia, serif' },
  tipsList: { listStyle: 'none', padding: 0, margin: 0 },
  tip: { fontSize: '13px', color: '#5F5E5A', padding: '8px 0', borderBottom: '1px solid #FAECE7', lineHeight: '1.5' },
  weatherBox: { display: 'flex', flexDirection: 'column', gap: '16px' },
  weatherTop: { display: 'flex', alignItems: 'center', gap: '12px' },
  weatherTemp: { fontFamily: 'Georgia, serif', fontSize: '32px', color: '#3D1A0E', margin: '0 0 4px 0', fontWeight: 'bold' },
  weatherDesc: { fontSize: '13px', color: '#993C1D', margin: 0, textTransform: 'capitalize' },
  weatherDetails: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  weatherItem: { background: '#FFF8F5', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' },
  weatherLabel: { fontSize: '10px', color: '#993C1D', textTransform: 'uppercase', letterSpacing: '1px' },
  weatherValue: { fontSize: '14px', color: '#3D1A0E', fontWeight: '500' },
};

export default DestinationDetail;