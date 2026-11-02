import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { formatDate } from '../../core/format';
import { I18nService } from '../../core/i18n';
import { LayoutService } from '../../core/layout.service';
import { PostSummary } from '../../core/models';

/**
 * Mapa de nodos: encadena las entradas como nodos conectados.
 *
 * Según el layout se dibuja como grafo, como presas de roca con su
 * cordada, como mano de cartas o como objetivos de un HUD. La navegación es la
 * misma: flechas izquierda/derecha (o Inicio/Fin) mueven el foco entre nodos.
 */
@Component({
  selector: 'app-node-map',
  imports: [RouterLink],
  template: `
    <div
      class="node-map"
      role="list"
      [attr.aria-label]="i18n.t('node.aria')"
      (keydown)="onKey($event)"
    >
      @if (layout.isSketch()) {
        <svg
          class="node-rope"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          [style.width.px]="posts().length * 310 + 60"
          aria-hidden="true"
        >
          <path d="M0 26 C 90 72, 210 72, 300 26 S 510 72, 600 26 S 810 72, 900 26 S 1110 72, 1200 26" />
          <path class="rope-twist" d="M0 26 C 90 72, 210 72, 300 26 S 510 72, 600 26 S 810 72, 900 26 S 1110 72, 1200 26" />
        </svg>
      }

      @for (post of posts(); track post.id; let index = $index; let first = $first) {
        <article
          class="node"
          [class.node-origin]="first"
          role="listitem"
          [attr.data-branch]="post.category?.slug || 'sin-rama'"
        >
          <span class="node-sling" aria-hidden="true"></span>
          <span class="node-bolt" aria-hidden="true"></span>
          <span class="node-chalk" aria-hidden="true"></span>
          <span class="node-port" aria-hidden="true"></span>

          <header class="node-head">
            <span class="node-id">N-{{ id(post) }}</span>
            <span class="node-edge">{{ first ? i18n.t('node.origin') : i18n.t('node.connects') }}</span>
          </header>

          <span class="card-cost" aria-hidden="true">
            <i>{{ post.reading_minutes }}</i>
            <i class="card-cost-rarity">✦</i>
          </span>

          @if (post.cover?.url) {
            <a class="node-cover" [routerLink]="['/blog', post.slug]" tabindex="-1" aria-hidden="true">
              <img [src]="post.cover!.url" [alt]="post.cover!.alt || title(post)" loading="lazy" />
            </a>
          }

          <h3 class="node-title">
            <a
              [routerLink]="['/blog', post.slug]"
              [attr.tabindex]="index === 0 ? 0 : -1"
              [attr.data-node-index]="index"
            >
              {{ title(post) }}
            </a>
          </h3>

          <p class="card-type node-type" aria-hidden="true">
            {{ i18n.t('node.entry') }} · {{ categoryName(post) }}
            <span class="card-set">◆</span>
          </p>

          @if (excerpt(post)) {
            <p class="node-excerpt">{{ excerpt(post) }}</p>
          }

          <p class="node-meta">
            <span class="node-branch">{{ categoryName(post, 'node.noParent') }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ date(post.published_at) }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ minutes(post) }} {{ i18n.t('common.min') }}</span>
          </p>
        </article>
      }
    </div>
  `,
})
export class NodeMapComponent {
  readonly posts = input.required<PostSummary[]>();

  protected readonly layout = inject(LayoutService);
  protected readonly i18n = inject(I18nService);

  protected title(post: PostSummary): string {
    return this.i18n.content(post.title, post.title_en);
  }

  protected excerpt(post: PostSummary): string {
    return this.i18n.content(post.excerpt, post.excerpt_en);
  }

  protected categoryName(post: PostSummary, fallbackKey = 'node.uncategorized'): string {
    const category = post.category;

    return category
      ? this.i18n.content(category.name, category.name_en)
      : this.i18n.t(fallbackKey);
  }

  protected minutes(post: PostSummary): number {
    return this.i18n.locale() === 'en'
      ? post.reading_minutes_en ?? post.reading_minutes
      : post.reading_minutes;
  }

  protected id(post: PostSummary): string {
    return String(post.id).padStart(3, '0');
  }

  protected date(value?: string | null): string {
    return formatDate(value, this.i18n.locale());
  }

  /** Roving tabindex: flechas para pasar de un nodo a otro. */
  protected onKey(event: KeyboardEvent): void {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];

    if (!keys.includes(event.key)) {
      return;
    }

    const links = Array.from(
      (event.currentTarget as HTMLElement).querySelectorAll<HTMLAnchorElement>('[data-node-index]'),
    );

    if (links.length === 0) {
      return;
    }

    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    let next = current;

    if (event.key === 'ArrowRight') {
      next = Math.min(links.length - 1, current + 1);
    } else if (event.key === 'ArrowLeft') {
      next = Math.max(0, current - 1);
    } else if (event.key === 'Home') {
      next = 0;
    } else {
      next = links.length - 1;
    }

    event.preventDefault();
    links.forEach((link, index) => link.setAttribute('tabindex', index === next ? '0' : '-1'));
    links[next].focus();
  }
}
