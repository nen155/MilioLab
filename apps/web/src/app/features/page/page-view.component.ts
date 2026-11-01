import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { absoluteUrl, plainText } from '../../core/format';
import { Page } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { SiteService } from '../../core/site.service';
import { ContentPipe } from '../../shared/content.pipe';

@Component({
  selector: 'app-page',
  imports: [RouterLink, ContentPipe],
  template: `
    @if (loading()) {
      <div class="article"><div class="skeleton" style="height: 280px"></div></div>
    } @else if (page(); as current) {
      <article class="article" [style.max-width]="current.template === 'wide' ? '100%' : null">
        <header class="article-head">
          <p class="kicker">página · {{ current.template }}</p>
          <h1>{{ current.title }}</h1>
          @if (current.excerpt) {
            <p class="lede">{{ current.excerpt }}</p>
          }
        </header>

        <div class="prose" [innerHTML]="current.body | content"></div>

        <footer class="article-foot">
          <a class="link-arrow" routerLink="/">← inicio</a>
          <span class="mono muted">MilioLab</span>
        </footer>
      </article>
    } @else {
      <section class="empty">
        <p class="kicker">404</p>
        <h1>Esta página no existe</h1>
        <p class="mono muted">Puede que el enlace esté mal escrito o que ya no esté publicada.</p>
        <a class="btn" routerLink="/">Volver al inicio</a>
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
