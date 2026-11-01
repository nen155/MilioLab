import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { absoluteUrl } from '../../core/format';
import { SeoService } from '../../core/seo.service';
import { SiteService } from '../../core/site.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="empty">
      <p class="kicker">error 404</p>
      <h1 class="display" style="font-size: clamp(2rem, 5vw, 3.4rem)">Nada en este tubo de ensayo</h1>
      <p class="lede" style="margin-inline: auto">
        La muestra que buscas no está aquí. Puede que el enlace esté mal escrito o que el
        experimento se haya archivado.
      </p>
      <div class="hero-actions" style="justify-content: center">
        <a class="btn" routerLink="/">Ir al inicio</a>
        <a class="btn btn-ghost" routerLink="/blog">Ver el índice</a>
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
