const DATE_FORMATS = {
  es: new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
  en: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
};

/** Fecha legible en el idioma activo ("3 de noviembre de 2026" / "3 November 2026"). */
export function formatDate(value?: string | null, locale: 'es' | 'en' = 'es'): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? '' : DATE_FORMATS[locale].format(date);
}

/** Texto plano a partir del HTML (para descripciones y resúmenes). */
export function plainText(html?: string | null, maxLength = 180): string {
  if (!html) {
    return '';
  }

  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

/** URL absoluta a partir de una ruta relativa. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
}
