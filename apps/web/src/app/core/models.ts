export type SettingValue = string | number | boolean | null;

export interface SiteSettings {
  [key: string]: SettingValue;
}

export interface MenuItem {
  id: number;
  label: string;
  url: string;
  target: string;
  children: MenuItem[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  posts_count?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
}

export interface Media {
  id: number;
  url: string;
  alt?: string | null;
  title?: string | null;
  width?: number | null;
  height?: number | null;
  mime_type: string;
  is_image?: boolean;
}

export interface Author {
  id: number;
  name: string;
}

export interface PostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  published_at?: string | null;
  category?: Category | null;
  cover?: Media | null;
  tags?: Tag[];
  author?: Author | null;
  reading_minutes: number;
}

export interface Post extends PostSummary {
  body: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  updated_at?: string | null;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  body: string | null;
  template: string;
  meta_title?: string | null;
  meta_description?: string | null;
  updated_at?: string | null;
}

export interface SiteTheme {
  name: string;
  tokens: Record<string, string>;
}

export interface Site {
  settings: SiteSettings;
  theme: SiteTheme | null;
  home: string | null;
  menu: MenuItem[];
  latest_posts: PostSummary[];
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}
