import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { SiteService } from '../core/site.service';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  template: `
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" routerLink="/" aria-label="Inicio">
          <span class="brand-mark">M</span>
          <span class="brand-name">{{ site.siteName() }}</span>
        </a>

        <button
          class="nav-toggle"
          type="button"
          [attr.aria-expanded]="open()"
          aria-label="Abrir menú"
          (click)="open.set(!open())"
        >
          <span></span><span></span><span></span>
        </button>

        <nav class="nav" [class.nav-open]="open()" aria-label="Principal">
          @for (item of site.menu(); track item.id) {
            @if (isExternal(item.url)) {
              <a [href]="item.url" [attr.target]="item.target" rel="noopener">{{ item.label }}</a>
            } @else {
              <a [routerLink]="item.url" (click)="open.set(false)">{{ item.label }}</a>
            }
          }
        </nav>

        <form class="search" role="search" (submit)="search($event)">
          <input
            type="search"
            name="q"
            placeholder="Buscar…"
            aria-label="Buscar en el blog"
            [value]="query()"
            (input)="query.set($any($event.target).value)"
          />
        </form>
      </div>
    </header>
  `,
})
export class SiteHeaderComponent {
  protected readonly site = inject(SiteService);
  private readonly router = inject(Router);

  protected readonly open = signal(false);
  protected readonly query = signal('');

  protected isExternal(url: string): boolean {
    return /^https?:\/\//i.test(url);
  }

  protected search(event: Event): void {
    event.preventDefault();
    const term = this.query().trim();

    this.open.set(false);
    this.router.navigate(['/blog'], { queryParams: term ? { q: term } : {} });
  }
}
