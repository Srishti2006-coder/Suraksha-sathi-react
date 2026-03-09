import React, { useState, useEffect } from "react";

const Home = ({ setPage }) => {
  const [currentTip, setCurrentTip] = useState(0);
  const tips = [
    "Always share your live location with a trusted contact.",
    "Avoid poorly lit streets at night — prefer main roads.",
    "Keep emergency numbers and SOS tools easily accessible.",
  ];

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Full-bleed Home background */}
      <section className="bg-gradient-to-br from-indigo-600 to-pink-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* HERO */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div data-aos="fade-right">
              <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">
                Empowering Everyone with Smart, Safe Routes — Anytime, Anywhere.
              </h1>
              <p className="mt-4 text-indigo-100 max-w-xl">
                Find safer paths home using community reports, live safety insights
                and instant SOS alerts. Built by students — for a safer tomorrow.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setPage("route")}
                  className="inline-flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-md font-semibold shadow hover:scale-105 transform transition"
                >
                  Find Safe Routes
                </button>
                <button
                  onClick={() => setPage("report")}
                  className="inline-flex items-center gap-2 border border-white/70 px-4 py-2 rounded-md font-medium hover:bg-white/10 transition"
                >
                  Report an Unsafe Area
                </button>
              </div>
              <div className="mt-6 flex gap-6 text-sm opacity-90">
                <div>
                  🌍 <strong>120+</strong> safe reports
                </div>
                <div>🚺 Designed by women</div>
                <div>🕒 Real-time updates</div>
              </div>
            </div>

            <div data-aos="zoom-in" className="relative">
              {/* Mini map placeholder */}
            <div className="relative rounded-lg shadow-lg bg-white/20 h-[260px] min-h-[180px] overflow-hidden">
  
  <img
    src="https://www.thestatesman.com/wp-content/uploads/2020/04/googl_ED-1024x683.jpg"
    alt="Interactive Map"
    className="w-full h-full object-cover"
  />

  <img
    src="https://www.thestatesman.com/wp-content/uploads/2020/04/googl_ED-1024x683.jpg"
    alt="location pin"
    className="w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  />

</div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="bg-white/10 px-6 py-10 mt-10 rounded-lg">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4" data-aos="fade-up">
                What we offer
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  className="p-4 bg-white/90 rounded-lg transform transition hover:scale-105"
                  data-aos="fade-up"
                  data-aos-delay="50"
                >
                  <div className="text-2xl">🗺️</div>
                  <h3 className="font-semibold mt-2 text-indigo-900">Safe Route Finder</h3>
                  <p className="text-sm text-slate-700 mt-1">
                    Suggests safest routes using real-time safety data.
                  </p>
                </div>
                <div
                  className="p-4 bg-white/90 rounded-lg transform transition hover:scale-105"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className="text-2xl">🚨</div>
                  <h3 className="font-semibold mt-2 text-indigo-900">SOS Panic Button</h3>
                  <p className="text-sm text-slate-700 mt-1">
                    Instantly notifies emergency contacts.
                  </p>
                </div>
                <div
                  className="p-4 bg-white/90 rounded-lg transform transition hover:scale-105"
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  <div className="text-2xl">💬</div>
                  <h3 className="font-semibold mt-2 text-indigo-900">Community Reports</h3>
                  <p className="text-sm text-slate-700 mt-1">
                    Share and view safety alerts near you.
                  </p>
                </div>
                <div
                  className="p-4 bg-white/90 rounded-lg transform transition hover:scale-105"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="text-2xl">🔒</div>
                  <h3 className="font-semibold mt-2 text-indigo-900">Privacy First</h3>
                  <p className="text-sm text-slate-700 mt-1">
                    Your data is always secure and encrypted.
                  </p>
                </div>
              </div>

              {/* Why + Stats */}
              <div className="mt-8 grid lg:grid-cols-2 gap-6 items-center">
                <div data-aos="fade-right">
                  <h3 className="text-lg font-semibold text-white">
                    Why Safety Matters
                  </h3>
                  <p className="mt-3 text-indigo-100">
                    Everyone deserves to move freely without fear. Safe Route
                    Finder is built by students who believe technology can make our
                    streets safer — one route at a time.
                  </p>
                  <ul className="mt-4 text-sm text-indigo-100 space-y-2">
                    <li>🌍 120+ safe reports logged</li>
                    <li>🚺 Designed by women</li>
                    <li>🕒 Real-time updates and SOS alerts</li>
                  </ul>
                </div>
                <div data-aos="fade-left" className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-white/90 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-900">1,245</div>
                    <div className="text-xs text-slate-700">Safe Routes</div>
                  </div>
                  <div className="p-4 bg-white/90 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-900">320</div>
                    <div className="text-xs text-slate-700">Areas Reported</div>
                  </div>
                  <div className="p-4 bg-white/90 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-900">42</div>
                    <div className="text-xs text-slate-700">SOS Alerts</div>
                  </div>
                </div>
              </div>

              {/* Safety Tips Carousel */}
              <div className="mt-8" data-aos="fade-up">
                <h4 className="text-sm font-semibold text-white mb-3">
                  Safety Tips
                </h4>
                <div className="bg-white/90 rounded-lg p-4 relative overflow-hidden">
                  <div className="text-indigo-900 text-sm">{tips[currentTip]}</div>
                  <div className="absolute right-3 bottom-3 flex gap-2">
                    <button
                      onClick={prevTip}
                      className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs"
                    >
                      Prev
                    </button>
                    <button
                      onClick={nextTip}
                      className="px-2 py-1 rounded bg-indigo-600 text-white text-xs"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/90 rounded-lg" data-aos="fade-up">
                  <p className="text-sm text-indigo-900">
                    "This app helped me find a safer path home after work — it really
                    works!"
                  </p>
                  <div className="mt-2 text-xs font-medium text-indigo-900">
                    — Aditi, Student
                  </div>
                </div>
                <div
                  className="p-4 bg-white/90 rounded-lg"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <p className="text-sm text-indigo-900">
                    "Community reports made me aware of a risky spot near my college."
                  </p>
                  <div className="mt-2 text-xs font-medium text-indigo-900">— Meera</div>
                </div>
                <div
                  className="p-4 bg-white/90 rounded-lg"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <p className="text-sm text-indigo-900">
                    "SOS alert notified my family instantly — lifesaving feature."
                  </p>
                  <div className="mt-2 text-xs font-medium text-indigo-900">— Riya</div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setPage("route")}
                  className="inline-block bg-white text-indigo-600 px-4 py-2 rounded-md font-semibold mr-2"
                >
                  Find Safe Routes
                </button>
                <button
                  onClick={() => setPage("community")}
                  className="inline-block border border-white/80 px-4 py-2 rounded-md text-white"
                >
                  View Community Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;