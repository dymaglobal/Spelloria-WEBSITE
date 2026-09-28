"use client";

import React from "react";
import { motion } from "framer-motion";

interface CategoryHeroProps {
  categorySlug: string;
  categoryName: string;
  description?: string | null;
}

interface CategoryMetadata {
  label: string;
  headlineFirst: string;
  headlineHighlight: string;
  description: string;
  heroImage: string;
  blobColor: string;
  imageScale?: string;
}

const CATEGORY_META: Record<string, CategoryMetadata> = {
  cakes: {
    label: "CAKES",
    headlineFirst: "Cakes crafted",
    headlineHighlight: "for every celebration",
    description: "From classic favourites to modern creations, our cakes are baked with the finest ingredients and a lot of love.",
    heroImage: "/images/hero-cake-clean.png",
    blobColor: "bg-[#F3E5D4]",
    imageScale: "max-w-[340px] sm:max-w-[420px] md:max-w-[480px]",
  },
  pastries: {
    label: "PASTRIES",
    headlineFirst: "Golden layers folded with",
    headlineHighlight: "pure French butter",
    description: "Slow-fermented viennoiserie baked fresh before sunrise to deliver the ultimate crisp and airy bite.",
    heroImage: "/images/hero-croissant.png",
    blobColor: "bg-[#F5EAD9]",
    imageScale: "max-w-[320px] sm:max-w-[400px] md:max-w-[460px]",
  },
  cookies: {
    label: "COOKIES",
    headlineFirst: "Crisp edges with",
    headlineHighlight: "molten chocolate hearts",
    description: "Handcrafted cookies loaded with roasted hazelnuts, single-origin cacao, and sea salt flakes.",
    heroImage: "/images/hero-cookies.png",
    blobColor: "bg-[#EFE4D6]",
    imageScale: "max-w-[300px] sm:max-w-[380px] md:max-w-[430px]",
  },
  desserts: {
    label: "DESSERTS",
    headlineFirst: "Velvety textures and",
    headlineHighlight: "delicate French finishes",
    description: "Plated masterpieces, velvety mousses, and pastel macarons made to turn moments into memories.",
    heroImage: "/images/hero-dessert.png",
    blobColor: "bg-[#EFE8DF]",
    imageScale: "max-w-[320px] sm:max-w-[390px] md:max-w-[450px]",
  },
  cappuccino: {
    label: "CAPPUCCINOS",
    headlineFirst: "Silky micro-foam and",
    headlineHighlight: "specialty roasted espresso",
    description: "Ethically sourced single-origin beans roasted to perfection and paired with velvety textured steamed milk.",
    heroImage: "/images/hero-cappuccino.png",
    blobColor: "bg-[#EFE6DC]",
    imageScale: "max-w-[280px] sm:max-w-[360px] md:max-w-[400px]",
  },
  "gift-boxes": {
    label: "GIFT BOXES",
    headlineFirst: "Curated collections for",
    headlineHighlight: "life's sweetest moments",
    description: "Luxurious custom packaging filled with our finest assortment of handcrafted pastries and confections.",
    heroImage: "/images/hero-gift-box.png",
    blobColor: "bg-[#F3E8DB]",
    imageScale: "max-w-[300px] sm:max-w-[380px] md:max-w-[430px]",
  },
};

export default function CategoryHero({
  categorySlug,
  categoryName,
  description,
}: CategoryHeroProps) {
  const normalizedSlug = categorySlug.toLowerCase();
  const meta =
    CATEGORY_META[normalizedSlug] || {
      label: categoryName.toUpperCase(),
      headlineFirst: `${categoryName} crafted with`,
      headlineHighlight: "passion & precision",
      description:
        description ||
        "From classic favourites to seasonal creations, baked daily with the finest ingredients.",
      heroImage: "/images/hero-cake-clean.png",
      blobColor: "bg-[#F4E8D8]",
      imageScale: "max-w-[340px] sm:max-w-[420px] md:max-w-[480px]",
    };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FAF5EE] via-[#FCF9F4] to-[#FDFBF7] rounded-b-[48px] sm:rounded-b-[80px] lg:rounded-b-[110px] pt-24 sm:pt-32 pb-14 sm:pb-20 border-b border-[#EAE3D8]/80 text-center select-none">
      
      {/* Outer curved dome aesthetic */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Small Category Label */}
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-stone-500 block mb-3 font-sans"
        >
          {meta.label}
        </motion.span>

        {/* Large Headline with Italic Serif Accent */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[64px] text-stone-900 tracking-tight leading-[1.12] max-w-3xl mx-auto"
        >
          {meta.headlineFirst}{" "}
          <span className="italic font-light text-stone-800 font-serif">
            {meta.headlineHighlight}
          </span>
        </motion.h1>

        {/* Short Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs sm:text-sm md:text-base text-stone-600 font-light leading-relaxed max-w-lg mx-auto mt-4 px-4"
        >
          {meta.description}
        </motion.p>

        {/* Center Naturally Floating Product Image (No image card, no container) */}
        <div className="relative mt-8 sm:mt-12 flex flex-col justify-center items-center max-w-2xl mx-auto px-4">
          
          {/* Subtle Organic Abstract Blob behind the product */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-36 sm:w-96 sm:h-52 md:w-[480px] md:h-64 rounded-[42%_58%_68%_32%/38%_52%_48%_62%] ${meta.blobColor} opacity-75 blur-xs pointer-events-none transition-all duration-700`}
          />

          {/* Whimsical Hand-Drawn Bakery Doodles around product */}
          {/* Left heart doodle */}
          <svg
            className="absolute left-6 sm:left-12 top-6 sm:top-10 w-7 h-7 sm:w-9 sm:h-9 text-[#C49B74] opacity-80 pointer-events-none transform -rotate-12"
            viewBox="0 0 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M12 20 C8 15, 8 10, 15 10 C20 10, 20 15, 20 20 C20 26, 12 32, 12 32 C12 32, 4 26, 4 20" />
          </svg>

          {/* Top-right celebration burst doodle */}
          <svg
            className="absolute right-6 sm:right-12 top-4 sm:top-6 w-8 h-8 sm:w-10 sm:h-10 text-[#C49B74] opacity-85 pointer-events-none"
            viewBox="0 0 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M22 6 L26 13 M32 10 L26 15 M34 20 L27 18" />
          </svg>

          {/* Bottom-right aroma doodle */}
          <svg
            className="absolute right-8 sm:right-16 bottom-4 sm:bottom-6 w-7 h-7 text-[#C49B74] opacity-75 pointer-events-none"
            viewBox="0 0 30 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M4 14 Q9 8 14 14 T24 14" />
          </svg>

          {/* Floating Hero Product Image - completely isolated, no frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.25 },
              scale: { duration: 0.6, delay: 0.25 },
              y: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
            }}
            className={`relative z-10 w-full ${meta.imageScale || "max-w-[420px]"} flex justify-center items-center drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]`}
          >
            <img
              src={meta.heroImage}
              alt={`${categoryName} creation`}
              className="w-full h-auto object-contain max-h-[280px] sm:max-h-[340px] md:max-h-[380px] select-none pointer-events-none"
            />
          </motion.div>

          {/* Soft Realistic Shadow Underneath that scales subtly with float */}
          <motion.div
            animate={{
              scale: [1, 0.92, 1],
              opacity: [0.35, 0.22, 0.35],
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-48 sm:w-64 md:w-80 h-4 sm:h-5 rounded-[100%] bg-black/40 blur-md pointer-events-none mt-1 sm:mt-2"
          />
        </div>

      </div>

    </div>
  );
}
