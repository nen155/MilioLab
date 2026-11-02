import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { absoluteUrl, formatDate } from '../../core/format';
import { I18nService } from '../../core/i18n';
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
      <p class="kicker">{{ i18n.t('text.kicker') }}</p>
      <h1>{{ i18n.t('text.title') }}</h1>
      <p class="lede">
        {{ i18n.t('text.lede') }} <a href="/llms.txt">/llms.txt</a>.
      </p>
    </header>

    <pre class="mono" style="white-space: pre-wrap; line-height: 1.8"># {{ site.siteName() }}

> {{ site.tagline() }}

## {{ i18n.t('text.pages') }}
@for (item of site.menu(); track item.id) {
- [{{ i18n.content(item.label, item.label_en) }}]({{ item.url }})
}

## {{ i18n.t('text.posts') }}
@for (post of posts(); track post.id) {
- [{{ title(post) }}](/blog/{{ post.slug }}) — {{ date(post.published_at) }} · {{ minutes(post) }} {{ i18n.t('common.min') }}
}

## {{ i18n.t('text.machine') }}
- [Sitemap](/sitemap.xml)
- [RSS](/feed.xml)
- [llms.txt](/llms.txt)
</pre>

    <p class="mono muted" style="margin-top: 2rem">
      <a routerLink="/">{{ i18n.t('text.back') }}</a>
    </p>
  `,
})
export class TextIndexComponent implements OnInit {
  protected readonly site = inject(SiteService);
  protected readonly i18n = inject(I18nService);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  protected readonly posts = signal<PostSummary[]>([]);

  constructor() {
    effect(() => {
      this.seo.set({
        title: `${this.i18n.t('text.seoTitle')} · ${this.site.siteName()}`,
        description: this.i18n.t('text.seoDescription'),
        url: absoluteUrl('/texto'),
      });
    });
  }

  ngOnInit(): void {
    this.site.load().subscribe();
    this.api.getPosts({ per_page: 50 }).subscribe((response) => this.posts.set(response.data));
  }

  protected title(post: PostSummary): string {
    return this.i18n.content(post.title, post.title_en);
  }

  protected minutes(post: PostSummary): number {
    return this.i18n.locale() === 'en'
      ? post.reading_minutes_en ?? post.reading_minutes
      : post.reading_minutes;
  }

  protected date(value?: string | null): string {
    return formatDate(value, this.i18n.locale());
  }
}
