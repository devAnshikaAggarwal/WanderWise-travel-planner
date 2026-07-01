function Footer() {
  return (
    <footer style={{
      background: '#1A0A05',
      color: '#F0997B',
      textAlign: 'center',
      padding: '24px',
      marginTop: '60px',
      fontSize: '13px',
    }}>
      WanderWise © {new Date().getFullYear()} — roam smart. go far.
    </footer>
  );
}

export default Footer;
