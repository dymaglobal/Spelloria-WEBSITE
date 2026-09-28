"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, SlidersHorizontal } from "lucide-react";

export type FilterOption = "all" | "popular" | "new" | "bestseller" | string;
export type SortOption = "latest" | "price-asc" | "price-desc" | "popular";

interface CategoryFiltersProps {
  categorySlug: string;
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  customPills?: { id: string; label: string }[];
}

const DEFAULT_SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "latest", label: "Latest" },
  { id: "popular", label: "Most Popular" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

export default function CategoryFilters({
  categorySlug,
  activeFilter,
  onFilterChange,
  activeSort,
  onSortChange,
  customPills,
}: CategoryFiltersProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Category specific filter pills or default standard filters
  const filterPills = customPills || [
    { id: "all", label: `All ${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace("-", " ")}` },
    { id: "popular", label: "Popular" },
    { id: "new", label: "New Arrivals" },
    { id: "bestseller", label: "Best Sellers" },
  ];

  const currentSortLabel =
    DEFAULT_SORT_OPTIONS.find((s) => s.id === activeSort)?.label || "Sort by";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Filter Pills with smooth horizontal scrolling on mobile */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 scroll-smooth">
          {filterPills.map((pill) => {
            const isActive = activeFilter.toLowerCase() === pill.id.toLowerCase();
            return (
              <button
                key={pill.id}
                onClick={() => onFilterChange(pill.id)}
                className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 select-none ${
                  isActive
                    ? "bg-[#27072E] text-white shadow-md shadow-[#27072E]/15 scale-[1.02]"
                    : "bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100/90 border border-stone-200/80 shadow-xs"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="relative self-end sm:self-auto shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200/80 text-xs sm:text-sm font-medium text-stone-700 hover:text-stone-900 hover:border-stone-300 shadow-xs transition-colors"
            aria-expanded={sortOpen}
            aria-haspopup="listbox"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 sm:hidden" />
            <span className="text-stone-500 font-normal">Sort by:</span>
            <span className="font-medium text-stone-800">{currentSortLabel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${
                sortOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Floating Dropdown Menu */}
          {sortOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              {DEFAULT_SORT_OPTIONS.map((opt) => {
                const isSelected = activeSort === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onSortChange(opt.id);
                      setSortOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm text-left transition-colors ${
                      isSelected
                        ? "text-[#35063D] font-semibold bg-[#FAF5EE]"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#35063D]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
