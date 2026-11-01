import { Component, computed, signal } from '@angular/core';

type Mode = 'code' | 'soft' | 'ai';

interface Skill {
  name: string;
  short: string;
  color: string;
  from: number;
  to: number;
  category: 'Backend' | 'Frontend' | 'Móvil' | 'Datos' | 'Herramientas' | 'Soft';
  mode: Mode;
  projects: string[];
  note?: string;
  years?: number;
}

const START = 2013;
const END = 2026;

const SKILLS: Skill[] = [
  // --- Técnicas ------------------------------------------------------------
  { name: 'Java', short: 'JAVA', color: '#f89820', from: 2013, to: 2026, category: 'Backend', mode: 'code', projects: ['SmartU (TFG)', 'MeteoGalicia', 'GaliciaNomeada', 'INTECMAR'], note: 'Desde 2024 el código nuevo lo genero con IA y lo reviso; antes lo escribía a mano.' },
  { name: 'Spring', short: 'SPR', color: '#6db33f', from: 2022, to: 2026, category: 'Backend', mode: 'code', projects: ['MeteoGalicia', 'GaliciaNomeada', 'Nomenclátor', 'INTECMAR', 'RubioCar'], note: 'Trabajo real en producción desde 2022; desde 2024 con apoyo de IA para el código.' },
  { name: '.NET / C#', short: '.NET', color: '#512bd4', from: 2017, to: 2022, category: 'Backend', mode: 'code', projects: ['Infowork (CRM, APIs, TPV)', 'Importador de proveedores'], note: 'Cinco años de desarrollo manual en Infowork.' },
  { name: 'NodeJS', short: 'NODE', color: '#3c873a', from: 2018, to: 2022, category: 'Backend', mode: 'code', projects: ['Infowork SGA'], note: 'Desarrollo manual durante el proyecto de almacén.' },
  { name: 'GraphQL', short: 'GQL', color: '#e10098', from: 2018, to: 2022, category: 'Backend', mode: 'code', projects: ['Infowork SGA'], note: 'Diseño de esquema y consultas en el SGA.' },
  { name: 'PHP', short: 'PHP', color: '#777bb4', from: 2014, to: 2026, category: 'Backend', mode: 'code', projects: ['Guia Pueblo', 'AlergiaStop', 'MilioLab'], note: 'Freelance 2014–2017 a mano; MilioLab (2026) con IA.' },
  { name: 'Laravel', short: 'LARA', color: '#ff2d20', from: 2014, to: 2026, category: 'Backend', mode: 'code', projects: ['Guia Pueblo', 'MilioLab'], note: 'Guia Pueblo a mano; MilioLab con IA + SDD.' },
  { name: 'SQL Server', short: 'SQLS', color: '#cc2927', from: 2017, to: 2022, category: 'Backend', mode: 'code', projects: ['Infowork', 'MeteoGalicia'], note: 'Modelado y consultas en el ERP y el SGA de Infowork y en MeteoGalicia.' },
  { name: 'MySQL / MariaDB', short: 'SQL', color: '#00758f', from: 2014, to: 2026, category: 'Backend', mode: 'code', projects: ['Guia Pueblo', 'Cinema Decisive', 'MilioLab'], note: 'Uso continuo; esquemas recientes con IA y revisión manual.' },
  { name: 'Angular', short: 'NG', color: '#dd0031', from: 2018, to: 2026, category: 'Frontend', mode: 'code', projects: ['Infowork', 'IntView', 'Cinema Decisive', 'MilioLab', 'MeteoGalicia', 'Gestor del Nomenclátor'], note: 'Desde 2024 las implementaciones nuevas son con generación de código por IA.' },
  { name: 'Ionic', short: 'ION', color: '#3880ff', from: 2018, to: 2022, category: 'Móvil', mode: 'code', projects: ['Infowork SGA'], note: 'Desarrollo manual del SGA en Ionic 4.' },
  { name: 'Android', short: 'AND', color: '#3ddc84', from: 2014, to: 2017, category: 'Móvil', mode: 'code', projects: ['Guia Pueblo', 'AlergiaStop', 'SmartU'], note: 'Tres apps publicadas, escritas a mano.' },
  { name: 'Python', short: 'PY', color: '#3776ab', from: 2020, to: 2026, category: 'Datos', mode: 'code', projects: ['Curso IA/ML', 'Cinema Decisive'], note: 'Aprendizaje 2020; Cinema Decisive (2023+) con IA.' },
  { name: 'OpenCV', short: 'CV', color: '#5c3ee8', from: 2023, to: 2026, category: 'Datos', mode: 'code', projects: ['Cinema Decisive'], note: 'Captura y detección en el runtime de sala.' },
  { name: 'ONNX', short: 'ONNX', color: '#ee4c2c', from: 2025, to: 2026, category: 'Datos', mode: 'code', projects: ['MeteoGalicia', 'Cinema Decisive'], note: 'ONNX desde 2025 en MeteoGalicia y en Cinema Decisive, donde las primeras iteraciones usaron DeepFace.' },
  { name: 'PyTorch', short: 'PT', color: '#f97316', from: 2020, to: 2020, category: 'Datos', mode: 'code', projects: ['Curso IA/ML'], note: 'Solo en el curso de IA/ML (unos meses); no lo he usado en producción.' },
  { name: 'VLC / libVLC', short: 'VLC', color: '#ff8800', from: 2023, to: 2026, category: 'Datos', mode: 'code', projects: ['Cinema Decisive'], note: 'Integración puntual para la reproducción de la sala.' },
  { name: 'Docker', short: 'DOCK', color: '#2496ed', from: 2023, to: 2026, category: 'Herramientas', mode: 'ai', projects: ['Cinema Decisive', 'MilioLab'], note: 'No es desarrollo propio continuo: genero los docker-compose con IA y los reviso. Uso real puntual desde 2023.' },
  { name: 'Git', short: 'GIT', color: '#f05032', from: 2014, to: 2026, category: 'Herramientas', mode: 'code', projects: ['Todos salvo GaliciaNomeada'], note: 'Uso diario con ramas y commits. Excepción: GaliciaNomeada, que trabaja con SVN.' },
  // --- Trabajo con IA ------------------------------------------------------
  { name: 'Desarrollo con IA (SDD)', short: 'IA', color: '#a855f7', from: 2024, to: 2026, category: 'Soft', mode: 'ai', projects: ['Cinema Decisive', 'MilioLab', 'Game-to-Web', 'RubioCar'], note: 'Desde 2024 desarrollo con generación de código por IA. El análisis, la arquitectura y el stack los decido a mano y quedan especificados (SDD); la IA acelera la implementación y yo reviso, pruebo y mantengo.' },
  // --- Soft skills ---------------------------------------------------------
  { name: 'Análisis de requisitos', short: 'REQ', color: '#f59e0b', from: 2014, to: 2026, category: 'Soft', mode: 'soft', projects: ['Todos los proyectos'], note: 'Lo he aplicado en todos mis proyectos: extraer requisitos con el cliente, convertirlos en historias y validarlos.' },
  { name: 'Arquitectura de software', short: 'ARQ', color: '#0ea5e9', from: 2017, to: 2026, category: 'Soft', mode: 'soft', projects: ['Todos los proyectos propios', 'Gestor del Nomenclátor', 'MeteoGalicia', 'Infowork SGA', 'RubioCar'], note: 'Decisiones de arquitectura y stack, documentadas antes de implementar. Aplica a todos los proyectos que he creado y al Gestor del Nomenclátor.' },
  { name: 'Comunicación con cliente', short: 'CLI', color: '#22c55e', from: 2014, to: 2026, category: 'Soft', mode: 'soft', projects: ['Todos los proyectos'], note: 'En todos, como freelance y como contratado: contacto directo, reuniones y validación con el cliente.' },
  { name: 'Mentoring', short: 'MEN', color: '#ec4899', from: 2022, to: 2026, category: 'Soft', mode: 'soft', projects: ['Sixtema', 'Infowork'], note: 'Acompañar a compañeros que se incorporan y revisar su código.' },
  { name: 'Tech Lead transversal', short: 'TL', color: '#8b5cf6', from: 2024, to: 2026, category: 'Soft', mode: 'soft', years: 2, projects: ['MeteoGalicia', 'GaliciaNomeada', 'Nomenclátor', 'INTECMAR', 'RubioCar'], note: 'Llevo dos años ejerciendo como Tech Lead: coordino y doy soporte técnico a varios proyectos del equipo.' },
  { name: 'Documentación técnica (SDD)', short: 'DOC', color: '#64748b', from: 2017, to: 2026, category: 'Soft', mode: 'soft', projects: ['Infowork', 'MeteoGalicia', 'MilioLab', 'Game-to-Web'], note: 'Especificaciones, modelo de datos, API y guías de despliegue para que otro pueda continuar.' },
  { name: 'Coordinación de equipo', short: 'COO', color: '#14b8a6', from: 2022, to: 2026, category: 'Soft', mode: 'soft', projects: ['MeteoGalicia', 'GaliciaNomeada', 'Resto de Sixtema'], note: 'Planificación de intervenciones y entregas mensuales con SCRUM. En Infowork no coordinaba equipo.' },
];

@Component({
  selector: 'app-skills',
  template: `
    <header class="article-head" style="margin-top: 2rem">
      <p class="kicker">habilidades · {{ skills.length }} · técnicas, IA y soft skills</p>
      <h1>Stack, IA y soft skills</h1>
      <p class="lede">
        Cada habilidad con sus <strong>años</strong> de uso, sus proyectos y cómo se ha usado.
        Pulsa en cualquiera para ver el detalle.
      </p>

      <div class="tl-card" style="margin-top: 1rem">
        <p style="margin: 0" class="mono" style="font-size:.72rem">
          <strong>Honestidad sobre los tiempos.</strong> Desde <strong>2024</strong> las
          implementaciones y el desarrollo en frameworks y lenguajes se hacen con
          <strong>generación de código por IA</strong>: el tiempo indica cuándo empecé a usar la
          tecnología, no años de escritura manual. Hay habilidades (por ejemplo Docker) que solo
          uso de forma puntual generando los <em>docker-compose</em> con IA y revisándolos.
        </p>
      </div>

      <div class="toolbar" style="margin-top: 1.2rem" role="group" aria-label="Ordenar habilidades">
        <span class="toolbar-label">orden</span>
        <button class="chip" type="button" [class.chip-active]="sort() === 'time'" (click)="sort.set('time')">más tiempo</button>
        <button class="chip" type="button" [class.chip-active]="sort() === 'name'" (click)="sort.set('name')">nombre</button>
        <button class="chip" type="button" [class.chip-active]="sort() === 'recent'" (click)="sort.set('recent')">uso reciente</button>
        <button class="chip" type="button" [class.chip-active]="sort() === 'category'" (click)="sort.set('category')">área</button>
      </div>

      <div class="chips" style="margin-top: .8rem" role="group" aria-label="Filtrar por tipo">
        <span class="toolbar-label" style="align-self: center; margin-right: .3rem">tipo</span>
        <button class="chip" type="button" [class.chip-active]="filter() === 'all'" (click)="filter.set('all')">todas</button>
        <button class="chip" type="button" [class.chip-active]="filter() === 'code'" (click)="filter.set('code')">técnicas</button>
        <button class="chip" type="button" [class.chip-active]="filter() === 'ai'" (click)="filter.set('ai')">IA</button>
        <button class="chip" type="button" [class.chip-active]="filter() === 'soft'" (click)="filter.set('soft')">soft skills</button>
      </div>
    </header>

    <section aria-label="Listado de habilidades">
      <div class="skill-list">
        @for (skill of sorted(); track skill.name) {
          <div class="skill-wrap">
            <button
              class="skill"
              type="button"
              [attr.aria-expanded]="expanded() === skill.name"
              (click)="toggle(skill.name)"
            >
              <span class="skill-logo" [style.background]="skill.color" aria-hidden="true">{{ skill.short }}</span>
              <span class="skill-main">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-projects">{{ skill.projects.join(' · ') }}</span>
              </span>
              <span class="skill-years">
                <strong>{{ years(skill) }}<small style="font-size:.55rem;font-family:var(--font-mono);letter-spacing:.08em"> años</small></strong>
                <span class="mono">{{ skill.from }}–{{ skill.to }}</span>
              </span>
              <span class="skill-mode" [class.mode-soft]="skill.mode === 'soft'" [class.mode-ai]="skill.mode === 'ai'">
                {{ skill.mode === 'code' ? 'código' : skill.mode === 'ai' ? 'IA' : 'soft' }}
              </span>
            </button>

            @if (expanded() === skill.name) {
              <div class="skill-detail">
                <p class="mono muted" style="margin:0 0 .4rem">{{ skill.category }} · {{ skill.from }}–{{ skill.to }} ({{ years(skill) }} años)</p>
                <p style="margin:0 0 .5rem"><strong>Proyectos:</strong> {{ skill.projects.join(' · ') }}</p>
                @if (skill.note) {
                  <p style="margin:0"><strong>Cómo se ha usado:</strong> {{ skill.note }}</p>
                }
              </div>
            }
          </div>
        }
      </div>
    </section>

    <section aria-label="Línea de tiempo de habilidades técnicas" style="margin-top: 3rem">
      <div class="section-head">
        <h2>Cuándo he usado cada tecnología</h2>
        <span class="mono muted">{{ start }} – {{ end }}</span>
      </div>

      <div class="gantt" role="table" aria-label="Uso de cada tecnología por año" [style.--ai-pos]="markerPos() + '%'">
        <div class="gantt-axis" role="row">
          <span></span>
          <div class="gantt-years">
            @for (year of yearsList; track year) {
              <span class="mono">{{ year }}</span>
            }
            <span class="gantt-ai-label" [style.left.%]="markerPos()" title="Desde 2024 desarrollo con generación de código por IA (SDD)">
              Desarrollando con IA
            </span>
          </div>
        </div>

        @for (skill of technical(); track skill.name) {
          <div class="gantt-row" role="row">
            <span class="gantt-label">
              <span class="skill-dot" [style.background]="skill.color" aria-hidden="true"></span>
              {{ skill.name }}
            </span>
            <div class="gantt-track">
              <span class="gantt-bar" [style.left.%]="left(skill)" [style.width.%]="width(skill)" [style.background]="skill.color"
                    [attr.title]="skill.name + ': ' + skill.from + '–' + skill.to + ' (' + years(skill) + ' años)'"></span>
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class SkillsComponent {
  protected readonly skills = SKILLS;
  protected readonly sort = signal<'time' | 'name' | 'recent' | 'category'>('time');
  protected readonly filter = signal<'all' | Mode>('all');
  protected readonly expanded = signal<string | null>(null);
  protected readonly start = START;
  protected readonly end = END;
  protected readonly yearsList = Array.from({ length: END - START + 1 }, (_, i) => START + i);

  protected readonly technical = computed(() => SKILLS.filter((skill) => skill.mode !== 'soft'));

  /** Posición del marcador «IA» (2024) dentro de la línea de tiempo. */
  protected readonly markerPos = computed(() => ((2024 - START) / (END - START + 1)) * 100);

  protected readonly sorted = computed(() => {
    const filter = this.filter();
    const list = SKILLS.filter((skill) => filter === 'all' || skill.mode === filter);

    switch (this.sort()) {
      case 'name':
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case 'recent':
        return [...list].sort((a, b) => b.to - a.to || this.years(b) - this.years(a));
      case 'category':
        return [...list].sort((a, b) => a.category.localeCompare(b.category) || this.years(b) - this.years(a));
      default:
        return [...list].sort((a, b) => this.years(b) - this.years(a) || a.name.localeCompare(b.name));
    }
  });

  protected toggle(name: string): void {
    this.expanded.set(this.expanded() === name ? null : name);
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
