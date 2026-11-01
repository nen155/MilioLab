import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { absoluteUrl, formatDate } from '../../core/format';
import { PostSummary } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { SiteService } from '../../core/site.service';

/**
 * Versión texto del sitio: un índice en Markdown pensado para lectores que no
 * ejecutan JavaScript (robots, IA, lectores de pantalla antiguos, curl).
 */
@Component({
  selector: 'app-text-index',
  imports: [RouterLink],
  template: `
    <header class="article-head" style="margin-top: 2rem">
      <p class="kicker">versión texto</p>
      <h1>Índice legible por máquinas</h1>
      <p class="lede">
        Todo el contenido del sitio en un solo listado, sin animaciones ni scripts.
        También disponible en <a href="/llms.txt">/llms.txt</a>.
      </p>
    </header>

    <pre class="mono" style="white-space: pre-wrap; line-height: 1.8"># {{ site.siteName() }}

> {{ site.tagline() }}

## Páginas
@for (item of site.menu(); track item.id) {
- [{{ item.label }}]({{ item.url }})
}

## Entradas
@for (post of posts(); track post.id) {
- [{{ post.title }}](/blog/{{ post.slug }}) — {{ date(post.published_at) }} · {{ post.reading_minutes }} min
}

## Máquina
- [Sitemap](/sitemap.xml)
- [RSS](/feed.xml)
- [llms.txt](/llms.txt)
</pre>

    <p class="mono muted" style="margin-top: 2rem">
      <a routerLink="/">← volver a la versión con diseño</a>
    </p>
  `,
})
export class TextIndexComponent implements OnInit {
  protected readonly site = inject(SiteService);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  protected readonly posts = signal<PostSummary[]>([]);

  ngOnInit(): void {
    this.site.load().subscribe((site) => {
      this.seo.set({
        title: `Versión texto · ${site.settings['site_name']}`,
        description: 'Índice completo del sitio en texto plano.',
        url: absoluteUrl('/texto'),
      });
    });

    this.api.getPosts({ per_page: 50 }).subscribe((response) => this.posts.set(response.data));
  }

  protected date(value?: string | null): string {
    return formatDate(value);
  }
}
