import { Injectable, computed, signal } from '@angular/core';

type Dict = Record<string, { es: string; en: string }>;

const STRINGS: Dict = {
  'nav.index': { es: 'índice', en: 'index' },
  'nav.search': { es: 'buscar', en: 'search' },
  'nav.searchPlaceholder': { es: 'término…', en: 'term…' },
  'nav.home': { es: 'Inicio', en: 'Home' },
  'nav.blog': { es: 'Blog', en: 'Blog' },
  'nav.about': { es: 'Sobre mí', en: 'About' },
  'nav.projects': { es: 'Proyectos', en: 'Projects' },
  'nav.skills': { es: 'Habilidades', en: 'Skills' },
  'nav.contact': { es: 'Contacto', en: 'Contact' },
  'home.kicker': { es: 'cuaderno de laboratorio', en: 'lab notebook' },
  'home.cta': { es: 'Abrir el cuaderno', en: 'Open the notebook' },
  'home.text': { es: 'Versión texto', en: 'Text version' },
  'home.latest': { es: 'Últimas muestras', en: 'Latest samples' },
  'home.all': { es: 'todas →', en: 'all →' },
  'home.nodes': { es: 'Mapa de nodos', en: 'Node map' },
  'blog.title': { es: 'Blog', en: 'Blog' },
  'blog.all': { es: 'todas', en: 'all' },
  'blog.prev': { es: '← anterior', en: '← previous' },
  'blog.next': { es: 'siguiente →', en: 'next →' },
  'blog.empty': { es: 'Sin muestras', en: 'No samples' },
  'footer.index': { es: 'Índice', en: 'Index' },
  'footer.signals': { es: 'Señales', en: 'Signals' },
  'footer.experiments': { es: 'experimentos', en: 'experiments' },
  'footer.plain': { es: 'Texto plano', en: 'Plain text' },
  'footer.noCookies': { es: 'sin cookies · sin rastreadores', en: 'no cookies · no trackers' },
  'home.lede': { es: 'Desarrollo web, producto y experimentos que aún no tienen nombre. Escribo lo que pruebo y publico lo que funciona.', en: 'Web development, product and experiments that do not have a name yet. I write what I test and publish what works.' },
  'home.method': { es: 'método', en: 'method' },
  'home.samples': { es: 'muestras', en: 'samples' },
  'home.residue': { es: 'residuo', en: 'residue' },
  'home.observations': { es: 'Registro de observaciones', en: 'Observation log' },
  'home.noSamples': { es: 'Todavía no hay muestras registradas.', en: 'No samples registered yet.' },
  'blog.index': { es: 'índice de muestras', en: 'sample index' },
  'blog.results': { es: 'Resultados para', en: 'Results for' },
  'blog.records': { es: 'registros', en: 'records' },
  'blog.page': { es: 'página', en: 'page' },
  'blog.of': { es: 'de', en: 'of' },
  'blog.noResults': { es: 'No hay registros con ese filtro.', en: 'No records with that filter.' },
  'blog.seeAll': { es: 'Ver todas', en: 'See all' },
  'post.back': { es: '← volver al índice', en: '← back to the index' },
  'post.end': { es: 'fin del registro', en: 'end of record' },
  'post.notFound': { es: 'Esta muestra no existe', en: 'This sample does not exist' },
  'post.notFoundText': { es: 'Puede que el enlace esté mal o que ya no esté publicada.', en: 'The link may be wrong or it is no longer published.' },
  'post.toIndex': { es: 'Ir al índice', en: 'Go to the index' },
  'page.notFound': { es: 'Esta página no existe', en: 'This page does not exist' },
  'page.back': { es: '← inicio', en: '← home' },
  'notFound.kicker': { es: 'error 404', en: 'error 404' },
  'notFound.title': { es: 'Nada en este tubo de ensayo', en: 'Nothing in this test tube' },
  'notFound.text': { es: 'La muestra que buscas no está aquí. Puede que el enlace esté mal escrito o que el experimento se haya archivado.', en: 'The sample you are looking for is not here. The link may be mistyped or the experiment archived.' },
  'notFound.home': { es: 'Ir al inicio', en: 'Go home' },
  'notFound.index': { es: 'Ver el índice', en: 'See the index' },
  'footer.lang': { es: 'Idioma', en: 'Language' },
  'common.skip': { es: 'Saltar al contenido', en: 'Skip to content' },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly locale = signal<'es' | 'en'>(
    (typeof navigator !== 'undefined' && navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en',
  );

  readonly lang = computed(() => this.locale());

  t(key: string): string {
    const entry = STRINGS[key];

    return entry ? entry[this.locale()] : key;
  }

  set(locale: 'es' | 'en'): void {
    this.locale.set(locale);
    document.documentElement.lang = locale;
  }
}
