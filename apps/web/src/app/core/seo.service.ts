import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description?: string | null;
  image?: string | null;
  type?: 'website' | 'article';
  url?: string;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  jsonLd?: Record<string, unknown> | null;
}

const JSON_LD_ID = 'miliolab-jsonld';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  set(data: SeoData): void {
    const url = data.url ?? this.document.location.href;

    this.title.setTitle(data.title);

    this.setTag('name', 'description', data.description ?? '');
    this.setTag('property', 'og:title', data.title);
    this.setTag('property', 'og:description', data.description ?? '');
    this.setTag('property', 'og:type', data.type ?? 'website');
    this.setTag('property', 'og:url', url);
    this.setTag('name', 'twitter:card', 'summary_large_image');
    this.setTag('name', 'twitter:title', data.title);
    this.setTag('name', 'twitter:description', data.description ?? '');

    if (data.image) {
      this.setTag('property', 'og:image', data.image);
      this.setTag('name', 'twitter:image', data.image);
    }

    if (data.publishedTime) {
      this.setTag('property', 'article:published_time', data.publishedTime);
    }

    if (data.modifiedTime) {
      this.setTag('property', 'article:modified_time', data.modifiedTime);
    }

    this.setCanonical(url);
    this.setJsonLd(data.jsonLd ?? null);
  }

  private setTag(attribute: 'name' | 'property', key: string, content: string): void {
    if (content) {
      this.meta.updateTag({ [attribute]: key, content });
    } else {
      this.meta.removeTag(`${attribute}='${key}'`);
    }
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private setJsonLd(data: Record<string, unknown> | null): void {
    this.document.getElementById(JSON_LD_ID)?.remove();

    if (!data) {
      return;
    }

    const script = this.document.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }
}
