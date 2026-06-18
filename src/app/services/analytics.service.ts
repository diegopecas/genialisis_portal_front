import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private analyticsId: string | null = null;
  private initialized = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  /**
   * Inicializar Google Analytics con el ID desde la configuración
   */
  async initialize(analyticsId: string): Promise<void> {
    // No hacer nada durante el prerender (no hay navegador).
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.initialized) {
      console.warn('Analytics ya está inicializado');
      return;
    }

    if (!analyticsId) {
      console.warn('No se proporcionó ID de Google Analytics');
      return;
    }

    this.analyticsId = analyticsId;

    try {
      // Cargar el script de gtag.js dinámicamente
      await this.loadGtagScript(analyticsId);

      // Inicializar gtag
      gtag('js', new Date());
      gtag('config', analyticsId, {
        send_page_view: false // Deshabilitamos el envío automático porque lo haremos manualmente
      });

      // Escuchar cambios de ruta para tracking de navegación
      this.setupRouteTracking();

      this.initialized = true;
      console.log('✅ Google Analytics inicializado:', analyticsId);
      
      // Enviar pageview inicial
      this.trackPageView();

    } catch (error) {
      console.error('❌ Error inicializando Google Analytics:', error);
    }
  }

  /**
   * Cargar script de gtag.js dinámicamente
   */
  private loadGtagScript(analyticsId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Verificar si ya existe el script
      if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) {
        resolve();
        return;
      }

      // Crear script tag
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
      
      script.onload = () => {
        // Inicializar dataLayer
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).gtag = function() {
          (window as any).dataLayer.push(arguments);
        };
        resolve();
      };

      script.onerror = () => reject(new Error('Error cargando gtag.js'));

      document.head.appendChild(script);
    });
  }

  /**
   * Configurar tracking automático de navegación
   */
  private setupRouteTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.trackPageView(event.urlAfterRedirects);
    });
  }

  /**
   * Enviar pageview manualmente
   */
  trackPageView(url?: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.initialized || !this.analyticsId) {
      console.warn('Analytics no inicializado');
      return;
    }

    const pageUrl = url || window.location.pathname + window.location.search;
    
    gtag('event', 'page_view', {
      page_path: pageUrl,
      page_title: document.title,
      page_location: window.location.href
    });

    console.log('📊 Pageview enviado:', pageUrl);
  }

  /**
   * Enviar evento personalizado
   */
  trackEvent(eventName: string, eventParams: any = {}): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.initialized || !this.analyticsId) {
      console.warn('Analytics no inicializado');
      return;
    }

    gtag('event', eventName, eventParams);
    console.log('📊 Evento enviado:', eventName, eventParams);
  }

  /**
   * Eventos específicos del portal
   */

  // Clic en opción del menú
  trackMenuOptionClick(optionLabel: string, optionRoute: string): void {
    this.trackEvent('menu_option_click', {
      option_label: optionLabel,
      option_route: optionRoute,
      event_category: 'navigation',
      event_label: optionLabel
    });
  }

  // Hover sobre el portal central
  trackPortalHover(): void {
    this.trackEvent('portal_hover', {
      event_category: 'interaction',
      event_label: 'central_portal'
    });
  }

  // Apertura de modal de contacto
  trackContactModalOpen(): void {
    this.trackEvent('contact_modal_open', {
      event_category: 'engagement',
      event_label: 'contacto_modal'
    });
  }

  // Envío de formulario de contacto
  trackContactFormSubmit(formData: any): void {
    this.trackEvent('contact_form_submit', {
      event_category: 'conversion',
      event_label: 'formulario_contacto',
      tipo_consulta: formData.tipo_consulta || 'no_especificado'
    });
  }

  // Clic en programa específico
  trackProgramClick(programName: string): void {
    this.trackEvent('program_click', {
      event_category: 'engagement',
      event_label: programName,
      program_name: programName
    });
  }

  // Tiempo de permanencia en página
  trackTimeOnPage(pageName: string, seconds: number): void {
    this.trackEvent('time_on_page', {
      event_category: 'engagement',
      event_label: pageName,
      value: seconds
    });
  }

  // Scroll depth
  trackScrollDepth(percentage: number): void {
    this.trackEvent('scroll_depth', {
      event_category: 'engagement',
      event_label: `${percentage}%`,
      value: percentage
    });
  }
}