import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaShieldAlt,
  FaAmbulance,
  FaFire,
  FaPlane,
} from "react-icons/fa";
import api from "../services/api";
import styles from "../styles/Emergency.module.css";

// Flag emojis for seeded countries — falls back to globe
const FLAGS = {
  India: "🇮🇳",
  Indonesia: "🇮🇩",
  Greece: "🇬🇷",
  Japan: "🇯🇵",
  Maldives: "🇲🇻",
  France: "🇫🇷",
  UAE: "🇦🇪",
  Thailand: "🇹🇭",
  Singapore: "🇸🇬",
  Turkey: "🇹🇷",
  Italy: "🇮🇹",
  "United Kingdom": "🇬🇧",
  Spain: "🇪🇸",
  Netherlands: "🇳🇱",
  "Czech Republic": "🇨🇿",
  Switzerland: "🇨🇭",
  USA: "🇺🇸",
  Brazil: "🇧🇷",
  Australia: "🇦🇺",
};

function Emergency() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCountry = searchParams.get("country") || "";
  const [contacts, setContacts] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [search, setSearch] = useState(initialCountry);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the full country list for the dropdown, then apply any URL filter
    const init = async () => {
      await fetchContacts();
      if (initialCountry) await fetchContacts(initialCountry);
    };
    init();
  }, []);

  const fetchContacts = async (query = "") => {
    setLoading(true);
    try {
      const res = await api.get(
        `/emergency${query ? `?country=${query}` : ""}`,
      );
      setContacts(res.data);
      // Remember the full country list from the first unfiltered load
      if (!query && res.data.length > 0) {
        setAllCountries(res.data.map((c) => c.country).sort());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchContacts(search);
  };

  const handleCountrySelect = (e) => {
    const value = e.target.value;
    setSearch(value === "all" ? "" : value);
    fetchContacts(value === "all" ? "" : value);
  };

  // tel: links need digits and + only
  const telHref = (num) => `tel:${String(num).replace(/[^\d+]/g, "")}`;

  const NUMBER_ROWS = [
    { key: "policeNo", label: "Police", icon: <FaShieldAlt /> },
    { key: "ambulanceNo", label: "Ambulance", icon: <FaAmbulance /> },
    { key: "fireNo", label: "Fire", icon: <FaFire /> },
    { key: "touristHelpline", label: "Tourist Helpline", icon: <FaPlane /> },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <FaExclamationTriangle className={styles.titleIcon} /> Emergency
          Contacts
        </h1>
        <p className={styles.subtitle}>
          Local emergency numbers for your destination
        </p>

        <div className={styles.controls}>
          {/* Quick country picker */}
          {allCountries.length > 0 && (
            <select
              className={styles.countrySelect}
              onChange={handleCountrySelect}
              value={allCountries.includes(search) ? search : "all"}
            >
              <option value="all">All countries</option>
              {allCountries.map((c) => (
                <option key={c} value={c}>
                  {FLAGS[c] || "🌍"} {c}
                </option>
              ))}
            </select>
          )}

          {/* Text search */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by country..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchBtn}>
              Search
            </button>
            {search && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => {
                  setSearch("");
                  fetchContacts("");
                }}
              >
                Clear
              </button>
            )}
          </form>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.warningBox}>
          <FaExclamationTriangle className={styles.inlineIcon} /> Always save
          local emergency numbers before traveling to a new country. Numbers
          below are tap-to-call on mobile.
        </div>

        {loading && (
          <p className={styles.loadingText}>Loading emergency contacts...</p>
        )}

        {!loading && contacts.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>No contacts found for "{search}"</p>
            <button
              className={styles.searchBtn}
              onClick={() => {
                setSearch("");
                fetchContacts("");
              }}
            >
              Show all countries
            </button>
          </div>
        )}

        <div className={styles.grid}>
          {contacts.map((contact) => (
            <div key={contact._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.flag}>
                  {FLAGS[contact.country] || "🌍"}
                </span>
                <h3 className={styles.country}>{contact.country}</h3>
              </div>
              <div className={styles.numbers}>
                {NUMBER_ROWS.map(({ key, label, icon }) => (
                  <a
                    key={key}
                    href={telHref(contact[key])}
                    className={styles.numberItem}
                    title={`Call ${label}`}
                  >
                    <span className={styles.numberIcon}>{icon}</span>
                    <div>
                      <p className={styles.numberLabel}>{label}</p>
                      <p className={styles.numberValue}>{contact[key]}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Emergency;
