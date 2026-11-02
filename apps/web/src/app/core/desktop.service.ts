import { Injectable } from '@angular/core';

/**
 * Animación de disquete: clona el disco pulsado y lo lleva hasta la disquetera
 * del monitor. Al terminar ejecuta el callback (abrir la ventana o navegar).
 */
@Injectable({ providedIn: 'root' })
export class DesktopService {
  insert(source: HTMLElement, done: () => void): void {
    const drive = document.querySelector<HTMLElement>('.desktop-drive');

    if (!drive) {
      done();
      return;
    }

    const from = source.getBoundingClientRect();
    const to = drive.getBoundingClientRect();
    const clone = source.cloneNode(true) as HTMLElement;

    clone.classList.add('desktop-floppy-flying');
    clone.style.left = `${from.left}px`;
    clone.style.top = `${from.top}px`;
    clone.style.width = `${from.width}px`;
    clone.style.height = `${from.height}px`;
    document.body.appendChild(clone);
    document.documentElement.classList.add('desktop-inserting');

    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);

    requestAnimationFrame(() => {
      clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.16)`;
      clone.style.opacity = '0';
    });

    window.setTimeout(() => {
      clone.remove();
      document.documentElement.classList.remove('desktop-inserting');
      done();
    }, 900);
  }
}
