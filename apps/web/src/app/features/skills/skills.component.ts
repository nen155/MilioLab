import { Component, computed, signal } from '@angular/core';

interface Skill {
  name: string;
  short: string;
  color: string;
  from: number;
  to: number;
  projects: string[];
  category: 'Backend' | 'Frontend' | 'Móvil' | 'Datos' | 'Herramientas';
}

const START = 2013;
const END = 2026;

const SKILLS: Skill[] = [
  { name: 'Java', short: 'JAVA', color: '#f89820', from: 2013, to: 2026, category: 'Backend', projects: ['SmartU', 'Meteogalicia'] },
  { name: 'Spring', short: 'SPR', color: '#6db33f', from: 2022, to: 2026, category: 'Backend', projects: ['Meteogalicia'] },
  { name: '.NET / C#', short: '.NET', color: '#512bd4', from: 2017, to: 2022, category: 'Backend', projects: ['Infowork (CRM, APIs, TPV)'] },
  { name: 'NodeJS', short: 'NODE', color: '#3c873a', from: 2018, to: 2022, category: 'Backend', projects: ['Infowork SGA'] },
  { name: 'GraphQL', short: 'GQL', color: '#e10098', from: 2018, to: 2022, category: 'Backend', projects: ['Infowork SGA'] },
  { name: 'PHP', short: 'PHP', color: '#777bb4', from: 2014, to: 2026, category: 'Backend', projects: ['Guia Pueblo', 'AlergiaStop', 'MilioLab'] },
  { name: 'Laravel', short: 'LARA', color: '#ff2d20', from: 2014, to: 2026, category: 'Backend', projects: ['Guia Pueblo', 'MilioLab'] },
  { name: 'SQL Server', short: 'SQLS', color: '#cc2927', from: 2017, to: 2022, category: 'Backend', projects: ['Infowork'] },
  { name: 'MySQL / MariaDB', short: 'SQL', color: '#00758f', from: 2014, to: 2026, category: 'Backend', projects: ['Guia Pueblo', 'Cinema Decisive', 'MilioLab'] },
  { name: 'Angular', short: 'NG', color: '#dd0031', from: 2018, to: 2026, category: 'Frontend', projects: ['Infowork', 'IntView', 'Cinema Decisive', 'MilioLab'] },
  { name: 'TypeScript', short: 'TS', color: '#3178c6', from: 2018, to: 2026, category: 'Frontend', projects: ['Infowork', 'IntView', 'MilioLab'] },
  { name: 'Ionic', short: 'ION', color: '#3880ff', from: 2018, to: 2022, category: 'Móvil', projects: ['Infowork SGA'] },
  { name: 'Android', short: 'AND', color: '#3ddc84', from: 2014, to: 2017, category: 'Móvil', projects: ['Guia Pueblo', 'AlergiaStop', 'SmartU'] },
  { name: 'Python', short: 'PY', color: '#3776ab', from: 2020, to: 2026, category: 'Datos', projects: ['Curso IA/ML', 'Cinema Decisive'] },
  { name: 'OpenCV', short: 'CV', color: '#5c3ee8', from: 2023, to: 2026, category: 'Datos', projects: ['Cinema Decisive'] },
  { name: 'ONNX / PyTorch', short: 'AI', color: '#ee4c2c', from: 2020, to: 2026, category: 'Datos', projects: ['Curso IA/ML', 'Cinema Decisive'] },
  { name: 'Docker', short: 'DOCK', color: '#2496ed', from: 2023, to: 2026, category: 'Herramientas', projects: ['Cinema Decisive', 'MilioLab'] },
  { name: 'Git', short: 'GIT', color: '#f05032', from: 2014, to: 2026, category: 'Herramientas', projects: ['Todos'] },
  { name: 'VLC / libVLC', short: 'VLC', color: '#ff8800', from: 2023, to: 2026, category: 'Datos', projects: ['Cinema Decisive'] },
];

@Component({
  selector: 'app-skills',
  template: `
    <header class="article-head" style="margin-top: 2rem">
      <p class="kicker">habilidades · {{ skills.length }} tecnologías</p>
      <h1>Stack y años de uso</h1>
      <p class="lede">
        Cada habilidad con su tiempo real de uso, sus proyectos y una línea de tiempo.
        Ordena con los botones: de mayor a menor tiempo, por nombre o por uso más reciente.
      </p>

      <div class="row" style="margin-top: 1.2rem" role="group" aria-label="Ordenar habilidades">
        <button class="chip" type="button" [class.chip-active]="sort() === 'time'" (click)="sort.set('time')">
          más tiempo
        </button>
        <button class="chip" type="button" [class.chip-active]="sort() === 'name'" (click)="sort.set('name')">
          nombre
        </button>
        <button class="chip" type="button" [class.chip-active]="sort() === 'recent'" (click)="sort.set('recent')">
          uso reciente
        </button>
        <button class="chip" type="button" [class.chip-active]="sort() === 'category'" (click)="sort.set('category')">
          área
        </button>
      </div>
    </header>

    <section aria-label="Listado de habilidades">
      <div class="skill-list">
        @for (skill of sorted(); track skill.name) {
          <article class="skill">
            <span class="skill-logo" [style.background]="skill.color" aria-hidden="true">{{ skill.short }}</span>
            <div class="skill-main">
              <h3>{{ skill.name }}</h3>
              <p class="skill-projects">{{ skill.projects.join(' · ') }}</p>
            </div>
            <div class="skill-years">
              <strong>{{ years(skill) }}</strong>
              <span class="mono">{{ skill.from }}–{{ skill.to }}</span>
            </div>
          </article>
        }
      </div>
    </section>

    <section aria-label="Línea de tiempo de habilidades" style="margin-top: 3rem">
      <div class="section-head">
        <h2>Cuándo he usado cada tecnología</h2>
        <span class="mono muted">{{ start }} – {{ end }}</span>
      </div>

      <div class="gantt" role="table" aria-label="Uso de cada tecnología por año">
        <div class="gantt-axis" role="row">
          <span></span>
          <div class="gantt-years">
            @for (year of yearsList; track year) {
              <span class="mono">{{ year }}</span>
            }
          </div>
        </div>

        @for (skill of sorted(); track skill.name) {
          <div class="gantt-row" role="row">
            <span class="gantt-label">
              <span class="skill-dot" [style.background]="skill.color" aria-hidden="true"></span>
              {{ skill.name }}
            </span>
            <div class="gantt-track">
              <span
                class="gantt-bar"
                [style.left.%]="left(skill)"
                [style.width.%]="width(skill)"
                [style.background]="skill.color"
                [attr.title]="skill.name + ': ' + skill.from + '–' + skill.to + ' (' + years(skill) + ')'"
              ></span>
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
  protected readonly start = START;
  protected readonly end = END;
  protected readonly yearsList = Array.from({ length: END - START + 1 }, (_, i) => START + i);

  protected readonly sorted = computed(() => {
    const list = [...SKILLS];

    switch (this.sort()) {
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'recent':
        return list.sort((a, b) => b.to - a.to || this.years(b) - this.years(a));
      case 'category':
        return list.sort((a, b) => a.category.localeCompare(b.category) || this.years(b) - this.years(a));
      default:
        return list.sort((a, b) => this.years(b) - this.years(a) || a.name.localeCompare(b.name));
    }
  });

  protected years(skill: Skill): number {
    return skill.to - skill.from + 1;
  }

  protected left(skill: Skill): number {
    return ((skill.from - START) / (END - START + 1)) * 100;
  }

  protected width(skill: Skill): number {
    return (this.years(skill) / (END - START + 1)) * 100;
  }
}
