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

const [page,setPage] = useState("welcome");


// Pages where navbar show hoga

const showNavbar =
page==="home" ||
page==="route" ||
page==="community" ||
page==="about" ||
page==="sos" ||
page==="report";

return (

<div className="min-h-screen bg-slate-50">


{/* Navbar */}

{showNavbar &&
<Navbar setPage={setPage}/>
}



{/* Pages */}


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


{page==="sos" &&
<SOS setPage={setPage}/>
}


{page==="report" &&
<Report setPage={setPage}/>
}



</div>

);

}

export default App;