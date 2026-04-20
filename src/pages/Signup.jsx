/* eslint-disable */
import { useState, useEffect } from "react";
import { authAPI } from "../utils/api";
import Navbar from "../components/Navbar";

const Signup = ({ setPage }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", type: "error" });

  const [validations, setValidations] = useState({
    length: false, uppercase: false, lowercase: false,
    digit: false, symbol: false, match: false
  });

  useEffect(() => {
    const pwd = password;
    setValidations({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      digit: /[0-9]/.test(pwd),
      symbol: /[@#$%&*!^]/.test(pwd),
      match: pwd === confirmPassword && pwd.length > 0
    });
  }, [password, confirmPassword]);

  const isPasswordValid = () =>
    validations.length && validations.uppercase && validations.lowercase &&
    validations.digit && validations.symbol;

  const showSuccessModal = (title, message, redirect = false) => {
    setModalContent({ title, message, type: "success" });
    setShowModal(true);
    if (redirect) setTimeout(() => { setShowModal(false); setPage("login"); }, 1500);
  };

  const showErrorModal = (title, message) => {
    setModalContent({ title, message, type: "error" });
    setShowModal(true);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !phone || !password || !confirmPassword || !gender) {
      showErrorModal("Validation Error", "Please fill all fields"); return;
    }
    if (!/^\d{10}$/.test(phone)) {
      showErrorModal("Validation Error", "Contact must be exactly 10 digits"); return;
    }
    if (!isPasswordValid()) {
      showErrorModal("Weak Password", "Password does not meet all requirements"); return;
    }
    if (!validations.match) {
      showErrorModal("Password Mismatch", "Passwords do not match"); return;
    }
    setLoading(true);
    try {
      await authAPI.signup({ name, email, password, phone, gender });
      showSuccessModal("Account Created!", "Redirecting to login...", true);
    } catch (err) {
      showErrorModal("Signup Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const pwChecks = [
    { key: "length", label: "Min 8 chars" },
    { key: "uppercase", label: "Uppercase" },
    { key: "lowercase", label: "Lowercase" },
    { key: "digit", label: "Number" },
    { key: "symbol", label: "Symbol" },
  ];

  const strengthCount = Object.values(validations).filter(Boolean).length;
  const strengthColors = ["#EF4444","#F97316","#EAB308","#22C55E","#10B981","#10B981"];
  const strengthLabels = ["","Weak","Fair","Good","Strong","Very Strong"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .signup-page * { box-sizing: border-box; }
        .signup-page { font-family: 'DM Sans', sans-serif; }

        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.07)} 66%{transform:translate(-25px,20px) scale(.95)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,25px) scale(1.05)} 66%{transform:translate(25px,-15px) scale(.97)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-30px) scale(1.08)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalPop { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
        @keyframes spin { to{transform:rotate(360deg)} }

        .signup-blob { position:absolute; border-radius:50%; filter:blur(70px); pointer-events:none; }

        .signup-card {
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1.5px solid rgba(255,255,255,0.95);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(37,99,235,.1), 0 4px 24px rgba(0,0,0,.06);
          padding: 36px 32px;
          animation: fadeUp .5s ease both;
        }

        .su-input {
          width: 100%; padding: 10px 14px;
          background: white; border: 1.5px solid #E2E8F0;
          border-radius: 11px; font-size: 14px; color: #0F172A;
          outline: none; transition: all .2s;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 1px 4px rgba(0,0,0,.04);
        }
        .su-input::placeholder { color: #94A3B8; }
        .su-input:focus { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,.1); }

        .su-select {
          width: 100%; padding: 10px 14px;
          background: white; border: 1.5px solid #E2E8F0;
          border-radius: 11px; font-size: 14px; color: #0F172A;
          outline: none; transition: all .2s; cursor: pointer;
          font-family: 'DM Sans', sans-serif; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
          padding-right: 36px;
          box-shadow: 0 1px 4px rgba(0,0,0,.04);
        }
        .su-select:focus { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,.1); }
        .su-select option { color: #0F172A; background: white; }

        .su-label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; font-family: 'DM Sans', sans-serif; }

        .su-field { margin-bottom: 16px; }

        .su-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #1d4ed8, #2563EB);
          color: white; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          transition: all .22s; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 16px rgba(37,99,235,.35);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .su-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,.45); }
        .su-btn:disabled { opacity: .65; cursor: not-allowed; }

        .pw-check-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600;
          transition: all .2s;
        }

        .pw-strength-bar {
          height: 4px; border-radius: 2px; transition: all .3s;
          background: #E2E8F0; overflow: hidden;
        }
        .pw-strength-fill { height: 100%; border-radius: 2px; transition: all .4s ease; }

        .pw-toggle {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #94A3B8; padding: 4px; transition: color .18s;
        }
        .pw-toggle:hover { color: #2563EB; }

        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3); border-top-color: white; border-radius: 50%; animation: spin .7s linear infinite; }
      `}</style>

      <div className="signup-page" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"linear-gradient(155deg, #EFF6FF 0%, #F0FDF4 45%, #FDF4FF 100%)", position:"relative", overflow:"hidden" }}>

        {/* Blobs */}
        <div className="signup-blob" style={{ width:500, height:500, background:"radial-gradient(circle,rgba(147,197,253,.55) 0%,transparent 68%)", top:-140, left:-100, animation:"blob1 13s ease-in-out infinite", opacity:.7 }}/>
        <div className="signup-blob" style={{ width:420, height:420, background:"radial-gradient(circle,rgba(167,243,208,.5) 0%,transparent 68%)", top:80, right:-90, animation:"blob2 15s ease-in-out infinite", opacity:.65 }}/>
        <div className="signup-blob" style={{ width:300, height:300, background:"radial-gradient(circle,rgba(216,180,254,.45) 0%,transparent 68%)", bottom:-60, left:"40%", animation:"blob3 11s ease-in-out infinite", opacity:.6 }}/>

        <Navbar setPage={setPage} />

        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 20px", position:"relative", zIndex:1 }}>
          <div style={{ width:"100%", maxWidth:480 }}>

            {/* Header */}
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(37,99,235,.08)", color:"#2563EB", fontSize:12, fontWeight:700, padding:"5px 14px", borderRadius:999, border:"1px solid rgba(37,99,235,.2)", marginBottom:10 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#2563EB", display:"inline-block" }}></span>
                Free Account
              </div>
              <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:26, fontWeight:800, color:"#0F172A", margin:0 }}>Create your account</h1>
              <p style={{ fontSize:13.5, color:"#64748B", margin:"6px 0 0" }}>Join Suraksha Sathi and travel safer every day</p>
            </div>

            {/* Card */}
            <div className="signup-card">

              {error && (
                <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", color:"#DC2626", fontSize:13, padding:"10px 14px", borderRadius:10, marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSignup}>

                {/* Username */}
                <div className="su-field">
                  <label className="su-label">Username</label>
                  <input className="su-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. sjainzz, user123" required/>
                </div>

                {/* Email + Phone */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                  <div>
                    <label className="su-label">Email</label>
                    <input className="su-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required/>
                  </div>
                  <div>
                    <label className="su-label">Contact (10 digits)</label>
                    <input className="su-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} placeholder="9876543210" required/>
                  </div>
                </div>

                {/* Password */}
                <div className="su-field">
                  <label className="su-label">Password</label>
                  <div style={{ position:"relative" }}>
                    <input className="su-input" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a strong password" style={{ paddingRight:42 }} required/>
                    <button type="button" className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" style={{width:17,height:17}}>
                        <path d="M17.94 10C16.73 12.87 13.54 15 10 15s-6.73-2.13-7.94-5C3.27 7.13 6.46 5 10 5s6.73 2.13 7.94 5z"/>
                        <circle cx="10" cy="10" r="3"/>
                        {!showPassword && <path d="M3 3l14 14" strokeLinecap="round"/>}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="su-field">
                  <label className="su-label">Confirm Password</label>
                  <div style={{ position:"relative" }}>
                    <input className="su-input" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" style={{ paddingRight:42 }} required/>
                    <button type="button" className="pw-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" style={{width:17,height:17}}>
                        <path d="M17.94 10C16.73 12.87 13.54 15 10 15s-6.73-2.13-7.94-5C3.27 7.13 6.46 5 10 5s6.73 2.13 7.94 5z"/>
                        <circle cx="10" cy="10" r="3"/>
                        {!showConfirmPassword && <path d="M3 3l14 14" strokeLinecap="round"/>}
                      </svg>
                    </button>
                  </div>
                  {/* Match indicator */}
                  {confirmPassword.length > 0 && (
                    <div style={{ fontSize:12, marginTop:5, color: validations.match ? "#10B981" : "#EF4444", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                      {validations.match ? "✓ Passwords match" : "✗ Passwords don't match"}
                    </div>
                  )}
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <div style={{ marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                      <span style={{ fontSize:12, color:"#64748B", fontWeight:600 }}>Password strength</span>
                      <span style={{ fontSize:12, fontWeight:700, color: strengthColors[strengthCount] }}>{strengthLabels[strengthCount]}</span>
                    </div>
                    <div style={{ display:"flex", gap:3 }}>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} style={{ flex:1, height:4, borderRadius:2, background: i <= strengthCount ? strengthColors[strengthCount] : "#E2E8F0", transition:"all .3s" }}/>
                      ))}
                    </div>
                  </div>
                )}

                {/* Password requirement chips */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
                  {pwChecks.map(({ key, label }) => (
                    <span key={key} className="pw-check-chip" style={{
                      background: validations[key] ? "rgba(16,185,129,.12)" : "#F8FAFC",
                      color: validations[key] ? "#059669" : "#94A3B8",
                      border: `1px solid ${validations[key] ? "rgba(16,185,129,.25)" : "#E2E8F0"}`
                    }}>
                      {validations[key]
                        ? <svg viewBox="0 0 12 12" fill="none" style={{width:10,height:10}}><path d="M2 6l3 3 5-5" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        : <span style={{ width:8, height:8, borderRadius:"50%", border:"1.5px solid #CBD5E1", display:"inline-block" }}/>
                      }
                      {label}
                    </span>
                  ))}
                </div>

                {/* Gender */}
                <div className="su-field">
                  <label className="su-label">Gender</label>
                  <select className="su-select" value={gender} onChange={e => setGender(e.target.value)} required>
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button className="su-btn" type="submit" disabled={loading}>
                  {loading ? <><div className="spinner"/> Creating account...</> : <>Create Account <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10m-4-4l4 4-4 4"/></svg></>}
                </button>
              </form>

              <p style={{ textAlign:"center", fontSize:13, color:"#64748B", margin:"18px 0 0" }}>
                Already have an account?{" "}
                <span onClick={() => setPage("login")} style={{ color:"#2563EB", fontWeight:700, cursor:"pointer" }}>
                  Sign in
                </span>
              </p>
            </div>

            {/* Trust row */}
            <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:18, flexWrap:"wrap" }}>
              {[{dot:"#10B981",label:"SSL Encrypted"},{dot:"#2563EB",label:"Privacy First"},{dot:"#F59E0B",label:"Free Forever"}].map(b => (
                <span key={b.label} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#64748B", fontWeight:500 }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:b.dot, display:"inline-block" }}/>
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
            <div style={{ fontSize:40, marginBottom:12 }}>{modalContent.type === "success" ? "🎉" : "❌"}</div>
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

export default Signup;
