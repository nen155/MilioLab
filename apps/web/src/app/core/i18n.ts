import { Injectable, computed, signal } from '@angular/core';

export type Locale = 'es' | 'en';

export interface Localized {
  es: string;
  en: string;
}

type Dict = Record<string, { es: string; en: string }>;

const STORAGE_KEY = 'miliolab.lang';

const STRINGS: Dict = {
  'common.skip': { es: 'Saltar al contenido', en: 'Skip to content' },
  'common.language': { es: 'Idioma', en: 'Language' },
  'common.min': { es: 'min', en: 'min' },

  'nav.index': { es: 'índice', en: 'index' },
  'nav.search': { es: 'buscar', en: 'search' },
  'nav.searchPlaceholder': { es: 'término…', en: 'term…' },

  'rail.aria': { es: 'Datos del proyecto', en: 'Project data' },
  'rail.subtitle': { es: 'ingeniería de software', en: 'software engineering' },
  'rail.project': { es: 'proyecto', en: 'project' },
  'rail.status': { es: 'estado', en: 'status' },
  'rail.open': { es: 'abierto', en: 'open' },
  'rail.author': { es: 'autor', en: 'author' },
  'rail.method': { es: 'método', en: 'method' },
  'rail.methodValue': { es: 'SDD + IA', en: 'SDD + AI' },
  'rail.record': { es: 'registro', en: 'record' },
  'rail.type': { es: 'ingeniero de software · inventor', en: 'software engineer · inventor' },
  'rail.online': { es: 'en línea', en: 'online' },

  'desktop.myComputer': { es: 'Mi PC', en: 'My Computer' },
  'desktop.projects': { es: 'Proyectos', en: 'Projects' },
  'desktop.skills': { es: 'Habilidades', en: 'Skills' },
  'desktop.blog': { es: 'Blog', en: 'Blog' },
  'desktop.about': { es: 'Sobre mí', en: 'About me' },
  'desktop.contact': { es: 'Contacto', en: 'Contact' },
  'desktop.welcome': { es: 'Bienvenido', en: 'Welcome' },
  'desktop.documents': { es: 'Mis documentos', en: 'My documents' },
  'desktop.calendar': { es: 'Calendario', en: 'Calendar' },
  'desktop.projectsWindow': { es: 'Proyectos', en: 'Projects' },
  'desktop.skillsWindow': { es: 'Habilidades', en: 'Skills' },
  'desktop.player': { es: 'Reproductor multimedia', en: 'Media Player' },
  'desktop.play': { es: 'Reproducir', en: 'Play' },
  'desktop.pause': { es: 'Pausa', en: 'Pause' },
  'desktop.open': { es: 'Abrir', en: 'Open' },
  'desktop.role': { es: 'Rol', en: 'Role' },
  'desktop.tech': { es: 'Tecnologías', en: 'Technologies' },
  'desktop.years': { es: 'años', en: 'years' },
  'desktop.noProjects': { es: 'No hay proyectos en este año.', en: 'No projects in this year.' },
  'desktop.all': { es: 'Todos', en: 'All' },
  'desktop.insert': { es: 'Insertar disco', en: 'Insert disk' },
  'desktop.system': { es: 'Propiedades del sistema', en: 'System properties' },
  'desktop.start': { es: 'Inicio', en: 'Start' },
  'desktop.desktop': { es: 'Escritorio', en: 'Desktop' },
  'desktop.keyboard': { es: 'Teclado', en: 'Keyboard' },
  'desktop.notes': { es: 'Notas', en: 'Notes' },
  'desktop.floppy': { es: 'Disco de 3,5"', en: '3.5" floppy' },
  'desktop.projectFile': { es: 'proyecto', en: 'project' },
  'desktop.skillFile': { es: 'habilidad', en: 'skill' },
  'desktop.document': { es: 'documento', en: 'document' },
  'desktop.mailTitle': { es: 'Correo - Outlook Express', en: 'Mail - Outlook Express' },
  'desktop.inbox': { es: 'Bandeja de entrada', en: 'Inbox' },
  'desktop.sent': { es: 'Elementos enviados', en: 'Sent items' },
  'desktop.deleted': { es: 'Elementos eliminados', en: 'Deleted items' },
  'desktop.contacts': { es: 'Contactos', en: 'Contacts' },
  'desktop.newMessage': { es: 'Nuevo mensaje', en: 'New message' },
  'desktop.reply': { es: 'Responder', en: 'Reply' },
  'desktop.forward': { es: 'Reenviar', en: 'Forward' },
  'desktop.sendReceive': { es: 'Enviar y recibir', en: 'Send and receive' },
  'desktop.to': { es: 'Para', en: 'To' },
  'desktop.subject': { es: 'Asunto', en: 'Subject' },
  'desktop.send': { es: 'Enviar', en: 'Send' },
  'desktop.from': { es: 'De', en: 'From' },
  'desktop.message': { es: 'Mensaje', en: 'Message' },
  'desktop.preview': { es: 'Vista previa', en: 'Preview' },
  'desktop.aboutTitle': { es: 'Sobre mí.doc - WordPad', en: 'About me.doc - WordPad' },
  'desktop.startMenu': { es: 'Menú Inicio', en: 'Start menu' },
  'desktop.programs': { es: 'Programas', en: 'Programs' },
  'desktop.settings': { es: 'Configuración', en: 'Settings' },
  'desktop.find': { es: 'Buscar', en: 'Find' },
  'desktop.help': { es: 'Ayuda', en: 'Help' },
  'desktop.run': { es: 'Ejecutar...', en: 'Run...' },
  'desktop.shutdown': { es: 'Apagar el sistema...', en: 'Shut down...' },
  'desktop.clock': { es: 'Reloj', en: 'Clock' },
  'desktop.today': { es: 'Hoy', en: 'Today' },
  'desktop.nowPlaying': { es: 'Reproduciendo ahora', en: 'Now playing' },
  'desktop.playlist': { es: 'Lista de reproducción', en: 'Playlist' },
  'desktop.selectTrack': { es: 'Selecciona una habilidad de la lista.', en: 'Select a skill from the list.' },
  'desktop.track': { es: 'Pista', en: 'Track' },
  'desktop.noSelection': { es: 'Sin selección', en: 'No selection' },
  'desktop.previous': { es: 'Anterior', en: 'Previous' },
  'desktop.next': { es: 'Siguiente', en: 'Next' },
  'desktop.me': { es: 'yo', en: 'me' },

  'theme.try': { es: 'Prueba mis diseños', en: 'Try my designs' },
  'theme.title': { es: 'Prueba mis diseños', en: 'Try my designs' },
  'theme.subtitle': { es: 'Elige un tema para verlo al instante. Al recargar vuelve el tema del backoffice.', en: 'Pick a theme to preview it instantly. Reloading restores the backoffice theme.' },
  'theme.current': { es: 'Tema actual', en: 'Current theme' },
  'theme.default': { es: 'Tema del backoffice', en: 'Backoffice theme' },
  'theme.reset': { es: 'Volver al tema del backoffice', en: 'Back to backoffice theme' },
  'theme.apply': { es: 'Probar', en: 'Try' },
  'theme.close': { es: 'Cerrar', en: 'Close' },

  'playmat.library': { es: 'Biblioteca', en: 'Library' },
  'playmat.drawProject': { es: 'Roba un proyecto', en: 'Draw a project' },
  'playmat.battlefield': { es: 'Campo de batalla', en: 'Battlefield' },
  'playmat.graveyard': { es: 'Cementerio', en: 'Graveyard' },
  'playmat.archive': { es: 'Archivo de entradas', en: 'Post archive' },
  'playmat.enchantments': { es: 'Encantamientos', en: 'Enchantments' },
  'playmat.skillsHint': { es: 'Habilidades en el campo', en: 'Skills on the field' },
  'playmat.message': { es: 'Mensaje', en: 'Message' },
  'playmat.contactHint': { es: 'Envía un mensaje', en: 'Send a message' },
  'playmat.life': { es: 'Vida', en: 'Life' },
  'playmat.years': { es: 'años de experiencia', en: 'years of experience' },
  'playmat.hand': { es: 'Mano', en: 'Hand' },
  'playmat.draw': { es: 'Robar', en: 'Draw' },
  'playmat.discard': { es: 'Al cementerio', en: 'To graveyard' },
  'playmat.allProjects': { es: 'Todos los proyectos', en: 'All projects' },
  'playmat.mana': { es: 'Símbolos de maná', en: 'Mana symbols' },
  'playmat.filter': { es: 'Filtrar por color', en: 'Filter by color' },
  'playmat.skillCard': { es: 'Habilidad', en: 'Skill' },
  'playmat.projectCard': { es: 'Proyecto', en: 'Project' },
  'playmat.contactTitle': { es: 'Mensaje', en: 'Message' },
  'playmat.aboutTitle': { es: 'Planeswalker — Emilio', en: 'Planeswalker — Emilio' },
  'playmat.sideboard': { es: 'Sideboard', en: 'Sideboard' },

  'header.homeAria': { es: 'MilioLab, inicio', en: 'MilioLab, home' },
  'header.mainNav': { es: 'Principal', en: 'Main' },

  'home.kicker': { es: 'cuaderno de laboratorio', en: 'lab notebook' },
  'home.cta': { es: 'Abrir el cuaderno', en: 'Open the notebook' },
  'home.text': { es: 'Versión texto', en: 'Text version' },
  'home.latest': { es: 'Últimas muestras', en: 'Latest samples' },
  'home.all': { es: 'todas →', en: 'all →' },
  'home.nodes': { es: 'Mapa de nodos', en: 'Node map' },
  'home.lede': {
    es: 'Desarrollo web, producto y experimentos que aún no tienen nombre. Escribo lo que pruebo y publico lo que funciona.',
    en: 'Web development, product and experiments that do not have a name yet. I write what I test and publish what works.',
  },
  'home.asideAria': { es: 'Notas de la libreta', en: 'Notebook notes' },
  'home.method': { es: 'método', en: 'method' },
  'home.observation': { es: 'observación', en: 'observation' },
  'home.methodNote': { es: 'Escribir, medir, corregir. Sin plantillas.', en: 'Write, measure, correct. No templates.' },
  'home.samples': { es: 'muestras', en: 'samples' },
  'home.samplesNote': {
    es: 'Cada entrada es un experimento con fecha y número.',
    en: 'Every post is an experiment with a date and a number.',
  },
  'home.residue': { es: 'residuo', en: 'residue' },
  'home.residueNote': { es: 'Sin cookies, sin analítica, sin rastreadores.', en: 'No cookies, no analytics, no trackers.' },
  'home.recentCount': { es: '{count} recientes', en: '{count} recent' },
  'home.none': { es: 'ninguno', en: 'none' },
  'home.nodesHint': { es: 'recorre los nodos con las flechas ← →', en: 'walk the nodes with ← →' },
  'home.observations': { es: 'Registro de observaciones', en: 'Observation log' },
  'home.obs1': {
    es: 'El diseño no necesita sombras para tener profundidad.',
    en: 'Design does not need shadows to have depth.',
  },
  'home.obs2a': { es: 'hay una sala de experimentos', en: 'there is an experiment room' },
  'home.obs2b': { es: 'escondida en esta página.', en: 'hidden on this page.' },
  'home.obs2Note': { es: 'Shift + L, o «experimentos» en el pie.', en: 'Shift + L, or “experiments” in the footer.' },
  'home.obs3': {
    es: 'Todo lo que lees se puede leer sin JavaScript en',
    en: 'Everything you read can be read without JavaScript at',
  },
  'home.noSamples': { es: 'Todavía no hay muestras registradas.', en: 'No samples registered yet.' },

  'blog.index': { es: 'índice de muestras', en: 'sample index' },
  'blog.all': { es: 'todas', en: 'all' },
  'blog.prev': { es: '← anterior', en: '← previous' },
  'blog.next': { es: 'siguiente →', en: 'next →' },
  'blog.empty': { es: 'Sin muestras', en: 'No samples' },
  'blog.records': { es: 'registros', en: 'records' },
  'blog.record': { es: 'registro', en: 'record' },
  'blog.pageOf': { es: 'página {page} de {last}', en: 'page {page} of {last}' },
  'blog.pageSlash': { es: 'página {page} / {last}', en: 'page {page} / {last}' },
  'blog.resultsFor': { es: 'Resultados para «{term}»', en: 'Results for “{term}”' },
  'blog.noResults': { es: 'No hay registros con ese filtro.', en: 'No records with that filter.' },
  'blog.seeAll': { es: 'Ver todas', en: 'See all' },
  'blog.categoriesAria': { es: 'Categorías', en: 'Categories' },
  'blog.paginationAria': { es: 'Paginación', en: 'Pagination' },

  'post.kicker': { es: 'muestra ML-{id}', en: 'sample ML-{id}' },
  'post.uncategorized': { es: 'sin clasificar', en: 'uncategorized' },
  'post.back': { es: '← volver al índice', en: '← back to the index' },
  'post.end': { es: 'fin del registro ML-{id}', en: 'end of record ML-{id}' },
  'post.notFound': { es: 'Esta muestra no existe', en: 'This sample does not exist' },
  'post.notFoundKicker': { es: 'registro no encontrado', en: 'record not found' },
  'post.notFoundText': {
    es: 'Puede que el enlace esté mal o que ya no esté publicada.',
    en: 'The link may be wrong or it is no longer published.',
  },
  'post.toIndex': { es: 'Ir al índice', en: 'Go to the index' },

  'page.kicker': { es: 'página · {template}', en: 'page · {template}' },
  'page.template.default': { es: 'estándar', en: 'standard' },
  'page.template.wide': { es: 'ancha', en: 'wide' },
  'page.template.landing': { es: 'portada', en: 'landing' },
  'page.back': { es: '← inicio', en: '← home' },
  'page.notFound': { es: 'Esta página no existe', en: 'This page does not exist' },
  'page.notFoundText': {
    es: 'Puede que el enlace esté mal escrito o que ya no esté publicada.',
    en: 'The link may be misspelled or the page is no longer published.',
  },
  'page.backHome': { es: 'Volver al inicio', en: 'Go home' },

  'text.kicker': { es: 'versión texto', en: 'text version' },
  'text.title': { es: 'Índice legible por máquinas', en: 'Machine-readable index' },
  'text.lede': {
    es: 'Todo el contenido del sitio en un solo listado, sin animaciones ni scripts. También disponible en',
    en: 'All site content in a single list, without animations or scripts. Also available at',
  },
  'text.pages': { es: 'Páginas', en: 'Pages' },
  'text.posts': { es: 'Entradas', en: 'Posts' },
  'text.machine': { es: 'Máquina', en: 'Machine' },
  'text.back': { es: '← volver a la versión con diseño', en: '← back to the designed version' },
  'text.seoTitle': { es: 'Versión texto', en: 'Text version' },
  'text.seoDescription': { es: 'Índice completo del sitio en texto plano.', en: 'Full site index in plain text.' },

  'notFound.kicker': { es: 'error 404', en: 'error 404' },
  'notFound.title': { es: 'Nada en este tubo de ensayo', en: 'Nothing in this test tube' },
  'notFound.text': {
    es: 'La muestra que buscas no está aquí. Puede que el enlace esté mal escrito o que el experimento se haya archivado.',
    en: 'The sample you are looking for is not here. The link may be mistyped or the experiment archived.',
  },
  'notFound.home': { es: 'Ir al inicio', en: 'Go home' },
  'notFound.index': { es: 'Ver el índice', en: 'See the index' },

  'footer.index': { es: 'Índice', en: 'Index' },
  'footer.signals': { es: 'Señales', en: 'Signals' },
  'footer.experiments': { es: 'experimentos', en: 'experiments' },
  'footer.plain': { es: 'Texto plano', en: 'Plain text' },
  'footer.noCookies': { es: 'sin cookies · sin rastreadores', en: 'no cookies · no trackers' },
  'footer.record': { es: 'registro', en: 'record' },
  'footer.eggNote': {
    es: 'Haz clic en «experimentos» (o pulsa Shift + L).',
    en: 'Click “experiments” (or press Shift + L).',
  },
  'footer.email': { es: 'Correo', en: 'Email' },

  'card.noImage': { es: 'sin imagen', en: 'no image' },
  'card.entry': { es: 'entrada', en: 'post' },
  'card.uncategorized': { es: 'sin clasificar', en: 'uncategorized' },
  'card.note1': { es: 'hipótesis: se puede contar sin ruido.', en: 'hypothesis: it can be told without noise.' },
  'card.note2': { es: 'observación: el detalle está en el borde.', en: 'observation: the detail is at the edge.' },
  'card.note3': { es: 'nota: probar, medir, repetir.', en: 'note: test, measure, repeat.' },
  'card.note4': { es: 'muestra estable a temperatura ambiente.', en: 'sample stable at room temperature.' },
  'card.note5': { es: 'registro: sin atajos, sin plantillas.', en: 'record: no shortcuts, no templates.' },

  'node.aria': {
    es: 'Mapa de nodos del laboratorio. Usa las flechas para recorrerlos.',
    en: 'Lab node map. Use the arrow keys to move through them.',
  },
  'node.origin': { es: 'origen', en: 'origin' },
  'node.connects': { es: 'conecta', en: 'connects' },
  'node.entry': { es: 'entrada', en: 'post' },
  'node.uncategorized': { es: 'sin clasificar', en: 'uncategorized' },
  'node.noParent': { es: 'sin nodo padre', en: 'no parent node' },

  'projects.kicker': { es: 'proyectos · {count} registros', en: 'projects · {count} records' },
  'projects.title': { es: 'Trayectoria y proyectos', en: 'Career and projects' },
  'projects.lede': {
    es: 'Cada proyecto con su periodo, el papel que tuve y las tecnologías. Puedes verlo como línea de tiempo o como fichas, ordenarlo y filtrarlo por tecnología.',
    en: 'Every project with its period, the role I played and the technologies. You can view it as a timeline or as cards, sort it and filter it by technology.',
  },
  'projects.sddTitle': { es: 'Cómo trabajo ahora: SDD + IA.', en: 'How I work now: SDD + AI.' },
  'projects.sddBody': {
    es: 'Los proyectos recientes los construyo con asistencia de IA siguiendo Spec-Driven Development: el análisis, la arquitectura y el stack los decido a mano y quedan escritos en la especificación (requisitos, modelo de datos, contrato de API y despliegue) antes de implementar. La IA acelera la generación de código; las decisiones y la revisión son mías. El resultado es código mantenible, con pruebas y buenas prácticas, y una especificación que permite a la siguiente persona continuar el proyecto sin reconstruir el contexto.',
    en: 'Recent projects are built with AI assistance following Spec-Driven Development: I decide the analysis, architecture and stack by hand and they are written into the specification (requirements, data model, API contract and deployment) before implementation. AI speeds up code generation; the decisions and review are mine. The result is maintainable code, with tests and good practices, and a specification that lets the next person continue the project without rebuilding the context.',
  },
  'projects.view': { es: 'vista', en: 'view' },
  'projects.timeline': { es: 'línea de tiempo', en: 'timeline' },
  'projects.cards': { es: 'fichas', en: 'cards' },
  'projects.order': { es: 'orden', en: 'order' },
  'projects.recent': { es: 'más reciente', en: 'most recent' },
  'projects.oldest': { es: 'más antiguo', en: 'oldest' },
  'projects.name': { es: 'nombre', en: 'name' },
  'projects.tech': { es: 'tecnología', en: 'technology' },
  'projects.all': { es: 'todas', en: 'all' },
  'projects.role': { es: 'Rol:', en: 'Role:' },
  'projects.see': { es: 'ver →', en: 'see →' },
  'projects.seeProject': { es: 'ver proyecto →', en: 'see project →' },
  'projects.empty': { es: 'No hay proyectos con esa tecnología.', en: 'No projects with that technology.' },
  'projects.ariaView': { es: 'Vista', en: 'View' },
  'projects.ariaFilter': { es: 'Filtrar por tecnología', en: 'Filter by technology' },

  'skills.kicker': {
    es: 'habilidades · {count} · técnicas, IA y soft skills',
    en: 'skills · {count} · technical, AI and soft skills',
  },
  'skills.title': { es: 'Stack, IA y soft skills', en: 'Stack, AI and soft skills' },
  'skills.lede': {
    es: 'Cada habilidad con sus años de uso, sus proyectos y cómo se ha usado. Pulsa en cualquiera para ver el detalle.',
    en: 'Each skill with its years of use, its projects and how it has been used. Click any of them for details.',
  },
  'skills.honestyTitle': { es: 'Honestidad sobre los tiempos.', en: 'Honest about timelines.' },
  'skills.honestyBody': {
    es: 'Desde 2024 las implementaciones y el desarrollo en frameworks y lenguajes se hacen con generación de código por IA: el tiempo indica cuándo empecé a usar la tecnología, no años de escritura manual. Hay habilidades (por ejemplo Docker) que solo uso de forma puntual generando los docker-compose con IA y revisándolos.',
    en: 'Since 2024 implementations and development in frameworks and languages are done with AI code generation: the time indicates when I started using the technology, not years of manual writing. Some skills (for example Docker) are only used occasionally by generating the docker-compose files with AI and reviewing them.',
  },
  'skills.order': { es: 'orden', en: 'order' },
  'skills.time': { es: 'más tiempo', en: 'longest' },
  'skills.name': { es: 'nombre', en: 'name' },
  'skills.recent': { es: 'uso reciente', en: 'recent use' },
  'skills.category': { es: 'área', en: 'area' },
  'skills.type': { es: 'tipo', en: 'type' },
  'skills.all': { es: 'todas', en: 'all' },
  'skills.code': { es: 'técnicas', en: 'technical' },
  'skills.ai': { es: 'IA', en: 'AI' },
  'skills.soft': { es: 'soft skills', en: 'soft skills' },
  'skills.years': { es: 'años', en: 'years' },
  'skills.used': { es: 'Cómo se ha usado:', en: 'How it has been used:' },
  'skills.projects': { es: 'Proyectos:', en: 'Projects:' },
  'skills.whenTitle': { es: 'Cuándo he usado cada tecnología', en: 'When I have used each technology' },
  'skills.aiMarker': { es: 'Desarrollando con IA', en: 'Developing with AI' },
  'skills.aiMarkerTitle': {
    es: 'Desde 2024 desarrollo con generación de código por IA (SDD)',
    en: 'Since 2024 I develop with AI code generation (SDD)',
  },
  'skills.ariaList': { es: 'Listado de habilidades', en: 'Skills list' },
  'skills.ariaTimeline': { es: 'Línea de tiempo de habilidades técnicas', en: 'Technical skills timeline' },
  'skills.ariaOrder': { es: 'Ordenar habilidades', en: 'Sort skills' },
  'skills.ariaFilter': { es: 'Filtrar por tipo', en: 'Filter by type' },
  'skills.mode.code': { es: 'código', en: 'code' },
  'skills.mode.ai': { es: 'IA', en: 'AI' },
  'skills.mode.soft': { es: 'soft', en: 'soft' },
  'skills.detail': {
    es: '{category} · {from}–{to} ({years} años)',
    en: '{category} · {from}–{to} ({years} years)',
  },
  'skills.barTitle': {
    es: '{name}: {from}–{to} ({years} años)',
    en: '{name}: {from}–{to} ({years} years)',
  },

  'lab.title': { es: 'Sala de experimentos', en: 'Experiment room' },
  'lab.close': { es: 'Cerrar (Esc)', en: 'Close (Esc)' },
  'lab.tabsAria': { es: 'Experimentos', en: 'Experiments' },
  'lab.reaction': { es: 'Reflejos', en: 'Reflexes' },
  'lab.sequence': { es: 'Secuencia', en: 'Sequence' },
  'lab.reactionAria': { es: 'Prueba de reflejos', en: 'Reflex test' },
  'lab.sequenceAria': { es: 'Juego de secuencia', en: 'Sequence game' },
  'lab.reactionHelp': {
    es: 'Pulsa «Empezar» y, cuando el círculo se ilumine, pulsa el botón (o la barra espaciadora) lo antes posible.',
    en: 'Press “Start” and, when the circle lights up, press the button (or the space bar) as fast as you can.',
  },
  'lab.start': { es: 'Empezar', en: 'Start' },
  'lab.now': { es: '¡Ahora!', en: 'Now!' },
  'lab.wait': { es: 'Espera…', en: 'Wait…' },
  'lab.noData': { es: 'Sin datos todavía.', en: 'No data yet.' },
  'lab.waitCircle': { es: 'Espera al círculo…', en: 'Wait for the circle…' },
  'lab.early': { es: 'Te has adelantado. Vuelve a intentarlo.', en: 'You went too early. Try again.' },
  'lab.result': { es: '{ms} ms. {verdict}', en: '{ms} ms. {verdict}' },
  'lab.verdictLab': { es: 'Nivel laboratorio.', en: 'Lab level.' },
  'lab.verdictGood': { es: 'Buen reflejo.', en: 'Good reflex.' },
  'lab.verdictOk': { es: 'Aceptable.', en: 'Acceptable.' },
  'lab.verdictCoffee': { es: 'Café pendiente.', en: 'Coffee pending.' },
  'lab.sequenceHelp': {
    es: 'Repite la secuencia. Puedes usar los botones o las teclas 1, 2, 3 y 4.',
    en: 'Repeat the sequence. You can use the buttons or keys 1, 2, 3 and 4.',
  },
  'lab.sequenceStart': { es: 'Pulsa «Reiniciar» para empezar.', en: 'Press “Restart” to start.' },
  'lab.restart': { es: 'Reiniciar', en: 'Restart' },
  'lab.observe': { es: 'Observa la secuencia…', en: 'Watch the sequence…' },
  'lab.failStep': {
    es: 'Fallaste en el paso {step}. Longitud alcanzada: {length}.',
    en: 'You failed at step {step}. Length reached: {length}.',
  },
  'lab.nextRound': { es: 'Bien. Siguiente ronda ({round}).', en: 'Good. Next round ({round}).' },
  'lab.observeOne': { es: 'Observa: {count} paso.', en: 'Watch: {count} step.' },
  'lab.observeMany': { es: 'Observa: {count} pasos.', en: 'Watch: {count} steps.' },
  'lab.buttonAria': { es: 'Botón {n}', en: 'Button {n}' },
  'lab.buttonsAria': { es: 'Cuatro botones de secuencia', en: 'Four sequence buttons' },
};

function initialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === 'es' || stored === 'en') {
      return stored;
    }
  } catch {
    // Almacenamiento no disponible (modo privado o permisos): se usa el navegador.
  }

  const browser = (typeof navigator !== 'undefined' && navigator.language) || 'es';

  return browser.toLowerCase().startsWith('es') ? 'es' : 'en';
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly locale = signal<Locale>(initialLocale());
  readonly lang = computed(() => this.locale());

  t(key: string, params?: Record<string, string | number>): string {
    const entry = STRINGS[key];
    let value = entry ? entry[this.locale()] : key;

    if (params) {
      for (const [name, replacement] of Object.entries(params)) {
        value = value.replaceAll(`{${name}}`, String(replacement));
      }
    }

    return value;
  }

  /** Resuelve un dato estático bilingüe (portfolio, textos de datos). */
  pick(value: Localized | string | null | undefined, fallback = ''): string {
    if (value === null || value === undefined) {
      return fallback;
    }

    if (typeof value === 'string') {
      return value;
    }

    return (this.locale() === 'en' ? value.en || value.es : value.es || value.en) || fallback;
  }

  /** Resuelve contenido del CMS con respaldo al español. */
  content(es: string | null | undefined, en: string | null | undefined): string {
    return this.locale() === 'en' ? en || es || '' : es || en || '';
  }

  set(locale: Locale): void {
    this.locale.set(locale);

    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Si no se puede persistir, el idioma sigue activo en esta visita.
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }

  toggle(): void {
    this.set(this.locale() === 'es' ? 'en' : 'es');
  }
}
