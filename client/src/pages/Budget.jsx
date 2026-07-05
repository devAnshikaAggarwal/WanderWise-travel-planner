import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import CurrencyConverter from "../components/CurrencyConverter";
import styles from "../styles/Budget.module.css";

function Budget() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [budgetForm, setBudgetForm] = useState({
    totalBudget: "",
    currency: "USD",
  });
  const [expenseForm, setExpenseForm] = useState({
    category: "",
    amount: "",
    note: "",
  });
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
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
    setError("");
    try {
      await api.post(`/budget/${tripId}`, budgetForm);
      setSuccess("Budget set! 💰");
      setShowBudgetForm(false);
      fetchBudget();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to set budget");
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError("");
    if (!expenseForm.category || !expenseForm.amount) {
      return setError("Category and amount are required");
    }
    try {
      await api.post(`/budget/${tripId}/expense`, {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
      });
      setExpenseForm({ category: "", amount: "", note: "" });
      setSuccess("Expense added! ✅");
      fetchBudget();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense");
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

  const categories = [
    "Food",
    "Transport",
    "Hotel",
    "Activities",
    "Shopping",
    "Medical",
    "Other",
  ];

  const spent = budgetData?.budget?.spent || 0;
  const total = budgetData?.budget?.totalBudget || 0;
  const remaining = budgetData?.remaining || 0;
  const percentage = total > 0 ? Math.min((spent / total) * 100, 100) : 0;

  const progressColorClass =
    percentage > 90
      ? styles.progressRed
      : percentage > 70
        ? styles.progressOrange
        : styles.progressGreen;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Trip Budget</h1>
        <p className={styles.subtitle}>
          Track your spending and stay within budget
        </p>
      </div>

      <div className={styles.content}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/dashboard")}
        >
          ← Back to dashboard
        </button>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.successBox}>{success}</div>}

        {loading && <p className={styles.loadingText}>Loading budget...</p>}

        {!loading && !budgetData && !showBudgetForm && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>💰</span>
            <h3 className={styles.emptyTitle}>No budget set yet</h3>
            <p className={styles.emptyText}>
              Set a budget to start tracking your expenses
            </p>
            <button
              className={styles.primaryBtn}
              onClick={() => setShowBudgetForm(true)}
            >
              Set Budget
            </button>
          </div>
        )}

        {showBudgetForm && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Set Trip Budget</h2>
            <form onSubmit={handleCreateBudget} className={styles.form}>
              <div className={styles.dateRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Total Budget *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1500"
                    value={budgetForm.totalBudget}
                    onChange={(e) =>
                      setBudgetForm({
                        ...budgetForm,
                        totalBudget: e.target.value,
                      })
                    }
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Currency</label>
                  <select
                    value={budgetForm.currency}
                    onChange={(e) =>
                      setBudgetForm({ ...budgetForm, currency: e.target.value })
                    }
                    className={styles.input}
                  >
                    <option>USD</option>
                    <option>INR</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>JPY</option>
                  </select>
                </div>
              </div>
              <button type="submit" className={styles.primaryBtn}>
                Set Budget 💰
              </button>
            </form>
          </div>
        )}

        {!loading && budgetData && (
          <div className={styles.grid}>
            {/* LEFT — budget overview + add expense */}
            <div className={styles.leftColumn}>
              {/* Budget overview */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Budget Overview</h2>
                <div className={styles.budgetStats}>
                  <div className={styles.budgetStat}>
                    <span className={styles.budgetNum}>
                      {budgetData.budget.currency} {total}
                    </span>
                    <span className={styles.budgetLabel}>Total Budget</span>
                  </div>
                  <div className={styles.budgetStat}>
                    <span
                      className={`${styles.budgetNum} ${styles.budgetNumSpent}`}
                    >
                      {budgetData.budget.currency} {spent.toFixed(2)}
                    </span>
                    <span className={styles.budgetLabel}>Spent</span>
                  </div>
                  <div className={styles.budgetStat}>
                    <span
                      className={`${styles.budgetNum} ${remaining >= 0 ? styles.budgetNumPositive : styles.budgetNumNegative}`}
                    >
                      {budgetData.budget.currency} {remaining.toFixed(2)}
                    </span>
                    <span className={styles.budgetLabel}>Remaining</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className={styles.progressBg}>
                  <div
                    className={`${styles.progressBar} ${progressColorClass}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className={styles.progressLabel}>
                  {percentage.toFixed(1)}% of budget used
                </p>
              </div>

              {/* Add expense */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Add Expense</h2>
                <form onSubmit={handleAddExpense} className={styles.form}>
                  <div className={styles.field}>
                    <label className={styles.label}>Category *</label>
                    <select
                      value={expenseForm.category}
                      onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          category: e.target.value,
                        })
                      }
                      className={styles.input}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.dateRow}>
                    <div className={styles.field}>
                      <label className={styles.label}>Amount *</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={expenseForm.amount}
                        onChange={(e) =>
                          setExpenseForm({
                            ...expenseForm,
                            amount: e.target.value,
                          })
                        }
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Note</label>
                      <input
                        type="text"
                        placeholder="Optional..."
                        value={expenseForm.note}
                        onChange={(e) =>
                          setExpenseForm({
                            ...expenseForm,
                            note: e.target.value,
                          })
                        }
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <button type="submit" className={styles.primaryBtn}>
                    + Add Expense
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT — expenses list */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                Expenses ({budgetData.expenses.length})
              </h2>
              {budgetData.expenses.length === 0 && (
                <p className={styles.noExpenses}>
                  No expenses yet. Add your first one!
                </p>
              )}
              <div className={styles.expenseList}>
                {budgetData.expenses.map((exp) => (
                  <div key={exp._id} className={styles.expenseItem}>
                    <div className={styles.expenseLeft}>
                      <span className={styles.expenseCategory}>
                        {exp.category}
                      </span>
                      {exp.note && (
                        <p className={styles.expenseNote}>{exp.note}</p>
                      )}
                    </div>
                    <div className={styles.expenseRight}>
                      <span className={styles.expenseAmount}>
                        {budgetData.budget.currency} {exp.amount}
                      </span>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteExpense(exp._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && (
          <div className={styles.converterWrap}>
            <CurrencyConverter />
          </div>
        )}
      </div>
    </div>
  );
}

export default Budget;
