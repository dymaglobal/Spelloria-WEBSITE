"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Archive,
  RefreshCw,
  ExternalLink,
  Cake,
  CheckCircle2,
  XCircle,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/formatters";

interface WeightOption {
  id: string;
  weight: string;
  price: number;
  available: boolean;
}

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  short_description?: string;
  price: number;
  discount_price?: number | null;
  weight_grams?: number;
  weight_options: WeightOption[];
  status: string;
  is_archived: boolean;
  featured: boolean;
  best_seller: boolean;
  available: boolean;
  ingredients: string[];
  allergens: string[];
  cover_image_url?: string;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showArchived, setShowArchived] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCat !== "all") params.set("category", selectedCat);
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      if (showArchived) params.set("include_archived", "true");

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
        if (data.categories) setCategories(data.categories);
      }
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCat, selectedStatus, showArchived]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Toggle quick availability
  const toggleAvailability = async (prod: ProductItem) => {
    try {
      const res = await fetch(`/api/products/${prod.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !prod.available }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, available: !p.available } : p))
        );
      }
    } catch (e) {
      console.error("Error toggling product availability:", e);
    }
  };

  // Duplicate Product
  const handleDuplicate = async (prod: ProductItem) => {
    try {
      const res = await fetch(`/api/products/${prod.id}/duplicate`, { method: "POST" });
      if (res.ok) {
        fetchProducts();
      } else {
        alert("Failed to duplicate product");
      }
    } catch (e) {
      console.error("Error duplicating product:", e);
    }
  };

  // Archive / Restore Product
  const handleArchive = async (prod: ProductItem) => {
    const action = prod.is_archived ? "restore" : "archive";
    if (!confirm(`Are you sure you want to ${action} "${prod.name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${prod.id}/archive`, { method: "POST" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (e) {
      console.error("Error toggling archive:", e);
    }
  };

  // Permanent Delete
  const handleDelete = async (prod: ProductItem) => {
    if (!confirm(`Are you sure you want to PERMANENTLY delete "${prod.name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${prod.id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (e) {
      console.error("Error deleting product:", e);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full select-none">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D27D46]">
            Catalog Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-0.5">
            Products
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-light">
            Manage bakery items, multiple weight variations, allergens, and stock availability
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors shadow-2xs"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#35063D]" : ""}`} />
          </button>

          <Link
            href="/admin/products/create"
            className="inline-flex items-center gap-2 bg-[#27072E] hover:bg-[#35063D] text-white text-xs uppercase tracking-widest font-bold px-5 py-2.5 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedCat("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCat === "all"
                ? "bg-[#27072E] text-white shadow-xs"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCat === cat.id
                  ? "bg-[#27072E] text-white shadow-xs"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Right filters: Search + Status dropdown + Archive checkbox */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-xs text-stone-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Seasonal">Seasonal</option>
            <option value="Limited Edition">Limited Edition</option>
            <option value="Best Seller">Best Seller</option>
            <option value="New Arrival">New Arrival</option>
          </select>

          {/* Archived checkbox */}
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              showArchived ? "bg-amber-100 text-amber-900 border-amber-300 font-semibold" : "bg-stone-50 text-stone-600 border-stone-200"
            }`}
          >
            {showArchived ? "Showing Archived" : "Show Archived"}
          </button>

          {/* Search box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#35063D]"
            />
          </div>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF5EE] border-b border-[#EAE3D8] text-stone-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Weight Variants</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150/80 text-stone-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-stone-500">
                    <Cake className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                    <p className="font-semibold">No products found matching criteria</p>
                    <p className="text-[11px] mt-1">Try resetting filters or click &quot;Add Product&quot; to create one.</p>
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const catName = categories.find((c) => c.id === prod.category_id)?.name || "Bakery";
                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-stone-50/80 transition-colors ${
                        prod.is_archived ? "opacity-60 bg-stone-50/40" : ""
                      }`}
                    >
                      {/* Product Name & Thumbnail */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.cover_image_url || "/images/collection-cakes.jpg"}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-900 text-sm truncate max-w-xs">
                              {prod.name}
                            </p>
                            <Link
                              href={`/product/${prod.slug}`}
                              target="_blank"
                              className="text-[11px] text-stone-400 hover:text-[#D27D46] font-mono flex items-center gap-1 mt-0.5"
                            >
                              <span>/{prod.slug}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#FAF5EE] text-stone-700 font-medium text-[11px] border border-[#EAE3D8]">
                          {catName}
                        </span>
                      </td>

                      {/* Weight Options Matrix */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {prod.weight_options && prod.weight_options.length > 0 ? (
                            prod.weight_options.map((w) => (
                              <span
                                key={w.id || w.weight}
                                className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                                  w.available
                                    ? "bg-stone-100 text-stone-700 border border-stone-200"
                                    : "bg-red-50 text-red-600 line-through border border-red-100"
                                }`}
                              >
                                {w.weight}: {formatPrice(w.price)}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-stone-400 font-mono">500g</span>
                          )}
                        </div>
                      </td>

                      {/* Base Price */}
                      <td className="p-4 font-semibold text-stone-900">
                        {formatPrice(prod.price)}
                        {prod.discount_price && (
                          <span className="text-[11px] text-stone-400 line-through block font-normal">
                            {formatPrice(prod.discount_price)}
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                            prod.status === "Best Seller"
                              ? "bg-amber-100 text-amber-800"
                              : prod.status === "Seasonal"
                              ? "bg-purple-100 text-purple-800"
                              : prod.status === "Out of Stock"
                              ? "bg-red-100 text-red-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {prod.status}
                        </span>
                        {prod.is_archived && (
                          <span className="ml-1 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-stone-300 text-stone-700">
                            Archived
                          </span>
                        )}
                      </td>

                      {/* Availability Toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => toggleAvailability(prod)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            prod.available
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                          }`}
                        >
                          {prod.available ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>In Stock</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-stone-400" />
                              <span>Sold Out</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 text-right space-x-1">
                        {/* Edit */}
                        <Link
                          href={`/admin/products/edit/${prod.id}`}
                          className="inline-flex p-1.5 rounded-lg text-stone-500 hover:text-[#35063D] hover:bg-stone-100 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(prod)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Duplicate Product"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Archive / Restore */}
                        <button
                          onClick={() => handleArchive(prod)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                          title={prod.is_archived ? "Restore Product" : "Archive Product"}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>

                        {/* Permanent Delete */}
                        <button
                          onClick={() => handleDelete(prod)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
