export type SettingValue = string | number | boolean | null;

export interface SiteSettings {
  [key: string]: SettingValue;
}

export interface MenuItem {
  id: number;
  label: string;
  label_en?: string | null;
  url: string;
  target: string;
  children: MenuItem[];
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
  title_en?: string | null;
  slug: string;
  excerpt?: string | null;
  excerpt_en?: string | null;
  published_at?: string | null;
  category?: Category | null;
  cover?: Media | null;
  tags?: Tag[];
  author?: Author | null;
  reading_minutes: number;
  reading_minutes_en?: number;
}

export interface Post extends PostSummary {
  body: string | null;
  body_en?: string | null;
  meta_title?: string | null;
  meta_title_en?: string | null;
  meta_description?: string | null;
  meta_description_en?: string | null;
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
  template: string;
  meta_title?: string | null;
  meta_title_en?: string | null;
  meta_description?: string | null;
  meta_description_en?: string | null;
  updated_at?: string | null;
}

export interface ThemeRailItem {
  label: string;
  value: string;
}

export interface ThemeRailConfig {
  aria?: string;
  subtitle?: string;
  type?: string;
  foot?: string;
  items?: ThemeRailItem[];
}

export interface ThemeConfig {
  rail?: ThemeRailConfig;
}

export interface SiteTheme {
  name: string;
  layout?: string;
  tokens: Record<string, string>;
  config?: ThemeConfig | null;
}

export interface ThemeCatalogItem extends SiteTheme {
  id: number;
  slug: string;
  layout_label: string;
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
