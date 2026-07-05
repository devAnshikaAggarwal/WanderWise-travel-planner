import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const convertCurrency = async (from, to, amount) => {
  const { data } = await axios.get(`${API_URL}/api/currency/convert`, {
    params: { from, to, amount },
  });
  return data;
};
