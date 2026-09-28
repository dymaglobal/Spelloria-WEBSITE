"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/cards/ProductCard";
import { DBCategory, DBProduct } from "@/lib/db/types";

interface MenuClientViewProps {
  categories: DBCategory[];
  products: DBProduct[];
}

export default function MenuClientView({
  categories,
  products,
}: MenuClientViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" ||
      categories.find((c) => c.slug === activeCategory)?.id === product.category_id;

    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.short_description &&
        product.short_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.full_description &&
        product.full_description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-brand-cream-canvas">
        {/* Header */}
        <section className="py-16 border-b border-brand-cream-border text-center px-4">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta">
            Freshly Baked Every Morning
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-brand-purple mt-2 tracking-tight">
            Artisanal Menu
          </h1>
          <p className="text-sm sm:text-base text-brand-espresso-muted max-w-xl mx-auto mt-3">
            Browse our signature cakes, flaky pastries, handcrafted cookies, delicate desserts, and barista brewed beverages.
          </p>
        </section>

        {/* Filters and Controls */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-brand-cream-border">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeCategory === "all"
                    ? "bg-brand-terracotta text-white shadow-sm"
                    : "bg-brand-cream-card text-brand-espresso hover:bg-brand-cream border border-brand-cream-border"
                }`}
              >
                All Menu ({products.length})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeCategory === cat.slug
                      ? "bg-brand-terracotta text-white shadow-sm"
                      : "bg-brand-cream-card text-brand-espresso hover:bg-brand-cream border border-brand-cream-border"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Live Search Input */}
            <div className="w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pastry or cake..."
                className="w-full px-4 py-2.5 rounded-full bg-brand-cream-card border border-brand-cream-border text-sm text-brand-espresso focus:outline-none focus:ring-2 focus:ring-brand-terracotta transition-all placeholder:text-brand-espresso-muted/60"
              />
            </div>
          </div>

          {/* Catalog Count Indicator */}
          <div className="py-4 text-xs font-medium text-brand-espresso-muted">
            Showing {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </div>

          {/* Products Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 pb-20">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-brand-espresso-muted">
              <p className="font-serif text-2xl text-brand-purple">No creations found</p>
              <p className="text-xs mt-1">Try another category or search term.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
