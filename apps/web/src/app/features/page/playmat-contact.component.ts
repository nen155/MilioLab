import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { I18nService } from '../../core/i18n';
import { Page } from '../../core/models';
import { SiteService } from '../../core/site.service';
import { ContentPipe } from '../../shared/content.pipe';

/** Contacto como una carta de mensaje sobre el tapete. */
@Component({
  selector: 'app-playmat-contact',
  imports: [FormsModule, ContentPipe],
  template: `
    <div class="playmat-contact">
      <section class="playmat-zone zone-battlefield">
        <article class="magic-card contact-magic">
          <header class="magic-name">
            <span>{{ i18n.t('playmat.contactTitle') }}</span>
            <span class="magic-cost">W U</span>
          </header>
          <div class="magic-art contact-art">@</div>
          <p class="magic-type">Hechizo — Contacto</p>
          <div class="magic-text">
            <div class="prose" [innerHTML]="body() | content"></div>
            <p><strong>{{ email() }}</strong></p>
            <p class="contact-links">
              @for (link of links(); track link.label) {
                <a [href]="link.url" target="_blank" rel="noopener">{{ link.label }}</a>
              }
            </p>
          </div>
          <footer class="magic-stats">
            <span>{{ i18n.t('desktop.contact') }}</span>
            <span>{{ i18n.t('playmat.message') }}</span>
          </footer>
        </article>
      </section>

      <section class="playmat-zone zone-detail">
        <span class="zone-title">{{ i18n.t('desktop.newMessage') }}</span>
        <div class="detail-card">
          <div class="compose-row">
            <label for="pm-to">{{ i18n.t('desktop.to') }}</label>
            <input id="pm-to" class="win-input" [value]="email()" readonly />
          </div>
          <div class="compose-row">
            <label for="pm-subject">{{ i18n.t('desktop.subject') }}</label>
            <input id="pm-subject" class="win-input" [(ngModel)]="subject" />
          </div>
          <label class="compose-label" for="pm-body">{{ i18n.t('desktop.message') }}</label>
          <textarea id="pm-body" class="win-textarea" rows="5" [(ngModel)]="message"></textarea>
          <p class="compose-actions">
            <a class="playmat-button" [href]="mailto()">{{ i18n.t('desktop.send') }}</a>
          </p>
        </div>
      </section>
    </div>
  `,
})
export class PlaymatContactComponent {
  readonly page = input.required<Page>();

  protected readonly i18n = inject(I18nService);
  private readonly site = inject(SiteService);

  protected subject = 'Hablemos de un proyecto';
  protected message = '';

  protected readonly email = computed(() => this.site.setting<string>('contact_email', 'hola@miliolab.com'));
  protected readonly body = computed(() => this.i18n.content(this.page().body, this.page().body_en));

  protected readonly links = computed(() => {
    const links = [
      { label: 'GitHub', url: this.site.setting<string>('social_github', '') },
      { label: 'LinkedIn', url: this.site.setting<string>('social_linkedin', '') },
      { label: 'X', url: this.site.setting<string>('social_x', '') },
    ];

    return links.filter((link) => link.url !== '');
  });

  protected mailto(): string {
    return `mailto:${this.email()}?subject=${encodeURIComponent(this.subject)}&body=${encodeURIComponent(this.message)}`;
  }
}
