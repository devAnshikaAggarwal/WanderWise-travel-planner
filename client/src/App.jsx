import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import TripPlanner from './pages/TripPlanner';
import Itinerary from './pages/Itinerary';
import Budget from './pages/Budget';
import Wishlist from './pages/Wishlist';
import Checklist from './pages/Checklist';
import Dashboard from './pages/Dashboard';
import Emergency from './pages/Emergency';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />
        <Route path="/trip-planner" element={<TripPlanner />} />
        <Route path="/itinerary/:tripId" element={<Itinerary />} />
        <Route path="/budget/:tripId" element={<Budget />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checklist/:tripId" element={<Checklist />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
