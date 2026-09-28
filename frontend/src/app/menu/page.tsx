import React from "react";
import MenuClientView from "@/components/menu/MenuClientView";
import { getPublicCategories, getPublicProducts } from "@/lib/db/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function MenuPage() {
  const categories = getPublicCategories();
  const products = getPublicProducts();

  return <MenuClientView categories={categories} products={products} />;
}
