"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryHero from "@/components/category/CategoryHero";
import CategoryFilters, { FilterOption, SortOption } from "@/components/category/CategoryFilters";
import ProductGrid from "@/components/category/ProductGrid";
import { DBCategory, DBProduct } from "@/lib/db/types";

interface CategoryClientViewProps {
  category: DBCategory;
  products: DBProduct[];
}

const CATEGORY_CUSTOM_PILLS: Record<string, { id: string; label: string }[]> = {
  cakes: [
    { id: "all", label: "All Cakes" },
    { id: "chocolate", label: "Chocolate" },
    { id: "fruit", label: "Fruit Cakes" },
    { id: "cheesecake", label: "Cheesecakes" },
    { id: "custom", label: "Custom Cakes" },
  ],
  pastries: [
    { id: "all", label: "All Pastries" },
    { id: "croissants", label: "Croissants" },
    { id: "tarts", label: "Tarts" },
    { id: "danish", label: "Danish" },
  ],
  cookies: [
    { id: "all", label: "All Cookies" },
    { id: "chocolate", label: "Chocolate" },
    { id: "sable", label: "Sablé" },
    { id: "bestseller", label: "Best Sellers" },
  ],
  desserts: [
    { id: "all", label: "All Desserts" },
    { id: "macarons", label: "Macarons" },
    { id: "mousse", label: "Mousses" },
    { id: "popular", label: "Popular" },
  ],
  cappuccino: [
    { id: "all", label: "All Coffees" },
    { id: "espresso", label: "Espresso" },
    { id: "cappuccino", label: "Cappuccino" },
    { id: "cold-brew", label: "Cold Brew" },
  ],
  "gift-boxes": [
    { id: "all", label: "All Hampers" },
    { id: "luxury", label: "Luxury Boxes" },
    { id: "assorted", label: "Assorted" },
    { id: "celebration", label: "Celebration" },
  ],
};

export default function CategoryClientView({
  category,
  products,
}: CategoryClientViewProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [activeSort, setActiveSort] = useState<SortOption>("latest");

  // Filter products by category, filter pill, and sort
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by pill
    if (activeFilter !== "all") {
      const q = activeFilter.toLowerCase();
      if (q === "popular" || q === "bestseller") {
        list = list.filter((p) => p.best_seller || p.featured || p.status === "Best Seller");
      } else if (q === "new") {
        list = list.filter((p) => p.status === "New Arrival" || p.featured);
      } else {
        list = list.filter((p) => {
          const haystack = `${p.name} ${p.short_description || ""} ${p.full_description || ""} ${p.ingredients?.join(" ") || ""}`.toLowerCase();
          return haystack.includes(q);
        });
      }
    }

    // Sort products
    return [...list].sort((a, b) => {
      const priceA = a.discount_price ?? a.price;
      const priceB = b.discount_price ?? b.price;

      switch (activeSort) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "popular":
          return (b.views_count ?? 0) - (a.views_count ?? 0);
        case "latest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [products, activeFilter, activeSort]);

  const customPills = CATEGORY_CUSTOM_PILLS[category.slug.toLowerCase()];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6F0]">
      {/* Solid White Navbar with Black Navigation */}
      <Navbar variant="solid" />

      <main className="flex-1">
        {/* Category Hero Section */}
        <CategoryHero
          categorySlug={category.slug}
          categoryName={category.name}
          description={category.description}
        />

        {/* Filter and Sorting Controls */}
        <CategoryFilters
          categorySlug={category.slug}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activeSort={activeSort}
          onSortChange={setActiveSort}
          customPills={customPills}
        />

        {/* Product Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <ProductGrid products={filteredProducts as any} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
