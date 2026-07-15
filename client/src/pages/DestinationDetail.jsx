import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCloudSun,
  FaGlobe,
  FaPlane,
  FaMapMarkedAlt,
  FaHeart,
  FaRegHeart,
  FaShieldAlt,
  FaAmbulance,
  FaFire,
  FaExclamationTriangle,
  FaWallet,
  FaClipboardList,
  FaThumbtack,
  FaUmbrellaBeach,
  FaLandmark,
  FaLeaf,
  FaMonument,
  FaMosque,
  FaMountain,
  FaCity,
} from "react-icons/fa";
import styles from "../styles/DestinationDetail.module.css";

const CLIMATE_ICON = {
  Tropical: <FaUmbrellaBeach />,
  Mediterranean: <FaLandmark />,
  Temperate: <FaLeaf />,
  Arid: <FaMonument />,
  "Semi-arid": <FaMosque />,
  Alpine: <FaMountain />,
  Desert: <FaCity />,
};

function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistMsg, setWishlistMsg] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [emergency, setEmergency] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await api.get(`/destinations/${id}`);
        setDestination(res.data);
        fetchWeather(res.data.name);
        fetchEmergency(res.data.country);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [id]);

  const fetchEmergency = async (country) => {
    try {
      const res = await api.get(
        `/emergency?country=${encodeURIComponent(country)}`,
      );
      if (Array.isArray(res.data) && res.data.length > 0) {
        setEmergency(res.data[0]);
      }
    } catch (err) {
      console.error("Emergency fetch failed");
    }
  };

  useEffect(() => {
    if (
      destination?.coordinates?.lat &&
      mapRef.current &&
      !mapInstanceRef.current
    ) {
      const map = L.map(mapRef.current).setView(
        [destination.coordinates.lat, destination.coordinates.lng],
        6,
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
      L.marker([destination.coordinates.lat, destination.coordinates.lng])
        .addTo(map)
        .bindPopup(`${destination.name}, ${destination.country}`)
        .openPopup();
      mapInstanceRef.current = map;
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destination]);

  const fetchWeather = async (cityName) => {
    setWeatherLoading(true);
    try {
      const res = await api.get(`/weather?city=${cityName}`);
      setWeather(res.data);
    } catch (err) {
      console.error("Weather fetch failed");
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleWishlist = async () => {
    try {
      await api.post("/wishlist", { destinationId: id });
      setWishlisted(true);
      setWishlistMsg("Added to wishlist!");
    } catch (err) {
      setWishlistMsg(err.response?.data?.message || "Login to save wishlist");
    }
    setTimeout(() => setWishlistMsg(""), 3000);
  };

  const handlePlanTrip = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/trip-planner");
    }
  };

  const telHref = (num) => `tel:${String(num).replace(/[^\d+]/g, "")}`;

  if (loading)
    return (
      <div className={styles.center}>
        <p className={styles.mutedText}>Loading destination...</p>
      </div>
    );

  if (!destination)
    return (
      <div className={styles.center}>
        <p className={styles.mutedText}>Destination not found.</p>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/destinations")}
        >
          ← Back
        </button>
      </div>
    );

  const gallery = destination.photos?.length
    ? destination.photos
    : destination.image
      ? [destination.image]
      : [];

  return (
    <div className={styles.page}>
      {/* PHOTO HERO */}
      <div className={styles.hero}>
        {destination.image ? (
          <img
            src={destination.image}
            alt={destination.name}
            className={styles.heroImg}
          />
        ) : (
          <div className={styles.heroFallback}>
            <span className={styles.heroEmoji}>
              {CLIMATE_ICON[destination.climate] || <FaPlane />}
            </span>
          </div>
        )}
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>{destination.name}</h1>
          <p className={styles.heroCountry}>
            <FaMapMarkerAlt className={styles.inlineIcon} />{" "}
            {destination.country}
          </p>
          <span className={styles.climateBadge}>
            <span className={styles.badgeIcon}>
              {CLIMATE_ICON[destination.climate]}
            </span>
            {destination.climate}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/destinations")}
        >
          ← Back to destinations
        </button>

        {wishlistMsg && <div className={styles.wishlistMsg}>{wishlistMsg}</div>}

        <div className={styles.grid}>
          {/* ============ LEFT — the story, then the practical info ============ */}
          <div className={styles.mainInfo}>
            {/* 1. What is this place? */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>About {destination.name}</h2>
              <p className={styles.description}>{destination.description}</p>
            </div>

            {/* 2. What does it look like? */}
            {gallery.length > 1 && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Gallery</h2>
                <div className={styles.galleryMain}>
                  <img
                    src={gallery[activePhoto]}
                    alt={`${destination.name} ${activePhoto + 1}`}
                    className={styles.galleryImg}
                  />
                </div>
                <div className={styles.galleryThumbs}>
                  {gallery.map((photo, i) => (
                    <img
                      key={photo}
                      src={photo}
                      alt={`thumbnail ${i + 1}`}
                      className={`${styles.thumb} ${i === activePhoto ? styles.thumbActive : ""}`}
                      onClick={() => setActivePhoto(i)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 3. When should I go? — travel info + live weather together */}
            <div className={styles.duoGrid}>
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Travel Info</h2>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>
                      <FaCalendarAlt />
                    </span>
                    <div>
                      <p className={styles.infoLabel}>Best time to visit</p>
                      <p className={styles.infoValue}>{destination.bestTime}</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>
                      <FaCloudSun />
                    </span>
                    <div>
                      <p className={styles.infoLabel}>Climate</p>
                      <p className={styles.infoValue}>{destination.climate}</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>
                      <FaGlobe />
                    </span>
                    <div>
                      <p className={styles.infoLabel}>Country</p>
                      <p className={styles.infoValue}>{destination.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Current Weather</h2>
                {weatherLoading && (
                  <p className={styles.smallMuted}>Loading weather...</p>
                )}
                {weather && (
                  <div className={styles.weatherBox}>
                    <div className={styles.weatherTop}>
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt={weather.description}
                        className={styles.weatherIcon}
                      />
                      <div>
                        <p className={styles.weatherTemp}>
                          {weather.temperature}°C
                        </p>
                        <p className={styles.weatherDesc}>
                          {weather.description}
                        </p>
                      </div>
                    </div>
                    <div className={styles.weatherDetails}>
                      <div className={styles.weatherItem}>
                        <span className={styles.weatherLabel}>Feels like</span>
                        <span className={styles.weatherValue}>
                          {weather.feelsLike}°C
                        </span>
                      </div>
                      <div className={styles.weatherItem}>
                        <span className={styles.weatherLabel}>Humidity</span>
                        <span className={styles.weatherValue}>
                          {weather.humidity}%
                        </span>
                      </div>
                      <div className={styles.weatherItem}>
                        <span className={styles.weatherLabel}>Wind</span>
                        <span className={styles.weatherValue}>
                          {weather.windSpeed} m/s
                        </span>
                      </div>
                      <div className={styles.weatherItem}>
                        <span className={styles.weatherLabel}>Country</span>
                        <span className={styles.weatherValue}>
                          {weather.country}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {!weatherLoading && !weather && (
                  <p className={styles.smallMuted}>Weather unavailable</p>
                )}
              </div>
            </div>

            {/* 4. Where is it? — full-width map */}
            {destination.coordinates?.lat && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Location</h2>
                <div ref={mapRef} className={styles.map} />
                <p className={styles.mapCoords}>
                  <FaThumbtack className={styles.inlineIcon} />{" "}
                  {destination.coordinates.lat}°, {destination.coordinates.lng}°
                </p>
              </div>
            )}
          </div>

          {/* ============ RIGHT — actions, safety, tips ============ */}
          <div className={styles.sidebar}>
            {/* Actions */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Ready to go?</h2>
              <p className={styles.sidebarText}>
                Start planning your trip to {destination.name} today.
              </p>
              <button className={styles.planBtn} onClick={handlePlanTrip}>
                <FaMapMarkedAlt className={styles.inlineIcon} /> Plan a trip
                here
              </button>
              <button
                className={
                  wishlisted ? styles.wishlistedBtn : styles.wishlistBtn
                }
                onClick={handleWishlist}
                disabled={wishlisted}
              >
                {wishlisted ? (
                  <>
                    <FaHeart className={styles.inlineIcon} /> Saved to wishlist
                  </>
                ) : (
                  <>
                    <FaRegHeart className={styles.inlineIcon} /> Save to
                    wishlist
                  </>
                )}
              </button>
            </div>

            {/* Safety */}
            {emergency && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <FaExclamationTriangle className={styles.inlineIcon} />{" "}
                  Emergency — {emergency.country}
                </h2>
                <div className={styles.emergencyGrid}>
                  <a
                    href={telHref(emergency.policeNo)}
                    className={styles.emergencyItem}
                  >
                    <span className={styles.emergencyIcon}>
                      <FaShieldAlt />
                    </span>
                    <div>
                      <p className={styles.emergencyLabel}>Police</p>
                      <p className={styles.emergencyValue}>
                        {emergency.policeNo}
                      </p>
                    </div>
                  </a>
                  <a
                    href={telHref(emergency.ambulanceNo)}
                    className={styles.emergencyItem}
                  >
                    <span className={styles.emergencyIcon}>
                      <FaAmbulance />
                    </span>
                    <div>
                      <p className={styles.emergencyLabel}>Ambulance</p>
                      <p className={styles.emergencyValue}>
                        {emergency.ambulanceNo}
                      </p>
                    </div>
                  </a>
                  <a
                    href={telHref(emergency.fireNo)}
                    className={styles.emergencyItem}
                  >
                    <span className={styles.emergencyIcon}>
                      <FaFire />
                    </span>
                    <div>
                      <p className={styles.emergencyLabel}>Fire</p>
                      <p className={styles.emergencyValue}>
                        {emergency.fireNo}
                      </p>
                    </div>
                  </a>
                  <a
                    href={telHref(emergency.touristHelpline)}
                    className={styles.emergencyItem}
                  >
                    <span className={styles.emergencyIcon}>
                      <FaPlane />
                    </span>
                    <div>
                      <p className={styles.emergencyLabel}>Tourist Helpline</p>
                      <p className={styles.emergencyValue}>
                        {emergency.touristHelpline}
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Quick tips</h2>
              <ul className={styles.tipsList}>
                <li className={styles.tip}>
                  <FaCalendarAlt className={styles.inlineIcon} /> Visit during{" "}
                  {destination.bestTime} for best weather
                </li>
                <li className={styles.tip}>
                  <FaCloudSun className={styles.inlineIcon} /> Climate is{" "}
                  {destination.climate?.toLowerCase()}
                </li>
                <li className={styles.tip}>
                  <FaWallet className={styles.inlineIcon} /> Set a budget before
                  booking
                </li>
                <li className={styles.tip}>
                  <FaClipboardList className={styles.inlineIcon} /> Prepare a
                  packing checklist
                </li>
                <li className={styles.tip}>
                  <FaExclamationTriangle className={styles.inlineIcon} /> Save
                  local emergency numbers
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetail;
