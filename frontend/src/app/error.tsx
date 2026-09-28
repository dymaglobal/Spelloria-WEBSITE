"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client-side error to telemetry/monitoring
    console.error("Application error captured:", error);
  }, [error]);

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-gradient-to-b from-[#faf8f5] to-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 text-rose-600 shadow-inner mb-2">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-rose-700">
            System Notice
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            We encountered an unexpected error while preparing this page. Please try refreshing or return to the homepage.
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-gray-400">Error reference: {error.digest}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#6d2842] hover:bg-[#582035] text-white text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-all duration-200 active:scale-95"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
