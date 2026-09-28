import React from "react";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE_CONFIG } from "@/lib/constants/site-config";

export const metadata = {
  title: "About Our Heritage & Story",
  description: "Discover the inspiration behind Spelloria Patisserie — where an ancient love legend meets French craftsmanship.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-brand-cream-canvas">
        {/* Editorial Page Header */}
        <section className="py-16 sm:py-24 border-b border-brand-cream-border text-center px-4">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta">
            Our Heritage & Craft
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-brand-purple mt-2 tracking-tight">
            The Story of Spelloria
          </h1>
          <p className="font-script text-2xl sm:text-3xl text-brand-terracotta mt-2">
            Love, Crafted Beautifully.
          </p>
        </section>

        {/* Origin Story Content */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="space-y-6 text-brand-espresso leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-purple">
              An Ancient Tale of Flavor and Devotion
            </h2>
            <p className="text-base sm:text-lg text-brand-espresso-muted">
              SPELLORIA is inspired by a centuries-old Persian love legend in which a young woman expressed her profound affection for a prince through an enchanted cake infused with rose, saffron, cardamom, and pistachios.
            </p>
            <p className="text-base sm:text-lg text-brand-espresso-muted">
              This timeless narrative represents the enduring belief that food can articulate emotions far beyond words, creating indelible memories for milestones, anniversaries, and spontaneous moments of joy.
            </p>
          </div>

          {/* Meaning of the Name */}
          <div className="bg-brand-cream-card rounded-2xl border border-brand-cream-border p-8 sm:p-10 space-y-6">
            <h3 className="font-serif text-2xl text-brand-purple">
              What &ldquo;Spelloria&rdquo; Means
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1 border-l-2 border-brand-terracotta pl-4">
                <span className="font-sans font-bold text-lg text-brand-espresso">SPELL</span>
                <p className="text-sm text-brand-espresso-muted">
                  Magic, enchantment, wonder, and the transcendent spark of shared emotion.
                </p>
              </div>
              <div className="space-y-1 border-l-2 border-brand-terracotta pl-4">
                <span className="font-sans font-bold text-lg text-brand-espresso">ORIA</span>
                <p className="text-sm text-brand-espresso-muted">
                  A dedicated world, a warm atmosphere, or an ever-continuing story.
                </p>
              </div>
            </div>
            <p className="text-sm text-brand-espresso-muted italic pt-2">
              Together, SPELLORIA represents a magical world where every creation carries a story.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="bg-brand-cream-card p-6 rounded-xl border border-brand-cream-border space-y-2">
              <Award className="w-6 h-6 text-brand-terracotta" />
              <h4 className="font-sans font-semibold text-brand-espresso text-base">French Technique</h4>
              <p className="text-xs text-brand-espresso-muted leading-relaxed">
                AOP French butter, Valrhona single-origin chocolates, and traditional viennoiserie methods.
              </p>
            </div>
            <div className="bg-brand-cream-card p-6 rounded-xl border border-brand-cream-border space-y-2">
              <Sparkles className="w-6 h-6 text-brand-terracotta" />
              <h4 className="font-sans font-semibold text-brand-espresso text-base">Uncompromising Taste</h4>
              <p className="text-xs text-brand-espresso-muted leading-relaxed">
                Layered textures, balanced sweetness, and delicate floral and spice undertones.
              </p>
            </div>
            <div className="bg-brand-cream-card p-6 rounded-xl border border-brand-cream-border space-y-2">
              <Heart className="w-6 h-6 text-brand-terracotta" />
              <h4 className="font-sans font-semibold text-brand-espresso text-base">Artisanal Dedication</h4>
              <p className="text-xs text-brand-espresso-muted leading-relaxed">
                Small-batch baking each morning, hand-decorated by passionate pastry artisans.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-8">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-full transition-all shadow-md active:scale-95"
            >
              <span>Explore Our Creations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
