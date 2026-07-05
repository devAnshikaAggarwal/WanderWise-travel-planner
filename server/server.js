const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const currencyRoutes = require('./routes/currencyRoutes');


dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/itinerary', require('./routes/itineraryRoutes'));
app.use('/api/checklist', require('./routes/checklistRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/currency', currencyRoutes);

app.get('/', (req, res) => {
  res.send('WanderWise API is running 🏔️');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '127.0.0.1', () => console.log(`Server running on port ${PORT}`));