import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteService } from './core/site.service';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteHeaderComponent } from './shared/site-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  template: `
    <app-site-header />
    <main id="main" class="site-main">
      <router-outlet />
    </main>
    <app-site-footer />
  `,
})
export class App {
  private readonly site = inject(SiteService);

  constructor() {
    this.site.load().subscribe();

    // El color de acento se configura desde el panel (Ajustes → Apariencia).
    effect(() => {
      const accent = this.site.setting('accent_color', '');

      if (accent) {
        document.documentElement.style.setProperty('--accent', accent);
      }
    });
  }
}
