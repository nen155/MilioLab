import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of, shareReplay, tap } from 'rxjs';

import { ApiService } from './api.service';
import { MenuItem, SettingValue, Site, SiteSettings } from './models';

@Injectable({ providedIn: 'root' })
export class SiteService {
  private readonly api = inject(ApiService);
  private readonly state = signal<Site | null>(null);
  private request?: Observable<Site>;

  readonly site = this.state.asReadonly();
  readonly loaded = computed(() => this.state() !== null);
  readonly settings = computed<SiteSettings>(() => this.state()?.settings ?? {});
  readonly menu = computed<MenuItem[]>(() => this.state()?.menu ?? []);
  readonly homeSlug = computed(() => this.state()?.home ?? null);
  readonly latestPosts = computed(() => this.state()?.latest_posts ?? []);

  readonly siteName = computed(() => this.setting('site_name', 'MilioLab'));
  readonly tagline = computed(() => this.setting('site_tagline', ''));

  load(): Observable<Site> {
    if (this.state() !== null) {
      return of(this.state()!);
    }

    this.request ??= this.api.getSite().pipe(
      tap((site) => this.state.set(site)),
      shareReplay(1),
    );

    return this.request;
  }

  setting<T extends SettingValue>(key: string, fallback: T): T {
    const value = this.settings()[key];

    return (value ?? fallback) as T;
  }
}
