import React, { useState, useEffect } from "react";
import { reportsAPI, isLoggedIn } from "../utils/api";

const Community = ({ setPage }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await reportsAPI.getAll(0, 50);
      setReports(data.reports || []);
    } catch (err) {
      console.error("Error loading reports:", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const getTypeEmoji = (type) => {
    const types = {
      harassment: "😠",
      assault: "⚠️",
      theft: "👜",
      suspicious: "👀",
      other: "❓"
    };
    return types[type] || "❓";
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <div className="max-w-6xl mx-auto mt-4 px-4 pb-8">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="font-semibold text-xl">Community</h2>
        <p className="mt-2 text-slate-600">
          See and submit reports from the community. Reports appear on the map and
          in the feed.
        </p>
        <div className="mt-4">
          <button
            onClick={() => isLoggedIn() ? setPage("report") : setPage("login")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Report Area
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-6 text-center py-8">
            <div className="text-slate-500">Loading reports...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <button onClick={loadReports} className="ml-2 underline">Try again</button>
          </div>
        )}

        {/* Reports List */}
        {!loading && !error && (
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Recent Reports ({reports.length})</h3>
            
            {reports.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <div className="text-4xl mb-2">📭</div>
                <p>No reports yet. Be the first to report!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report._id}
                    className={`p-4 rounded-lg border ${
                      report.type === "unsafe" || report.type === "harassment" || report.type === "assault" || report.type === "theft" || report.type === "suspicious"
                        ? "border-red-200 bg-red-50"
                        : "border-green-200 bg-green-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getTypeEmoji(report.type)}
                        </span>
                        <span
                          className={`font-semibold ${
                            report.type === "harassment" || report.type === "assault" || report.type === "theft" || report.type === "suspicious"
                              ? "text-red-700"
                              : "text-green-700"
                          }`}
                        >
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatTime(report.timestamp || report.createdAt)}
                      </span>
                    </div>
                    <div className="mt-2">
                      {report.note && (
                        <p className="font-medium text-slate-700">{report.note}</p>
                      )}
                      <p className="text-sm text-slate-500 mt-1">
                        📍 {report.lat?.toFixed(4)}, {report.lng?.toFixed(4)}
                      </p>
                      {report.userName && (
                        <p className="text-xs text-slate-400 mt-2">
                          Reported by: {report.userName}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
