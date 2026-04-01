/* eslint-disable */
import { useState } from "react";
import { authAPI, setAuthData } from "../utils/api";
import Navbar from "../components/Navbar";

const Login = ({ setPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", type: "error" });

  const showSuccessModal = (title, message) => {
    setModalContent({ title, message, type: "success" });
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      setPage("home");
    }, 1500);
  };

  const showErrorModal = (title, message) => {
    setModalContent({ title, message, type: "error" });
    setShowModal(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const data = await authAPI.login({ email, password });
      setAuthData(data.token, data.user);
      showSuccessModal("✅ Login Successful!", "Redirecting to home...");
    } catch (err) {
      showErrorModal("❌ Login Failed", err.message);
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
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/80 text-white px-4 py-3 rounded-lg mb-4 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-3 bg-white/30 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 backdrop-blur-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-3 bg-white/30 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 backdrop-blur-sm"
                  placeholder="Enter password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-lg transition hover:bg-white/90 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-6 text-sm text-white/80 text-center">
              New here?{" "}
              <span
                onClick={() => setPage("signup")}
                className="text-white font-semibold cursor-pointer hover:underline"
              >
                Create your account
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

export default Login;
