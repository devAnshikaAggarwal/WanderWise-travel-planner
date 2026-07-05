import { useState } from "react";
import { convertCurrency } from "../services/currencyService";

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

  return (
    <div
      style={{
        background: "#FFF8F5",
        border: "1px solid #F0997B",
        borderRadius: "12px",
        padding: "24px",
        maxWidth: "420px",
      }}
    >
      <h3
        style={{
          color: "#3D1A0E",
          fontFamily: "Georgia, serif",
          marginBottom: "16px",
        }}
      >
        Currency Converter
      </h3>

      <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #F0997B",
          }}
        />
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #F0997B",
          }}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          textAlign: "center",
          color: "#D85A30",
          margin: "8px 0",
          fontWeight: "bold",
        }}
      >
        ↓
      </div>

      <select
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #F0997B",
          marginBottom: "16px",
        }}
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <button
        onClick={handleConvert}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          background: "#D85A30",
          color: "#FFF8F5",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {loading ? "Converting..." : "Convert"}
      </button>

      {error && <p style={{ color: "#D85A30", marginTop: "10px" }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: "16px",
            padding: "14px",
            background: "#F0997B22",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#3D1A0E" }}>
            {amount} {from} = {result.converted} {to}
          </p>
          <p style={{ fontSize: "12px", color: "#993C1D" }}>
            Rate: 1 {from} = {result.rate} {to}
          </p>
        </div>
      )}
    </div>
  );
}
