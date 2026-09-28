"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm, ProductFormData } from "@/components/dashboard/ProductForm";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load product");
        }

        setProduct(data.product);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-stone-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#35063D] mb-3" />
        <p className="text-xs font-semibold">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4">
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
          {error || "Product not found"}
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#35063D] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Products List</span>
        </Link>
      </div>
    );
  }

  return <ProductForm initialData={product} isEdit={true} />;
}
