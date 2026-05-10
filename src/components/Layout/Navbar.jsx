import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import profilePersonGirl from "../../assets/profile_person_girl.png";
import { clearAuthenticated, isAuthenticated } from "../../utils/auth";
import "./Navbar.css";
import edgeProLogo from "../../assets/edge_prologo.png";

const NAV_ITEMS = [
  { label: "الرئيسية", to: "/" },
  { label: "الخدمات", href: "#services-section" },
  { label: "لوحة التحكم", to: "/dashboard" },
  { label: "الأسئلة الشائعة", href: "#faq" },
  { label: "تواصل معنا", href: "#Footer" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => isAuthenticated());
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const hamburgerRef = useRef(null);

  /* ── Auth sync ─────────────────────────────────────────── */
  useEffect(() => {
    const syncAuth = () => setLoggedIn(isAuthenticated());
    syncAuth();
    window.addEventListener("authchange", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("authchange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  /* ── Scroll shadow ─────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Body lock when menu open ──────────────────────────── */
  useEffect(() => {
    document.body.classList.toggle("nav-locked", menuOpen);
    return () => document.body.classList.remove("nav-locked");
  }, [menuOpen]);

  /* ── Close on outside click ────────────────────────────── */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      const clickedInsidePanel = panelRef.current && panelRef.current.contains(e.target);
      const clickedHamburger = hamburgerRef.current && hamburgerRef.current.contains(e.target);
      if (!clickedInsidePanel && !clickedHamburger) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  /* ── Close on Escape ───────────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setMenuOpen(false);

  const handleLogout = () => {
    clearAuthenticated();
    setLoggedIn(false);
    close();
    navigate("/login");
  };

  return (
    <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`} dir="rtl">
      {/* ── Brand ─────────────────────────────────────────── */}
      <Link
  className="brand"
  to="/"
  aria-label="Real Estate Platform"
  onClick={close}
>
  <img
    src={edgeProLogo}
    alt="EDGE PRO logo"
    className="nav-logo-img"
  />

  {/* <div className="brand-text">
    <span className="brand-name">EDGE PRO</span>

    <span className="brand-sub">
      Interactive real estate services
    </span>
  </div> */}
</Link>

      {/* ── Desktop nav links (center) ─────────────────────── */}
      <nav className="nav-links" aria-label="Main navigation">
        {NAV_ITEMS.map((item) =>
          item.to ? (
            <NavLink
              key={item.label}
              className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ) : (
            <a key={item.label} className="nav-link" href={item.href}>
              {item.label}
            </a>
          )
        )}
      </nav>

      {/* ── Desktop right actions ──────────────────────────── */}
      <div className="nav-actions">
        <div className="user-chip">
          <img className="user-avatar" src={profilePersonGirl} alt="" aria-hidden="true" />
          <div className="user-info">
            <span className="user-name">{loggedIn ? "Asmaa" : "Guest"}</span>
            <span className="user-role">
              {loggedIn ? "Ready to manage" : "Browse freely"}
            </span>
          </div>
        </div>

        {loggedIn ? (
          <>
            <Link className="btn btn-ghost" to="/dashboard">Dashboard</Link>
            <button type="button" className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-ghost" to="/login">Login</Link>
            <Link className="btn btn-primary" to="/register">Register</Link>
          </>
        )}
      </div>

      {/* ── Hamburger ──────────────────────────────────────── */}
      <button
        type="button"
        ref={hamburgerRef}
        className={`hamburger ${menuOpen ? "is-open" : ""}`}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* ── Mobile drawer ──────────────────────────────────── */}
      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " is-open" : ""}`}
        ref={panelRef}
        aria-hidden={!menuOpen}
      >
        {/* User row at top of mobile menu */}
        <div className="mobile-user">
          <img className="user-avatar" src={profilePersonGirl} alt="" aria-hidden="true" />
          <div className="user-info">
            <span className="user-name">{loggedIn ? "Asmaa" : "Guest"}</span>
            <span className="user-role">
              {loggedIn ? "Ready to manage properties" : "Browse services quickly"}
            </span>
          </div>
        </div>

        <div className="mobile-divider" />

        {/* Nav links */}
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                className={({ isActive }) => `mobile-link${isActive ? " is-active" : ""}`}
                to={item.to}
                onClick={close}
              >
                {item.label}
              </NavLink>
            ) : (
              <a key={item.label} className="mobile-link" href={item.href} onClick={close}>
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="mobile-divider" />

        {/* Auth buttons */}
        <div className="mobile-auth">
          {loggedIn ? (
            <>
              <Link className="btn btn-ghost btn-full" to="/dashboard" onClick={close}>
                Dashboard
              </Link>
              <button type="button" className="btn btn-danger btn-full" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost btn-full" to="/login" onClick={close}>Login</Link>
              <Link className="btn btn-primary btn-full" to="/register" onClick={close}>Register</Link>
            </>
          )}
        </div>
      </div>

      {/* ── Backdrop ───────────────────────────────────────── */}
      {menuOpen && (
        <div className="mobile-backdrop" onClick={close} aria-hidden="true" />
      )}
    </header>
  );
}