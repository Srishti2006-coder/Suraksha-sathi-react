import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap, Circle } from "react-leaflet";
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

// Current location icon (blue pulsing)
const currentLocationIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="
    background: #3b82f6;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 5px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
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

// Component to update map center and fit bounds
const MapUpdater = ({ center, geometry }) => {
  const map = useMap();
  useEffect(() => {
    if (geometry && geometry.length > 0) {
      const bounds = L.latLngBounds(geometry.map(c => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, geometry, map]);
  return null;
};

// Component to track user location
const LocationTracker = ({ isTracking, routeGeometry, onLocationUpdate }) => {
  const map = useMap();
  const watchId = useRef(null);

  useEffect(() => {
    if (isTracking && routeGeometry && routeGeometry.length > 0) {
      if (!navigator.geolocation) {
        console.error("Geolocation not supported");
        return;
      }

      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Check if user has reached destination
          const lastPoint = routeGeometry[routeGeometry.length - 1];
          const distance = map.distance([latitude, longitude], [lastPoint.lat, lastPoint.lng]);
          
          if (distance < 50) {
            onLocationUpdate({ lat: latitude, lng: longitude, arrived: true });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [isTracking, routeGeometry, map, onLocationUpdate]);

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
  const [mapCenter, setMapCenter] = useState([30.7199, 76.789]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  
  // New state for turn-by-turn, route details, and live tracking
  const [routeSteps, setRouteSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [hasArrived, setHasArrived] = useState(false);
  
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
      const spData = await safetyPointsAPI.getAll();
      setSafetyPoints(spData.safetyPoints || []);
      
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
      const data = await routesAPI.geocode(query);
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
    setRouteSteps([]);
    setCurrentStep(0);
    setHasArrived(false);
    setIsTracking(false);
    setCurrentLocation(null);

    try {
      const routeData = await routesAPI.getRoute(
        startLocation.lat,
        startLocation.lng,
        endLocation.lat,
        endLocation.lng
      );

      if (!routeData.geometry || routeData.geometry.length === 0) {
        throw new Error("No route found");
      }

      // Process route steps for turn-by-turn directions
      const steps = (routeData.steps || []).map((step, index) => ({
        id: index,
        instruction: formatInstruction(step),
        distance: step.distance,
        duration: step.duration,
        name: step.name || "Unnamed road"
      }));
      setRouteSteps(steps);

      // Calculate safety score
      const scoreData = await routesAPI.calculateSafetyScore(routeData.geometry);
      setSafetyScore(scoreData.score);
      setSafetyDetails(scoreData.details);

      // Create routes array
      const allRoutes = [];
      
      allRoutes.push({
        id: 1,
        name: "Recommended Route",
        geometry: routeData.geometry,
        distance: routeData.distance,
        duration: routeData.duration,
        safetyScore: scoreData.score,
        isMain: true,
        description: "Best balance of distance and safety",
        steps: steps
      });

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

      allRoutes.sort((a, b) => b.safetyScore - a.safetyScore);

      const safestRouteId = allRoutes[0].id;
      setRoutes(allRoutes.map(r => ({
        ...r,
        isSafest: r.id === safestRouteId
      })));

      setSelectedRoute(allRoutes.find(r => r.id === safestRouteId));

      const bounds = L.latLngBounds(routeData.geometry.map(c => [c.lat, c.lng]));
      setMapCenter(bounds.getCenter());

    } catch (err) {
      setError(err.message || "Error finding routes. Please try again.");
      console.error("Route error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format instruction for turn-by-turn
  const formatInstruction = (step) => {
    const maneuver = step.maneuver || "";
    const modifier = step.modifier || "";
    const name = step.name || "";
    const distance = formatDistance(step.distance);
    
    let instruction = "";
    
    switch (maneuver) {
      case "depart":
        instruction = `Start by heading ${modifier || "on"} ${name || "the road"}`;
        break;
      case "turn":
        instruction = `In ${distance}, turn ${modifier}`;
        break;
      case "new name":
        instruction = `In ${distance}, continue onto ${name}`;
        break;
      case "end of road":
        instruction = `In ${distance}, turn ${modifier} onto ${name}`;
        break;
      case "merge":
        instruction = `In ${distance}, merge onto ${name}`;
        break;
      case "fork":
        instruction = `In ${distance}, keep ${modifier} onto ${name}`;
        break;
      case "arrive":
        instruction = `You have arrived at your destination`;
        break;
      case "continue":
        instruction = `Continue for ${distance}`;
        break;
      default:
        instruction = name ? `Continue on ${name} for ${distance}` : `Continue for ${distance}`;
    }
    
    return instruction;
  };

  // Handle route selection
  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setRouteSteps(route.steps || []);
    setCurrentStep(0);
    setShowRouteDetails(false);
  };

  // Toggle live tracking
  const toggleTracking = () => {
    if (isTracking) {
      setIsTracking(false);
    } else {
      setIsTracking(true);
      setHasArrived(false);
    }
  };

  // Handle location update
  const handleLocationUpdate = (location) => {
    if (location.arrived) {
      setHasArrived(true);
      setIsTracking(false);
    } else {
      setCurrentLocation(location);
      
      // Update current step based on proximity to route
      if (selectedRoute && selectedRoute.geometry && selectedRoute.geometry.length > 0) {
        let minDistance = Infinity;
        let closestIndex = 0;
        
        selectedRoute.geometry.forEach((point, index) => {
          const distance = Math.sqrt(
            Math.pow(location.lat - point.lat, 2) + 
            Math.pow(location.lng - point.lng, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });
        
        // Update current step based on progress
        const progress = closestIndex / selectedRoute.geometry.length;
        const stepIndex = Math.min(
          Math.floor(progress * routeSteps.length),
          routeSteps.length - 1
        );
        setCurrentStep(stepIndex);
      }
    }
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

      {hasArrived && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          🎉 You have arrived at your destination!
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        {/* Left: Map and Routes */}
        <div className="flex-1">
          {/* Route Search */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-2">
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

          {/* Turn-by-Turn Navigation Bar */}
          {routeSteps.length > 0 && !hasArrived && (
            <div className="bg-indigo-600 rounded-lg shadow-md p-3 mb-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold">
                    {currentStep + 1}/{routeSteps.length}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm opacity-80">Next:</div>
                    <div className="font-medium">{routeSteps[currentStep]?.instruction || "Start navigation"}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRouteDetails(!showRouteDetails)}
                    className="px-3 py-1 bg-white/20 rounded hover:bg-white/30 text-sm"
                  >
                    {showRouteDetails ? "Hide Details" : "Show Details"}
                  </button>
                  <button
                    onClick={toggleTracking}
                    className={`px-3 py-1 rounded text-sm ${isTracking ? "bg-red-500" : "bg-green-500"}`}
                  >
                    {isTracking ? "Stop" : "Start Live"}
                  </button>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / routeSteps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

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
                <MapUpdater center={selectedRoute?.geometry?.[0]} geometry={selectedRoute?.geometry} />
                <LocationTracker 
                  isTracking={isTracking} 
                  routeGeometry={selectedRoute?.geometry}
                  onLocationUpdate={handleLocationUpdate}
                />
                
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
                
                {/* Current location marker */}
                {currentLocation && (
                  <Marker position={[currentLocation.lat, currentLocation.lng]} icon={currentLocationIcon}>
                    <Popup>Your location</Popup>
                  </Marker>
                )}
                
                {/* Current location accuracy circle */}
                {currentLocation && (
                  <Circle 
                    center={[currentLocation.lat, currentLocation.lng]}
                    radius={20}
                    pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }}
                  />
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
                <span className="w-3 h-3 rounded-full bg-blue-500"></span> Your Location
              </span>
            </div>
          </div>

          {/* Route Details Panel (Expandable) */}
          {showRouteDetails && routeSteps.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-4 max-h-64 overflow-auto">
              <h3 className="font-semibold mb-3">Turn-by-Turn Directions</h3>
              <div className="space-y-2">
                {routeSteps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`p-2 rounded flex gap-3 ${
                      index === currentStep ? "bg-indigo-50 border-l-4 border-indigo-500" : 
                      index < currentStep ? "bg-gray-50 opacity-60" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{step.instruction}</div>
                      <div className="text-xs text-gray-500">
                        {formatDistance(step.distance)} • {formatDuration(step.duration)}
                        {step.name && ` • ${step.name}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
