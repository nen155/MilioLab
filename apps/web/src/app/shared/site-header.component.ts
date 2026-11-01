import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { SiteService } from '../core/site.service';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  template: `
    <header class="lab-header">
      <a class="brand" routerLink="/" aria-label="MilioLab, inicio">
        <span class="brand-mark" aria-hidden="true">M</span>
        <span>{{ site.siteName() }}</span>
      </a>
      <span class="brand-badge">LAB-01</span>

      <button
        class="nav-toggle"
        type="button"
        [attr.aria-expanded]="open()"
        aria-controls="nav-principal"
        (click)="open.set(!open())"
      >
        índice
      </button>

      <nav class="nav" id="nav-principal" [class.nav-open]="open()" aria-label="Principal">
        @for (item of site.menu(); track item.id) {
          @if (isExternal(item.url)) {
            <a [href]="item.url" [attr.target]="item.target" rel="noopener">{{ item.label }}</a>
          } @else {
            <a [routerLink]="item.url" (click)="open.set(false)">{{ item.label }}</a>
          }
        }
      </nav>

      <form class="search" role="search" (submit)="search($event)">
        <label class="mono muted" for="q">buscar</label>
        <input
          id="q"
          type="search"
          name="q"
          placeholder="término…"
          [value]="query()"
          (input)="query.set($any($event.target).value)"
        />
      </form>
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
