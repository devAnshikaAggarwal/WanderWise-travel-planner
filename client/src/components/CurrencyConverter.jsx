import { useState } from "react";
import { convertCurrency } from "../services/currencyService";
import styles from "../styles/CurrencyConverter.module.css";

const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "INR",
  "JPY",
  "AUD",
  "CAD",
  "AED",
  "SGD",
  "CHF",
  "THB",
  "TRY",
  "BRL",
];

export default function CurrencyConverter() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [amount, setAmount] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await convertCurrency(from, to, amount);
      setResult(data);
    } catch (err) {
      setError("Conversion failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>💱 Currency Converter</h3>
      <p className={styles.subtitle}>Live exchange rates for your travels</p>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Amount</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>From</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={styles.input}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className={styles.swapBtn}
        onClick={handleSwap}
        title="Swap currencies"
      >
        ⇅ Swap
      </button>

      <div className={styles.field}>
        <label className={styles.label}>To</label>
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className={styles.input}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button
        className={styles.convertBtn}
        onClick={handleConvert}
        disabled={loading}
      >
        {loading ? "Converting..." : "Convert"}
      </button>

      {error && <p className={styles.error}>{error}</p>}

      {result && (
        <div className={styles.result}>
          <p className={styles.resultMain}>
            {amount} {from} ={" "}
            <strong>
              {result.converted} {to}
            </strong>
          </p>
          <p className={styles.resultRate}>
            1 {from} = {result.rate} {to}
          </p>
        </div>
      )}
    </div>
  );
}
