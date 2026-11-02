import { Component, computed, inject } from '@angular/core';

import { I18nService } from '../core/i18n';
import { ThemeRailConfig, ThemeRailItem } from '../core/models';
import { SiteService } from '../core/site.service';

interface RailView extends ThemeRailConfig {
  aria: string;
  subtitle: string;
  type: string;
  foot: string;
  items: ThemeRailItem[];
}

/**
 * Raíl lateral único para todos los layouts. Los adornos (cordillera, marco de
 * carta, estado HUD) están siempre en el DOM y el CSS decide cuáles se ven
 * según `data-layout`. Los textos se pueden sobrescribir desde el tema con
 * `config.rail`, sin tocar el frontend.
 */
@Component({
  selector: 'app-site-rail',
  template: `
    <aside class="rail" [attr.aria-label]="rail().aria">
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

      <span class="rail-card-frame" aria-hidden="true"></span>
      <span class="rail-set" aria-hidden="true">✦</span>
      <span class="hud-status"><i aria-hidden="true"></i> {{ i18n.t('rail.online') }}</span>

      <a class="rail-mark" href="/">MilioLab</a>
      <span class="mono">{{ rail().subtitle }}</span>
      <span class="rail-rule" aria-hidden="true"></span>

      <dl class="rail-list">
        @for (item of rail().items; track item.label) {
          <div>
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        }
      </dl>

      <span class="rail-type">{{ rail().type }}</span>
      <span class="rail-foot">{{ rail().foot }}</span>
    </aside>
  `,
})
export class SiteRailComponent {
  private readonly site = inject(SiteService);
  protected readonly i18n = inject(I18nService);

  protected readonly rail = computed<RailView>(() => {
    const year = new Date().getFullYear();
    const config = this.site.site()?.theme?.config?.rail ?? {};
    const defaults: RailView = {
      aria: this.i18n.t('rail.aria'),
      subtitle: this.i18n.t('rail.subtitle'),
      type: this.i18n.t('rail.type'),
      foot: `miliolab.com · ${this.i18n.t('rail.record')} ${year}`,
      items: [
        { label: this.i18n.t('rail.project'), value: `ML-${year}` },
        { label: this.i18n.t('rail.status'), value: this.i18n.t('rail.open') },
        { label: this.i18n.t('rail.author'), value: 'Emilio' },
        { label: this.i18n.t('rail.method'), value: this.i18n.t('rail.methodValue') },
      ],
    };

    return {
      ...defaults,
      ...config,
      aria: config.aria || defaults.aria,
      subtitle: config.subtitle || defaults.subtitle,
      type: config.type || defaults.type,
      foot: config.foot || defaults.foot,
      items: config.items?.length ? config.items : defaults.items,
    };
  });
}
