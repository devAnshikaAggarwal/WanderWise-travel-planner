import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/destinations?search=${search}`);
    } else {
      navigate("/destinations");
    }
  };

  const features = [
    {
      icon: "🗺️",
      title: "Plan Itineraries",
      desc: "Build day-by-day trip plans with ease",
    },
    {
      icon: "💰",
      title: "Track Budget",
      desc: "Monitor spending and stay within budget",
    },
    {
      icon: "❤️",
      title: "Save Wishlist",
      desc: "Save destinations you want to visit",
    },
    {
      icon: "☁️",
      title: "Weather Info",
      desc: "Check weather and best time to visit",
    },
    {
      icon: "📋",
      title: "Travel Checklist",
      desc: "Never forget essentials with smart lists",
    },
    {
      icon: "🚨",
      title: "Emergency Contacts",
      desc: "Stay safe with local emergency numbers",
    },
  ];

  const popularDestinations = [
    {
      name: "Bali",
      country: "Indonesia",
      climate: "Tropical",
      img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80&auto=format&fit=crop",
    },
    {
      name: "Santorini",
      country: "Greece",
      climate: "Mediterranean",
      img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80&auto=format&fit=crop",
    },
    {
      name: "Kyoto",
      country: "Japan",
      climate: "Temperate",
      img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80&auto=format&fit=crop",
    },
    {
      name: "Dubai",
      country: "UAE",
      climate: "Desert",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80&auto=format&fit=crop",
    },
  ];

  return (
    <div className={styles.page}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={`${styles.heroContent} fadeUp`}>
          <p className={styles.heroTag}>✈️ Your smart travel companion</p>
          <h1 className={styles.heroTitle}>
            Plan trips smarter.
            <br />
            <span className={styles.heroAccent}>Explore further.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Search destinations, build itineraries, track budgets, and travel
            confidently — all in one place.
          </p>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destinations... (Bali, Paris, Japan)"
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search 🔍
            </button>
          </form>

          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>8+</span>
              <span className={styles.statLabel}>Destinations</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>100%</span>
              <span className={styles.statLabel}>Free to use</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>6+</span>
              <span className={styles.statLabel}>Features</span>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Popular Destinations</h2>
        <p className={styles.sectionSubtitle}>
          Hand-picked places loved by travelers worldwide
        </p>
        <div className={styles.destGrid}>
          {popularDestinations.map((dest) => (
            <div
              key={dest.name}
              className={styles.destCard}
              onClick={() => navigate("/destinations")}
            >
              <div className={styles.destImgWrap}>
                <img
                  src={dest.img}
                  alt={dest.name}
                  className={styles.destImg}
                  loading="lazy"
                />
                <span className={styles.destBadge}>{dest.climate}</span>
              </div>
              <div className={styles.destBody}>
                <h3 className={styles.destName}>{dest.name}</h3>
                <p className={styles.destCountry}>{dest.country}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresInner}>
          <h2 className={styles.sectionTitle}>
            Everything you need to travel smart
          </h2>
          <p className={styles.sectionSubtitle}>
            WanderWise brings all your travel planning tools together
          </p>
          <div className={styles.featGrid}>
            {features.map((f) => (
              <div key={f.title} className={styles.featCard}>
                <div className={styles.featIcon}>{f.icon}</div>
                <h3 className={styles.featTitle}>{f.title}</h3>
                <p className={styles.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to plan your next adventure?</h2>
        <p className={styles.ctaSubtitle}>
          Join WanderWise and start planning smarter today
        </p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.ctaPrimary}
            onClick={() => navigate("/register")}
          >
            Get started free
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={() => navigate("/destinations")}
          >
            Browse destinations
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
