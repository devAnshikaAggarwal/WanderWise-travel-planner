const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route GET /api/weather?city=Paris
// @desc  Get current weather for a city
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ message: 'City name is required' });

    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const data = response.data;

    res.json({
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
    });
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.status(500).json({ message: 'Weather fetch failed' });
  }
});

module.exports = router;