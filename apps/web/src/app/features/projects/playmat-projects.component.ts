import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { I18nService } from '../../core/i18n';
import type { Project } from '../projects/projects.component';

/** Proyectos como un tapete: biblioteca, campo de batalla, cementerio y mano. */
@Component({
  selector: 'app-playmat-projects',
  imports: [RouterLink],
  template: `
    <div class="playmat-projects">
      <nav class="playmat-mana" [attr.aria-label]="i18n.t('playmat.mana')">
        <a class="mana mana-w" routerLink="/"><span>W</span><small>{{ i18n.t('desktop.welcome') }}</small></a>
        <a class="mana mana-u" routerLink="/blog"><span>U</span><small>{{ i18n.t('desktop.blog') }}</small></a>
        <a class="mana mana-r" routerLink="/proyectos"><span>R</span><small>{{ i18n.t('desktop.projects') }}</small></a>
        <a class="mana mana-g" routerLink="/habilidades"><span>G</span><small>{{ i18n.t('desktop.skills') }}</small></a>
        <a class="mana mana-b" routerLink="/sobre-mi"><span>B</span><small>{{ i18n.t('desktop.about') }}</small></a>
        <a class="mana mana-c" routerLink="/contacto"><span>C</span><small>{{ i18n.t('desktop.contact') }}</small></a>
      </nav>

      <section class="playmat-zone zone-library">
        <span class="zone-title">{{ i18n.t('playmat.library') }}</span>
        <span class="zone-sub">{{ deck().length }} {{ i18n.t('desktop.projectFile') }}</span>
        <span class="deck-stack" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
        <button class="playmat-button" type="button" [disabled]="deck().length === 0" (click)="draw()">
          {{ i18n.t('playmat.draw') }}
        </button>
      </section>

      <section class="playmat-zone zone-battlefield">
        <span class="zone-title">{{ i18n.t('playmat.battlefield') }}</span>
        @if (drawn(); as project) {
          <article class="magic-card project-magic">
            <header class="magic-name">
              <span>{{ project.name }}</span>
              <span class="magic-cost">{{ years(project) }}</span>
            </header>
            <div class="magic-art" [style.background]="project.company?.color || '#3a2f1d'">
              {{ project.company?.short || 'ML' }}
            </div>
            <p class="magic-type">{{ i18n.pick(project.kind) }} · {{ project.company ? i18n.pick(project.company.name) : 'MilioLab' }}</p>
            <div class="magic-text">
              <p>{{ i18n.pick(project.summary) }}</p>
              <p><strong>{{ i18n.t('desktop.role') }}:</strong> {{ i18n.pick(project.roles) }}</p>
              <p class="magic-tags">
                @for (tech of project.tech; track tech.name) {
                  <span>{{ tech.short }}</span>
                }
              </p>
            </div>
            <footer class="magic-stats">
              <span>{{ project.from }}–{{ project.to }}</span>
              @if (project.link) {
                <a [href]="project.link" target="_blank" rel="noopener">{{ i18n.t('desktop.open') }}</a>
              }
            </footer>
          </article>
          <button class="playmat-button playmat-discard" type="button" (click)="discard()">
            {{ i18n.t('playmat.discard') }}
          </button>
        } @else {
          <p class="playmat-hint">{{ i18n.t('playmat.drawProject') }}</p>
        }
      </section>

      <section class="playmat-zone zone-graveyard">
        <span class="zone-title">{{ i18n.t('playmat.graveyard') }}</span>
        <div class="graveyard-list">
          @for (project of graveyard(); track project.name) {
            <button class="grave-card" type="button" (click)="inspect(project)">{{ project.name }}</button>
          } @empty {
            <span class="zone-sub">{{ i18n.t('playmat.graveyard') }}</span>
          }
        </div>
      </section>

      <aside class="life-counter">
        <span>{{ i18n.t('playmat.life') }}</span>
        <strong>{{ life() }}</strong>
        <div class="life-buttons">
          <button type="button" (click)="life.set(life() - 1)">−</button>
          <button type="button" (click)="life.set(life() + 1)">+</button>
        </div>
        <small>{{ i18n.t('playmat.projectCard') }}</small>
      </aside>

      <section class="playmat-zone zone-hand">
        <span class="zone-title">{{ i18n.t('playmat.allProjects') }}</span>
        <div class="project-hand">
          @for (project of projects(); track project.name) {
            <button class="mini-project" type="button" (click)="inspect(project)">
              <span class="mini-project-name">{{ project.name }}</span>
              <span class="mini-project-meta">{{ i18n.pick(project.period) }} · {{ i18n.pick(project.kind) }}</span>
            </button>
          }
        </div>
      </section>
    </div>
  `,
})
export class PlaymatProjectsComponent {
  readonly projects = input.required<Project[]>();

  protected readonly i18n = inject(I18nService);
  protected readonly drawn = signal<Project | null>(null);
  protected readonly graveyard = signal<Project[]>([]);
  protected readonly life = signal(20);

  protected readonly deck = computed(() => {
    const drawn = this.drawn();
    const grave = new Set(this.graveyard().map((project) => project.name));

    return [...this.projects()]
      .filter((project) => project.name !== drawn?.name && !grave.has(project.name))
      .sort((a, b) => b.from - a.from);
  });

  protected draw(): void {
    const next = this.deck()[0];

    if (!next) {
      return;
    }

    if (this.drawn()) {
      this.graveyard.update((items) => [this.drawn()!, ...items]);
    }

    this.drawn.set(next);
  }

  protected discard(): void {
    if (this.drawn()) {
      this.graveyard.update((items) => [this.drawn()!, ...items]);
      this.drawn.set(null);
    }
  }

  protected inspect(project: Project): void {
    if (this.drawn() && this.drawn()!.name !== project.name) {
      this.graveyard.update((items) => [this.drawn()!, ...items]);
    }

    this.graveyard.update((items) => items.filter((item) => item.name !== project.name));
    this.drawn.set(project);
  }

  protected years(project: Project): number {
    return project.to - project.from + 1;
  }
}
