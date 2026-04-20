/* eslint-disable */
import { useState } from "react";
import { authAPI, setAuthData } from "../utils/api";
import Navbar from "../components/Navbar";

const Login = ({ setPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", type: "error" });

  const showSuccessModal = (title, message) => {
    setModalContent({ title, message, type: "success" });
    setShowModal(true);
    setTimeout(() => { setShowModal(false); setPage("home"); }, 1500);
  };

  const showErrorModal = (title, message) => {
    setModalContent({ title, message, type: "error" });
    setShowModal(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    try {
      const data = await authAPI.login({ email, password });
      setAuthData(data.token, data.user);
      showSuccessModal("Login Successful!", "Redirecting to home...");
    } catch (err) {
      showErrorModal("Login Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .login-page * { box-sizing: border-box; }
        .login-page { font-family: 'DM Sans', sans-serif; }

        /* Same animated blobs as homepage */
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.07)} 66%{transform:translate(-25px,20px) scale(.95)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,25px) scale(1.05)} 66%{transform:translate(25px,-15px) scale(.97)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-30px) scale(1.08)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalPop { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }

        .login-blob { position:absolute; border-radius:50%; filter:blur(70px); pointer-events:none; }

        .login-card {
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1.5px solid rgba(255,255,255,0.95);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(37,99,235,.1), 0 4px 24px rgba(0,0,0,.06);
          padding: 40px 36px;
          animation: fadeUp .5s ease both;
        }

        .login-input {
          width: 100%; padding: 11px 14px;
          background: white;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px; font-size: 14px;
          color: #0F172A; outline: none;
          transition: all .2s; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 1px 4px rgba(0,0,0,.04);
        }
        .login-input::placeholder { color: #94A3B8; }
        .login-input:focus { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,.12); }

        .login-label {
          display: block; font-size: 13px; font-weight: 600;
          color: #374151; margin-bottom: 6px;
          font-family: 'DM Sans', sans-serif;
        }

        .login-btn-primary {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #1d4ed8, #2563EB);
          color: white; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          transition: all .22s; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 16px rgba(37,99,235,.35);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .login-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,.45); }
        .login-btn-primary:disabled { opacity: .65; cursor: not-allowed; }

        .login-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
        .login-divider-line { flex: 1; height: 1px; background: #F1F5F9; }
        .login-divider-text { font-size: 12px; color: #94A3B8; font-weight: 500; }

        .pw-toggle {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #94A3B8;
          padding: 4px; transition: color .18s;
        }
        .pw-toggle:hover { color: #2563EB; }

        .trust-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #64748B; font-weight: 500;
        }
        .trust-dot { width: 7px; height: 7px; border-radius: 50%; }

        @keyframes spin { to{transform:rotate(360deg)} }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3); border-top-color: white; border-radius: 50%; animation: spin .7s linear infinite; }
      `}</style>

      <div className="login-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(155deg, #EFF6FF 0%, #F0FDF4 45%, #FDF4FF 100%)", position: "relative", overflow: "hidden" }}>

        {/* Animated blobs — same as homepage */}
        <div className="login-blob" style={{ width:500, height:500, background:"radial-gradient(circle,rgba(147,197,253,.55) 0%,transparent 68%)", top:-140, left:-100, animation:"blob1 13s ease-in-out infinite", opacity:.7 }}/>
        <div className="login-blob" style={{ width:420, height:420, background:"radial-gradient(circle,rgba(167,243,208,.5) 0%,transparent 68%)", top:80, right:-90, animation:"blob2 15s ease-in-out infinite", opacity:.65 }}/>
        <div className="login-blob" style={{ width:300, height:300, background:"radial-gradient(circle,rgba(216,180,254,.45) 0%,transparent 68%)", bottom:-60, left:"40%", animation:"blob3 11s ease-in-out infinite", opacity:.6 }}/>

        {/* Navbar */}
        <Navbar setPage={setPage} />

        {/* Center content */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 20px", position: "relative", zIndex: 1 }}>
          <div style={{ width: "100%", maxWidth: 420 }}>

            {/* Top label */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(37,99,235,.08)", color: "#2563EB", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(37,99,235,.2)", marginBottom: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563EB", display: "inline-block" }}></span>
                Secure Login
              </div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 28, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                Welcome back 👋
              </h1>
              <p style={{ fontSize: 14, color: "#64748B", margin: "6px 0 0" }}>Sign in to your Suraksha Sathi account</p>
            </div>

            {/* Card */}
            <div className="login-card">

              {/* Inline error */}
              {error && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13, padding: "10px 14px", borderRadius: 10, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                {/* Email */}
                <div style={{ marginBottom: 18 }}>
                  <label className="login-label">Email address</label>
                  <input className="login-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required/>
                </div>

                {/* Password */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label className="login-label" style={{ margin: 0 }}>Password</label>
                    <span style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, cursor: "pointer" }}>Forgot password?</span>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input className="login-input" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" style={{ paddingRight: 42 }} required/>
                    <button type="button" className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword
                        ? <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" style={{width:18,height:18}}><path d="M17.94 10C16.73 12.87 13.54 15 10 15s-6.73-2.13-7.94-5C3.27 7.13 6.46 5 10 5s6.73 2.13 7.94 5z"/><circle cx="10" cy="10" r="3"/></svg>
                        : <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" style={{width:18,height:18}}><path d="M17.94 10C16.73 12.87 13.54 15 10 15s-6.73-2.13-7.94-5C3.27 7.13 6.46 5 10 5s6.73 2.13 7.94 5z"/><circle cx="10" cy="10" r="3"/><path d="M3 3l14 14" strokeLinecap="round"/></svg>
                      }
                    </button>
                  </div>
                </div>

                <button className="login-btn-primary" type="submit" disabled={loading}>
                  {loading ? <><div className="spinner"/> Signing in...</> : <>Sign In <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10m-4-4l4 4-4 4"/></svg></>}
                </button>
              </form>

              <div className="login-divider">
                <div className="login-divider-line"/>
                <span className="login-divider-text">Don't have an account?</span>
                <div className="login-divider-line"/>
              </div>

              <button
                onClick={() => setPage("signup")}
                style={{ width: "100%", padding: "11px", background: "white", color: "#374151", border: "1.5px solid #E2E8F0", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .2s", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#93C5FD"; e.currentTarget.style.color="#2563EB"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="#E2E8F0"; e.currentTarget.style.color="#374151"; }}
              >
                Create a free account
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
              {[
                { dot: "#10B981", label: "SSL Encrypted" },
                { dot: "#2563EB", label: "Privacy First" },
                { dot: "#F59E0B", label: "No Ads" },
              ].map(b => (
                <span key={b.label} className="trust-badge">
                  <span className="trust-dot" style={{ background: b.dot }}/>
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(15,23,42,.45)", backdropFilter:"blur(6px)" }} onClick={() => setShowModal(false)}/>
          <div style={{ position:"relative", background:"white", borderRadius:20, padding:"32px 28px", width:"100%", maxWidth:340, textAlign:"center", boxShadow:"0 24px 64px rgba(0,0,0,.18)", animation:"modalPop .22s ease" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{modalContent.type === "success" ? "🎉" : "❌"}</div>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, fontWeight:800, color:"#0F172A", margin:"0 0 8px" }}>{modalContent.title}</h3>
            <p style={{ fontSize:14, color:"#64748B", margin:0, lineHeight:1.6 }}>{modalContent.message}</p>
            {modalContent.type === "error" && (
              <button onClick={() => setShowModal(false)} style={{ marginTop:20, padding:"9px 24px", background:"#2563EB", color:"white", border:"none", borderRadius:10, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Try Again</button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
