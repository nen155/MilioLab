export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  is_admin: boolean;
}

export interface Category {
  id: number;
  name: string;
  name_en?: string | null;
  slug: string;
  description?: string | null;
  description_en?: string | null;
  posts_count?: number;
}

export interface Tag {
  id: number;
  name: string;
  name_en?: string | null;
  slug: string;
  posts_count?: number;
}

export interface Media {
  id: number;
  filename: string;
  url: string;
  mime_type: string;
  size: number;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  title?: string | null;
  is_image?: boolean;
  created_at?: string | null;
}

export interface Author {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
  title_en?: string | null;
  slug: string;
  excerpt?: string | null;
  excerpt_en?: string | null;
  body: string | null;
  body_en?: string | null;
  status: 'draft' | 'published';
  published_at?: string | null;
  category?: Category | null;
  cover?: Media | null;
  tags?: Tag[];
  author?: Author | null;
  reading_minutes: number;
  reading_minutes_en?: number;
  meta_title?: string | null;
  meta_title_en?: string | null;
  meta_description?: string | null;
  meta_description_en?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Page {
  id: number;
  title: string;
  title_en?: string | null;
  slug: string;
  excerpt?: string | null;
  excerpt_en?: string | null;
  body: string | null;
  body_en?: string | null;
  template: 'default' | 'wide' | 'landing';
  status: 'draft' | 'published';
  published_at?: string | null;
  meta_title?: string | null;
  meta_title_en?: string | null;
  meta_description?: string | null;
  meta_description_en?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MenuItem {
  id: number;
  label: string;
  label_en?: string | null;
  url: string;
  raw_url?: string | null;
  page_id?: number | null;
  parent_id?: number | null;
  position: number;
  target: '_self' | '_blank';
  is_active: boolean;
  children?: MenuItem[];
}

export interface SettingItem {
  key: string;
  value: string | number | boolean | null;
  type: 'string' | 'text' | 'bool' | 'int' | 'json';
  group: string;
}


/** Cuerpo que se envía a la API al guardar una entrada. */
export interface PostPayload {
  title: string;
  title_en: string | null;
  slug: string;
  excerpt: string | null;
  excerpt_en: string | null;
  body: string | null;
  body_en: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  category_id: number | null;
  cover_media_id: number | null;
  meta_title: string | null;
  meta_title_en: string | null;
  meta_description: string | null;
  meta_description_en: string | null;
  tags: number[];
}

/** Cuerpo que se envía a la API al guardar una página. */
export interface PagePayload {
  title: string;
  title_en: string | null;
  slug: string;
  excerpt: string | null;
  excerpt_en: string | null;
  body: string | null;
  body_en: string | null;
  template: 'default' | 'wide' | 'landing';
  status: 'draft' | 'published';
  published_at: string | null;
  meta_title: string | null;
  meta_title_en: string | null;
  meta_description: string | null;
  meta_description_en: string | null;
}

export interface Theme {
  id: number;
  name: string;
  slug: string;
  layout: 'notebook' | 'cards' | 'sketch' | 'hud';
  tokens: Record<string, string>;
  is_active: boolean;
  updated_at?: string | null;
}

export interface SettingsResponse {
  settings: Record<string, string | number | boolean | null>;
  groups: Record<string, SettingItem[]>;
}

export interface Stats {
  posts: { total: number; published: number; drafts: number };
  pages: { total: number; published: number };
  media: number;
  categories: number;
  tags: number;
  recent_posts: Array<{
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    category?: string | null;
    updated_at?: string | null;
  }>;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}
