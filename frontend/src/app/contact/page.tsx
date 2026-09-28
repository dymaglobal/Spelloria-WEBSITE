import React from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE_CONFIG } from "@/lib/constants/site-config";

export const metadata = {
  title: "Visit Our Boutique & Inquiries",
  description: "Find Spelloria Patisserie boutique location, operating hours, and contact details.",
};

export default function ContactPage() {
  const whatsAppGeneral = `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hello Spelloria, I have an inquiry about boutique orders and reservations."
  )}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-brand-cream-canvas">
        <section className="py-16 border-b border-brand-cream-border text-center px-4">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta">
            We Would Love To Welcome You
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-brand-purple mt-2 tracking-tight">
            Visit Our Boutique
          </h1>
          <p className="text-sm sm:text-base text-brand-espresso-muted max-w-xl mx-auto mt-3">
            Step into our warm Parisian-inspired boutique or reach out via WhatsApp for custom celebration cakes.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            
            {/* Details */}
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta">
                  Boutique Location
                </span>
                <h2 className="font-serif text-3xl text-brand-purple">
                  Spelloria Patisserie
                </h2>
                <p className="text-sm text-brand-espresso-muted leading-relaxed">
                  Located in the heart of the city, serving freshly baked morning pastries, artisanal celebration cakes, and espresso.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 rounded-xl bg-brand-cream-card border border-brand-cream-border">
                  <MapPin className="w-5 h-5 text-brand-terracotta shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-brand-espresso">Address</h4>
                    <p className="text-sm text-brand-espresso-muted mt-0.5">{SITE_CONFIG.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-xl bg-brand-cream-card border border-brand-cream-border">
                  <Clock className="w-5 h-5 text-brand-terracotta shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-brand-espresso">Operating Hours</h4>
                    <p className="text-sm text-brand-espresso-muted mt-0.5">{SITE_CONFIG.hours}</p>
                    <p className="text-xs text-brand-terracotta mt-1">Fresh batches baked daily at 8:30 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-xl bg-brand-cream-card border border-brand-cream-border">
                  <Phone className="w-5 h-5 text-brand-terracotta shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-brand-espresso">Direct Line</h4>
                    <p className="text-sm text-brand-espresso-muted mt-0.5">{SITE_CONFIG.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-xl bg-brand-cream-card border border-brand-cream-border">
                  <Mail className="w-5 h-5 text-brand-terracotta shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-brand-espresso">Electronic Mail</h4>
                    <p className="text-sm text-brand-espresso-muted mt-0.5">{SITE_CONFIG.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Chat Card */}
            <div className="bg-brand-cream-card rounded-3xl border border-brand-cream-border p-8 sm:p-10 space-y-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-brand-whatsapp/10 flex items-center justify-center text-brand-whatsapp">
                <MessageCircle className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta">
                  Instant Conversational Ordering
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-brand-purple mt-1">
                  Have a Question or Custom Cake Request?
                </h3>
                <p className="text-sm text-brand-espresso-muted mt-2 leading-relaxed">
                  We don’t believe in impersonal automated checkout. Connect directly with our pastry chefs via WhatsApp to plan flavors, portion sizes, or delivery schedules.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={whatsAppGeneral}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 bg-brand-whatsapp hover:bg-brand-whatsapp-hover text-white text-xs uppercase tracking-widest font-bold py-4 px-6 rounded-full transition-all shadow-md active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Conversation</span>
                </a>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
