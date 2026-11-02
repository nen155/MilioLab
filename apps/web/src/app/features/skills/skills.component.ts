import { Component, computed, effect, inject, signal } from '@angular/core';

import { absoluteUrl } from '../../core/format';
import { I18nService, Localized } from '../../core/i18n';
import { SeoService } from '../../core/seo.service';
import { DesktopSkillsComponent } from './desktop-skills.component';
import { PlaymatSkillsComponent } from './playmat-skills.component';

export type Mode = 'code' | 'soft' | 'ai';

export interface Skill {
  name: Localized;
  short: string;
  color: string;
  from: number;
  to: number;
  category: Localized;
  mode: Mode;
  projects: Localized;
  note?: Localized;
  years?: number;
}

const L = (es: string, en: string): Localized => ({ es, en });

const CATEGORIES = {
  backend: L('Backend', 'Backend'),
  frontend: L('Frontend', 'Frontend'),
  mobile: L('Móvil', 'Mobile'),
  data: L('Datos', 'Data'),
  tools: L('Herramientas', 'Tools'),
  soft: L('Soft', 'Soft'),
};

const START = 2013;
const END = 2026;

const SKILLS: Skill[] = [
  // --- Técnicas ------------------------------------------------------------
  { name: L('Java', 'Java'), short: 'JAVA', color: '#f89820', from: 2013, to: 2026, category: CATEGORIES.backend, mode: 'code', projects: L('SmartU (TFG), MeteoGalicia, GaliciaNomeada, INTECMAR', 'SmartU (TFG), MeteoGalicia, GaliciaNomeada, INTECMAR'), note: L('Desde 2024 el código nuevo lo genero con IA y lo reviso; antes lo escribía a mano.', 'Since 2024 I generate new code with AI and review it; before that I wrote it by hand.') },
  { name: L('Spring', 'Spring'), short: 'SPR', color: '#6db33f', from: 2022, to: 2026, category: CATEGORIES.backend, mode: 'code', projects: L('MeteoGalicia, GaliciaNomeada, Nomenclátor, INTECMAR, RubioCar', 'MeteoGalicia, GaliciaNomeada, Gazetteer, INTECMAR, RubioCar'), note: L('Trabajo real en producción desde 2022; desde 2024 con apoyo de IA para el código.', 'Real production work since 2022; since 2024 with AI support for code.') },
  { name: L('.NET / C#', '.NET / C#'), short: '.NET', color: '#512bd4', from: 2017, to: 2022, category: CATEGORIES.backend, mode: 'code', projects: L('Infowork (CRM, APIs, TPV), Importador de proveedores', 'Infowork (CRM, APIs, POS), Supplier importer'), note: L('Cinco años de desarrollo manual en Infowork.', 'Five years of manual development at Infowork.') },
  { name: L('NodeJS', 'NodeJS'), short: 'NODE', color: '#3c873a', from: 2018, to: 2022, category: CATEGORIES.backend, mode: 'code', projects: L('Infowork SGA', 'Infowork SGA'), note: L('Desarrollo manual durante el proyecto de almacén.', 'Manual development during the warehouse project.') },
  { name: L('GraphQL', 'GraphQL'), short: 'GQL', color: '#e10098', from: 2018, to: 2022, category: CATEGORIES.backend, mode: 'code', projects: L('Infowork SGA', 'Infowork SGA'), note: L('Diseño de esquema y consultas en el SGA.', 'Schema and query design in the SGA.') },
  { name: L('PHP', 'PHP'), short: 'PHP', color: '#777bb4', from: 2014, to: 2026, category: CATEGORIES.backend, mode: 'code', projects: L('Guia Pueblo, AlergiaStop, MilioLab', 'Guia Pueblo, AlergiaStop, MilioLab'), note: L('Freelance 2014–2017 a mano; MilioLab (2026) con IA.', 'Freelance 2014–2017 by hand; MilioLab (2026) with AI.') },
  { name: L('Laravel', 'Laravel'), short: 'LARA', color: '#ff2d20', from: 2014, to: 2026, category: CATEGORIES.backend, mode: 'code', projects: L('Guia Pueblo, MilioLab', 'Guia Pueblo, MilioLab'), note: L('Guia Pueblo a mano; MilioLab con IA + SDD.', 'Guia Pueblo by hand; MilioLab with AI + SDD.') },
  { name: L('SQL Server', 'SQL Server'), short: 'SQLS', color: '#cc2927', from: 2017, to: 2022, category: CATEGORIES.backend, mode: 'code', projects: L('Infowork, MeteoGalicia', 'Infowork, MeteoGalicia'), note: L('Modelado y consultas en el ERP y el SGA de Infowork y en MeteoGalicia.', 'Modelling and queries in the Infowork ERP and SGA and in MeteoGalicia.') },
  { name: L('MySQL / MariaDB', 'MySQL / MariaDB'), short: 'SQL', color: '#00758f', from: 2014, to: 2026, category: CATEGORIES.backend, mode: 'code', projects: L('Guia Pueblo, Cinema Decisive, MilioLab', 'Guia Pueblo, Cinema Decisive, MilioLab'), note: L('Uso continuo; esquemas recientes con IA y revisión manual.', 'Continuous use; recent schemas with AI and manual review.') },
  { name: L('Angular', 'Angular'), short: 'NG', color: '#dd0031', from: 2018, to: 2026, category: CATEGORIES.frontend, mode: 'code', projects: L('Infowork, IntView, Cinema Decisive, MilioLab, MeteoGalicia, Gestor del Nomenclátor', 'Infowork, IntView, Cinema Decisive, MilioLab, MeteoGalicia, Gazetteer Manager'), note: L('Desde 2024 las implementaciones nuevas son con generación de código por IA.', 'Since 2024 new implementations use AI code generation.') },
  { name: L('Ionic', 'Ionic'), short: 'ION', color: '#3880ff', from: 2018, to: 2022, category: CATEGORIES.mobile, mode: 'code', projects: L('Infowork SGA', 'Infowork SGA'), note: L('Desarrollo manual del SGA en Ionic 4.', 'Manual development of the SGA in Ionic 4.') },
  { name: L('Android', 'Android'), short: 'AND', color: '#3ddc84', from: 2014, to: 2017, category: CATEGORIES.mobile, mode: 'code', projects: L('Guia Pueblo, AlergiaStop, SmartU', 'Guia Pueblo, AlergiaStop, SmartU'), note: L('Tres apps publicadas, escritas a mano.', 'Three published apps, written by hand.') },
  { name: L('Python', 'Python'), short: 'PY', color: '#3776ab', from: 2020, to: 2026, category: CATEGORIES.data, mode: 'code', projects: L('Curso IA/ML, Cinema Decisive', 'AI/ML course, Cinema Decisive'), note: L('Aprendizaje 2020; Cinema Decisive (2023+) con IA.', 'Learning in 2020; Cinema Decisive (2023+) with AI.') },
  { name: L('OpenCV', 'OpenCV'), short: 'CV', color: '#5c3ee8', from: 2023, to: 2026, category: CATEGORIES.data, mode: 'code', projects: L('Cinema Decisive', 'Cinema Decisive'), note: L('Captura y detección en el runtime de sala.', 'Capture and detection in the venue runtime.') },
  { name: L('ONNX', 'ONNX'), short: 'ONNX', color: '#ee4c2c', from: 2025, to: 2026, category: CATEGORIES.data, mode: 'code', projects: L('MeteoGalicia, Cinema Decisive', 'MeteoGalicia, Cinema Decisive'), note: L('ONNX desde 2025 en MeteoGalicia y en Cinema Decisive, donde las primeras iteraciones usaron DeepFace.', 'ONNX since 2025 in MeteoGalicia and Cinema Decisive, where the first iterations used DeepFace.') },
  { name: L('PyTorch', 'PyTorch'), short: 'PT', color: '#f97316', from: 2020, to: 2020, category: CATEGORIES.data, mode: 'code', projects: L('Curso IA/ML', 'AI/ML course'), note: L('Solo en el curso de IA/ML (unos meses); no lo he usado en producción.', 'Only in the AI/ML course (a few months); I have not used it in production.') },
  { name: L('VLC / libVLC', 'VLC / libVLC'), short: 'VLC', color: '#ff8800', from: 2023, to: 2026, category: CATEGORIES.data, mode: 'code', projects: L('Cinema Decisive', 'Cinema Decisive'), note: L('Integración puntual para la reproducción de la sala.', 'Occasional integration for venue playback.') },
  { name: L('Docker', 'Docker'), short: 'DOCK', color: '#2496ed', from: 2023, to: 2026, category: CATEGORIES.tools, mode: 'ai', projects: L('Cinema Decisive, MilioLab', 'Cinema Decisive, MilioLab'), note: L('No es desarrollo propio continuo: genero los docker-compose con IA y los reviso. Uso real puntual desde 2023.', 'Not continuous development of my own: I generate the docker-compose files with AI and review them. Occasional real use since 2023.') },
  { name: L('Git', 'Git'), short: 'GIT', color: '#f05032', from: 2014, to: 2026, category: CATEGORIES.tools, mode: 'code', projects: L('Todos salvo GaliciaNomeada', 'All except GaliciaNomeada'), note: L('Uso diario con ramas y commits. Excepción: GaliciaNomeada, que trabaja con SVN.', 'Daily use with branches and commits. Exception: GaliciaNomeada, which works with SVN.') },
  // --- Trabajo con IA ------------------------------------------------------
  { name: L('Desarrollo con IA (SDD)', 'AI development (SDD)'), short: 'IA', color: '#a855f7', from: 2024, to: 2026, category: CATEGORIES.soft, mode: 'ai', projects: L('Cinema Decisive, MilioLab, Game-to-Web, RubioCar', 'Cinema Decisive, MilioLab, Game-to-Web, RubioCar'), note: L('Desde 2024 desarrollo con generación de código por IA. El análisis, la arquitectura y el stack los decido a mano y quedan especificados (SDD); la IA acelera la implementación y yo reviso, pruebo y mantengo.', 'Since 2024 I develop with AI code generation. I decide the analysis, architecture and stack by hand and they are specified (SDD); AI speeds up implementation and I review, test and maintain.') },
  // --- Soft skills ---------------------------------------------------------
  { name: L('Análisis de requisitos', 'Requirements analysis'), short: 'REQ', color: '#f59e0b', from: 2014, to: 2026, category: CATEGORIES.soft, mode: 'soft', projects: L('Todos los proyectos', 'All projects'), note: L('Lo he aplicado en todos mis proyectos: extraer requisitos con el cliente, convertirlos en historias y validarlos.', 'Applied in all my projects: extracting requirements with the client, turning them into stories and validating them.') },
  { name: L('Arquitectura de software', 'Software architecture'), short: 'ARQ', color: '#0ea5e9', from: 2017, to: 2026, category: CATEGORIES.soft, mode: 'soft', projects: L('Todos los proyectos propios, Gestor del Nomenclátor, MeteoGalicia, Infowork SGA, RubioCar', 'All own projects, Gazetteer Manager, MeteoGalicia, Infowork SGA, RubioCar'), note: L('Decisiones de arquitectura y stack, documentadas antes de implementar. Aplica a todos los proyectos que he creado y al Gestor del Nomenclátor.', 'Architecture and stack decisions, documented before implementation. Applies to all the projects I have created and to the Gazetteer Manager.') },
  { name: L('Comunicación con cliente', 'Client communication'), short: 'CLI', color: '#22c55e', from: 2014, to: 2026, category: CATEGORIES.soft, mode: 'soft', projects: L('Todos los proyectos', 'All projects'), note: L('En todos, como freelance y como contratado: contacto directo, reuniones y validación con el cliente.', 'In all of them, as a freelancer and as an employee: direct contact, meetings and validation with the client.') },
  { name: L('Mentoring', 'Mentoring'), short: 'MEN', color: '#ec4899', from: 2022, to: 2026, category: CATEGORIES.soft, mode: 'soft', projects: L('Sixtema, Infowork', 'Sixtema, Infowork'), note: L('Acompañar a compañeros que se incorporan y revisar su código.', 'Supporting colleagues who join and reviewing their code.') },
  { name: L('Tech Lead transversal', 'Cross-team Tech Lead'), short: 'TL', color: '#8b5cf6', from: 2024, to: 2026, category: CATEGORIES.soft, mode: 'soft', years: 2, projects: L('MeteoGalicia, GaliciaNomeada, Nomenclátor, INTECMAR, RubioCar', 'MeteoGalicia, GaliciaNomeada, Gazetteer, INTECMAR, RubioCar'), note: L('Llevo dos años ejerciendo como Tech Lead: coordino y doy soporte técnico a varios proyectos del equipo.', 'I have been working as Tech Lead for two years: I coordinate and provide technical support to several team projects.') },
  { name: L('Documentación técnica (SDD)', 'Technical documentation (SDD)'), short: 'DOC', color: '#64748b', from: 2017, to: 2026, category: CATEGORIES.soft, mode: 'soft', projects: L('Infowork, MeteoGalicia, MilioLab, Game-to-Web', 'Infowork, MeteoGalicia, MilioLab, Game-to-Web'), note: L('Especificaciones, modelo de datos, API y guías de despliegue para que otro pueda continuar.', 'Specifications, data model, API and deployment guides so someone else can continue.') },
  { name: L('Coordinación de equipo', 'Team coordination'), short: 'COO', color: '#14b8a6', from: 2022, to: 2026, category: CATEGORIES.soft, mode: 'soft', projects: L('MeteoGalicia, GaliciaNomeada, Resto de Sixtema', 'MeteoGalicia, GaliciaNomeada, Rest of Sixtema'), note: L('Planificación de intervenciones y entregas mensuales con SCRUM. En Infowork no coordinaba equipo.', 'Planning interventions and monthly deliveries with SCRUM. At Infowork I did not coordinate a team.') },
];

@Component({
  selector: 'app-skills',
  imports: [DesktopSkillsComponent, PlaymatSkillsComponent],
  template: `
    <app-desktop-skills [skills]="skills" />
    <app-playmat-skills [skills]="skills" />

    <div class="standard-page">
      <header class="article-head" style="margin-top: 2rem">
      <p class="kicker">{{ i18n.t('skills.kicker', { count: skills.length }) }}</p>
      <h1>{{ i18n.t('skills.title') }}</h1>
      <p class="lede">
        {{ i18n.t('skills.lede') }}
      </p>

      <div class="tl-card" style="margin-top: 1rem">
        <p style="margin: 0" class="mono" style="font-size:.72rem">
          <strong>{{ i18n.t('skills.honestyTitle') }}</strong> {{ i18n.t('skills.honestyBody') }}
        </p>
      </div>

      <div class="toolbar" style="margin-top: 1.2rem" role="group" [attr.aria-label]="i18n.t('skills.ariaOrder')">
        <span class="toolbar-label">{{ i18n.t('skills.order') }}</span>
        <button class="chip" type="button" [class.chip-active]="sort() === 'time'" (click)="sort.set('time')">{{ i18n.t('skills.time') }}</button>
        <button class="chip" type="button" [class.chip-active]="sort() === 'name'" (click)="sort.set('name')">{{ i18n.t('skills.name') }}</button>
        <button class="chip" type="button" [class.chip-active]="sort() === 'recent'" (click)="sort.set('recent')">{{ i18n.t('skills.recent') }}</button>
        <button class="chip" type="button" [class.chip-active]="sort() === 'category'" (click)="sort.set('category')">{{ i18n.t('skills.category') }}</button>
      </div>

      <div class="chips" style="margin-top: .8rem" role="group" [attr.aria-label]="i18n.t('skills.ariaFilter')">
        <span class="toolbar-label" style="align-self: center; margin-right: .3rem">{{ i18n.t('skills.type') }}</span>
        <button class="chip" type="button" [class.chip-active]="filter() === 'all'" (click)="filter.set('all')">{{ i18n.t('skills.all') }}</button>
        <button class="chip" type="button" [class.chip-active]="filter() === 'code'" (click)="filter.set('code')">{{ i18n.t('skills.code') }}</button>
        <button class="chip" type="button" [class.chip-active]="filter() === 'ai'" (click)="filter.set('ai')">{{ i18n.t('skills.ai') }}</button>
        <button class="chip" type="button" [class.chip-active]="filter() === 'soft'" (click)="filter.set('soft')">{{ i18n.t('skills.soft') }}</button>
      </div>
    </header>

    <section [attr.aria-label]="i18n.t('skills.ariaList')">
      <div class="skill-list">
        @for (skill of sorted(); track skill.name.es) {
          <div class="skill-wrap">
            <button
              class="skill"
              type="button"
              [attr.aria-expanded]="expanded() === skill.name.es"
              (click)="toggle(skill.name.es)"
            >
              <span class="skill-logo" [style.background]="skill.color" aria-hidden="true">{{ skill.short }}</span>
              <span class="skill-main">
                <span class="skill-name">{{ i18n.pick(skill.name) }}</span>
                <span class="skill-projects">{{ i18n.pick(skill.projects) }}</span>
              </span>
              <span class="skill-years">
                <strong>{{ years(skill) }}<small style="font-size:.55rem;font-family:var(--font-mono);letter-spacing:.08em"> {{ i18n.t('skills.years') }}</small></strong>
                <span class="mono">{{ skill.from }}–{{ skill.to }}</span>
              </span>
              <span class="skill-mode" [class.mode-soft]="skill.mode === 'soft'" [class.mode-ai]="skill.mode === 'ai'">
                {{ modeLabel(skill.mode) }}
              </span>
            </button>

            @if (expanded() === skill.name.es) {
              <div class="skill-detail">
                <p class="mono muted" style="margin:0 0 .4rem">
                  {{ i18n.t('skills.detail', { category: i18n.pick(skill.category), from: skill.from, to: skill.to, years: years(skill) }) }}
                </p>
                <p style="margin:0 0 .5rem"><strong>{{ i18n.t('skills.projects') }}</strong> {{ i18n.pick(skill.projects) }}</p>
                @if (skill.note) {
                  <p style="margin:0"><strong>{{ i18n.t('skills.used') }}</strong> {{ i18n.pick(skill.note) }}</p>
                }
              </div>
            }
          </div>
        }
      </div>
    </section>

    <section [attr.aria-label]="i18n.t('skills.ariaTimeline')" style="margin-top: 3rem">
      <div class="section-head">
        <h2>{{ i18n.t('skills.whenTitle') }}</h2>
        <span class="mono muted">{{ start }} – {{ end }}</span>
      </div>

      <div class="gantt" role="table" [attr.aria-label]="i18n.t('skills.ariaTimeline')" [style.--ai-pos]="markerPos() + '%'">
        <div class="gantt-axis" role="row">
          <span></span>
          <div class="gantt-years">
            @for (year of yearsList; track year) {
              <span class="mono">{{ year }}</span>
            }
            <span class="gantt-ai-label" [style.left.%]="markerPos()" [attr.title]="i18n.t('skills.aiMarkerTitle')">
              {{ i18n.t('skills.aiMarker') }}
            </span>
          </div>
        </div>

        @for (skill of technical(); track skill.name.es) {
          <div class="gantt-row" role="row">
            <span class="gantt-label">
              <span class="skill-dot" [style.background]="skill.color" aria-hidden="true"></span>
              {{ i18n.pick(skill.name) }}
            </span>
            <div class="gantt-track">
              <span class="gantt-bar" [style.left.%]="left(skill)" [style.width.%]="width(skill)" [style.background]="skill.color"
                    [attr.title]="i18n.t('skills.barTitle', { name: i18n.pick(skill.name), from: skill.from, to: skill.to, years: years(skill) })"></span>
            </div>
          </div>
        }
      </div>
    </section>
    </div>
  `,
})
export class SkillsComponent {
  protected readonly skills = SKILLS;
  protected readonly i18n = inject(I18nService);
  protected readonly sort = signal<'time' | 'name' | 'recent' | 'category'>('time');
  protected readonly filter = signal<'all' | Mode>('all');
  protected readonly expanded = signal<string | null>(null);
  protected readonly start = START;
  protected readonly end = END;
  protected readonly yearsList = Array.from({ length: END - START + 1 }, (_, i) => START + i);

  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      this.seo.set({
        title: `${this.i18n.t('skills.title')} · MilioLab`,
        description: this.i18n.t('skills.lede'),
        url: absoluteUrl('/habilidades'),
      });
    });
  }

  protected readonly technical = computed(() => SKILLS.filter((skill) => skill.mode !== 'soft'));

  /** Posición del marcador «IA» (2024) dentro de la línea de tiempo. */
  protected readonly markerPos = computed(() => ((2024 - START) / (END - START + 1)) * 100);

  protected readonly sorted = computed(() => {
    const filter = this.filter();
    const list = SKILLS.filter((skill) => filter === 'all' || skill.mode === filter);

    switch (this.sort()) {
      case 'name':
        return [...list].sort((a, b) => this.i18n.pick(a.name).localeCompare(this.i18n.pick(b.name)));
      case 'recent':
        return [...list].sort((a, b) => b.to - a.to || this.years(b) - this.years(a));
      case 'category':
        return [...list].sort((a, b) => a.category.es.localeCompare(b.category.es) || this.years(b) - this.years(a));
      default:
        return [...list].sort((a, b) => this.years(b) - this.years(a) || a.name.es.localeCompare(b.name.es));
    }
  });

  protected toggle(name: string): void {
    this.expanded.set(this.expanded() === name ? null : name);
  }

  protected modeLabel(mode: Mode): string {
    return this.i18n.t(`skills.mode.${mode}`);
  }

  protected years(skill: Skill): number {
    return skill.years ?? skill.to - skill.from + 1;
  }

  protected left(skill: Skill): number {
    return ((skill.from - START) / (END - START + 1)) * 100;
  }

  protected width(skill: Skill): number {
    return (this.years(skill) / (END - START + 1)) * 100;
  }
}
