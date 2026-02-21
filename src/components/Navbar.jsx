const Navbar = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Suraksha Sathi" className="w-10 h-10" />

          <div>
            <div className="font-semibold text-gray-800">
              Suraksha Sathi
            </div>
            <div className="text-sm text-gray-500">
              Because Every Journey Deserves Safety
            </div>
          </div>

          <nav className="hidden md:flex gap-4 ml-8 text-sm text-gray-600">
            <a href="#" className="hover:text-black">Home</a>
            <a href="#" className="hover:text-black">Route Finder</a>
            <a href="#" className="hover:text-black">Community</a>
            <a href="#" className="hover:text-black">About</a>
          </nav>
        </div>

        <div className="flex gap-3">
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
            SOS
          </button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg text-gray-700">
            Report Area
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;