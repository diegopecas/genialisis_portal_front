import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ConfiguracionItem {
  clave: string;
  valor: any;
  tipo: 'texto' | 'numero' | 'boolean' | 'json' | 'url';
}

export interface ConfiguracionesPublicas {
  google_analytics_id?: string;
  calendly_url?: string;
  honeypot_enabled?: boolean;
  [key: string]: any;
}

export interface ConfiguracionPublicaResponse {
  success: boolean;
  configuraciones: ConfiguracionesPublicas;
}

export interface ContactoInfo {
  correos: string[];
  telefono: string;
  whatsapp: string;
  horarios: {
    lunesViernes: string;
    extendido: string;
    sabados: string;
  };
  ubicacion: {
    direccion: string;
    mapsUrl: string;
  };
  redesSociales: {
    instagram: string;
    facebook: string;
  };
}

export interface ContactoResponse {
  success: boolean;
  contacto: ContactoInfo;
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private apiUrl = environment.apiUrl + '/configuraciones';
  private configuraciones: Map<string, any> = new Map();

  constructor(private http: HttpClient) {}

  /**
   * Obtener configuraciones públicas (Google Analytics, Calendly, etc)
   */
  obtenerConfiguracionesPublicas(): Observable<ConfiguracionPublicaResponse> {
    return this.http.get<ConfiguracionPublicaResponse>(`${this.apiUrl}/publicas`).pipe(
      tap(response => {
        console.log('✅ Configuraciones públicas obtenidas:', response);
      }),
      catchError(error => {
        console.error('❌ Error obteniendo configuraciones públicas:', error);
        return of({
          success: false,
          configuraciones: {}
        });
      })
    );
  }

  /**
   * Obtener configuraciones de contacto (todas juntas)
   */
  obtenerConfiguracionesContacto(): Observable<ContactoResponse> {
    return this.http.get<ContactoResponse>(`${this.apiUrl}/contacto`).pipe(
      tap(response => {
        console.log('✅ Configuraciones de contacto obtenidas:', response);
        // Guardar en el Map local
        if (response.success && response.contacto) {
          this.guardarConfiguraciones(response.contacto);
        }
      }),
      catchError(error => {
        console.error('❌ Error obteniendo configuraciones de contacto:', error);
        return of({
          success: false,
          contacto: {
            correos: [],
            telefono: '',
            whatsapp: '',
            horarios: {
              lunesViernes: '',
              extendido: '',
              sabados: ''
            },
            ubicacion: {
              direccion: '',
              mapsUrl: ''
            },
            redesSociales: {
              instagram: '',
              facebook: ''
            }
          }
        });
      })
    );
  }

  /**
   * Guardar configuraciones en Map local para acceso rápido
   */
  private guardarConfiguraciones(contacto: ContactoInfo): void {
    this.configuraciones.set('contacto_correos', contacto.correos);
    this.configuraciones.set('contacto_telefono', contacto.telefono);
    this.configuraciones.set('contacto_whatsapp', contacto.whatsapp);
    this.configuraciones.set('contacto_horarios', contacto.horarios);
    this.configuraciones.set('contacto_direccion', contacto.ubicacion.direccion);
    this.configuraciones.set('contacto_maps_url', contacto.ubicacion.mapsUrl);
    this.configuraciones.set('contacto_instagram', contacto.redesSociales.instagram);
    this.configuraciones.set('contacto_facebook', contacto.redesSociales.facebook);
  }

  /**
   * Obtener configuración por clave (acceso rápido)
   */
  obtenerPorClave(clave: string, valorPorDefecto: any = null): any {
    return this.configuraciones.get(clave) || valorPorDefecto;
  }

  /**
   * Verificar si una configuración existe
   */
  existe(clave: string): boolean {
    return this.configuraciones.has(clave);
  }
}