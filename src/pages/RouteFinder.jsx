import React, { useState, useEffect } from "react";
import { routesAPI, safetyPointsAPI, reportsAPI, isLoggedIn } from "../utils/api";

const RouteFinder = ({ setPage }) => {
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [routes, setRoutes] = useState([]);
  const [safetyScore, setSafetyScore] = useState(null);
  const [reportsCount, setReportsCount] = useState(0);
  const [feedList, setFeedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [safetyPoints, setSafetyPoints] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load safety points
      const spData = await safetyPointsAPI.getAll();
      setSafetyPoints(spData.safetyPoints || []);
      
      // Load community reports
      const reportsData = await reportsAPI.getAll(0, 20);
      setReportsCount(reportsData.reports?.length || 0);
      setFeedList(reportsData.reports?.slice(0, 5).map(r => ({
        id: r._id,
        type: r.type,
        location: `Lat: ${r.lat?.toFixed(2)}, Lng: ${r.lng?.toFixed(2)}`,
        time: new Date(r.timestamp || r.createdAt).toLocaleDateString(),
        description: r.note
      })) || []);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const handleFindRoutes = async () => {
    if (!startInput || !endInput) {
      setError("Please enter start and end locations");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // In a real app, we'd use a routing service to get actual coordinates
      // For demo, we'll simulate coordinates based on input
      const mockCoordinates = [
        { lat: 30.7199 + Math.random() * 0.01, lng: 76.789 + Math.random() * 0.01 },
        { lat: 30.7219 + Math.random() * 0.01, lng: 76.791 + Math.random() * 0.01 },
        { lat: 30.7239 + Math.random() * 0.01, lng: 76.793 + Math.random() * 0.01 },
        { lat: 30.7259 + Math.random() * 0.01, lng: 76.795 + Math.random() * 0.01 }
      ];

      const scoreData = await routesAPI.calculateSafetyScore(mockCoordinates);
      setSafetyScore(scoreData.score);

      // Generate mock routes with safety scores
      setRoutes([
        {
          id: 1,
          name: "Route 1 - Via Main Road",
          duration: `${Math.floor(10 + Math.random() * 10)} min`,
          distance: `${(2 + Math.random() * 2).toFixed(1)} km`,
          safetyScore: Math.min(10, scoreData.score + Math.random()),
          description: "Well-lit main road with high foot traffic"
        },
        {
          id: 2,
          name: "Route 2 - Shortest",
          duration: `${Math.floor(8 + Math.random() * 8)} min`,
          distance: `${(1.5 + Math.random() * 1.5).toFixed(1)} km`,
          safetyScore: Math.max(1, scoreData.score - 1.5 + Math.random()),
          description: "Some areas with low lighting"
        },
        {
          id: 3,
          name: "Route 3 - Safest",
          duration: `${Math.floor(15 + Math.random() * 10)} min`,
          distance: `${(3 + Math.random() * 2).toFixed(1)} km`,
          safetyScore: Math.min(10, scoreData.score + 1 + Math.random()),
          description: "Full CCTV coverage and police patrol route"
        }
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSafetyColor = (score) => {
    if (score >= 8) return "text-green-600 bg-green-50";
    if (score >= 6) return "text-yellow-600 bg-yellow-50";
    if (score >= 4) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="max-w-6xl mx-auto mt-4 px-4 pb-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        {/* Left: Map and Routes */}
        <div className="flex-1">
          {/* Route Search */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                placeholder="Start location"
                className="flex-1 px-3 py-2 border rounded"
              />
              <input
                type="text"
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
                placeholder="End location"
                className="flex-1 px-3 py-2 border rounded"
              />
              <button
                onClick={handleFindRoutes}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Finding..." : "Find Routes"}
              </button>
            </div>

            {/* Safety Score Display */}
            {safetyScore !== null && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-500">Route Safety Score</div>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${getSafetyColor(safetyScore).split(' ')[0]}`}>
                    {safetyScore.toFixed(1)}/10
                  </span>
                  <span className="text-sm text-slate-500">
                    {safetyScore >= 8 ? "🟢 Very Safe" : 
                     safetyScore >= 6 ? "🟡 Moderate" : 
                     safetyScore >= 4 ? "🟠 Caution" : "🔴 Unsafe"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Map placeholder */}
          <div className="rounded-lg overflow-hidden shadow-md bg-white p-4 mb-4">
            <div className="h-[400px] bg-slate-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-slate-500">Interactive Map</p>
                <p className="text-xs text-slate-400 mt-2">
                  {safetyPoints.length} safety points loaded
                </p>
                <div className="mt-4 flex justify-center gap-4 text-xs">
                  <span>👮 {safetyPoints.filter(s => s.type === "police").length} Police</span>
                  <span>🏥 {safetyPoints.filter(s => s.type === "hospital").length} Hospitals</span>
                  <span>🛒 {safetyPoints.filter(s => s.type === "market" || s.type === "mall").length} Markets/Malls</span>
                </div>
              </div>
            </div>
          </div>

          {/* Routes List */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold mb-4">Available Routes</h3>
            {routes.length === 0 ? (
              <p className="text-slate-500 text-center py-4">Enter locations to find routes</p>
            ) : (
              <div className="space-y-3">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className="p-3 border rounded-lg hover:border-indigo-500 cursor-pointer transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm">{route.name}</div>
                      <div className={`text-xs font-semibold px-2 py-1 rounded ${getSafetyColor(route.safetyScore)}`}>
                        {route.safetyScore.toFixed(1)}/10
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
            )}
          </div>
        </div>

        {/* Right: Community Feed */}
        <aside className="md:w-80">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Realtime reports</div>
                <div className="font-semibold">Community Feed</div>
              </div>
              <div className="text-indigo-600 font-semibold">{reportsCount}</div>
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-700 max-h-80 overflow-auto">
              {feedList.map((report) => (
                <div
                  key={report.id}
                  className={`p-2 rounded ${
                    report.type === "harassment" || report.type === "assault" || report.type === "theft" || report.type === "suspicious"
                      ? "bg-red-50"
                      : "bg-green-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs ${
                        report.type === "harassment" || report.type === "assault" || report.type === "theft" || report.type === "suspicious"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {report.type === "harassment" || report.type === "assault" || report.type === "theft" || report.type === "suspicious" ? "⚠️" : "✅"}
                    </span>
                    <span className="font-medium">{report.type}</span>
                  </div>
                  <div className="text-xs text-slate-500">{report.time}</div>
                  <div className="text-xs text-slate-600">{report.description}</div>
                </div>
              ))}
              {feedList.length === 0 && (
                <p className="text-slate-500 text-center py-4">No reports yet</p>
              )}
            </div>
            <button
              onClick={() => isLoggedIn() ? setPage("community") : setPage("login")}
              className="mt-3 w-full text-sm text-indigo-600 hover:underline"
            >
              View All Reports →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RouteFinder;
