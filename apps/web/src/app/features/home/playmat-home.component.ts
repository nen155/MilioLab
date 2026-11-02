import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { I18nService } from '../../core/i18n';
import { PostSummary } from '../../core/models';
import { SiteService } from '../../core/site.service';

/** Inicio como tapete de Magic: zonas, mano, biblioteca, cementerio y contador. */
@Component({
  selector: 'app-playmat-home',
  imports: [RouterLink],
  template: `
    <div class="playmat-home">
      <nav class="playmat-mana" [attr.aria-label]="i18n.t('desktop.startMenu')">
        <a class="mana mana-w" routerLink="/" [attr.title]="i18n.t('desktop.welcome')"><span>W</span><small>{{ i18n.t('desktop.welcome') }}</small></a>
        <a class="mana mana-u" routerLink="/blog" [attr.title]="i18n.t('desktop.blog')"><span>U</span><small>{{ i18n.t('desktop.blog') }}</small></a>
        <a class="mana mana-r" routerLink="/proyectos" [attr.title]="i18n.t('desktop.projects')"><span>R</span><small>{{ i18n.t('desktop.projects') }}</small></a>
        <a class="mana mana-g" routerLink="/habilidades" [attr.title]="i18n.t('desktop.skills')"><span>G</span><small>{{ i18n.t('desktop.skills') }}</small></a>
        <a class="mana mana-b" routerLink="/sobre-mi" [attr.title]="i18n.t('desktop.about')"><span>B</span><small>{{ i18n.t('desktop.about') }}</small></a>
        <a class="mana mana-c" routerLink="/contacto" [attr.title]="i18n.t('desktop.contact')"><span>C</span><small>{{ i18n.t('desktop.contact') }}</small></a>
      </nav>

      <a class="playmat-zone zone-library" routerLink="/proyectos">
        <span class="zone-title">{{ i18n.t('desktop.projects') }}</span>
        <span class="zone-sub">{{ i18n.t('playmat.library') }}</span>
        <span class="deck-stack" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i>
        </span>
        <span class="zone-hint">{{ i18n.t('playmat.drawProject') }}</span>
      </a>

      <section class="playmat-zone zone-battlefield" [attr.aria-label]="i18n.t('playmat.battlefield')">
        <article class="planeswalker-card">
          <header class="pw-name">Emilio Chica <span class="pw-cost">3</span></header>
          <div class="pw-art" aria-hidden="true">EC</div>
          <p class="pw-type">Planeswalker — Ingeniero</p>
          <div class="pw-text">
            <p><strong>+1:</strong> analiza el problema y escribe la especificación.</p>
            <p><strong>−2:</strong> construye la API, la web y el despliegue.</p>
            <p><strong>−7:</strong> lo publica y lo deja mantenible.</p>
          </div>
          <footer class="pw-stats"><span>{{ life() }}</span></footer>
        </article>

        <article class="spell-card">
          <header class="spell-name">{{ site.siteName() }} <span class="spell-cost">2 U R</span></header>
          <div class="spell-art" aria-hidden="true">ML</div>
          <p class="spell-type">Hechizo — Proyecto</p>
          <div class="spell-text">
            <p class="spell-tagline">{{ site.tagline() }}</p>
            <p>{{ i18n.t('home.lede') }}</p>
          </div>
          <footer class="spell-actions">
            <a class="playmat-button" routerLink="/blog">{{ i18n.t('home.cta') }}</a>
            <a class="playmat-button" routerLink="/texto">{{ i18n.t('home.text') }}</a>
          </footer>
        </article>
      </section>

      <a class="playmat-zone zone-graveyard" routerLink="/blog">
        <span class="zone-title">{{ i18n.t('desktop.blog') }}</span>
        <span class="zone-sub">{{ i18n.t('playmat.graveyard') }}</span>
        <span class="grave-cards" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="zone-hint">{{ i18n.t('playmat.archive') }}</span>
      </a>

      <a class="playmat-zone zone-skills" routerLink="/habilidades">
        <span class="zone-title">{{ i18n.t('desktop.skills') }}</span>
        <span class="zone-sub">{{ i18n.t('playmat.enchantments') }}</span>
        <span class="zone-hint">{{ i18n.t('playmat.skillsHint') }}</span>
      </a>

      <a class="playmat-zone zone-contact" routerLink="/contacto">
        <span class="zone-title">{{ i18n.t('desktop.contact') }}</span>
        <span class="zone-sub">{{ i18n.t('playmat.message') }}</span>
        <span class="zone-hint">{{ i18n.t('playmat.contactHint') }}</span>
      </a>

      <aside class="life-counter" [attr.aria-label]="i18n.t('playmat.life')">
        <span>{{ i18n.t('playmat.life') }}</span>
        <strong>{{ life() }}</strong>
        <div class="life-buttons">
          <button type="button" (click)="life.set(life() - 1)">−</button>
          <button type="button" (click)="life.set(life() + 1)">+</button>
        </div>
        <small>{{ i18n.t('playmat.years') }}</small>
      </aside>

      <section class="playmat-zone zone-hand" [attr.aria-label]="i18n.t('playmat.hand')">
        <span class="zone-title">{{ i18n.t('playmat.hand') }}</span>
        <div class="hand-cards">
          @for (post of posts(); track post.id) {
            <a class="hand-card" [routerLink]="['/blog', post.slug]">
              <span class="hand-name">{{ title(post) }}</span>
              <span class="hand-meta">{{ date(post.published_at) }} · {{ post.reading_minutes }} {{ i18n.t('common.min') }}</span>
              <span class="hand-text">{{ excerpt(post) }}</span>
            </a>
          }
        </div>
      </section>
    </div>
  `,
})
export class PlaymatHomeComponent {
  protected readonly site = inject(SiteService);
  protected readonly i18n = inject(I18nService);

  protected readonly posts = this.site.latestPosts;
  protected readonly life = signal(13);

  protected title(post: PostSummary): string {
    return this.i18n.content(post.title, post.title_en);
  }

  protected excerpt(post: PostSummary): string {
    return this.i18n.content(post.excerpt, post.excerpt_en);
  }

  protected date(value?: string | null): string {
    return value ? new Date(value).toLocaleDateString(this.i18n.locale() === 'en' ? 'en-GB' : 'es-ES') : '';
  }
}
