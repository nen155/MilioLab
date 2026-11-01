import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { formatDate } from '../../core/format';
import { PostSummary } from '../../core/models';

/**
 * Mapa de nodos: encadena las entradas como nodos conectados.
 *
 * Navegación: flechas izquierda/derecha (o Inicio/Fin) mueven el foco entre
 * nodos.
 */
@Component({
  selector: 'app-node-map',
  imports: [RouterLink],
  template: `
    <div
      class="node-map"
      role="list"
      aria-label="Mapa de nodos del laboratorio. Usa las flechas para recorrerlos."
      (keydown)="onKey($event)"
    >
      @for (post of posts(); track post.id; let index = $index; let first = $first) {
        <article
          class="node"
          [class.node-origin]="first"
          role="listitem"
          [attr.data-branch]="post.category?.slug || 'sin-rama'"
        >
          <span class="node-port" aria-hidden="true"></span>

          <header class="node-head">
            <span class="node-id">N-{{ id(post) }}</span>
            <span class="node-edge">{{ first ? 'origen' : 'conecta' }}</span>
          </header>

          @if (post.cover?.url) {
            <a class="node-cover" [routerLink]="['/blog', post.slug]" tabindex="-1" aria-hidden="true">
              <img [src]="post.cover!.url" [alt]="post.cover!.alt || post.title" loading="lazy" />
            </a>
          }

          <h3 class="node-title">
            <a
              [routerLink]="['/blog', post.slug]"
              [attr.tabindex]="index === 0 ? 0 : -1"
              [attr.data-node-index]="index"
            >
              {{ post.title }}
            </a>
          </h3>

          @if (post.excerpt) {
            <p class="node-excerpt">{{ post.excerpt }}</p>
          }

          <p class="node-meta">
            <span class="node-branch">{{ post.category?.name || 'sin nodo padre' }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ date(post.published_at) }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ post.reading_minutes }} min</span>
          </p>
        </article>
      }
    </div>
  `,
})
export class NodeMapComponent {
  readonly posts = input.required<PostSummary[]>();

  protected id(post: PostSummary): string {
    return String(post.id).padStart(3, '0');
  }

  protected date(value?: string | null): string {
    return formatDate(value);
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
