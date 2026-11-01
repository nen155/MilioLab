import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { formatDate } from '../core/format';
import { PostSummary } from '../core/models';

const NOTES = [
  'hipótesis: se puede contar sin ruido.',
  'observación: el detalle está en el borde.',
  'nota: probar, medir, repetir.',
  'muestra estable a temperatura ambiente.',
  'registro: sin atajos, sin plantillas.',
];

@Component({
  selector: 'app-post-card',
  imports: [RouterLink],
  template: `
    <article class="specimen">
      <div class="specimen-tag">
        <span class="specimen-id">ML-{{ id() }}</span>
        <span>{{ date(post().published_at) }}</span>
      </div>

      <a class="specimen-cover" [routerLink]="['/blog', post().slug]" tabindex="-1" aria-hidden="true">
        @if (post().cover?.url) {
          <img [src]="post().cover!.url" [alt]="post().cover!.alt || post().title" loading="lazy" />
        } @else {
          <span class="mono muted" style="display:grid;place-items:center;height:100%">sin imagen</span>
        }
      </a>

      <h3 class="specimen-title">
        <a [routerLink]="['/blog', post().slug]">{{ post().title }}</a>
      </h3>

      @if (post().excerpt) {
        <p class="specimen-excerpt">{{ post().excerpt }}</p>
      }

      <p class="specimen-foot">
        @if (post().category; as category) {
          <a class="chip" [routerLink]="['/blog/categoria', category.slug]">{{ category.name }}</a>
        }
        <span>{{ post().reading_minutes }} min</span>
      </p>

      <span class="specimen-note" aria-hidden="true">{{ note() }}</span>
    </article>
  `,
})
export class PostCardComponent {
  readonly post = input.required<PostSummary>();

  protected readonly id = computed(() => String(this.post().id).padStart(3, '0'));
  protected readonly note = computed(() => NOTES[this.post().id % NOTES.length]);

  protected date(value?: string | null): string {
    return formatDate(value);
  }
}
