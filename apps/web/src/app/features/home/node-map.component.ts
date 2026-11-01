import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { formatDate } from '../../core/format';
import { PostSummary } from '../../core/models';
import { NodeVideoComponent } from '../../shared/node-video.component';

/**
 * Mapa de nodos: encadena las entradas como nodos conectados. Cada nodo lleva
 * un pequeño vídeo sintetizado a partir de su título y su entradilla.
 */
@Component({
  selector: 'app-node-map',
  imports: [RouterLink, NodeVideoComponent],
  template: `
    <div class="node-map" role="list" aria-label="Mapa de nodos del laboratorio">
      @for (post of posts(); track post.id; let index = $index) {
        <article class="node" role="listitem">
          <span class="node-port" aria-hidden="true"></span>

          <header class="node-head">
            <span class="node-id">N-{{ id(post) }}</span>
            <span class="node-edge">{{ index === 0 ? 'origen' : 'conecta' }}</span>
          </header>

          <app-node-video [title]="post.title" [excerpt]="post.excerpt ?? null" />

          <h3 class="node-title">
            <a [routerLink]="['/blog', post.slug]">{{ post.title }}</a>
          </h3>

          <p class="node-meta">
            <span>{{ post.category?.name || 'sin nodo padre' }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ date(post.published_at) }}</span>
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
}
