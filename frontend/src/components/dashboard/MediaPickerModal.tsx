"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Search,
  Upload,
  Check,
  ImageIcon,
  Loader2,
  Filter,
  Plus,
} from "lucide-react";

export interface MediaItem {
  id: string;
  filename: string;
  public_url: string;
  file_size_bytes?: number;
  width_px?: number | null;
  height_px?: number | null;
  alt_text?: string;
  tags?: string[];
  created_at: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, media?: MediaItem) => void;
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = "Select Media",
}: MediaPickerModalProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.media) {
        setMediaList(data.media);
      }
    } catch (err: any) {
      setError("Failed to fetch media assets");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      formData.append("tags", "product,upload");

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      if (data.items && data.items.length > 0) {
        // Auto-select the first newly uploaded item
        const first = data.items[0];
        setSelectedUrl(first.public_url);
        setSelectedItem(first);
        await fetchMedia();
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter((m) => {
    const matchesSearch =
      search === "" ||
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      m.alt_text?.toLowerCase().includes(search.toLowerCase());
    const matchesTag =
      activeTag === "all" ||
      m.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase());
    return matchesSearch && matchesTag;
  });

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl, selectedItem || undefined);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FAF5EE]">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#35063D]" />
            <h3 className="font-serif font-bold text-lg text-[#35063D]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative w-full max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-stone-200 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-[#35063D]"
              />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
              {["all", "product", "hero", "category", "banner"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`px-2.5 py-1 rounded-full capitalize font-medium transition-colors ${
                    activeTag === t
                      ? "bg-[#35063D] text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#D27D46] text-white hover:bg-[#b86935] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Optimizing WebP...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload & Optimize</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="px-6 py-2 bg-red-50 text-red-700 text-xs font-medium border-b border-red-100">
            {error}
          </div>
        )}

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#35063D] mb-2" />
              <p className="text-xs">Loading media assets...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-stone-400 text-center">
              <ImageIcon className="w-12 h-12 text-stone-300 mb-2 stroke-1" />
              <p className="font-serif text-sm font-semibold text-stone-600">No media found</p>
              <p className="text-xs text-stone-400 mt-1 max-w-xs">
                Upload new photos to convert them automatically into lightweight WebP format.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5">
              {filteredMedia.map((item) => {
                const isSelected = selectedUrl === item.public_url;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedUrl(item.public_url);
                      setSelectedItem(item);
                    }}
                    className={`group relative rounded-2xl overflow-hidden border aspect-square cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "border-[#35063D] ring-2 ring-[#35063D] ring-offset-2 shadow-md"
                        : "border-stone-200 bg-white hover:border-stone-400 hover:shadow-xs"
                    }`}
                  >
                    <Image
                      src={item.public_url}
                      alt={item.alt_text || item.filename}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />

                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-[#35063D] text-white rounded-full p-1 shadow-md">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Hover detail overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end text-[10px]">
                      <span className="truncate font-medium">{item.filename}</span>
                      <span className="text-stone-300">
                        {item.file_size_bytes ? `${(item.file_size_bytes / 1024).toFixed(0)} KB` : "WebP"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-white flex items-center justify-between">
          <div className="text-xs text-stone-500 truncate max-w-sm">
            {selectedUrl ? (
              <span className="font-mono text-[11px] text-[#35063D]">
                Selected: {selectedItem?.filename || selectedUrl}
              </span>
            ) : (
              <span>Click any image to select it</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedUrl}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-[#35063D] text-white hover:bg-[#4a0d54] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              Select Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
