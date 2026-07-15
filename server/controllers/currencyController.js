const axios = require("axios");

// GET /api/currency/rates/:base
exports.getRates = async (req, res) => {
  try {
    const { base } = req.params;
    const { data } = await axios.get(
      `https://open.er-api.com/v6/latest/${base.toUpperCase()}`,
    );

    if (data.result !== "success") {
      return res.status(400).json({ message: "Invalid base currency" });
    }

    res.json({
      base: data.base_code,
      rates: data.rates,
      lastUpdated: data.time_last_update_utc,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch exchange rates" });
  }
};

// GET /api/currency/convert?from=USD&to=INR&amount=100
exports.convertCurrency = async (req, res) => {
  try {
    const { from, to, amount } = req.query;
    if (!from || !to || !amount) {
      return res
        .status(400)
        .json({ message: "from, to, and amount are required" });
    }

    const { data } = await axios.get(
      `https://open.er-api.com/v6/latest/${from.toUpperCase()}`,
    );
    if (data.result !== "success") {
      return res.status(400).json({ message: "Invalid currency code" });
    }

    const rate = data.rates[to.toUpperCase()];
    if (!rate)
      return res.status(400).json({ message: "Target currency not found" });

    const converted = (parseFloat(amount) * rate).toFixed(2);
    res.json({ from, to, amount, rate, converted });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Conversion failed" });
  }
};
