const dotenv = require("dotenv");
dotenv.config(); // MUST be first — before anything that reads process.env

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const currencyRoutes = require("./routes/currencyRoutes");
const startReminderJob = require("./utils/tripReminders");

connectDB();

const app = express();

const allowedOrigins = ["http://localhost:3000", process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/trips", require("./routes/tripRoutes"));
app.use("/api/destinations", require("./routes/destinationRoutes"));
app.use("/api/budget", require("./routes/budgetRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/itinerary", require("./routes/itineraryRoutes"));
app.use("/api/checklist", require("./routes/checklistRoutes"));
app.use("/api/emergency", require("./routes/emergencyRoutes"));
app.use("/api/weather", require("./routes/weatherRoutes"));
app.use("/api/currency", currencyRoutes);

// Start scheduled jobs
startReminderJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`),
);
