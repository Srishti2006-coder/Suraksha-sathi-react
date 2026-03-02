import { useState, useEffect } from "react";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Home from "./pages/Home";
import RouteFinder from "./pages/RouteFinder";
import Community from "./pages/Community";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SOS from "./pages/SOS";
import Report from "./pages/Report";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { isLoggedIn } from "./utils/api";

function App() {

  const [page, setPage] = useState("home");

  // Check auth on mount
  useEffect(() => {
    // Check if user is logged in, if so redirect to home
    if (isLoggedIn()) {
      setPage("home");
    }
  }, []);

  // Navbar kin pages pe show hoga (login & signup have their own navbar)
  const pagesWithNavbar = [
    "home",
    "route",
    "community",
    "about",
    "profile",
    "sos",
    "report",
    "welcome"
  ];

  const showNavbar = pagesWithNavbar.includes(page);

  // Footer bhi same pages pe show hoga
  const showFooter = pagesWithNavbar.includes(page);

  // Protected pages that require authentication
  const protectedPages = ["profile", "sos", "report"];

  const handlePageChange = (newPage) => {
    // Check if trying to access protected page without login
    if (protectedPages.includes(newPage) && !isLoggedIn()) {
      setPage("login");
      return;
    }
    setPage(newPage);
  };

  return (

    <div className="min-h-screen bg-slate-50 flex flex-col">


      {/* Navbar */}

      {showNavbar && (
        <Navbar setPage={handlePageChange} />
      )}



      {/* Pages */}

      <div className="flex-grow">

        {page === "welcome" &&
          <Welcome setPage={handlePageChange} />
        }

        {page === "login" &&
          <Login setPage={handlePageChange} />
        }

        {page === "signup" &&
          <Signup setPage={handlePageChange} />
        }

        {page === "home" &&
          <Home setPage={handlePageChange} />
        }

        {page === "route" &&
          <RouteFinder setPage={handlePageChange} />
        }

        {page === "community" &&
          <Community setPage={handlePageChange} />
        }

        {page === "about" &&
          <About setPage={handlePageChange} />
        }

        {page === "profile" &&
          <Profile setPage={handlePageChange} />
        }

        {page === "sos" &&
          <SOS setPage={handlePageChange} />
        }

        {page === "report" &&
          <Report setPage={handlePageChange} />
        }

      </div>



      {/* Footer */}

      {showFooter && (
        <Footer />
      )}


    </div>

  );

}

export default App;
