import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { absoluteUrl, formatDate, plainText } from '../../core/format';
import { I18nService } from '../../core/i18n';
import { Post } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { SiteService } from '../../core/site.service';
import { ContentPipe } from '../../shared/content.pipe';

@Component({
  selector: 'app-post-detail',
  imports: [RouterLink, ContentPipe],
  template: `
    @if (loading()) {
      <div class="article"><div class="skeleton" style="height: 320px"></div></div>
    } @else if (post(); as current) {
      <article class="article">
        <header class="article-head">
          <p class="kicker">
            {{ i18n.t('post.kicker', { id: id() }) }} · {{ categoryName() }}
          </p>
          <h1>{{ title() }}</h1>

          @if (excerpt()) {
            <p class="lede">{{ excerpt() }}</p>
          }

          <p class="article-meta">
            <time [attr.datetime]="current.published_at">{{ date(current.published_at) }}</time>
            <span aria-hidden="true">·</span>
            <span>{{ minutes() }} {{ i18n.t('common.min') }}</span>
            @if (showAuthor() && current.author; as author) {
              <span aria-hidden="true">·</span>
              <span>{{ author.name }}</span>
            }
          </p>
        </header>

        @if (current.cover?.url) {
          <figure class="article-cover">
            <img [src]="current.cover!.url" [alt]="current.cover!.alt || title()" />
          </figure>
        }

        <div class="prose" [innerHTML]="body() | content"></div>

        @if (current.tags?.length) {
          <div class="tags" style="margin-top: 2rem">
            @for (tag of current.tags; track tag.id) {
              <a class="chip" [routerLink]="['/blog/etiqueta', tag.slug]">#{{ i18n.content(tag.name, tag.name_en) }}</a>
            }
          </div>
        }

        <footer class="article-foot">
          <a class="link-arrow" routerLink="/blog">{{ i18n.t('post.back') }}</a>
          <span class="mono muted">{{ i18n.t('post.end', { id: id() }) }}</span>
        </footer>
      </article>
    } @else {
      <section class="empty">
        <p class="kicker">{{ i18n.t('post.notFoundKicker') }}</p>
        <h1>{{ i18n.t('post.notFound') }}</h1>
        <p class="mono muted">{{ i18n.t('post.notFoundText') }}</p>
        <a class="btn" routerLink="/blog">{{ i18n.t('post.toIndex') }}</a>
      </section>
    }
  `,
})
export class PostDetailComponent {
  readonly slug = input.required<string>();

  private readonly api = inject(ApiService);
  private readonly site = inject(SiteService);
  private readonly seo = inject(SeoService);
  protected readonly i18n = inject(I18nService);

  protected readonly post = signal<Post | null>(null);
  protected readonly loading = signal(true);

  protected readonly title = computed(() => this.i18n.content(this.post()?.title, this.post()?.title_en));
  protected readonly excerpt = computed(() => this.i18n.content(this.post()?.excerpt, this.post()?.excerpt_en));
  protected readonly body = computed(() => this.i18n.content(this.post()?.body, this.post()?.body_en));
  protected readonly categoryName = computed(() => {
    const category = this.post()?.category;

    return category
      ? this.i18n.content(category.name, category.name_en)
      : this.i18n.t('post.uncategorized');
  });
  protected readonly minutes = computed(() => {
    const post = this.post();

    if (!post) {
      return 0;
    }

    return this.i18n.locale() === 'en'
      ? post.reading_minutes_en ?? post.reading_minutes
      : post.reading_minutes;
  });

  constructor() {
    effect(() => {
      const slug = this.slug();
      this.loading.set(true);

      this.api.getPost(slug).subscribe({
        next: (post) => {
          this.post.set(post);
          this.loading.set(false);
        },
        error: () => {
          this.post.set(null);
          this.loading.set(false);
        },
      });
    });

    effect(() => {
      const post = this.post();
      const siteName = this.site.siteName();
      const url = absoluteUrl(`/blog/${post?.slug ?? this.slug()}`);

      if (!post) {
        if (!this.loading()) {
          this.seo.set({ title: `${this.i18n.t('post.notFound')} · ${siteName}`, url });
        }

        return;
      }

      const title = this.i18n.content(post.title, post.title_en);
      const description =
        this.i18n.content(post.meta_description, post.meta_description_en) ||
        this.i18n.content(post.excerpt, post.excerpt_en) ||
        plainText(this.i18n.content(post.body, post.body_en));

      this.seo.set({
        title: `${this.i18n.content(post.meta_title, post.meta_title_en) || title} · ${siteName}`,
        description,
        image: post.cover?.url ? absoluteUrl(post.cover.url) : null,
        type: 'article',
        url,
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description,
          datePublished: post.published_at,
          dateModified: post.updated_at ?? post.published_at,
          image: post.cover?.url ? absoluteUrl(post.cover.url) : undefined,
          author: post.author ? { '@type': 'Person', name: post.author.name } : undefined,
          mainEntityOfPage: url,
        },
      });
    });
  }

  protected readonly id = () => String(this.post()?.id ?? 0).padStart(3, '0');

  protected date(value?: string | null): string {
    return formatDate(value, this.i18n.locale());
  }

  protected showAuthor(): boolean {
    return this.site.setting<boolean>('show_author', true) !== false;
  }
}
