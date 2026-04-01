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
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", type: "error" });

  // Password validation states
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    symbol: false,
    match: false
  });

  // Validate password on change
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

  const isPasswordValid = () => {
    return validations.length && validations.uppercase && validations.lowercase && 
           validations.digit && validations.symbol;
  };

  const showSuccessModal = (title, message, redirect = false) => {
    setModalContent({ title, message, type: "success" });
    setShowModal(true);
    if (redirect) {
      setTimeout(() => {
        setShowModal(false);
        setPage("login");
      }, 1500);
    }
  };

  const showErrorModal = (title, message) => {
    setModalContent({ title, message, type: "error" });
    setShowModal(true);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Validation checks
    if (!name || !email || !phone || !password || !confirmPassword || !gender) {
      showErrorModal("❌ Validation Error", "Please fill all fields");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      showErrorModal("❌ Validation Error", "Contact must be exactly 10 digits");
      return;
    }

    if (!isPasswordValid()) {
      showErrorModal("❌ Weak Password", "Password does not meet requirements");
      return;
    }

    if (!validations.match) {
      showErrorModal("❌ Password Mismatch", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await authAPI.signup({ name, email, password, phone, gender });
      showSuccessModal("✅ Account Created!", "Redirecting to login...", true);
    } catch (err) {
      showErrorModal("❌ Signup Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-pink-500 flex flex-col">
      {/* Navbar */}
      <Navbar setPage={setPage} />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Glassmorphism Card */}
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-white text-center mb-4">Create Account</h2>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/80 text-white px-3 py-2 rounded-lg mb-3 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-3">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-white/90">Username</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-white/30 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 backdrop-blur-sm"
                  placeholder="e.g. sjainzz, user123"
                  required
                />
              </div>

              {/* Email and Phone side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/90">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full px-3 py-2 bg-white/30 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 backdrop-blur-sm"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90">Contact (10 digits)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    className="mt-1 w-full px-3 py-2 bg-white/30 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 backdrop-blur-sm"
                    placeholder="e.g. 9876543210"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-white/90">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-white/30 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 backdrop-blur-sm"
                  placeholder="Create a password"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-white/90">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-white/30 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 backdrop-blur-sm"
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              {/* Password Requirements */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${validations.length ? 'bg-green-500/80 text-white' : 'bg-white/20 text-white/60'}`}>
                  {validations.length ? '✅' : '⬜'} Min 8
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${validations.uppercase ? 'bg-green-500/80 text-white' : 'bg-white/20 text-white/60'}`}>
                  {validations.uppercase ? '✅' : '⬜'} Upper
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${validations.lowercase ? 'bg-green-500/80 text-white' : 'bg-white/20 text-white/60'}`}>
                  {validations.lowercase ? '✅' : '⬜'} Lower
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${validations.digit ? 'bg-green-500/80 text-white' : 'bg-white/20 text-white/60'}`}>
                  {validations.digit ? '✅' : '⬜'} Digit
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${validations.symbol ? 'bg-green-500/80 text-white' : 'bg-white/20 text-white/60'}`}>
                  {validations.symbol ? '✅' : '⬜'} Symbol
                </span>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-white/90">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-white/30 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white backdrop-blur-sm [&>option]:text-black"
                  required
                >
                  <option value="" className="text-black">Select gender</option>
                  <option value="female" className="text-black">Female</option>
                  <option value="male" className="text-black">Male</option>
                  <option value="other" className="text-black">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-indigo-600 font-semibold py-2 rounded-lg transition hover:bg-white/90 disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-4 text-xs text-white/80 text-center">
              Already have an account?{" "}
              <span
                onClick={() => setPage("login")}
                className="text-white cursor-pointer font-semibold hover:underline"
              >
                Login
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className={`relative rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center ${
            modalContent.type === "success" 
              ? "bg-green-500/90" 
              : "bg-red-500/90"
          } backdrop-blur-lg border border-white/20`}>
            <h3 className="text-xl font-bold text-white mb-2">{modalContent.title}</h3>
            <p className="text-white/90">{modalContent.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
