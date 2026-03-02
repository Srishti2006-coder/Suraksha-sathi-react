import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { routesAPI, safetyPointsAPI, reportsAPI, isLoggedIn } from "../utils/api";

// Custom icons for safety points
const createIcon = (emoji, color) => L.divIcon({
  className: "custom-marker",
  html: `<div style="
    background: ${color};
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    border: 2px solid white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  ">${emoji}</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Start/End markers
const startIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="
    background: #22c55e;
    width: 30px;
    height: 30px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border: 2px solid white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  "><span style="transform: rotate(45deg);">📍</span></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const endIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="
    background: #ef4444;
    width: 30px;
    height: 30px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border: 2px solid white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  "><span style="transform: rotate(45deg);">🏁</span></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const policeIcon = createIcon("👮", "#2563eb");
const hospitalIcon = createIcon("🏥", "#dc2626");
const marketIcon = createIcon("🛒", "#16a34a");
const reportIcon = createIcon("⚠️", "#dc2626");

// Component to update map center
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
};

const RouteFinder = ({ setPage }) => {
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [safetyScore, setSafetyScore] = useState(null);
  const [safetyDetails, setSafetyDetails] = useState(null);
  const [reportsCount, setReportsCount] = useState(0);
  const [feedList, setFeedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [safetyPoints, setSafetyPoints] = useState([]);
  const [reports, setReports] = useState([]);
  const [mapCenter, setMapCenter] = useState([30.7199, 76.789]); // Default Chandigarh
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (startInputRef.current && !startInputRef.current.contains(e.target)) {
        setShowStartSuggestions(false);
      }
      if (endInputRef.current && !endInputRef.current.contains(e.target)) {
        setShowEndSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadData = async () => {
    try {
      // Load safety points
      const spData = await safetyPointsAPI.getAll();
      setSafetyPoints(spData.safetyPoints || []);
      
      // Load community reports
      const reportsData = await reportsAPI.getAll(0, 50);
      setReportsCount(reportsData.reports?.length || 0);
      setReports(reportsData.reports || []);
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

  // Search for places (autocomplete)
  const searchPlaces = async (query, isStart) => {
    if (query.length < 2) {
      if (isStart) setStartSuggestions([]);
      else setEndSuggestions([]);
      return;
    }

    try {
      console.log("Searching for:", query);
      const data = await routesAPI.geocode(query);
      console.log("Geocode results:", data);
      if (isStart) {
        setStartSuggestions(data.results || []);
        setShowStartSuggestions(true);
      } else {
        setEndSuggestions(data.results || []);
        setShowEndSuggestions(true);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  };

  const handleStartInputChange = (e) => {
    const value = e.target.value;
    setStartInput(value);
    searchPlaces(value, true);
  };

  const handleEndInputChange = (e) => {
    const value = e.target.value;
    setEndInput(value);
    searchPlaces(value, false);
  };

  const selectStartLocation = (place) => {
    setStartInput(place.display_name.split(",").slice(0, 3).join(","));
    setStartLocation({ lat: place.lat, lng: place.lng });
    setStartSuggestions([]);
    setShowStartSuggestions(false);
  };

  const selectEndLocation = (place) => {
    setEndInput(place.display_name.split(",").slice(0, 3).join(","));
    setEndLocation({ lat: place.lat, lng: place.lng });
    setEndSuggestions([]);
    setShowEndSuggestions(false);
  };

  const handleFindRoutes = async () => {
    if (!startLocation || !endLocation) {
      setError("Please select start and end locations from the suggestions");
      return;
    }

    setLoading(true);
    setError("");
    setRoutes([]);
    setSafetyScore(null);
    setSelectedRoute(null);

    try {
      // Get route from OSRM
      const routeData = await routesAPI.getRoute(
        startLocation.lat,
        startLocation.lng,
        endLocation.lat,
        endLocation.lng
      );

      if (!routeData.geometry || routeData.geometry.length === 0) {
        throw new Error("No route found");
      }

      // Calculate safety score for main route
      const scoreData = await routesAPI.calculateSafetyScore(routeData.geometry);
      setSafetyScore(scoreData.score);
      setSafetyDetails(scoreData.details);

      // Create routes array with safety information
      const allRoutes = [];
      
      // Main route
      allRoutes.push({
        id: 1,
        name: "Recommended Route",
        geometry: routeData.geometry,
        distance: routeData.distance,
        duration: routeData.duration,
        safetyScore: scoreData.score,
        isMain: true,
        description: "Best balance of distance and safety"
      });

      // Alternative routes
      if (routeData.alternatives && routeData.alternatives.length > 0) {
        for (let i = 0; i < routeData.alternatives.length; i++) {
          const alt = routeData.alternatives[i];
          const altScoreData = await routesAPI.calculateSafetyScore(alt.geometry);
          allRoutes.push({
            id: i + 2,
            name: `Alternative Route ${i + 1}`,
            geometry: alt.geometry,
            distance: alt.distance,
            duration: alt.duration,
            safetyScore: altScoreData.score,
            isMain: false,
            description: alt.distance < routeData.distance ? "Shorter but may be less safe" : "Longer but safer"
          });
        }
      }

      // Sort by safety score (highest first)
      allRoutes.sort((a, b) => b.safetyScore - a.safetyScore);

      // Mark the safest route
      const safestRouteId = allRoutes[0].id;
      setRoutes(allRoutes.map(r => ({
        ...r,
        isSafest: r.id === safestRouteId
      })));

      // Select the safest route by default
      setSelectedRoute(allRoutes.find(r => r.id === safestRouteId));

      // Center map on the route
      const bounds = L.latLngBounds(routeData.geometry.map(c => [c.lat, c.lng]));
      setMapCenter(bounds.getCenter());

    } catch (err) {
      setError(err.message || "Error finding routes. Please try again.");
      console.error("Route error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  const getSafetyColor = (score) => {
    if (score >= 8) return { text: "text-green-600", bg: "bg-green-50", label: "Very Safe" };
    if (score >= 6) return { text: "text-yellow-600", bg: "bg-yellow-50", label: "Moderate" };
    if (score >= 4) return { text: "text-orange-600", bg: "bg-orange-50", label: "Caution" };
    return { text: "text-red-600", bg: "bg-red-50", label: "Unsafe" };
  };

  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  const formatDuration = (seconds) => {
    const mins = Math.round(seconds / 60);
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins}m`;
    }
    return `${mins} min`;
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
              {/* Start Location Input */}
              <div className="flex-1 relative" ref={startInputRef}>
                <input
                  type="text"
                  value={startInput}
                  onChange={handleStartInputChange}
                  onFocus={() => startSuggestions.length > 0 && setShowStartSuggestions(true)}
                  placeholder="Start location (type to search)"
                  className="w-full px-3 py-2 border rounded"
                />
                {showStartSuggestions && startSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {startSuggestions.map((place) => (
                      <div
                        key={place.place_id}
                        onClick={() => selectStartLocation(place)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
                      >
                        <div className="font-medium">{place.display_name.split(",").slice(0, 2).join(",")}</div>
                        <div className="text-xs text-gray-500">{place.display_name.split(",").slice(2, 4).join(",")}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* End Location Input */}
              <div className="flex-1 relative" ref={endInputRef}>
                <input
                  type="text"
                  value={endInput}
                  onChange={handleEndInputChange}
                  onFocus={() => endSuggestions.length > 0 && setShowEndSuggestions(true)}
                  placeholder="End location (type to search)"
                  className="w-full px-3 py-2 border rounded"
                />
                {showEndSuggestions && endSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {endSuggestions.map((place) => (
                      <div
                        key={place.place_id}
                        onClick={() => selectEndLocation(place)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
                      >
                        <div className="font-medium">{place.display_name.split(",").slice(0, 2).join(",")}</div>
                        <div className="text-xs text-gray-500">{place.display_name.split(",").slice(2, 4).join(",")}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleFindRoutes}
                disabled={loading || !startLocation || !endLocation}
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Finding..." : "Find Routes"}
              </button>
            </div>

            {/* Safety Score Display */}
            {safetyScore !== null && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Overall Route Safety Score</div>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${getSafetyColor(safetyScore).text}`}>
                        {safetyScore.toFixed(1)}/10
                      </span>
                      <span className={`text-sm px-2 py-1 rounded ${getSafetyColor(safetyScore).bg} ${getSafetyColor(safetyScore).text}`}>
                        {getSafetyColor(safetyScore).label}
                      </span>
                    </div>
                  </div>
                  {safetyDetails && (
                    <div className="flex gap-4 text-xs">
                      <span className="flex items-center gap-1">👮 {safetyDetails.policeStations}</span>
                      <span className="flex items-center gap-1">🏥 {safetyDetails.hospitals}</span>
                      <span className="flex items-center gap-1">🛒 {safetyDetails.markets}</span>
                      <span className="flex items-center gap-1 text-red-500">⚠️ {safetyDetails.reports}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Leaflet Map */}
          <div className="rounded-lg overflow-hidden shadow-md bg-white p-4 mb-4">
            <div className="h-[450px] rounded-lg overflow-hidden">
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={selectedRoute?.geometry?.[0]} />
                
                {/* Start marker */}
                {startLocation && (
                  <Marker position={[startLocation.lat, startLocation.lng]} icon={startIcon}>
                    <Popup>Start: {startInput}</Popup>
                  </Marker>
                )}
                
                {/* End marker */}
                {endLocation && (
                  <Marker position={[endLocation.lat, endLocation.lng]} icon={endIcon}>
                    <Popup>End: {endInput}</Popup>
                  </Marker>
                )}
                
                {/* Safety points on map */}
                {safetyPoints.map((sp, idx) => (
                  <Marker
                    key={idx}
                    position={[sp.lat, sp.lng]}
                    icon={sp.type === "police" ? policeIcon : sp.type === "hospital" ? hospitalIcon : marketIcon}
                  >
                    <Popup>
                      <div className="text-center">
                        <div className="font-semibold">{sp.name}</div>
                        <div className="text-sm capitalize">{sp.type}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                
                {/* Report markers */}
                {reports.map((report, idx) => (
                  <Marker
                    key={`report-${idx}`}
                    position={[report.lat, report.lng]}
                    icon={reportIcon}
                  >
                    <Popup>
                      <div className="text-center">
                        <div className="font-semibold text-red-600 capitalize">{report.type}</div>
                        <div className="text-sm">{report.note}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                
                {/* Route polyline */}
                {selectedRoute && selectedRoute.geometry && (
                  <Polyline
                    positions={selectedRoute.geometry.map(c => [c.lat, c.lng])}
                    pathOptions={{
                      color: selectedRoute.isSafest ? "#16a34a" : "#6366f1",
                      weight: selectedRoute.isMain ? 5 : 3,
                      opacity: selectedRoute.isMain ? 1 : 0.7,
                      dashArray: selectedRoute.isMain ? null : "10, 10"
                    }}
                  />
                )}
              </MapContainer>
            </div>
            
            {/* Map Legend */}
            <div className="mt-2 flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span> Police
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-600"></span> Hospital
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-600"></span> Market/Mall
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-600"></span> Unsafe Report
              </span>
              <span className="flex items-center gap-1">
                <span className="w-6 h-1 bg-green-600"></span> Safest Route
              </span>
              <span className="flex items-center gap-1">
                <span className="w-6 h-1 bg-indigo-500"></span> Other Route
              </span>
            </div>
          </div>

          {/* Routes List */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold mb-4">Available Routes</h3>
            {routes.length === 0 ? (
              <p className="text-slate-500 text-center py-4">
                {startLocation && endLocation 
                  ? "Click 'Find Routes' to see routes" 
                  : "Enter start and end locations to find routes"}
              </p>
            ) : (
              <div className="space-y-3">
                {routes.map((route) => {
                  const safety = getSafetyColor(route.safetyScore);
                  return (
                    <div
                      key={route.id}
                      onClick={() => handleRouteSelect(route)}
                      className={`p-3 border rounded-lg cursor-pointer transition ${
                        selectedRoute?.id === route.id 
                          ? "border-indigo-500 bg-indigo-50" 
                          : "hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-sm">{route.name}</div>
                          {route.isSafest && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              🛡️ Safest
                            </span>
                          )}
                        </div>
                        <div className={`text-xs font-semibold px-2 py-1 rounded ${safety.bg} ${safety.text}`}>
                          {route.safetyScore.toFixed(1)}/10
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {formatDistance(route.distance)} • {formatDuration(route.duration)}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {route.description}
                      </div>
                    </div>
                  );
                })}
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
