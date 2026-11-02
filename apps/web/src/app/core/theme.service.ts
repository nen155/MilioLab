import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of, shareReplay, tap } from 'rxjs';

import { ApiService } from './api.service';
import { SiteTheme, ThemeCatalogItem } from './models';
import { SiteService } from './site.service';

/**
 * Tema activo. Por defecto manda el tema activo del backoffice; el selector
 * «prueba mis diseños» puede aplicar otro tema solo durante esta visita.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly api = inject(ApiService);
  private readonly site = inject(SiteService);

  private readonly override = signal<ThemeCatalogItem | null>(null);
  private readonly catalog = signal<ThemeCatalogItem[]>([]);
  private request?: Observable<ThemeCatalogItem[]>;

  readonly themes = this.catalog.asReadonly();
  readonly overridden = computed(() => this.override() !== null);
  readonly current = computed<SiteTheme | null>(() => this.override() ?? this.site.site()?.theme ?? null);

  load(): Observable<ThemeCatalogItem[]> {
    if (this.catalog().length > 0) {
      return of(this.catalog());
    }

    this.request ??= this.api.getThemes().pipe(
      tap((themes) => this.catalog.set(themes)),
      shareReplay(1),
    );

    return this.request;
  }

  apply(theme: ThemeCatalogItem | null): void {
    this.override.set(theme);
  }

  reset(): void {
    this.override.set(null);
  }
}
