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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:28,height:28}}>
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 16l4.553 2.276A1 1 0 0021 24.382V8.618a1 1 0 00-.553-.894L15 5m0 18V5m0 0L9 7"/>
        </svg>
      ),
      bgIcon: "linear-gradient(135deg,#DBEAFE,#EEF2FF)", accent: "#3B82F6",
      title: "Safe Route Finder",
      desc: "AI-powered routing that suggests the safest path using real-time community safety data.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:28,height:28}}>
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
      ),
      bgIcon: "linear-gradient(135deg,#FFE4E6,#FFF1F2)", accent: "#F43F5E",
      title: "SOS Panic Button",
      desc: "One tap instantly alerts your emergency contacts with your precise location.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:28,height:28}}>
          <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
        </svg>
      ),
      bgIcon: "linear-gradient(135deg,#D1FAE5,#ECFDF5)", accent: "#10B981",
      title: "Community Reports",
      desc: "Crowdsourced safety alerts so you always know what's happening near you.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:28,height:28}}>
          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      ),
      bgIcon: "linear-gradient(135deg,#EDE9FE,#F5F3FF)", accent: "#7C3AED",
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
      value: counters.routes.toLocaleString(), label: "Safe Routes",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:22,height:22}}><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 16l4.553 2.276A1 1 0 0021 24.382V8.618a1 1 0 00-.553-.894L15 5m0 18V5m0 0L9 7"/></svg>,
      color: "#3B82F6", bg: "rgba(59,130,246,.12)",
    },
    {
      value: counters.areas.toLocaleString(), label: "Areas Reported",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:22,height:22}}><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
      color: "#10B981", bg: "rgba(16,185,129,.12)",
    },
    {
      value: counters.sos.toLocaleString(), label: "SOS Alerts Sent",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:22,height:22}}><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
      color: "#F43F5E", bg: "rgba(244,63,94,.12)",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .ss-home * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .ss-home h1, .ss-home h2, .ss-home h3 { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.07)} 66%{transform:translate(-25px,20px) scale(.95)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,25px) scale(1.05)} 66%{transform:translate(25px,-15px) scale(.97)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-30px) scale(1.08)} }
        @keyframes ping { 0%{transform:scale(.8);opacity:1} 75%,100%{transform:scale(2.2);opacity:0} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        @keyframes float-card { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

        .ss-blob { position:absolute; border-radius:50%; filter:blur(65px); pointer-events:none; }

        .ss-hero-pill {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(59,130,246,.1); color:#2563EB; font-size:12px;
          font-weight:700; padding:6px 14px; border-radius:999px;
          border:1px solid rgba(59,130,246,.22); letter-spacing:.03em; margin-bottom:22px;
        }
        .ss-hero-pill .dot { width:6px; height:6px; background:#2563EB; border-radius:50%; animation:pulse-dot 2s infinite; }

        .ss-btn-primary {
          display:inline-flex; align-items:center; gap:8px;
          background:#2563EB; color:white; padding:12px 26px;
          border-radius:12px; font-weight:700; font-size:14px;
          border:none; cursor:pointer; transition:all .22s;
          box-shadow:0 4px 18px rgba(37,99,235,.35);
        }
        .ss-btn-primary:hover { background:#1D4ED8; transform:translateY(-2px); box-shadow:0 8px 26px rgba(37,99,235,.45); }

        .ss-btn-secondary {
          display:inline-flex; align-items:center; gap:8px;
          background:white; color:#374151; padding:12px 26px;
          border-radius:12px; font-weight:600; font-size:14px;
          border:1.5px solid #E2E8F0; cursor:pointer; transition:all .22s;
          box-shadow:0 2px 8px rgba(0,0,0,.05);
        }
        .ss-btn-secondary:hover { border-color:#93C5FD; background:#F0F7FF; transform:translateY(-2px); }

        .ss-map-card {
          background:white; border-radius:22px;
          box-shadow:0 24px 64px rgba(37,99,235,.14), 0 4px 16px rgba(0,0,0,.06);
          overflow:hidden; border:1px solid rgba(59,130,246,.1);
          animation:float-card 5.5s ease-in-out infinite;
        }
        .ss-map-topbar { background:white; padding:12px 16px; display:flex; align-items:center; gap:8px; border-bottom:1px solid #F1F5F9; }
        .ss-map-dot { width:11px; height:11px; border-radius:50%; }

        .ss-feature-card {
          background:rgba(255,255,255,.82); border-radius:18px; padding:28px 24px;
          border:1.5px solid rgba(255,255,255,.95); transition:all .28s;
          box-shadow:0 2px 16px rgba(0,0,0,.05); backdrop-filter:blur(14px);
        }
        .ss-feature-card:hover { transform:translateY(-6px); box-shadow:0 18px 44px rgba(0,0,0,.1); border-color:rgba(59,130,246,.18); }

        .ss-icon-wrap { width:54px; height:54px; border-radius:16px; display:flex; align-items:center; justify-content:center; margin-bottom:18px; }

        .ss-stat-card {
          background:rgba(255,255,255,.88); border-radius:16px; padding:22px 20px;
          border:1.5px solid rgba(255,255,255,.98); box-shadow:0 4px 18px rgba(0,0,0,.06);
          display:flex; align-items:center; gap:16px; transition:all .25s;
          backdrop-filter:blur(12px);
        }
        .ss-stat-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,.1); }
        .ss-stat-icon { width:48px; height:48px; border-radius:13px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

        .ss-tip-card { background:rgba(255,255,255,.9); border-radius:16px; padding:22px; border:1.5px solid rgba(255,255,255,.98); box-shadow:0 4px 16px rgba(0,0,0,.06); backdrop-filter:blur(12px); }
        .ss-tip-dot { width:6px; height:6px; border-radius:50%; background:#CBD5E1; cursor:pointer; transition:all .22s; }
        .ss-tip-dot.active { background:#2563EB; width:18px; border-radius:4px; }

        .ss-testimonial {
          background:rgba(255,255,255,.85); border-radius:18px; padding:26px;
          border:1.5px solid rgba(255,255,255,.98); box-shadow:0 4px 16px rgba(0,0,0,.06);
          transition:all .25s; backdrop-filter:blur(12px);
        }
        .ss-testimonial:hover { box-shadow:0 14px 36px rgba(0,0,0,.1); transform:translateY(-3px); }

        .ss-badge { display:inline-flex; align-items:center; gap:7px; font-size:13px; font-weight:500; color:#64748B; }
        .ss-badge-dot { width:8px; height:8px; border-radius:50%; }
        .ss-section-label { font-size:12px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#2563EB; margin-bottom:8px; }
        .ss-why-icon { width:42px; height:42px; border-radius:12px; background:linear-gradient(135deg,#DBEAFE,#EEF2FF); display:flex; align-items:center; justify-content:center; flex-shrink:0; }

        .ss-cta-bar {
          background:linear-gradient(135deg,#1E3A8A 0%,#1D4ED8 55%,#3B82F6 100%);
          border-radius:28px; padding:56px 48px; text-align:center;
          position:relative; overflow:hidden;
          box-shadow:0 20px 64px rgba(37,99,235,.38);
        }
        .ss-cta-bar::before { content:''; position:absolute; top:-60px; right:-60px; width:260px; height:260px; border-radius:50%; background:rgba(255,255,255,.06); }
        .ss-cta-bar::after { content:''; position:absolute; bottom:-80px; left:-30px; width:320px; height:320px; border-radius:50%; background:rgba(255,255,255,.04); }

        .ss-dot-grid { background-image:radial-gradient(circle,#94A3B8 1px,transparent 1px); background-size:28px 28px; }
      `}</style>

      <div className="ss-home" style={{ minHeight:"100vh", background:"#F8FAFF" }}>

        {/* ══ HERO ══ */}
        <section style={{ position:"relative", overflow:"hidden", padding:"80px 0 96px",
          background:"linear-gradient(155deg, #EFF6FF 0%, #F0FDF4 45%, #FDF4FF 100%)" }}>

          {/* Animated color blobs */}
          <div className="ss-blob" style={{ width:520, height:520, background:"radial-gradient(circle,rgba(147,197,253,.6) 0%,transparent 68%)", top:-140, left:-100, animation:"blob1 13s ease-in-out infinite", opacity:.7 }}/>
          <div className="ss-blob" style={{ width:420, height:420, background:"radial-gradient(circle,rgba(167,243,208,.55) 0%,transparent 68%)", top:60, right:-90, animation:"blob2 15s ease-in-out infinite", opacity:.65 }}/>
          <div className="ss-blob" style={{ width:320, height:320, background:"radial-gradient(circle,rgba(216,180,254,.5) 0%,transparent 68%)", bottom:-80, left:"38%", animation:"blob3 11s ease-in-out infinite", opacity:.6 }}/>
          {/* Subtle dot grid on top */}
          <div className="ss-dot-grid" style={{ position:"absolute", inset:0, opacity:.18, pointerEvents:"none" }}/>

          <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 24px", position:"relative", zIndex:1 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }}>

              {/* Left */}
              <div style={{ animation:"fadeSlideUp .55s ease both" }}>
                <div className="ss-hero-pill">
                  <span className="dot"></span> Live Safety Data · 120+ Reports
                </div>
                <h1 style={{ fontSize:46, fontWeight:800, lineHeight:1.13, color:"#0F172A", margin:"0 0 20px" }}>
                  Empowering Everyone with{" "}
                  <span style={{ background:"linear-gradient(90deg,#2563EB,#7C3AED)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                    Smart, Safe Routes
                  </span>{" "}
                  — Anytime, Anywhere.
                </h1>
                <p style={{ fontSize:16, color:"#64748B", lineHeight:1.72, margin:"0 0 34px", maxWidth:480 }}>
                  Find safer paths home using community reports, live safety insights and instant SOS alerts. Built by students — for a safer tomorrow.
                </p>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:36 }}>
                  <button className="ss-btn-primary" onClick={() => setPage("route")}>
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width:16,height:16}}>
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Find Safe Routes
                  </button>
                  <button className="ss-btn-secondary" onClick={() => setPage("report")}>
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:16,height:16}}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
                    </svg>
                    Report Unsafe Area
                  </button>
                </div>
                <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
                  {[{dot:"#2563EB",label:"120+ safe reports"},{dot:"#10B981",label:"Designed by women"},{dot:"#F59E0B",label:"Real-time updates"}].map((b) => (
                    <span className="ss-badge" key={b.label}>
                      <span className="ss-badge-dot" style={{background:b.dot}}></span>{b.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Map */}
              <div style={{ animation:"fadeSlideUp .65s .1s ease both" }}>
                <div className="ss-map-card">
                  <div className="ss-map-topbar">
                    <div className="ss-map-dot" style={{background:"#FC5753"}}></div>
                    <div className="ss-map-dot" style={{background:"#FDBC40"}}></div>
                    <div className="ss-map-dot" style={{background:"#34C749"}}></div>
                    <div style={{ flex:1, margin:"0 8px", background:"#F1F5F9", borderRadius:7, padding:"5px 10px", fontSize:12, color:"#94A3B8", display:"flex", alignItems:"center", gap:6 }}>
                      <svg viewBox="0 0 16 16" fill="none" stroke="#94A3B8" strokeWidth="1.5" style={{width:12,height:12}}>
                        <circle cx="8" cy="8" r="6"/><path strokeLinecap="round" d="M8 2v12M2 8h12"/>
                      </svg>
                      suraksha-sathi.live
                    </div>
                  </div>
                  <div style={{ position:"relative", height:290, overflow:"hidden" }}>
                    <img src="https://www.thestatesman.com/wp-content/uploads/2020/04/googl_ED-1024x683.jpg"
                      alt="Interactive Map" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 55%,rgba(16,185,129,.07))" }}/>
                    {/* Pulse */}
                    <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}>
                      <div style={{ position:"relative", width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <div style={{ position:"absolute", width:48, height:48, borderRadius:"50%", background:"rgba(37,99,235,.18)", animation:"ping 1.8s infinite" }}></div>
                        <div style={{ width:18, height:18, background:"#2563EB", borderRadius:"50%", border:"3px solid white", boxShadow:"0 3px 12px rgba(37,99,235,.55)" }}></div>
                      </div>
                    </div>
                    {/* Live badge */}
                    <div style={{ position:"absolute", bottom:16, left:16, background:"white", borderRadius:999, padding:"7px 14px", fontSize:12, fontWeight:600, color:"#0F172A", display:"flex", alignItems:"center", gap:7, boxShadow:"0 4px 14px rgba(0,0,0,.14)" }}>
                      <span style={{ width:7, height:7, borderRadius:"50%", background:"#10B981", display:"inline-block", boxShadow:"0 0 0 3px rgba(16,185,129,.2)" }}></span>
                      Live · 12 safe zones near you
                    </div>
                    {/* Alert chip */}
                    <div style={{ position:"absolute", top:14, right:14, background:"white", borderRadius:10, padding:"7px 12px", fontSize:11, fontWeight:600, color:"#F43F5E", display:"flex", alignItems:"center", gap:5, boxShadow:"0 4px 12px rgba(0,0,0,.1)" }}>
                      🚨 2 alerts nearby
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section style={{ position:"relative", padding:"88px 0", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,#F0F9FF 0%,#F0FDF4 100%)" }}/>
          <div className="ss-dot-grid" style={{ position:"absolute", inset:0, opacity:.28, pointerEvents:"none" }}/>
          {/* Accent blobs */}
          <div className="ss-blob" style={{ width:300, height:300, background:"radial-gradient(circle,rgba(147,197,253,.35) 0%,transparent 70%)", top:-60, right:80, animation:"blob2 14s ease-in-out infinite" }}/>
          <div className="ss-blob" style={{ width:240, height:240, background:"radial-gradient(circle,rgba(167,243,208,.3) 0%,transparent 70%)", bottom:-40, left:60, animation:"blob3 12s ease-in-out infinite" }}/>

          <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 24px", position:"relative", zIndex:1 }}>
            <div style={{ textAlign:"center", marginBottom:52 }}>
              <div className="ss-section-label">Features</div>
              <h2 style={{ fontSize:34, fontWeight:800, color:"#0F172A", margin:"0 0 12px" }}>Everything you need to stay safe</h2>
              <p style={{ color:"#64748B", fontSize:15, maxWidth:460, margin:"0 auto", lineHeight:1.6 }}>Real-time data, community wisdom, and smart technology — all in one place.</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:22 }}>
              {features.map((f) => (
                <div className="ss-feature-card" key={f.title}>
                  <div className="ss-icon-wrap" style={{ background:f.bgIcon, color:f.accent }}>{f.icon}</div>
                  <h3 style={{ fontSize:16, fontWeight:700, color:"#0F172A", margin:"0 0 8px" }}>{f.title}</h3>
                  <p style={{ fontSize:14, color:"#64748B", lineHeight:1.65, margin:0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ WHY + STATS ══ */}
        <section style={{ position:"relative", padding:"88px 0", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#FDF4FF 0%,#EFF6FF 50%,#F0FDF4 100%)" }}/>
          <div className="ss-blob" style={{ width:380, height:380, background:"radial-gradient(circle,rgba(167,243,208,.42) 0%,transparent 70%)", top:-90, right:60, animation:"blob1 13s ease-in-out infinite" }}/>
          <div className="ss-blob" style={{ width:300, height:300, background:"radial-gradient(circle,rgba(216,180,254,.38) 0%,transparent 70%)", bottom:-50, left:50, animation:"blob2 15s ease-in-out infinite" }}/>

          <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 24px", position:"relative", zIndex:1 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>
              <div>
                <div className="ss-section-label">Our Mission</div>
                <h2 style={{ fontSize:32, fontWeight:800, color:"#0F172A", margin:"0 0 16px" }}>Why Safety Matters</h2>
                <p style={{ fontSize:15, color:"#64748B", lineHeight:1.75, margin:"0 0 32px" }}>
                  Everyone deserves to move freely without fear. Suraksha Sathi is built by students who believe technology can make our streets safer — one route at a time.
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
                  {[
                    { icon:"🗺️", title:"Smart Routing", desc:"Avoid risky zones with AI-assisted path suggestions." },
                    { icon:"👥", title:"Community Power", desc:"Real reports from real people keeping each other safe." },
                    { icon:"⚡", title:"Instant Response", desc:"SOS alerts reach contacts in under 3 seconds." },
                  ].map((item) => (
                    <div key={item.title} style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                      <div className="ss-why-icon"><span style={{fontSize:20}}>{item.icon}</span></div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:"#0F172A", marginBottom:3 }}>{item.title}</div>
                        <div style={{ fontSize:13, color:"#64748B", lineHeight:1.55 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div ref={statsRef}>
                <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:20 }}>
                  {statsData.map((s) => (
                    <div className="ss-stat-card" key={s.label}>
                      <div className="ss-stat-icon" style={{ background:s.bg, color:s.color }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize:28, fontWeight:800, color:"#0F172A", lineHeight:1, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{s.value}</div>
                        <div style={{ fontSize:13, color:"#64748B", marginTop:3 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ss-tip-card">
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <div style={{ width:30, height:30, borderRadius:9, background:"#FEF3C7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>💡</div>
                    <span style={{ fontSize:11, fontWeight:700, color:"#92400E", textTransform:"uppercase", letterSpacing:".07em" }}>Safety Tip</span>
                  </div>
                  <p style={{ fontSize:14, color:"#374151", lineHeight:1.65, margin:"0 0 16px", minHeight:44 }}>{tips[currentTip]}</p>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      {tips.map((_,i) => (
                        <div key={i} className={`ss-tip-dot ${i===currentTip?"active":""}`} onClick={() => setCurrentTip(i)}/>
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={prevTip} style={{ padding:"5px 14px", borderRadius:8, border:"1.5px solid #E2E8F0", background:"white", fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer" }}>← Prev</button>
                      <button onClick={nextTip} style={{ padding:"5px 14px", borderRadius:8, border:"none", background:"#2563EB", color:"white", fontSize:12, fontWeight:600, cursor:"pointer" }}>Next →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ══ */}
        <section style={{ position:"relative", padding:"88px 0", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,#EFF6FF 0%,#F8FAFF 100%)" }}/>
          <div className="ss-dot-grid" style={{ position:"absolute", inset:0, opacity:.22, pointerEvents:"none" }}/>
          <div className="ss-blob" style={{ width:260, height:260, background:"radial-gradient(circle,rgba(147,197,253,.3) 0%,transparent 70%)", bottom:-30, right:80, animation:"blob3 13s ease-in-out infinite" }}/>

          <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 24px", position:"relative", zIndex:1 }}>
            <div style={{ textAlign:"center", marginBottom:52 }}>
              <div className="ss-section-label">Testimonials</div>
              <h2 style={{ fontSize:32, fontWeight:800, color:"#0F172A", margin:0 }}>Trusted by our community</h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:22 }}>
              {testimonials.map((t) => (
                <div className="ss-testimonial" key={t.name}>
                  <div style={{ display:"flex", gap:2, marginBottom:14 }}>
                    {[...Array(5)].map((_,i) => (
                      <svg key={i} viewBox="0 0 20 20" fill="#F59E0B" style={{width:15,height:15}}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <p style={{ fontSize:14, color:"#374151", lineHeight:1.68, margin:"0 0 20px", fontStyle:"italic" }}>"{t.quote}"</p>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#2563EB,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:14, fontWeight:700 }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#0F172A" }}>{t.name}</div>
                      <div style={{ fontSize:12, color:"#94A3B8" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section style={{ padding:"80px 24px", background:"#F8FAFF" }}>
          <div style={{ maxWidth:860, margin:"0 auto" }}>
            <div className="ss-cta-bar">
              <div style={{ position:"relative", zIndex:1 }}>
                <h2 style={{ fontSize:34, fontWeight:800, color:"white", margin:"0 0 12px", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  Your safety journey starts here.
                </h2>
                <p style={{ color:"rgba(255,255,255,.78)", fontSize:15, margin:"0 0 34px", lineHeight:1.6 }}>
                  Join thousands using Suraksha Sathi to navigate safely every day.
                </p>
                <div style={{ display:"flex", justifyContent:"center", gap:14, flexWrap:"wrap" }}>
                  <button onClick={() => setPage("route")}
                    style={{ background:"white", color:"#1D4ED8", padding:"13px 30px", borderRadius:12, fontWeight:700, fontSize:14, border:"none", cursor:"pointer", boxShadow:"0 4px 18px rgba(0,0,0,.18)", transition:"all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.22)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,.18)"; }}>
                    Find Safe Routes
                  </button>
                  <button onClick={() => setPage("community")}
                    style={{ background:"rgba(255,255,255,.14)", color:"white", padding:"13px 30px", borderRadius:12, fontWeight:600, fontSize:14, border:"1.5px solid rgba(255,255,255,.35)", cursor:"pointer", backdropFilter:"blur(10px)", transition:"all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,.24)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.14)"; }}>
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
