import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data protection standards for Spelloria Patisserie.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-brand-cream-canvas py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta">
              Legal & Trust
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-brand-purple mt-1">
              Privacy Policy
            </h1>
            <p className="text-xs text-brand-espresso-muted mt-2">
              Last Updated: September 2026
            </p>
          </div>

          <div className="prose prose-stone text-sm text-brand-espresso-muted space-y-6 leading-relaxed">
            <p>
              At Spelloria Patisserie (&ldquo;Spelloria&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;), we respect your personal privacy. Because our ordering workflow operates via direct messaging on WhatsApp, we do not store sensitive payment card details, billing tokens, or unneeded personal profiles on our servers.
            </p>

            <h3 className="font-serif text-xl text-brand-espresso font-semibold">1. Information We Collect</h3>
            <p>
              When you browse our website, we may collect non-personally identifiable diagnostic analytics (such as browser type, referring URLs, and popular pastry views) to ensure optimal browsing performance.
            </p>

            <h3 className="font-serif text-xl text-brand-espresso font-semibold">2. WhatsApp Order Processing</h3>
            <p>
              When you click &ldquo;Order on WhatsApp&rdquo;, you are redirected to WhatsApp&apos;s external encrypted platform. Any personal address or delivery contact information you disclose during your conversation with our team is utilized solely to bake, customize, and deliver your order.
            </p>

            <h3 className="font-serif text-xl text-brand-espresso font-semibold">3. Inquiries & Contact</h3>
            <p>
              For any questions regarding your data privacy, please write to us at{" "}
              <a href="mailto:hello@spelloria.in" className="text-brand-terracotta underline">
                hello@spelloria.in
              </a>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
