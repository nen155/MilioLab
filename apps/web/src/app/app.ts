import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { I18nService } from './core/i18n';
import { LabService } from './core/lab.service';
import { SiteService } from './core/site.service';
import { ThemeService } from './core/theme.service';
import { LabPanelComponent } from './features/lab/lab-panel.component';
import { DesktopChromeComponent } from './shared/desktop-chrome.component';
import { SceneryComponent } from './shared/scenery.component';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteHeaderComponent } from './shared/site-header.component';
import { SiteRailComponent } from './shared/site-rail.component';
import { ThemePickerComponent } from './shared/theme-picker.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SiteHeaderComponent,
    SiteFooterComponent,
    LabPanelComponent,
    SceneryComponent,
    SiteRailComponent,
    DesktopChromeComponent,
    ThemePickerComponent,
  ],
  template: `
    <a class="skip-link" href="#contenido">{{ i18n.t('common.skip') }}</a>
    <app-scenery />

    <div class="shell">
      <div class="lab">
        <app-site-rail />

        <div class="main">
          <app-site-header />

          <div class="screen-frame">
            <app-desktop-chrome />

            <main id="contenido" tabindex="-1">
              <router-outlet />
            </main>
          </div>

          <app-site-footer />
        </div>
      </div>
    </div>

    @if (lab.open()) {
      <app-lab-panel />
    }

    <app-theme-picker />
  `,
})
export class App {
  protected readonly lab = inject(LabService);
  protected readonly i18n = inject(I18nService);

  private readonly site = inject(SiteService);
  private readonly theme = inject(ThemeService);
  private readonly appliedTokens = new Set<string>();

  constructor() {
    this.site.load().subscribe();
    this.i18n.set(this.i18n.locale());

    // Tema activo (backoffice) o el que se pruebe en el selector.
    effect(() => {
      const theme = this.theme.current();
      const root = document.documentElement;

      root.removeAttribute('data-theme');
      root.removeAttribute('data-layout');
      this.appliedTokens.forEach((key) => root.style.removeProperty(key));
      this.appliedTokens.clear();

      if (theme) {
        root.dataset['theme'] = theme.name;
        root.dataset['layout'] = theme.layout ?? 'notebook';
        Object.entries(theme.tokens).forEach(([key, value]) => {
          root.style.setProperty(key, value);
          this.appliedTokens.add(key);
        });
      }

      // El acento suelto de los ajustes solo manda si el tema no define uno.
      const accent = this.site.setting<string>('accent_color', '');

      if (accent && !theme?.tokens['--accent']) {
        root.style.setProperty('--accent', accent);
        this.appliedTokens.add('--accent');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.shiftKey && event.key.toLowerCase() === 'l') {
        this.lab.toggle();
      }
    });
  }
}
