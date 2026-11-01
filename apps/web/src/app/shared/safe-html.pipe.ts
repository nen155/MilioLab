import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Pinta el HTML del CMS.
 *
 * El contenido se limpia en el servidor (HTMLPurifier) antes de guardarse, así
 * que aquí se puede confiar en él; Angular, si no, eliminaría clases y estilos.
 */
@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value ?? '');
  }
}
