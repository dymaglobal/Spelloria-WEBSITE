"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  X,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  banner_image_url?: string;
  hero_image_url?: string;
  display_order: number;
  is_active: boolean;
  productCount: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formHeroImg, setFormHeroImg] = useState("");
  const [formBannerImg, setFormBannerImg] = useState("");
  const [formOrder, setFormOrder] = useState(1);
  const [formActive, setFormActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
      }
    } catch (e: any) {
      console.error("Error fetching categories:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormDesc("");
    setFormHeroImg("/images/hero-cake-clean.png");
    setFormBannerImg("/images/collection-cakes.jpg");
    setFormOrder(categories.length + 1);
    setFormActive(true);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description || "");
    setFormHeroImg(cat.hero_image_url || "/images/hero-cake-clean.png");
    setFormBannerImg(cat.banner_image_url || "/images/collection-cakes.jpg");
    setFormOrder(cat.display_order);
    setFormActive(cat.is_active);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      setFormSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMsg("Category name is required");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const payload = {
        name: formName.trim(),
        slug: formSlug.trim() || formName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: formDesc.trim(),
        hero_image_url: formHeroImg.trim(),
        banner_image_url: formBannerImg.trim(),
        display_order: Number(formOrder),
        is_active: formActive,
      };

      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save category");
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (e: any) {
      setErrorMsg(e?.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (cat: CategoryItem) => {
    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !cat.is_active }),
      });
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, is_active: !c.is_active } : c))
        );
      }
    } catch (e) {
      console.error("Error toggling category status:", e);
    }
  };

  const changeOrder = async (cat: CategoryItem, direction: "up" | "down") => {
    const newOrder = direction === "up" ? cat.display_order - 1 : cat.display_order + 1;
    if (newOrder < 1) return;
    try {
      await fetch(`/api/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: newOrder }),
      });
      fetchCategories();
    } catch (e) {
      console.error("Error updating order:", e);
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    if (cat.productCount > 0) {
      alert(`Cannot delete "${cat.name}" because it contains ${cat.productCount} product(s). Please reassign or delete those products first.`);
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete category "${cat.name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/categories/${cat.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Failed to delete category");
        return;
      }
      fetchCategories();
    } catch (e) {
      console.error("Error deleting category:", e);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D27D46]">
            Taxonomy Architecture
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-0.5">
            Categories
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-light">
            Manage bakery collections, hero imagery, hierarchy, and public showcase visibility
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchCategories}
            className="p-2.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors shadow-2xs"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#35063D]" : ""}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#27072E] hover:bg-[#35063D] text-white text-xs uppercase tracking-widest font-bold px-5 py-2.5 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF5EE] border-b border-[#EAE3D8] text-stone-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4 w-20">Order</th>
                <th className="p-4">Category</th>
                <th className="p-4">Slug / Live Link</th>
                <th className="p-4">Products</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150/80 text-stone-800">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-stone-50/80 transition-colors">
                  {/* Order control */}
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-mono text-stone-500">
                      <span className="w-5 text-center font-bold">#{cat.display_order}</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => changeOrder(cat, "up")}
                          disabled={idx === 0}
                          className="hover:text-stone-900 disabled:opacity-20 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => changeOrder(cat, "down")}
                          disabled={idx === categories.length - 1}
                          className="hover:text-stone-900 disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Category info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#FAF5EE] border border-stone-200 shrink-0 flex items-center justify-center p-1">
                        <img
                          src={cat.hero_image_url || "/images/hero-cake-clean.png"}
                          alt={cat.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900 text-sm">{cat.name}</p>
                        <p className="text-[11px] text-stone-500 font-light line-clamp-1 max-w-xs">
                          {cat.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="p-4">
                    <Link
                      href={`/category/${cat.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-stone-600 hover:text-[#D27D46] font-mono text-[11px] bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1 rounded-full transition-colors"
                    >
                      <span>/{cat.slug}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>

                  {/* Product Count */}
                  <td className="p-4 font-semibold text-stone-700">
                    <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px]">
                      {cat.productCount} item(s)
                    </span>
                  </td>

                  {/* Visibility Toggle */}
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(cat)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        cat.is_active
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                      }`}
                      title="Click to toggle visibility"
                    >
                      {cat.is_active ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-stone-400" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-4 text-right space-x-1.5">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-[#35063D] hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-stone-150 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D27D46]">
                  {editingCategory ? "Update Category" : "New Collection"}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-stone-900 mt-0.5">
                  {editingCategory ? `Edit ${editingCategory.name}` : "Create Category"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 font-sans">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Specialty Éclairs"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#35063D]/20 focus:border-[#35063D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 font-sans">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. specialty-eclairs"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#35063D]/20 focus:border-[#35063D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 font-sans">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="2-3 lines describing this artisanal category collection..."
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#35063D]/20 focus:border-[#35063D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 font-sans">
                  Hero Image URL (Transparent PNG Recommended)
                </label>
                <input
                  type="text"
                  value={formHeroImg}
                  onChange={(e) => setFormHeroImg(e.target.value)}
                  placeholder="/images/hero-cake-clean.png"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#35063D]/20 focus:border-[#35063D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 font-sans">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(parseInt(e.target.value, 10) || 1)}
                    min={1}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 font-sans">
                    Showcase Visibility
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormActive(!formActive)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                      formActive
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-stone-100 text-stone-600 border-stone-200"
                    }`}
                  >
                    {formActive ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-stone-400" />}
                    <span>{formActive ? "Active" : "Hidden"}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-150">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#27072E] hover:bg-[#35063D] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
