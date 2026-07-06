import { Link, useLocation } from "react-router-dom";
import styles from "../styles/Breadcrumbs.module.css";

// Friendly labels for route segments
const LABELS = {
  destinations: "Destinations",
  dashboard: "My Trips",
  "trip-planner": "Trip Planner",
  itinerary: "Itinerary",
  budget: "Budget",
  checklist: "Checklist",
  wishlist: "Wishlist",
  emergency: "Emergency Contacts",
  converter: "Currency Converter",
  profile: "Profile",
  login: "Login",
  register: "Register",
};

// Detect MongoDB ObjectIds (24 hex chars) so we don't show raw IDs
const isMongoId = (segment) => /^[a-f0-9]{24}$/i.test(segment);

export default function Breadcrumbs() {
  const { pathname } = useLocation();

  // No breadcrumbs on the landing page
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  // Build crumb list, skipping raw IDs
  const crumbs = [];
  let pathSoFar = "";
  segments.forEach((seg) => {
    pathSoFar += `/${seg}`;
    if (isMongoId(seg)) return; // skip IDs like /budget/64f1a2...
    crumbs.push({
      label: LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
      path: pathSoFar,
    });
  });

  if (crumbs.length === 0) return null;

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <Link to="/" className={styles.crumbLink}>
        Home
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.path} className={styles.crumbGroup}>
          <span className={styles.separator}>›</span>
          {i === crumbs.length - 1 ? (
            <span className={styles.current}>{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className={styles.crumbLink}>
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
