const dotenv = require('dotenv');
dotenv.config(); // MUST be first — before anything that reads process.env

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const currencyRoutes = require('./routes/currencyRoutes');
const startReminderJob = require('./utils/tripReminders');
const sendEmail = require('./utils/sendEmail');

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

// TEMP: email test route (remove before deployment)
app.get('/api/test-email', async (req, res) => {
  try {
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: 'WanderWise test ✅',
      html: '<h2>Nodemailer is working!</h2>',
    });
    res.json({ message: 'Email sent! Check your inbox.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('WanderWise API is running 🏔️');
});

// Start scheduled jobs
startReminderJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, '127.0.0.1', () => console.log(`Server running on port ${PORT}`));