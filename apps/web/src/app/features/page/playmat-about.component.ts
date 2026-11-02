import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { I18nService } from '../../core/i18n';
import { Page } from '../../core/models';
import { ContentPipe } from '../../shared/content.pipe';

/** Sobre mí como carta de planeswalker sobre el tapete. */
@Component({
  selector: 'app-playmat-about',
  imports: [RouterLink, ContentPipe],
  template: `
    <div class="playmat-about">
      <section class="playmat-zone zone-battlefield">
        <article class="magic-card planeswalker-magic">
          <header class="magic-name">
            <span>Emilio Chica</span>
            <span class="magic-cost">3</span>
          </header>
          <div class="magic-art about-art">EC</div>
          <p class="magic-type">{{ i18n.t('playmat.aboutTitle') }}</p>
          <div class="magic-text about-text prose" [innerHTML]="body() | content"></div>
          <footer class="magic-stats">
            <span>{{ title() }}</span>
            <span class="loyalty">13</span>
          </footer>
        </article>
      </section>

      <section class="playmat-zone zone-detail">
        <span class="zone-title">{{ i18n.t('desktop.about') }}</span>
        <div class="detail-card about-links">
          <a routerLink="/proyectos">{{ i18n.t('desktop.projects') }}</a>
          <a routerLink="/habilidades">{{ i18n.t('desktop.skills') }}</a>
          <a routerLink="/contacto">{{ i18n.t('desktop.contact') }}</a>
          <a routerLink="/texto">{{ i18n.t('home.text') }}</a>
        </div>
      </section>
    </div>
  `,
})
export class PlaymatAboutComponent {
  readonly page = input.required<Page>();

  protected readonly i18n = inject(I18nService);

  protected readonly title = computed(() => this.i18n.content(this.page().title, this.page().title_en));
  protected readonly body = computed(() => this.i18n.content(this.page().body, this.page().body_en));
}
