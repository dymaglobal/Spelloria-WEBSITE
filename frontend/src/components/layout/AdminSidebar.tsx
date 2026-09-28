"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Cake,
  FolderTree,
  Image as ImageIcon,
  MessageCircle,
  Settings,
  History,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Cake },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    { label: "WhatsApp Orders", href: "/admin/orders", icon: MessageCircle },
    { label: "Settings & Content", href: "/admin/settings", icon: Settings },
    { label: "Activity Logs", href: "/admin/logs", icon: History },
    { label: "Sync Health Check", href: "/admin/sync", icon: ShieldCheck },
  ];

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-brand-espresso text-brand-cream flex flex-col shrink-0 min-h-screen border-r border-brand-espresso-muted/20">
      {/* Brand Header */}
      <div className="p-6 border-b border-brand-cream/10">
        <Link href="/admin" className="flex flex-col items-start gap-1">
          <img
            src="/images/logo-white.png"
            alt="Spelloria Pâtisserie"
            className="h-8 w-auto object-contain"
          />
          <span className="text-[9px] font-sans uppercase tracking-[0.3em] text-brand-terracotta font-bold mt-1">
            ADMIN PORTAL
          </span>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive
                  ? "bg-brand-terracotta text-white shadow-sm"
                  : "text-brand-cream/70 hover:bg-brand-cream/10 hover:text-brand-cream"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile and Website link */}
      <div className="p-4 border-t border-brand-cream/10 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-brand-cream/5 hover:bg-brand-cream/10 text-xs text-brand-cream/80 transition-colors"
        >
          <span>View Live Boutique</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="px-3 py-2 flex items-center justify-between text-xs">
          <div className="truncate">
            <p className="font-semibold text-brand-cream truncate">{user?.full_name || "Administrator"}</p>
            <p className="text-[10px] text-brand-terracotta truncate">{user?.role || "SUPER_ADMIN"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-brand-cream/60 hover:text-brand-terracotta rounded-lg hover:bg-brand-cream/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
