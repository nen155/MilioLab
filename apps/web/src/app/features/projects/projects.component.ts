import { Component, computed, effect, inject, signal } from '@angular/core';

import { absoluteUrl } from '../../core/format';
import { I18nService, Localized } from '../../core/i18n';
import { SeoService } from '../../core/seo.service';

interface Tech {
  name: string;
  short: string;
  color: string;
}

interface Project {
  name: string;
  from: number;
  to: number;
  period: Localized;
  kind: Localized;
  company?: { name: Localized; short: string; color: string };
  roles: Localized;
  summary: Localized;
  tech: Tech[];
  link?: string;
}

const L = (es: string, en: string): Localized => ({ es, en });

const KIND = {
  own: L('Propio', 'Own'),
  client: L('Cliente', 'Client'),
  web: L('Web', 'Web'),
};

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
  ai: T('IA', 'IA', '#a855f7'),
};

const PROJECTS: Project[] = [
  {
    name: 'MilioLab', from: 2026, to: 2026, period: L('2026 — actualidad', '2026 — present'), kind: KIND.own,
    roles: L('Producto · Diseño · Frontend · Backend · Despliegue', 'Product · Design · Frontend · Backend · Deployment'),
    summary: L(
      'Este sitio. Lo monté porque WordPress no me dejaba controlar el diseño ni el HTML que publico: definí el modelo de contenido (páginas, entradas, medios, menús y ajustes), construí la API en Laravel con Sanctum y un editor propio, y separé la web pública del panel para que no cargue el editor. El despliegue en hosting compartido sin SSH obligó a escribir un script que empaqueta, sube y migra por HTTP. Lo desarrollé con IA siguiendo SDD: especificación primero y decisiones de arquitectura tomadas a mano.',
      'This site. I built it because WordPress would not let me control the design or the HTML I publish: I defined the content model (pages, posts, media, menus and settings), built the Laravel API with Sanctum and a custom editor, and separated the public site from the panel so it does not load the editor. Deploying to shared hosting without SSH forced me to write a script that packages, uploads and migrates over HTTP. I developed it with AI following SDD: specification first and architecture decisions made by hand.',
    ),
    tech: [TECHS.angular, TECHS.laravel, TECHS.php, TECHS.mysql, TECHS.docker],
    link: 'https://miliolab.com',
  },
  {
    name: 'Plugins de Jellyfin', from: 2026, to: 2026, period: L('noviembre 2026', 'November 2026'), kind: KIND.own,
    roles: L('Desarrollo · Diseño de plugins', 'Development · Plugin design'),
    summary: L(
      'Cinco plugins en C# para arreglar problemas concretos de mi biblioteca: portadas para carpetas de fotos, detección de contenido adulto, normalización de nombres para el scraper, filtrado de archivos no multimedia y limitación del tamaño de imagen servida. Cada uno vive en su repositorio y se publican juntos con un manifiesto. Desarrollados con IA y especificación previa (SDD).',
      'Five C# plugins to fix specific problems in my library: covers for photo folders, adult content detection, name normalisation for the scraper, filtering non-media files and limiting the served image size. Each one lives in its own repository and they are published together with a manifest. Developed with AI and a previous specification (SDD).',
    ),
    tech: [TECHS.dotnet],
    link: 'https://github.com/nen155?tab=repositories',
  },
  {
    name: 'Game-to-Web', from: 2025, to: 2026, period: L('2025 — actualidad', '2025 — present'), kind: KIND.own,
    roles: L('Investigación · Documentación · Automatización · IA', 'Research · Documentation · Automation · AI'),
    summary: L(
      'Pipeline documentado para llevar cualquier juego a un clon jugable en el navegador reutilizando sus datos, arte y sonido. Cubre binarios nativos, código gestionado, juegos web, APK, imágenes de disco, instaladores y proyectos con fuentes, en trece fases (reconocimiento, extracción, decompilación, historias, stack, interfaz, implementación, verificación, cobertura, bugs, modelos, animaciones y HUDs). Está automatizado con un skill que ejecuta el proceso completo y deja plantillas para que el siguiente desarrollador pueda continuar.',
      'Documented pipeline to bring any game to a playable browser clone reusing its data, art and sound. It covers native binaries, managed code, web games, APKs, disk images, installers and projects with source code, across thirteen phases (reconnaissance, extraction, decompilation, stories, stack, interface, implementation, verification, coverage, bugs, models, animations and HUDs). It is automated with a skill that runs the whole process and leaves templates so the next developer can continue.',
    ),
    tech: [TECHS.ai, TECHS.web],
    link: 'https://github.com/nen155/game-to-web',
  },
  {
    name: 'Cinema Decisive', from: 2023, to: 2026, period: L('abril 2023 — actualidad', 'April 2023 — present'), kind: KIND.own,
    roles: L(
      'Analista · Arquitecto · Backend Python · Frontend Angular · API Laravel · Despliegue',
      'Analyst · Architect · Python backend · Angular frontend · Laravel API · Deployment',
    ),
    summary: L(
      'Un CMS de experiencias cinematográficas donde la siguiente escena la decide la emoción del público. Diseñé el árbol de escenas con transiciones por emoción y umbral, y un runtime en Python que captura con OpenCV, clasifica con un modelo ONNX y reproduce con VLC. Lo más difícil fue la latencia (medida por etapas), acoplar el vídeo a una ventana de escritorio y resolver los clips de YouTube con yt-dlp. El desarrollo se apoyó en IA con metodología SDD y revisión manual de cada decisión.',
      'A CMS for cinematic experiences where the audience emotions decide the next scene. I designed the scene tree with transitions by emotion and threshold, and a Python runtime that captures with OpenCV, classifies with an ONNX model and plays with VLC. The hardest parts were latency (measured per stage), coupling video to a desktop window and resolving YouTube clips with yt-dlp. Development relied on AI with SDD methodology and manual review of every decision.',
    ),
    tech: [TECHS.python, TECHS.opencv, TECHS.onnx, TECHS.vlc, TECHS.angular, TECHS.laravel],
    link: 'https://cinemadecisive.miliolab.com',
  },
  {
    name: 'MeteoGalicia', from: 2022, to: 2026, period: L('mayo 2022 — actualidad', 'May 2022 — present'), kind: KIND.client,
    company: { name: L('Xunta de Galicia · Sixtema', 'Xunta de Galicia · Sixtema'), short: 'XG', color: '#3b82f6' },
    roles: L('Tech Lead transversal · Analista · Programador · Mentoring', 'Cross-team Tech Lead · Analyst · Developer · Mentoring'),
    summary: L(
      'Renovación del portal meteorológico de la Xunta. Traduzco requisitos a historias, decido partes de la arquitectura y programo frontend en Angular 14 y backend en Spring Java 11, con SCRUM modificado y entregas mensuales en contacto directo con el cliente. Además del desarrollo, hago de Tech Lead transversal del resto de proyectos del equipo.',
      'Renovation of the Xunta weather portal. I translate requirements into stories, decide parts of the architecture and code the frontend in Angular 14 and the backend in Spring Java 11, with modified SCRUM and monthly deliveries in direct contact with the client. Besides development, I act as cross-team Tech Lead for the rest of the team projects.',
    ),
    tech: [TECHS.java, TECHS.spring, TECHS.angular],
  },
  {
    name: 'GaliciaNomeada', from: 2022, to: 2026, period: L('mayo 2022 — actualidad', 'May 2022 — present'), kind: KIND.client,
    company: { name: L('Real Academia Galega · Sixtema', 'Real Academia Galega · Sixtema'), short: 'RAG', color: '#16a34a' },
    roles: L('Tech Lead transversal · Mantenimiento · Nuevas funcionalidades', 'Cross-team Tech Lead · Maintenance · New features'),
    summary: L(
      'Mantenimiento y evolución del proyecto de toponimia de la Real Academia Galega: corrijo incidencias, mejoro el rendimiento de las consultas y desarrollo nuevas funcionalidades sobre el sistema existente, cuidando no romper lo que ya usan los investigadores.',
      'Maintenance and evolution of the Real Academia Galega toponymy project: I fix incidents, improve query performance and develop new features on the existing system, taking care not to break what researchers already use.',
    ),
    tech: [TECHS.java, TECHS.spring, TECHS.angular],
  },
  {
    name: 'Gestor del Nomenclátor de Galicia', from: 2022, to: 2026, period: L('mayo 2022 — actualidad', 'May 2022 — present'), kind: KIND.client,
    company: { name: L('Xunta de Galicia · Sixtema', 'Xunta de Galicia · Sixtema'), short: 'XG', color: '#3b82f6' },
    roles: L('Tech Lead transversal · Analista · Desarrollo', 'Cross-team Tech Lead · Analyst · Development'),
    summary: L(
      'Gestor interno para el nomenclátor oficial: altas, correcciones y publicación de topónimos. Participo en el análisis funcional, en el modelo de datos y en el desarrollo, y mantengo la integración con los sistemas de la Xunta.',
      'Internal manager for the official gazetteer: additions, corrections and publication of place names. I take part in functional analysis, the data model and development, and maintain the integration with the Xunta systems.',
    ),
    tech: [TECHS.java, TECHS.spring, TECHS.sqlserver],
  },
  {
    name: 'INTECMAR', from: 2022, to: 2026, period: L('mayo 2022 — actualidad', 'May 2022 — present'), kind: KIND.client,
    company: { name: L('INTECMAR · Sixtema', 'INTECMAR · Sixtema'), short: 'IT', color: '#0ea5e9' },
    roles: L('Tech Lead transversal · Coordinación · Mantenimiento', 'Cross-team Tech Lead · Coordination · Maintenance'),
    summary: L(
      'Coordinación y mantenimiento de los sistemas del Instituto Tecnológico para el Control del Medio Marino de Galicia: planifico las intervenciones, coordino al equipo y me aseguro de que las actualizaciones no afecten a la operativa diaria.',
      'Coordination and maintenance of the systems of the Technological Institute for the Control of the Marine Environment of Galicia: I plan interventions, coordinate the team and make sure updates do not affect daily operations.',
    ),
    tech: [TECHS.java, TECHS.spring, TECHS.angular],
  },
  {
    name: 'RubioCar', from: 2025, to: 2026, period: L('2025 — actualidad', '2025 — present'), kind: KIND.client,
    company: { name: L('RubioCar · Sixtema', 'RubioCar · Sixtema'), short: 'RC', color: '#f59e0b' },
    roles: L('Tech Lead transversal · Arquitecto · Desarrollo', 'Cross-team Tech Lead · Architect · Development'),
    summary: L(
      'Software nuevo para la gestión de flotas de autobuses: definí la arquitectura y el stack, escribí la especificación y desarrollo el producto con asistencia de IA siguiendo SDD, dejando pruebas y documentación para que el equipo pueda mantenerlo.',
      'New software for bus fleet management: I defined the architecture and stack, wrote the specification and develop the product with AI assistance following SDD, leaving tests and documentation so the team can maintain it.',
    ),
    tech: [TECHS.java, TECHS.spring, TECHS.angular],
  },
  {
    name: 'IntView', from: 2021, to: 2021, period: L('octubre 2021', 'October 2021'), kind: KIND.own,
    roles: L('Fullstack · Producto', 'Fullstack · Product'),
    summary: L(
      'Herramienta para gestionar entrevistas no atendidas: el candidato se graba respondiendo y el evaluador revisa y puntúa desde el navegador. Monté el frontend en Angular y el flujo de grabación y revisión pensando en que el evaluador no tenga que instalar nada.',
      'Tool to manage unattended interviews: the candidate records their answers and the evaluator reviews and scores them from the browser. I built the frontend in Angular and the recording and review flow so the evaluator does not have to install anything.',
    ),
    tech: [TECHS.ts, TECHS.angular],
    link: 'https://github.com/nen155/IntView',
  },
  {
    name: 'Infowork SGA', from: 2017, to: 2022, period: L('agosto 2017 — mayo 2022', 'August 2017 — May 2022'), kind: KIND.client,
    company: { name: L('Infowork S.L.', 'Infowork S.L.'), short: 'IN', color: '#0ea5e9' },
    roles: L('Analista funcional · Arquitecto · Fullstack · Mentoring', 'Functional analyst · Architect · Fullstack · Mentoring'),
    summary: L(
      'Sistema de gestión de almacén para optimizar la operativa diaria. Empecé por los requisitos con los operarios, definí la arquitectura y desarrollé la app Ionic 4, el backend NodeJS con GraphQL y los servicios ASP.NET que hablaban con el ERP y con la máquina del TPV. También construí el importador de productos de proveedores y mantuve el CRM de escritorio en paralelo.',
      'Warehouse management system to optimise daily operations. I started with requirements alongside the operators, defined the architecture and developed the Ionic 4 app, the NodeJS backend with GraphQL and the ASP.NET services that talked to the ERP and the POS machine. I also built the supplier product importer and maintained the desktop CRM in parallel.',
    ),
    tech: [TECHS.ionic, TECHS.graphql, TECHS.node, TECHS.dotnet, TECHS.sqlserver],
  },
  {
    name: 'TFG · SmartU', from: 2017, to: 2017, period: L('2017', '2017'), kind: KIND.own,
    roles: L('Analista · Android · Backend PHP', 'Analyst · Android · PHP backend'),
    summary: L(
      'Red social para Android con API REST en PHP (Slim) y back-office. Aprendí a diseñar una API pensando en el cliente móvil, a documentar lo que otros van a mantener y a cerrar un proyecto con fecha de entrega.',
      'Android social network with a REST API in PHP (Slim) and a back office. I learned to design an API with the mobile client in mind, to document what others will maintain and to close a project with a delivery date.',
    ),
    tech: [TECHS.android, TECHS.java, TECHS.php],
    link: 'https://github.com/nen155/TFG-SmartU-La-red-social',
  },
  {
    name: 'FarmaSearch y LearningMixingColors', from: 2017, to: 2017, period: L('marzo — julio 2017', 'March — July 2017'), kind: KIND.own,
    roles: L('Desarrollo · Diseño', 'Development · Design'),
    summary: L(
      'Dos proyectos de la carrera: un buscador de farmacias cercanas con panel de administración y una app Ionic para mezclar colores pensada para niños con dificultades de aprendizaje. El primero me obligó a trabajar con geolocalización y datos abiertos; el segundo, a diseñar una interfaz muy simple y accesible.',
      'Two university projects: a nearby pharmacy finder with an admin panel and an Ionic app to mix colours designed for children with learning difficulties. The first forced me to work with geolocation and open data; the second, to design a very simple and accessible interface.',
    ),
    tech: [TECHS.java, TECHS.ionic, TECHS.ts],
  },
  {
    name: 'AlergiaStop', from: 2014, to: 2017, period: L('octubre 2014 — mayo 2017', 'October 2014 — May 2017'), kind: KIND.client,
    company: { name: L('Cliente · Granada', 'Client · Granada'), short: 'CL', color: '#a855f7' },
    roles: L('Requisitos · Arquitecto · Android · Publicación', 'Requirements · Architect · Android · Publishing'),
    summary: L(
      'App Android para aliviar síntomas de alergia con ejercicios de yoga. Trabajé directamente con el cliente para extraer requisitos poco definidos, tomé las decisiones de arquitectura con patrones de diseño, resolví la internacionalización a dos idiomas y publiqué en Google Play, manteniéndola durante tres años.',
      'Android app to relieve allergy symptoms with yoga exercises. I worked directly with the client to extract loosely defined requirements, made architecture decisions with design patterns, solved two-language internationalisation and published it on Google Play, maintaining it for three years.',
    ),
    tech: [TECHS.android, TECHS.java],
  },
  {
    name: 'Guia Pueblo', from: 2014, to: 2015, period: L('octubre 2014 — junio 2015', 'October 2014 — June 2015'), kind: KIND.client,
    company: { name: L('Cliente · Granada', 'Client · Granada'), short: 'CL', color: '#a855f7' },
    roles: L('Analista · Android · Laravel · Refactor', 'Analyst · Android · Laravel · Refactor'),
    summary: L(
      'App para localizar comercios en pueblos pequeños, con gestión en Laravel y una API REST en PHP. Usé metodologías ágiles porque los requisitos eran difusos, integré al cliente en las decisiones y refactoricé código legacy para poder añadir funciones sin romper lo que ya funcionaba.',
      'App to find businesses in small villages, with management in Laravel and a REST API in PHP. I used agile methodologies because requirements were fuzzy, involved the client in decisions and refactored legacy code so features could be added without breaking what already worked.',
    ),
    tech: [TECHS.android, TECHS.laravel, TECHS.php, TECHS.mysql],
  },
  {
    name: 'CinemaWEBTPV', from: 2008, to: 2008, period: L('mayo — junio 2008', 'May — June 2008'), kind: KIND.own,
    roles: L('Desarrollo', 'Development'),
    summary: L(
      'TPV para administrar el contenido de una sala de cine: cartelera, sesiones y venta de entradas. Fue mi primer proyecto con base de datos y el que me convenció de que quería dedicarme a esto.',
      'POS to manage the content of a cinema: listings, showtimes and ticket sales. It was my first project with a database and the one that convinced me I wanted to do this for a living.',
    ),
    tech: [TECHS.php, TECHS.mysql],
  },
  {
    name: 'Cold River Productions', from: 2019, to: 2019, period: L('cliente · online', 'client · online'), kind: KIND.web,
    company: { name: L('Cold River Productions', 'Cold River Productions'), short: 'CR', color: '#38bdf8' },
    roles: L('Diseño · Desarrollo web', 'Design · Web development'),
    summary: L(
      'Web de producción audiovisual en Granada. La hice para un cliente, no es una empresa propia: maqueté el sitio, adapté el contenido a su marca y dejé el mantenimiento en sus manos.',
      'Audiovisual production website in Granada. I made it for a client, it is not my own company: I laid out the site, adapted the content to their brand and left maintenance in their hands.',
    ),
    tech: [TECHS.wordpress, TECHS.web],
    link: 'https://coldriverpro.com',
  },
  {
    name: 'La Biblioteca Zurana', from: 2020, to: 2020, period: L('online', 'online'), kind: KIND.web,
    company: { name: L('La Biblioteca Zurana', 'La Biblioteca Zurana'), short: 'BZ', color: '#8b5cf6' },
    roles: L('Desarrollo web', 'Web development'),
    summary: L(
      'Sitio del proyecto cultural La Biblioteca Zurana: estructura de contenidos, diseño y puesta en marcha. Sigue online.',
      'Website for the cultural project La Biblioteca Zurana: content structure, design and launch. It is still online.',
    ),
    tech: [TECHS.web],
    link: 'https://labibliotecazurana.com',
  },
  {
    name: 'Guia Pueblo (web)', from: 2015, to: 2015, period: L('online', 'online'), kind: KIND.web,
    company: { name: L('Guia Pueblo', 'Guia Pueblo'), short: 'GP', color: '#22c55e' },
    roles: L('Desarrollo web', 'Web development'),
    summary: L(
      'Versión web de la guía de negocios locales: listado de comercios, fichas y buscador. Sigue online.',
      'Web version of the local business guide: business listings, profiles and search. Still online.',
    ),
    tech: [TECHS.php, TECHS.web],
    link: 'https://guiapueblo.es',
  },
  {
    name: 'Electrónica Raya', from: 2018, to: 2018, period: L('online', 'online'), kind: KIND.web,
    company: { name: L('Electrónica Raya', 'Electrónica Raya'), short: 'ER', color: '#f59e0b' },
    roles: L('Desarrollo web · eCommerce', 'Web development · eCommerce'),
    summary: L(
      'Tienda de electrónica con catálogo y gestión de pedidos. Sigue online.',
      'Electronics shop with catalogue and order management. Still online.',
    ),
    tech: [TECHS.web],
    link: 'https://www.electronicaraya.com',
  },
];

@Component({
  selector: 'app-projects',
  template: `
    <header class="article-head" style="margin-top: 2rem">
      <p class="kicker">{{ i18n.t('projects.kicker', { count: projects.length }) }}</p>
      <h1>{{ i18n.t('projects.title') }}</h1>
      <p class="lede">
        {{ i18n.t('projects.lede') }}
      </p>
      <div class="tl-card" style="margin-top: 1.2rem">
        <p style="margin: 0"><strong>{{ i18n.t('projects.sddTitle') }}</strong> {{ i18n.t('projects.sddBody') }}</p>
      </div>

      <div class="toolbar">
        <div class="toolbar-group" role="group" [attr.aria-label]="i18n.t('projects.ariaView')">
          <span class="toolbar-label">{{ i18n.t('projects.view') }}</span>
          <button class="chip" type="button" [class.chip-active]="view() === 'timeline'" (click)="view.set('timeline')">
            {{ i18n.t('projects.timeline') }}
          </button>
          <button class="chip" type="button" [class.chip-active]="view() === 'cards'" (click)="view.set('cards')">
            {{ i18n.t('projects.cards') }}
          </button>
        </div>

        <div class="toolbar-group">
          <label class="toolbar-label" for="order">{{ i18n.t('projects.order') }}</label>
          <select id="order" class="select" [value]="order()" (change)="order.set($any($event.target).value)">
            <option value="recent">{{ i18n.t('projects.recent') }}</option>
            <option value="old">{{ i18n.t('projects.oldest') }}</option>
            <option value="name">{{ i18n.t('projects.name') }}</option>
          </select>
        </div>
      </div>

      <div class="chips" style="margin-top: 1rem" role="group" [attr.aria-label]="i18n.t('projects.ariaFilter')">
        <span class="toolbar-label" style="align-self: center; margin-right: .3rem">{{ i18n.t('projects.tech') }}</span>
        <button class="chip" type="button" [class.chip-active]="techFilter() === null" (click)="techFilter.set(null)">
          {{ i18n.t('projects.all') }}
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
            <span class="tl-date">{{ i18n.pick(project.period) }}</span>
            <div class="row" style="gap: .5rem; margin-top: .25rem">
              @if (project.company) {
                <span class="logo-badge" [style.background]="project.company.color">{{ project.company.short }}</span>
              }
              <h3 class="tl-title" style="margin: 0">{{ project.name }}</h3>
              <span class="chip">{{ i18n.pick(project.kind) }}</span>
            </div>
            @if (project.company) {
              <p class="tl-role">{{ i18n.pick(project.company.name) }}</p>
            }
            <p class="tl-body">{{ i18n.pick(project.summary) }}</p>
            <p class="tl-role" style="margin-top: .45rem">{{ i18n.t('projects.role') }} {{ i18n.pick(project.roles) }}</p>
            <div class="tl-tags">
              @for (tech of project.tech; track tech.name) {
                <span class="tech-badge" [style.background]="tech.color" [attr.title]="tech.name">{{ tech.short }}</span>
              }
              @if (project.link) {
                <a class="mono" style="margin-left: .5rem" [href]="project.link" target="_blank" rel="noopener">{{ i18n.t('projects.see') }}</a>
              }
            </div>
          </article>
        }
      </div>
    } @else {
      <div class="samples">
        @for (project of visible(); track project.name) {
          <article class="specimen project-card" style="padding: 1rem">
            <div class="specimen-tag">
              <span class="specimen-id">{{ i18n.pick(project.period) }}</span>
              <span>{{ i18n.pick(project.kind) }}</span>
            </div>
            <div class="row" style="gap: .5rem; margin-bottom: .4rem">
              @if (project.company) {
                <span class="logo-badge" [style.background]="project.company.color">{{ project.company.short }}</span>
              }
              <h3 class="specimen-title" style="margin: 0">{{ project.name }}</h3>
            </div>
            @if (project.company) {
              <p class="mono muted" style="margin: 0 0 .5rem">{{ i18n.pick(project.company.name) }}</p>
            }
            <p class="specimen-excerpt">{{ i18n.pick(project.summary) }}</p>
            <p class="tl-role">{{ i18n.t('projects.role') }} {{ i18n.pick(project.roles) }}</p>
            <div class="tl-tags">
              @for (tech of project.tech; track tech.name) {
                <span class="tech-badge" [style.background]="tech.color" [attr.title]="tech.name">{{ tech.short }}</span>
              }
            </div>
            @if (project.link) {
              <p style="margin: .6rem 0 0"><a class="mono" [href]="project.link" target="_blank" rel="noopener">{{ i18n.t('projects.seeProject') }}</a></p>
            }
          </article>
        }
      </div>
    }

    @if (visible().length === 0) {
      <p class="empty mono muted">{{ i18n.t('projects.empty') }}</p>
    }
  `,
})
export class ProjectsComponent {
  protected readonly projects = PROJECTS;
  protected readonly i18n = inject(I18nService);
  protected readonly view = signal<'timeline' | 'cards'>('timeline');
  protected readonly order = signal<'recent' | 'old' | 'name'>('recent');
  protected readonly techFilter = signal<string | null>(null);

  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      this.seo.set({
        title: `${this.i18n.t('projects.title')} · MilioLab`,
        description: this.i18n.t('projects.lede'),
        url: absoluteUrl('/proyectos'),
      });
    });
  }

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
