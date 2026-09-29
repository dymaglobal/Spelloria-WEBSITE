"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Phone, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site-config";

interface NavbarProps {
  variant?: "transparent" | "solid";
}

export default function Navbar({ variant = "solid" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  // The transparent header style is exclusive to the homepage
  const isTransparentNavbar = isHomepage && variant === "transparent";
  const isScrolled = !isTransparentNavbar || scrolled;

  useEffect(() => {
    if (!isTransparentNavbar) {
      return;
    }

    const handleScroll = () => {
      // Transition between 80px and 100px as specified
      const scrollPos = window.scrollY || document.documentElement.scrollTop || window.pageYOffset || 0;
      setScrolled(scrollPos > 80);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [isTransparentNavbar]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const [phone, setPhone] = useState(SITE_CONFIG.phone);
  const [whatsappNumber, setWhatsappNumber] = useState(SITE_CONFIG.whatsappNumber);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.phone) setPhone(data.settings.phone);
          if (data.settings.whatsapp_number) setWhatsappNumber(data.settings.whatsapp_number);
        }
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Our Story", href: "/about" },
    { label: "Menu", href: "/menu" },
    { label: "Contact", href: "/contact" },
  ];

  const generalWhatsAppUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hello Spelloria, I would like to order fresh pastries and cakes."
  )}`;

  // Determine active visual state:
  // Non-homepage routes are ALWAYS solid white with black text and colored logo
  const isLightHeader = isScrolled;
  const showDarkMobileElements = isLightHeader || mobileMenuOpen;

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: isLightHeader ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0)",
          borderBottomColor: isLightHeader ? "rgba(231, 226, 219, 0.8)" : "rgba(255, 255, 255, 0)",
          boxShadow: isLightHeader ? "0 4px 20px rgba(0, 0, 0, 0.06)" : "0 0 0 rgba(0, 0, 0, 0)",
          paddingTop: isLightHeader ? "12px" : "20px",
          paddingBottom: isLightHeader ? "12px" : "20px",
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
        className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xs select-none transition-colors duration-300 ${
          isLightHeader ? "bg-white/98 border-stone-200/80 shadow-xs" : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex items-center justify-between">
          
          {/* -----------------------------------------------------------------
              LEFT: Official Brand Logo (Mobile-Optimized + Desktop Preserved)
              ----------------------------------------------------------------- */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="relative flex items-center group py-1">
              
              {/* Mobile & Tablet Logo (< md): Guaranteed 100% visibility & instant color switch */}
              <div className="md:hidden relative h-8 sm:h-9 w-28 sm:w-32 flex items-center">
                <img
                  key={showDarkMobileElements ? "mobile-brand-logo" : "mobile-white-logo"}
                  src={showDarkMobileElements ? "/images/logo-transparent.png" : "/images/logo-white.png"}
                  alt="Spelloria Pâtisserie"
                  className="h-full w-auto object-contain transition-opacity duration-300 drop-shadow-xs"
                />
              </div>

              {/* Desktop Logo (>= md) */}
              <div className="hidden md:block relative h-9 md:h-10 w-32 md:w-36 transition-transform duration-300 group-hover:scale-102">
                {isTransparentNavbar ? (
                  <>
                    {/* White Logo (Before Scroll on Homepage) */}
                    <motion.img
                      src="/images/logo-white.png"
                      alt="Spelloria Pâtisserie"
                      initial={false}
                      animate={{
                        opacity: isLightHeader ? 0 : 1,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute inset-0 h-full w-auto object-contain pointer-events-none drop-shadow-sm"
                    />

                    {/* Original Brand Logo (After Scroll on Homepage) */}
                    <motion.img
                      src="/images/logo-transparent.png"
                      alt="Spelloria Pâtisserie"
                      initial={false}
                      animate={{
                        opacity: isLightHeader ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute inset-0 h-full w-auto object-contain pointer-events-none"
                    />
                  </>
                ) : (
                  /* Solid Page Logo: Always the brand logo directly */
                  <img
                    src="/images/logo-transparent.png"
                    alt="Spelloria Pâtisserie"
                    className="h-full w-auto object-contain pointer-events-none"
                  />
                )}
              </div>
            </Link>
          </div>

          {/* -----------------------------------------------------------------
              CENTER: Desktop Navigation Links with Animated Underline
              ----------------------------------------------------------------- */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isHovered = hoveredNav === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredNav(link.href)}
                  onMouseLeave={() => setHoveredNav(null)}
                  className="relative py-1 text-xs uppercase tracking-[0.2em] font-semibold transition-colors duration-300 cursor-pointer"
                >
                  <motion.span
                    animate={{
                      color: isLightHeader
                        ? "#000000"
                        : isActive
                        ? "#FFFFFF"
                        : "rgba(255, 255, 255, 0.85)",
                    }}
                    transition={{ duration: 0.25 }}
                    className={isLightHeader ? (isActive ? "text-black font-bold" : "text-black hover:text-stone-700") : ""}
                  >
                    {link.label}
                  </motion.span>

                  {/* Elegant Animated Underline */}
                  <motion.span
                    initial={false}
                    animate={{
                      width: isActive || isHovered ? "100%" : "0%",
                      backgroundColor: isLightHeader ? "#000000" : "#FFFFFF",
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 h-[2px] rounded-full"
                  />
                </Link>
              );
            })}
          </nav>

          {/* -----------------------------------------------------------------
              RIGHT: CTA & Mobile Hamburger Trigger
              ----------------------------------------------------------------- */}
          <div className="flex-1 flex justify-end items-center space-x-4">
            {/* Desktop "Order Now" Button */}
            <motion.a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={false}
              animate={{
                backgroundColor: isLightHeader ? "#D27D46" : "rgba(255, 255, 255, 0.08)",
                borderColor: isLightHeader ? "#D27D46" : "rgba(255, 255, 255, 0.7)",
                color: "#FFFFFF",
                boxShadow: isLightHeader
                  ? "0 4px 14px rgba(210, 125, 70, 0.25)"
                  : "0 2px 8px rgba(0, 0, 0, 0.15)",
              }}
              whileHover={{ y: -1.5, scale: 1.02 }}
              whileTap={{ y: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="hidden sm:inline-flex items-center gap-2 text-[11px] tracking-widest uppercase font-semibold px-5 sm:px-6 py-2 rounded-full border transition-all cursor-pointer"
            >
              <span>Order Now</span>
              <ShoppingBag className="w-3.5 h-3.5" />
            </motion.a>

            {/* Mobile Menu Hamburger Trigger */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              animate={{
                color: showDarkMobileElements ? "#000000" : "#FFFFFF",
              }}
              transition={{ duration: 0.25 }}
              className={`md:hidden p-2 rounded-lg transition-colors focus:outline-hidden cursor-pointer ${
                showDarkMobileElements ? "text-black" : "text-white"
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

        </div>
      </motion.header>

      {/* -----------------------------------------------------------------
          MOBILE FULL-SCREEN SLIDE OVER MENU (Framer Motion Luxury Experience)
          ----------------------------------------------------------------- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-white/98 backdrop-blur-xl flex flex-col justify-between pt-24 pb-10 px-8 md:hidden"
          >
            {/* Top Navigation Links */}
            <div className="space-y-6 pt-6">
              <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-stone-400 block">
                Menu Navigation
              </span>

              <div className="space-y-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-center justify-between py-2 border-b border-stone-100"
                    >
                      <span
                        className={`font-serif text-2xl tracking-tight transition-colors ${
                          isActive ? "text-[#35063D] font-medium" : "text-stone-800 group-hover:text-[#D27D46]"
                        }`}
                      >
                        {link.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 group-hover:text-[#D27D46] transition-all" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Contact & WhatsApp Order Button (Easy Thumb Reach) */}
            <div className="space-y-4 pt-6 border-t border-stone-200/80">
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-[#188351] text-white text-sm uppercase tracking-wider font-semibold py-3.5 px-6 rounded-full shadow-md active:scale-98 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </a>

              <a
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-stone-100 text-stone-800 text-xs font-medium py-3 px-6 rounded-full hover:bg-stone-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-stone-600" />
                <span>Call Us ({phone})</span>
              </a>

              <div className="text-center pt-2">
                <span className="text-[11px] text-stone-400 tracking-wide">
                  Spelloria Pâtisserie • Fresh Daily
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
