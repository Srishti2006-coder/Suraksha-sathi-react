import { useState } from "react";
import { isLoggedIn, getCurrentUser, clearAuthData } from "../utils/api";

const Navbar = ({ setPage, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = getCurrentUser();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    clearAuthData();
    setShowLogoutModal(false);
    setPage("home");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div onClick={() => setPage("home")} className="cursor-pointer">
            <div className="text-xl font-bold">Suraksha Sathi</div>
            <div className="text-xs opacity-90">Because Every Journey Deserves Safety</div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-5 items-center">
            <button onClick={() => setPage("home")} className="px-3 py-1 rounded hover:bg-white/10 transition">
              Home
            </button>
            <button onClick={() => setPage("route")} className="px-3 py-1 rounded hover:bg-white/10 transition">
              Route Finder
            </button>
            <button onClick={() => setPage("community")} className="px-3 py-1 rounded hover:bg-white/10 transition">
              Community
            </button>
            <button onClick={() => setPage("about")} className="px-3 py-1 rounded hover:bg-white/10 transition">
              About
            </button>
          </div>

          {/* Right Buttons */}
          <div className="flex gap-3 items-center">
            {/* SOS Button */}
            <button
              onClick={() => setPage("sos")}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold shadow-md transition hover:scale-105"
            >
              SOS
            </button>

            {/* Report Button */}
            <button
              onClick={() => setPage("report")}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold shadow-md transition hover:scale-105"
            >
              Report
            </button>

            {/* Auth Buttons - Show Profile/Logout when logged in, Login/Signup when logged out */}
            {loggedIn ? (
              <>
                <button
                  onClick={() => setPage("profile")}
                  className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg font-semibold transition hover:bg-white/20"
                >
                  {user?.name || "Profile"}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg font-semibold transition hover:bg-white/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setPage("login")}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold shadow-md transition hover:scale-105"
                >
                  Login
                </button>
                <button
                  onClick={() => setPage("signup")}
                  className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg font-semibold shadow-md transition hover:scale-105"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl ml-2">
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-indigo-600 px-4 pb-4 space-y-3">
            <button onClick={() => { setPage("home"); setMenuOpen(false); }} className="block w-full text-left">
              Home
            </button>
            <button onClick={() => { setPage("route"); setMenuOpen(false); }} className="block w-full text-left">
              Route Finder
            </button>
            <button onClick={() => { setPage("community"); setMenuOpen(false); }} className="block w-full text-left">
              Community
            </button>
            <button onClick={() => { setPage("about"); setMenuOpen(false); }} className="block w-full text-left">
              About
            </button>
            <hr className="border-white/20" />
            {loggedIn ? (
              <>
                <button onClick={() => { setPage("profile"); setMenuOpen(false); }} className="block w-full text-left">
                  Profile ({user?.name})
                </button>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left text-red-200">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setPage("login"); setMenuOpen(false); }} className="block w-full text-left">
                  Login
                </button>
                <button onClick={() => { setPage("signup"); setMenuOpen(false); }} className="block w-full text-left">
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
