import { Component, computed, signal } from '@angular/core';

interface Tech {
  name: string;
  short: string;
  color: string;
}

interface Project {
  name: string;
  from: number;
  to: number;
  period: string;
  kind: 'Propio' | 'Cliente' | 'Web';
  company?: { name: string; short: string; color: string };
  roles: string[];
  summary: string;
  tech: Tech[];
  link?: string;
}

const T = (name: string, short: string, color: string): Tech => ({ name, short, color });

const TECHS = {
  angular: T('Angular', 'NG', '#dd0031'),
  laravel: T('Laravel', 'LARA', '#ff2d20'),
  php: T('PHP', 'PHP', '#777bb4'),
  python: T('Python', 'PY', '#3776ab'),
  opencv: T('OpenCV', 'CV', '#5c3ee8'),
  onnx: T('ONNX', 'AI', '#ee4c2c'),
  vlc: T('VLC', 'VLC', '#ff8800'),
  dotnet: T('.NET', '.NET', '#512bd4'),
  node: T('NodeJS', 'NODE', '#3c873a'),
  graphql: T('GraphQL', 'GQL', '#e10098'),
  ionic: T('Ionic', 'ION', '#3880ff'),
  sqlserver: T('SQL Server', 'SQLS', '#cc2927'),
  mysql: T('MySQL', 'SQL', '#00758f'),
  java: T('Java', 'JAVA', '#f89820'),
  spring: T('Spring', 'SPR', '#6db33f'),
  android: T('Android', 'AND', '#3ddc84'),
  ts: T('TypeScript', 'TS', '#3178c6'),
  docker: T('Docker', 'DOCK', '#2496ed'),
  wordpress: T('WordPress', 'WP', '#21759b'),
  web: T('Web', 'WEB', '#64748b'),
};

const PROJECTS: Project[] = [
  {
    name: 'MilioLab', from: 2026, to: 2026, period: '2026 — actualidad', kind: 'Propio',
    roles: ['Producto', 'Diseño', 'Frontend', 'Backend', 'Despliegue'],
    summary: 'Este sitio. Lo monté porque WordPress no me dejaba controlar el diseño ni el HTML que publico: definí el modelo de contenido (páginas, entradas, medios, menús y ajustes), construí la API en Laravel con Sanctum y un editor propio, y separé la web pública del panel para que no cargue el editor. El despliegue en hosting compartido sin SSH obligó a escribir un script que empaqueta, sube y migra por HTTP.',
    tech: [TECHS.angular, TECHS.laravel, TECHS.php, TECHS.mysql, TECHS.docker],
    link: 'https://miliolab.com',
  },
  {
    name: 'Plugins de Jellyfin', from: 2026, to: 2026, period: 'noviembre 2026', kind: 'Propio',
    roles: ['Desarrollo', 'Diseño de plugins'],
    summary: 'Cinco plugins en C# para arreglar problemas concretos de mi biblioteca: portadas para carpetas de fotos, detección de contenido adulto, normalización de nombres para el scraper, filtrado de archivos no multimedia y limitación del tamaño de imagen servida. Cada uno vive en su repositorio y se publican juntos con un manifiesto.',
    tech: [TECHS.dotnet],
    link: 'https://github.com/nen155?tab=repositories',
  },
  {
    name: 'Cinema Decisive', from: 2023, to: 2026, period: 'abril 2023 — actualidad', kind: 'Propio',
    roles: ['Analista', 'Arquitecto', 'Backend Python', 'Frontend Angular', 'API Laravel', 'Despliegue'],
    summary: 'Un CMS de experiencias cinematográficas donde la siguiente escena la decide la emoción del público. Diseñé el árbol de escenas con transiciones por emoción y umbral, y un runtime en Python que captura con OpenCV, clasifica con un modelo ONNX y reproduce con VLC. Lo más difícil fue la latencia (medida por etapas), acoplar el vídeo a una ventana de escritorio y resolver los clips de YouTube con yt-dlp.',
    tech: [TECHS.python, TECHS.opencv, TECHS.onnx, TECHS.vlc, TECHS.angular, TECHS.laravel],
    link: 'https://github.com/nen155/cinema_decisive',
  },
  {
    name: 'Meteogalicia', from: 2022, to: 2026, period: 'mayo 2022 — actualidad', kind: 'Cliente',
    company: { name: 'Xunta de Galicia · Sixtema', short: 'XG', color: '#3b82f6' },
    roles: ['Analista', 'Programador', 'Mentoring'],
    summary: 'Renovación del portal meteorológico de la Xunta. Trabajo con SCRUM modificado y entregas mensuales en contacto directo con el cliente: traduzco requisitos a historias, decido partes de la arquitectura y programo el frontend en Angular 14 y el backend en Spring Java 11. También acompaño a compañeros que se incorporan al proyecto.',
    tech: [TECHS.java, TECHS.spring, TECHS.angular],
  },
  {
    name: 'IntView', from: 2021, to: 2021, period: 'octubre 2021', kind: 'Propio',
    roles: ['Fullstack', 'Producto'],
    summary: 'Herramienta para gestionar entrevistas no atendidas: el candidato se graba respondiendo y el evaluador revisa y puntúa desde el navegador. Monté el frontend en Angular y el flujo de grabación y revisión pensando en que el evaluador no tenga que instalar nada.',
    tech: [TECHS.ts, TECHS.angular],
    link: 'https://github.com/nen155/IntView',
  },
  {
    name: 'Infowork SGA', from: 2017, to: 2022, period: 'agosto 2017 — mayo 2022', kind: 'Cliente',
    company: { name: 'Infowork S.L.', short: 'IN', color: '#0ea5e9' },
    roles: ['Analista funcional', 'Arquitecto', 'Fullstack', 'Mentoring'],
    summary: 'Sistema de gestión de almacén para optimizar la operativa diaria. Empecé por los requisitos con los operarios, definí la arquitectura y desarrollé la app Ionic 4, el backend NodeJS con GraphQL y los servicios ASP.NET que hablaban con el ERP y con la máquina del TPV. También construí el importador de productos de proveedores y mantuve el CRM de escritorio en paralelo.',
    tech: [TECHS.ionic, TECHS.graphql, TECHS.node, TECHS.dotnet, TECHS.sqlserver],
  },
  {
    name: 'TFG · SmartU', from: 2017, to: 2017, period: '2017', kind: 'Propio',
    roles: ['Analista', 'Android', 'Backend PHP'],
    summary: 'Red social para Android con API REST en PHP (Slim) y back-office. Aprendí a diseñar una API pensando en el cliente móvil, a documentar lo que otros van a mantener y a cerrar un proyecto con fecha de entrega.',
    tech: [TECHS.android, TECHS.java, TECHS.php],
    link: 'https://github.com/nen155/TFG-SmartU-La-red-social',
  },
  {
    name: 'FarmaSearch y LearningMixingColors', from: 2017, to: 2017, period: 'marzo — julio 2017', kind: 'Propio',
    roles: ['Desarrollo', 'Diseño'],
    summary: 'Dos proyectos de la carrera: un buscador de farmacias cercanas con panel de administración y una app Ionic para mezclar colores pensada para niños con dificultades de aprendizaje. El primero me obligó a trabajar con geolocalización y datos abiertos; el segundo, a diseñar una interfaz muy simple y accesible.',
    tech: [TECHS.java, TECHS.ionic, TECHS.ts],
  },
  {
    name: 'AlergiaStop', from: 2014, to: 2017, period: 'octubre 2014 — mayo 2017', kind: 'Cliente',
    company: { name: 'Cliente · Granada', short: 'CL', color: '#a855f7' },
    roles: ['Requisitos', 'Arquitecto', 'Android', 'Publicación'],
    summary: 'App Android para aliviar síntomas de alergia con ejercicios de yoga. Trabajé directamente con el cliente para extraer requisitos poco definidos, tomé las decisiones de arquitectura con patrones de diseño, resolví la internacionalización a dos idiomas y publiqué en Google Play, manteniéndola durante tres años.',
    tech: [TECHS.android, TECHS.java],
  },
  {
    name: 'Guia Pueblo', from: 2014, to: 2015, period: 'octubre 2014 — junio 2015', kind: 'Cliente',
    company: { name: 'Cliente · Granada', short: 'CL', color: '#a855f7' },
    roles: ['Analista', 'Android', 'Laravel', 'Refactor'],
    summary: 'App para localizar comercios en pueblos pequeños, con gestión en Laravel y una API REST en PHP. Usé metodologías ágiles porque los requisitos eran difusos, integré al cliente en las decisiones y refactoricé código legacy para poder añadir funciones sin romper lo que ya funcionaba.',
    tech: [TECHS.android, TECHS.laravel, TECHS.php, TECHS.mysql],
  },
  {
    name: 'CinemaWEBTPV', from: 2008, to: 2008, period: 'mayo — junio 2008', kind: 'Propio',
    roles: ['Desarrollo'],
    summary: 'TPV para administrar el contenido de una sala de cine: cartelera, sesiones y venta de entradas. Fue mi primer proyecto con base de datos y el que me convenció de que quería dedicarme a esto.',
    tech: [TECHS.php, TECHS.mysql],
  },
  {
    name: 'Cold River Productions', from: 2019, to: 2019, period: 'cliente · online', kind: 'Web',
    company: { name: 'Cold River Productions', short: 'CR', color: '#38bdf8' },
    roles: ['Diseño', 'Desarrollo web'],
    summary: 'Web de producción audiovisual en Granada. La hice para un cliente, no es una empresa propia: maqueté el sitio, adapté el contenido a su marca y dejé el mantenimiento en sus manos.',
    tech: [TECHS.wordpress, TECHS.web],
    link: 'https://coldriverpro.com',
  },
  {
    name: 'La Biblioteca Zurana', from: 2020, to: 2020, period: 'online', kind: 'Web',
    company: { name: 'La Biblioteca Zurana', short: 'BZ', color: '#8b5cf6' },
    roles: ['Desarrollo web'],
    summary: 'Sitio del proyecto cultural La Biblioteca Zurana: estructura de contenidos, diseño y puesta en marcha. Sigue online.',
    tech: [TECHS.web],
    link: 'https://labibliotecazurana.com',
  },
  {
    name: 'Guia Pueblo (web)', from: 2015, to: 2015, period: 'online', kind: 'Web',
    company: { name: 'Guia Pueblo', short: 'GP', color: '#22c55e' },
    roles: ['Desarrollo web'],
    summary: 'Versión web de la guía de negocios locales: listado de comercios, fichas y buscador. Sigue online.',
    tech: [TECHS.php, TECHS.web],
    link: 'https://guiapueblo.es',
  },
  {
    name: 'Electrónica Raya', from: 2018, to: 2018, period: 'online', kind: 'Web',
    company: { name: 'Electrónica Raya', short: 'ER', color: '#f59e0b' },
    roles: ['Desarrollo web', 'eCommerce'],
    summary: 'Tienda de electrónica con catálogo y gestión de pedidos. Sigue online.',
    tech: [TECHS.web],
    link: 'https://www.electronicaraya.com',
  },
];

@Component({
  selector: 'app-projects',
  template: `
    <header class="article-head" style="margin-top: 2rem">
      <p class="kicker">proyectos · {{ projects.length }} registros</p>
      <h1>Trayectoria y proyectos</h1>
      <p class="lede">
        Cada proyecto con su periodo, el papel que tuve y las tecnologías. Puedes verlo como
        línea de tiempo o como fichas, ordenarlo y filtrarlo por tecnología.
      </p>

      <div class="row" style="margin-top: 1.2rem" role="group" aria-label="Vista">
        <button class="chip" type="button" [class.chip-active]="view() === 'timeline'" (click)="view.set('timeline')">
          línea de tiempo
        </button>
        <button class="chip" type="button" [class.chip-active]="view() === 'cards'" (click)="view.set('cards')">
          fichas
        </button>

        <span class="mono muted" style="margin-left: .6rem">orden</span>
        <select class="select" style="max-width: 170px" [value]="order()" (change)="order.set($any($event.target).value)">
          <option value="recent">más reciente</option>
          <option value="old">más antiguo</option>
          <option value="name">nombre</option>
        </select>
      </div>

      <div class="chips" style="margin-top: .9rem" role="group" aria-label="Filtrar por tecnología">
        <button class="chip" type="button" [class.chip-active]="techFilter() === null" (click)="techFilter.set(null)">
          todas
        </button>
        @for (tech of techs(); track tech.name) {
          <button
            class="chip"
            type="button"
            [class.chip-active]="techFilter() === tech.name"
            (click)="techFilter.set(tech.name)"
          >
            {{ tech.name }}
          </button>
        }
      </div>
    </header>

    @if (view() === 'timeline') {
      <div class="timeline">
        @for (project of visible(); track project.name) {
          <article class="tl-item" [class.current]="project.to === 2026">
            <span class="tl-date">{{ project.period }}</span>
            <div class="row" style="gap: .5rem; margin-top: .25rem">
              @if (project.company) {
                <span class="logo-badge" [style.background]="project.company.color">{{ project.company.short }}</span>
              }
              <h3 class="tl-title" style="margin: 0">{{ project.name }}</h3>
              <span class="chip">{{ project.kind }}</span>
            </div>
            @if (project.company) {
              <p class="tl-role">{{ project.company.name }}</p>
            }
            <p class="tl-body">{{ project.summary }}</p>
            <p class="tl-role" style="margin-top: .45rem">Rol: {{ project.roles.join(' · ') }}</p>
            <div class="tl-tags">
              @for (tech of project.tech; track tech.name) {
                <span class="tech-badge" [style.background]="tech.color" [attr.title]="tech.name">{{ tech.short }}</span>
              }
              @if (project.link) {
                <a class="mono" style="margin-left: .5rem" [href]="project.link" target="_blank" rel="noopener">ver →</a>
              }
            </div>
          </article>
        }
      </div>
    } @else {
      <div class="samples">
        @for (project of visible(); track project.name) {
          <article class="specimen" style="padding: 1rem">
            <div class="specimen-tag">
              <span class="specimen-id">{{ project.period }}</span>
              <span>{{ project.kind }}</span>
            </div>
            <div class="row" style="gap: .5rem; margin-bottom: .4rem">
              @if (project.company) {
                <span class="logo-badge" [style.background]="project.company.color">{{ project.company.short }}</span>
              }
              <h3 class="specimen-title" style="margin: 0">{{ project.name }}</h3>
            </div>
            @if (project.company) {
              <p class="mono muted" style="margin: 0 0 .5rem">{{ project.company.name }}</p>
            }
            <p class="specimen-excerpt">{{ project.summary }}</p>
            <p class="tl-role">Rol: {{ project.roles.join(' · ') }}</p>
            <div class="tl-tags">
              @for (tech of project.tech; track tech.name) {
                <span class="tech-badge" [style.background]="tech.color" [attr.title]="tech.name">{{ tech.short }}</span>
              }
            </div>
            @if (project.link) {
              <p style="margin: .6rem 0 0"><a class="mono" [href]="project.link" target="_blank" rel="noopener">ver proyecto →</a></p>
            }
          </article>
        }
      </div>
    }

    @if (visible().length === 0) {
      <p class="empty mono muted">No hay proyectos con esa tecnología.</p>
    }
  `,
})
export class ProjectsComponent {
  protected readonly projects = PROJECTS;
  protected readonly view = signal<'timeline' | 'cards'>('timeline');
  protected readonly order = signal<'recent' | 'old' | 'name'>('recent');
  protected readonly techFilter = signal<string | null>(null);

  protected readonly techs = computed(() => {
    const map = new Map<string, Tech>();
    PROJECTS.forEach((project) => project.tech.forEach((tech) => map.set(tech.name, tech)));

    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  });

  protected readonly visible = computed(() => {
    const filter = this.techFilter();
    const list = PROJECTS.filter((project) => !filter || project.tech.some((tech) => tech.name === filter));

    switch (this.order()) {
      case 'old':
        return [...list].sort((a, b) => a.from - b.from);
      case 'name':
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return [...list].sort((a, b) => b.from - a.from);
    }
  });
}
