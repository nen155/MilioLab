import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { absoluteUrl, plainText } from '../../core/format';
import { Page } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { I18nService } from '../../core/i18n';
import { SiteService } from '../../core/site.service';
import { ContentPipe } from '../../shared/content.pipe';
import { PostCardComponent } from '../../shared/post-card.component';
import { NodeMapComponent } from './node-map.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, PostCardComponent, ContentPipe, NodeMapComponent],
  template: `
    <section class="hero">
      <div>
        <p class="kicker">{{ i18n.t('home.kicker') }} · {{ year }}</p>
        <h1 class="display">
          {{ site.siteName() }}<br />
          <em>{{ site.tagline() }}</em>
        </h1>
        <p class="lede">{{ i18n.t('home.lede') }}</p>

        <div class="hero-actions">
          <a class="btn" routerLink="/blog">{{ i18n.t('home.cta') }}</a>
          <a class="btn btn-ghost" routerLink="/texto">{{ i18n.t('home.text') }}</a>
        </div>
      </div>

      <aside class="hero-aside" [attr.aria-label]="i18n.t('home.asideAria')">
        <p>
          <span class="egg" tabindex="0">
            {{ i18n.t('home.method') }}
            <span class="egg-note">{{ i18n.t('home.methodNote') }}</span>
          </span>
          — {{ i18n.t('home.observation') }}
        </p>
        <p>
          <span class="egg" tabindex="0">
            {{ i18n.t('home.samples') }}
            <span class="egg-note">{{ i18n.t('home.samplesNote') }}</span>
          </span>
          — {{ i18n.t('home.recentCount', { count: site.latestPosts().length }) }}
        </p>
        <p>
          <span class="egg" tabindex="0">
            {{ i18n.t('home.residue') }}
            <span class="egg-note">{{ i18n.t('home.residueNote') }}</span>
          </span>
          — {{ i18n.t('home.none') }}
        </p>
      </aside>
    </section>

    @if (homePage(); as page) {
      @if (page.body) {
        <section class="prose" style="margin-top: 2.5rem" [innerHTML]="i18n.content(page.body, page.body_en) | content"></section>
      }
    }

    @if (site.latestPosts().length) {
      <div class="section-head">
        <h2>{{ i18n.t('home.nodes') }}</h2>
        <span class="mono muted">{{ i18n.t('home.nodesHint') }}</span>
      </div>

      <app-node-map [posts]="site.latestPosts()" />
    }

    <div class="section-head">
      <h2>{{ i18n.t('home.latest') }}</h2>
      <a class="link-arrow" routerLink="/blog">{{ i18n.t('home.all') }}</a>
    </div>

    @if (site.latestPosts().length) {
      <div class="samples">
        @for (post of site.latestPosts(); track post.id) {
          <app-post-card [post]="post" />
        }
      </div>
    } @else {
      <p class="empty mono muted">{{ i18n.t('home.noSamples') }}</p>
    }

    <section style="margin-top: 3rem">
      <details>
        <summary class="mono" style="cursor:pointer">{{ i18n.t('home.observations') }}</summary>
        <ul class="mono muted" style="margin-top: .8rem; padding-left: 1.1rem; line-height: 2">
          <li>{{ i18n.t('home.obs1') }}</li>
          <li>
            <span class="egg" tabindex="0">
              {{ i18n.t('home.obs2a') }}
              <span class="egg-note">{{ i18n.t('home.obs2Note') }}</span>
            </span>
            {{ i18n.t('home.obs2b') }}
          </li>
          <li>{{ i18n.t('home.obs3') }} <a routerLink="/texto">/texto</a>.</li>
        </ul>
      </details>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  protected readonly site = inject(SiteService);
  protected readonly i18n = inject(I18nService);
  protected readonly year = new Date().getFullYear();

  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  protected readonly homePage = signal<Page | null>(null);

  constructor() {
    effect(() => {
      if (!this.site.site()) {
        return;
      }

      const name = this.site.siteName();
      const tagline = this.site.tagline();
      const page = this.homePage();
      const description =
        this.site.settingLocalized('site_description', tagline) ||
        (page ? plainText(this.i18n.content(page.body, page.body_en)) : '');

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
    });
  }

  ngOnInit(): void {
    this.site.load().subscribe((site) => {
      if (site.home) {
        this.api.getPage(site.home).subscribe({
          next: (page) => this.homePage.set(page),
          error: () => this.homePage.set(null),
        });
      }
    });
  }
}
