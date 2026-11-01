import { Component, OnInit, inject } from '@angular/core';
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
        La muestra que buscas no está aquí. Puede que el enlace esté mal escrito o que el
        experimento se haya archivado.
      </p>
      <div class="hero-actions" style="justify-content: center">
        <a class="btn" routerLink="/">{{ i18n.t('notFound.home') }}</a>
        <a class="btn btn-ghost" routerLink="/blog">{{ i18n.t('notFound.index') }}</a>
      </div>
    </section>
  `,
})
export class NotFoundComponent implements OnInit {
  private readonly site = inject(SiteService);
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({
      title: `Página no encontrada · ${this.site.siteName()}`,
      description: 'La página que buscas no existe.',
      url: absoluteUrl('/404'),
    });
  }
}
