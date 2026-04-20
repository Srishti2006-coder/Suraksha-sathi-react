/* eslint-disable */
import { useState, useEffect } from "react";
import { isLoggedIn, getCurrentUser, clearAuthData } from "../utils/api";

const Navbar = ({ setPage, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = getCurrentUser();
  const loggedIn = isLoggedIn();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    clearAuthData();
    setShowLogoutModal(false);
    setPage("home");
  };

  const navLinks = [
    { label: "Home", page: "home" },
    { label: "Route Finder", page: "route" },
    { label: "Community", page: "community" },
    { label: "About", page: "about" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .ss-nav {
          position: sticky; top: 0; z-index: 50;
          font-family: 'DM Sans', sans-serif;
          /* Rich indigo-blue that matches the site's accent palette */
          background: linear-gradient(135deg, #1a237e 0%, #1e3a8a 40%, #1d4ed8 100%);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          transition: box-shadow 0.3s ease;
        }
        .ss-nav.scrolled {
          box-shadow: 0 4px 32px rgba(29,78,216,0.45);
        }

        /* Thin shimmer line at very top */
        .ss-nav::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #60A5FA, #A78BFA 50%, #34D399 100%);
          opacity: 0.8;
        }

        /* Subtle mesh overlay so it doesn't look flat */
        .ss-nav::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.18) 0%, transparent 60%);
        }

        .ss-logo-mark {
          width: 36px; height: 36px; border-radius: 11px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
          backdrop-filter: blur(8px);
        }
        .ss-logo-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800; font-size: 16px; color: white; line-height: 1.15;
        }
        .ss-logo-sub { font-size: 10px; color: rgba(255,255,255,0.5); font-weight: 500; letter-spacing: 0.01em; }

        .ss-nav-link {
          font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75);
          padding: 6px 14px; border-radius: 8px; cursor: pointer;
          border: none; background: transparent; transition: all 0.18s;
          white-space: nowrap; font-family: 'DM Sans', sans-serif;
          position: relative; z-index: 1;
        }
        .ss-nav-link:hover { color: white; background: rgba(255,255,255,0.12); }

        .ss-sos-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #EF4444;
          color: white; padding: 8px 18px; border-radius: 10px;
          font-size: 13px; font-weight: 700; border: none; cursor: pointer;
          transition: all .2s; letter-spacing: .04em;
          box-shadow: 0 3px 12px rgba(239,68,68,.5);
          font-family: 'DM Sans', sans-serif; position: relative; z-index: 1;
        }
        .ss-sos-btn:hover { background: #DC2626; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(239,68,68,.6); }

        .ss-report-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: white; padding: 8px 16px;
          border-radius: 10px; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all .2s;
          font-family: 'DM Sans', sans-serif; position: relative; z-index: 1;
          backdrop-filter: blur(8px);
        }
        .ss-report-btn:hover { background: rgba(255,255,255,0.22); transform: translateY(-1px); }

        .ss-profile-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          color: white; padding: 7px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s;
          font-family: 'DM Sans', sans-serif; position: relative; z-index: 1;
        }
        .ss-profile-btn:hover { background: rgba(255,255,255,0.2); }

        .ss-avatar {
          width: 24px; height: 24px; border-radius: 50%;
          background: white;
          display: flex; align-items: center; justify-content: center;
          color: #1d4ed8; font-size: 11px; font-weight: 800; flex-shrink: 0;
        }

        .ss-logout-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: rgba(255,255,255,0.6);
          padding: 7px 14px; border-radius: 10px; font-size: 13px; font-weight: 600;
          border: 1px solid rgba(255,255,255,0.12); cursor: pointer; transition: all .2s;
          font-family: 'DM Sans', sans-serif; position: relative; z-index: 1;
        }
        .ss-logout-btn:hover { color: #FCA5A5; border-color: rgba(239,68,68,.4); background: rgba(239,68,68,.1); }

        .ss-login-btn {
          display: inline-flex; align-items: center;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          color: white; padding: 7px 16px; border-radius: 10px;
          font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s;
          font-family: 'DM Sans', sans-serif; position: relative; z-index: 1;
        }
        .ss-login-btn:hover { background: rgba(255,255,255,0.2); }

        .ss-signup-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: white; color: #1d4ed8; padding: 7px 16px;
          border-radius: 10px; font-size: 13px; font-weight: 700;
          border: none; cursor: pointer; transition: all .2s;
          box-shadow: 0 2px 10px rgba(0,0,0,.15);
          font-family: 'DM Sans', sans-serif; position: relative; z-index: 1;
        }
        .ss-signup-btn:hover { background: #EFF6FF; transform: translateY(-1px); }

        .ss-divider-v {
          width: 1px; height: 24px;
          background: rgba(255,255,255,0.15);
          margin: 0 2px; position: relative; z-index: 1;
        }

        /* Hamburger */
        .ss-hamburger {
          display: flex; flex-direction: column; gap: 5px; padding: 8px;
          background: transparent; border: none; cursor: pointer;
          border-radius: 8px; transition: background .18s; position: relative; z-index: 1;
        }
        .ss-hamburger:hover { background: rgba(255,255,255,0.1); }
        .ss-hamburger span { display: block; width: 20px; height: 2px; background: rgba(255,255,255,0.8); border-radius: 2px; transition: all .25s; }
        .ss-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .ss-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .ss-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile menu — same gradient bg */
        .ss-mobile-menu {
          background: linear-gradient(180deg, #1e3a8a 0%, #1d4ed8 100%);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 14px 20px 20px;
          animation: mobileSlide .2s ease;
        }
        @keyframes mobileSlide { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }

        .ss-mobile-link {
          display: block; width: 100%; text-align: left;
          padding: 10px 14px; border-radius: 10px; border: none;
          background: transparent; font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.75); cursor: pointer; transition: all .18s;
          font-family: 'DM Sans', sans-serif;
        }
        .ss-mobile-link:hover { background: rgba(255,255,255,0.1); color: white; }

        /* Modal */
        @keyframes modalPop { from{opacity:0;transform:scale(.95) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .ss-modal-card { animation: modalPop .22s ease; }
      `}</style>

      <header className={`ss-nav ${scrolled ? "scrolled" : ""}`}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

            {/* Logo */}
            <div onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <div className="ss-logo-mark">🛡️</div>
              <div>
                <div className="ss-logo-text">Suraksha Sathi</div>
                <div className="ss-logo-sub">Every Journey Deserves Safety</div>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex" style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {navLinks.map((link) => (
                <button key={link.page} className="ss-nav-link" onClick={() => setPage(link.page)}>
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden md:flex" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button className="ss-sos-btn" onClick={() => setPage("sos")}>
                <svg viewBox="0 0 16 16" fill="currentColor" style={{ width: 12, height: 12 }}>
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.25a.75.75 0 01-1.5 0V5zm.75 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
                SOS
              </button>

              <div className="ss-divider-v"/>

              <button className="ss-report-btn" onClick={() => setPage("report")}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 13, height: 13 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v5m0 3h.01M3.5 13.5l1.2-2.8a6 6 0 119.6 0l1.2 2.8H3.5z"/>
                </svg>
                Report
              </button>

              <div className="ss-divider-v"/>

              {loggedIn ? (
                <>
                  <button className="ss-profile-btn" onClick={() => setPage("profile")}>
                    <div className="ss-avatar">{(user?.name || "U")[0].toUpperCase()}</div>
                    {user?.name || "Profile"}
                  </button>
                  <button className="ss-logout-btn" onClick={handleLogout}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 13, height: 13 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3m4 10l3-3-3-3m3 3H6"/>
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="ss-login-btn" onClick={() => setPage("login")}>Login</button>
                  <button className="ss-signup-btn" onClick={() => setPage("signup")}>
                    Sign Up
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10m-4-4l4 4-4 4"/>
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Hamburger */}
            <button className={`ss-hamburger md:hidden ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
              <span/><span/><span/>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="ss-mobile-menu md:hidden">
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 12 }}>
              {navLinks.map((link) => (
                <button key={link.page} className="ss-mobile-link" onClick={() => { setPage(link.page); setMenuOpen(false); }}>
                  {link.label}
                </button>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="ss-sos-btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setPage("sos"); setMenuOpen(false); }}>🚨 SOS</button>
                <button className="ss-report-btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setPage("report"); setMenuOpen(false); }}>⚠️ Report</button>
              </div>
              {loggedIn ? (
                <>
                  <button className="ss-profile-btn" style={{ justifyContent: "center" }} onClick={() => { setPage("profile"); setMenuOpen(false); }}>
                    <div className="ss-avatar">{(user?.name || "U")[0].toUpperCase()}</div>
                    {user?.name || "Profile"}
                  </button>
                  <button className="ss-logout-btn" style={{ justifyContent: "center" }} onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
                </>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="ss-login-btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setPage("login"); setMenuOpen(false); }}>Login</button>
                  <button className="ss-signup-btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setPage("signup"); setMenuOpen(false); }}>Sign Up</button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.55)", backdropFilter: "blur(6px)" }} onClick={() => setShowLogoutModal(false)}/>
          <div className="ss-modal-card" style={{ position: "relative", background: "white", borderRadius: 20, padding: 32, width: "100%", maxWidth: 360, boxShadow: "0 24px 80px rgba(0,0,0,.2)", border: "1px solid #F1F5F9" }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: "#FFF5F5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, fontSize: 24 }}>🚪</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 8px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Confirm Logout</h3>
            <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px", lineHeight: 1.65 }}>Are you sure you want to log out of Suraksha Sathi?</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowLogoutModal(false)}
                style={{ flex: 1, padding: "11px 0", borderRadius: 11, border: "1.5px solid #E2E8F0", background: "white", fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.background="#F8FAFC"}
                onMouseLeave={e => e.currentTarget.style.background="white"}>
                Cancel
              </button>
              <button onClick={confirmLogout}
                style={{ flex: 1, padding: "11px 0", borderRadius: 11, border: "none", background: "#EF4444", fontSize: 14, fontWeight: 700, color: "white", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 14px rgba(239,68,68,.3)" }}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
