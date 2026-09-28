"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, MapPin, Phone, Mail, Clock } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site-config";
import { DBCategory, DBSiteSettings } from "@/lib/db/types";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [settings, setSettings] = useState<Partial<DBSiteSettings> | null>(null);

  useEffect(() => {
    // Load live categories from database
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});

    // Load live settings from database
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const displayedCategories =
    categories.length > 0 ? categories : (SITE_CONFIG.defaultCategories as any);

  const address = settings?.address || SITE_CONFIG.address;
  const phone = settings?.phone || SITE_CONFIG.phone;
  const email = settings?.email || SITE_CONFIG.email;
  const whatsappNumber = settings?.whatsapp_number || SITE_CONFIG.whatsappNumber;
  const storyExcerpt = settings?.story_text || SITE_CONFIG.storyExcerpt;
  const footerCopyright = settings?.footer_copyright || `© ${currentYear} Spelloria Patisserie. All rights reserved.`;

  return (
    <footer className="bg-brand-espresso text-brand-cream border-t border-brand-espresso-muted/30">
      {/* Brand Slogan Ribbon */}
      <div className="border-b border-brand-cream/10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-center sm:text-left">
          <p className="font-serif text-2xl sm:text-3xl text-brand-terracotta-light">
            More than just Cake.
          </p>
          <div className="flex items-center gap-3 text-xs tracking-widest uppercase font-medium text-brand-cream/70">
            {SITE_CONFIG.mantras.map((mantra, i) => (
              <React.Fragment key={mantra}>
                <span>{mantra}</span>
                {i < SITE_CONFIG.mantras.length - 1 && <span className="opacity-40">•</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block py-1">
              <img
                src={settings?.logo_url || "/images/logo-white.png"}
                alt="Spelloria Pâtisserie"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-brand-cream/80 leading-relaxed font-light">
              {storyExcerpt}
            </p>
            <div className="pt-2 flex items-center space-x-3">
              <a
                href={settings?.instagram_url || SITE_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-cream/10 hover:bg-brand-terracotta flex items-center justify-center text-brand-cream transition-colors"
                aria-label="Instagram"
              >
                <span className="font-serif font-bold text-xs">IG</span>
              </a>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#188351] hover:bg-[#12633d] flex items-center justify-center text-white transition-colors"
                aria-label="WhatsApp Direct Support"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-terracotta">
              Explore Spelloria
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/menu" className="hover:text-brand-terracotta transition-colors">
                  Artisanal Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-terracotta transition-colors">
                  Our Heritage & Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-terracotta transition-colors">
                  Visit Boutique
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-terracotta transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-terracotta transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories (Loaded Dynamically from Database) */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-terracotta">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {displayedCategories.map((cat: any) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-brand-terracotta transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Boutique Visit & Inquiries */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-terracotta">
              Patisserie Boutique
            </h4>
            <ul className="space-y-3 text-sm text-brand-cream/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-terracotta mt-0.5 shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-terracotta shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-brand-terracotta">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-terracotta shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-brand-terracotta">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-brand-terracotta shrink-0" />
                <span>{SITE_CONFIG.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-12 mt-12 border-t border-brand-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-cream/60">
          <p>{footerCopyright}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-brand-cream transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-brand-cream transition-colors">
              Terms
            </Link>
            <Link href="/admin" className="text-stone-400 hover:text-white transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
