"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Award, Users, Wheat, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/cards/ProductCard";
import FinalCtaSection from "@/components/sections/FinalCtaSection";
import { DBProduct, DBCategory, DBSiteSettings } from "@/lib/db/types";

interface PastryCollectionItem {
  id: string;
  name: string;
  leftImg: string;
  rightImg: string;
  href: string;
  tier: "small" | "medium" | "hero";
}

const PASTRIES_COLLECTION: PastryCollectionItem[] = [
  {
    id: "cakes",
    name: "Cakes",
    leftImg: "/images/collection-cakes.jpg",
    rightImg: "/images/cake-chocolate-truffle.jpg",
    href: "/category/cakes",
    tier: "small",
  },
  {
    id: "pastries",
    name: "Pastries",
    leftImg: "/images/croissant-macro-1.jpg",
    rightImg: "/images/croissant-macro-2.jpg",
    href: "/category/pastries",
    tier: "medium",
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    leftImg: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80",
    rightImg: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    href: "/category/cappuccino",
    tier: "hero",
  },
  {
    id: "desserts",
    name: "Desserts",
    leftImg: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
    rightImg: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80",
    href: "/category/desserts",
    tier: "medium",
  },
  {
    id: "cookies",
    name: "Cookies",
    leftImg: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80",
    rightImg: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
    href: "/category/cookies",
    tier: "small",
  },
];

const TIER_CONFIG = {
  small: {
    image: "w-12 h-8 sm:w-16 sm:h-10 md:w-20 md:h-13 rounded-sm sm:rounded-md",
    text: "text-lg sm:text-2xl md:text-3xl",
    gap: "gap-2.5 sm:gap-4 md:gap-5",
    py: "py-1 sm:py-1.5",
  },
  medium: {
    image: "w-14 h-9 sm:w-20 sm:h-13 md:w-26 md:h-17 rounded-sm sm:rounded-md",
    text: "text-xl sm:text-3xl md:text-4xl",
    gap: "gap-3 sm:gap-5 md:gap-6",
    py: "py-1.5 sm:py-2",
  },
  hero: {
    image: "w-16 h-10 sm:w-24 sm:h-15 md:w-32 md:h-21 rounded-sm sm:rounded-md",
    text: "text-2xl sm:text-4xl md:text-5xl font-medium",
    gap: "gap-3.5 sm:gap-6 md:gap-7",
    py: "py-2 sm:py-2.5",
  },
};

interface HomeClientViewProps {
  categories: DBCategory[];
  products: DBProduct[];
  settings: DBSiteSettings;
}

export default function HomeClientView({
  categories,
  products,
  settings,
}: HomeClientViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activePastry, setActivePastry] = useState<string>("cappuccino");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => {
          const cat = categories.find((c) => c.slug === selectedCategory);
          return cat ? p.category_id === cat.id : true;
        });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Liquid Glass Overlay Navbar */}
      <Navbar variant="transparent" />

      <main className="flex-1">
        {/* =========================================================================
            1. PURELY ——— HANDCRAFTED 100VH HERO SECTION (Exact Reference & Liquid Glass)
            ========================================================================= */}
        <section className="relative w-full h-screen min-h-[660px] max-h-[1200px] overflow-hidden flex flex-col justify-between select-none">
          {/* Background Cinematic Food Photography */}
          <div className="absolute inset-0 z-0">
            <img
              src={settings.hero_bg_image || "/images/hero-cinematic.png"}
              alt="Spelloria Artisanal Cake & Luxury Pastry"
              className="w-full h-full object-cover object-center scale-100"
              fetchPriority="high"
            />
            {/* Smooth Top & Bottom Contrast Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/75 pointer-events-none" />
            <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />
          </div>

          {/* Top spacer (to offset the absolute floating header) */}
          <div className="pt-24 sm:pt-28" />

          {/* Center: Hero Typography (Exact Reference Alignment) */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center my-auto">
            {/* Small uppercase tag pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] sm:text-xs font-sans tracking-[0.25em] uppercase mb-4 sm:mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta animate-pulse" />
              <span>{settings.hero_headline || "Artisanal French Pâtisserie"}</span>
            </div>

            {/* Giant Display Serif Heading */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-normal tracking-tight leading-[1.08] max-w-5xl text-balance drop-shadow-md">
              A Symphony of <br className="hidden sm:inline" />
              <span className="italic font-light text-brand-cream/95">Butter, Sugar</span> &amp; Art.
            </h1>

            {/* Supporting Tagline */}
            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-brand-cream/85 max-w-xl mx-auto font-sans font-normal leading-relaxed tracking-wide text-balance drop-shadow-sm">
              {settings.hero_subtitle || "Baked fresh before sunrise. Handcrafted French pastries, viennoiserie, and signature celebration cakes delivered to your door."}
            </p>

            {/* Action CTAs */}
            <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white text-xs sm:text-sm uppercase tracking-widest font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-brand-terracotta/30 active:scale-95"
              >
                <span>Explore Creations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#categories-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm uppercase tracking-widest font-semibold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full backdrop-blur-md border border-white/25 transition-all duration-300 hover:border-white/40 active:scale-95"
              >
                <span>Discover Collections</span>
              </Link>
            </div>
          </div>

          {/* Bottom Features Strip */}
          <div className="relative z-10 w-full border-t border-white/10 bg-black/30 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-white/10">
                <div className="px-2">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-brand-cream/60 font-sans">
                    French AOP
                  </p>
                  <p className="font-serif text-xs sm:text-sm text-white font-medium mt-0.5">
                    100% Pure Butter
                  </p>
                </div>
                <div className="px-2">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-brand-cream/60 font-sans">
                    Daily Craft
                  </p>
                  <p className="font-serif text-xs sm:text-sm text-white font-medium mt-0.5">
                    Baked Fresh At 5 AM
                  </p>
                </div>
                <div className="px-2">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-brand-cream/60 font-sans">
                    Conversational
                  </p>
                  <p className="font-serif text-xs sm:text-sm text-white font-medium mt-0.5">
                    Direct WhatsApp Orders
                  </p>
                </div>
                <div className="px-2">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-brand-cream/60 font-sans">
                    Cold Chain
                  </p>
                  <p className="font-serif text-xs sm:text-sm text-white font-medium mt-0.5">
                    Refrigerated Delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. THE COLLECTION — SIGNATURE CREATIONS (Graduated Diamond Silhouette)
            ========================================================================= */}
        <section id="categories-section" className="bg-[#FAF6F0] py-20 sm:py-28 border-b border-[#EAE3D8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            
            <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-stone-500 block mb-2">
              The Collection
            </span>

            <h2 className="font-serif italic text-3xl sm:text-5xl lg:text-[54px] text-stone-900 tracking-tight pb-8 sm:pb-12">
              Explore Our Signature Creations
            </h2>

            {/* Graduated Diamond Structure (Small -> Big -> Small) */}
            <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2">
              {PASTRIES_COLLECTION.map((item) => {
                const isHovered = activePastry === item.id;
                const tier = TIER_CONFIG[item.tier];

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setActivePastry(item.id)}
                    onClick={() => setActivePastry(item.id)}
                    className={`inline-flex items-center justify-center ${tier.gap} ${tier.py} group cursor-pointer transition-all duration-300 select-none`}
                  >
                    {/* Left Flanking Image */}
                    <div
                      className={`${tier.image} overflow-hidden bg-stone-200 transition-all duration-300 shadow-sm shrink-0 ${
                        isHovered
                          ? "opacity-100 scale-105 shadow-md ring-1 ring-black/10"
                          : "opacity-40 grayscale-[10%] group-hover:opacity-75"
                      }`}
                    >
                      <img
                        src={item.leftImg}
                        alt={`${item.name} presentation`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Category Title with Snug Solid Underline */}
                    <div className="text-center px-1 sm:px-2 flex items-center justify-center">
                      <Link
                        href={item.href}
                        className={`font-serif tracking-tight transition-all duration-300 inline-block relative ${tier.text} ${
                          isHovered
                            ? "text-stone-950 font-medium"
                            : "text-stone-400 font-normal hover:text-stone-600"
                        }`}
                      >
                        <span className="relative inline-block pb-1">
                          {item.name}
                          {isHovered && (
                            <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-stone-900 rounded-full transition-all duration-300" />
                          )}
                        </span>
                      </Link>
                    </div>

                    {/* Right Flanking Image */}
                    <div
                      className={`${tier.image} overflow-hidden bg-stone-200 transition-all duration-300 shadow-sm shrink-0 ${
                        isHovered
                          ? "opacity-100 scale-105 shadow-md ring-1 ring-black/10"
                          : "opacity-40 grayscale-[10%] group-hover:opacity-75"
                      }`}
                    >
                      <img
                        src={item.rightImg}
                        alt={`${item.name} detail`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* "See More" Button */}
            <div className="pt-10 sm:pt-14">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 border border-stone-400/80 hover:border-stone-900 hover:bg-stone-900 hover:text-white px-7 py-2 rounded-full text-xs font-medium text-stone-800 tracking-wider transition-all duration-200 active:scale-95 shadow-2xs"
              >
                <span>See More</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </section>

        {/* =========================================================================
            3. LUXURY BAKERY PRODUCTS SHOWCASE (Live Database Reflection)
            ========================================================================= */}
        <section className="py-20 sm:py-28 bg-brand-cream-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-brand-terracotta font-bold">
                  Curated Daily Menu
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-purple mt-2 font-normal">
                  Fresh from Our Ovens
                </h2>
                <p className="text-xs sm:text-sm text-brand-espresso-muted mt-2 max-w-lg font-sans">
                  Order with zero checkout friction. Click any creation to order directly via WhatsApp.
                </p>
              </div>

              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-brand-terracotta hover:text-brand-terracotta-dark border-b-2 border-brand-terracotta pb-1 transition-colors self-start md:self-auto"
              >
                <span>View Full Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Category Filter Chips (Generated Dynamically from Database) */}
            <div className="flex flex-wrap gap-2 pb-8">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-brand-terracotta text-white shadow-sm"
                    : "bg-brand-cream-card text-brand-espresso hover:bg-brand-cream border border-brand-cream-border"
                }`}
              >
                All Creations ({products.length})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat.slug
                      ? "bg-brand-terracotta text-white shadow-sm"
                      : "bg-brand-cream-card text-brand-espresso hover:bg-brand-cream border border-brand-cream-border"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Product Cards (Mobile: 2 items in a row, Desktop: 4 items in a row) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. PREMIUM FINAL CTA SECTION (Connected directly to database settings)
            ========================================================================= */}
        <FinalCtaSection
          label={settings.cta_label}
          heading={settings.cta_heading}
          description={settings.cta_description}
          bgImage={settings.cta_bg_image}
        />
      </main>

      <Footer />
    </div>
  );
}
