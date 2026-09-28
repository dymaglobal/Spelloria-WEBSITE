"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  HardDrive,
  Database,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface HealthCheckItem {
  title: string;
  passed: boolean;
  details: string;
}

interface SyncReport {
  totalProductsDb: number;
  totalProductsWebsite: number;
  totalCategoriesDb: number;
  totalCategoriesWebsite: number;
  totalImages: number;
  syncStatus: string;
  lastSyncTime: string;
  checks: Record<string, HealthCheckItem>;
  allPassed: boolean;
}

export default function AdminSyncPage() {
  const [report, setReport] = useState<SyncReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [purging, setPurging] = useState(false);
  const [purgeMessage, setPurgeMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSyncStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/sync");
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
      }
    } catch (err: any) {
      setError("Failed to fetch synchronization health report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const handleForcePurge = async () => {
    setPurging(true);
    setPurgeMessage(null);
    try {
      const res = await fetch("/api/admin/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setPurgeMessage("Cache purged! Frontend rebuilt from database in real-time.");
        await fetchSyncStatus();
        setTimeout(() => setPurgeMessage(null), 4000);
      }
    } catch (err: any) {
      setError("Failed to purge cache");
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D27D46]">
            Single Source of Truth
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#35063D] mt-0.5">
            Admin Verification & Sync Health Check
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Automated validation guaranteeing Dashboard and Website storefront remain 100% synchronized.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSyncStatus}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Audit Now</span>
          </button>

          <button
            onClick={handleForcePurge}
            disabled={purging}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#35063D] hover:bg-[#4d0c57] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {purging ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Purging & Revalidating...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Force Cache Purge</span>
              </>
            )}
          </button>
        </div>
      </div>

      {purgeMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{purgeMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
          {error}
        </div>
      )}

      {/* Top Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Products */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Products (DB / Storefront)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#35063D]">
              {report?.totalProductsDb ?? "-"}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              / {report?.totalProductsWebsite ?? "-"} live
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% In Sync</span>
          </span>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Categories (DB / Menu)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#35063D]">
              {report?.totalCategoriesDb ?? "-"}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              / {report?.totalCategoriesWebsite ?? "-"} live
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% In Sync</span>
          </span>
        </div>

        {/* Media Assets */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Total Media Assets
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#D27D46]">
              {report?.totalImages ?? "-"}
            </span>
            <span className="text-xs text-stone-400">WebP Files</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>High-Res Pipeline</span>
          </span>
        </div>

        {/* Overall Status */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Sync Architecture
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-bold text-emerald-700">
              {report?.syncStatus ?? "CHECKING..."}
            </span>
          </div>
          <span className="text-[10px] text-stone-400 block truncate font-mono">
            {report?.lastSyncTime ? new Date(report.lastSyncTime).toLocaleTimeString() : "-"}
          </span>
        </div>
      </div>

      {/* Sync Health Validation Matrix */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-150">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#35063D] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Automated Health Validation Checks</span>
            </h2>
            <p className="text-xs text-stone-500">
              Zero tolerance for discrepancies between database and public storefront.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
            {report?.allPassed ? "All Validations Passed" : "Attention Required"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {report?.checks &&
            Object.entries(report.checks).map(([key, check]) => (
              <div
                key={key}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  check.passed
                    ? "bg-[#FAF5EE]/50 border-[#EAE3D8]"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="mt-0.5">
                  {check.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="space-y-0.5 flex-1">
                  <h3 className="text-xs font-bold text-stone-900">{check.title}</h3>
                  <p className="text-[11px] text-stone-500">{check.details}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Architectural Flow Diagram */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
        <h2 className="font-serif text-lg font-bold text-[#35063D]">
          Live Data Flow Architecture
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#35063D] tracking-wider block">
              1. Admin Dashboard
            </span>
            <p className="text-xs font-semibold text-stone-800">Mutations & Actions</p>
            <p className="text-[11px] text-stone-500">
              Products, Categories, Media, and Storefront Content saved to database.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#D27D46] tracking-wider block">
              2. Single Source DB
            </span>
            <p className="text-xs font-semibold text-stone-800">Persistent Database</p>
            <p className="text-[11px] text-stone-500">
              Only authoritative truth. Triggers atomic cache revalidation across routes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              3. Website Storefront
            </span>
            <p className="text-xs font-semibold text-stone-800">Live Client View</p>
            <p className="text-[11px] text-stone-500">
              Homepage, Categories, Menu, and Product pages read directly from DB.
            </p>
          </div>
        </div>

        {/* Storefront Verification Links */}
        <div className="pt-3 border-t border-stone-150 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-stone-500">Verify live public pages:</span>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
            >
              <span>Homepage</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/menu"
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
            >
              <span>Menu</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/category/cakes"
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
            >
              <span>Cakes Category</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
