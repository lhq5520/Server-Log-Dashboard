// app/logs/page.tsx
"use client";

import { useState, useEffect } from "react";

interface LogStats {
  totalLines: number;
  okCount: number;
  failCount: number;
  lastUpdate: string;
}

export default function LogDashboard() {
  const [availableFiles] = useState<string[]>([
    "WeifanWrt_backup.log",
    // add more log in the future：
    // 'system.log',
    // 'nginx.log',
  ]);
  const [selectedFile, setSelectedFile] = useState<string>(
    "WeifanWrt_backup.log",
  );
  const [logs, setLogs] = useState<string>("");
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<LogStats | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/logs?file=${selectedFile}`);
      const content = await res.text();
      setLogs(content);
      calculateStats(content);
    } catch (error) {
      alert("Failed to load logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedFile]);

  const calculateStats = (content: string) => {
    const lines = content.split("\n");
    setStats({
      totalLines: lines.length,
      okCount: lines.filter((l) => l.includes("[OK]")).length,
      failCount: lines.filter((l) => l.includes("[FAIL]")).length,
      lastUpdate: new Date().toLocaleString(),
    });
  };

  const filteredLogs = logs
    .split("\n")
    .filter((line) => line.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Server Log Dashboard
          </h1>

          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium"
            >
              {availableFiles.map((file) => (
                <option key={file} value={file}>
                  {file}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Filter logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
            />

            <button
              onClick={fetchLogs}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Total Lines</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalLines}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Success</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.okCount}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Failures</div>
              <div className="text-2xl font-bold text-red-600">
                {stats.failCount}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Last Update</div>
              <div className="text-sm font-medium text-gray-900">
                {stats.lastUpdate}
              </div>
            </div>
          </div>
        )}

        {/* Log Content */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-6">
          <div className="font-mono text-sm overflow-auto max-h-[600px] space-y-0.5">
            {filteredLogs.map((line, i) => (
              <div
                key={i}
                className={`
                  ${line.includes("[OK]") ? "text-green-400" : ""}
                  ${line.includes("[FAIL]") ? "text-red-400" : ""}
                  ${line.includes("===") ? "text-yellow-400 font-bold" : "text-gray-300"}
                  ${line.includes("Backup start") ? "mt-2 pt-2 border-t border-gray-700" : ""}
                `}
              >
                {line || "\u00A0"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
