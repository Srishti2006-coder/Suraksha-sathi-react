
const Home = () => {
  return (
    <section className="bg-gray-100 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4">

        {/* HERO */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
              Empowering Women with Smart, Safe Routes — Anytime, Anywhere.
            </h1>

            <p className="mt-4 text-gray-600 max-w-xl">
              Find safer paths home using community reports, live safety insights and instant SOS alerts.
            </p>

            <div className="mt-6 flex gap-3">
              <button className="bg-black text-white px-4 py-2 rounded-md font-semibold">
                Find Safe Routes
              </button>

              <button className="border border-gray-400 px-4 py-2 rounded-md">
                Report an Unsafe Area
              </button>
            </div>

            <div className="mt-6 flex gap-6 text-sm text-gray-500">
              <div>120+ safe reports</div>
              <div>Designed by women</div>
              <div>Real-time updates</div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-white rounded-lg shadow-md h-64 flex items-center justify-center text-gray-400">
            Mini Map Here
          </div>

        </div>

        {/* FEATURES */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "Safe Route Finder",
            "SOS Panic Button",
            "Community Reports",
            "Privacy First"
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-gray-800">{item}</h3>
              <p className="text-sm text-gray-500 mt-2">
                Clean, secure and reliable solution for women’s safety.
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Home;