import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { I18nService } from './core/i18n';
import { LabService } from './core/lab.service';
import { LayoutService } from './core/layout.service';
import { SiteService } from './core/site.service';
import { LabPanelComponent } from './features/lab/lab-panel.component';
import { SceneryComponent } from './shared/scenery.component';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteHeaderComponent } from './shared/site-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent, LabPanelComponent, SceneryComponent],
  template: `
    <a class="skip-link" href="#contenido">{{ i18n.t('common.skip') }}</a>
    <app-scenery />

    <div class="shell">
      <div class="lab">
        @switch (layout.layout()) {
          @case ('sketch') {
            <aside class="rail rail-sketch" [attr.aria-label]="i18n.t('rail.sketchAria')">
              <span class="rail-ridge" aria-hidden="true">
                <svg viewBox="0 0 200 420" preserveAspectRatio="none">
                  <path class="ridge-far" d="M0 420 V250 L46 196 L92 246 L142 146 L200 214 V420 Z" />
                  <path class="ridge-near" d="M0 420 V330 L38 288 L88 340 L150 268 L200 328 V420 Z" />
                  <path class="ridge-route" d="M50 412 C 72 362, 60 330, 94 296 S 120 226, 148 190 S 168 140, 174 110" />
                  <circle class="ridge-bolt" cx="50" cy="412" r="4" />
                  <circle class="ridge-bolt" cx="94" cy="296" r="4" />
                  <circle class="ridge-bolt" cx="148" cy="190" r="4" />
                  <circle class="ridge-bolt" cx="174" cy="110" r="5" />
                </svg>
              </span>

              <a class="rail-mark" href="/">MilioLab</a>
              <span class="mono">{{ i18n.t('rail.sketchSubtitle') }}</span>
              <span class="rail-rule" aria-hidden="true"></span>

              <dl class="rail-list">
                <div>
                  <dt>{{ i18n.t('rail.sample') }}</dt>
                  <dd>ML-{{ year }}</dd>
                </div>
                <div>
                  <dt>{{ i18n.t('rail.status') }}</dt>
                  <dd>{{ i18n.t('rail.open') }}</dd>
                </div>
                <div>
                  <dt>{{ i18n.t('rail.author') }}</dt>
                  <dd>Emilio</dd>
                </div>
                <div>
                  <dt>{{ i18n.t('rail.method') }}</dt>
                  <dd>{{ i18n.t('rail.methodValue') }}</dd>
                </div>
              </dl>

              <span class="rail-foot">miliolab.com · {{ i18n.t('rail.record') }} {{ year }}</span>
            </aside>
          }
          @case ('cards') {
            <aside class="rail rail-cards" [attr.aria-label]="i18n.t('rail.cardsAria')">
              <span class="rail-card-frame" aria-hidden="true"></span>
              <span class="rail-set" aria-hidden="true">✦</span>

              <a class="rail-mark" href="/">MilioLab</a>
              <span class="mono">{{ i18n.t('rail.cardsSubtitle') }}</span>
              <span class="rail-rule" aria-hidden="true"></span>

              <dl class="rail-list">
                <div>
                  <dt>{{ i18n.t('rail.project') }}</dt>
                  <dd>ML-{{ year }}</dd>
                </div>
                <div>
                  <dt>{{ i18n.t('rail.status') }}</dt>
                  <dd>{{ i18n.t('rail.open') }}</dd>
                </div>
                <div>
                  <dt>{{ i18n.t('rail.author') }}</dt>
                  <dd>Emilio</dd>
                </div>
                <div>
                  <dt>{{ i18n.t('rail.method') }}</dt>
                  <dd>{{ i18n.t('rail.methodValue') }}</dd>
                </div>
              </dl>

              <span class="rail-type">{{ i18n.t('rail.cardsType') }}</span>
              <span class="rail-foot">miliolab.com · {{ i18n.t('rail.record') }} {{ year }}</span>
            </aside>
          }
          @case ('hud') {
            <aside class="rail rail-hud" [attr.aria-label]="i18n.t('rail.hudAria')">
              <span class="hud-status"><i aria-hidden="true"></i> {{ i18n.t('rail.online') }}</span>

              <a class="rail-mark" href="/">MilioLab</a>
              <span class="mono">{{ i18n.t('rail.hudSubtitle') }}</span>
              <span class="rail-rule" aria-hidden="true"></span>

              <dl class="rail-list">
                <div>
                  <dt>{{ i18n.t('rail.project') }}</dt>
                  <dd>ML-{{ year }}</dd>
                </div>
                <div>
                  <dt>{{ i18n.t('rail.status') }}</dt>
                  <dd>{{ i18n.t('rail.active') }}</dd>
                </div>
                <div>
                  <dt>{{ i18n.t('rail.role') }}</dt>
                  <dd>{{ i18n.t('rail.roleValue') }}</dd>
                </div>
                <div>
                  <dt>{{ i18n.t('rail.method') }}</dt>
                  <dd>{{ i18n.t('rail.methodValue') }}</dd>
                </div>
              </dl>

              <span class="rail-foot">miliolab.com · {{ i18n.t('rail.record') }} {{ year }}</span>
            </aside>
          }
          @default {
            <aside class="rail" [attr.aria-label]="i18n.t('rail.aria')">
              <a class="rail-mark" href="/">MilioLab</a>
              <span class="mono">{{ i18n.t('rail.notebook') }}</span>
              <span class="rail-rule" aria-hidden="true"></span>

              <dl class="rail-list">
                <div>
                  <dt>{{ i18n.t('rail.sample') }}</dt>
                  <dd>ML-{{ year }}</dd>
                </div>
                <div>
                  <dt>{{ i18n.t('rail.status') }}</dt>
                  <dd>{{ i18n.t('rail.open') }}</dd>
                </div>
                <div>
                  <dt>{{ i18n.t('rail.author') }}</dt>
                  <dd>Emilio</dd>
                </div>
                <div>
                  <dt>{{ i18n.t('rail.method') }}</dt>
                  <dd>{{ i18n.t('rail.observation') }}</dd>
                </div>
              </dl>

              <span class="rail-foot">miliolab.com · {{ i18n.t('rail.record') }} {{ year }}</span>
            </aside>
          }
        }

        <div class="main">
          <app-site-header />

          <main id="contenido" tabindex="-1">
            <router-outlet />
          </main>

          <app-site-footer />
        </div>
      </div>
    </div>

    @if (lab.open()) {
      <app-lab-panel />
    }
  `,
})
export class App {
  protected readonly lab = inject(LabService);
  protected readonly layout = inject(LayoutService);
  protected readonly i18n = inject(I18nService);
  protected readonly year = new Date().getFullYear();

  private readonly site = inject(SiteService);

  constructor() {
    this.site.load().subscribe();
    this.i18n.set(this.i18n.locale());

    // Tema activo (se elige en el panel) + acento suelto de los ajustes.
    effect(() => {
      const theme = this.site.site()?.theme;
      const root = document.documentElement;

      root.removeAttribute('data-theme');
      root.removeAttribute('data-layout');

      if (theme) {
        root.dataset['theme'] = theme.name;
        root.dataset['layout'] = theme.layout ?? 'notebook';
        Object.entries(theme.tokens).forEach(([key, value]) => root.style.setProperty(key, value));
      }

      this.layout.set(theme?.layout);

      // El acento suelto de los ajustes solo manda si el tema no define uno.
      const accent = this.site.setting<string>('accent_color', '');

      if (accent && !theme?.tokens['--accent']) {
        root.style.setProperty('--accent', accent);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.shiftKey && event.key.toLowerCase() === 'l') {
        this.lab.toggle();
      }
    });
  }
}
