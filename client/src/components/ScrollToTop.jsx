import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls the window to the top on every route change.
// Without this, SPA navigation keeps the previous scroll position,
// so clicking a footer link lands you at the bottom of the new page.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
