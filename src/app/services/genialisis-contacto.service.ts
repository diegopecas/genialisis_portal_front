import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { GenialisisContacto, GenialisisContactoResponse } from '../models/genialisis.interface';

@Injectable({
  providedIn: 'root'
})
export class GenialisisContactoService {
  private apiUrl = environment.apiUrl + '/genialisis';

  constructor(private http: HttpClient) { }

  /**
   * Enviar formulario de contacto
   */
  enviarContacto(datos: GenialisisContacto): Observable<GenialisisContactoResponse> {
    return this.http.post<GenialisisContactoResponse>(`${this.apiUrl}/contactos`, datos).pipe(
      tap(response => {
        console.log('✅ Contacto GENIALISIS enviado:', response);
      }),
      catchError(error => {
        console.error('❌ Error enviando contacto GENIALISIS:', error);
        return of({
          success: false,
          message: 'Error al enviar el formulario. Por favor intenta nuevamente.',
          errores: error.error?.errores || []
        });
      })
    );
  }
}
