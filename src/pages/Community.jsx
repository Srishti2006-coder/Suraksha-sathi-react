import React, { useState, useEffect } from "react";

const Community = ({ setPage }) => {
  const [reports, setReports] = useState([]);

  // Sample community reports
  const sampleReports = [
    {
      id: 1,
      type: "unsafe",
      location: "Near City Park",
      time: "2 hours ago",
      description: "Poor lighting in the area during night hours",
      reportedBy: "Anonymous",
    },
    {
      id: 2,
      type: "safe",
      location: "Main Market Road",
      time: "5 hours ago",
      description: "Well-lit and crowded area, safe to travel",
      reportedBy: "Community Member",
    },
    {
      id: 3,
      type: "unsafe",
      location: "Back Lane",
      time: "1 day ago",
      description: "Suspicious activity reported by multiple users",
      reportedBy: "Anonymous",
    },
    {
      id: 4,
      type: "safe",
      location: "Police Station Area",
      time: "2 days ago",
      description: "Very safe area with police presence",
      reportedBy: "Anonymous",
    },
    {
      id: 5,
      type: "unsafe",
      location: "Metro Station Exit",
      time: "3 days ago",
      description: "Harassment reported in this area",
      reportedBy: "Anonymous",
    },
  ];

  useEffect(() => {
    setReports(sampleReports);
  }, []);

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
            onClick={() => setPage("report")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Report Area
          </button>
        </div>

        {/* Reports List */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Recent Reports</h3>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className={`p-4 rounded-lg border ${
                  report.type === "unsafe"
                    ? "border-red-200 bg-red-50"
                    : "border-green-200 bg-green-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg ${
                        report.type === "unsafe" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {report.type === "unsafe" ? "⚠️" : "✅"}
                    </span>
                    <span
                      className={`font-semibold ${
                        report.type === "unsafe" ? "text-red-700" : "text-green-700"
                      }`}
                    >
                      {report.type === "unsafe" ? "Unsafe" : "Safe"}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{report.time}</span>
                </div>
                <div className="mt-2">
                  <p className="font-medium text-slate-700">{report.location}</p>
                  <p className="text-sm text-slate-600 mt-1">{report.description}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    Reported by: {report.reportedBy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
