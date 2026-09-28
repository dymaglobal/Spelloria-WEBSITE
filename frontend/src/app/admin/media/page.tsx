"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Copy,
  Trash2,
  Check,
  Image as ImageIcon,
  Search,
  HardDrive,
  Filter,
  RefreshCw,
  Loader2,
  Eye,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  X,
} from "lucide-react";

interface MediaItem {
  id: string;
  filename: string;
  stored_name?: string;
  mime_type?: string;
  public_url: string;
  file_size_bytes?: number;
  width_px?: number | null;
  height_px?: number | null;
  alt_text?: string;
  tags?: string[];
  created_at: string;
}

interface StorageStats {
  totalBytes: number;
  totalMB: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [storage, setStorage] = useState<StorageStats>({ totalBytes: 0, totalMB: "0.00" });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.media) {
        setMedia(data.media);
        if (data.storage) setStorage(data.storage);
      }
    } catch (err: any) {
      setError("Failed to load media items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      formData.append("tags", activeTag === "all" ? "general,upload" : `${activeTag},upload`);

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccess(`Successfully uploaded and converted ${files.length} asset(s) to WebP!`);
      await fetchMedia();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Are you sure you want to permanently delete "${item.filename}"?`)) return;

    try {
      const res = await fetch(`/api/media/${item.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete item");
      }

      setMedia(media.filter((m) => m.id !== item.id));
      if (selectedItem?.id === item.id) setSelectedItem(null);
      setSuccess("Media file deleted from disk and database.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete");
    }
  };

  const filteredMedia = media.filter((m) => {
    const matchesSearch =
      search === "" ||
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      m.alt_text?.toLowerCase().includes(search.toLowerCase()) ||
      m.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesTag =
      activeTag === "all" ||
      m.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header & Storage Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D27D46]">
            Asset Pipeline & Storage
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#35063D] mt-0.5">
            Media Library
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            High-efficiency WebP image engine with on-the-fly compression and cloud-ready storage.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            className="p-2.5 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
            title="Refresh assets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-[#35063D] hover:bg-[#4d0c57] text-white text-xs uppercase tracking-wider font-bold px-6 py-2.5 rounded-full transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Optimizing WebP...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Photos</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Storage & Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
              Total Assets
            </span>
            <span className="font-serif text-2xl font-bold text-[#35063D]">
              {media.length} Photos
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#FAF5EE] text-[#35063D] flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
              Disk Usage
            </span>
            <span className="font-serif text-2xl font-bold text-[#D27D46]">
              {storage.totalMB} MB
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#D27D46] flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
              Format Engine
            </span>
            <span className="font-serif text-2xl font-bold text-emerald-800">
              WebP 88% Q
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Drop Zone Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-[#35063D] bg-[#FAF5EE]/70 scale-[1.01]"
            : "border-stone-200/90 bg-white hover:border-stone-400 hover:bg-stone-50/50"
        }`}
      >
        <Upload className="w-8 h-8 text-[#D27D46] mx-auto mb-2" />
        <p className="font-serif text-base font-bold text-stone-800">
          Drag & Drop Confectionery Photos Here
        </p>
        <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
          High-res PNG, JPG or WebP images will be automatically processed into optimized, responsive WebP files.
        </p>
      </div>

      {/* Alerts */}
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

      {/* Search & Tag Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by filename or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-stone-200 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-[#35063D]"
          />
        </div>

        {/* Filter Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-stone-400 mr-1" />
          {["all", "product", "hero", "category", "banner", "cappuccino", "upload"].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-full capitalize font-medium transition-colors cursor-pointer ${
                activeTag === tag
                  ? "bg-[#35063D] text-white font-semibold"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#35063D] mb-3" />
          <p className="text-xs font-semibold">Synchronizing Media Library...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-stone-200/80">
          <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-3 stroke-1" />
          <h3 className="font-serif text-lg font-bold text-stone-700">No media assets found</h3>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or drag & drop high-resolution pastry images to upload.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Image Preview */}
              <div
                onClick={() => setSelectedItem(item)}
                className="relative aspect-square w-full bg-stone-100 cursor-pointer overflow-hidden"
              >
                <Image
                  src={item.public_url}
                  alt={item.alt_text || item.filename}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                />

                {/* Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono uppercase tracking-wider">
                  {item.mime_type?.includes("webp") || item.public_url.endsWith(".webp")
                    ? "WebP"
                    : "IMG"}
                </div>

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                    }}
                    className="p-2 rounded-full bg-white text-stone-800 hover:bg-stone-100 shadow-md"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyUrl(item.id, item.public_url);
                    }}
                    className="p-2 rounded-full bg-white text-stone-800 hover:bg-stone-100 shadow-md"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                    className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Metadata Info Footer */}
              <div className="p-3 text-[11px] space-y-1">
                <p className="font-semibold text-stone-800 truncate" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex items-center justify-between text-stone-400 text-[10px]">
                  <span>
                    {item.file_size_bytes
                      ? `${(item.file_size_bytes / 1024).toFixed(0)} KB`
                      : "Optimized"}
                  </span>
                  <span>
                    {item.width_px && item.height_px
                      ? `${item.width_px}×${item.height_px}`
                      : "Auto"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Asset Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FAF5EE]">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#35063D]" />
                <h3 className="font-serif font-bold text-lg text-[#35063D] truncate max-w-md">
                  {selectedItem.filename}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                <Image
                  src={selectedItem.public_url}
                  alt={selectedItem.alt_text || selectedItem.filename}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">File Size</span>
                  <span className="font-semibold text-stone-700">
                    {selectedItem.file_size_bytes
                      ? `${(selectedItem.file_size_bytes / 1024).toFixed(1)} KB`
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Format</span>
                  <span className="font-semibold text-stone-700">WebP / Image</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Resolution</span>
                  <span className="font-semibold text-stone-700">
                    {selectedItem.width_px ? `${selectedItem.width_px} × ${selectedItem.height_px} px` : "Fluid"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Uploaded</span>
                  <span className="font-semibold text-stone-700 truncate block">
                    {new Date(selectedItem.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-stone-500 mb-1">
                  Public URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedItem.public_url}
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-stone-50 border border-stone-200 text-stone-700 select-all"
                  />
                  <button
                    onClick={() => copyUrl(selectedItem.id, selectedItem.public_url)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#35063D] text-white text-xs font-bold hover:bg-[#4d0c57] transition-colors"
                  >
                    {copiedId === selectedItem.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedItem)}
                className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Asset</span>
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 rounded-full bg-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
