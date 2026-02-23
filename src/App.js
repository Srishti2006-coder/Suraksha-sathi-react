import { useState } from "react";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Home from "./pages/Home";
import RouteFinder from "./pages/RouteFinder";
import Community from "./pages/Community";
import About from "./pages/About";
import SOS from "./pages/SOS";
import Report from "./pages/Report";

import Navbar from "./components/Navbar";

function App() {

  const [page, setPage] = useState("welcome");

  return (

    <div className="min-h-screen bg-gray-100">

      {/* Welcome */}
      {page === "welcome" &&
        <Welcome setPage={setPage} />
      }

      {/* Login */}
      {page === "login" &&
        <Login setPage={setPage} />
      }

      {/* Signup */}
      {page === "signup" &&
        <Signup setPage={setPage} />
      }


      {/* Pages with Navbar */}

      {(page === "home" ||
        page === "route" ||
        page === "community" ||
        page === "about" ||
        page === "sos" ||
        page === "report") && (

        <>
        
          <Navbar setPage={setPage} />

          {page === "home" && <Home />}
          {page === "route" && <RouteFinder />}
          {page === "community" && <Community />}
          {page === "about" && <About />}
          {page === "sos" && <SOS />}
          {page === "report" && <Report />}

        </>
      )}

    </div>

  );
}

export default App;