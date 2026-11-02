import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { I18nService } from '../../core/i18n';
import { Page } from '../../core/models';
import { ContentPipe } from '../../shared/content.pipe';

/** Sobre mí como documento de WordPad con panel de sistema. */
@Component({
  selector: 'app-desktop-about',
  imports: [RouterLink, ContentPipe],
  template: `
    <section class="desktop-window wordpad-window">
      <header class="win-title">
        <span>{{ title() }}.doc - WordPad</span>
        <span class="win-buttons" aria-hidden="true">_ □ ×</span>
      </header>

      <div class="win-menu">
        <span>Archivo</span><span>Editar</span><span>Ver</span><span>Insertar</span><span>Formato</span><span>Ayuda</span>
      </div>

      <div class="win-toolbar">
        <span class="win-button win-button-small">Nuevo</span>
        <span class="win-button win-button-small">Abrir</span>
        <span class="win-button win-button-small">Guardar</span>
        <span class="win-button win-button-small">Imprimir</span>
        <span class="win-toolbar-spacer"></span>
        <span class="win-toolbar-label">{{ i18n.t('desktop.aboutTitle') }}</span>
      </div>

      <div class="wordpad-body">
        <aside class="wordpad-side">
          <div class="wordpad-avatar" aria-hidden="true">EC</div>
          <p class="wordpad-name">Emilio Chica Jiménez</p>
          <p class="wordpad-role">Ingeniero de software · Granada</p>
          <ul class="wordpad-links">
            <li><a routerLink="/proyectos">{{ i18n.t('desktop.projects') }}</a></li>
            <li><a routerLink="/habilidades">{{ i18n.t('desktop.skills') }}</a></li>
            <li><a routerLink="/contacto">{{ i18n.t('desktop.contact') }}</a></li>
            <li><a routerLink="/texto">{{ i18n.t('home.text') }}</a></li>
          </ul>
        </aside>

        <div class="wordpad-doc prose" [innerHTML]="body() | content"></div>
      </div>
    </section>
  `,
})
export class DesktopAboutComponent {
  readonly page = input.required<Page>();

  protected readonly i18n = inject(I18nService);

  protected readonly title = computed(() => this.i18n.content(this.page().title, this.page().title_en));
  protected readonly body = computed(() => this.i18n.content(this.page().body, this.page().body_en));
}
