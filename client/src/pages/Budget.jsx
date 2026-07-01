import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Budget() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [budgetForm, setBudgetForm] = useState({ totalBudget: '', currency: 'USD' });
  const [expenseForm, setExpenseForm] = useState({ category: '', amount: '', note: '' });
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    try {
      const res = await api.get(`/budget/${tripId}`);
      setBudgetData(res.data);
    } catch (err) {
      if (err.response?.status === 404) setBudgetData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/budget/${tripId}`, budgetForm);
      setSuccess('Budget set! 💰');
      setShowBudgetForm(false);
      fetchBudget();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set budget');
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError('');
    if (!expenseForm.category || !expenseForm.amount) {
      return setError('Category and amount are required');
    }
    try {
      await api.post(`/budget/${tripId}/expense`, {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
      });
      setExpenseForm({ category: '', amount: '', note: '' });
      setSuccess('Expense added! ✅');
      fetchBudget();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await api.delete(`/budget/${tripId}/expense/${expenseId}`);
      fetchBudget();
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['Food', 'Transport', 'Hotel', 'Activities', 'Shopping', 'Medical', 'Other'];

  const spent = budgetData?.budget?.spent || 0;
  const total = budgetData?.budget?.totalBudget || 0;
  const remaining = budgetData?.remaining || 0;
  const percentage = total > 0 ? Math.min((spent / total) * 100, 100) : 0;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Trip Budget</h1>
        <p style={styles.subtitle}>Track your spending and stay within budget</p>
      </div>

      <div style={styles.content}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back to dashboard</button>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        {loading && <p style={{ color: '#993C1D' }}>Loading budget...</p>}

        {!loading && !budgetData && !showBudgetForm && (
          <div style={styles.emptyState}>
            <span style={{ fontSize: '48px' }}>💰</span>
            <h3 style={styles.emptyTitle}>No budget set yet</h3>
            <p style={styles.emptyText}>Set a budget to start tracking your expenses</p>
            <button style={styles.primaryBtn} onClick={() => setShowBudgetForm(true)}>
              Set Budget
            </button>
          </div>
        )}

        {showBudgetForm && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Set Trip Budget</h2>
            <form onSubmit={handleCreateBudget} style={styles.form}>
              <div style={styles.dateRow}>
                <div style={styles.field}>
                  <label style={styles.label}>Total Budget *</label>
                  <input type="number" min="0" placeholder="e.g. 1500"
                    value={budgetForm.totalBudget}
                    onChange={e => setBudgetForm({ ...budgetForm, totalBudget: e.target.value })}
                    style={styles.input} required/>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Currency</label>
                  <select value={budgetForm.currency}
                    onChange={e => setBudgetForm({ ...budgetForm, currency: e.target.value })}
                    style={styles.input}>
                    <option>USD</option>
                    <option>INR</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>JPY</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={styles.primaryBtn}>Set Budget 💰</button>
            </form>
          </div>
        )}

        {!loading && budgetData && (
          <div style={styles.grid}>
            {/* LEFT — budget overview + add expense */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Budget overview */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Budget Overview</h2>
                <div style={styles.budgetStats}>
                  <div style={styles.budgetStat}>
                    <span style={styles.budgetNum}>{budgetData.budget.currency} {total}</span>
                    <span style={styles.budgetLabel}>Total Budget</span>
                  </div>
                  <div style={styles.budgetStat}>
                    <span style={{ ...styles.budgetNum, color: '#D85A30' }}>{budgetData.budget.currency} {spent.toFixed(2)}</span>
                    <span style={styles.budgetLabel}>Spent</span>
                  </div>
                  <div style={styles.budgetStat}>
                    <span style={{ ...styles.budgetNum, color: remaining >= 0 ? '#27AE60' : '#E74C3C' }}>
                      {budgetData.budget.currency} {remaining.toFixed(2)}
                    </span>
                    <span style={styles.budgetLabel}>Remaining</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={styles.progressBg}>
                  <div style={{
                    ...styles.progressBar,
                    width: `${percentage}%`,
                    background: percentage > 90 ? '#E74C3C' : percentage > 70 ? '#F39C12' : '#27AE60',
                  }}/>
                </div>
                <p style={styles.progressLabel}>{percentage.toFixed(1)}% of budget used</p>
              </div>

              {/* Add expense */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Add Expense</h2>
                <form onSubmit={handleAddExpense} style={styles.form}>
                  <div style={styles.field}>
                    <label style={styles.label}>Category *</label>
                    <select value={expenseForm.category}
                      onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                      style={styles.input} required>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={styles.dateRow}>
                    <div style={styles.field}>
                      <label style={styles.label}>Amount *</label>
                      <input type="number" min="0" step="0.01" placeholder="0.00"
                        value={expenseForm.amount}
                        onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                        style={styles.input} required/>
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Note</label>
                      <input type="text" placeholder="Optional..."
                        value={expenseForm.note}
                        onChange={e => setExpenseForm({ ...expenseForm, note: e.target.value })}
                        style={styles.input}/>
                    </div>
                  </div>
                  <button type="submit" style={styles.primaryBtn}>+ Add Expense</button>
                </form>
              </div>
            </div>

            {/* RIGHT — expenses list */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Expenses ({budgetData.expenses.length})</h2>
              {budgetData.expenses.length === 0 && (
                <p style={{ color: '#993C1D', fontSize: '13px' }}>No expenses yet. Add your first one!</p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {budgetData.expenses.map(exp => (
                  <div key={exp._id} style={styles.expenseItem}>
                    <div style={styles.expenseLeft}>
                      <span style={styles.expenseCategory}>{exp.category}</span>
                      {exp.note && <p style={styles.expenseNote}>{exp.note}</p>}
                    </div>
                    <div style={styles.expenseRight}>
                      <span style={styles.expenseAmount}>{budgetData.budget.currency} {exp.amount}</span>
                      <button style={styles.deleteBtn} onClick={() => handleDeleteExpense(exp._id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
  error: { background: '#FAECE7', border: '1px solid #F0997B', color: '#712B13', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  successBox: { background: '#E8F8EF', border: '1px solid #27AE60', color: '#1A6B3C', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  emptyState: { textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #FAECE7' },
  emptyTitle: { fontFamily: 'Georgia, serif', fontSize: '20px', color: '#3D1A0E', margin: '12px 0 8px 0' },
  emptyText: { fontSize: '13px', color: '#993C1D', margin: '0 0 20px 0' },
  card: { background: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid #FAECE7', boxShadow: '0 2px 12px rgba(216,90,48,0.08)' },
  cardTitle: { fontFamily: 'Georgia, serif', fontSize: '20px', color: '#3D1A0E', margin: '0 0 20px 0', paddingBottom: '10px', borderBottom: '1px solid #FAECE7' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#3D1A0E' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #F0997B', fontSize: '14px', color: '#3D1A0E', background: '#FFF8F5', outline: 'none', fontFamily: 'Arial, sans-serif' },
  dateRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  primaryBtn: { background: '#D85A30', color: '#FFF8F5', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Georgia, serif' },
  budgetStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' },
  budgetStat: { textAlign: 'center', padding: '12px', background: '#FFF8F5', borderRadius: '8px' },
  budgetNum: { display: 'block', fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 'bold', color: '#3D1A0E', marginBottom: '4px' },
  budgetLabel: { fontSize: '11px', color: '#993C1D', textTransform: 'uppercase', letterSpacing: '1px' },
  progressBg: { background: '#FAECE7', borderRadius: '20px', height: '10px', overflow: 'hidden', marginBottom: '8px' },
  progressBar: { height: '100%', borderRadius: '20px', transition: 'width 0.3s ease' },
  progressLabel: { fontSize: '12px', color: '#993C1D', margin: 0, textAlign: 'right' },
  expenseItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#FFF8F5', borderRadius: '8px', border: '1px solid #FAECE7' },
  expenseLeft: { display: 'flex', flexDirection: 'column', gap: '2px' },
  expenseCategory: { fontSize: '13px', fontWeight: '500', color: '#3D1A0E' },
  expenseNote: { fontSize: '11px', color: '#993C1D', margin: 0 },
  expenseRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  expenseAmount: { fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: 'bold', color: '#D85A30' },
  deleteBtn: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px' },
};

export default Budget;