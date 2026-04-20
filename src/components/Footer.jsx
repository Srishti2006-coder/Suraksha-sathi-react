/* eslint-disable */
import React from "react";

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .ss-footer * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

        .ss-footer-link {
          font-size: 13.5px; color: rgba(255,255,255,0.55);
          cursor: pointer; transition: color .18s;
          background: none; border: none; padding: 0;
          text-align: left; display: block;
          font-family: 'DM Sans', sans-serif;
        }
        .ss-footer-link:hover { color: rgba(255,255,255,0.95); }

        .ss-footer-col-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: .09em;
          text-transform: uppercase; color: rgba(255,255,255,0.35);
          margin-bottom: 14px;
        }

        .ss-social-btn {
          width: 34px; height: 34px; border-radius: 9px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s; font-size: 14px;
        }
        .ss-social-btn:hover { background: rgba(255,255,255,0.16); transform: translateY(-2px); }

        .ss-bottom-btn {
          color: rgba(255,255,255,0.35); font-size: 12.5px; cursor: pointer;
          transition: color .18s; background: none; border: none; padding: 0;
          font-family: 'DM Sans', sans-serif;
        }
        .ss-bottom-btn:hover { color: rgba(255,255,255,0.7); }
      `}</style>

      <footer className="ss-footer" style={{
        background: "linear-gradient(135deg, #1a237e 0%, #1e3a8a 40%, #1d4ed8 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle purple glow blob for depth */}
        <div style={{ position: "absolute", top: -60, right: -40, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)", pointerEvents: "none" }}/>
        {/* Shimmer top line */}
        <div style={{ height: 2, background: "linear-gradient(90deg, #60A5FA, #A78BFA 50%, #34D399 100%)", opacity: 0.7 }}/>

        {/* ── Main content — compact 4-col grid ── */}
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "36px 24px 28px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 1fr", gap: 32, alignItems: "start" }}>

            {/* Col 1 — Brand (compact) */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
                  🛡️
                </div>
                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 800, color: "white" }}>Suraksha Sathi</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>Every Journey Deserves Safety</div>
                </div>
              </div>

              <p style={{ fontSize: 13, color: "rgba(255,255,255,.45)", lineHeight: 1.65, margin: "0 0 16px", maxWidth: 240 }}>
                Empowering safe mobility for women using community reports, live insights and SOS alerts.
              </p>

              <div style={{ display: "flex", gap: 7 }}>
                {["𝕏", "📸", "💼", "⚙️"].map((s) => (
                  <div key={s} className="ss-social-btn">{s}</div>
                ))}
              </div>
            </div>

            {/* Col 2 — Quick Links */}
            <div>
              <div className="ss-footer-col-title">Quick Links</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Home", "Route Finder", "Community", "About"].map((l) => (
                  <button key={l} className="ss-footer-link">{l}</button>
                ))}
              </div>
            </div>

            {/* Col 3 — Resources */}
            <div>
              <div className="ss-footer-col-title">Resources</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["OpenStreetMap", "OSRM Routing", "Privacy & Terms"].map((l) => (
                  <button key={l} className="ss-footer-link">{l}</button>
                ))}
              </div>
            </div>

            {/* Col 4 — Contact (lean) */}
            <div>
              <div className="ss-footer-col-title">Contact</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>✉️</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,.55)" }}>hello@surakshasathi.com</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>📞</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,.55)" }}>+91 12345 67890</span>
                </div>
                {/* SOS micro-callout */}
                <div style={{ marginTop: 4, background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 10, padding: "9px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#FCA5A5", marginBottom: 2 }}>🚨 Emergency SOS</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.38)", lineHeight: 1.5 }}>One tap to alert your emergency contacts.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.3)" }}>
              © 2026 <span style={{ color: "rgba(255,255,255,.55)", fontWeight: 600 }}>Suraksha Sathi</span>. All rights reserved.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <button className="ss-bottom-btn">Privacy Policy</button>
              <button className="ss-bottom-btn">Terms of Use</button>
              <span style={{ fontSize: 12.5, color: "rgba(255,255,255,.3)", display: "flex", alignItems: "center", gap: 4 }}>
                Made with <span style={{ color: "#F87171" }}>❤</span> in India
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
