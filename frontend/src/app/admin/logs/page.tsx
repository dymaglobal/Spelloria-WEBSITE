"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  Shield,
  Layers,
  Sparkles,
  Loader2,
  Calendar,
} from "lucide-react";
import { DBActivityLog } from "@/lib/db/types";

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<DBActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("ALL");
  const [selectedResource, setSelectedResource] = useState<string>("ALL");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/logs?limit=150");
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "LOGIN":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "LOGOUT":
        return "bg-stone-200 text-stone-700 border-stone-300";
      case "CREATE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "UPDATE":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "DELETE":
        return "bg-red-50 text-red-700 border-red-200";
      case "DUPLICATE":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "ARCHIVE":
      case "RESTORE":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "UPLOAD":
        return "bg-purple-50 text-[#35063D] border-purple-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      search === "" ||
      log.details?.toLowerCase().includes(search.toLowerCase()) ||
      log.resource_name?.toLowerCase().includes(search.toLowerCase()) ||
      log.user_name.toLowerCase().includes(search.toLowerCase());

    const matchesAction =
      selectedAction === "ALL" || log.action === selectedAction;

    const matchesResource =
      selectedResource === "ALL" || log.resource_type === selectedResource;

    return matchesSearch && matchesAction && matchesResource;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D27D46]">
            Security & Audit Trail
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#35063D] mt-0.5">
            Activity Logs
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Immutable audit record of administrative logins, content mutations, and catalog actions.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search by action, name, or admin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-stone-200 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-[#35063D]"
            />
          </div>

          {/* Action Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-stone-400 font-medium mr-1">Action:</span>
            {["ALL", "LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE", "UPLOAD"].map(
              (act) => (
                <button
                  key={act}
                  onClick={() => setSelectedAction(act)}
                  className={`px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                    selectedAction === act
                      ? "bg-[#35063D] text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {act}
                </button>
              )
            )}
          </div>
        </div>

        {/* Resource Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-1 border-t border-stone-100">
          <span className="text-stone-400 font-medium mr-1">Resource:</span>
          {["ALL", "PRODUCT", "CATEGORY", "MEDIA", "SETTINGS", "AUTH"].map(
            (res) => (
              <button
                key={res}
                onClick={() => setSelectedResource(res)}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                  selectedResource === res
                    ? "bg-[#D27D46] text-white font-bold"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {res}
              </button>
            )
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF5EE] border-b border-[#EAE3D8] text-stone-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Administrator</th>
                <th className="p-4">Action</th>
                <th className="p-4">Resource</th>
                <th className="p-4">Target Item</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150/80 text-stone-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-stone-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#35063D] mb-2" />
                    <span>Loading audit records...</span>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-stone-400">
                    <Activity className="w-8 h-8 mx-auto text-stone-300 mb-2 stroke-1" />
                    <p className="font-semibold text-stone-600">No activity recorded</p>
                    <p className="text-[11px] mt-1">Actions performed across the dashboard will appear here in real-time.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const logDate = new Date(log.created_at);
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-stone-50/80 transition-colors"
                    >
                      {/* Timestamp */}
                      <td className="p-4 whitespace-nowrap text-stone-500 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                          <span className="text-[10px] text-stone-400">
                            {logDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </td>

                      {/* User */}
                      <td className="p-4 whitespace-nowrap font-medium text-stone-900">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#35063D]" />
                          <span>{log.user_name}</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getActionBadgeColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Resource */}
                      <td className="p-4 whitespace-nowrap">
                        <span className="text-stone-600 font-semibold text-[11px] uppercase tracking-wider">
                          {log.resource_type}
                        </span>
                      </td>

                      {/* Target Name */}
                      <td className="p-4 font-semibold text-stone-800 max-w-[180px] truncate" title={log.resource_name || "-"}>
                        {log.resource_name || "-"}
                      </td>

                      {/* Details */}
                      <td className="p-4 text-stone-600 text-xs">
                        {log.details || "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
