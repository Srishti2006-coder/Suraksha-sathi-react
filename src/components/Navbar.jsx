
import { useState } from "react";

const Navbar = ({ setPage }) => {

const [menuOpen,setMenuOpen] = useState(false);

return (

<header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg">

<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">


{/* Logo */}

<div
onClick={()=>setPage("home")}
className="cursor-pointer"
>

<div className="text-xl font-bold">

Suraksha Sathi

</div>

<div className="text-xs opacity-90">

Because Every Journey Deserves Safety

</div>

</div>



{/* Desktop Menu */}

<div className="hidden md:flex gap-5 items-center">

<button
onClick={()=>setPage("home")}
className="px-3 py-1 rounded hover:bg-white/10 transition"
>

Home

</button>


<button
onClick={()=>setPage("route")}
className="px-3 py-1 rounded hover:bg-white/10 transition"
>

Route Finder

</button>


<button
onClick={()=>setPage("community")}
className="px-3 py-1 rounded hover:bg-white/10 transition"
>

Community

</button>


<button
onClick={()=>setPage("about")}
className="px-3 py-1 rounded hover:bg-white/10 transition"
>

About

</button>


</div>



{/* Right Buttons */}

<div className="flex gap-3 items-center">


<button
onClick={()=>setPage("sos")}
className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold shadow-md transition hover:scale-105"
>

SOS

</button>



<button
onClick={()=>setPage("report")}
className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold shadow-md transition hover:scale-105"
>

Report

</button>



{/* Mobile Button */}

<button
onClick={()=>setMenuOpen(!menuOpen)}
className="md:hidden text-2xl ml-2"
>

☰

</button>


</div>


</div>



{/* Mobile Menu */}

{menuOpen && (

<div className="md:hidden bg-indigo-600 px-4 pb-4 space-y-3">

<button
onClick={()=>setPage("home")}
className="block w-full text-left"
>

Home

</button>


<button
onClick={()=>setPage("route")}
className="block w-full text-left"
>

Route Finder

</button>


<button
onClick={()=>setPage("community")}
className="block w-full text-left"
>

Community

</button>


<button
onClick={()=>setPage("about")}
className="block w-full text-left"
>

About

</button>


</div>

)}



</header>

);

};

export default Navbar;