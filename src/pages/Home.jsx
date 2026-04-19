/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";

const Home = ({ setPage }) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [counters, setCounters] = useState({ routes: 0, areas: 0, sos: 0 });
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  const tips = [
    "Always share your live location with a trusted contact.",
    "Avoid poorly lit streets at night — prefer main roads.",
    "Keep emergency numbers and SOS tools easily accessible.",
  ];

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % tips.length);
  const prevTip = () => setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);

  // Animate counters when stats section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return;
    const targets = { routes: 1245, areas: 320, sos: 42 };
    const duration = 1500;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounters({
        routes: Math.round(targets.routes * ease),
        areas: Math.round(targets.areas * ease),
        sos: Math.round(targets.sos * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [statsVisible]);

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 16l4.553 2.276A1 1 0 0021 24.382V8.618a1 1 0 00-.553-.894L15 5m0 18V5m0 0L9 7"/>
        </svg>
      ),
      color: "from-blue-50 to-indigo-50",
      accent: "text-blue-600",
      border: "border-blue-100",
      title: "Safe Route Finder",
      desc: "AI-powered routing that suggests the safest path using real-time community safety data.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
      ),
      color: "from-red-50 to-rose-50",
      accent: "text-rose-600",
      border: "border-rose-100",
      title: "SOS Panic Button",
      desc: "One tap instantly alerts your emergency contacts with your precise location.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
          <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
        </svg>
      ),
      color: "from-emerald-50 to-teal-50",
      accent: "text-emerald-600",
      border: "border-emerald-100",
      title: "Community Reports",
      desc: "Crowdsourced safety alerts so you always know what's happening near you.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      ),
      color: "from-violet-50 to-purple-50",
      accent: "text-violet-600",
      border: "border-violet-100",
      title: "Privacy First",
      desc: "End-to-end encryption keeps your data and location completely secure.",
    },
  ];

  const testimonials = [
    { quote: "This app helped me find a safer path home after work — it really works!", name: "Aditi", role: "Student, Delhi" },
    { quote: "Community reports made me aware of a risky spot near my college.", name: "Meera", role: "College Student" },
    { quote: "SOS alert notified my family instantly — lifesaving feature.", name: "Riya", role: "Working Professional" },
  ];

  const statsData = [
    {
      value: counters.routes.toLocaleString(),
      label: "Safe Routes",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 16l4.553 2.276A1 1 0 0021 24.382V8.618a1 1 0 00-.553-.894L15 5m0 18V5m0 0L9 7"/>
        </svg>
      ),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      value: counters.areas.toLocaleString(),
      label: "Areas Reported",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      ),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      value: counters.sos.toLocaleString(),
      label: "SOS Alerts Sent",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
      ),
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .ss-home * { font-family: 'DM Sans', sans-serif; }
        .ss-home h1, .ss-home h2, .ss-home h3 { font-family: 'Plus Jakarta Sans', sans-serif; }

        .ss-hero-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: #EFF6FF; color: #3B82F6; font-size: 12px;
          font-weight: 600; padding: 5px 12px; border-radius: 999px;
          border: 1px solid #BFDBFE; letter-spacing: 0.02em;
          margin-bottom: 20px;
        }
        .ss-hero-pill span { width: 6px; height: 6px; background: #3B82F6; border-radius: 50%; display: inline-block; animation: pulse-dot 2s infinite; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }

        .ss-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #2563EB; color: white; padding: 11px 24px;
          border-radius: 10px; font-weight: 600; font-size: 14px;
          border: none; cursor: pointer; transition: all .2s;
          box-shadow: 0 4px 14px rgba(37,99,235,.3);
        }
        .ss-btn-primary:hover { background: #1D4ED8; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,.4); }

        .ss-btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; color: #374151; padding: 11px 24px;
          border-radius: 10px; font-weight: 600; font-size: 14px;
          border: 1.5px solid #E5E7EB; cursor: pointer; transition: all .2s;
        }
        .ss-btn-secondary:hover { border-color: #9CA3AF; background: #F9FAFB; transform: translateY(-1px); }

        .ss-map-card {
          background: white; border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.04);
          overflow: hidden; border: 1px solid #F3F4F6; position: relative;
        }
        .ss-map-topbar {
          background: white; padding: 12px 16px; display: flex; align-items: center;
          gap: 8px; border-bottom: 1px solid #F3F4F6;
        }
        .ss-map-dot { width: 10px; height: 10px; border-radius: 50%; }

        .ss-feature-card {
          background: white; border-radius: 16px; padding: 28px 24px;
          border: 1.5px solid #F3F4F6; transition: all .25s;
          box-shadow: 0 2px 8px rgba(0,0,0,.04);
        }
        .ss-feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,.08); border-color: transparent; }

        .ss-icon-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
        }

        .ss-stat-card {
          background: white; border-radius: 16px; padding: 24px;
          border: 1.5px solid #F3F4F6; box-shadow: 0 2px 8px rgba(0,0,0,.04);
          display: flex; align-items: center; gap: 16px;
          transition: all .25s;
        }
        .ss-stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,.08); }
        .ss-stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .ss-tip-card { background: white; border-radius: 16px; padding: 24px; border: 1.5px solid #F3F4F6; box-shadow: 0 2px 8px rgba(0,0,0,.04); }

        .ss-testimonial {
          background: white; border-radius: 16px; padding: 24px;
          border: 1.5px solid #F3F4F6; box-shadow: 0 2px 8px rgba(0,0,0,.04);
          transition: all .25s;
        }
        .ss-testimonial:hover { box-shadow: 0 8px 24px rgba(0,0,0,.08); transform: translateY(-2px); }

        .ss-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: #6B7280; }
        .ss-badge-dot { width: 8px; height: 8px; border-radius: 50%; }

        .ss-section-label {
          font-size: 12px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: #2563EB; margin-bottom: 8px;
        }

        .ss-cta-bar {
          background: linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #2563EB 100%);
          border-radius: 24px; padding: 48px 40px; text-align: center;
          position: relative; overflow: hidden;
        }
        .ss-cta-bar::before {
          content: ''; position: absolute; top: -40px; right: -40px;
          width: 200px; height: 200px; border-radius: 50%;
          background: rgba(255,255,255,.05);
        }
        .ss-cta-bar::after {
          content: ''; position: absolute; bottom: -60px; left: -20px;
          width: 250px; height: 250px; border-radius: 50%;
          background: rgba(255,255,255,.04);
        }

        .ss-tip-nav { display: inline-flex; align-items: center; gap: 4px; }
        .ss-tip-dot { width: 6px; height: 6px; border-radius: 50%; background: #E5E7EB; transition: background .2s; }
        .ss-tip-dot.active { background: #2563EB; }

        .ss-why-icon { width: 40px; height: 40px; border-radius: 10px; background: #EFF6FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      `}</style>

      <div className="ss-home" style={{ background: "#FAFAFA", minHeight: "100vh" }}>

        {/* ── HERO ── */}
        <section style={{ background: "white", padding: "72px 0 80px", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>

              {/* Left */}
              <div>
                <div className="ss-hero-pill">
                  <span></span> Live Safety Data · 120+ Reports
                </div>
                <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.15, color: "#0F172A", margin: "0 0 20px" }}>
                  Empowering Everyone with{" "}
                  <span style={{ color: "#2563EB" }}>Smart, Safe Routes</span>{" "}
                  — Anytime, Anywhere.
                </h1>
                <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 480 }}>
                  Find safer paths home using community reports, live safety insights and instant SOS alerts. Built by students — for a safer tomorrow.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
                  <button className="ss-btn-primary" onClick={() => setPage("route")}>
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Find Safe Routes
                  </button>
                  <button className="ss-btn-secondary" onClick={() => setPage("report")}>
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 16, height: 16 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
                    </svg>
                    Report Unsafe Area
                  </button>
                </div>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  {[
                    { dot: "#2563EB", label: "120+ safe reports" },
                    { dot: "#10B981", label: "Designed by women" },
                    { dot: "#F59E0B", label: "Real-time updates" },
                  ].map((b) => (
                    <span className="ss-badge" key={b.label}>
                      <span className="ss-badge-dot" style={{ background: b.dot }}></span>
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Map card */}
              <div>
                <div className="ss-map-card">
                  <div className="ss-map-topbar">
                    <div className="ss-map-dot" style={{ background: "#FC5753" }}></div>
                    <div className="ss-map-dot" style={{ background: "#FDBC40" }}></div>
                    <div className="ss-map-dot" style={{ background: "#34C749" }}></div>
                    <div style={{ flex: 1, margin: "0 8px", background: "#F3F4F6", borderRadius: 6, padding: "5px 10px", fontSize: 12, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 6 }}>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 12, height: 12 }}>
                        <path strokeLinecap="round" d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 0v-.5M8 14v.5M2 8h-.5M14.5 8H14"/>
                      </svg>
                      suraksha-sathi.live
                    </div>
                  </div>
                  <div style={{ position: "relative", height: 280, overflow: "hidden" }}>
                    <img
                      src="https://www.thestatesman.com/wp-content/uploads/2020/04/googl_ED-1024x683.jpg"
                      alt="Interactive Map"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {/* Overlay pulse */}
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                      <div style={{ position: "relative", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ position: "absolute", width: 48, height: 48, borderRadius: "50%", background: "rgba(37,99,235,.2)", animation: "ping 1.5s infinite" }}></div>
                        <div style={{ width: 20, height: 20, background: "#2563EB", borderRadius: "50%", border: "3px solid white", boxShadow: "0 2px 8px rgba(37,99,235,.5)" }}></div>
                      </div>
                    </div>
                    {/* Live badge */}
                    <div style={{ position: "absolute", bottom: 16, left: 16, background: "white", borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 600, color: "#0F172A", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(0,0,0,.12)" }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", display: "inline-block" }}></span>
                      Live · 12 safe zones near you
                    </div>
                  </div>
                </div>
                <style>{`@keyframes ping { 0%{transform:scale(.8);opacity:1} 75%,100%{transform:scale(2);opacity:0} }`}</style>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ padding: "80px 0", background: "#FAFAFA" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="ss-section-label">Features</div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", margin: "0 0 12px" }}>
                Everything you need to stay safe
              </h2>
              <p style={{ color: "#64748B", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
                Our platform combines real-time data, community wisdom, and smart technology.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
              {features.map((f) => (
                <div className="ss-feature-card" key={f.title}>
                  <div className={`ss-icon-wrap bg-gradient-to-br ${f.color} ${f.accent} border ${f.border}`}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY SAFETY MATTERS + STATS ── */}
        <section style={{ padding: "80px 0", background: "white", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>

              {/* Left: Why Safety Matters */}
              <div>
                <div className="ss-section-label">Our Mission</div>
                <h2 style={{ fontSize: 30, fontWeight: 800, color: "#0F172A", margin: "0 0 16px" }}>
                  Why Safety Matters
                </h2>
                <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.75, margin: "0 0 32px" }}>
                  Everyone deserves to move freely without fear. Suraksha Sathi is built by students who believe technology can make our streets safer — one route at a time.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[
                    { icon: "🗺️", title: "Smart Routing", desc: "Avoid risky zones with AI-assisted path suggestions." },
                    { icon: "👥", title: "Community Power", desc: "Real reports from real people keeping each other safe." },
                    { icon: "⚡", title: "Instant Response", desc: "SOS alerts reach contacts in under 3 seconds." },
                  ].map((item) => (
                    <div key={item.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div className="ss-why-icon">
                        <span style={{ fontSize: 20 }}>{item.icon}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>{item.title}</div>
                        <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Stats + Tip */}
              <div ref={statsRef}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                  {statsData.map((s) => (
                    <div className="ss-stat-card" key={s.label}>
                      <div className={`ss-stat-icon ${s.bg} ${s.color}`}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
                        <div style={{ fontSize: 13, color: "#64748B", marginTop: 3 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Safety Tip */}
                <div className="ss-tip-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>💡</div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: ".06em" }}>Safety Tip</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: "0 0 16px", minHeight: 42 }}>
                    {tips[currentTip]}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {tips.map((_, i) => (
                        <div key={i} className={`ss-tip-dot ${i === currentTip ? "active" : ""}`} onClick={() => setCurrentTip(i)} style={{ cursor: "pointer" }}></div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={prevTip} style={{ padding: "5px 12px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "white", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" }}>← Prev</button>
                      <button onClick={nextTip} style={{ padding: "5px 12px", borderRadius: 8, border: "none", background: "#2563EB", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Next →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ padding: "80px 0", background: "#FAFAFA" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="ss-section-label">Testimonials</div>
              <h2 style={{ fontSize: 30, fontWeight: 800, color: "#0F172A", margin: 0 }}>Trusted by our community</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {testimonials.map((t) => (
                <div className="ss-testimonial" key={t.name}>
                  <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} viewBox="0 0 20 20" fill="#F59E0B" style={{ width: 16, height: 16 }}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, margin: "0 0 20px", fontStyle: "italic" }}>
                    "{t.quote}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #2563EB, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700 }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: "#94A3B8" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "80px 24px" }}>
          <div style={{ maxWidth: 840, margin: "0 auto" }}>
            <div className="ss-cta-bar">
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", margin: "0 0 12px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Your safety journey starts here.
                </h2>
                <p style={{ color: "rgba(255,255,255,.75)", fontSize: 15, margin: "0 0 32px" }}>
                  Join thousands using Suraksha Sathi to navigate safely every day.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                  <button
                    onClick={() => setPage("route")}
                    style={{ background: "white", color: "#1D4ED8", padding: "12px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", transition: "all .2s", boxShadow: "0 4px 16px rgba(0,0,0,.15)" }}
                    onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.target.style.transform = "none"}
                  >
                    Find Safe Routes
                  </button>
                  <button
                    onClick={() => setPage("community")}
                    style={{ background: "rgba(255,255,255,.15)", color: "white", padding: "12px 28px", borderRadius: 10, fontWeight: 600, fontSize: 14, border: "1.5px solid rgba(255,255,255,.4)", cursor: "pointer", backdropFilter: "blur(8px)", transition: "all .2s" }}
                    onMouseEnter={e => e.target.style.background = "rgba(255,255,255,.22)"}
                    onMouseLeave={e => e.target.style.background = "rgba(255,255,255,.15)"}
                  >
                    View Community Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;
