const Navbar = ({ setPage }) => {
  return (

<header className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 shadow-md">

<div className="max-w-6xl mx-auto flex items-center justify-between">


{/* Left */}

<div className="flex items-center gap-4">

<div>

<div className="text-lg font-semibold">
Suraksha Sathi
</div>

<div className="text-sm opacity-90">
Because Every Journey Deserves Safety
</div>

</div>


{/* Menu */}

<div className="ml-8 hidden md:flex gap-4">

<button
onClick={() => setPage("home")}
className="text-sm px-3 py-1 rounded hover:bg-white/10"
>
Home
</button>

<button
onClick={() => setPage("route")}
className="text-sm px-3 py-1 rounded hover:bg-white/10"
>
Route Finder
</button>

<button
onClick={() => setPage("community")}
className="text-sm px-3 py-1 rounded hover:bg-white/10"
>
Community
</button>

<button
onClick={() => setPage("about")}
className="text-sm px-3 py-1 rounded hover:bg-white/10"
>
About
</button>

</div>

</div>


{/* Right */}

<div className="flex gap-3">

<button
onClick={() => setPage("sos")}
className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
>
SOS
</button>


<button
onClick={() => setPage("report")}
className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold"
>
Report Area
</button>

</div>


</div>

</header>

  );
};

export default Navbar;