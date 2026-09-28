import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service",
  description: "Terms and conditions of service for Spelloria Patisserie.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-brand-cream-canvas py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta">
              Terms & Conditions
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-brand-purple mt-1">
              Terms of Service
            </h1>
            <p className="text-xs text-brand-espresso-muted mt-2">
              Last Updated: September 2026
            </p>
          </div>

          <div className="prose prose-stone text-sm text-brand-espresso-muted space-y-6 leading-relaxed">
            <h3 className="font-serif text-xl text-brand-espresso font-semibold">1. Artisanal Availability</h3>
            <p>
              All cakes, pastries, viennoiserie, and desserts showcased on Spelloria Patisserie are handcrafted fresh daily. Portions are subject to kitchen capacity and seasonal ingredient availability.
            </p>

            <h3 className="font-serif text-xl text-brand-espresso font-semibold">2. Order Confirmation</h3>
            <p>
              Placing an order via our WhatsApp link generates a pre-formatted request. An order is deemed officially confirmed once our team verifies production scheduling and agrees on fulfillment details with you on WhatsApp.
            </p>

            <h3 className="font-serif text-xl text-brand-espresso font-semibold">3. Allergen Notice</h3>
            <p>
              While our kitchen maintains strict sanitary separation, our creations may contain or come into contact with common allergens including dairy, wheat (gluten), eggs, tree nuts, and peanuts. Please alert our team of any severe allergies prior to order confirmation.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
