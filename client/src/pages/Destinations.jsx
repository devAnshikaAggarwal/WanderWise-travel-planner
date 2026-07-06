import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import styles from "../styles/Destinations.module.css";

const CLIMATES = [
  "All",
  "Tropical",
  "Mediterranean",
  "Temperate",
  "Arid",
  "Semi-arid",
  "Alpine",
  "Desert",
];

const CLIMATE_EMOJI = {
  Tropical: "🌴",
  Mediterranean: "🏛️",
  Temperate: "⛩️",
  Arid: "🏰",
  "Semi-arid": "🕌",
  Alpine: "🏔️",
  Desert: "🌆",
};

function Destinations() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [climateFilter, setClimateFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDestinations = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(
        `/destinations${query ? `?search=${query}` : ""}`,
      );
      setDestinations(res.data);
    } catch (err) {
      setError("Failed to load destinations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations(search);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDestinations(search);
  };

  // Client-side climate filtering on top of server search
  const visible =
    climateFilter === "All"
      ? destinations
      : destinations.filter((d) => d.climate === climateFilter);

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>Explore Destinations</h1>
        <p className={styles.subtitle}>
          Discover amazing places around the world
        </p>

        {/* SEARCH */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or country..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search 🔍
          </button>
          {search && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => {
                setSearch("");
                fetchDestinations("");
              }}
            >
              Clear ✕
            </button>
          )}
        </form>
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        {/* CLIMATE FILTER CHIPS */}
        {!loading && destinations.length > 0 && (
          <div className={styles.filterRow}>
            {CLIMATES.map((c) => (
              <button
                key={c}
                className={`${styles.chip} ${climateFilter === c ? styles.chipActive : ""}`}
                onClick={() => setClimateFilter(c)}
              >
                {c !== "All" && CLIMATE_EMOJI[c]} {c}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className={styles.center}>
            <p className={styles.loadingText}>Loading destinations...</p>
          </div>
        )}

        {error && <div className={styles.errorBox}>{error}</div>}

        {!loading && !error && visible.length === 0 && (
          <div className={styles.center}>
            <p className={styles.emptyText}>
              No destinations found{search ? ` for "${search}"` : ""}
              {climateFilter !== "All" ? ` in ${climateFilter} climate` : ""}
            </p>
            <button
              className={styles.searchButton}
              onClick={() => {
                setSearch("");
                setClimateFilter("All");
                fetchDestinations("");
              }}
            >
              Show all destinations
            </button>
          </div>
        )}

        {!loading && visible.length > 0 && (
          <>
            <p className={styles.resultCount}>
              {visible.length} destination{visible.length !== 1 ? "s" : ""}{" "}
              found
            </p>
            <div className={styles.grid}>
              {visible.map((dest) => (
                <div
                  key={dest._id}
                  className={styles.card}
                  onClick={() => navigate(`/destinations/${dest._id}`)}
                >
                  {/* Card image — real photo with emoji fallback */}
                  <div className={styles.cardImage}>
                    {dest.image ? (
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className={styles.cardImg}
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.classList.add(
                            styles.cardImageFallback,
                          );
                        }}
                      />
                    ) : (
                      <span className={styles.cardEmoji}>
                        {CLIMATE_EMOJI[dest.climate] || "✈️"}
                      </span>
                    )}
                    <span className={styles.climateBadge}>{dest.climate}</span>
                  </div>

                  {/* Card body */}
                  <div className={styles.cardBody}>
                    <div className={styles.cardTop}>
                      <h3 className={styles.cardName}>{dest.name}</h3>
                      <p className={styles.cardCountry}>📍 {dest.country}</p>
                    </div>

                    <p className={styles.cardDesc}>{dest.description}</p>

                    <div className={styles.cardFooter}>
                      <span className={styles.bestTime}>
                        🗓️ {dest.bestTime}
                      </span>
                      <button
                        className={styles.viewButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/destinations/${dest._id}`);
                        }}
                      >
                        View →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Destinations;
