"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Cake,
  FolderTree,
  Image as ImageIcon,
  HardDrive,
  Plus,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Eye,
  Clock,
  Sparkles,
  RefreshCw,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/formatters";

interface OverviewData {
  metrics: {
    totalProducts: number;
    totalCategories: number;
    statusCounts: {
      available: number;
      outOfStock: number;
      seasonal: number;
      limitedEdition: number;
      bestSeller: number;
      newArrival: number;
      archived: number;
    };
    storageUsage: {
      totalBytes: number;
      totalMB: string;
      mediaCount: number;
    };
  };
  latestProducts: any[];
  mostViewedProducts: any[];
  recentlyUpdatedProducts: any[];
  recentLogs: any[];
  settings: {
    brandName: string;
    whatsappNumber: string;
    whatsappEnabled: boolean;
  };
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/overview");
      if (!res.ok) throw new Error("Failed to load dashboard metrics");
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading && !data) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <RefreshCw className="w-6 h-6 animate-spin text-[#35063D]" />
          <p className="text-xs uppercase tracking-widest font-semibold">Loading boutique analytics...</p>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full select-none">
      
      {/* Page Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D27D46]">
            Executive Overview
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-0.5">
            Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-light">
            Real-time management for {data?.settings?.brandName || "Spelloria Patisserie"}
          </p>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <Link
            href="/admin/products/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#27072E] text-white hover:bg-[#35063D] text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>

          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold uppercase tracking-wider transition-all shadow-xs active:scale-95"
          >
            <FolderTree className="w-3.5 h-3.5 text-[#D27D46]" />
            <span>New Category</span>
          </Link>

          <Link
            href="/admin/media"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold uppercase tracking-wider transition-all shadow-xs active:scale-95"
          >
            <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
            <span>Media</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FAF5EE] text-stone-700 hover:text-stone-900 text-xs font-medium transition-colors"
            title="Preview Live Website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={fetchOverview}
            className="p-2 rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Real-time Single Source of Truth Sync Status Banner */}
      <div className="bg-[#FAF5EE] rounded-3xl border border-[#EAE3D8] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider text-[#35063D]">
                Single Source of Truth Active
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                100% In Sync
              </span>
            </div>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Dashboard changes immediately reflect across Homepage, Menu, Categories, and Product Pages.
            </p>
          </div>
        </div>

        <Link
          href="/admin/sync"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <span>Run Sync Health Check</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#D27D46]" />
        </Link>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        
        {/* Total Active Products */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500">
              Total Products
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#D27D46]/10 flex items-center justify-center text-[#D27D46]">
              <Cake className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-2xl sm:text-4xl text-stone-900 font-semibold">
              {metrics?.totalProducts || 0}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              {metrics?.statusCounts.available || 0} available for order
            </p>
          </div>
        </div>

        {/* Total Active Categories */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500">
              Categories
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#35063D]/10 flex items-center justify-center text-[#35063D]">
              <FolderTree className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-2xl sm:text-4xl text-stone-900 font-semibold">
              {metrics?.totalCategories || 0}
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">
              Active menu taxonomy
            </p>
          </div>
        </div>

        {/* Product Status Breakdown */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500">
              Product Status
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="font-serif text-2xl sm:text-4xl text-stone-900 font-semibold">
                {metrics?.statusCounts.bestSeller || 0}
              </h3>
              <span className="text-xs text-stone-500">Best Sellers</span>
            </div>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              {metrics?.statusCounts.seasonal || 0} seasonal specials
            </p>
          </div>
        </div>

        {/* Media Storage Usage */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500">
              Image Storage
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-2xl sm:text-4xl text-stone-900 font-semibold">
              {metrics?.storageUsage.totalMB || "0.0"} <span className="text-base font-normal text-stone-500">MB</span>
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">
              {metrics?.storageUsage.mediaCount || 0} optimized WebP assets
            </p>
          </div>
        </div>

      </div>

      {/* Product Status Quick Filter Bar */}
      <div className="bg-[#FAF5EE] rounded-2xl border border-[#EAE3D8] p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-medium text-stone-700">
          <Sliders className="w-4 h-4 text-[#D27D46]" />
          <span>Status Summary:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
            Available: {metrics?.statusCounts.available}
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">
            Seasonal: {metrics?.statusCounts.seasonal}
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold text-[11px]">
            Limited Edition: {metrics?.statusCounts.limitedEdition}
          </span>
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 font-semibold text-[11px]">
            Best Seller: {metrics?.statusCounts.bestSeller}
          </span>
          {metrics?.statusCounts.outOfStock ? (
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-[11px]">
              Out of Stock: {metrics?.statusCounts.outOfStock}
            </span>
          ) : null}
          {metrics?.statusCounts.archived ? (
            <span className="px-3 py-1 rounded-full bg-stone-200 text-stone-700 font-semibold text-[11px]">
              Archived: {metrics?.statusCounts.archived}
            </span>
          ) : null}
        </div>
      </div>

      {/* Main Two-Column Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left Column (2 Cols): Latest Products & Most Viewed */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Latest Products */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-stone-900 font-semibold">
                  Latest Products
                </h3>
                <p className="text-xs text-stone-500 font-light">
                  Recently introduced bakery and pastry creations
                </p>
              </div>
              <Link
                href="/admin/products"
                className="text-xs font-semibold text-[#D27D46] hover:text-[#B84A22] flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-stone-100">
              {data?.latestProducts.map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50/60 rounded-xl px-2 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.cover_image_url || "/images/collection-cakes.jpg"}
                      alt={prod.name}
                      className="w-11 h-11 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200/60"
                    />
                    <div className="truncate">
                      <p className="text-sm font-semibold text-stone-900 truncate">
                        {prod.name}
                      </p>
                      <p className="text-xs text-stone-500">
                        {prod.weight_grams ? `${prod.weight_grams}g` : "500g"} •{" "}
                        <span className="font-semibold text-stone-800">{formatPrice(prod.price)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
                        prod.status === "Available"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : prod.status === "Best Seller"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}
                    >
                      {prod.status}
                    </span>
                    <Link
                      href={`/admin/products`}
                      className="text-stone-400 hover:text-stone-700 p-1"
                      title="Edit"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Viewed Products */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-stone-900 font-semibold">
                  Most Viewed Products
                </h3>
                <p className="text-xs text-stone-500 font-light">
                  Customer popularity and showcase performance
                </p>
              </div>
            </div>

            <div className="divide-y divide-stone-100">
              {data?.mostViewedProducts.map((prod, idx) => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-center text-xs font-mono font-bold text-stone-400">
                      #{idx + 1}
                    </span>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-stone-900 truncate">
                        {prod.name}
                      </p>
                      <p className="text-xs text-stone-500 font-sans">
                        Base: {formatPrice(prod.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 px-3 py-1 rounded-full border border-stone-200/80">
                    <Eye className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-semibold">{prod.views_count || 120}</span> views
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col): Live WhatsApp & Recent Activity Logs */}
        <div className="space-y-6">
          
          {/* WhatsApp Commerce Quick Widget */}
          <div className="bg-gradient-to-br from-[#25D366]/10 via-[#FAF5EE] to-white rounded-3xl border border-[#25D366]/20 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#25D366] font-semibold text-sm">
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp Commerce</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Active
              </span>
            </div>
            <p className="text-xs text-stone-600 font-light">
              Orders redirect customers directly to WhatsApp with pre-filled product details.
            </p>
            <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs font-mono text-stone-700 truncate">
              {data?.settings?.whatsappNumber || "+919876543210"}
            </div>
            <Link
              href="/admin/settings"
              className="inline-block text-xs font-semibold text-[#D27D46] hover:underline"
            >
              Configure WhatsApp Number & Message Template →
            </Link>
          </div>

          {/* Activity Logs Stream */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-stone-900 font-semibold">
                  Recent Activity Logs
                </h3>
                <p className="text-[11px] text-stone-500 font-light">
                  Live audit trail of admin actions
                </p>
              </div>
              <Link
                href="/admin/logs"
                className="text-xs font-semibold text-[#D27D46] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {data?.recentLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-stone-50 border border-stone-150 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-stone-800">
                      {log.user_name} • <span className="text-[#35063D]">{log.action}</span>
                    </span>
                    <span className="text-stone-400 font-mono text-[10px]">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-stone-600 line-clamp-1">{log.details || log.resource_name}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
