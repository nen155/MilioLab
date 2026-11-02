import { Component, OnDestroy, computed, inject, input, signal } from '@angular/core';

import { I18nService } from '../../core/i18n';
import type { Skill } from '../skills/skills.component';

/** Habilidades como ventanas de Windows 95 y línea de tiempo en un reproductor. */
@Component({
  selector: 'app-desktop-skills',
  template: `
    <div class="desktop-skills">
      <section class="desktop-window skills-window">
        <header class="win-title">
          <span>{{ i18n.t('desktop.skillsWindow') }}</span>
          <span class="win-buttons" aria-hidden="true">_ □ ×</span>
        </header>

        <div class="win-body skill-icons">
          @for (skill of skills(); track skill.name.es; let index = $index) {
            <button class="desktop-icon skill-icon" type="button" (click)="select(skill, index)">
              <span class="skill-icon-img" [style.background]="skill.color">{{ skill.short }}</span>
              <span class="skill-icon-label">{{ i18n.pick(skill.name) }}</span>
            </button>
          }
        </div>
      </section>

      <section class="desktop-window wmp-window">
        <header class="win-title">
          <span>{{ i18n.t('desktop.player') }}</span>
          <span class="win-buttons" aria-hidden="true">_ □ ×</span>
        </header>

        <div class="win-body wmp-body">
          <aside class="wmp-sidebar">
            <p class="wmp-list-title">{{ i18n.t('desktop.playlist') }}</p>
            <ul class="wmp-playlist">
              @for (skill of skills(); track skill.name.es; let index = $index) {
                <li
                  [class.active]="selectedIndex() === index"
                  (click)="select(skill, index)"
                >
                  <span class="wmp-track-number">{{ index + 1 }}</span>
                  <span class="wmp-track-name">{{ i18n.pick(skill.name) }}</span>
                  <span class="wmp-track-years">{{ skill.from }}–{{ skill.to }}</span>
                </li>
              }
            </ul>
          </aside>

          <div class="wmp-player">
            @if (selected(); as skill) {
              <div class="wmp-now">
                <div class="wmp-now-head">
                  <span class="wmp-now-icon" [style.background]="skill.color">{{ skill.short }}</span>
                  <div>
                    <p class="wmp-now-title">{{ i18n.pick(skill.name) }}</p>
                    <p class="wmp-now-meta">
                      {{ i18n.pick(skill.category) }} · {{ skill.from }}–{{ skill.to }} ({{ years(skill) }} {{ i18n.t('desktop.years') }})
                    </p>
                  </div>
                </div>

                <div class="wmp-now-screen">
                  <p><strong>{{ i18n.t('skills.projects') }}</strong> {{ i18n.pick(skill.projects) }}</p>
                  @if (skill.note) {
                    <p>{{ i18n.pick(skill.note) }}</p>
                  }
                </div>
              </div>
            } @else {
              <p class="wmp-empty">{{ i18n.t('desktop.selectTrack') }}</p>
            }

            <div class="wmp-controls">
              <button class="wmp-button" type="button" (click)="previous()" [attr.aria-label]="i18n.t('desktop.previous')">⏮</button>
              <button
                class="wmp-play"
                type="button"
                (click)="togglePlay()"
                [attr.aria-label]="playing() ? i18n.t('desktop.pause') : i18n.t('desktop.play')"
              >
                {{ playing() ? '❚❚' : '▶' }}
              </button>
              <button class="wmp-button" type="button" (click)="next()" [attr.aria-label]="i18n.t('desktop.next')">⏭</button>
              <span class="wmp-progress"><span [style.width.%]="progress()"></span></span>
              <span class="wmp-counter">{{ selected() ? selected()!.from + '–' + selected()!.to : '--' }}</span>
            </div>

            <p class="wmp-status">
              {{ i18n.t('desktop.track') }} {{ selectedIndex() >= 0 ? selectedIndex() + 1 : '--' }} / {{ skills().length }}
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class DesktopSkillsComponent implements OnDestroy {
  readonly skills = input.required<Skill[]>();

  protected readonly i18n = inject(I18nService);
  protected readonly selectedIndex = signal(-1);
  protected readonly playing = signal(false);
  protected readonly progress = signal(0);

  protected readonly selected = computed(() => this.skills()[this.selectedIndex()] ?? null);

  private timer?: ReturnType<typeof setInterval>;

  protected select(skill: Skill, index: number): void {
    this.pause();
    this.selectedIndex.set(index);
    this.progress.set(0);
  }

  protected togglePlay(): void {
    if (this.playing()) {
      this.pause();
      return;
    }

    if (this.skills().length === 0) {
      return;
    }

    if (this.selectedIndex() < 0) {
      this.selectedIndex.set(0);
    }

    this.progress.set(0);
    this.playing.set(true);

    this.timer = setInterval(() => {
      const next = this.progress() + 2.5;

      if (next >= 100) {
        this.nextTrack();
        return;
      }

      this.progress.set(next);
    }, 100);
  }

  protected previous(): void {
    this.pause();
    this.selectedIndex.set(Math.max(0, this.selectedIndex() - 1));
    this.progress.set(0);
  }

  protected next(): void {
    this.pause();
    this.selectedIndex.set(Math.min(this.skills().length - 1, this.selectedIndex() + 1));
    this.progress.set(0);
  }

  protected years(skill: Skill): number {
    return skill.years ?? skill.to - skill.from + 1;
  }

  ngOnDestroy(): void {
    this.pause();
  }

  private nextTrack(): void {
    const next = this.selectedIndex() + 1;

    if (next >= this.skills().length) {
      this.pause();
      this.progress.set(100);
      return;
    }

    this.selectedIndex.set(next);
    this.progress.set(0);
  }

  private pause(): void {
    this.playing.set(false);

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
