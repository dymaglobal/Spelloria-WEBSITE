"use client";

import { useEffect } from "react";

export default function RootGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root layout fatal error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#faf8f5] text-gray-900 font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Spelloria Patisserie
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              An unexpected system interruption occurred. We apologize for the inconvenience.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 rounded-xl bg-[#6d2842] hover:bg-[#582035] text-white font-medium transition-all shadow cursor-pointer"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
