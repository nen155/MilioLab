import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { absoluteUrl, plainText } from '../../core/format';
import { Page } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { SiteService } from '../../core/site.service';
import { ContentPipe } from '../../shared/content.pipe';
import { PostCardComponent } from '../../shared/post-card.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, PostCardComponent, ContentPipe],
  template: `
    <section class="hero">
      <div>
        <p class="kicker">cuaderno de laboratorio · {{ year }}</p>
        <h1 class="display">
          {{ site.siteName() }}<br />
          <em>{{ site.tagline() }}</em>
        </h1>
        <p class="lede">
          Desarrollo web, producto y experimentos que aún no tienen nombre. Escribo lo que
          pruebo y publico lo que funciona.
        </p>

        <div class="hero-actions">
          <a class="btn" routerLink="/blog">Abrir el cuaderno</a>
          <a class="btn btn-ghost" routerLink="/texto">Versión texto</a>
        </div>
      </div>

      <aside class="hero-aside" aria-label="Notas de la libreta">
        <p>
          <span class="egg" tabindex="0">
            método
            <span class="egg-note">Escribir, medir, corregir. Sin plantillas.</span>
          </span>
          — observación directa
        </p>
        <p>
          <span class="egg" tabindex="0">
            muestras
            <span class="egg-note">Cada entrada es un experimento con fecha y número.</span>
          </span>
          — {{ site.latestPosts().length }} recientes
        </p>
        <p>
          <span class="egg" tabindex="0">
            residuo
            <span class="egg-note">Sin cookies, sin analítica, sin rastreadores.</span>
          </span>
          — ninguno
        </p>
      </aside>
    </section>

    @if (homePage(); as page) {
      @if (page.body) {
        <section class="prose" style="margin-top: 2.5rem" [innerHTML]="page.body | content"></section>
      }
    }

    <div class="section-head">
      <h2>Últimas muestras</h2>
      <a class="link-arrow" routerLink="/blog">todas →</a>
    </div>

    @if (site.latestPosts().length) {
      <div class="samples">
        @for (post of site.latestPosts(); track post.id) {
          <app-post-card [post]="post" />
        }
      </div>
    } @else {
      <p class="empty mono muted">Todavía no hay muestras registradas.</p>
    }

    <section style="margin-top: 3rem">
      <details>
        <summary class="mono" style="cursor:pointer">Registro de observaciones</summary>
        <ul class="mono muted" style="margin-top: .8rem; padding-left: 1.1rem; line-height: 2">
          <li>El diseño no necesita sombras para tener profundidad.</li>
          <li>
            <span class="egg" tabindex="0">
              hay una sala de experimentos
              <span class="egg-note">Shift + L, o «experimentos» en el pie.</span>
            </span>
            escondida en esta página.
          </li>
          <li>Todo lo que lees se puede leer sin JavaScript en <a routerLink="/texto">/texto</a>.</li>
        </ul>
      </details>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  protected readonly site = inject(SiteService);
  protected readonly year = new Date().getFullYear();

  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  protected readonly homePage = signal<Page | null>(null);

  ngOnInit(): void {
    this.site.load().subscribe((site) => {
      const name = String(site.settings['site_name'] ?? 'MilioLab');
      const tagline = String(site.settings['site_tagline'] ?? '');
      const description = String(site.settings['site_description'] ?? tagline);

      this.seo.set({
        title: tagline ? `${name} — ${tagline}` : name,
        description,
        url: absoluteUrl('/'),
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name,
          description,
          url: absoluteUrl('/'),
        },
      });

      if (site.home) {
        this.api.getPage(site.home).subscribe({
          next: (page) => {
            this.homePage.set(page);

            if (!description && page.body) {
              this.seo.set({
                title: `${name} — ${page.title}`,
                description: plainText(page.body),
                url: absoluteUrl('/'),
              });
            }
          },
          error: () => this.homePage.set(null),
        });
      }
    });
  }
}
