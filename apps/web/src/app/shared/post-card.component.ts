import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { formatDate } from '../core/format';
import { I18nService } from '../core/i18n';
import { PostSummary } from '../core/models';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink],
  template: `
    <article class="specimen">
      <span class="specimen-tape" aria-hidden="true"></span>

      <div class="specimen-tag">
        <span class="specimen-id">ML-{{ id() }}</span>
        <span>{{ date(post().published_at) }}</span>
      </div>

      <span class="card-cost" aria-hidden="true">
        <i>{{ minutes() }}</i>
        <i class="card-cost-rarity">✦</i>
      </span>

      <a class="specimen-cover" [routerLink]="['/blog', post().slug]" tabindex="-1" aria-hidden="true">
        @if (post().cover?.url) {
          <img [src]="post().cover!.url" [alt]="post().cover!.alt || title()" loading="lazy" />
        } @else {
          <span class="mono muted" style="display:grid;place-items:center;height:100%">{{ i18n.t('card.noImage') }}</span>
        }
      </a>

      <h3 class="specimen-title">
        <a [routerLink]="['/blog', post().slug]">{{ title() }}</a>
      </h3>

      <p class="card-type" aria-hidden="true">
        {{ i18n.t('card.entry') }} · {{ categoryName() }}
        <span class="card-set">◆</span>
      </p>

      @if (excerpt()) {
        <p class="specimen-excerpt">{{ excerpt() }}</p>
      }

      <p class="specimen-foot">
        @if (post().category; as category) {
          <a class="chip" [routerLink]="['/blog/categoria', category.slug]">{{ categoryName() }}</a>
        }
        <span>{{ minutes() }} {{ i18n.t('common.min') }}</span>
        <span class="card-stats">ML-{{ id() }} · ★</span>
      </p>

      <span class="specimen-note" aria-hidden="true">{{ note() }}</span>
    </article>
  `,
})
export class PostCardComponent {
  readonly post = input.required<PostSummary>();

  protected readonly i18n = inject(I18nService);

  protected readonly id = computed(() => String(this.post().id).padStart(3, '0'));
  protected readonly title = computed(() => this.i18n.content(this.post().title, this.post().title_en));
  protected readonly excerpt = computed(() => this.i18n.content(this.post().excerpt, this.post().excerpt_en));
  protected readonly categoryName = computed(() => {
    const category = this.post().category;

    return category
      ? this.i18n.content(category.name, category.name_en)
      : this.i18n.t('card.uncategorized');
  });
  protected readonly minutes = computed(() =>
    this.i18n.locale() === 'en'
      ? this.post().reading_minutes_en ?? this.post().reading_minutes
      : this.post().reading_minutes,
  );
  protected readonly note = computed(() => this.i18n.t(`card.note${(this.post().id % 5) + 1}`));

  protected date(value?: string | null): string {
    return formatDate(value, this.i18n.locale());
  }
}
