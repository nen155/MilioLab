import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { DesktopService } from '../../core/desktop.service';
import { I18nService } from '../../core/i18n';
import { Page, PostSummary } from '../../core/models';
import { SiteService } from '../../core/site.service';
import { ContentPipe } from '../../shared/content.pipe';

/** Escritorio de inicio: iconos, ventana de bienvenida y disquetes de entradas. */
@Component({
  selector: 'app-desktop-home',
  imports: [RouterLink, ContentPipe],
  template: `
    <div class="desktop-home">
      <nav class="desktop-icons" [attr.aria-label]="i18n.t('desktop.desktop')">
        <a class="desktop-icon" routerLink="/proyectos">
          <span class="desktop-icon-img icon-folder" aria-hidden="true"></span>
          <span>{{ i18n.t('desktop.projects') }}</span>
        </a>
        <a class="desktop-icon" routerLink="/habilidades">
          <span class="desktop-icon-img icon-folder" aria-hidden="true"></span>
          <span>{{ i18n.t('desktop.skills') }}</span>
        </a>
        <a class="desktop-icon" routerLink="/blog">
          <span class="desktop-icon-img icon-doc" aria-hidden="true"></span>
          <span>{{ i18n.t('desktop.blog') }}</span>
        </a>
        <a class="desktop-icon" routerLink="/sobre-mi">
          <span class="desktop-icon-img icon-user" aria-hidden="true"></span>
          <span>{{ i18n.t('desktop.about') }}</span>
        </a>
        <a class="desktop-icon" routerLink="/contacto">
          <span class="desktop-icon-img icon-mail" aria-hidden="true"></span>
          <span>{{ i18n.t('desktop.contact') }}</span>
        </a>
      </nav>

      <section class="desktop-window welcome-window">
        <header class="win-title">
          <span>{{ i18n.t('desktop.welcome') }}</span>
          <span class="win-buttons" aria-hidden="true">_ □ ×</span>
        </header>

        <div class="win-body">
          <h1 class="win-hero">{{ site.siteName() }}</h1>
          <p class="win-tagline">{{ site.tagline() }}</p>
          <p>{{ i18n.t('home.lede') }}</p>
          <p class="win-actions">
            <a class="win-button" routerLink="/blog">{{ i18n.t('home.cta') }}</a>
            <a class="win-button" routerLink="/texto">{{ i18n.t('home.text') }}</a>
          </p>
        </div>
      </section>

      <section class="desktop-window start-window">
        <span class="start-side">MilioLab 95</span>
        <nav class="start-items" [attr.aria-label]="i18n.t('desktop.startMenu')">
          <a class="start-item" routerLink="/proyectos">
            <strong>{{ i18n.t('desktop.programs') }}</strong>
            <span>{{ i18n.t('desktop.projects') }} · {{ i18n.t('desktop.skills') }} · {{ i18n.t('desktop.blog') }}</span>
          </a>
          <a class="start-item" routerLink="/blog">
            <strong>{{ i18n.t('desktop.documents') }}</strong>
            <span>{{ i18n.t('desktop.blog') }}</span>
          </a>
          <a class="start-item" routerLink="/texto">
            <strong>{{ i18n.t('desktop.settings') }}</strong>
            <span>{{ i18n.t('home.text') }}</span>
          </a>
          <a class="start-item" routerLink="/blog">
            <strong>{{ i18n.t('desktop.find') }}</strong>
            <span>{{ i18n.t('desktop.blog') }}</span>
          </a>
          <a class="start-item" routerLink="/sobre-mi">
            <strong>{{ i18n.t('desktop.help') }}</strong>
            <span>{{ i18n.t('desktop.about') }}</span>
          </a>
          <a class="start-item" routerLink="/contacto">
            <strong>{{ i18n.t('desktop.run') }}</strong>
            <span>{{ i18n.t('desktop.contact') }}</span>
          </a>
          <span class="start-separator"></span>
          <span class="start-item disabled">
            <strong>{{ i18n.t('desktop.shutdown') }}</strong>
          </span>
        </nav>
      </section>

      <section class="desktop-window clock-window">
        <header class="win-title">
          <span>{{ i18n.t('desktop.clock') }}</span>
          <span class="win-buttons" aria-hidden="true">_ □ ×</span>
        </header>

        <div class="win-body clock-body">
          <p class="clock-time">{{ time() }}</p>
          <p class="clock-date">{{ dateLabel() }}</p>
          <span class="clock-month-name">{{ monthName() }}</span>
          <div class="clock-grid">
            @for (day of days(); track $index) {
              <span [class.today]="day === today">{{ day || '' }}</span>
            }
          </div>
        </div>
      </section>

      @if (posts().length) {
        <section class="desktop-window documents-window">
          <header class="win-title">
            <span>{{ i18n.t('desktop.documents') }}</span>
            <span class="win-buttons" aria-hidden="true">_ □ ×</span>
          </header>

          <div class="win-body floppy-grid">
            @for (post of posts(); track post.id) {
              <button class="desktop-floppy" type="button" (click)="openPost(post, $event)">
                <span class="floppy-shutter" aria-hidden="true"></span>
                <span class="floppy-label">
                  <strong>{{ title(post) }}</strong>
                  <span class="floppy-meta">{{ date(post.published_at) }} · {{ post.reading_minutes }} {{ i18n.t('common.min') }}</span>
                  @if (excerpt(post)) {
                    <span class="floppy-excerpt">{{ excerpt(post) }}</span>
                  }
                </span>
              </button>
            }
          </div>
        </section>
      }

      @if (page()?.body) {
        <section class="desktop-window about-window">
          <header class="win-title">
            <span>{{ page()!.title }}</span>
            <span class="win-buttons" aria-hidden="true">_ □ ×</span>
          </header>
          <div class="win-body prose" [innerHTML]="page()!.body | content"></div>
        </section>
      }
    </div>
  `,
})
export class DesktopHomeComponent {
  readonly page = input<Page | null>(null);

  protected readonly site = inject(SiteService);
  protected readonly i18n = inject(I18nService);

  private readonly router = inject(Router);
  private readonly desktop = inject(DesktopService);

  protected readonly posts = this.site.latestPosts;

  private readonly now = new Date();
  protected readonly today = this.now.getDate();

  protected readonly time = computed(() =>
    this.now.toLocaleTimeString(this.i18n.locale() === 'en' ? 'en-GB' : 'es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  );

  protected readonly dateLabel = computed(() =>
    this.now.toLocaleDateString(this.i18n.locale() === 'en' ? 'en-GB' : 'es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  );

  protected readonly monthName = computed(() =>
    this.now.toLocaleDateString(this.i18n.locale() === 'en' ? 'en-GB' : 'es-ES', {
      month: 'long',
      year: 'numeric',
    }),
  );

  protected readonly days = computed(() => {
    const year = this.now.getFullYear();
    const month = this.now.getMonth();
    const first = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const cells: number[] = Array.from({ length: first }, () => 0);

    for (let day = 1; day <= total; day++) {
      cells.push(day);
    }

    return cells;
  });

  protected title(post: PostSummary): string {
    return this.i18n.content(post.title, post.title_en);
  }

  protected excerpt(post: PostSummary): string {
    return this.i18n.content(post.excerpt, post.excerpt_en);
  }

  protected date(value?: string | null): string {
    return value ? new Date(value).toLocaleDateString(this.i18n.locale() === 'en' ? 'en-GB' : 'es-ES') : '';
  }

  protected openPost(post: PostSummary, event: Event): void {
    this.desktop.insert(event.currentTarget as HTMLElement, () => {
      this.router.navigate(['/blog', post.slug]);
    });
  }
}
