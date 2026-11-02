import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { I18nService } from '../core/i18n';
import { ThemeCatalogItem } from '../core/models';
import { ThemeService } from '../core/theme.service';

/**
 * Selector de temas para probar los diseños. Está integrado en todos los
 * layouts como un botón discreto; el tema del backoffice sigue siendo el de
 * por defecto al recargar.
 */
@Component({
  selector: 'app-theme-picker',
  template: `
    <button
      class="theme-picker-button"
      type="button"
      (click)="open.set(true)"
      [attr.aria-label]="i18n.t('theme.try')"
      [attr.title]="i18n.t('theme.try')"
    >
      <span class="theme-picker-icon" aria-hidden="true"></span>
      <span class="theme-picker-text">{{ i18n.t('theme.try') }}</span>
    </button>

    @if (open()) {
      <div class="theme-picker-backdrop" (click)="open.set(false)">
        <section
          class="theme-picker"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="i18n.t('theme.title')"
          (click)="$event.stopPropagation()"
        >
          <header class="theme-picker-head">
            <div>
              <h2>{{ i18n.t('theme.title') }}</h2>
              <p>{{ i18n.t('theme.subtitle') }}</p>
            </div>
            <button class="theme-picker-close" type="button" (click)="open.set(false)" [attr.aria-label]="i18n.t('theme.close')">×</button>
          </header>

          <p class="theme-picker-current">
            {{ i18n.t('theme.current') }}: <strong>{{ theme.current()?.name || i18n.t('theme.default') }}</strong>
          </p>

          <div class="theme-picker-grid">
            @for (item of themes(); track item.id) {
              <button
                class="theme-card"
                type="button"
                [class.active]="item.name === theme.current()?.name"
                (click)="apply(item)"
              >
                <span
                  class="theme-card-preview"
                  [style.background]="paper(item)"
                  [style.color]="ink(item)"
                >
                  <span class="theme-card-bar" [style.background]="accent(item)"></span>
                  <strong>{{ item.name }}</strong>
                  <span class="theme-card-layout">{{ item.layout_label }}</span>
                  <span class="theme-card-swatches">
                    <i [style.background]="paper(item)"></i>
                    <i [style.background]="ink(item)"></i>
                    <i [style.background]="accent(item)"></i>
                  </span>
                </span>
                <span class="theme-card-apply">{{ i18n.t('theme.apply') }}</span>
              </button>
            }
          </div>

          @if (theme.overridden()) {
            <button class="theme-picker-reset" type="button" (click)="reset()">
              {{ i18n.t('theme.reset') }}
            </button>
          }
        </section>
      </div>
    }
  `,
})
export class ThemePickerComponent implements OnInit {
  protected readonly i18n = inject(I18nService);
  protected readonly theme = inject(ThemeService);
  protected readonly open = signal(false);

  protected readonly themes = this.theme.themes;
  protected readonly currentName = computed(() => this.theme.current()?.name ?? '');

  ngOnInit(): void {
    this.theme.load().subscribe();
  }

  protected apply(item: ThemeCatalogItem): void {
    this.theme.apply(item);
    this.open.set(false);
  }

  protected reset(): void {
    this.theme.reset();
    this.open.set(false);
  }

  protected paper(item: ThemeCatalogItem): string {
    return item.tokens['--paper'] ?? '#f6f3ea';
  }

  protected ink(item: ThemeCatalogItem): string {
    return item.tokens['--ink'] ?? '#17161a';
  }

  protected accent(item: ThemeCatalogItem): string {
    return item.tokens['--accent'] ?? '#4f46e5';
  }
}
