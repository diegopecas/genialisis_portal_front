/**
 * Interfaces para GENIALISIS
 */

export interface GenialisisContacto {
  nombre_establecimiento: string;
  nombre_contacto: string;
  email: string;
  telefono: string;
  mensaje?: string;
}

export interface GenialisisContactoResponse {
  success: boolean;
  message: string;
  contacto_id?: number;
  calendly_url?: string;
  errores?: string[];
}

export interface ModuloGenialisis {
  icono: string;
  titulo: string;
  descripcion: string;
  color: string;
}

export interface Diferenciador {
  titulo: string;
  descripcion: string;
  exclusivo?: boolean;
}
