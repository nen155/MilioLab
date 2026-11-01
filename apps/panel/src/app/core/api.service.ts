import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  AdminUser,
  Category,
  Media,
  MenuItem,
  Page,
  PagePayload,
  Paginated,
  Post,
  PostPayload,
  SettingsResponse,
  Stats,
  Tag,
} from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBase}/admin`;

  login(email: string, password: string): Observable<{ token: string; user: AdminUser }> {
    return this.http.post<{ token: string; user: AdminUser }>(
      `${environment.apiBase}/auth/login`,
      { email, password, device_name: 'panel' },
    );
  }

  me(): Observable<AdminUser> {
    return this.http
      .get<{ data: AdminUser }>(`${environment.apiBase}/auth/me`)
      .pipe(map((response) => response.data));
  }

  logout(): Observable<unknown> {
    return this.http.post(`${environment.apiBase}/auth/logout`, {});
  }

  stats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.base}/stats`);
  }

  changePassword(payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Observable<unknown> {
    return this.http.put(`${this.base}/profile/password`, payload);
  }

  // --- Entradas ------------------------------------------------------------

  posts(params: { page?: number; q?: string; status?: string; per_page?: number } = {}) {
    return this.http.get<Paginated<Post>>(`${this.base}/posts`, { params: this.params(params) });
  }

  post(id: number): Observable<Post> {
    return this.http.get<{ data: Post }>(`${this.base}/posts/${id}`).pipe(map((r) => r.data));
  }

  createPost(payload: PostPayload): Observable<Post> {
    return this.http.post<{ data: Post }>(`${this.base}/posts`, payload).pipe(map((r) => r.data));
  }

  updatePost(id: number, payload: PostPayload): Observable<Post> {
    return this.http
      .put<{ data: Post }>(`${this.base}/posts/${id}`, payload)
      .pipe(map((r) => r.data));
  }

  deletePost(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/posts/${id}`);
  }

  // --- Páginas -------------------------------------------------------------

  pages(params: { page?: number; q?: string; status?: string; per_page?: number } = {}) {
    return this.http.get<Paginated<Page>>(`${this.base}/pages`, { params: this.params(params) });
  }

  page(id: number): Observable<Page> {
    return this.http.get<{ data: Page }>(`${this.base}/pages/${id}`).pipe(map((r) => r.data));
  }

  createPage(payload: PagePayload): Observable<Page> {
    return this.http.post<{ data: Page }>(`${this.base}/pages`, payload).pipe(map((r) => r.data));
  }

  updatePage(id: number, payload: PagePayload): Observable<Page> {
    return this.http
      .put<{ data: Page }>(`${this.base}/pages/${id}`, payload)
      .pipe(map((r) => r.data));
  }

  deletePage(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/pages/${id}`);
  }

  // --- Taxonomías ----------------------------------------------------------

  categories(): Observable<Category[]> {
    return this.http
      .get<{ data: Category[] }>(`${this.base}/categories`)
      .pipe(map((r) => r.data));
  }

  createCategory(payload: Partial<Category>): Observable<Category> {
    return this.http
      .post<{ data: Category }>(`${this.base}/categories`, payload)
      .pipe(map((r) => r.data));
  }

  updateCategory(id: number, payload: Partial<Category>): Observable<Category> {
    return this.http
      .put<{ data: Category }>(`${this.base}/categories/${id}`, payload)
      .pipe(map((r) => r.data));
  }

  deleteCategory(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/categories/${id}`);
  }

  tags(): Observable<Tag[]> {
    return this.http.get<{ data: Tag[] }>(`${this.base}/tags`).pipe(map((r) => r.data));
  }

  createTag(payload: Partial<Tag>): Observable<Tag> {
    return this.http.post<{ data: Tag }>(`${this.base}/tags`, payload).pipe(map((r) => r.data));
  }

  updateTag(id: number, payload: Partial<Tag>): Observable<Tag> {
    return this.http
      .put<{ data: Tag }>(`${this.base}/tags/${id}`, payload)
      .pipe(map((r) => r.data));
  }

  deleteTag(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/tags/${id}`);
  }

  // --- Multimedia ----------------------------------------------------------

  media(params: { page?: number; q?: string; type?: string; per_page?: number } = {}) {
    return this.http.get<Paginated<Media>>(`${this.base}/media`, { params: this.params(params) });
  }

  uploadMedia(file: File, alt = ''): Observable<Media> {
    const data = new FormData();
    data.append('file', file);
    if (alt) {
      data.append('alt', alt);
    }

    return this.http.post<{ data: Media }>(`${this.base}/media`, data).pipe(map((r) => r.data));
  }

  deleteMedia(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/media/${id}`);
  }

  // --- Menú ----------------------------------------------------------------

  menuItems(): Observable<MenuItem[]> {
    return this.http
      .get<{ data: MenuItem[] }>(`${this.base}/menu-items`)
      .pipe(map((r) => r.data));
  }

  createMenuItem(payload: Partial<MenuItem>): Observable<MenuItem> {
    return this.http
      .post<{ data: MenuItem }>(`${this.base}/menu-items`, payload)
      .pipe(map((r) => r.data));
  }

  updateMenuItem(id: number, payload: Partial<MenuItem>): Observable<MenuItem> {
    return this.http
      .put<{ data: MenuItem }>(`${this.base}/menu-items/${id}`, payload)
      .pipe(map((r) => r.data));
  }

  deleteMenuItem(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/menu-items/${id}`);
  }

  reorderMenu(items: Array<{ id: number; position: number; parent_id: number | null }>) {
    return this.http
      .put<{ data: MenuItem[] }>(`${this.base}/menu-items/order`, { items })
      .pipe(map((r) => r.data));
  }

  // --- Ajustes -------------------------------------------------------------

  settings(): Observable<SettingsResponse> {
    return this.http.get<SettingsResponse>(`${this.base}/settings`);
  }

  saveSettings(items: Array<Partial<SettingPayload>>): Observable<unknown> {
    return this.http.put(`${this.base}/settings`, { settings: items });
  }

  private params(values: Record<string, unknown>): HttpParams {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }

    return params;
  }
}

export interface SettingPayload {
  key: string;
  value: string | number | boolean | null;
  type: string;
  group: string;
}
