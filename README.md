# WanderWise 🏔️

Full stack travel planning website — search destinations, plan itineraries, track budgets, and get email reminders before your trip.

**Tagline:** roam smart. go far.

## Tech Stack
- MongoDB — database
- Express.js — backend REST API
- React — frontend
- Node.js — server
- JWT — authentication
- Nodemailer — email reminders
- Leaflet.js — interactive maps
- OpenWeatherMap API — weather data

## Project Structure

```
wanderwise/
├── client/                # React frontend
│   └── src/
│       ├── pages/         # Page-level components (Home, Login, TripPlanner...)
│       ├── components/    # Reusable components (SearchBar, TripCard...)
│       ├── context/       # Global state (AuthContext, TripContext...)
│       ├── services/      # API call functions
│       ├── assets/logo/   # Logo files
│       └── styles/        # CSS/theme files
│
└── server/                # Node + Express backend
    ├── models/            # Mongoose schemas (User, Trip, Destination...)
    ├── routes/            # Express routes (authRoutes, tripRoutes...)
    ├── controllers/        # Route logic
    ├── middleware/         # Auth middleware, error handlers
    └── config/             # Database connection, env config
```

## Team Roles

| Member | Role |
|---|---|
| Anshika Aggarwal | Team Lead + Backend (API, DB, Auth, Deployment) |
| Sneha Sharma | Frontend — Auth pages (Login, Register) |
| Yuvanshi Thakur | Frontend — Home & Search |
| Arashdeep Kaur | Frontend — Trip Planner & Itinerary |
| Gayatri Sharma | Frontend — Budget & Wishlist |
| Aditya Bishnoi | Frontend — Extras (Emergency, Dashboard) & Testing |

## Color Theme — Sunset Coral

| Name | Hex |
|---|---|
| Darkest | `#1A0A05` |
| Dark/Navbar | `#3D1A0E` |
| Primary | `#993C1D` |
| Brand | `#D85A30` |
| Accent | `#F0997B` |
| Surface/BG | `#FAECE7` / `#FFF8F5` |

Heading font: Georgia serif, bold. Body font: Arial / system-ui.

## Getting Started

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Features

**Phase 1 (Core)** — Auth, Search, Destination Details, Trip Planner, Daily Itinerary, Budget Calculator, Wishlist, Travel Checklist

**Phase 2** — Interactive Map, Weather Forecast, Currency Converter, Emergency Contacts, Expense Tracker, My Trips Dashboard, Email Reminders

**Phase 3** — Photo Gallery, Analytics, Travel Journal, Profile & Settings
