import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';

import { ApiService } from '../../core/api.service';
import { absoluteUrl } from '../../core/format';
import { Category, PaginationMeta, PostSummary } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { SiteService } from '../../core/site.service';
import { PostCardComponent } from '../../shared/post-card.component';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink, PostCardComponent],
  template: `
    <section class="container section">
      <header class="blog-header">
        <p class="eyebrow">Blog</p>
        <h1>{{ heading() }}</h1>
        @if (intro()) {
          <p class="lede">{{ intro() }}</p>
        }
      </header>

      @if (categories().length) {
        <nav class="chips" aria-label="Categorías">
          <a class="chip" routerLink="/blog" [class.chip-active]="!activeCategory()">Todas</a>
          @for (category of categories(); track category.id) {
            <a
              class="chip"
              [routerLink]="['/blog/categoria', category.slug]"
              [class.chip-active]="activeCategory() === category.slug"
            >
              {{ category.name }}
            </a>
          }
        </nav>
      }

      @if (loading()) {
        <div class="post-grid">
          @for (item of [1, 2, 3]; track item) {
            <div class="skeleton skeleton-card"></div>
          }
        </div>
      } @else if (posts().length) {
        <div class="post-grid">
          @for (post of posts(); track post.id) {
            <app-post-card [post]="post" />
          }
        </div>

        @if (meta(); as pagination) {
          @if (pagination.last_page > 1) {
            <nav class="pagination" aria-label="Paginación">
              <button
                type="button"
                class="button button-ghost"
                [disabled]="pagination.current_page <= 1"
                (click)="goToPage(pagination.current_page - 1)"
              >
                ← Anterior
              </button>
              <span class="muted">Página {{ pagination.current_page }} de {{ pagination.last_page }}</span>
              <button
                type="button"
                class="button button-ghost"
                [disabled]="pagination.current_page >= pagination.last_page"
                (click)="goToPage(pagination.current_page + 1)"
              >
                Siguiente →
              </button>
            </nav>
          }
        }
      } @else {
        <div class="empty-state">
          <h2>No hay entradas todavía</h2>
          <p class="muted">Cuando publique algo aparecerá aquí.</p>
          <a class="button" routerLink="/">Volver al inicio</a>
        </div>
      }
    </section>
  `,
})
export class BlogListComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly site = inject(SiteService);
  private readonly seo = inject(SeoService);

  protected readonly posts = signal<PostSummary[]>([]);
  protected readonly meta = signal<PaginationMeta | null>(null);
  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(true);
  protected readonly heading = signal<string>('Blog');
  protected readonly intro = computed(() => this.site.setting<string>('blog_intro', ''));
  protected readonly activeCategory = signal<string | null>(null);

  private currentQuery = '';

  ngOnInit(): void {
    this.api.getCategories().subscribe((categories) => this.categories.set(categories));

    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      ([params, query]) => {
        const category = params.get('category') ?? undefined;
        const tag = params.get('tag') ?? undefined;
        const page = Number(query.get('page') ?? '1') || 1;
        const q = (query.get('q') ?? '').trim();

        this.currentQuery = q;
        this.activeCategory.set(category ?? null);
        this.load({ page, q, category, tag });
      },
    );
  }

  private load(options: {
    page: number;
    q: string;
    category?: string;
    tag?: string;
  }): void {
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
          this.loading.set(false);
          this.updateSeo(options);
        },
        error: () => {
          this.posts.set([]);
          this.meta.set(null);
          this.loading.set(false);
        },
      });
  }

  private updateSeo(options: { q: string; category?: string; tag?: string }): void {
    const base = this.site.setting<string>('blog_title', 'Blog');
    const category = this.categories().find((item) => item.slug === options.category);

    let title = `${base} · ${this.site.siteName()}`;
    let heading = base;

    if (category) {
      title = `${category.name} · ${base}`;
      heading = category.name;
    } else if (options.tag) {
      title = `#${options.tag} · ${base}`;
      heading = `#${options.tag}`;
    } else if (options.q) {
      title = `«${options.q}» · ${base}`;
      heading = `Resultados para «${options.q}»`;
    }

    this.heading.set(heading);
    this.seo.set({
      title,
      description: this.site.setting<string>('blog_intro', ''),
      url: absoluteUrl(this.router.url),
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
