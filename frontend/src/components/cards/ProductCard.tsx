"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const whatsAppUrl = buildWhatsAppUrl({
    productName: product.name,
    weightGrams: product.weight_grams,
    price: product.price,
    discountPrice: product.discount_price,
    quantity: 1,
    productSlug: product.slug,
  });

  const imageUrl =
    (product as any).cover_image_url ||
    product.thumbnail_image?.public_url ||
    product.cover_image?.public_url ||
    ((product as any).gallery_images && (product as any).gallery_images[0]?.public_url) ||
    ((product as any).images && (product as any).images[0]) ||
    "/images/collection-cakes.jpg";

  return (
    <div className="group flex flex-col transition-all duration-300">
      {/* Rounded Image Container with Floating Heart (Matching Reference) */}
      <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 shadow-xs">
        {/* Product Image */}
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </Link>

        {/* Floating Heart / Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          aria-label="Add to favorites"
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-xs hover:bg-white shadow-md flex items-center justify-center text-stone-700 hover:text-red-500 transition-all active:scale-90 z-10 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : "text-stone-700"
            }`}
          />
        </button>
      </div>

      {/* Typography & Details (Matching Reference) */}
      <div className="pt-2.5 sm:pt-3 flex flex-col flex-1">
        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-sans font-bold text-sm sm:text-base text-[#2E141D] hover:text-brand-terracotta transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Short description */}
        {product.short_description && (
          <p className="mt-1 text-xs text-stone-500 font-normal leading-relaxed line-clamp-2">
            {product.short_description}
          </p>
        )}

        {/* Price & WhatsApp Order */}
        <div className="mt-2.5 pt-1 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans font-bold text-sm sm:text-base text-brand-purple">
              {formatPrice(product.discount_price ?? product.price)}
            </span>
            {product.discount_price && (
              <span className="text-[11px] text-stone-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-colors shadow-2xs active:scale-95"
            title="Order directly via WhatsApp"
          >
            <MessageCircle className="w-3 h-3" />
            <span>Order</span>
          </a>
        </div>
      </div>
    </div>
  );
}
