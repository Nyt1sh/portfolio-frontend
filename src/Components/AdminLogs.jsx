// src/components/AdminLogs.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("time_desc");
  const [geoData, setGeoData] = useState({}); 

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/api/admin/logs");
        setLogs(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    const uniqueIps = Array.from(new Set(logs.map((l) => l.ipAddress))).filter(
      (ip) => !geoData[ip]
    );

    uniqueIps.forEach((ip) => {
      if (!ip || ip === "0:0:0:0:0:0:0:1" || ip === "127.0.0.1") {
        setGeoData((prev) => ({
          ...prev,
          [ip]: {
            country: "Localhost",
            region: "-",
            org: "-",
            lat: "-",
            lon: "-",
            timezone: "-"
          }
        }));
        return;
      }

      fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`)
        .then((res) => res.json())
        .then((data) => {
          setGeoData((prev) => ({
            ...prev,
            [ip]: {
              country: data.country_name || "Unknown",
              region: data.region || "-",
              org: data.org || "Unknown ISP",
              lat: data.latitude || "-",
              lon: data.longitude || "-",
              timezone: data.timezone || "-"
            }
          }));
        })
        .catch(() => {
          setGeoData((prev) => ({
            ...prev,
            [ip]: {
              country: "Unknown",
              region: "-",
              org: "-",
              lat: "-",
              lon: "-",
              timezone: "-"
            }
          }));
        });
    });
  }, [logs, geoData]);

  if (loading) return <p className="text-gray-400">Loading logs...</p>;

  const filtered = logs.filter((log) => {
    const geo = geoData[log.ipAddress] || {};
    return (
      `${log.ipAddress} ${log.browser} ${log.deviceType} ${geo.country} ${geo.region}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "time_desc") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "time_asc") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "ip") return a.ipAddress.localeCompare(b.ipAddress);
    if (sortBy === "browser") return a.browser.localeCompare(b.browser);
    if (sortBy === "device") return a.deviceType.localeCompare(b.deviceType);
    return 0;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-2xl font-semibold">Request Logs (Last 100)</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search by location, IP, browser..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
          >
            <option value="time_desc">Newest First</option>
            <option value="time_asc">Oldest First</option>
            <option value="ip">IP Address</option>
            <option value="browser">Browser</option>
            <option value="device">Device</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-gray-800/50 rounded-lg p-4">
        <table className="min-w-full text-sm">
          <thead className="border-b border-gray-700">
            <tr className="text-left">
              <th className="py-2 pr-4">IP</th>
              <th className="py-2 pr-4">Country</th>
              <th className="py-2 pr-4">Region</th>
              <th className="py-2 pr-4">Org</th>
              <th className="py-2 pr-4">Lat</th>
              <th className="py-2 pr-4">Lon</th>
              <th className="py-2 pr-4">Timezone</th>
              <th className="py-2 pr-4">Device</th>
              <th className="py-2 pr-4">Browser</th>
              <th className="py-2 pr-4">Time</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((log) => {
              const geo = geoData[log.ipAddress] || {};
              return (
                <tr key={log.id} className="border-b border-gray-800">
                  <td className="py-2 pr-4">{log.ipAddress}</td>
                  <td className="py-2 pr-4">{geo.country}</td>
                  <td className="py-2 pr-4">{geo.region}</td>
                  <td className="py-2 pr-4">{geo.org}</td>
                  <td className="py-2 pr-4">{geo.lat}</td>
                  <td className="py-2 pr-4">{geo.lon}</td>
                  <td className="py-2 pr-4">{geo.timezone}</td>
                  <td className="py-2 pr-4">{log.deviceType}</td>
                  <td className="py-2 pr-4">{log.browser}</td>
                  <td className="py-2 pr-4">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              );
            })}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={10} className="py-4 text-center text-gray-400">
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLogs;
