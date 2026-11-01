import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { formatDate } from '../core/format';
import { PostSummary } from '../core/models';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink],
  template: `
    <article class="post-card">
      <a class="post-card-cover" [routerLink]="['/blog', post().slug]" tabindex="-1" aria-hidden="true">
        @if (post().cover?.url) {
          <img
            [src]="post().cover!.url"
            [alt]="post().cover!.alt || post().title"
            loading="lazy"
          />
        } @else {
          <span class="post-card-placeholder">{{ post().title.charAt(0) }}</span>
        }
      </a>

      <div class="post-card-body">
        @if (post().category; as category) {
          <a class="chip" [routerLink]="['/blog/categoria', category.slug]">{{ category.name }}</a>
        }

        <h3 class="post-card-title">
          <a [routerLink]="['/blog', post().slug]">{{ post().title }}</a>
        </h3>

        @if (post().excerpt) {
          <p class="post-card-excerpt">{{ post().excerpt }}</p>
        }

        <p class="post-card-meta">
          <time [attr.datetime]="post().published_at">{{ date(post().published_at) }}</time>
          <span aria-hidden="true">·</span>
          <span>{{ post().reading_minutes }} min de lectura</span>
        </p>
      </div>
    </article>
  `,
})
export class PostCardComponent {
  readonly post = input.required<PostSummary>();

  protected date(value?: string | null): string {
    return formatDate(value);
  }
}
