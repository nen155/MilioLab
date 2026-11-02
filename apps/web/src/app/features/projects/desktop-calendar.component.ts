import { Component, computed, inject, input, output, signal } from '@angular/core';

import { I18nService } from '../../core/i18n';
import type { Project } from '../projects/projects.component';

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

/** Calendario de escritorio: una fila por año y doce celdas por mes. */
@Component({
  selector: 'app-desktop-calendar',
  template: `
    <section class="desktop-window calendar-window">
      <header class="win-title">
        <span>{{ i18n.t('desktop.calendar') }}</span>
        <span class="win-buttons" aria-hidden="true">_ □ ×</span>
      </header>

      <div class="win-body calendar-body">
        <div class="calendar-head">
          <span class="calendar-corner"></span>
          @for (month of months; track month) {
            <span class="calendar-month-label">{{ month }}</span>
          }
        </div>

        @for (year of years(); track year) {
          <div class="calendar-year" [class.selected]="selectedYear() === year">
            <button class="calendar-year-label" type="button" (click)="pickYear(year)">
              {{ year }}
            </button>
            @for (month of months; track month; let index = $index) {
              <button
                class="calendar-cell"
                type="button"
                [attr.title]="projectsIn(year, index).map(project => project.name).join(' · ')"
                (click)="pickYear(year)"
              >
                @for (project of projectsIn(year, index).slice(0, 3); track project.name) {
                  <span class="calendar-bar" [style.background]="color(project)"></span>
                }
                @if (projectsIn(year, index).length > 3) {
                  <span class="calendar-more">+{{ projectsIn(year, index).length - 3 }}</span>
                }
              </button>
            }
          </div>
        }

        <div class="calendar-key">
          @for (project of projects(); track project.name) {
            <span class="calendar-key-item">
              <i [style.background]="color(project)"></i>{{ project.name }}
            </span>
          }
        </div>

        <p class="calendar-legend">
          <span class="calendar-swatch"></span>
          {{ i18n.t('desktop.projects') }}
        </p>
      </div>
    </section>
  `,
})
export class DesktopCalendarComponent {
  readonly projects = input.required<Project[]>();
  readonly yearSelected = output<number>();

  protected readonly i18n = inject(I18nService);
  protected readonly months = MONTHS;
  protected readonly selectedYear = signal<number | null>(null);

  protected readonly years = computed(() => {
    const list = this.projects();

    if (list.length === 0) {
      return [new Date().getFullYear()];
    }

    const from = Math.min(...list.map((project) => project.from));
    const to = Math.max(...list.map((project) => project.to));

    return Array.from({ length: to - from + 1 }, (_, index) => from + index);
  });

  protected projectsIn(year: number, month: number): Project[] {
    const point = year * 12 + month;

    return this.projects().filter(
      (project) => point >= project.from * 12 && point <= project.to * 12 + 11,
    );
  }

  protected color(project: Project): string {
    if (project.company?.color) {
      return project.company.color;
    }

    const colors = ['#000080', '#008000', '#800000', '#808000', '#0000ff', '#800080'];

    return colors[project.name.length % colors.length];
  }

  protected pickYear(year: number): void {
    this.selectedYear.set(year);
    this.yearSelected.emit(year);
  }
}
