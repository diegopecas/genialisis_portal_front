import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface TamanoEstablecimiento {
  id: number;
  nombre: string;
  rango_inicio: number;
  rango_fin: number | null;
}

export interface TipoConsulta {
  id: number;
  nombre: string;
}

export interface ComoConocio {
  id: number;
  nombre: string;
  pide_detalle: boolean;
  placeholder_detalle: string;
}

export interface ContactoForm {
  // Campos básicos del formulario landing GENIALISIS
  nombre_padre: string;  // Usamos este campo para "nombre del establecimiento"
  email: string;
  telefono: string;
  edad_nino?: number;
  mensaje?: string;
  
  // Campos de catálogos
  id_tamano_establecimiento?: number;
  id_tipo_consulta?: number;
  id_como_conocio?: number;
  como_conocio_detalle?: string;
  
  // Campos del sistema (opcionales, backend los llena)
  ip_address?: string;
  user_agent?: string;
  honeypot?: string;
}

export interface ContactoResponse {
  success: boolean;
  message: string;
  contacto_id?: number;
}

export interface TamanosResponse {
  success: boolean;
  tamanos: TamanoEstablecimiento[];
}

@Injectable({
  providedIn: 'root'
})
export class ContactosService {
  private apiUrl = environment.apiUrl + '/genialisis';

  constructor(private http: HttpClient) {}

  /**
   * Obtener tamaños de establecimiento disponibles
   */
  obtenerTamanos(): Observable<TamanosResponse> {
    return this.http.get<TamanosResponse>(`${this.apiUrl}/tamanos-establecimiento`).pipe(
      tap(response => {
        console.log('✅ Tamaños de establecimiento obtenidos:', response);
      }),
      catchError(error => {
        console.error('❌ Error obteniendo tamaños:', error);
        return of({
          success: false,
          tamanos: []
        });
      })
    );
  }

  /**
   * Obtener tipos de consulta disponibles
   */
  obtenerTiposConsulta(): Observable<{success: boolean; tipos: TipoConsulta[]}> {
    return this.http.get<{success: boolean; tipos: TipoConsulta[]}>(`${this.apiUrl}/tipos-consulta`).pipe(
      tap(response => {
        console.log('✅ Tipos de consulta obtenidos:', response);
      }),
      catchError(error => {
        console.error('❌ Error obteniendo tipos de consulta:', error);
        return of({
          success: false,
          tipos: []
        });
      })
    );
  }

  /**
   * Obtener cómo nos conoció (canales)
   */
  obtenerComoConocio(): Observable<{success: boolean; canales: ComoConocio[]}> {
    return this.http.get<{success: boolean; canales: ComoConocio[]}>(`${this.apiUrl}/como-conocio`).pipe(
      tap(response => {
        console.log('✅ Canales obtenidos:', response);
      }),
      catchError(error => {
        console.error('❌ Error obteniendo canales:', error);
        return of({
          success: false,
          canales: []
        });
      })
    );
  }

  /**
   * Crear nuevo contacto
   */
  crearContacto(contacto: ContactoForm): Observable<ContactoResponse> {
    return this.http.post<ContactoResponse>(`${this.apiUrl}/contactos`, contacto).pipe(
      tap(response => {
        console.log('✅ Contacto creado:', response);
      }),
      catchError(error => {
        console.error('❌ Error creando contacto:', error);
        return of({
          success: false,
          message: 'Error al enviar el formulario. Por favor intenta nuevamente.'
        });
      })
    );
  }
}