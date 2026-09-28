"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageCircle,
  Sparkles,
  Palette,
  FileText,
  Search,
  Check,
  Loader2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Share2,
  Video,
  ImageIcon,
  Send,
  Sliders,
  CheckCheck,
} from "lucide-react";
import { DBSiteSettings } from "@/lib/db/types";
import { MediaPickerModal } from "@/components/dashboard/MediaPickerModal";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "whatsapp" | "brand" | "content" | "seo"
  >("whatsapp");

  const [settings, setSettings] = useState<DBSiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Media Picker state for selecting images
  const [mediaPickerField, setMediaPickerField] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      } catch (err: any) {
        setError("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (field: keyof DBSiteSettings, val: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [field]: val,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSuccess("Boutique settings successfully updated and synchronized!");
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const copyToken = (token: string) => {
    if (!settings) return;
    const curTemplate = settings.whatsapp_template || "";
    handleChange("whatsapp_template", `${curTemplate} ${token}`);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  // Live WhatsApp preview replacement
  const getRenderedPreview = () => {
    if (!settings?.whatsapp_template) return "";
    return settings.whatsapp_template
      .replace(/{{product_name}}/g, "Royal Opera Gateau")
      .replace(/{{weight}}/g, "1kg")
      .replace(/{{quantity}}/g, "1")
      .replace(/{{price}}/g, "₹1,499")
      .replace(/{{customer_name}}/g, "Aditi Sharma")
      .replace(/{{url}}/g, "https://spelloria.com/products/royal-opera-gateau");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-stone-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#35063D] mb-3" />
        <p className="text-xs font-semibold">Loading system settings...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-8 text-center text-red-600 text-xs">
        Failed to load settings from server.
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D27D46]">
            Configuration Hub
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#35063D] mt-0.5">
            Admin & Website Settings
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage WhatsApp direct orders, brand assets, storefront texts, and global SEO.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#35063D] hover:bg-[#4d0c57] text-white text-xs uppercase tracking-wider font-bold px-7 py-2.5 rounded-full transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("whatsapp")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer ${
            activeTab === "whatsapp"
              ? "bg-[#35063D] text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Commerce</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("brand")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer ${
            activeTab === "brand"
              ? "bg-[#35063D] text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Brand & Contact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer ${
            activeTab === "content"
              ? "bg-[#35063D] text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Content Management</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer ${
            activeTab === "seo"
              ? "bg-[#35063D] text-white shadow-xs"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Search className="w-4 h-4" />
          <span>SEO & Meta Data</span>
        </button>
      </div>

      {/* TAB 1: WhatsApp Ordering System */}
      {activeTab === "whatsapp" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-150">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#35063D] flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  <span>WhatsApp Conversational Checkout Engine</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Direct client inquiries bypass carts and payment gateways straight to WhatsApp.
                </p>
              </div>

              {/* Ordering Enable / Disable Toggle */}
              <label className="flex items-center gap-3 p-2 px-4 rounded-2xl bg-[#FAF5EE] border border-[#EAE3D8] cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-stone-800 block">WhatsApp Orders</span>
                  <span className="text-[10px] text-stone-500">
                    {settings.whatsapp_enabled ? "Active & Accepting Orders" : "Temporarily Paused"}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.whatsapp_enabled}
                  onChange={(e) => handleChange("whatsapp_enabled", e.target.checked)}
                  className="w-5 h-5 accent-[#35063D] rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  WhatsApp Business Number (with country code) *
                </label>
                <input
                  type="text"
                  required
                  value={settings.whatsapp_number}
                  onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                  placeholder="+919876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 font-mono text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#35063D]"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Example: +919876543210 (Must include country code, digits only)
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Secondary Customer Support Phone
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#35063D]"
                />
              </div>
            </div>

            {/* Template Editor with Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700">
                    Message Template Customizer
                  </label>
                  <span className="text-[10px] text-stone-400">Click variable to insert</span>
                </div>

                {/* Variable Token Insertion Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "{{product_name}}",
                    "{{weight}}",
                    "{{quantity}}",
                    "{{price}}",
                    "{{customer_name}}",
                    "{{url}}",
                  ].map((tok) => (
                    <button
                      key={tok}
                      type="button"
                      onClick={() => copyToken(tok)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-stone-100 hover:bg-[#35063D] hover:text-white transition-colors cursor-pointer border border-stone-200"
                    >
                      {tok}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={8}
                  value={settings.whatsapp_template}
                  onChange={(e) => handleChange("whatsapp_template", e.target.value)}
                  className="w-full p-4 rounded-2xl border border-stone-200 bg-stone-50/50 font-mono text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#35063D] leading-relaxed"
                />

                <p className="text-[11px] text-stone-400">
                  When a client clicks &quot;Order on WhatsApp&quot;, their WhatsApp client pre-fills this exact message.
                </p>
              </div>

              {/* Live Simulated WhatsApp Bubble */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700">
                  Live Client WhatsApp Simulator
                </label>

                <div className="rounded-3xl border border-stone-200 bg-[#EFEAE2] p-5 shadow-inner min-h-[260px] flex flex-col justify-between relative overflow-hidden">
                  {/* WhatsApp chat top bar */}
                  <div className="flex items-center gap-3 pb-3 border-b border-stone-300/60">
                    <div className="w-8 h-8 rounded-full bg-[#35063D] text-white flex items-center justify-center font-serif text-xs font-bold">
                      S
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">
                        Spelloria Patisserie
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium">Online</span>
                    </div>
                  </div>

                  {/* Chat bubble */}
                  <div className="my-4 max-w-[88%] self-end bg-[#D9FDD3] p-3.5 rounded-2xl rounded-tr-xs shadow-xs text-xs text-stone-900 space-y-1 relative">
                    <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-stone-800">
                      {getRenderedPreview()}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-stone-500 pt-1">
                      <span>10:45 AM</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  </div>

                  <div className="text-[10px] text-center text-stone-400">
                    🔒 Messages are end-to-end encrypted directly with your WhatsApp phone.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Brand & Contact */}
      {activeTab === "brand" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#35063D]">
              Brand Identity & Boutique Contact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={settings.brand_name}
                  onChange={(e) => handleChange("brand_name", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.brand_color || "#35063D"}
                    onChange={(e) => handleChange("brand_color", e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-stone-200 p-0.5"
                  />
                  <input
                    type="text"
                    value={settings.brand_color || "#35063D"}
                    onChange={(e) => handleChange("brand_color", e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-stone-200 bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.accent_color || "#D27D46"}
                    onChange={(e) => handleChange("accent_color", e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-stone-200 p-0.5"
                  />
                  <input
                    type="text"
                    value={settings.accent_color || "#D27D46"}
                    onChange={(e) => handleChange("accent_color", e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-stone-200 bg-stone-50"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Brand Logo URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settings.logo_url}
                    onChange={(e) => handleChange("logo_url", e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerField("logo_url")}
                    className="px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                  >
                    Select
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Contact Support Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                Boutique Street Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="42 Rue de Madeleine, 8th Arrondissement, Paris, France"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
              />
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-800">
                Social Presence & Profiles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-pink-600" />
                    <span>Instagram URL</span>
                  </label>
                  <input
                    type="text"
                    value={settings.instagram_url || ""}
                    onChange={(e) => handleChange("instagram_url", e.target.value)}
                    placeholder="https://instagram.com/spelloria"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Facebook URL</span>
                  </label>
                  <input
                    type="text"
                    value={settings.facebook_url || ""}
                    onChange={(e) => handleChange("facebook_url", e.target.value)}
                    placeholder="https://facebook.com/spelloria"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-red-600" />
                    <span>YouTube Channel</span>
                  </label>
                  <input
                    type="text"
                    value={settings.youtube_url || ""}
                    onChange={(e) => handleChange("youtube_url", e.target.value)}
                    placeholder="https://youtube.com/@spelloria"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-stone-600" />
                    <span>Pinterest URL</span>
                  </label>
                  <input
                    type="text"
                    value={settings.pinterest_url || ""}
                    onChange={(e) => handleChange("pinterest_url", e.target.value)}
                    placeholder="https://pinterest.com/spelloria"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Content Management */}
      {activeTab === "content" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#35063D]">
              Storefront Content & Hero Management
            </h2>

            {/* Homepage Hero Section */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FAF5EE] border border-[#EAE3D8]">
              <h3 className="font-serif text-sm font-bold text-[#35063D]">
                Homepage Hero Banner Section
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                    Hero Main Headline
                  </label>
                  <input
                    type="text"
                    value={settings.hero_headline || ""}
                    onChange={(e) => handleChange("hero_headline", e.target.value)}
                    placeholder="Artisanal French Patisserie"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={settings.hero_subtitle || ""}
                    onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                    placeholder="Handcrafted with pure passion & Parisian elegance"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                  Hero Background Image
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settings.hero_bg_image || ""}
                    onChange={(e) => handleChange("hero_bg_image", e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-white border border-stone-200"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerField("hero_bg_image")}
                    className="px-3 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>

            {/* Final CTA Section */}
            <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <h3 className="font-serif text-sm font-bold text-stone-800">
                Homepage Final Call to Action (CTA) Section
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                    CTA Eyebrow Label
                  </label>
                  <input
                    type="text"
                    value={settings.cta_label || ""}
                    onChange={(e) => handleChange("cta_label", e.target.value)}
                    placeholder="FRESHLY BAKED DAILY"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                    CTA Heading
                  </label>
                  <input
                    type="text"
                    value={settings.cta_heading || ""}
                    onChange={(e) => handleChange("cta_heading", e.target.value)}
                    placeholder="Ready to Taste Perfection?"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                  CTA Description
                </label>
                <textarea
                  rows={2}
                  value={settings.cta_description || ""}
                  onChange={(e) => handleChange("cta_description", e.target.value)}
                  placeholder="Order freshly crafted luxury creations delivered directly to your doorstep."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-200"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                  CTA Cinematic Background Image
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settings.cta_bg_image || ""}
                    onChange={(e) => handleChange("cta_bg_image", e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-white border border-stone-200"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerField("cta_bg_image")}
                    className="px-3 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>

            {/* Story & Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Artisanal Story & Heritage
                </label>
                <textarea
                  rows={3}
                  value={settings.story_text || ""}
                  onChange={(e) => handleChange("story_text", e.target.value)}
                  placeholder="Born from a dedication to classic French baking..."
                  className="w-full p-3 text-xs rounded-xl bg-stone-50 border border-stone-200"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Footer Tagline & Copyright
                </label>
                <textarea
                  rows={3}
                  value={settings.footer_text || ""}
                  onChange={(e) => handleChange("footer_text", e.target.value)}
                  placeholder="© 2026 Spelloria Patisserie. Handcrafted with love."
                  className="w-full p-3 text-xs rounded-xl bg-stone-50 border border-stone-200"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SEO & Meta Data */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-150">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#35063D]">
                  Search Engine Optimization (SEO)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Optimize your boutique presence on Google, social link previews, and bots.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-100 text-[11px] font-semibold text-stone-700 hover:bg-stone-200"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Sitemap</span>
                </a>
                <a
                  href="/robots.txt"
                  target="_blank"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-100 text-[11px] font-semibold text-stone-700 hover:bg-stone-200"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Robots.txt</span>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Global Meta Title *
                </label>
                <input
                  type="text"
                  required
                  value={settings.meta_title}
                  onChange={(e) => handleChange("meta_title", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Global Meta Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={settings.meta_description}
                  onChange={(e) => handleChange("meta_description", e.target.value)}
                  className="w-full p-4 rounded-xl border border-stone-200 bg-stone-50/50 text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                    Canonical Storefront URL
                  </label>
                  <input
                    type="text"
                    value={settings.canonical_url || ""}
                    onChange={(e) => handleChange("canonical_url", e.target.value)}
                    placeholder="https://spelloria.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                    Open Graph Share Image (OG Image)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={settings.og_image_url || ""}
                      onChange={(e) => handleChange("og_image_url", e.target.value)}
                      placeholder="/images/hero-cinematic.png"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setMediaPickerField("og_image_url")}
                      className="px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>

              {/* Schema Markup */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Structured Data (Schema.org JSON-LD Bakery markup)
                </label>
                <textarea
                  rows={4}
                  value={settings.schema_markup || ""}
                  onChange={(e) => handleChange("schema_markup", e.target.value)}
                  placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Bakery",\n  "name": "Spelloria Patisserie"\n}`}
                  className="w-full p-4 rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {mediaPickerField && (
        <MediaPickerModal
          isOpen={!!mediaPickerField}
          onClose={() => setMediaPickerField(null)}
          onSelect={(url) => {
            handleChange(mediaPickerField as keyof DBSiteSettings, url);
            setMediaPickerField(null);
          }}
          title="Select Image from Media Library"
        />
      )}
    </div>
  );
}
