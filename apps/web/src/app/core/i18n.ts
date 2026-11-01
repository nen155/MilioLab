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
