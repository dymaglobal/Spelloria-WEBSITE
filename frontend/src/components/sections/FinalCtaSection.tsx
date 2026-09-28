"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

export interface FinalCtaSectionProps {
  label?: string;
  heading?: string;
  italicWord?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bgImage?: string;
}

export default function FinalCtaSection({
  label = "FRESHLY BAKED DAILY",
  heading = "Ready to Taste",
  italicWord = "Perfection?",
  description = "Experience the crunch of our golden layers and the richness of premium French butter.",
  primaryCtaText = "Explore Our Menu",
  primaryCtaLink = "/menu",
  secondaryCtaText = "Order on WhatsApp",
  secondaryCtaLink = "https://wa.me/919876543210?text=Hello%20Spelloria%2C%20I%20would%20like%20to%20explore%20your%20fresh%20creations%20and%20place%20an%20order.",
  bgImage = "/images/croissant-macro-1.jpg",
}: FinalCtaSectionProps) {
  return (
    <section className="relative w-full h-[540px] sm:h-[660px] lg:h-[750px] overflow-hidden select-none bg-stone-950 flex items-center justify-center">
      {/* Background Image Container with Cinematic Zoom */}
      <motion.div
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
        className="absolute inset-0 z-0"
      >
        <img
          src={bgImage}
          alt="Freshly baked artisanal French croissants with delicate flaky layers"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
        />

        {/* Multi-layered Cinematic Gradient & Vignette Overlays for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />
      </motion.div>

      {/* Center Content Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center justify-center text-center">
        
        {/* Small Eyebrow Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5"
        >
          <span className="w-6 sm:w-8 h-[1px] bg-[#EAD8C3]/60" />
          <span className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.35em] uppercase text-[#EAD8C3] font-sans">
            {label}
          </span>
          <span className="w-6 sm:w-8 h-[1px] bg-[#EAD8C3]/60" />
        </motion.div>

        {/* Main Heading with Luxury Serif Typography */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[84px] text-white tracking-tight leading-[1.08] max-w-4xl mx-auto drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
        >
          {heading}{" "}
          {italicWord && (
            <span className="italic font-light text-[#FFF9F2] font-serif">
              {italicWord}
            </span>
          )}
        </motion.h2>

        {/* Description Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-sm sm:text-base md:text-lg text-white/90 font-light leading-relaxed max-w-xl sm:max-w-2xl mx-auto mt-4 sm:mt-6 px-2 drop-shadow-sm font-sans"
        >
          {description}
        </motion.p>

        {/* Call-to-Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 sm:mt-11 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full max-w-xs sm:max-w-none"
        >
          {/* Primary Button: Explore Our Menu (Styled with Reference Pill & Circular Arrow) */}
          <Link
            href={primaryCtaLink}
            className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-3.5 pl-6 sm:pl-7 pr-3 sm:pr-3.5 py-3 sm:py-3.5 rounded-full bg-white text-stone-900 font-sans font-medium text-sm sm:text-base shadow-[0_10px_35px_rgba(0,0,0,0.35)] hover:bg-[#FAF6F0] hover:shadow-[0_12px_45px_rgba(255,255,255,0.28)] hover:-translate-y-0.5 active:scale-98 transition-all duration-300 group cursor-pointer"
          >
            <span>{primaryCtaText}</span>
            <span className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:translate-x-0.5">
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>

          {/* Secondary Button: Order on WhatsApp (Premium Glass Effect) */}
          <a
            href={secondaryCtaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans font-medium text-sm sm:text-base border border-white/30 hover:border-white/55 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:scale-98 transition-all duration-300 group cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#25D366] transition-transform duration-300 group-hover:scale-110" />
            <span>{secondaryCtaText}</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
