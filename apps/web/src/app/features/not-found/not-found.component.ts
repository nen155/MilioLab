import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { absoluteUrl } from '../../core/format';
import { SeoService } from '../../core/seo.service';
import { SiteService } from '../../core/site.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="container section empty-state">
      <p class="eyebrow">Error 404</p>
      <h1>Esta página no existe</h1>
      <p class="muted">
        El enlace puede estar mal escrito o el contenido ya no está publicado.
      </p>
      <div class="hero-actions">
        <a class="button" routerLink="/">Ir al inicio</a>
        <a class="button button-ghost" routerLink="/blog">Ver el blog</a>
      </div>
    </section>
  `,
})
export class NotFoundComponent implements OnInit {
  private readonly site = inject(SiteService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({
      title: `Página no encontrada · ${this.site.siteName()}`,
      description: 'La página que buscas no existe.',
      url: absoluteUrl('/404'),
    });
  }
}
