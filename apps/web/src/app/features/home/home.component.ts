import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { absoluteUrl, plainText } from '../../core/format';
import { Page } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { SiteService } from '../../core/site.service';
import { PostCardComponent } from '../../shared/post-card.component';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';

@Component({
  selector: 'app-home',
  imports: [RouterLink, PostCardComponent, SafeHtmlPipe],
  template: `
    <section class="hero container">
      <p class="eyebrow">Bienvenido</p>
      <h1 class="hero-title">{{ site.siteName() }}</h1>
      <p class="hero-tagline">{{ site.tagline() }}</p>
      <div class="hero-actions">
        <a class="button" routerLink="/blog">Leer el blog</a>
        @if (site.homeSlug()) {
          <a class="button button-ghost" [routerLink]="'/' + site.homeSlug()">Conocer el proyecto</a>
        }
      </div>
    </section>

    @if (homePage(); as page) {
      @if (page.body) {
        <section class="container section prose" [innerHTML]="page.body | safeHtml"></section>
      }
    }

    @if (site.latestPosts().length) {
      <section class="container section">
        <div class="section-head">
          <h2>Últimas entradas</h2>
          <a class="link-arrow" routerLink="/blog">Ver todas →</a>
        </div>

        <div class="post-grid">
          @for (post of site.latestPosts(); track post.id) {
            <app-post-card [post]="post" />
          }
        </div>
      </section>
    }
  `,
})
export class HomeComponent implements OnInit {
  protected readonly site = inject(SiteService);
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
