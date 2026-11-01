import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { absoluteUrl, formatDate, plainText } from '../../core/format';
import { Post } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { SiteService } from '../../core/site.service';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';

@Component({
  selector: 'app-post-detail',
  imports: [RouterLink, SafeHtmlPipe],
  template: `
    @if (loading()) {
      <div class="container section">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line"></div>
      </div>
    } @else if (post(); as current) {
      <article class="container section post-detail">
        <header class="post-header">
          @if (current.category; as category) {
            <a class="chip" [routerLink]="['/blog/categoria', category.slug]">{{ category.name }}</a>
          }

          <h1>{{ current.title }}</h1>

          @if (current.excerpt) {
            <p class="lede">{{ current.excerpt }}</p>
          }

          <p class="post-meta">
            <time [attr.datetime]="current.published_at">{{ date(current.published_at) }}</time>
            <span aria-hidden="true">·</span>
            <span>{{ current.reading_minutes }} min de lectura</span>
            @if (showAuthor() && current.author; as author) {
              <span aria-hidden="true">·</span>
              <span>{{ author.name }}</span>
            }
          </p>
        </header>

        @if (current.cover?.url) {
          <figure class="post-cover">
            <img [src]="current.cover!.url" [alt]="current.cover!.alt || current.title" />
          </figure>
        }

        <div class="prose" [innerHTML]="current.body | safeHtml"></div>

        @if (current.tags?.length) {
          <footer class="post-tags">
            @for (tag of current.tags; track tag.id) {
              <a class="chip" [routerLink]="['/blog/etiqueta', tag.slug]">#{{ tag.name }}</a>
            }
          </footer>
        }

        <nav class="post-nav">
          <a class="link-arrow" routerLink="/blog">← Volver al blog</a>
        </nav>
      </article>
    } @else {
      <section class="container section empty-state">
        <h1>Entrada no encontrada</h1>
        <p class="muted">Puede que el enlace esté mal escrito o que la entrada ya no esté publicada.</p>
        <a class="button" routerLink="/blog">Ir al blog</a>
      </section>
    }
  `,
})
export class PostDetailComponent {
  readonly slug = input.required<string>();

  private readonly api = inject(ApiService);
  private readonly site = inject(SiteService);
  private readonly seo = inject(SeoService);

  protected readonly post = signal<Post | null>(null);
  protected readonly loading = signal(true);

  constructor() {
    effect(() => {
      const slug = this.slug();
      this.loading.set(true);

      this.api.getPost(slug).subscribe({
        next: (post) => {
          this.post.set(post);
          this.loading.set(false);

          const url = absoluteUrl(`/blog/${post.slug}`);
          const description = post.meta_description || post.excerpt || plainText(post.body);

          this.seo.set({
            title: `${post.meta_title || post.title} · ${this.site.siteName()}`,
            description,
            image: post.cover?.url ? absoluteUrl(post.cover.url) : null,
            type: 'article',
            url,
            publishedTime: post.published_at,
            modifiedTime: post.updated_at,
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description,
              datePublished: post.published_at,
              dateModified: post.updated_at ?? post.published_at,
              image: post.cover?.url ? absoluteUrl(post.cover.url) : undefined,
              author: post.author ? { '@type': 'Person', name: post.author.name } : undefined,
              mainEntityOfPage: url,
            },
          });
        },
        error: () => {
          this.post.set(null);
          this.loading.set(false);
          this.seo.set({
            title: `Entrada no encontrada · ${this.site.siteName()}`,
            url: absoluteUrl(`/blog/${slug}`),
          });
        },
      });
    });
  }

  protected date(value?: string | null): string {
    return formatDate(value);
  }

  protected showAuthor(): boolean {
    return this.site.setting<boolean>('show_author', true) !== false;
  }
}
