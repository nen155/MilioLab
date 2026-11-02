import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Category,
  Page,
  Paginated,
  Post,
  PostSummary,
  Site,
  Tag,
  ThemeCatalogItem,
} from './models';

export interface PostQuery {
  page?: number;
  per_page?: number;
  category?: string;
  tag?: string;
  q?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBase;

  getSite(): Observable<Site> {
    return this.http.get<Site>(`${this.base}/site`);
  }

  getThemes(): Observable<ThemeCatalogItem[]> {
    return this.http
      .get<{ data: ThemeCatalogItem[] }>(`${this.base}/themes`)
      .pipe(map((response) => response.data));
  }

  getPage(slug: string): Observable<Page> {
    return this.http
      .get<{ data: Page }>(`${this.base}/pages/${encodeURIComponent(slug)}`)
      .pipe(map((response) => response.data));
  }

  getPosts(query: PostQuery = {}): Observable<Paginated<PostSummary>> {
    let params = new HttpParams();

    if (query.page) {
      params = params.set('page', query.page);
    }
    if (query.per_page) {
      params = params.set('per_page', query.per_page);
    }
    if (query.category) {
      params = params.set('category', query.category);
    }
    if (query.tag) {
      params = params.set('tag', query.tag);
    }
    if (query.q) {
      params = params.set('q', query.q);
    }

    return this.http.get<Paginated<PostSummary>>(`${this.base}/posts`, { params });
  }

  getPost(slug: string): Observable<Post> {
    return this.http
      .get<{ data: Post }>(`${this.base}/posts/${encodeURIComponent(slug)}`)
      .pipe(map((response) => response.data));
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<{ data: Category[] }>(`${this.base}/categories`)
      .pipe(map((response) => response.data));
  }

  getTags(): Observable<Tag[]> {
    return this.http
      .get<{ data: Tag[] }>(`${this.base}/tags`)
      .pipe(map((response) => response.data));
  }
}
