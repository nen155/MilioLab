import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { absoluteUrl, plainText } from '../../core/format';
import { I18nService } from '../../core/i18n';
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
          <p class="kicker">{{ i18n.t('page.kicker', { template: templateName() }) }}</p>
          <h1>{{ title() }}</h1>
          @if (excerpt()) {
            <p class="lede">{{ excerpt() }}</p>
          }
        </header>

        <div class="prose" [innerHTML]="body() | content"></div>

        <footer class="article-foot">
          <a class="link-arrow" routerLink="/">{{ i18n.t('page.back') }}</a>
          <span class="mono muted">MilioLab</span>
        </footer>
      </article>
    } @else {
      <section class="empty">
        <p class="kicker">404</p>
        <h1>{{ i18n.t('page.notFound') }}</h1>
        <p class="mono muted">{{ i18n.t('page.notFoundText') }}</p>
        <a class="btn" routerLink="/">{{ i18n.t('page.backHome') }}</a>
      </section>
    }
  `,
})
export class PageViewComponent {
  readonly slug = input.required<string>();

  private readonly api = inject(ApiService);
  private readonly site = inject(SiteService);
  private readonly seo = inject(SeoService);
  protected readonly i18n = inject(I18nService);

  protected readonly page = signal<Page | null>(null);
  protected readonly loading = signal(true);

  protected readonly title = computed(() => this.i18n.content(this.page()?.title, this.page()?.title_en));
  protected readonly excerpt = computed(() => this.i18n.content(this.page()?.excerpt, this.page()?.excerpt_en));
  protected readonly body = computed(() => this.i18n.content(this.page()?.body, this.page()?.body_en));
  protected readonly templateName = computed(() => {
    const template = this.page()?.template ?? 'default';

    return this.i18n.t(`page.template.${template}`);
  });

  constructor() {
    effect(() => {
      const slug = this.slug();
      this.loading.set(true);

      this.api.getPage(slug).subscribe({
        next: (page) => {
          this.page.set(page);
          this.loading.set(false);
        },
        error: () => {
          this.page.set(null);
          this.loading.set(false);
        },
      });
    });

    effect(() => {
      const page = this.page();
      const siteName = this.site.siteName();
      const url = absoluteUrl(`/${page?.slug ?? this.slug()}`);

      if (!page) {
        if (!this.loading()) {
          this.seo.set({ title: `${this.i18n.t('page.notFound')} · ${siteName}`, url });
        }

        return;
      }

      this.seo.set({
        title: `${this.i18n.content(page.meta_title, page.meta_title_en) || this.title()} · ${siteName}`,
        description:
          this.i18n.content(page.meta_description, page.meta_description_en) ||
          this.i18n.content(page.excerpt, page.excerpt_en) ||
          plainText(this.i18n.content(page.body, page.body_en)),
        url,
      });
    });
  }
}
