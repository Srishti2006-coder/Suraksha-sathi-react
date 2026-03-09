import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = ({ setPage }) => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    msg: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", type: "success" });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setModalContent({ 
      title: "Message Sent!", 
      message: "We'll get back to you soon.", 
      type: "success" 
    });
    setShowModal(true);
    setContactForm({ name: "", email: "", msg: "" });
    setTimeout(() => setShowModal(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar setPage={setPage} />
      
      <div className="flex-grow max-w-6xl mx-auto mt-4 px-4 pb-8 w-full">
        <div className="grid gap-8">
          {/* 1. Hero Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg p-8">
            <div className="max-w-4xl">
              <span className="badge">About</span>
              <h2 className="text-2xl font-extrabold mt-3">
                Suraksha Sathi — Safer journeys for women
              </h2>
              <p className="mt-3 text-indigo-100">
                We combine community reports, live safety insights and instant SOS to help
                women choose safer routes. Simple, reliable and community-driven.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setPage("route")}
                  className="px-4 py-2 bg-white text-indigo-600 rounded-md font-semibold hover:bg-indigo-50 transition"
                >
                  Find Safe Routes
                </button>
                <button
                  onClick={() => setPage("community")}
                  className="px-4 py-2 border border-white/40 text-white rounded-md hover:bg-white/10 transition"
                >
                  View Reports
                </button>
              </div>
            </div>
          </div>

          {/* 2. Our Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-lg border shadow-sm bg-white">
              <h3 className="font-semibold text-indigo-700">Our Mission</h3>
              <p className="mt-2 text-sm text-slate-600">
                Help women travel confidently by providing route suggestions that prioritise
                safety using community and map data.
              </p>
              <ul className="mt-3 text-sm space-y-2 text-slate-600">
                <li>- Real-time community reporting</li>
                <li>- Safety scoring for routes</li>
                <li>- Easy SOS and help features</li>
              </ul>
            </div>

            <div className="p-6 rounded-lg border shadow-sm bg-white">
              <h3 className="font-semibold text-indigo-700">Our Vision</h3>
              <p className="mt-2 text-sm text-slate-600">
                A world where public spaces feel safe for everyone — starting with smarter,
                safer ways home.
              </p>
              <div className="mt-3 text-sm text-slate-600">
                <strong className="text-indigo-600">Long-term:</strong> integrate with
                local authorities and public lighting data.
              </div>
            </div>
          </div>

          {/* 3. Our Story */}
          <div className="p-6 rounded-lg bg-indigo-50">
            <h3 className="font-semibold text-indigo-800">Our Story</h3>
            <p className="mt-2 text-sm text-indigo-700">
              Suraksha Sathi began as a hackathon project: students who felt unsafe
              walking home wanted a simple tool to surface safer paths. We built a
              prototype, tested with peers and iterated based on real feedback from the
              community.
            </p>
            <div className="mt-3 text-sm text-slate-600">
              Judges praised the clarity and real-world utility — we focused on reliability
              and ease of reporting.
            </div>
          </div>

          {/* 4. Key Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-white shadow-sm text-center hover:shadow-md transition hover:-translate-y-1">
              <div className="text-3xl">Saf</div>
              <div className="font-semibold mt-3">Safe Routes</div>
              <div className="text-sm text-slate-600 mt-1">
                Route suggestions ranked by safety score.
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-white shadow-sm text-center hover:shadow-md transition hover:-translate-y-1">
              <div className="text-3xl">SOS</div>
              <div className="font-semibold mt-3">SOS Alerts</div>
              <div className="text-sm text-slate-600 mt-1">
                Quickly notify contacts and log location.
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-white shadow-sm text-center hover:shadow-md transition hover:-translate-y-1">
              <div className="text-3xl">Rep</div>
              <div className="font-semibold mt-3">Community Reports</div>
              <div className="text-sm text-slate-600 mt-1">
                Submit and view reported areas on the map.
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-white shadow-sm text-center hover:shadow-md transition hover:-translate-y-1">
              <div className="text-3xl">Sec</div>
              <div className="font-semibold mt-3">Privacy</div>
              <div className="text-sm text-slate-600 mt-1">
                We keep user data safe and minimal.
              </div>
            </div>
          </div>

          {/* 5. Meet the Team */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-indigo-700">Meet the Team</h3>
            <p className="text-sm text-slate-600 mt-2">
              Hackathon team behind Suraksha Sathi
            </p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  SJ
                </div>
                <div>
                  <div className="font-semibold">Shreya Janweja</div>
                  <div className="text-xs text-slate-500">Frontend</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                  SB
                </div>
                <div>
                  <div className="font-semibold">Srishti Bansal</div>
                  <div className="text-xs text-slate-500">UX / Research</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                  SJ
                </div>
                <div>
                  <div className="font-semibold">Sejal Jain</div>
                  <div className="text-xs text-slate-500">Backend</div>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Impact / Stats Section */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-500 text-white text-center">
              <div className="text-3xl font-extrabold">1,245</div>
              <div className="mt-2 text-sm">Safe Routes Suggested</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-pink-500 to-pink-400 text-white text-center">
              <div className="text-3xl font-extrabold">320</div>
              <div className="mt-2 text-sm">Areas Reported</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-400 text-white text-center">
              <div className="text-3xl font-extrabold">42</div>
              <div className="mt-2 text-sm">SOS Alerts</div>
            </div>
          </div>

          {/* 7. Contact or Join Us */}
          <div className="p-6 rounded-lg bg-white border shadow-sm">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h4 className="font-semibold text-indigo-700">Join us / Contact</h4>
                <p className="text-sm text-slate-600 mt-2">
                  Want to help, test or integrate? Drop a message — we will get back.
                </p>
                <div className="mt-4">
                  <a
                    href="mailto:hello@surakshasathi.example"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Email Us
                  </a>
                  <button className="ml-3 px-4 py-2 border rounded-md hover:bg-slate-50 transition">
                    Volunteer
                  </button>
                </div>
              </div>
              <form onSubmit={handleContactSubmit} className="p-4 bg-slate-50 rounded-md">
                <input
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  name="name"
                  placeholder="Your name"
                  className="w-full px-3 py-2 border rounded-md mb-2"
                  required
                />
                <input
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border rounded-md mb-2"
                  required
                />
                <textarea
                  value={contactForm.msg}
                  onChange={(e) => setContactForm({ ...contactForm, msg: e.target.value })}
                  name="msg"
                  rows="3"
                  placeholder="Message"
                  className="w-full px-3 py-2 border rounded-md mb-2"
                  required
                ></textarea>
                <div className="text-right">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative bg-green-500 rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center border border-white/20">
            <h3 className="text-xl font-bold text-white mb-2">{modalContent.title}</h3>
            <p className="text-white/90">{modalContent.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;

