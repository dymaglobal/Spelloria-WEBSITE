import React from "react";
import { notFound } from "next/navigation";
import CategoryClientView from "@/components/category/CategoryClientView";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/db/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();

  const category = getCategoryBySlug(normalizedSlug);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(category.id);

  return <CategoryClientView category={category} products={products} />;
}
