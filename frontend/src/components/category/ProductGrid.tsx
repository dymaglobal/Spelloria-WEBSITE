"use client";

import React from "react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { Cake } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  categoryName?: string;
}

export default function ProductGrid({ products, categoryName }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF5EE] flex items-center justify-center text-stone-400 mb-4">
          <Cake className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-xl sm:text-2xl text-stone-800 font-medium">
          No creations found
        </h3>
        <p className="text-sm text-stone-500 mt-2 max-w-sm mx-auto">
          We couldn&apos;t find any items matching your selected criteria. Try selecting another filter or check back soon for fresh bakes.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
