import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';

import { ApiService } from '../../core/api.service';
import { absoluteUrl } from '../../core/format';
import { Category, PaginationMeta, PostSummary } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { I18nService } from '../../core/i18n';
import { SiteService } from '../../core/site.service';
import { PostCardComponent } from '../../shared/post-card.component';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink, PostCardComponent],
  template: `
    <header class="article-head" style="margin-top: 2rem">
      <p class="kicker">{{ i18n.t('blog.index') }}</p>
      <h1>{{ heading() }}</h1>
      @if (intro()) {
        <p class="lede">{{ intro() }}</p>
      }
      <p class="mono muted" style="margin-top: .6rem">
        {{ total() }} {{ total() === 1 ? i18n.t('blog.record') : i18n.t('blog.records') }} ·
        {{ i18n.t('blog.pageOf', { page: page(), last: lastPage() }) }}
      </p>
    </header>

    @if (categories().length) {
      <nav class="chips" [attr.aria-label]="i18n.t('blog.categoriesAria')">
        <a class="chip" routerLink="/blog" [class.chip-active]="!activeCategory()">{{ i18n.t('blog.all') }}</a>
        @for (category of categories(); track category.id) {
          <a
            class="chip"
            [routerLink]="['/blog/categoria', category.slug]"
            [class.chip-active]="activeCategory() === category.slug"
          >
            {{ i18n.content(category.name, category.name_en) }}
          </a>
        }
      </nav>
    }

    @if (loading()) {
      <div class="samples">
        @for (item of [1, 2, 3]; track item) {
          <div class="skeleton"></div>
        }
      </div>
    } @else if (posts().length) {
      <div class="samples">
        @for (post of posts(); track post.id) {
          <app-post-card [post]="post" />
        }
      </div>

      @if (lastPage() > 1) {
        <nav class="article-foot" [attr.aria-label]="i18n.t('blog.paginationAria')">
          <button class="btn btn-ghost" type="button" [disabled]="page() <= 1" (click)="goToPage(page() - 1)">
            {{ i18n.t('blog.prev') }}
          </button>
          <span class="mono muted">{{ i18n.t('blog.pageSlash', { page: page(), last: lastPage() }) }}</span>
          <button
            class="btn btn-ghost"
            type="button"
            [disabled]="page() >= lastPage()"
            (click)="goToPage(page() + 1)"
          >
            {{ i18n.t('blog.next') }}
          </button>
        </nav>
      }
    } @else {
      <div class="empty">
        <h2>{{ i18n.t('blog.empty') }}</h2>
        <p class="mono muted">{{ i18n.t('blog.noResults') }}</p>
        <a class="btn" routerLink="/blog">{{ i18n.t('blog.seeAll') }}</a>
      </div>
    }
  `,
})
export class BlogListComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly site = inject(SiteService);
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);

  protected readonly posts = signal<PostSummary[]>([]);
  protected readonly meta = signal<PaginationMeta | null>(null);
  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(true);
  protected readonly intro = computed(() => this.site.settingLocalized('blog_intro'));
  protected readonly activeCategory = signal<string | null>(null);
  protected readonly activeTag = signal<string | null>(null);
  protected readonly activeQuery = signal('');
  protected readonly page = signal(1);
  protected readonly lastPage = signal(1);
  protected readonly total = signal(0);

  protected readonly heading = computed(() => {
    const category = this.categories().find((item) => item.slug === this.activeCategory());

    if (category) {
      return this.i18n.content(category.name, category.name_en);
    }

    const tag = this.activeTag();

    if (tag) {
      return `#${tag}`;
    }

    const query = this.activeQuery();

    return query
      ? this.i18n.t('blog.resultsFor', { term: query })
      : this.site.settingLocalized('blog_title', 'Blog');
  });

  constructor() {
    effect(() => {
      this.seo.set({
        title: `${this.heading()} · ${this.site.siteName()}`,
        description: this.site.settingLocalized('blog_intro'),
        url: absoluteUrl(this.router.url),
      });
    });
  }

  ngOnInit(): void {
    this.api.getCategories().subscribe((categories) => this.categories.set(categories));

    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(([params, query]) => {
      const category = params.get('category') ?? undefined;
      const tag = params.get('tag') ?? undefined;
      const page = Number(query.get('page') ?? '1') || 1;
      const q = (query.get('q') ?? '').trim();

      this.activeCategory.set(category ?? null);
      this.activeTag.set(tag ?? null);
      this.activeQuery.set(q);
      this.load({ page, q, category, tag });
    });
  }

  private load(options: { page: number; q: string; category?: string; tag?: string }): void {
    this.loading.set(true);

    this.api
      .getPosts({
        page: options.page,
        per_page: this.site.setting<number>('posts_per_page', 9),
        category: options.category,
        tag: options.tag,
        q: options.q || undefined,
      })
      .subscribe({
        next: (response) => {
          this.posts.set(response.data);
          this.meta.set(response.meta);
          this.page.set(response.meta.current_page);
          this.lastPage.set(response.meta.last_page);
          this.total.set(response.meta.total);
          this.loading.set(false);
        },
        error: () => {
          this.posts.set([]);
          this.loading.set(false);
        },
      });
  }

  protected goToPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}
