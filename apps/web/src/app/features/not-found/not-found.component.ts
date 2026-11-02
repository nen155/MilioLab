import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { absoluteUrl } from '../../core/format';
import { SeoService } from '../../core/seo.service';
import { I18nService } from '../../core/i18n';
import { SiteService } from '../../core/site.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="empty">
      <p class="kicker">{{ i18n.t('notFound.kicker') }}</p>
      <h1 class="display" style="font-size: clamp(2rem, 5vw, 3.4rem)">{{ i18n.t('notFound.title') }}</h1>
      <p class="lede" style="margin-inline: auto">
        {{ i18n.t('notFound.text') }}
      </p>
      <div class="hero-actions" style="justify-content: center">
        <a class="btn" routerLink="/">{{ i18n.t('notFound.home') }}</a>
        <a class="btn btn-ghost" routerLink="/blog">{{ i18n.t('notFound.index') }}</a>
      </div>
    </section>
  `,
})
export class NotFoundComponent {
  private readonly site = inject(SiteService);
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      this.seo.set({
        title: `${this.i18n.t('notFound.title')} · ${this.site.siteName()}`,
        description: this.i18n.t('notFound.text'),
        url: absoluteUrl('/404'),
      });
    });
  }
}
