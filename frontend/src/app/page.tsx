import React from "react";
import HomeClientView from "@/components/home/HomeClientView";
import { getPublicCategories, getPublicProducts, getStoreSettings } from "@/lib/db/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  const categories = getPublicCategories();
  const products = getPublicProducts();
  const settings = getStoreSettings();

  return (
    <HomeClientView
      categories={categories}
      products={products}
      settings={settings}
    />
  );
}
