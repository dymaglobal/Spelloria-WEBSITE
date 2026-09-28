export interface MediaItem {
  id: string;
  filename: string;
  stored_name: string;
  mime_type: string;
  file_size_bytes: number;
  width_px?: number | null;
  height_px?: number | null;
  public_url: string;
  alt_text?: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  banner_image_id?: string | null;
  thumbnail_id?: string | null;
  banner_image?: MediaItem | null;
  thumbnail?: MediaItem | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  media_id: string;
  display_order: number;
  is_featured: boolean;
  media?: MediaItem | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description?: string | null;
  full_description?: string | null;
  price: number;
  discount_price?: number | null;
  weight_grams?: number | null;
  category_id: string;
  featured: boolean;
  best_seller: boolean;
  available: boolean;
  thumbnail_image_id?: string | null;
  cover_image_id?: string | null;
  thumbnail_image?: MediaItem | null;
  cover_image?: MediaItem | null;
  gallery_images: ProductImage[];
  category?: Category | null;
  ingredients: string[];
  allergens: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface WebsiteSettings {
  brand_name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  whatsapp_template: string;
  address: string;
  instagram_url?: string | null;
  facebook_url?: string | null;
  youtube_url?: string | null;
  meta_title: string;
  meta_description: string;
  google_analytics_id?: string | null;
  meta_pixel_id?: string | null;
  logo?: MediaItem | null;
  favicon?: MediaItem | null;
}

export interface WhatsAppOrderLead {
  id: string;
  product_id?: string | null;
  product_name: string;
  unit_price: number;
  weight_label?: string | null;
  quantity: number;
  generated_payload: string;
  status: "INITIATED" | "CONFIRMED" | "CANCELLED" | "FULFILLED";
  notes?: string | null;
  created_at: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
