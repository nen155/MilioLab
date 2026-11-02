import { Component, computed, inject, input, signal } from '@angular/core';

import { DesktopService } from '../../core/desktop.service';
import { I18nService } from '../../core/i18n';
import type { Project } from '../projects/projects.component';
import { DesktopCalendarComponent } from './desktop-calendar.component';

/** Escritorio de proyectos: disquetes, disquetera, ventana de detalle y calendario. */
@Component({
  selector: 'app-desktop-projects',
  imports: [DesktopCalendarComponent],
  template: `
    <div class="desktop-projects">
      <section class="desktop-window projects-window">
        <header class="win-title">
          <span>{{ i18n.t('desktop.projectsWindow') }}</span>
          <span class="win-buttons" aria-hidden="true">_ □ ×</span>
        </header>

        <div class="win-toolbar">
          <span class="win-toolbar-label">{{ i18n.t('desktop.calendar') }}</span>
          <button class="win-button win-button-small" type="button" [class.active]="selectedYear() === null" (click)="selectedYear.set(null)">
            {{ i18n.t('desktop.all') }}
          </button>
          @if (selectedYear(); as year) {
            <span class="win-chip">{{ year }}</span>
          }
          <span class="win-toolbar-spacer"></span>
          <span class="win-toolbar-label">{{ visible().length }} {{ i18n.t('desktop.projectFile') }}</span>
        </div>

        <div class="win-body floppy-grid">
          @for (project of visible(); track project.name) {
            <button class="desktop-floppy project-floppy" type="button" (click)="open(project, $event)">
              <span class="floppy-shutter" aria-hidden="true"></span>
              <span class="floppy-label">
                <strong>{{ project.name }}</strong>
                <span class="floppy-meta">{{ i18n.pick(project.period) }} · {{ i18n.pick(project.kind) }}</span>
                <span class="floppy-excerpt">{{ i18n.pick(project.summary) }}</span>
              </span>
            </button>
          } @empty {
            <p class="win-empty">{{ i18n.t('desktop.noProjects') }}</p>
          }
        </div>
      </section>

      @if (selected(); as project) {
        <section class="desktop-window project-detail">
          <header class="win-title">
            <span>{{ project.name }}.exe</span>
            <button class="win-close" type="button" (click)="selected.set(null)" aria-label="Cerrar">×</button>
          </header>

          <div class="win-body">
            <p class="win-meta">{{ i18n.pick(project.period) }} · {{ i18n.pick(project.kind) }}</p>
            @if (project.company) {
              <p class="win-company">{{ i18n.pick(project.company.name) }}</p>
            }
            <p>{{ i18n.pick(project.summary) }}</p>
            <p><strong>{{ i18n.t('desktop.role') }}:</strong> {{ i18n.pick(project.roles) }}</p>

            <div class="win-tags">
              @for (tech of project.tech; track tech.name) {
                <span class="tech-badge" [style.background]="tech.color" [attr.title]="tech.name">{{ tech.short }}</span>
              }
            </div>

            @if (project.link) {
              <p class="win-actions">
                <a class="win-button" [href]="project.link" target="_blank" rel="noopener">{{ i18n.t('desktop.open') }}</a>
              </p>
            }
          </div>
        </section>
      }

      <app-desktop-calendar [projects]="projects()" (yearSelected)="selectedYear.set($event)" />
    </div>
  `,
})
export class DesktopProjectsComponent {
  readonly projects = input.required<Project[]>();

  protected readonly i18n = inject(I18nService);
  private readonly desktop = inject(DesktopService);

  protected readonly selected = signal<Project | null>(null);
  protected readonly selectedYear = signal<number | null>(null);

  protected readonly visible = computed(() => {
    const year = this.selectedYear();
    const list = [...this.projects()].sort((a, b) => b.from - a.from);

    return year === null
      ? list
      : list.filter((project) => year >= project.from && year <= project.to);
  });

  protected open(project: Project, event: Event): void {
    this.desktop.insert(event.currentTarget as HTMLElement, () => this.selected.set(project));
  }
}
