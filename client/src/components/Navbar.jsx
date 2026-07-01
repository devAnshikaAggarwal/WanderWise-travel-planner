import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{
      background: '#3D1A0E',
      padding: '14px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Link to="/" style={{
        fontFamily: 'Georgia, serif',
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#FFF8F5',
        textDecoration: 'none',
      }}>
        Wander<span style={{ color: '#F0997B' }}>Wise</span>
      </Link>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link to="/destinations" style={{ color: '#F0997B', textDecoration: 'none' }}>Explore</Link>
        <Link to="/trip-planner" style={{ color: '#F0997B', textDecoration: 'none' }}>Plan</Link>
        <Link to="/dashboard" style={{ color: '#F0997B', textDecoration: 'none' }}>Trips</Link>
        <Link to="/login" style={{
          background: '#D85A30',
          color: '#FFF8F5',
          padding: '8px 18px',
          borderRadius: '20px',
          textDecoration: 'none',
          fontSize: '14px',
        }}>Get started</Link>
      </div>
    </nav>
  );
}

export default Navbar;
