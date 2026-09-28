"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("1");
  const [saved, setSaved] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      router.push("/admin/categories");
    }, 1000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-brand-espresso-muted hover:text-brand-terracotta transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </Link>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-terracotta">
          Taxonomy Studio
        </span>
        <h1 className="font-serif text-3xl text-brand-purple mt-0.5">
          Create New Category
        </h1>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800">
          Category created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-brand-cream-card rounded-2xl border border-brand-cream-border p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider font-bold text-brand-espresso">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Artisanal Viennoiserie"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-brand-cream-border text-xs text-brand-espresso focus:outline-none focus:ring-1 focus:ring-brand-terracotta"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider font-bold text-brand-espresso">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-brand-cream-border text-xs text-brand-espresso font-mono focus:outline-none focus:ring-1 focus:ring-brand-terracotta"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider font-bold text-brand-espresso">
              Display Order Priority
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-brand-cream-border text-xs text-brand-espresso focus:outline-none focus:ring-1 focus:ring-brand-terracotta"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider font-bold text-brand-espresso">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short poetic overview of this category..."
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-brand-cream-border text-xs text-brand-espresso focus:outline-none focus:ring-1 focus:ring-brand-terracotta"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/categories"
            className="px-6 py-2.5 rounded-full border border-brand-cream-border text-xs uppercase tracking-wider font-bold text-brand-espresso hover:bg-brand-cream/60 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white text-xs uppercase tracking-widest font-bold px-8 py-2.5 rounded-full transition-all shadow-md active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Category</span>
          </button>
        </div>
      </form>
    </div>
  );
}
