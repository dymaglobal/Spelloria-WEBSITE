"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { useAuthStore } from "@/store/auth.store";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (mounted && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [mounted, isAuthenticated, isLoginPage, router]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (!mounted) {
    return <div className="min-h-screen bg-brand-cream-canvas" />;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-cream-canvas flex items-center justify-center">
        <p className="text-xs uppercase tracking-widest text-brand-espresso-muted font-bold animate-pulse">
          Verifying security credentials...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FDFBF7] text-[#2E141D]">
      {/* Mobile Top Navigation Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#240A2B] text-white sticky top-0 z-40 shadow-sm">
        <Link href="/admin" className="flex items-center gap-2">
          <img
            src="/images/logo-white.png"
            alt="Spelloria"
            className="h-6 w-auto object-contain"
          />
          <span className="text-[10px] uppercase tracking-widest text-[#D27D46] font-bold">
            Portal
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="p-1.5 text-white/90 hover:text-white rounded-lg hover:bg-white/10"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar - Desktop static, Mobile slide-over drawer */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 transform md:transform-none transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <AdminSidebar />
      </div>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
