import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { I18nService } from '../../core/i18n';
import { Page } from '../../core/models';
import { SiteService } from '../../core/site.service';
import { ContentPipe } from '../../shared/content.pipe';

interface ContactLink {
  label: string;
  url: string;
}

/** Contacto como Outlook Express: carpetas, mensaje y ventana de redacción. */
@Component({
  selector: 'app-desktop-contact',
  imports: [FormsModule, ContentPipe],
  template: `
    <div class="desktop-contact">
      <section class="desktop-window mail-window">
        <header class="win-title">
          <span>{{ i18n.t('desktop.mailTitle') }}</span>
          <span class="win-buttons" aria-hidden="true">_ □ ×</span>
        </header>

        <div class="win-menu">
          <span>Archivo</span><span>Editar</span><span>Ver</span><span>Herramientas</span><span>Mensaje</span><span>Ayuda</span>
        </div>

        <div class="win-toolbar mail-toolbar">
          <button class="win-button win-button-small" type="button" (click)="compose.set(true)">
            {{ i18n.t('desktop.newMessage') }}
          </button>
          <button class="win-button win-button-small" type="button" (click)="compose.set(true)">
            {{ i18n.t('desktop.reply') }}
          </button>
          <button class="win-button win-button-small" type="button" (click)="compose.set(true)">
            {{ i18n.t('desktop.forward') }}
          </button>
          <button class="win-button win-button-small" type="button" (click)="compose.set(true)">
            {{ i18n.t('desktop.sendReceive') }}
          </button>
          <span class="win-toolbar-spacer"></span>
          <span class="win-toolbar-label">{{ email() }}</span>
        </div>

        <div class="mail-layout">
          <aside class="mail-folders">
            <p class="mail-folder-title">{{ i18n.t('desktop.contacts') }}</p>
            <span class="mail-folder active">{{ i18n.t('desktop.inbox') }}</span>
            <span class="mail-folder">{{ i18n.t('desktop.sent') }}</span>
            <span class="mail-folder">{{ i18n.t('desktop.deleted') }}</span>

            <p class="mail-folder-title">{{ i18n.t('desktop.contacts') }}</p>
            @for (link of links(); track link.label) {
              <a class="mail-contact" [href]="link.url" target="_blank" rel="noopener">{{ link.label }}</a>
            }
          </aside>

          <div class="mail-list">
            <div class="mail-row active">
              <span class="mail-from">{{ i18n.t('desktop.from') }}: Emilio Chica</span>
              <span class="mail-subject">{{ title() }}</span>
              <span class="mail-date">{{ date() }}</span>
            </div>
            <div class="mail-row">
              <span class="mail-from">{{ i18n.t('desktop.from') }}: MilioLab</span>
              <span class="mail-subject">{{ i18n.t('desktop.welcome') }}</span>
              <span class="mail-date">{{ date() }}</span>
            </div>
          </div>

          <div class="mail-preview">
            <p class="mail-meta">
              {{ i18n.t('desktop.from') }}: {{ email() }} · {{ i18n.t('desktop.to') }}: {{ i18n.t('desktop.me') }}
            </p>
            <h2>{{ title() }}</h2>
            <div class="prose" [innerHTML]="body() | content"></div>
            <p class="mail-actions">
              <a class="win-button" [href]="mailto()">{{ i18n.t('desktop.reply') }}</a>
              <button class="win-button" type="button" (click)="compose.set(true)">
                {{ i18n.t('desktop.newMessage') }}
              </button>
            </p>
          </div>
        </div>
      </section>

      @if (compose()) {
        <section class="desktop-window compose-window">
          <header class="win-title">
            <span>{{ i18n.t('desktop.newMessage') }}</span>
            <button class="win-close" type="button" (click)="compose.set(false)" aria-label="Cerrar">×</button>
          </header>

          <div class="win-body">
            <div class="compose-row">
              <label for="mail-to">{{ i18n.t('desktop.to') }}</label>
              <input id="mail-to" class="win-input" [value]="email()" readonly />
            </div>
            <div class="compose-row">
              <label for="mail-subject">{{ i18n.t('desktop.subject') }}</label>
              <input id="mail-subject" class="win-input" [(ngModel)]="subject" />
            </div>
            <label class="compose-label" for="mail-body">{{ i18n.t('desktop.message') }}</label>
            <textarea id="mail-body" class="win-textarea" rows="6" [(ngModel)]="message"></textarea>
            <p class="compose-actions">
              <a class="win-button" [href]="mailto()">{{ i18n.t('desktop.send') }}</a>
              <button class="win-button" type="button" (click)="compose.set(false)">Cancelar</button>
            </p>
          </div>
        </section>
      }
    </div>
  `,
})
export class DesktopContactComponent {
  readonly page = input.required<Page>();

  protected readonly i18n = inject(I18nService);
  private readonly site = inject(SiteService);

  protected readonly compose = signal(false);
  protected subject = 'Hablemos de un proyecto';
  protected message = '';

  protected readonly email = computed(() => this.site.setting<string>('contact_email', 'hola@miliolab.com'));

  protected readonly title = computed(() => this.i18n.content(this.page().title, this.page().title_en));
  protected readonly body = computed(() => this.i18n.content(this.page().body, this.page().body_en));

  protected readonly links = computed<ContactLink[]>(() => {
    const links: ContactLink[] = [
      { label: this.email(), url: `mailto:${this.email()}` },
      { label: 'GitHub', url: this.site.setting<string>('social_github', '') },
      { label: 'LinkedIn', url: this.site.setting<string>('social_linkedin', '') },
      { label: 'X', url: this.site.setting<string>('social_x', '') },
    ];

    return links.filter((link) => link.url !== '');
  });

  protected mailto(): string {
    const subject = encodeURIComponent(this.subject);
    const body = encodeURIComponent(this.message);

    return `mailto:${this.email()}?subject=${subject}&body=${body}`;
  }

  protected date(): string {
    const value = this.page().updated_at;

    return value ? new Date(value).toLocaleDateString(this.i18n.locale() === 'en' ? 'en-GB' : 'es-ES') : '';
  }
}
