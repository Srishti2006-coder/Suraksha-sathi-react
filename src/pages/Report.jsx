import { useState, useEffect } from "react";
import { reportsAPI, isLoggedIn } from "../utils/api";

const Report = ({ setPage }) => {
  const [reportType, setReportType] = useState("harassment");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      setPage("login");
      return;
    }
    
    getLocation();
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (err) => {
        setLocationError("Unable to get location: " + err.message);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!location) {
      setError("Location not available. Please enable location services.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await reportsAPI.submit({
        type: reportType,
        lat: location.lat,
        lng: location.lng,
        note: description
      });

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    { value: "harassment", label: "Harassment", emoji: "😠" },
    { value: "assault", label: "Assault", emoji: "⚠️" },
    { value: "theft", label: "Theft", emoji: "👜" },
    { value: "suspicious", label: "Suspicious Activity", emoji: "👀" },
    { value: "other", label: "Other", emoji: "❓" }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen p-10 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Report Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for keeping the community safe.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setDescription("");
              getLocation();
            }}
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Submit Another Report
          </button>
          <button
            onClick={() => setPage("community")}
            className="ml-4 px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            View Community Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Report Unsafe Area
        </h1>
        <p className="text-gray-600 mb-8">
          Help keep the community safe by reporting unsafe areas
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {locationError && !location && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {locationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Location Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Your Location</label>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded">
              <div className={`w-4 h-4 rounded-full ${location ? "bg-green-500" : "bg-red-500"}`}></div>
              <div className="text-sm">
                {location 
                  ? `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`
                  : "Fetching location..."
                }
              </div>
            </div>
          </div>

          {/* Report Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Type of Incident</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {reportTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setReportType(type.value)}
                  className={`p-3 rounded-lg border-2 transition ${
                    reportType === type.value
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{type.emoji}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened or why this area is unsafe..."
              className="w-full border p-3 rounded-lg"
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !location}
            className={`w-full py-3 rounded-lg font-medium transition ${
              loading || !location
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your report will be visible to the community and help others stay safe
          </p>
        </form>
      </div>
    </div>
  );
};

export default Report;
