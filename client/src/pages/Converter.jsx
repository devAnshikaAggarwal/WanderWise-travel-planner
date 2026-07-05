import CurrencyConverter from '../components/CurrencyConverter';

export default function Converter() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', justifyContent: 'center', paddingTop: '60px' }}>
      <CurrencyConverter />
    </div>
  );
}