import { Component } from '@angular/core';

/**
 * Carcasa del monitor: LED, disquetera y marca. Solo se ve en el layout
 * `desktop`; el CSS la oculta en el resto.
 */
@Component({
  selector: 'app-desktop-chrome',
  template: `
    <div class="desktop-monitor" aria-hidden="true">
      <span class="desktop-monitor-brand">MILIO-95</span>
      <span class="desktop-drive">
        <span class="desktop-drive-label">3.5</span>
        <span class="desktop-drive-slot"></span>
        <span class="desktop-drive-eject"></span>
        <span class="desktop-drive-led"></span>
      </span>
      <span class="desktop-monitor-led"></span>
    </div>
  `,
})
export class DesktopChromeComponent {}
