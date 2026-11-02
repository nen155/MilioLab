import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { I18nService } from '../../core/i18n';
import type { Skill } from '../skills/skills.component';

type ManaColor = 'W' | 'U' | 'B' | 'R' | 'G' | 'C';

/** Habilidades como encantamientos en un tapete de Magic. */
@Component({
  selector: 'app-playmat-skills',
  imports: [RouterLink],
  template: `
    <div class="playmat-skills">
      <nav class="playmat-mana" [attr.aria-label]="i18n.t('playmat.mana')">
        <a class="mana mana-w" routerLink="/"><span>W</span><small>{{ i18n.t('desktop.welcome') }}</small></a>
        <a class="mana mana-u" routerLink="/blog"><span>U</span><small>{{ i18n.t('desktop.blog') }}</small></a>
        <a class="mana mana-r" routerLink="/proyectos"><span>R</span><small>{{ i18n.t('desktop.projects') }}</small></a>
        <a class="mana mana-g" routerLink="/habilidades"><span>G</span><small>{{ i18n.t('desktop.skills') }}</small></a>
        <a class="mana mana-b" routerLink="/sobre-mi"><span>B</span><small>{{ i18n.t('desktop.about') }}</small></a>
        <a class="mana mana-c" routerLink="/contacto"><span>C</span><small>{{ i18n.t('desktop.contact') }}</small></a>
      </nav>

      <section class="playmat-zone zone-mana-filter">
        <span class="zone-title">{{ i18n.t('playmat.filter') }}</span>
        <div class="mana-filter">
          <button class="mana mana-w" type="button" [class.active]="filter() === 'W'" (click)="filter.set('W')"><span>W</span><small>Soft</small></button>
          <button class="mana mana-u" type="button" [class.active]="filter() === 'U'" (click)="filter.set('U')"><span>U</span><small>Backend</small></button>
          <button class="mana mana-b" type="button" [class.active]="filter() === 'B'" (click)="filter.set('B')"><span>B</span><small>Datos</small></button>
          <button class="mana mana-r" type="button" [class.active]="filter() === 'R'" (click)="filter.set('R')"><span>R</span><small>Frontend</small></button>
          <button class="mana mana-g" type="button" [class.active]="filter() === 'G'" (click)="filter.set('G')"><span>G</span><small>Móvil</small></button>
          <button class="mana mana-c" type="button" [class.active]="filter() === 'C'" (click)="filter.set('C')"><span>C</span><small>Herramientas</small></button>
          <button class="playmat-button" type="button" (click)="filter.set(null)">{{ i18n.t('desktop.all') }}</button>
        </div>
      </section>

      <section class="playmat-zone zone-battlefield">
        <span class="zone-title">{{ i18n.t('playmat.enchantments') }}</span>
        <div class="skill-field">
          @for (skill of visible(); track skill.name.es) {
            <button
              class="magic-card skill-magic"
              type="button"
              [class.selected]="selected()?.name?.es === skill.name.es"
              (click)="selected.set(skill)"
            >
              <header class="magic-name">
                <span>{{ i18n.pick(skill.name) }}</span>
                <span class="magic-cost">{{ years(skill) }}</span>
              </header>
              <div class="magic-art" [style.background]="skill.color">{{ skill.short }}</div>
              <p class="magic-type">{{ i18n.pick(skill.category) }} · {{ skill.from }}–{{ skill.to }}</p>
              <div class="magic-text">
                <p>{{ i18n.pick(skill.projects) }}</p>
              </div>
              <footer class="magic-stats">
                <span>{{ i18n.pick(skill.name) }}</span>
                <span>{{ skill.mode === 'ai' ? 'IA' : skill.mode === 'soft' ? 'Soft' : 'Código' }}</span>
              </footer>
            </button>
          }
        </div>
      </section>

      <aside class="life-counter">
        <span>{{ i18n.t('playmat.life') }}</span>
        <strong>{{ visible().length }}</strong>
        <small>{{ i18n.t('desktop.skills') }}</small>
      </aside>

      @if (selected(); as skill) {
        <section class="playmat-zone zone-detail">
          <span class="zone-title">{{ i18n.pick(skill.name) }}</span>
          <div class="detail-card">
            <p class="magic-type">{{ i18n.pick(skill.category) }} · {{ skill.from }}–{{ skill.to }} ({{ years(skill) }} {{ i18n.t('desktop.years') }})</p>
            <p><strong>{{ i18n.t('skills.projects') }}</strong> {{ i18n.pick(skill.projects) }}</p>
            @if (skill.note) {
              <p>{{ i18n.pick(skill.note) }}</p>
            }
          </div>
        </section>
      }
    </div>
  `,
})
export class PlaymatSkillsComponent {
  readonly skills = input.required<Skill[]>();

  protected readonly i18n = inject(I18nService);
  protected readonly filter = signal<ManaColor | null>(null);
  protected readonly selected = signal<Skill | null>(null);

  protected readonly visible = computed(() => {
    const color = this.filter();

    if (color === null) {
      return this.skills();
    }

    return this.skills().filter((skill) => this.colorOf(skill) === color);
  });

  protected years(skill: Skill): number {
    return skill.years ?? skill.to - skill.from + 1;
  }

  private colorOf(skill: Skill): ManaColor {
    const category = skill.category.es.toLowerCase();

    if (category.includes('backend')) return 'U';
    if (category.includes('frontend')) return 'R';
    if (category.includes('móvil') || category.includes('movil')) return 'G';
    if (category.includes('datos')) return 'B';
    if (category.includes('herramientas')) return 'C';

    return 'W';
  }
}
