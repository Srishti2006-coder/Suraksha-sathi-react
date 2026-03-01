import React, { useState, useEffect } from "react";

const RouteFinder = ({ setPage }) => {
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [routes, setRoutes] = useState([]);
  const [reportsCount, setReportsCount] = useState(0);
  const [feedList, setFeedList] = useState([]);

  // Sample routes data
  const sampleRoutes = [
    {
      id: 1,
      name: "Route 1 - Via Main Road",
      duration: "15 min",
      distance: "3.2 km",
      safetyScore: 9.2,
      description: "Well-lit main road with high foot traffic",
    },
    {
      id: 2,
      name: "Route 2 - Shortest",
      duration: "12 min",
      distance: "2.8 km",
      safetyScore: 7.5,
      description: "Some areas with low lighting",
    },
    {
      id: 3,
      name: "Route 3 - Safest",
      duration: "20 min",
      distance: "4.1 km",
      safetyScore: 9.8,
      description: "Full CCTV coverage and police patrol route",
    },
  ];

  // Sample community reports
  const sampleReports = [
    {
      id: 1,
      type: "unsafe",
      location: "Near City Park",
      time: "2 hours ago",
      description: "Poor lighting in the area",
    },
    {
      id: 2,
      type: "safe",
      location: "Main Market Road",
      time: "5 hours ago",
      description: "Well-lit and crowded area",
    },
    {
      id: 3,
      type: "unsafe",
      location: "Back Lane",
      time: "1 day ago",
      description: "Suspicious activity reported",
    },
  ];

  useEffect(() => {
    setRoutes(sampleRoutes);
    setReportsCount(sampleReports.length);
    setFeedList(sampleReports);
  }, []);

  const handleFindRoutes = () => {
    if (startInput && endInput) {
      setRoutes(sampleRoutes);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-4 px-4 pb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left: Map */}
        <div className="flex-1 rounded-lg overflow-hidden shadow-md bg-white p-4">
          {/* Map placeholder */}
          <div className="h-[500px] bg-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-slate-500">Interactive Map</p>
              <p className="text-xs text-slate-400 mt-2">
                Routes will be displayed here
              </p>
            </div>
          </div>
        </div>

        {/* Right: Panel */}
        <aside className="w-full md:w-96 lg:w-80 flex flex-col gap-4">
          {/* Input Panel */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <label className="block text-sm font-medium text-slate-600">
              Start
            </label>
            <div className="relative">
              <input
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                className="mt-2 w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Chitkara University, Punjab"
              />
            </div>
            <label className="block text-sm font-medium text-slate-600 mt-3">
              Destination
            </label>
            <div className="relative">
              <input
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
                className="mt-2 w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Elante Mall, Chandigarh"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleFindRoutes}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700"
              >
                Find Safe Routes
              </button>
              <button
                title="Center map"
                className="bg-white border px-3 py-2 rounded-md"
              >
                📍
              </button>
            </div>
          </div>

          {/* Routes Box */}
          <div className="bg-white p-4 rounded-lg shadow-md overflow-auto max-h-96">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Available routes</div>
              <div className="text-sm text-slate-500">Tap a route to select</div>
            </div>
            <div id="routesList" className="space-y-3">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="p-3 border rounded-lg hover:border-indigo-500 cursor-pointer transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm">{route.name}</div>
                    <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                      {route.safetyScore}/10
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {route.duration} • {route.distance}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {route.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Feed */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Realtime reports</div>
                <div className="font-semibold">Community Feed</div>
              </div>
              <div className="text-indigo-600 font-semibold">{reportsCount}</div>
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-700 max-h-40 overflow-auto">
              {feedList.map((report) => (
                <div
                  key={report.id}
                  className={`p-2 rounded ${
                    report.type === "unsafe" ? "bg-red-50" : "bg-green-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs ${
                        report.type === "unsafe" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {report.type === "unsafe" ? "⚠️" : "✅"}
                    </span>
                    <span className="font-medium">{report.location}</span>
                  </div>
                  <div className="text-xs text-slate-500">{report.time}</div>
                  <div className="text-xs text-slate-600">{report.description}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RouteFinder;
