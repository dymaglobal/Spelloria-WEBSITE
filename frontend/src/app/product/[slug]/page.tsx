import React from "react";
import { notFound } from "next/navigation";
import ProductDetailClientView from "@/components/product/ProductDetailClientView";
import {
  getProductBySlug,
  getCategoryBySlug,
  getRelatedProducts,
  getStoreSettings,
} from "@/lib/db/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.category_id);
  const relatedProducts = getRelatedProducts(product.id, product.category_id, 4);
  const settings = getStoreSettings();

  return (
    <ProductDetailClientView
      product={product}
      category={category}
      relatedProducts={relatedProducts}
      settings={settings}
    />
  );
}
