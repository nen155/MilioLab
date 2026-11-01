import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

/**
 * Pinta el contenido del CMS.
 *
 * Si el cuerpo parece HTML (lo normal: el editor TipTap guarda HTML) se deja tal
 * cual; si no, se interpreta como **Markdown**. En ambos casos el HTML ya viene
 * limpio del servidor (HTMLPurifier) o se genera con `marked`.
 */
@Pipe({ name: 'content' })
export class ContentPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    const source = (value ?? '').trim();

    if (!source) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }

    const looksLikeHtml = /^<[a-z!/]/i.test(source);
    const html = looksLikeHtml
      ? source
      : (marked.parse(source, { async: false, gfm: true, breaks: false }) as string);

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
