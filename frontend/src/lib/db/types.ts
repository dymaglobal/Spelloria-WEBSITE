export interface WeightOption {
  id: string;
  weight: string; // e.g. "250g", "500g", "750g", "1kg", "1.5kg", "2kg"
  price: number;
  available: boolean;
}

export type ProductStatus =
  | "Available"
  | "Out of Stock"
  | "Seasonal"
  | "Limited Edition"
  | "Best Seller"
  | "New Arrival";

export interface DBProductImage {
  id: string;
  media_id: string;
  public_url: string;
  display_order: number;
  is_featured: boolean;
}

export interface DBProduct {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  short_description?: string;
  full_description?: string;
  price: number;
  discount_price?: number | null;
  weight_grams?: number;
  weight_options: WeightOption[];
  status: ProductStatus;
  is_archived: boolean;
  featured: boolean;
  best_seller: boolean;
  available: boolean;
  ingredients: string[];
  allergens: string[];
  tags: string[];
  notes?: string;
  shelf_life?: string;
  serving_info?: string;
  views_count: number;
  display_order: number;
  cover_image_url?: string;
  gallery_images: DBProductImage[];
  created_at: string;
  updated_at: string;
}

export interface DBCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  banner_image_url?: string;
  hero_image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBMediaItem {
  id: string;
  filename: string;
  stored_name: string;
  mime_type: string;
  file_size_bytes: number;
  public_url: string;
  width_px?: number | null;
  height_px?: number | null;
  alt_text?: string;
  tags?: string[];
  created_at: string;
}

export interface DBSiteSettings {
  brand_name: string;
  brand_color: string;
  accent_color: string;
  logo_url: string;
  favicon_url?: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  whatsapp_enabled: boolean;
  whatsapp_template: string;
  address: string;
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  pinterest_url?: string;
  meta_title: string;
  meta_description: string;
  og_image_url?: string;
  canonical_url?: string;
  schema_markup?: string;
  // Content Management
  hero_headline?: string;
  hero_subtitle?: string;
  hero_bg_image?: string;
  cta_label?: string;
  cta_heading?: string;
  cta_description?: string;
  cta_bg_image?: string;
  about_title?: string;
  about_text?: string;
  story_text?: string;
  footer_text?: string;
  footer_copyright?: string;
}

export interface DBUser {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  salt: string;
  full_name: string;
  role: "SUPER_ADMIN" | "ADMIN";
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
}

export interface DBActivityLog {
  id: string;
  user_name: string;
  action: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE" | "DUPLICATE" | "ARCHIVE" | "RESTORE" | "UPLOAD";
  resource_type: "PRODUCT" | "CATEGORY" | "MEDIA" | "SETTINGS" | "AUTH";
  resource_id?: string;
  resource_name?: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}

export interface DatabaseSchema {
  users: DBUser[];
  categories: DBCategory[];
  products: DBProduct[];
  media: DBMediaItem[];
  settings: DBSiteSettings;
  activity_logs: DBActivityLog[];
}
