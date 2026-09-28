"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  Check,
  Star,
  MoveUp,
  MoveDown,
  Sparkles,
  HelpCircle,
  ImageIcon,
  Loader2,
  Layers,
  Clock,
  Users,
  ShieldAlert,
  Tag,
  IndianRupee,
  Scale,
} from "lucide-react";
import { MediaPickerModal } from "./MediaPickerModal";

export interface WeightOption {
  id: string;
  weight: string;
  price: number;
  available: boolean;
}

export interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  category_id: string;
  short_description: string;
  description: string;
  price: number;
  discount_price: number | null;
  weight_grams?: number;
  weight_options: WeightOption[];
  status: string;
  is_archived: boolean;
  featured: boolean;
  best_seller: boolean;
  available: boolean;
  images: string[];
  ingredients: string[];
  allergens: string[];
  tags: string[];
  notes?: string;
  shelf_life?: string;
  serving_info?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  isEdit?: boolean;
}

const COMMON_ALLERGENS = [
  "Dairy",
  "Gluten",
  "Eggs",
  "Tree Nuts",
  "Peanuts",
  "Soy",
  "Sesame",
];

const PRESET_WEIGHTS = ["250g", "500g", "750g", "1kg", "1.5kg", "2kg"];

const STATUS_OPTIONS = [
  "Available",
  "Out of Stock",
  "Seasonal",
  "Limited Edition",
  "Best Seller",
  "New Arrival",
];

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [shortDesc, setShortDesc] = useState(initialData?.short_description || "");
  const [desc, setDesc] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [discountPrice, setDiscountPrice] = useState(
    initialData?.discount_price ? String(initialData.discount_price) : ""
  );

  // Status & Flags
  const [status, setStatus] = useState(initialData?.status || "Available");
  const [available, setAvailable] = useState(initialData?.available ?? true);
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [bestSeller, setBestSeller] = useState(initialData?.best_seller ?? false);

  // Images
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : []
  );

  // Weight Options
  const [weightOptions, setWeightOptions] = useState<WeightOption[]>(
    initialData?.weight_options && initialData.weight_options.length > 0
      ? initialData.weight_options
      : [
          { id: "w-1", weight: "500g", price: 599, available: true },
          { id: "w-2", weight: "1kg", price: 1099, available: true },
        ]
  );

  // Details
  const [ingredients, setIngredients] = useState<string[]>(
    initialData?.ingredients || ["French Butter AOP", "Madagascar Vanilla"]
  );
  const [newIngredient, setNewIngredient] = useState("");
  const [allergens, setAllergens] = useState<string[]>(
    initialData?.allergens || ["Dairy", "Gluten"]
  );
  const [tags, setTags] = useState<string[]>(
    initialData?.tags || ["Artisanal", "Boutique"]
  );
  const [newTag, setNewTag] = useState("");
  const [shelfLife, setShelfLife] = useState(initialData?.shelf_life || "3 Days refrigerated");
  const [servingInfo, setServingInfo] = useState(initialData?.serving_info || "Serves 4 to 6");
  const [notes, setNotes] = useState(
    initialData?.notes || "Keep refrigerated below 4°C. Best consumed within 48 hours."
  );

  // SEO
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || "");

  // Load categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
          if (!categoryId) {
            setCategoryId(data.categories[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoadingCats(false);
      }
    }
    fetchCategories();
  }, [categoryId]);

  // Auto-generate slug from name if not manually modified
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit || !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  // Image actions
  const handleAddImage = (url: string) => {
    if (!images.includes(url)) {
      setImages([...images, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleMakeFeatured = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([selected, ...rest]);
  };

  const handleMoveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const list = [...images];
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    setImages(list);
  };

  // Weight actions
  const handleAddWeight = (preset?: string) => {
    const wLabel = preset || "750g";
    const newWeight: WeightOption = {
      id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      weight: wLabel,
      price: price ? Math.round(parseFloat(price) * 1.5) : 899,
      available: true,
    };
    setWeightOptions([...weightOptions, newWeight]);
  };

  const handleUpdateWeight = (id: string, field: keyof WeightOption, val: any) => {
    setWeightOptions(
      weightOptions.map((w) => (w.id === id ? { ...w, [field]: val } : w))
    );
  };

  const handleRemoveWeight = (id: string) => {
    setWeightOptions(weightOptions.filter((w) => w.id !== id));
  };

  // Ingredients & Allergens
  const handleAddIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleToggleAllergen = (item: string) => {
    if (allergens.includes(item)) {
      setAllergens(allergens.filter((a) => a !== item));
    } else {
      setAllergens([...allergens, item]);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Product Name is required");
      return;
    }
    if (!price || isNaN(Number(price))) {
      setError("Valid Base Price is required");
      return;
    }
    if (!categoryId) {
      setError("Please select a Category");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category_id: categoryId,
      short_description: shortDesc.trim(),
      description: desc.trim(),
      price: parseFloat(price),
      discount_price: discountPrice ? parseFloat(discountPrice) : null,
      status,
      available,
      featured,
      best_seller: bestSeller,
      images,
      weight_options: weightOptions,
      ingredients,
      allergens,
      tags,
      shelf_life: shelfLife.trim(),
      serving_info: servingInfo.trim(),
      notes: notes.trim(),
      meta_title: metaTitle.trim() || `${name} | Spelloria Patisserie`,
      meta_description: metaDescription.trim() || shortDesc.trim(),
    };

    try {
      const url = isEdit ? `/api/products/${initialData?.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      setSuccess(
        isEdit
          ? "Product updated successfully!"
          : "New product created and saved to database!"
      );

      setTimeout(() => {
        router.push("/admin/products");
      }, 900);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-500 hover:text-[#35063D] transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#35063D]">
            {isEdit ? `Edit: ${initialData?.name}` : "Create New Confection"}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure luxury pastry details, portion pricing, photography and allergens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-4 py-2 rounded-full border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#35063D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#4d0c57] transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? "Update Product" : "Publish Confection"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column (2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Core Info */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#35063D] flex items-center gap-2">
                <span>General Information</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Royal Opera Gateau"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#35063D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="royal-opera-gateau"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#35063D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                      Category *
                    </label>
                    {loadingCats ? (
                      <div className="h-10 rounded-xl bg-stone-100 animate-pulse" />
                    ) : (
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#35063D]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                    Short Tagline / Teaser
                  </label>
                  <input
                    type="text"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="Rich layers of almond sponge, espresso ganache, and dark glaze."
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#35063D]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={4}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Detailed artisanal pastry description, craftsmanship techniques, and flavor profile..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#35063D] leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Images Manager */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#35063D]">
                    Product Photography
                  </h2>
                  <p className="text-xs text-stone-500">
                    The first image is the primary featured photo displayed in the gallery.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF5EE] border border-[#EAE3D8] text-xs font-bold text-[#35063D] hover:bg-[#F3EBE0] transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Choose from Media</span>
                </button>
              </div>

              {images.length === 0 ? (
                <div
                  onClick={() => setShowMediaPicker(true)}
                  className="border-2 border-dashed border-stone-200 rounded-2xl p-8 text-center hover:border-[#35063D] transition-colors cursor-pointer bg-stone-50/50"
                >
                  <ImageIcon className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-stone-700">No images attached yet</p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Click to pick from your high-res WebP media gallery or upload new shots
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-2xl overflow-hidden border border-stone-200 aspect-square bg-stone-50"
                    >
                      <Image
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      {idx === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#35063D] text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                          Cover
                        </div>
                      )}

                      {/* Overlay Controls */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleMakeFeatured(idx)}
                            className="p-1.5 rounded-full bg-white/90 text-stone-800 hover:bg-white text-xs"
                            title="Make Cover Image"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          </button>
                        )}
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, idx - 1)}
                            className="p-1.5 rounded-full bg-white/90 text-stone-800 hover:bg-white text-xs"
                            title="Move Earlier"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {idx < images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, idx + 1)}
                            className="p-1.5 rounded-full bg-white/90 text-stone-800 hover:bg-white text-xs"
                            title="Move Later"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 text-xs"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Multiple Weight Options with Individual Price & Availability */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#35063D] flex items-center gap-2">
                    <Scale className="w-5 h-5 text-[#D27D46]" />
                    <span>Weight Variants & Portion Pricing</span>
                  </h2>
                  <p className="text-xs text-stone-500">
                    Each weight option has its own independent price and stock status.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-stone-400 mr-1">Quick Add:</span>
                  {PRESET_WEIGHTS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => handleAddWeight(w)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700 hover:bg-[#35063D] hover:text-white transition-colors cursor-pointer"
                    >
                      +{w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Options Table */}
              <div className="space-y-2.5">
                {weightOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70"
                  >
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-0.5">
                        Weight / Portion
                      </label>
                      <input
                        type="text"
                        value={opt.weight}
                        onChange={(e) => handleUpdateWeight(opt.id, "weight", e.target.value)}
                        placeholder="e.g. 500g, 1kg, 6 pcs"
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold text-stone-800"
                      />
                    </div>

                    <div className="w-32">
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-0.5">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={opt.price}
                        onChange={(e) =>
                          handleUpdateWeight(opt.id, "price", parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-bold text-[#35063D]"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateWeight(opt.id, "available", !opt.available)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          opt.available
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {opt.available ? "In Stock" : "Sold Out"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveWeight(opt.id)}
                        disabled={weightOptions.length <= 1}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 cursor-pointer"
                        title="Remove weight"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pastry Details: Ingredients, Allergens, Shelf Life */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#35063D] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D27D46]" />
                <span>Artisanal Specifications</span>
              </h2>

              {/* Ingredients */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Ingredients
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddIngredient();
                      }
                    }}
                    placeholder="Type ingredient and press Enter or Add..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-stone-50/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 text-white text-xs font-semibold hover:bg-black"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium"
                    >
                      <span>{ing}</span>
                      <button
                        type="button"
                        onClick={() => setIngredients(ingredients.filter((i) => i !== ing))}
                        className="hover:text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Allergens Warning</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_ALLERGENS.map((allg) => {
                    const isSelected = allergens.includes(allg);
                    return (
                      <button
                        key={allg}
                        type="button"
                        onClick={() => handleToggleAllergen(allg)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-amber-100 text-amber-900 border border-amber-300 font-bold"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200 border border-transparent"
                        }`}
                      >
                        {isSelected ? `✓ ${allg}` : allg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Serving & Shelf Life */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Shelf Life</span>
                  </label>
                  <input
                    type="text"
                    value={shelfLife}
                    onChange={(e) => setShelfLife(e.target.value)}
                    placeholder="e.g. 3 Days refrigerated"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>Serving Information</span>
                  </label>
                  <input
                    type="text"
                    value={servingInfo}
                    onChange={(e) => setServingInfo(e.target.value)}
                    placeholder="e.g. Serves 4 to 6 people"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Storage & Handling Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Keep refrigerated below 4°C. Consume within 48 hours."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Right Column (1 span): Pricing, Status, Visibility, SEO */}
          <div className="space-y-6">
            {/* Base Pricing Card */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#35063D] flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-[#D27D46]" />
                <span>Base Pricing</span>
              </h2>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Default Base Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="599"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm font-bold text-[#35063D] focus:outline-none focus:ring-2 focus:ring-[#35063D]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Original / Strikethrough Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  placeholder="e.g. 749"
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#35063D]"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Optional. Shows a strikethrough if higher than Base Price.
                </span>
              </div>
            </div>

            {/* Status & Display Flags */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#35063D]">
                Status & Badges
              </h2>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Product Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-semibold text-stone-800"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">Available in Kitchen</span>
                    <span className="text-[10px] text-stone-500">Enable or pause customer orders</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="w-4 h-4 accent-[#35063D] rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">Featured Confection</span>
                    <span className="text-[10px] text-stone-500">Show on homepage curated showcase</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#35063D] rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">Best Seller Badge</span>
                    <span className="text-[10px] text-stone-500">Highlights popular boutique favorite</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={bestSeller}
                    onChange={(e) => setBestSeller(e.target.checked)}
                    className="w-4 h-4 accent-[#35063D] rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* SEO Optimization */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#35063D]">
                Search Optimization
              </h2>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={`${name || "Product"} | Spelloria Patisserie`}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Discover exquisite artisanal creations by Spelloria..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={(url) => handleAddImage(url)}
        title="Add Product Image"
      />
    </div>
  );
}
