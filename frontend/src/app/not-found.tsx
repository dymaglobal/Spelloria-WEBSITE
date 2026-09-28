import Link from "next/link";
import { ArrowLeft, Home, UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-gradient-to-b from-[#faf8f5] to-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#f4ece1] text-[#6d2842] shadow-inner mb-2">
          <UtensilsCrossed className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8b4564]">
            404 — Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
            Delicacy Unavailable
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            The page you are looking for may have been moved, renamed, or is currently not on our menu.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#6d2842] hover:bg-[#582035] text-white text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-all duration-200 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Menu
          </Link>
        </div>
      </div>
    </main>
  );
}
