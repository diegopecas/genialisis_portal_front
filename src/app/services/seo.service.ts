import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

export interface MetadatosPagina {
  titulo: string;
  descripcion: string;
  url: string;
  imagen?: string;
  tipo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Actualiza title, meta description, Open Graph, Twitter Card y canonical.
   * Se ejecuta tanto en prerender como en navegador, por lo que estos datos
   * quedan en el HTML estático que leen los buscadores y las IA.
   */
  actualizarMetadatos(datos: MetadatosPagina): void {
    this.title.setTitle(datos.titulo);

    this.meta.updateTag({ name: 'description', content: datos.descripcion });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: datos.titulo });
    this.meta.updateTag({ property: 'og:description', content: datos.descripcion });
    this.meta.updateTag({ property: 'og:type', content: datos.tipo || 'website' });
    this.meta.updateTag({ property: 'og:url', content: datos.url });
    if (datos.imagen) {
      this.meta.updateTag({ property: 'og:image', content: datos.imagen });
    }

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: datos.titulo });
    this.meta.updateTag({ name: 'twitter:description', content: datos.descripcion });
    if (datos.imagen) {
      this.meta.updateTag({ name: 'twitter:image', content: datos.imagen });
    }

    this.establecerCanonical(datos.url);
  }

  /**
   * Inserta (o reemplaza) un bloque JSON-LD en el <head>.
   * Cada bloque se identifica con un id para poder reemplazarlo sin duplicar.
   */
  establecerJsonLd(esquema: object, id: string): void {
    let script = this.document.getElementById(id) as HTMLScriptElement | null;

    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(esquema);
  }

  private establecerCanonical(url: string): void {
    let link = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}
