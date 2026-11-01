import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { I18nService } from '../core/i18n';
import { SiteService } from '../core/site.service';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  template: `
    <header class="lab-header">
      <a class="brand" routerLink="/" aria-label="MilioLab, inicio">
        <svg class="brand-logo" viewBox="2 26 88 49" aria-hidden="true" focusable="false"><g fill="currentColor"><rect x="6" y="30" width="24" height="7" rx="3.5"/><rect x="6" y="47" width="16" height="7" rx="3.5"/><rect x="6" y="64" width="24" height="7" rx="3.5"/></g><path d="M64.9 34.7 A17 17 0 1 0 64.9 66.3" fill="none" stroke="#a855f7" stroke-width="7" stroke-linecap="butt"/><path d="M85.9 30 V49.5 a18 18 0 0 1 -18 18 H10" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
        {{ i18n.t('nav.index') }}
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
        <label class="mono muted" for="q">{{ i18n.t('nav.search') }}</label>
        <input
          id="q"
          type="search"
          name="q"
          [placeholder]="i18n.t('nav.searchPlaceholder')"
          [value]="query()"
          (input)="query.set($any($event.target).value)"
        />
      </form>
    </header>
  `,
})
export class SiteHeaderComponent {
  protected readonly site = inject(SiteService);
  protected readonly i18n = inject(I18nService);
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
