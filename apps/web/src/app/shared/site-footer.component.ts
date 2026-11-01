import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LabService } from '../core/lab.service';
import { MenuItem } from '../core/models';
import { SiteService } from '../core/site.service';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  template: `
    <footer class="lab-footer">
      <div class="footer-grid">
        <div>
          <h3>MilioLab</h3>
          <p class="mono muted">{{ site.setting('footer_text', '') }}</p>
          <p class="mono">
            <span class="egg" tabindex="0">
              <span class="muted">registro</span> {{ year }} · ML-01
              <span class="egg-note">Haz clic en «experimentos» (o pulsa Shift + L).</span>
            </span>
          </p>
        </div>

        <div>
          <h3>Índice</h3>
          <ul>
            @for (item of navigation(); track item.id) {
              @if (isExternal(item.url)) {
                <li><a [href]="item.url" [attr.target]="item.target" rel="noopener">{{ item.label }}</a></li>
              } @else {
                <li><a [routerLink]="item.url">{{ item.label }}</a></li>
              }
            }
            <li><a routerLink="/texto">Texto plano</a></li>
          </ul>
        </div>

        <div>
          <h3>Señales</h3>
          <ul>
            @if (social('social_github'); as github) {
              <li><a [href]="github" target="_blank" rel="noopener">GitHub</a></li>
            }
            @if (social('social_linkedin'); as linkedin) {
              <li><a [href]="linkedin" target="_blank" rel="noopener">LinkedIn</a></li>
            }
            @if (social('social_x'); as x) {
              <li><a [href]="x" target="_blank" rel="noopener">X</a></li>
            }
            @if (email()) {
              <li><a [href]="'mailto:' + email()">Correo</a></li>
            }
            <li><a href="/feed.xml">RSS</a></li>
            <li><a href="/llms.txt">llms.txt</a></li>
            <li><button class="egg-trigger" type="button" (click)="lab.show()">experimentos</button></li>
          </ul>
        </div>
      </div>

      <div class="footer-legal">
        <span>© {{ year }} {{ site.siteName() }}</span>
        <span class="mono">sin cookies · sin rastreadores</span>
      </div>
    </footer>
  `,
})
export class SiteFooterComponent {
  protected readonly site = inject(SiteService);
  protected readonly lab = inject(LabService);
  protected readonly year = new Date().getFullYear();
  protected readonly email = computed(() => this.site.setting<string>('contact_email', ''));

  protected readonly navigation = computed<MenuItem[]>(() => {
    const seen = new Set<string>();

    return this.site.menu().filter((item) => {
      if (seen.has(item.url)) {
        return false;
      }
      seen.add(item.url);

      return true;
    });
  });

  protected social(key: string): string {
    return this.site.setting<string>(key, '');
  }

  protected isExternal(url: string): boolean {
    return /^https?:\/\//i.test(url);
  }
}
