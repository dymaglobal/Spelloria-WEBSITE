import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif-evantic",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans-lufga",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-script-signature",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Spelloria Patisserie | Artisanal French Bakery & Luxury Desserts",
    template: "%s | Spelloria Patisserie",
  },
  description:
    "Handcrafted artisanal cakes, French viennoiserie, cookies, and luxury desserts crafted with authentic French techniques. Order on WhatsApp.",
  keywords: [
    "Spelloria Patisserie",
    "Luxury Bakery",
    "French Pastries",
    "Artisanal Cakes",
    "WhatsApp Bakery Order",
    "Celebration Cakes",
  ],
  metadataBase: new URL("https://spelloria.com"),
  openGraph: {
    title: "Spelloria Patisserie | Artisanal French Bakery",
    description: "Love, Crafted Beautifully. Handcrafted cakes and desserts.",
    url: "https://spelloria.com",
    siteName: "Spelloria Patisserie",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} ${caveat.variable}`}
    >
      <body className="min-h-screen bg-brand-cream-canvas text-brand-espresso antialiased selection:bg-brand-terracotta selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
