/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { routesAPI, safetyPointsAPI, reportsAPI, isLoggedIn } from "../utils/api";

// Custom icons for safety points
const createIcon = (emoji, color) => L.divIcon({
  className: "custom-marker",
  html: `<div style="background:${color};width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);">${emoji}</div>`,
  iconSize: [30, 30], iconAnchor: [15, 15],
});

const currentLocationIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="background:#3b82f6;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3),0 2px 5px rgba(0,0,0,0.3);"></div>`,
  iconSize: [20, 20], iconAnchor: [10, 10],
});

const startIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="background:#22c55e;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"><span style="transform:rotate(45deg);">📍</span></div>`,
  iconSize: [30, 30], iconAnchor: [15, 30],
});

const endIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="background:#ef4444;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"><span style="transform:rotate(45deg);">🏁</span></div>`,
  iconSize: [30, 30], iconAnchor: [15, 30],
});

const policeIcon = createIcon("👮", "#2563eb");
const hospitalIcon = createIcon("🏥", "#dc2626");
const marketIcon = createIcon("🛒", "#16a34a");
const reportIcon = createIcon("⚠️", "#dc2626");

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

const LocationTracker = ({ isTracking, routeGeometry, onLocationUpdate }) => {
  const map = useMap();
  const watchId = useRef(null);
  useEffect(() => {
    if (isTracking && routeGeometry && routeGeometry.length > 0) {
      if (!navigator.geolocation) return;
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationUpdate({ lat: latitude, lng: longitude });
          const lastPoint = routeGeometry[routeGeometry.length - 1];
          const distance = map.distance([latitude, longitude], [lastPoint.lat, lastPoint.lng]);
          if (distance < 50) onLocationUpdate({ lat: latitude, lng: longitude, arrived: true });
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
    return () => { if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current); };
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
  const [reportsCount, setReportsCount] = useState(0);
  const [feedList, setFeedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [safetyPoints, setSafetyPoints] = useState([]);
  const [reports, setReports] = useState([]);
  const [mapCenter, setMapCenter] = useState([30.7199, 76.789]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [routeSteps, setRouteSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [hasArrived, setHasArrived] = useState(false);
  const [safetyScore, setSafetyScore] = useState(null);
  const [safetyDetails, setSafetyDetails] = useState(null);

  const startInputRef = useRef(null);
  const endInputRef = useRef(null);
  const startSearchTimeout = useRef(null);
  const endSearchTimeout = useRef(null);

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (startInputRef.current && !startInputRef.current.contains(e.target)) setShowStartSuggestions(false);
      if (endInputRef.current && !endInputRef.current.contains(e.target)) setShowEndSuggestions(false);
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
        id: r._id, type: r.type,
        location: `Lat: ${r.lat?.toFixed(2)}, Lng: ${r.lng?.toFixed(2)}`,
        time: new Date(r.timestamp || r.createdAt).toLocaleDateString(),
        description: r.note
      })) || []);
    } catch (err) { console.error("Error loading data:", err); }
  };

  const searchPlaces = async (query, isStart) => {
    if (query.length < 2) { if (isStart) setStartSuggestions([]); else setEndSuggestions([]); return; }
    try {
      const data = await routesAPI.geocode(query);
      if (isStart) { setStartSuggestions(data.results || []); setShowStartSuggestions(true); }
      else { setEndSuggestions(data.results || []); setShowEndSuggestions(true); }
    } catch (err) { console.error("Geocoding error:", err); }
  };

  const handleStartInputChange = (e) => {
    const value = e.target.value; setStartInput(value);
    if (startSearchTimeout.current) clearTimeout(startSearchTimeout.current);
    startSearchTimeout.current = setTimeout(() => searchPlaces(value, true), 500);
  };

  const handleEndInputChange = (e) => {
    const value = e.target.value; setEndInput(value);
    if (endSearchTimeout.current) clearTimeout(endSearchTimeout.current);
    endSearchTimeout.current = setTimeout(() => searchPlaces(value, false), 500);
  };

  const selectStartLocation = (place) => {
    setStartInput(place.display_name.split(",").slice(0, 3).join(","));
    setStartLocation({ lat: place.lat, lng: place.lng });
    setStartSuggestions([]); setShowStartSuggestions(false);
  };

  const selectEndLocation = (place) => {
    setEndInput(place.display_name.split(",").slice(0, 3).join(","));
    setEndLocation({ lat: place.lat, lng: place.lng });
    setEndSuggestions([]); setShowEndSuggestions(false);
  };

  const handleFindRoutes = async () => {
    if (!startLocation || !endLocation) { setError("Please select start and end locations from the suggestions"); return; }
    setLoading(true); setError(""); setRoutes([]); setSafetyScore(null);
    setSelectedRoute(null); setRouteSteps([]); setCurrentStep(0);
    setHasArrived(false); setIsTracking(false); setCurrentLocation(null);
    try {
      const routeData = await routesAPI.getRoute(startLocation.lat, startLocation.lng, endLocation.lat, endLocation.lng);
      if (!routeData.geometry || routeData.geometry.length === 0) throw new Error("No route found");
      const steps = (routeData.steps || []).map((step, index) => ({
        id: index, instruction: formatInstruction(step),
        distance: step.distance, duration: step.duration, name: step.name || "Unnamed road"
      }));
      setRouteSteps(steps);
      const sampledGeometry = sampleCoordinatesForAPI(routeData.geometry, 20);
      const scoreData = await routesAPI.calculateSafetyScore(sampledGeometry);
      setSafetyScore(scoreData.score); setSafetyDetails(scoreData.details);
      const allRoutes = [];
      allRoutes.push({
        id: 1, name: "Recommended Route", geometry: routeData.geometry,
        distance: routeData.distance, duration: routeData.duration,
        safetyScore: scoreData.score, rating: convertScoreToRating(scoreData.score),
        isMain: true, description: "Best balance of distance and safety", steps: steps
      });
      if (routeData.alternatives && routeData.alternatives.length > 0) {
        for (let i = 0; i < routeData.alternatives.length; i++) {
          const alt = routeData.alternatives[i];
          const altSampledGeometry = sampleCoordinatesForAPI(alt.geometry, 20);
          const altScoreData = await routesAPI.calculateSafetyScore(altSampledGeometry);
          allRoutes.push({
            id: i + 2, name: `Alternative Route ${i + 1}`, geometry: alt.geometry,
            distance: alt.distance, duration: alt.duration,
            safetyScore: altScoreData.score, rating: convertScoreToRating(altScoreData.score),
            isMain: false, description: alt.distance < routeData.distance ? "Shorter but may be less safe" : "Longer but safer"
          });
        }
      }
      allRoutes.sort((a, b) => b.safetyScore - a.safetyScore);
      const safestRouteId = allRoutes[0].id;
      setRoutes(allRoutes.map(r => ({ ...r, isSafest: r.id === safestRouteId })));
      setSelectedRoute(allRoutes.find(r => r.id === safestRouteId));
      const bounds = L.latLngBounds(routeData.geometry.map(c => [c.lat, c.lng]));
      setMapCenter(bounds.getCenter());
    } catch (err) { setError(err.message || "Error finding routes. Please try again."); console.error("Route error:", err); }
    finally { setLoading(false); }
  };

  const formatInstruction = (step) => {
    const maneuver = step.maneuver || "", modifier = step.modifier || "", name = step.name || "", distance = formatDistance(step.distance);
    switch (maneuver) {
      case "depart": return `Start by heading ${modifier || "on"} ${name || "the road"}`;
      case "turn": return `In ${distance}, turn ${modifier}`;
      case "new name": return `In ${distance}, continue onto ${name}`;
      case "end of road": return `In ${distance}, turn ${modifier} onto ${name}`;
      case "merge": return `In ${distance}, merge onto ${name}`;
      case "fork": return `In ${distance}, keep ${modifier} onto ${name}`;
      case "arrive": return `You have arrived at your destination`;
      case "continue": return `Continue for ${distance}`;
      default: return name ? `Continue on ${name} for ${distance}` : `Continue for ${distance}`;
    }
  };

  const handleRouteSelect = (route) => { setSelectedRoute(route); setRouteSteps(route.steps || []); setCurrentStep(0); setShowRouteDetails(false); };
  const toggleTracking = () => { if (isTracking) { setIsTracking(false); } else { setIsTracking(true); setHasArrived(false); } };

  const handleLocationUpdate = (location) => {
    if (location.arrived) { setHasArrived(true); setIsTracking(false); }
    else {
      setCurrentLocation(location);
      if (selectedRoute && selectedRoute.geometry && selectedRoute.geometry.length > 0) {
        let minDistance = Infinity, closestIndex = 0;
        selectedRoute.geometry.forEach((point, index) => {
          const distance = Math.sqrt(Math.pow(location.lat - point.lat, 2) + Math.pow(location.lng - point.lng, 2));
          if (distance < minDistance) { minDistance = distance; closestIndex = index; }
        });
        const progress = closestIndex / selectedRoute.geometry.length;
        setCurrentStep(Math.min(Math.floor(progress * routeSteps.length), routeSteps.length - 1));
      }
    }
  };

  // ── Helpers ──────────────────────────────────────────────
  const getSafetyLabel = (score) => {
    if (score >= 8) return { label: "Very Safe", color: "#10B981", bg: "rgba(16,185,129,.1)", border: "rgba(16,185,129,.25)", icon: "🛡️" };
    if (score >= 6) return { label: "Mostly Safe", color: "#F59E0B", bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.25)", icon: "⚡" };
    if (score >= 4) return { label: "Use Caution", color: "#F97316", bg: "rgba(249,115,22,.1)", border: "rgba(249,115,22,.25)", icon: "⚠️" };
    return { label: "Caution Advised", color: "#EF4444", bg: "rgba(239,68,68,.1)", border: "rgba(239,68,68,.25)", icon: "🚨" };
  };

  const sampleCoordinatesForAPI = (coordinates, numSamples) => {
    if (!coordinates || coordinates.length <= numSamples) return coordinates;
    const result = [], step = (coordinates.length - 1) / (numSamples - 1);
    for (let i = 0; i < numSamples; i++) result.push(coordinates[Math.min(Math.floor(i * step), coordinates.length - 1)]);
    return result;
  };

  const convertScoreToRating = (score) => {
    if (score >= 9) return 5; if (score >= 7) return 4; if (score >= 5) return 3; if (score >= 3) return 2; return 1;
  };

  const renderStars = (rating) => (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(star => (
        <span key={star} style={{ color: star <= rating ? "#F59E0B" : "#D1D5DB", fontSize: 15 }}>★</span>
      ))}
    </div>
  );

  const formatDistance = (meters) => meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
  const formatDuration = (seconds) => {
    const mins = Math.round(seconds / 60);
    if (mins >= 60) { const hours = Math.floor(mins / 60); return `${hours}h ${mins % 60}m`; }
    return `${mins} min`;
  };

  const dangerousTypes = ["harassment","assault","theft","suspicious"];

  // ── Render ────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .rf-page * { box-sizing: border-box; }
        .rf-page { font-family: 'DM Sans', sans-serif; }

        /* Fix leaflet z-index so it never bleeds over navbar */
        .leaflet-container { z-index: 1 !important; }
        .leaflet-top, .leaflet-bottom { z-index: 9 !important; }
        .leaflet-pane { z-index: 4 !important; }
        .leaflet-tile-pane { z-index: 2 !important; }
        .leaflet-overlay-pane { z-index: 4 !important; }
        .leaflet-marker-pane { z-index: 6 !important; }
        .leaflet-popup-pane { z-index: 8 !important; }

        .rf-card {
          background: white; border-radius: 16px;
          border: 1.5px solid #F1F5F9;
          box-shadow: 0 2px 12px rgba(0,0,0,.05);
          overflow: hidden;
        }

        .rf-input {
          width: 100%; padding: 10px 14px 10px 38px;
          background: #F8FAFC; border: 1.5px solid #E2E8F0;
          border-radius: 11px; font-size: 14px; color: #0F172A;
          outline: none; transition: all .2s; font-family: 'DM Sans', sans-serif;
        }
        .rf-input::placeholder { color: #94A3B8; }
        .rf-input:focus { border-color: #2563EB; background: white; box-shadow: 0 0 0 3px rgba(37,99,235,.1); }

        .rf-find-btn {
          padding: 10px 22px; background: linear-gradient(135deg,#1d4ed8,#2563EB);
          color: white; border: none; border-radius: 11px; font-size: 14px;
          font-weight: 700; cursor: pointer; transition: all .2s;
          box-shadow: 0 3px 12px rgba(37,99,235,.35); white-space: nowrap;
          font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 7px;
        }
        .rf-find-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(37,99,235,.45); }
        .rf-find-btn:disabled { opacity: .55; cursor: not-allowed; }

        .rf-suggestion-item {
          padding: 10px 14px; cursor: pointer; border-bottom: 1px solid #F8FAFC;
          transition: background .15s;
        }
        .rf-suggestion-item:hover { background: #F0F7FF; }
        .rf-suggestion-item:last-child { border-bottom: none; }

        .rf-route-card {
          border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 16px 18px;
          cursor: pointer; transition: all .22s; background: white;
          position: relative; overflow: hidden;
        }
        .rf-route-card:hover { border-color: #93C5FD; box-shadow: 0 6px 20px rgba(37,99,235,.1); transform: translateY(-1px); }
        .rf-route-card.selected { border-color: #2563EB; background: linear-gradient(135deg,#EFF6FF,#F0F9FF); box-shadow: 0 6px 20px rgba(37,99,235,.15); }
        .rf-route-card.selected::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background: linear-gradient(180deg,#2563EB,#7C3AED); border-radius:2px 0 0 2px; }

        .rf-nav-bar {
          background: linear-gradient(135deg,#1e3a8a,#2563EB);
          border-radius: 14px; padding: 14px 18px;
          box-shadow: 0 4px 16px rgba(37,99,235,.3);
        }

        .rf-step-item {
          padding: 10px 12px; border-radius: 10px; display: flex; gap: 12px; transition: background .15s;
        }
        .rf-step-item.active { background: #EFF6FF; border-left: 3px solid #2563EB; }
        .rf-step-item.done { opacity: .5; }
        .rf-step-item:not(.active):not(.done):hover { background: #F8FAFC; }

        .rf-feed-item {
          padding: 10px 12px; border-radius: 10px; margin-bottom: 8px;
          border: 1px solid transparent; transition: all .18s;
        }
        .rf-feed-item:hover { transform: translateY(-1px); }
        .rf-feed-item.danger { background: #FFF5F5; border-color: #FECACA; }
        .rf-feed-item.safe { background: #F0FDF4; border-color: #BBF7D0; }

        .rf-legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .rf-legend-line { width: 20px; height: 3px; border-radius: 2px; flex-shrink: 0; }

        @keyframes pulse-live { 0%,100%{opacity:1} 50%{opacity:.5} }
        .live-dot { animation: pulse-live 1.5s infinite; }

        @keyframes spin { to{transform:rotate(360deg)} }
        .spinner { width:16px; height:16px; border:2.5px solid rgba(255,255,255,.3); border-top-color:white; border-radius:50%; animation:spin .7s linear infinite; }
      `}</style>

      <div className="rf-page" style={{ maxWidth:1200, margin:"0 auto", padding:"20px 20px 40px", background:"#F8FAFF", minHeight:"calc(100vh - 64px)" }}>

        {/* ── Error / Arrived banners ── */}
        {error && (
          <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", color:"#DC2626", padding:"12px 16px", borderRadius:12, marginBottom:16, display:"flex", alignItems:"center", gap:8, fontSize:14 }}>
            <span>⚠️</span> {error}
          </div>
        )}
        {hasArrived && (
          <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", color:"#15803D", padding:"12px 16px", borderRadius:12, marginBottom:16, display:"flex", alignItems:"center", gap:8, fontSize:14, fontWeight:600 }}>
            🎉 You have arrived at your destination!
          </div>
        )}

        <div style={{ display:"flex", gap:20, alignItems:"flex-start", flexWrap:"wrap" }}>

          {/* ══ LEFT COLUMN ══ */}
          <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:16 }}>

            {/* ── Search Card ── */}
            <div className="rf-card" style={{ padding:"20px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:"linear-gradient(135deg,#EFF6FF,#EEF2FF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🗺️</div>
                <div>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:800, color:"#0F172A" }}>Route Finder</div>
                  <div style={{ fontSize:12, color:"#94A3B8" }}>Find the safest path to your destination</div>
                </div>
              </div>

              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {/* Start input */}
                <div style={{ flex:1, minWidth:200, position:"relative" }} ref={startInputRef}>
                  <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:15 }}>🟢</span>
                  <input className="rf-input" type="text" value={startInput} onChange={handleStartInputChange}
                    onFocus={() => startSuggestions.length > 0 && setShowStartSuggestions(true)}
                    placeholder="Start location…"/>
                  {showStartSuggestions && startSuggestions.length > 0 && (
                    <div style={{ position:"absolute", zIndex:50, width:"100%", background:"white", border:"1.5px solid #E2E8F0", borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,.1)", maxHeight:220, overflowY:"auto", top:"calc(100% + 6px)" }}>
                      {startSuggestions.map(place => (
                        <div key={place.place_id} className="rf-suggestion-item" onClick={() => selectStartLocation(place)}>
                          <div style={{ fontSize:13, fontWeight:600, color:"#0F172A" }}>{place.display_name.split(",").slice(0,2).join(",")}</div>
                          <div style={{ fontSize:11, color:"#94A3B8", marginTop:2 }}>{place.display_name.split(",").slice(2,4).join(",")}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* End input */}
                <div style={{ flex:1, minWidth:200, position:"relative" }} ref={endInputRef}>
                  <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:15 }}>🔴</span>
                  <input className="rf-input" type="text" value={endInput} onChange={handleEndInputChange}
                    onFocus={() => endSuggestions.length > 0 && setShowEndSuggestions(true)}
                    placeholder="Destination…"/>
                  {showEndSuggestions && endSuggestions.length > 0 && (
                    <div style={{ position:"absolute", zIndex:50, width:"100%", background:"white", border:"1.5px solid #E2E8F0", borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,.1)", maxHeight:220, overflowY:"auto", top:"calc(100% + 6px)" }}>
                      {endSuggestions.map(place => (
                        <div key={place.place_id} className="rf-suggestion-item" onClick={() => selectEndLocation(place)}>
                          <div style={{ fontSize:13, fontWeight:600, color:"#0F172A" }}>{place.display_name.split(",").slice(0,2).join(",")}</div>
                          <div style={{ fontSize:11, color:"#94A3B8", marginTop:2 }}>{place.display_name.split(",").slice(2,4).join(",")}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button className="rf-find-btn" onClick={handleFindRoutes} disabled={loading || !startLocation || !endLocation}>
                  {loading ? <><div className="spinner"/> Finding...</> : <><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><circle cx="6" cy="6" r="4"/><path strokeLinecap="round" d="M10 10l3 3"/></svg> Find Routes</>}
                </button>
              </div>
            </div>

            {/* ── Navigation Bar ── */}
            {routeSteps.length > 0 && !hasArrived && (
              <div className="rf-nav-bar">
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14, flex:1, minWidth:0 }}>
                    <div style={{ background:"rgba(255,255,255,.15)", borderRadius:10, padding:"6px 12px", textAlign:"center", flexShrink:0 }}>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.6)", fontWeight:600 }}>STEP</div>
                      <div style={{ fontSize:16, fontWeight:800, color:"white", lineHeight:1 }}>{currentStep+1}<span style={{fontSize:11,opacity:.6}}>/{routeSteps.length}</span></div>
                    </div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.6)", fontWeight:600, marginBottom:2 }}>NEXT DIRECTION</div>
                      <div style={{ fontSize:14, fontWeight:600, color:"white", lineHeight:1.4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{routeSteps[currentStep]?.instruction || "Start navigation"}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                    <button onClick={() => setShowRouteDetails(!showRouteDetails)}
                      style={{ padding:"7px 12px", background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.2)", borderRadius:9, color:"white", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                      {showRouteDetails ? "↑ Hide" : "↓ Steps"}
                    </button>
                    <button onClick={toggleTracking}
                      style={{ padding:"7px 14px", background:isTracking?"#EF4444":"#10B981", border:"none", borderRadius:9, color:"white", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                      {isTracking ? <>⬛ Stop</> : <><span className="live-dot" style={{width:6,height:6,borderRadius:"50%",background:"white",display:"inline-block"}}/>Live</>}
                    </button>
                  </div>
                </div>
                {/* Progress */}
                <div style={{ marginTop:10, height:4, background:"rgba(255,255,255,.15)", borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", background:"white", borderRadius:2, transition:"width .4s ease", width:`${((currentStep+1)/routeSteps.length)*100}%` }}/>
                </div>
              </div>
            )}

            {/* ── Map ── */}
            <div className="rf-card" style={{ padding:16 }}>
              <div style={{ height:460, borderRadius:12, overflow:"hidden" }}>
                <MapContainer center={mapCenter} zoom={13} style={{ height:"100%", width:"100%" }}>
                  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                  <MapUpdater center={selectedRoute?.geometry?.[0]} geometry={selectedRoute?.geometry}/>
                  <LocationTracker isTracking={isTracking} routeGeometry={selectedRoute?.geometry} onLocationUpdate={handleLocationUpdate}/>
                  {startLocation && <Marker position={[startLocation.lat,startLocation.lng]} icon={startIcon}><Popup>Start: {startInput}</Popup></Marker>}
                  {endLocation && <Marker position={[endLocation.lat,endLocation.lng]} icon={endIcon}><Popup>End: {endInput}</Popup></Marker>}
                  {currentLocation && <Marker position={[currentLocation.lat,currentLocation.lng]} icon={currentLocationIcon}><Popup>Your location</Popup></Marker>}
                  {currentLocation && <Circle center={[currentLocation.lat,currentLocation.lng]} radius={20} pathOptions={{color:'#3b82f6',fillColor:'#3b82f6',fillOpacity:0.1}}/>}
                  {safetyPoints.map((sp,idx) => (
                    <Marker key={idx} position={[sp.lat,sp.lng]} icon={sp.type==="police"?policeIcon:sp.type==="hospital"?hospitalIcon:marketIcon}>
                      <Popup><div style={{textAlign:"center"}}><div style={{fontWeight:600}}>{sp.name}</div><div style={{fontSize:12,textTransform:"capitalize"}}>{sp.type}</div></div></Popup>
                    </Marker>
                  ))}
                  {reports.map((report,idx) => (
                    <Marker key={`r-${idx}`} position={[report.lat,report.lng]} icon={reportIcon}>
                      <Popup><div style={{textAlign:"center"}}><div style={{fontWeight:600,color:"#DC2626",textTransform:"capitalize"}}>{report.type}</div><div style={{fontSize:12}}>{report.note}</div></div></Popup>
                    </Marker>
                  ))}
                  {selectedRoute && selectedRoute.geometry && (
                    <Polyline positions={selectedRoute.geometry.map(c=>[c.lat,c.lng])} pathOptions={{color:selectedRoute.isSafest?"#16a34a":"#6366f1",weight:selectedRoute.isMain?5:3,opacity:selectedRoute.isMain?1:0.7,dashArray:selectedRoute.isMain?null:"10,10"}}/>
                  )}
                </MapContainer>
              </div>
              {/* Legend */}
              <div style={{ marginTop:12, display:"flex", flexWrap:"wrap", gap:"8px 18px" }}>
                {[
                  { type:"dot", color:"#2563EB", label:"Police" },
                  { type:"dot", color:"#DC2626", label:"Hospital" },
                  { type:"dot", color:"#16A34A", label:"Market/Mall" },
                  { type:"dot", color:"#EF4444", label:"Unsafe Report" },
                  { type:"line", color:"#16A34A", label:"Safest Route" },
                  { type:"dot", color:"#3B82F6", label:"Your Location" },
                ].map(l => (
                  <span key={l.label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#64748B" }}>
                    {l.type === "dot"
                      ? <span className="rf-legend-dot" style={{background:l.color}}/>
                      : <span className="rf-legend-line" style={{background:l.color}}/>
                    }
                    {l.label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Turn-by-turn panel ── */}
            {showRouteDetails && routeSteps.length > 0 && (
              <div className="rf-card" style={{ padding:"16px 16px", maxHeight:280, overflowY:"auto" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                  <span style={{ fontSize:16 }}>🧭</span>
                  <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, color:"#0F172A" }}>Turn-by-Turn Directions</span>
                </div>
                {routeSteps.map((step, index) => (
                  <div key={step.id} className={`rf-step-item ${index===currentStep?"active":index<currentStep?"done":""}`}>
                    <div style={{ width:26, height:26, borderRadius:"50%", background:index===currentStep?"#2563EB":index<currentStep?"#10B981":"#E2E8F0", color:index<=currentStep?"white":"#64748B", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>
                      {index < currentStep ? "✓" : index+1}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"#0F172A" }}>{step.instruction}</div>
                      <div style={{ fontSize:11, color:"#94A3B8", marginTop:2 }}>{formatDistance(step.distance)} · {formatDuration(step.duration)}{step.name ? ` · ${step.name}` : ""}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Routes List ── */}
            <div className="rf-card" style={{ padding:"20px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
                <span style={{ fontSize:16 }}>🛣️</span>
                <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:15, color:"#0F172A" }}>Available Routes</span>
                {routes.length > 0 && <span style={{ marginLeft:"auto", fontSize:12, color:"#64748B", background:"#F1F5F9", padding:"3px 10px", borderRadius:999 }}>{routes.length} route{routes.length>1?"s":""} found</span>}
              </div>

              {routes.length === 0 ? (
                <div style={{ textAlign:"center", padding:"32px 0", color:"#94A3B8" }}>
                  <div style={{ fontSize:32, marginBottom:10 }}>🗺️</div>
                  <div style={{ fontSize:14, fontWeight:600, color:"#64748B", marginBottom:4 }}>
                    {startLocation && endLocation ? "Ready to search" : "Enter your journey details"}
                  </div>
                  <div style={{ fontSize:12, color:"#94A3B8" }}>
                    {startLocation && endLocation ? "Click 'Find Routes' above to see safe routes" : "Type a start and destination to get started"}
                  </div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {routes.map((route) => {
                    const safety = getSafetyLabel(route.safetyScore);
                    const isSelected = selectedRoute?.id === route.id;
                    return (
                      <div key={route.id} className={`rf-route-card ${isSelected?"selected":""}`} onClick={() => handleRouteSelect(route)}>
                        {/* Top row */}
                        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight:800, color:"#0F172A" }}>{route.name}</span>
                            {route.isSafest && (
                              <span style={{ fontSize:11, fontWeight:700, background:"rgba(16,185,129,.1)", color:"#059669", padding:"3px 9px", borderRadius:999, border:"1px solid rgba(16,185,129,.2)" }}>
                                🛡️ Recommended
                              </span>
                            )}
                            {isSelected && (
                              <span style={{ fontSize:11, fontWeight:700, background:"rgba(37,99,235,.1)", color:"#2563EB", padding:"3px 9px", borderRadius:999, border:"1px solid rgba(37,99,235,.2)" }}>
                                ✓ Active
                              </span>
                            )}
                          </div>
                          {/* Safety badge — label only, NO raw score */}
                          <span style={{ fontSize:12, fontWeight:700, padding:"5px 12px", borderRadius:999, background:safety.bg, color:safety.color, border:`1px solid ${safety.border}`, whiteSpace:"nowrap", flexShrink:0 }}>
                            {safety.icon} {safety.label}
                          </span>
                        </div>

                        {/* Stars */}
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                          {renderStars(route.rating || convertScoreToRating(route.safetyScore))}
                          <span style={{ fontSize:11, color:"#94A3B8" }}>Safety rating</span>
                        </div>

                        {/* Stats row */}
                        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <svg viewBox="0 0 16 16" fill="none" stroke="#64748B" strokeWidth="1.6" style={{width:13,height:13}}><path strokeLinecap="round" d="M2 8a6 6 0 1112 0A6 6 0 012 8z"/><path strokeLinecap="round" d="M8 5v3l2 2"/></svg>
                            <span style={{ fontSize:12, color:"#64748B", fontWeight:600 }}>{formatDuration(route.duration)}</span>
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <svg viewBox="0 0 16 16" fill="none" stroke="#64748B" strokeWidth="1.6" style={{width:13,height:13}}><path strokeLinecap="round" strokeLinejoin="round" d="M2 8h12M10 4l4 4-4 4"/></svg>
                            <span style={{ fontSize:12, color:"#64748B", fontWeight:600 }}>{formatDistance(route.distance)}</span>
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <svg viewBox="0 0 16 16" fill="none" stroke="#64748B" strokeWidth="1.6" style={{width:13,height:13}}><path strokeLinecap="round" d="M8 2a3 3 0 100 6 3 3 0 000-6zm0 8c-3 0-5 1.5-5 2.5V14h10v-1.5c0-1-2-2.5-5-2.5z"/></svg>
                            <span style={{ fontSize:12, color:"#64748B" }}>{route.description}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {routes.length > 1 && (
                <div style={{ marginTop:14, padding:"10px 14px", background:"linear-gradient(135deg,#EFF6FF,#F0F9FF)", borderRadius:10, border:"1px solid rgba(37,99,235,.15)", display:"flex", alignItems:"flex-start", gap:8 }}>
                  <span style={{ fontSize:15, flexShrink:0 }}>💡</span>
                  <span style={{ fontSize:12, color:"#2563EB", fontWeight:500, lineHeight:1.5 }}>
                    Routes are sorted by safety rating. The <strong>Recommended</strong> route offers the best combination of safety and distance.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ══ RIGHT SIDEBAR ══ */}
          <div style={{ width:300, flexShrink:0 }}>
            <div className="rf-card" style={{ padding:"18px" }}>
              {/* Header */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <div>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:800, color:"#0F172A" }}>Community Feed</div>
                  <div style={{ fontSize:11, color:"#94A3B8", marginTop:1 }}>Live safety reports nearby</div>
                </div>
                <div style={{ background:"linear-gradient(135deg,#EFF6FF,#EEF2FF)", color:"#2563EB", fontSize:13, fontWeight:800, padding:"4px 10px", borderRadius:999, border:"1px solid rgba(37,99,235,.2)", display:"flex", alignItems:"center", gap:5 }}>
                  <span className="live-dot" style={{ width:6, height:6, borderRadius:"50%", background:"#EF4444", display:"inline-block" }}/>
                  {reportsCount}
                </div>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:0, maxHeight:420, overflowY:"auto" }}>
                {feedList.map(report => (
                  <div key={report.id} className={`rf-feed-item ${dangerousTypes.includes(report.type)?"danger":"safe"}`}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                      <span style={{ fontSize:13 }}>{dangerousTypes.includes(report.type)?"⚠️":"✅"}</span>
                      <span style={{ fontSize:13, fontWeight:700, color: dangerousTypes.includes(report.type)?"#DC2626":"#15803D", textTransform:"capitalize" }}>{report.type}</span>
                      <span style={{ marginLeft:"auto", fontSize:10, color:"#94A3B8" }}>{report.time}</span>
                    </div>
                    {report.description && <div style={{ fontSize:12, color:"#64748B", lineHeight:1.5, paddingLeft:20 }}>{report.description}</div>}
                  </div>
                ))}
                {feedList.length === 0 && (
                  <div style={{ textAlign:"center", padding:"28px 0", color:"#94A3B8" }}>
                    <div style={{ fontSize:28, marginBottom:6 }}>✅</div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#64748B" }}>No reports yet</div>
                    <div style={{ fontSize:11, color:"#94A3B8" }}>Your area looks safe!</div>
                  </div>
                )}
              </div>

              <button onClick={() => isLoggedIn() ? setPage("community") : setPage("login")}
                style={{ marginTop:14, width:"100%", padding:"10px", background:"linear-gradient(135deg,#EFF6FF,#EEF2FF)", border:"1.5px solid rgba(37,99,235,.2)", borderRadius:10, color:"#2563EB", fontSize:13, fontWeight:700, cursor:"pointer", transition:"all .18s", fontFamily:"'DM Sans',sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.background="linear-gradient(135deg,#DBEAFE,#EDE9FE)"}
                onMouseLeave={e => e.currentTarget.style.background="linear-gradient(135deg,#EFF6FF,#EEF2FF)"}>
                View All Reports →
              </button>
            </div>

            {/* Safety tips card */}
            <div className="rf-card" style={{ padding:"16px", marginTop:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
                <span style={{ fontSize:15 }}>🛡️</span>
                <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:13, color:"#0F172A" }}>Safety Reminder</span>
              </div>
              {[
                "Share your live location with a trusted contact",
                "Prefer well-lit and populated streets at night",
                "Keep SOS button accessible at all times",
              ].map((tip, i) => (
                <div key={i} style={{ display:"flex", gap:8, marginBottom:i<2?10:0 }}>
                  <span style={{ fontSize:12, color:"#2563EB", fontWeight:700, flexShrink:0, marginTop:1 }}>{i+1}.</span>
                  <span style={{ fontSize:12, color:"#64748B", lineHeight:1.5 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default RouteFinder;
