"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl =
    product.cover_image?.public_url ||
    product.thumbnail_image?.public_url ||
    "/images/collection-cakes.jpg";

  const isBestSeller = product.best_seller || product.featured;
  const weightText = product.weight_grams ? `${product.weight_grams}g` : "500g";

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-150/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1.5">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF6F0]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </Link>

        {/* Optional Bestseller Badge */}
        {isBestSeller && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#FFF1EB] text-[#B84A22] text-[10px] sm:text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shadow-xs border border-[#FFE2D6]">
              Best Seller
            </span>
          </div>
        )}
      </div>

      {/* Bottom Info Area */}
      <div className="p-3.5 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif font-semibold text-sm sm:text-base text-stone-900 group-hover:text-[#35063D] transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Weight & Price + View Details Button */}
        <div className="mt-3 pt-2 flex items-center justify-between border-t border-stone-100">
          <div className="text-xs sm:text-sm text-stone-600 font-normal">
            <span className="text-stone-500 font-sans">{weightText}</span>
            <span className="mx-1.5 text-stone-300">•</span>
            <span className="font-semibold text-stone-900 font-sans">
              {formatPrice(product.discount_price ?? product.price)}
            </span>
          </div>

          <Link
            href={`/product/${product.slug}`}
            aria-label={`View details for ${product.name}`}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF5EE] group-hover:bg-[#27072E] text-stone-700 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:scale-105 shrink-0"
          >
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
