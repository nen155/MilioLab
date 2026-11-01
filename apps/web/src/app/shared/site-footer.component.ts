import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MenuItem } from '../core/models';
import { SiteService } from '../core/site.service';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <a class="brand" routerLink="/">
            <span class="brand-mark">M</span>
            <span class="brand-name">{{ site.siteName() }}</span>
          </a>
          <p class="muted">{{ site.setting('footer_text', '') }}</p>
        </div>

        <div class="footer-links">
          @for (item of navigation(); track item.id) {
            @if (isExternal(item.url)) {
              <a [href]="item.url" [attr.target]="item.target" rel="noopener">{{ item.label }}</a>
            } @else {
              <a [routerLink]="item.url">{{ item.label }}</a>
            }
          }
        </div>

        <div class="footer-social">
          @if (social('social_github'); as github) {
            <a [href]="github" target="_blank" rel="noopener">GitHub</a>
          }
          @if (social('social_linkedin'); as linkedin) {
            <a [href]="linkedin" target="_blank" rel="noopener">LinkedIn</a>
          }
          @if (social('social_x'); as x) {
            <a [href]="x" target="_blank" rel="noopener">X</a>
          }
          @if (social('social_youtube'); as youtube) {
            <a [href]="youtube" target="_blank" rel="noopener">YouTube</a>
          }
          @if (email()) {
            <a [href]="'mailto:' + email()">Escríbeme</a>
          }
        </div>
      </div>

      <div class="container footer-legal">
        <span>© {{ year }} {{ site.siteName() }}</span>
        <span class="muted">Hecho con Angular y Laravel</span>
      </div>
    </footer>
  `,
})
export class SiteFooterComponent {
  protected readonly site = inject(SiteService);
  protected readonly year = new Date().getFullYear();
  protected readonly email = computed(() => this.site.setting('contact_email', ''));

  /** Menú sin duplicados (el mismo enlace puede estar repetido en el panel). */
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
    return this.site.setting(key, '');
  }

  protected isExternal(url: string): boolean {
    return /^https?:\/\//i.test(url);
  }
}
