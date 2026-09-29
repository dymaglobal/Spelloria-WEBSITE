"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Phone,
  Minus,
  Plus,
  ArrowRight,
  Clock,
  Users,
  ShieldAlert,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/cards/ProductCard";
import { DBProduct, DBCategory, DBSiteSettings } from "@/lib/db/types";
import { formatPrice } from "@/lib/utils/formatters";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

interface ProductDetailClientViewProps {
  product: DBProduct;
  category: DBCategory | null;
  relatedProducts: DBProduct[];
  settings: DBSiteSettings;
}

export default function ProductDetailClientView({
  product,
  category,
  relatedProducts,
  settings,
}: ProductDetailClientViewProps) {
  // Use weight options directly from database, fallback to standard if none
  const weightOptions =
    product.weight_options && product.weight_options.length > 0
      ? product.weight_options
      : [
          {
            id: "default-w",
            weight: product.weight_grams ? `${product.weight_grams}g` : "Standard Portion",
            price: product.price,
            available: product.available !== false,
          },
        ];

  const [selectedWeightId, setSelectedWeightId] = useState<string>(weightOptions[0].id);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Active selected weight
  const currentWeightOpt =
    weightOptions.find((w) => w.id === selectedWeightId) || weightOptions[0];

  // Gallery compilation from database fields
  const rawImages: string[] = [
    product.cover_image_url,
    ...((product as any).images || []),
    ...(product.gallery_images?.map((g) => g.public_url || "").filter(Boolean) || []),
  ].filter(Boolean) as string[];

  const images = Array.from(new Set(rawImages));
  if (images.length === 0) {
    images.push("/images/collection-cakes.jpg");
  }

  // Price calculations
  const unitPrice = currentWeightOpt.price || product.price;
  const totalPrice = unitPrice * quantity;

  // WhatsApp Message Logic
  const whatsappUrl = buildWhatsAppUrl({
    productName: product.name,
    weightGrams: currentWeightOpt.weight,
    price: unitPrice,
    quantity,
    productSlug: product.slug,
    whatsappNumber: settings.whatsapp_number,
    templateString: settings.whatsapp_template,
  });

  const callUrl = `tel:${(settings.phone || "+919876543210").replace(/[^0-9+]/g, "")}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6F0]">
      {/* Solid White Navbar with Black Navigation */}
      <Navbar variant="solid" />

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#35063D]/60 mb-6 sm:mb-8 font-sans">
            <Link href="/" className="hover:text-[#D27D46] transition-colors">
              Home
            </Link>
            <span>/</span>
            {category && (
              <>
                <Link
                  href={`/category/${category.slug}`}
                  className="hover:text-[#D27D46] transition-colors"
                >
                  {category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-[#35063D] font-bold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          {/* Product Hero Section (2-Column Desktop Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* LEFT COLUMN: Gallery & Photography */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main Image Frame with Smooth Zoom Effect */}
              <div
                className="relative aspect-square sm:aspect-[4/3] w-full rounded-3xl overflow-hidden bg-white shadow-sm border border-[#35063D]/5 cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                    isZoomed ? "scale-110" : "scale-100"
                  }`}
                />

                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.status && product.status !== "Available" && (
                    <span className="px-3.5 py-1 rounded-full bg-[#35063D] text-white text-[10px] font-sans font-bold uppercase tracking-widest shadow-md">
                      {product.status}
                    </span>
                  )}
                  {product.best_seller && (
                    <span className="px-3.5 py-1 rounded-full bg-[#D27D46] text-white text-[10px] font-sans font-bold uppercase tracking-widest shadow-md">
                      Boutique Favorite
                    </span>
                  )}
                </div>

                {/* Mobile Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#35063D] shadow-md hover:bg-white transition-all active:scale-90 sm:hidden"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#35063D] shadow-md hover:bg-white transition-all active:scale-90 sm:hidden"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 transition-all duration-200 border-2 cursor-pointer ${
                        activeImageIndex === idx
                          ? "border-[#D27D46] scale-105 shadow-sm"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Product Specifications & Actions */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              <div>
                {/* Category Pill */}
                {category && (
                  <span className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#D27D46]">
                    {category.name}
                  </span>
                )}
                {/* Product Name */}
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#35063D] font-normal tracking-tight mt-1 leading-[1.15]">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#35063D]">
                    {formatPrice(totalPrice)}
                  </span>
                  {quantity > 1 && (
                    <span className="text-xs text-[#35063D]/60 font-sans">
                      ({formatPrice(unitPrice)} each)
                    </span>
                  )}
                  {product.discount_price && (
                    <span className="text-sm line-through text-[#35063D]/40 font-serif">
                      {formatPrice(product.price * quantity)}
                    </span>
                  )}
                </div>
              </div>

              {/* Short Teaser Description */}
              <p className="text-sm sm:text-base text-[#35063D]/80 leading-relaxed font-sans font-light">
                {product.short_description || product.full_description}
              </p>

              {/* Weight / Portion Selector with Individual Pricing */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#35063D]">
                    Select Weight / Portion:
                  </span>
                  {!currentWeightOpt.available && (
                    <span className="text-xs font-bold text-red-600">Currently Sold Out</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {weightOptions.map((opt) => {
                    const isSelected = selectedWeightId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedWeightId(opt.id)}
                        disabled={!opt.available}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                          isSelected
                            ? "bg-[#35063D] text-white border-[#35063D] shadow-sm"
                            : opt.available
                            ? "bg-white text-[#35063D] border-[#35063D]/15 hover:border-[#35063D]/40"
                            : "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60"
                        }`}
                      >
                        <span>{opt.weight}</span>
                        <span className={`text-[10px] ${isSelected ? "text-amber-200" : "text-stone-500"}`}>
                          ({formatPrice(opt.price)})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2 pt-1">
                <span className="text-xs uppercase tracking-wider font-bold text-[#35063D]">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full bg-white border border-[#35063D]/20 p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#35063D] hover:bg-stone-100 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-[#35063D]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#35063D] hover:bg-stone-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* WhatsApp Conversational Order CTA */}
              <div className="pt-4 space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-full text-white text-xs sm:text-sm uppercase tracking-widest font-bold transition-all shadow-lg active:scale-98 ${
                    currentWeightOpt.available
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/25"
                      : "bg-stone-400 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {currentWeightOpt.available
                      ? "Order on WhatsApp"
                      : "Sold Out in This Portion"}
                  </span>
                </a>

                <div className="flex items-center justify-between text-xs text-[#35063D]/70 px-1">
                  <span>Direct checkout with our pastry chefs</span>
                  <a
                    href={callUrl}
                    className="inline-flex items-center gap-1 text-[#D27D46] hover:underline font-semibold"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Us</span>
                  </a>
                </div>
              </div>

              {/* Artisanal Highlights */}
              <div className="border-t border-[#35063D]/10 pt-6 space-y-3 text-xs text-[#35063D]/80">
                {product.ingredients && product.ingredients.length > 0 && (
                  <div>
                    <span className="font-bold text-[#35063D] uppercase tracking-wider block mb-1">
                      Key Ingredients
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-full bg-white border border-[#35063D]/10 text-[11px]"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.allergens && product.allergens.length > 0 && (
                  <div className="pt-2 flex items-start gap-2 text-amber-800 bg-amber-50/80 p-3 rounded-2xl border border-amber-200">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span className="text-[11px]">
                      <strong>Contains:</strong> {product.allergens.join(", ")}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                  {product.shelf_life && (
                    <div className="flex items-center gap-1.5 text-stone-600">
                      <Clock className="w-3.5 h-3.5 text-[#D27D46]" />
                      <span>{product.shelf_life}</span>
                    </div>
                  )}
                  {product.serving_info && (
                    <div className="flex items-center gap-1.5 text-stone-600">
                      <Users className="w-3.5 h-3.5 text-[#D27D46]" />
                      <span>{product.serving_info}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Showcase */}
          {relatedProducts.length > 0 && (
            <section className="mt-20 sm:mt-28 border-t border-[#35063D]/10 pt-14 sm:pt-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#D27D46] font-bold">
                    Maison Spelloria Recommends
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#35063D] mt-1 font-normal">
                    You Might Also Adore
                  </h2>
                </div>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-[#D27D46] hover:underline"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
                {relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct as any} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
