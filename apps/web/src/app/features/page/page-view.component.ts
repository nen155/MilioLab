import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { absoluteUrl, plainText } from '../../core/format';
import { Page } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { SiteService } from '../../core/site.service';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';

@Component({
  selector: 'app-page',
  imports: [RouterLink, SafeHtmlPipe],
  template: `
    @if (loading()) {
      <div class="container section">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line"></div>
      </div>
    } @else if (page(); as current) {
      <article class="container section page-view" [class.page-wide]="current.template === 'wide'">
        <header class="page-header">
          <p class="eyebrow">Página</p>
          <h1>{{ current.title }}</h1>
          @if (current.excerpt) {
            <p class="lede">{{ current.excerpt }}</p>
          }
        </header>

        <div class="prose" [innerHTML]="current.body | safeHtml"></div>
      </article>
    } @else {
      <section class="container section empty-state">
        <h1>Página no encontrada</h1>
        <p class="muted">Puede que el enlace esté mal escrito o que la página ya no exista.</p>
        <a class="button" routerLink="/">Volver al inicio</a>
      </section>
    }
  `,
})
export class PageViewComponent {
  readonly slug = input.required<string>();

  private readonly api = inject(ApiService);
  private readonly site = inject(SiteService);
  private readonly seo = inject(SeoService);

  protected readonly page = signal<Page | null>(null);
  protected readonly loading = signal(true);

  constructor() {
    effect(() => {
      const slug = this.slug();
      this.loading.set(true);

      this.api.getPage(slug).subscribe({
        next: (page) => {
          this.page.set(page);
          this.loading.set(false);
          this.seo.set({
            title: `${page.meta_title || page.title} · ${this.site.siteName()}`,
            description: page.meta_description || page.excerpt || plainText(page.body),
            url: absoluteUrl(`/${page.slug}`),
          });
        },
        error: () => {
          this.page.set(null);
          this.loading.set(false);
          this.seo.set({
            title: `Página no encontrada · ${this.site.siteName()}`,
            url: absoluteUrl(`/${slug}`),
          });
        },
      });
    });
  }
}
