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
    <header class="article-head" style="margin-top: 2rem">
      <p class="kicker">índice de muestras</p>
      <h1>{{ heading() }}</h1>
      @if (intro()) {
        <p class="lede">{{ intro() }}</p>
      }
      <p class="mono muted" style="margin-top: .6rem">
        {{ total() }} {{ total() === 1 ? 'registro' : 'registros' }} · página {{ page() }} de {{ lastPage() }}
      </p>
    </header>

    @if (categories().length) {
      <nav class="chips" aria-label="Categorías">
        <a class="chip" routerLink="/blog" [class.chip-active]="!activeCategory()">todas</a>
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
        <nav class="article-foot" aria-label="Paginación">
          <button class="btn btn-ghost" type="button" [disabled]="page() <= 1" (click)="goToPage(page() - 1)">
            ← anterior
          </button>
          <span class="mono muted">página {{ page() }} / {{ lastPage() }}</span>
          <button
            class="btn btn-ghost"
            type="button"
            [disabled]="page() >= lastPage()"
            (click)="goToPage(page() + 1)"
          >
            siguiente →
          </button>
        </nav>
      }
    } @else {
      <div class="empty">
        <h2>Sin muestras</h2>
        <p class="mono muted">No hay registros con ese filtro.</p>
        <a class="btn" routerLink="/blog">Ver todas</a>
      </div>
    }
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
  protected readonly page = signal(1);
  protected readonly lastPage = signal(1);
  protected readonly total = signal(0);

  ngOnInit(): void {
    this.api.getCategories().subscribe((categories) => this.categories.set(categories));

    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(([params, query]) => {
      const category = params.get('category') ?? undefined;
      const tag = params.get('tag') ?? undefined;
      const page = Number(query.get('page') ?? '1') || 1;
      const q = (query.get('q') ?? '').trim();

      this.activeCategory.set(category ?? null);
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
          this.updateSeo(options);
        },
        error: () => {
          this.posts.set([]);
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
