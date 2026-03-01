
import { useState } from "react";

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

function App() {

const [page,setPage] = useState("welcome");


// Navbar kin pages pe show hoga

const pagesWithNavbar = [
"home",
"route",
"community",
"about",
"profile",
"sos",
"report"
];

const showNavbar = pagesWithNavbar.includes(page);


// Footer bhi same pages pe show hoga

const showFooter = pagesWithNavbar.includes(page);


return (

<div className="min-h-screen bg-slate-50 flex flex-col">


{/* Navbar */}

{showNavbar && (
<Navbar setPage={setPage}/>
)}



{/* Pages */}

<div className="flex-grow">

{page==="welcome" &&
<Welcome setPage={setPage}/>
}

{page==="login" &&
<Login setPage={setPage}/>
}

{page==="signup" &&
<Signup setPage={setPage}/>
}

{page==="home" &&
<Home setPage={setPage}/>
}

{page==="route" &&
<RouteFinder setPage={setPage}/>
}

{page==="community" &&
<Community setPage={setPage}/>
}

{page==="about" &&
<About setPage={setPage}/>
}

{page==="profile" &&
<Profile setPage={setPage}/>
}

{page==="sos" &&
<SOS setPage={setPage}/>
}

{page==="report" &&
<Report setPage={setPage}/>
}

</div>



{/* Footer */}

{showFooter && (
<Footer/>
)}


</div>

);

}

export default App;
