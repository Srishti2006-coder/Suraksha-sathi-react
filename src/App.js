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

import BottomNav from "./components/BottomNav";

function App() {

  const [page, setPage] = useState("welcome");

  return (

    <div>

      {/* WELCOME */}
      {page === "welcome" && (
        <Welcome setPage={setPage}/>
      )}

      {/* LOGIN */}
      {page === "login" && (
        <Login setPage={setPage}/>
      )}

      {/* SIGNUP */}
      {page === "signup" && (
        <Signup setPage={setPage}/>
      )}

      {/* HOME */}
      {page === "home" && (
        <>
          <Home />
          <BottomNav setPage={setPage}/>
        </>
      )}

      {/* ROUTE FINDER */}
      {page === "route" && (
        <>
          <RouteFinder />
          <BottomNav setPage={setPage}/>
        </>
      )}

      {/* COMMUNITY */}
      {page === "community" && (
        <>
          <Community />
          <BottomNav setPage={setPage}/>
        </>
      )}

      {/* ABOUT */}
      {page === "about" && (
        <>
          <About />
          <BottomNav setPage={setPage}/>
        </>
      )}

      {/* SOS */}
      {page === "sos" && (
        <>
          <SOS />
          <BottomNav setPage={setPage}/>
        </>
      )}

      {/* REPORT */}
      {page === "report" && (
        <>
          <Report />
          <BottomNav setPage={setPage}/>
        </>
      )}

    </div>

  );
}

export default App;