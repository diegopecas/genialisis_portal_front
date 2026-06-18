import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

declare const Calendly: any;

@Injectable({
  providedIn: 'root'
})
export class CalendlyService {
  private readonly scriptUrl = 'https://assets.calendly.com/assets/external/widget.js';
  private readonly cssUrl = 'https://assets.calendly.com/assets/external/widget.css';
  private widgetCargado = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Carga el script y los estilos de Calendly una sola vez.
   * No hace nada durante el prerender (no hay navegador).
   */
  cargarWidget(): void {
    if (!isPlatformBrowser(this.platformId) || this.widgetCargado) {
      return;
    }

    if (!this.document.querySelector(`link[href="${this.cssUrl}"]`)) {
      const link = this.document.createElement('link');
      link.rel = 'stylesheet';
      link.href = this.cssUrl;
      this.document.head.appendChild(link);
    }

    if (!this.document.querySelector(`script[src="${this.scriptUrl}"]`)) {
      const script = this.document.createElement('script');
      script.src = this.scriptUrl;
      script.async = true;
      this.document.body.appendChild(script);
    }

    this.widgetCargado = true;
  }

  /**
   * Abre el popup de Calendly con la URL de agendamiento.
   * Si el script aún no terminó de cargar, lo intenta cargar y reintenta.
   */
  abrirPopup(url: string): void {
    if (!isPlatformBrowser(this.platformId) || !url) {
      return;
    }

    this.cargarWidget();

    if (typeof Calendly !== 'undefined' && Calendly.initPopupWidget) {
      Calendly.initPopupWidget({ url });
      return;
    }

    // El script todavía no está listo: esperamos a que cargue y reintentamos.
    const script = this.document.querySelector(`script[src="${this.scriptUrl}"]`);
    if (script) {
      script.addEventListener('load', () => {
        if (typeof Calendly !== 'undefined' && Calendly.initPopupWidget) {
          Calendly.initPopupWidget({ url });
        }
      }, { once: true });
    }
  }
}
