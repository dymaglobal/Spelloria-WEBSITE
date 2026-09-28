"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, ArrowRight, ShieldCheck, CheckSquare, Square } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [username, setUsername] = useState("Spelloria");
  const [password, setPassword] = useState("ADMIN@462");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      login(data.token, data.user, rememberMe);
      router.push("/admin");
    } catch (err: any) {
      setError(err?.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAE3D8] p-8 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.06)] space-y-7">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block py-1">
            <img
              src="/images/logo-transparent.png"
              alt="Spelloria Pâtisserie"
              className="h-12 w-auto object-contain mx-auto"
            />
          </Link>
          <div className="pt-1">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D27D46] block">
              SPELLORIA EXECUTIVE CONSOLE
            </span>
            <h1 className="font-serif text-2xl text-stone-900 mt-1">Admin Portal</h1>
            <p className="text-xs text-stone-500 font-light">
              Sign in with your administrator credentials
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 font-sans">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Spelloria"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#35063D]/20 focus:border-[#35063D] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 font-sans">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#35063D]/20 focus:border-[#35063D] transition-colors"
              />
            </div>
          </div>

          {/* Remember Login Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className="flex items-center gap-2 text-xs text-stone-600 hover:text-stone-900 cursor-pointer select-none"
            >
              {rememberMe ? (
                <CheckSquare className="w-4 h-4 text-[#35063D]" />
              ) : (
                <Square className="w-4 h-4 text-stone-400" />
              )}
              <span>Remember login session</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#27072E] hover:bg-[#35063D] text-white text-xs uppercase tracking-widest font-bold py-3.5 px-6 rounded-full transition-all shadow-md active:scale-98 disabled:opacity-60 cursor-pointer mt-2"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Credentials Reminder Box */}
        <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#EAE3D8] space-y-1.5 text-xs text-stone-600">
          <div className="flex items-center gap-1.5 text-[#D27D46] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Configured Super Admin Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-sans">Username</span>
              <span className="text-[#35063D] font-bold">Spelloria</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-sans">Password</span>
              <span className="text-[#35063D] font-bold">ADMIN@462</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
