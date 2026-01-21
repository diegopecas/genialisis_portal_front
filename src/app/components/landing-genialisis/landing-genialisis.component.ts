import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContactosService, TamanoEstablecimiento, TipoConsulta, ComoConocio } from '../../services/contactos.service';
import { ConfiguracionService } from '../../services/configuracion.service';

interface Stat {
  value: string;
  label: string;
  icon: string;
}

interface Problem {
  icon: string;
  title: string;
  description: string;
}

interface SolutionBenefit {
  value: string;
  label: string;
}

interface Module {
  title: string;
  description: string;
  icon: SafeHtml;
  fullDescription: string;
}

interface Differentiator {
  title: string;
  description: string;
  icon: string;
  badge?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-landing-genialisis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './landing-genialisis.component.html',
  styleUrl: './landing-genialisis.component.scss'
})
export class LandingGenialisisComponent implements OnInit, AfterViewInit {
  @ViewChild('contactSection') contactSection!: ElementRef;
  @ViewChild('modulesSection') modulesSection!: ElementRef;

  contactForm!: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  showModal = false;
  selectedModule: Module | null = null;
  activeFaqIndex: number | null = null;
  
  
  // Modales de páginas institucionales
  showPaginaModal = false;
  paginaModalTitulo = '';
  paginaModalContenido: SafeHtml = '';
  
  // Menu mobile
  menuMobileAbierto = false;
  // Datos cargados desde servicios
  tamanosEstablecimiento: TamanoEstablecimiento[] = [];
  tiposConsulta: TipoConsulta[] = [];
  canalesComoConocio: ComoConocio[] = [];
  whatsappUrl: string = 'https://wa.me/5731181818116'; // Valor por defecto
  telefonoContacto: string = '+57 311 8181816'; // Valor por defecto
  emailContacto: string = 'contacto@genialisis.com'; // Valor por defecto
  mostrarDetalleComoConocio: boolean = false;

  stats: Stat[] = [
    {
      value: '60%',
      label: 'Ahorro en tiempo administrativo',
      icon: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>'
    },
    {
      value: '100%',
      label: 'Cobertura curricular garantizada',
      icon: '<polyline points="20 6 9 17 4 12"/>'
    },
    {
      value: '5 min',
      label: 'Para evaluar 15 niños',
      icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'
    },
    {
      value: '24/7',
      label: 'Acceso para padres',
      icon: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20zM2 12h20"/>'
    }
  ];

  problems: Problem[] = [
    {
      icon: '📊',
      title: 'Información dispersa',
      description: 'Datos en Excel, WhatsApp, cuadernos físicos. Imposible encontrar nada cuando más lo necesitas.'
    },
    {
      icon: '⏰',
      title: 'Docentes sobrecargadas',
      description: 'Horas extras registrando calificaciones de memoria fuera de horario laboral.'
    },
    {
      icon: '📱',
      title: 'Padres sin información',
      description: 'Preguntan por WhatsApp 24/7 porque no tienen acceso a datos en tiempo real.'
    },
    {
      icon: '📦',
      title: 'Sin control de inventarios',
      description: 'Te enteras de faltantes cuando ya es demasiado tarde para reordenar.'
    },
    {
      icon: '❓',
      title: 'Cobertura incierta',
      description: 'No sabes con certeza si trabajaste todos los indicadores prometidos.'
    },
    {
      icon: '📉',
      title: 'Pérdida de matrículas',
      description: '3-4 matrículas perdidas al mes por falta de seguimiento profesional.'
    }
  ];

  solutionBenefits: SolutionBenefit[] = [
    { value: '60%', label: 'Menos tiempo administrativo' },
    { value: '100%', label: 'Trazabilidad completa' },
    { value: '24/7', label: 'Acceso para padres' }
  ];

  modules: Module[] = [
    {
      title: 'Estudiantes',
      description: 'Vista 360° completa con historial médico, académico, financiero y antropométrico.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'),
      fullDescription: `
        <p><strong>El corazón del ecosistema GENIALISIS. Centraliza TODA la información de cada niño en un solo lugar.</strong></p>
        
        <p><strong>Ficha del Estudiante:</strong></p>
        <ul>
          <li><strong>Identificación completa:</strong> Tipo y número de documento, nombres completos, nacionalidad</li>
          <li><strong>Información médica crítica:</strong> Grupo sanguíneo, EPS, fecha de nacimiento con cálculo automático de edad</li>
          <li><strong>Contacto y ubicación:</strong> Dirección, ciudad, correo, teléfono principal y de emergencia</li>
          <li><strong>Información académica:</strong> Grupo asignado, año escolar, fecha de ingreso</li>
        </ul>
        
        <p><strong>Gestión de Acudientes:</strong></p>
        <ul>
          <li><strong>Control granular de permisos:</strong> Define quién es responsable de pago, quién puede recoger al niño, quién tiene acceso al portal</li>
          <li><strong>Seguridad verificable:</strong> Eliminación del "¿quién recogió al niño? ¿estaba autorizado?"</li>
          <li><strong>Trazabilidad completa:</strong> Todo queda registrado con fecha y usuario</li>
        </ul>
        
        <p><strong>Vista 360° - Todo en una sola pantalla:</strong></p>
        <ul>
          <li><strong>Datos personales y acudientes:</strong> Información completa sin cambiar de pantalla</li>
          <li><strong>Estado de cuenta:</strong> Resumen financiero, movimientos, pagos, saldo pendiente y vencido</li>
          <li><strong>Asistencia:</strong> Resumen del mes, gráficas diarias, registro detallado con observaciones</li>
          <li><strong>Evaluaciones:</strong> Promedio por área, desempeño global, áreas destacadas y por mejorar</li>
          <li><strong>Medidas antropométricas:</strong> Gráficas de evolución de peso y talla</li>
          <li><strong>Observaciones:</strong> Historial completo académico, disciplinario y social</li>
        </ul>
        
        <p><strong>Beneficio clave:</strong> Respuesta inmediata a cualquier pregunta. Cuando un padre llama, tienes TODO al instante. No más "lo busco y te llamo después".</p>
      `
    },
    {
      title: 'Académico',
      description: 'Sprints + Logros + Indicadores con metodología ágil garantizando cobertura curricular.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'),
      fullDescription: `
        <p><strong>El cerebro pedagógico de GENIALISIS. Garantiza que TODOS los indicadores de logro se trabajen de manera equilibrada.</strong></p>
        
        <p><strong>Estructura Curricular Clara:</strong></p>
        <ul>
          <li><strong>Logros:</strong> Objetivos generales de aprendizaje por grupo y área</li>
          <li><strong>Indicadores:</strong> Evidencias específicas y medibles de avance</li>
          <li><strong>Actividades:</strong> Experiencias concretas con materiales, duración y niveles (básico/avanzado)</li>
        </ul>
        
        <p><strong>Sprints Académicos - Metodología Ágil Educativa:</strong></p>
        <ul>
          <li><strong>Ciclos cortos:</strong> Períodos de 2 semanas con fechas definidas</li>
          <li><strong>Control de capacidad:</strong> El sistema impide crear más actividades de las que caben en el tiempo disponible</li>
          <li><strong>Visualización de progreso:</strong> Dashboards por grupo y área en tiempo real</li>
          <li><strong>Identificación de vacíos:</strong> Alerta de logros sin actividades asignadas</li>
          <li><strong>Análisis por áreas:</strong> Gráficas que comparan actividades del sprint vs acumulado del corte</li>
        </ul>
        
        <p><strong>Gestión del Sprint:</strong></p>
        <ul>
          <li><strong>Información General:</strong> KPIs, análisis de logros atendidos vs sin atender</li>
          <li><strong>Configuración:</strong> Capacidad por grupo y área tipo "tanque" que muestra % utilizado</li>
          <li><strong>Progreso:</strong> Avance por grupo y área con barras de progreso</li>
        </ul>
        
        <p><strong>Beneficio clave:</strong> El director puede demostrar con DATOS que el 100% de los indicadores prometidos se trabajaron. No basado en suposiciones, sino en registros reales.</p>
      `
    },
    {
      title: 'Calificaciones',
      description: '~5 minutos para evaluar 15 niños en tiempo real, integrado con la clase.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'),
      fullDescription: `
        <p><strong>Revoluciona la evaluación. La docente NUNCA más tiene que "quedarse después" o "llevarse trabajo a casa".</strong></p>
        
        <p><strong>Evaluación en Dos Momentos:</strong></p>
        <ul>
          <li><strong>Momento 1 - Inicio de actividad:</strong>
            <ul>
              <li>Estado de Ánimo (3 estrellas): ¿Cómo llegó el niño? Triste, normal o entusiasta</li>
              <li>Salud (2 estrellas): ¿Presenta síntomas o está en buen estado?</li>
            </ul>
          </li>
          <li><strong>Momento 2 - Fin de actividad:</strong>
            <ul>
              <li>Efectividad (5 estrellas): ¿Qué tan bien logró el objetivo?</li>
              <li>Número de Intentos (4 estrellas): ¿Cuántos intentos necesitó?</li>
            </ul>
          </li>
        </ul>
        
        <p><strong>Interfaz Optimizada:</strong></p>
        <ul>
          <li><strong>Todos los estudiantes visibles:</strong> En una sola pantalla, sin cambiar vistas</li>
          <li><strong>Selección de un toque:</strong> Las estrellas se marcan con un clic</li>
          <li><strong>Información completa visible:</strong> Indicador de logro, actividad, materiales, niveles</li>
          <li><strong>Tiempo real:</strong> ~20 segundos por niño = 5 minutos para grupo completo</li>
        </ul>
        
        <p><strong>Criterios Personalizables:</strong></p>
        <ul>
          <li>El sistema viene con 4 criterios predefinidos</li>
          <li>Cada establecimiento puede configurar los criterios que necesite: participación, creatividad, trabajo en equipo, etc.</li>
          <li>Se adapta al proyecto educativo del establecimiento</li>
        </ul>
        
        <p><strong>Reportes Automáticos:</strong></p>
        <ul>
          <li>Al registrar calificaciones, los reportes se generan solos</li>
          <li>Boletines listos para padres</li>
          <li>Vista 360° actualizada en tiempo real</li>
          <li>Portal de padres con información al día</li>
        </ul>
        
        <p><strong>Beneficio clave:</strong> La evaluación es parte natural de la clase, NO trabajo extra. Docentes liberadas, datos precisos, padres informados 24/7.</p>
      `
    },
    {
      title: 'Asistencia',
      description: 'Verificación de personas autorizadas con trazabilidad completa de ingresos y salidas.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>'),
      fullDescription: `
        <p><strong>Control de seguridad profesional. Sabe en todo momento qué niños están en el establecimiento.</strong></p>
        
        <p><strong>Registro de Ingreso:</strong></p>
        <ul>
          <li><strong>Lista organizada por grupo:</strong> Identificación visual por colores</li>
          <li><strong>Campo de observaciones:</strong> "Llegó con gripa", "Trae autorización para salir temprano"</li>
          <li><strong>Hora exacta automática:</strong> Registro con timestamp sin intervención</li>
          <li><strong>Filtro de búsqueda:</strong> Ubicación rápida cuando hay varios niños llegando</li>
        </ul>
        
        <p><strong>Registro de Salida:</strong></p>
        <ul>
          <li><strong>Verificación de autorizados:</strong> Botón "detalle" muestra quién puede recoger al niño</li>
          <li><strong>Lista de personas autorizadas:</strong> Nombre, relación (padre/madre/abuelo/nana), confirmación Sí/No</li>
          <li><strong>Campo de observaciones:</strong> "Recogió la abuela María"</li>
          <li><strong>Trazabilidad completa:</strong> Quién, cuándo y a qué hora</li>
        </ul>
        
        <p><strong>Contador en Tiempo Real:</strong></p>
        <ul>
          <li><strong>Vista "Actual":</strong> Cantidad exacta de niños presentes en este momento</li>
          <li><strong>Actualización automática:</strong> Se actualiza con cada ingreso/salida</li>
          <li><strong>Crítico para emergencias:</strong> Simulacros de evacuación, conteo rápido</li>
          <li><strong>Control de capacidad:</strong> Saber cuántos espacios hay disponibles</li>
        </ul>
        
        <p><strong>Integración con Otros Módulos:</strong></p>
        <ul>
          <li>Alimenta la Vista 360° del estudiante con resumen mensual y gráficas</li>
          <li>Conecta con módulo de Acudientes para verificación de autorizados</li>
          <li>Las observaciones quedan en el historial del estudiante</li>
        </ul>
        
        <p><strong>Beneficio clave:</strong> Ante cualquier emergencia, sabes en segundos exactamente qué niños están en las instalaciones. Seguridad verificable con un clic.</p>
      `
    },
    {
      title: 'Financiero',
      description: 'Estados de cuenta automáticos con comprobantes profesionales y portal para padres.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>'),
      fullDescription: `
        <p><strong>Gestión financiera automatizada. Los padres dejan de preguntarte "¿cuánto debo?" por WhatsApp 24/7.</strong></p>
        
        <p><strong>Gestión de Productos y Servicios:</strong></p>
        <ul>
          <li><strong>Clasificación:</strong> Académico, Alimentación, Vestuario, Transporte, etc.</li>
          <li><strong>Conceptos:</strong> Pensión, Matrícula, Almuerzo, Uniforme, Servicios extra</li>
          <li><strong>Detalle completo:</strong> Fecha, valor, valor pagado, saldo pendiente</li>
          <li><strong>Trazabilidad:</strong> Usuario que registró cada cargo</li>
        </ul>
        
        <p><strong>Registro de Pagos:</strong></p>
        <ul>
          <li><strong>Múltiples métodos:</strong> Efectivo, Nequi, transferencia bancaria, etc.</li>
          <li><strong>Referencia bancaria:</strong> Número de transacción para trazabilidad</li>
          <li><strong>Estado:</strong> Contabilizado / Pendiente con fecha de estado</li>
          <li><strong>Acciones:</strong> Editar, contabilizar, imprimir, ver detalle, eliminar (con permisos)</li>
        </ul>
        
        <p><strong>Comprobantes Profesionales:</strong></p>
        <ul>
          <li><strong>Generación automática:</strong> Con datos del establecimiento (nombre, NIT, ciudad)</li>
          <li><strong>Número consecutivo:</strong> Control interno de documentos</li>
          <li><strong>Detalle completo:</strong> Conceptos aplicados, valores, saldos</li>
          <li><strong>Espacio para firmas:</strong> "Recibido por" y "Aprobado por"</li>
          <li><strong>Opciones:</strong> Imprimir, exportar PDF, compartir por WhatsApp</li>
        </ul>
        
        <p><strong>Portal para Padres 24/7:</strong></p>
        <ul>
          <li><strong>Estado de cuenta en tiempo real:</strong> Total cobrado, saldo pendiente, valor pagado, vencido</li>
          <li><strong>Fotos de actividades diarias:</strong> Ven qué hace su hijo cada día en el establecimiento</li>
          <li><strong>Evaluaciones académicas:</strong> Seguimiento del progreso por áreas</li>
          <li><strong>Asistencia y observaciones:</strong> Registro completo de ingresos, salidas y notas</li>
          <li><strong>Descarga de documentos:</strong> Exportar estados de cuenta a PDF, compartir por WhatsApp</li>
          <li><strong>Auto-servicio:</strong> Los padres consultan cuando quieran, sin molestar por WhatsApp</li>
        </ul>
        
        <p><strong>Beneficio clave:</strong> Ahorra horas semanales en generar estados de cuenta manualmente y responder consultas de padres. Profesionaliza la imagen del establecimiento con documentos formales. Los padres se autoatienden y ven en tiempo real todo lo relacionado con su hijo: finanzas, fotos, evaluaciones y más.</p>
      `
    },
    {
      title: 'CRM Admisiones',
      description: 'Seguimiento de visitas con temperatura de prospecto y conversión de matrículas.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>'),
      fullDescription: `
        <p><strong>Sistema profesional de admisiones. los establecimientos pierden 3-4 matrículas al mes porque no hay seguimiento estructurado.</strong></p>
        
        <p><strong>Registro de Visitas:</strong></p>
        <ul>
          <li><strong>Información de la visita:</strong> Fecha, hora, tipo de contacto, canal de captación</li>
          <li><strong>Quién nos visita:</strong> Datos completos de los padres</li>
          <li><strong>Datos del niño:</strong> Información del prospecto</li>
          <li><strong>Observaciones del asesor:</strong> Notas libres para contexto</li>
        </ul>
        
        <p><strong>Temperatura del Prospecto:</strong></p>
        <ul>
          <li><strong>Explorando:</strong> Está conociendo opciones, no hay urgencia</li>
          <li><strong>Listo para despegar:</strong> Muestra interés alto, probable cierre pronto</li>
          <li><strong>No le interesó:</strong> Descartó la opción</li>
          <li><strong>Sembrando semilla:</strong> Interesado pero con restricciones temporales</li>
        </ul>
        
        <p><strong>Seguimiento Estructurado:</strong></p>
        <ul>
          <li><strong>Cuándo hacer seguimiento:</strong> Fecha programada del próximo contacto</li>
          <li><strong>Horario preferido:</strong> Mejores horas para contactar</li>
          <li><strong>Quién decide:</strong> Identificar el tomador de decisiones</li>
        </ul>
        
        <p><strong>Compromisos del establecimiento:</strong></p>
        <ul>
          <li>Agendar segunda visita</li>
          <li>Enviar documentos</li>
          <li>Compartir lista de precios</li>
          <li>Otros compromisos personalizables</li>
        </ul>
        
        <p><strong>Dashboard de Conversión:</strong></p>
        <ul>
          <li>Métricas de visitas vs matrículas</li>
          <li>Estadísticas por canal de captación</li>
          <li>Temperatura promedio de prospectos</li>
          <li>Seguimientos pendientes</li>
        </ul>
        
        <p><strong>Beneficio clave:</strong> Protocolo profesional de admisiones. Cada visita se trabaja con estructura, seguimiento automático y compromisos claros. Mayor conversión = más matrículas.</p>
      `
    },
    {
      title: 'Operaciones',
      description: 'Control de inventarios + Limpieza + Medidas antropométricas (EXCLUSIVO).',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>'),
      fullDescription: `
        <p><strong>Control operativo completo. ÚNICO EN EL MERCADO - Ningún competidor ofrece control de inventarios.</strong></p>
        
        <p><strong>Control de Inventarios (EXCLUSIVO):</strong></p>
        <ul>
          <li><strong>Productos de Mobiliario:</strong> Inventario de elementos físicos con mantenimiento</li>
          <li><strong>Productos de Limpieza:</strong> Inventario con alertas de faltantes</li>
          <li><strong>Productos de Alimentación:</strong> Control con vida útil y fechas de vencimiento</li>
          <li><strong>Movimientos:</strong> Entradas, salidas y ajustes con trazabilidad</li>
          <li><strong>Alertas automáticas:</strong> Notificaciones cuando algo está por agotarse</li>
        </ul>
        
        <p><strong>Registro de Limpieza:</strong></p>
        <ul>
          <li><strong>Áreas Físicas:</strong> Espacios del establecimiento con mobiliario asignado</li>
          <li><strong>Fichas técnicas:</strong> Procesos de limpieza y desinfección por área</li>
          <li><strong>Frecuencia:</strong> Diaria, semanal, mensual según área</li>
          <li><strong>Responsables:</strong> Asignación de personal por área</li>
          <li><strong>Trazabilidad:</strong> Quién limpió, cuándo y qué productos usó</li>
        </ul>
        
        <p><strong>Medidas Antropométricas:</strong></p>
        <ul>
          <li><strong>Registro masivo:</strong> Captura de peso y talla de múltiples niños rápidamente</li>
          <li><strong>Historial completo:</strong> Evolución del crecimiento con gráficas</li>
          <li><strong>Cumplimiento normativo:</strong> Requisito de Secretaría de Salud</li>
          <li><strong>Integración:</strong> Datos visibles en Vista 360° del estudiante</li>
        </ul>
        
        <p><strong>Gestión de Alimentación:</strong></p>
        <ul>
          <li><strong>Menús del restaurante:</strong> Planificación de menús e ítems</li>
          <li><strong>Salidas por clasificación:</strong> Registro de productos usados en cocina</li>
          <li><strong>Integración financiera:</strong> Genera cargos automáticos al padre</li>
        </ul>
        
        <p><strong>Beneficio clave:</strong> Control real de inventarios con alertas. Cumplimiento automático de Secretaría de Salud con fichas técnicas de limpieza. Auditorías listas en segundos, no en días.</p>
      `
    },
    {
      title: 'Reportes',
      description: 'Listos con un clic para auditorías, reuniones y Secretaría de Salud.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'),
      fullDescription: `
        <p><strong>Reportes automáticos sin esfuerzo. Generar reportes toma horas de trabajo manual. Con GENIALISIS: un clic.</strong></p>
        
        <p><strong>Reportes Académicos:</strong></p>
        <ul>
          <li><strong>Calificaciones por Sprint:</strong> Seguimiento y evaluación de sprints académicos con progreso detallado</li>
          <li><strong>Calificaciones por Estudiante:</strong> Reporte individual con promedios por área e indicador</li>
          <li><strong>Boletines para padres:</strong> Exportables a PDF con formato profesional</li>
          <li><strong>Análisis de cobertura:</strong> Verificación de que todos los indicadores fueron trabajados</li>
        </ul>
        
        <p><strong>Reportes Operativos:</strong></p>
        <ul>
          <li><strong>Reporte de Asistencia:</strong> Control y análisis por fecha con indicadores de puntualidad</li>
          <li><strong>Reporte de Alimentación:</strong> Control del servicio con valores y productos consumidos</li>
          <li><strong>Inventarios:</strong> Estado actual con alertas de faltantes y próximos a vencer</li>
          <li><strong>Limpieza:</strong> Fichas técnicas listas para Secretaría de Salud</li>
        </ul>
        
        <p><strong>Reportes Financieros:</strong></p>
        <ul>
          <li><strong>Estado de Cartera:</strong> Saldos pendientes, vencidos y pagos proyectados</li>
          <li><strong>Movimientos Financieros:</strong> Ingresos, egresos y flujo de caja</li>
          <li><strong>Análisis por concepto:</strong> Pensiones, matrículas, alimentación, servicios extra</li>
          <li><strong>Estados de cuenta:</strong> Por estudiante o consolidados</li>
        </ul>
        
        <p><strong>Reportes para Auditorías:</strong></p>
        <ul>
          <li><strong>Reporte General de Estudiantes:</strong> Información completa de toda la población</li>
          <li><strong>Tamizajes de Desarrollo:</strong> Análisis integral por áreas de desarrollo infantil</li>
          <li><strong>Medidas antropométricas:</strong> Seguimiento nutricional con gráficas de evolución</li>
          <li><strong>Cumplimiento normativo:</strong> Todo lo que Secretaría de Salud requiere</li>
        </ul>
        
        <p><strong>Características Transversales:</strong></p>
        <ul>
          <li><strong>Exportación múltiple:</strong> PDF, Excel, impresión directa</li>
          <li><strong>Filtros avanzados:</strong> Por fecha, grupo, área, estado</li>
          <li><strong>Compartir:</strong> WhatsApp, email, descarga</li>
          <li><strong>Actualización automática:</strong> Datos siempre al día sin regenerar</li>
        </ul>
        
        <p><strong>Beneficio clave:</strong> Auditorías de Secretaría de Salud resueltas en segundos, no en días. Reuniones con padres con datos actualizados. Transparencia total con evidencia verificable.</p>
      `
    }
  ];

  differentiators: Differentiator[] = [
    {
      title: 'Control de Inventarios',
      description: 'ÚNICO en el mercado. Ningún competidor lo ofrece. Sabe exactamente qué tienes, qué falta y cuándo reordenar.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
      badge: 'EXCLUSIVO'
    },
    {
      title: 'Metodología Ágil',
      description: 'Sprints educativos con cobertura curricular garantizada al 100%. No promesas, sino certeza medible.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      badge: ''
    },
    {
      title: '100% Colombia',
      description: 'Cumple requisitos de Secretaría de Salud + Soporte local que entiende tu contexto y habla tu idioma.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>',
      badge: ''
    },
    {
      title: 'Evaluaciones Incluidas',
      description: 'Competidores cobran $80.000 extra por evaluaciones. En GENIALISIS están incluidas sin costo adicional.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
      badge: ''
    },
    {
      title: 'Tarifa Plana',
      description: 'Hasta 50 estudiantes sin cobro adicional. Predecible, transparente, justo. Sin sorpresas en la factura.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
      badge: ''
    },
    {
      title: 'Todo Incluido',
      description: 'Sin costos ocultos, sin módulos extra, sin sorpresas. Un precio, todo el poder del sistema completo.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      badge: ''
    }
  ];

  faqs: FAQ[] = [
    {
      question: '¿Por qué GENIALISIS incluye control de inventarios y ningún competidor lo ofrece?',
      answer: 'Porque entendimos que los establecimientos no solo gestionan niños y maestros, también manejan productos de limpieza, alimentación y mobiliario. Las auditorías de Secretaría de Salud exigen trazabilidad de limpieza y desinfección. Sin inventarios, los establecimientos pierden días preparando fichas técnicas manualmente. Con GENIALISIS, está listo en segundos.'
    },
    {
      question: '¿Cómo garantizan el 100% de cobertura curricular?',
      answer: 'Con nuestra metodología de Sprints Académicos. El sistema tiene "tanques de capacidad" por grupo y área. Si intentas crear más actividades de las que caben en 2 semanas, el sistema te alerta. También visualizas en tiempo real qué logros e indicadores aún no tienen actividades asignadas. No es una promesa, es una certeza medible con datos.'
    },
    {
      question: '¿Cuánto tiempo toma implementar GENIALISIS en mi establecimiento?',
      answer: 'La implementación es rápida. Incluimos capacitación completa del equipo y soporte durante todo el proceso. La mayoría de establecimientos están operando en menos de 2 semanas. Si necesitas migrar datos desde Excel o sistemas anteriores, ofrecemos servicio de migración y digitación de información base.'
    },
    {
      question: '¿Es verdad que evaluar 15 niños toma solo 5 minutos?',
      answer: 'Sí. La evaluación está integrada en la actividad pedagógica, no es trabajo extra. La docente evalúa en DOS momentos: al inicio (estado de ánimo + salud) y al final (efectividad + intentos). La interfaz muestra todos los niños en una sola pantalla. Son ~20 segundos por niño. Total: 5 minutos. Los reportes se generan automáticamente.'
    },
    {
      question: '¿Cómo funciona el modelo de precios?',
      answer: 'Somos el sistema de gestión escolar con el mejor precio del mercado y la mejor relación costo-beneficio. Tarifa plana mensual sin cobros adicionales por módulos. Todo incluido: evaluaciones, inventarios, CRM, reportes, portal para padres y soporte. Mientras otros competidores cobran extra por evaluaciones y funcionalidades adicionales, con GENIALISIS pagas un precio justo, predecible y sin sorpresas.'
    },
    {
      question: '¿Qué pasa si decido no continuar después de los 60 días?',
      answer: 'Te devolvemos el 100% de tu inversión sin preguntas Y te entregamos todos tus datos en formatos estándar (Excel, PDF). No quedas en ceros. Mantienes todo lo que construiste durante esos 60 días. ¿Por qué ofrecemos esto? Porque sabemos que una vez pruebes GENIALISIS, no querrás volver al caos de Excel + WhatsApp + cuadernos.'
    },
    {
      question: '¿Necesito conocimientos técnicos para usar GENIALISIS?',
      answer: 'No. Si sabes usar Word y Excel, puedes usar GENIALISIS. La capacitación es parte de la implementación. Además, tu equipo sigue trabajando como siempre: las maestras registran actividades y evaluaciones, las directoras consultan dashboards, los padres ven información de sus hijos. Todo es intuitivo y está diseñado para el flujo de trabajo real de un establecimiento educativo colombiano.'
    },
    {
      question: '¿Los padres pueden ver información de sus hijos?',
      answer: 'Sí. GENIALISIS incluye un portal exclusivo para padres donde pueden consultar 24/7: fotos de las actividades diarias, estado de cuenta detallado, evaluaciones académicas, asistencia, observaciones, medidas antropométricas y más. Los padres dejan de preguntar por WhatsApp porque tienen toda la información actualizada en tiempo real. Esto libera tiempo de las maestras y profesionaliza la comunicación con las familias.'
    },
    {
      question: '¿Puedo personalizar GENIALISIS para mi establecimiento?',
      answer: 'Sí. Los campos de clasificación curricular, criterios de evaluación y estructura de grupos son completamente parametrizables según tu proyecto educativo. Puedes adaptar GENIALISIS a tu metodología sin perder la potencia del sistema.'
    },
    {
      question: '¿GENIALISIS funciona para establecimientos de cualquier tamaño?',
      answer: 'Sí. El sistema es escalable y funciona igual de bien con 20 o 200 estudiantes. La tarifa plana cubre hasta 50 estudiantes sin costo adicional. para establecimientos más grandes, tenemos planes empresariales con el mismo nivel de servicio.'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private contactosService: ContactosService,
    private configuracionService: ConfiguracionService
  ) {}

  ngOnInit(): void {
    this.initContactForm();
    this.cargarTamanosEstablecimiento();
    this.cargarTiposConsulta();
    this.cargarComoConocio();
    this.cargarConfiguracionContacto();
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initAnimations();
    }, 100);
  }

  initContactForm(): void {
    this.contactForm = this.fb.group({
      nombreEstablecimiento: ['', [Validators.required, Validators.minLength(3)]],
      nombreContacto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]],
      tamanoEstablecimiento: [''],
      tipoConsulta: ['', Validators.required],
      comoConocio: ['', Validators.required],
      comoConocioDetalle: [''],
      mensaje: ['']
    });

    // Escuchar cambios en comoConocio para mostrar/ocultar campo detalle
    this.contactForm.get('comoConocio')?.valueChanges.subscribe(value => {
      this.onComoConocioChange(value);
    });
  }

  initAnimations(): void {
    // Hero logo animation con CSS (sin GSAP)
    const heroLogo = document.querySelector('.hero-logo') as HTMLElement;
    if (heroLogo) {
      heroLogo.style.animation = 'float 3s ease-in-out infinite';
    }

    // Intersection Observer para animaciones al scroll (OPTIMIZADO)
    const observerOptions = {
      threshold: 0.05, // Reducido de 0.1 para que detecte antes
      rootMargin: '0px 0px -50px 0px' // Reducido de -100px para aparecer más pronto
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observar todos los elementos que queremos animar
    const animatedElements = document.querySelectorAll(
      '.stat-card, .problem-card, .flow-step, .module-card, .diff-card, .guarantee-card, .faq-item, .benefit-card'
    );

    animatedElements.forEach((el, index) => {
      // Agregar delay escalonado MÁS RÁPIDO
      (el as HTMLElement).style.transitionDelay = `${index * 0.05}s`; // Reducido de 0.1s a 0.05s
      observer.observe(el);
    });
  }

  scrollToContact(): void {
    this.contactSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollToModules(): void {
    this.modulesSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  openModuleModal(module: Module): void {
    this.selectedModule = module;
    this.showModal = true;
    
    // Animación CSS pura para el modal
    setTimeout(() => {
      const modalOverlay = document.querySelector('.modal-overlay') as HTMLElement;
      const modalContent = document.querySelector('.modal-content') as HTMLElement;
      
      if (modalOverlay && modalContent) {
        modalOverlay.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
        modalContent.style.opacity = '1';
      }
    }, 10);
  }

  closeModal(): void {
    const modalOverlay = document.querySelector('.modal-overlay') as HTMLElement;
    const modalContent = document.querySelector('.modal-content') as HTMLElement;
    
    if (modalOverlay && modalContent) {
      modalContent.style.transform = 'scale(0.9)';
      modalContent.style.opacity = '0';
      modalOverlay.style.opacity = '0';
      
      setTimeout(() => {
        this.showModal = false;
        this.selectedModule = null;
      }, 300);
    }
  }

  toggleFaq(index: number): void {
    this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
  }

  cargarTamanosEstablecimiento(): void {
    this.contactosService.obtenerTamanos().subscribe({
      next: (response) => {
        if (response.success) {
          this.tamanosEstablecimiento = response.tamanos;
        }
      },
      error: (error) => {
        console.error('Error cargando tamaños:', error);
      }
    });
  }

  cargarTiposConsulta(): void {
    this.contactosService.obtenerTiposConsulta().subscribe({
      next: (response) => {
        if (response.success) {
          this.tiposConsulta = response.tipos;
        }
      },
      error: (error) => {
        console.error('Error cargando tipos de consulta:', error);
      }
    });
  }

  cargarComoConocio(): void {
    this.contactosService.obtenerComoConocio().subscribe({
      next: (response) => {
        if (response.success) {
          this.canalesComoConocio = response.canales;
        }
      },
      error: (error) => {
        console.error('Error cargando canales:', error);
      }
    });
  }

  onComoConocioChange(canalId: number): void {
    const canalSeleccionado = this.canalesComoConocio.find(c => c.id === Number(canalId));
    
    if (canalSeleccionado?.pide_detalle) {
      this.mostrarDetalleComoConocio = true;
      this.contactForm.get('comoConocioDetalle')?.setValidators([Validators.required]);
    } else {
      this.mostrarDetalleComoConocio = false;
      this.contactForm.get('comoConocioDetalle')?.clearValidators();
      this.contactForm.get('comoConocioDetalle')?.setValue('');
    }
    this.contactForm.get('comoConocioDetalle')?.updateValueAndValidity();
  }

  getPlaceholderDetalle(): string {
    const canalId = this.contactForm.get('comoConocio')?.value;
    if (!canalId) return 'Por favor especifica';
    
    const canal = this.canalesComoConocio.find(c => c.id === Number(canalId));
    return canal?.placeholder_detalle || 'Por favor especifica';
  }

  cargarConfiguracionContacto(): void {
    this.configuracionService.obtenerConfiguracionesContacto().subscribe({
      next: (response) => {
        if (response.success && response.contacto) {
          this.whatsappUrl = response.contacto.whatsapp || 'https://wa.me/573118181816';
          this.telefonoContacto = response.contacto.telefono || '+57 311 8181816';
          this.emailContacto = response.contacto.correos?.[0] || 'contacto@genialisis.com';
        }
      },
      error: (error) => {
        console.error('Error cargando configuración:', error);
        // Valor por defecto ya está asignado
      }
    });
  }

  abrirWhatsApp(): void {
    if (this.whatsappUrl) {
      const mensaje = encodeURIComponent('Hola, me gustaría conocer más sobre GENIALISIS para mi establecimiento educativo.');
      const urlCompleta = `${this.whatsappUrl}?text=${mensaje}`;
      window.open(urlCompleta, '_blank');
    }
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;

    this.contactosService.crearContacto(this.contactForm.value).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.showSuccessMessage = true;
          this.contactForm.reset();

          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Error al enviar formulario:', error);
          this.isSubmitting = false;
          alert('Hubo un error al enviar el formulario. Por favor intenta nuevamente.');
        }
      });
  }

  abrirPaginaModal(pagina: string): void {
    console.log('abrirPaginaModal llamado con:', pagina);
    const paginas: {[key: string]: {titulo: string, contenido: string}} = {
      'sobre-nosotros': {
        titulo: 'Sobre Nosotros',
        contenido: `
          <h3>Nuestra Misión</h3>
          <p>En GENIALISIS creemos que la tecnología debe simplificar la gestión educativa, no complicarla. Desarrollamos soluciones intuitivas y poderosas que permiten a los establecimientos educativos enfocarse en lo que realmente importa: ofrecer educación de calidad.</p>
          
          <h3>¿Quiénes Somos?</h3>
          <p>Somos un equipo colombiano apasionado por la educación y la tecnología. Con años de experiencia trabajando directamente con instituciones educativas, entendemos profundamente los desafíos que enfrentan establecimientos educativos como escuelas de danza, teatro, música, idiomas, deportes y centros de formación de todo tipo.</p>
          
          <p>Nacimos de la frustración de ver a directores y administradores perdiendo horas valiosas en tareas administrativas que podrían automatizarse. Vimos cómo establecimientos pequeños y medianos no podían acceder a sistemas profesionales por sus costos prohibitivos o complejidad técnica.</p>
          
          <h3>Nuestra Visión</h3>
          <p>Ser la plataforma líder en gestión educativa para establecimientos de todos los tamaños en América Latina, democratizando el acceso a herramientas profesionales de administración que antes solo estaban disponibles para grandes instituciones.</p>
          
          <h3>Nuestros Valores</h3>
          <ul>
            <li><strong>Simplicidad:</strong> La tecnología debe ser invisible. GENIALISIS es tan intuitivo que cualquier persona puede usarlo sin capacitación técnica.</li>
            <li><strong>Transparencia:</strong> Sin letra pequeña. Tarifa plana, sin costos ocultos, sin sorpresas en la factura.</li>
            <li><strong>Compromiso:</strong> Tu éxito es nuestro éxito. Estamos contigo desde el día uno con soporte dedicado.</li>
            <li><strong>Innovación:</strong> Escuchamos a nuestros usuarios y mejoramos constantemente el sistema con nuevas funcionalidades.</li>
          </ul>
        `
      },
      'contacto': {
        titulo: 'Contacto',
        contenido: `
          <h3>¿Tienes preguntas? Estamos aquí para ayudarte</h3>
          <p>Nuestro equipo está disponible para resolver todas tus dudas sobre GENIALISIS, ayudarte con la implementación o brindarte soporte técnico.</p>
          
          <h3>Horario de Atención</h3>
          <p><strong>Lunes a Sábado:</strong> 8:00 AM - 6:30 PM (Hora de Colombia)</p>
          <p>Respondemos todos los mensajes el mismo día si nos contactas dentro del horario de atención.</p>
          
          <h3>Canales de Contacto</h3>
          <ul>
            <li><strong>WhatsApp:</strong> <a href="${this.whatsappUrl}" target="_blank" style="color: #D4AF37;">${this.telefonoContacto}</a> (Respuesta inmediata)</li>
            <li><strong>Teléfono:</strong> <a href="tel:${this.telefonoContacto}" style="color: #D4AF37;">${this.telefonoContacto}</a></li>
            <li><strong>Email:</strong> <a href="mailto:${this.emailContacto}" style="color: #D4AF37;">${this.emailContacto}</a></li>
          </ul>
          
          <h3>¿Qué podemos hacer por ti?</h3>
          <ul>
            <li><strong>Demostración personalizada:</strong> Te mostramos el sistema adaptado a las necesidades de tu establecimiento</li>
            <li><strong>Cotización sin compromiso:</strong> Planes transparentes, sin letra pequeña</li>
            <li><strong>Soporte técnico:</strong> Ayuda con cualquier duda o problema</li>
            <li><strong>Asesoría en implementación:</strong> Te acompañamos en todo el proceso</li>
          </ul>
          
          <p style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <strong>💡 Tip:</strong> Si nos contactas por WhatsApp, recibimos tu mensaje de inmediato y podemos agendar una videollamada para mostrarte el sistema en tiempo real.
          </p>
        `
      },
      'politicas': {
        titulo: 'Política de Privacidad y Protección de Datos',
        contenido: `
          <p><em>Última actualización: Enero 2025</em></p>
          
          <h3>1. Información que Recopilamos</h3>
          <p>En GENIALISIS recopilamos únicamente la información necesaria para proporcionar nuestros servicios de gestión educativa:</p>
          <ul>
            <li><strong>Datos del establecimiento:</strong> Nombre, NIT, dirección, información de contacto</li>
            <li><strong>Datos de usuarios:</strong> Nombres, correos electrónicos, roles dentro del establecimiento</li>
            <li><strong>Datos de estudiantes:</strong> Información académica, asistencia, evaluaciones (según lo configurado por el establecimiento)</li>
            <li><strong>Datos de uso:</strong> Registros de actividad para mejorar el servicio y proveer soporte</li>
          </ul>
          
          <h3>2. Uso de la Información</h3>
          <p>Los datos recopilados se utilizan exclusivamente para:</p>
          <ul>
            <li>Proporcionar y mantener los servicios de GENIALISIS</li>
            <li>Mejorar la experiencia del usuario y desarrollar nuevas funcionalidades</li>
            <li>Comunicarnos contigo sobre actualizaciones, soporte técnico y servicios</li>
            <li>Cumplir con obligaciones legales y regulatorias</li>
            <li>Proteger la seguridad e integridad de nuestros sistemas</li>
          </ul>
          
          <p><strong>Importante:</strong> Nunca vendemos, alquilamos ni compartimos tus datos con terceros para fines comerciales.</p>
          
          <h3>3. Protección de Datos</h3>
          <p>La seguridad de tu información es nuestra prioridad. Implementamos múltiples capas de protección:</p>
          <ul>
            <li><strong>Encriptación:</strong> Todos los datos se transmiten mediante conexiones seguras (HTTPS/TLS)</li>
            <li><strong>Almacenamiento seguro:</strong> Bases de datos protegidas con acceso restringido</li>
            <li><strong>Copias de seguridad:</strong> Respaldos automáticos diarios</li>
            <li><strong>Acceso controlado:</strong> Solo personal autorizado puede acceder a los sistemas</li>
            <li><strong>Monitoreo continuo:</strong> Sistemas de detección de amenazas 24/7</li>
          </ul>
          
          <h3>4. Tus Derechos (Ley 1581 de 2012 - Colombia)</h3>
          <p>Como titular de datos personales, tienes derecho a:</p>
          <ul>
            <li><strong>Acceder:</strong> Conocer qué información personal tenemos sobre ti</li>
            <li><strong>Actualizar:</strong> Corregir datos incompletos o inexactos</li>
            <li><strong>Eliminar:</strong> Solicitar la eliminación de tus datos (sujeto a obligaciones legales)</li>
            <li><strong>Revocar:</strong> Retirar la autorización para el tratamiento de tus datos</li>
            <li><strong>Portabilidad:</strong> Exportar tus datos en formato estructurado</li>
          </ul>
          
          <h3>5. Cookies y Tecnologías Similares</h3>
          <p>Utilizamos cookies esenciales para el funcionamiento del sistema (autenticación, preferencias). No utilizamos cookies de publicidad ni rastreadores de terceros.</p>
          
          <h3>6. Menores de Edad</h3>
          <p>Los datos de estudiantes menores de edad son procesados bajo responsabilidad del establecimiento educativo, quien debe obtener el consentimiento de padres o tutores según la normativa vigente.</p>
          
          <h3>7. Contacto - Datos Personales</h3>
          <p>Para ejercer tus derechos o resolver dudas sobre privacidad:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:${this.emailContacto}" style="color: #D4AF37;">${this.emailContacto}</a></li>
            <li><strong>WhatsApp:</strong> ${this.telefonoContacto}</li>
          </ul>
          
          <p style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <strong>📌 Nota:</strong> Esta política puede actualizarse periódicamente. Te notificaremos sobre cambios importantes a través de la plataforma.
          </p>
        `
      },
      'terminos': {
        titulo: 'Términos y Condiciones de Uso',
        contenido: `
          <p><em>Última actualización: Enero 2025</em></p>
          
          <h3>1. Aceptación de Términos</h3>
          <p>Al acceder y utilizar GENIALISIS, aceptas estar legalmente vinculado por estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestra plataforma.</p>
          
          <h3>2. Descripción del Servicio</h3>
          <p>GENIALISIS es una plataforma SaaS (Software as a Service) de gestión integral para establecimientos educativos que incluye módulos de:</p>
          <ul>
            <li>Gestión de estudiantes y familias</li>
            <li>Administración académica y evaluaciones</li>
            <li>Control de asistencia</li>
            <li>Gestión financiera y facturación</li>
            <li>Portal para padres/acudientes</li>
            <li>Inventarios y activos</li>
            <li>Reportes y analíticas</li>
          </ul>
          
          <h3>3. Registro y Cuenta de Usuario</h3>
          <p><strong>El usuario se compromete a:</strong></p>
          <ul>
            <li>Proporcionar información veraz y actualizada durante el registro</li>
            <li>Mantener la confidencialidad de sus credenciales de acceso</li>
            <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
            <li>No compartir su cuenta con terceros no autorizados</li>
            <li>Ser responsable de todas las actividades realizadas bajo su cuenta</li>
          </ul>
          
          <h3>4. Uso Aceptable</h3>
          <p><strong>Está prohibido:</strong></p>
          <ul>
            <li>Utilizar el servicio para fines ilegales o no autorizados</li>
            <li>Intentar acceder a áreas restringidas del sistema</li>
            <li>Realizar ingeniería inversa, descompilar o desensamblar el software</li>
            <li>Transmitir virus, malware o cualquier código malicioso</li>
            <li>Sobrecargar intencionalmente los servidores</li>
            <li>Extraer datos mediante técnicas automatizadas (scraping) sin autorización</li>
            <li>Compartir información sensible de estudiantes sin autorización legal</li>
          </ul>
          
          <h3>5. Propiedad Intelectual</h3>
          <p>Todo el contenido, diseño, código fuente, logos, marcas y funcionalidades de GENIALISIS son propiedad exclusiva de nuestra empresa y están protegidos por las leyes de propiedad intelectual de Colombia y tratados internacionales.</p>
          
          <p><strong>Tus datos son tuyos:</strong> Los datos que ingresas en la plataforma (información de estudiantes, evaluaciones, etc.) son y permanecen de tu propiedad. GENIALISIS solo actúa como procesador de estos datos.</p>
          
          <h3>6. Precio y Facturación</h3>
          <ul>
            <li>Los precios se publican en nuestro sitio web y pueden variar según el plan contratado</li>
            <li>Las tarifas se cobran mensualmente por adelantado</li>
            <li>Los impuestos aplicables (IVA) se adicionan según la legislación vigente</li>
            <li>Aceptamos pagos mediante transferencia bancaria, PSE y tarjetas de crédito</li>
            <li>El no pago suspende temporalmente el acceso al servicio</li>
          </ul>
          
          <h3>7. Garantía de Servicio</h3>
          <p><strong>Garantizamos 30 días sin riesgo:</strong> Si dentro de los primeros 30 días decides que GENIALISIS no es para ti, te devolvemos el 100% de lo pagado, sin preguntas.</p>
          
          <p><strong>Disponibilidad del servicio:</strong> Nos esforzamos por mantener una disponibilidad del 99.5%, pero no podemos garantizar un servicio ininterrumpido debido a:</p>
          <ul>
            <li>Mantenimientos programados (notificados con anticipación)</li>
            <li>Fallas de proveedores de internet o infraestructura</li>
            <li>Eventos de fuerza mayor</li>
          </ul>
          
          <h3>8. Limitación de Responsabilidad</h3>
          <p>GENIALISIS no será responsable por:</p>
          <ul>
            <li>Pérdida de datos causada por acciones del usuario o terceros</li>
            <li>Daños indirectos, incidentales o consecuentes</li>
            <li>Interrupciones del servicio por causas fuera de nuestro control</li>
            <li>Decisiones tomadas basándose en información del sistema</li>
          </ul>
          
          <p><strong>Nuestra responsabilidad máxima</strong> se limita al monto pagado por el servicio en los últimos 3 meses.</p>
          
          <h3>9. Cancelación y Terminación</h3>
          <p><strong>Puedes cancelar en cualquier momento:</strong></p>
          <ul>
            <li>La cancelación debe solicitarse con 30 días de anticipación</li>
            <li>Conservamos tus datos por 60 días después de la cancelación</li>
            <li>Puedes exportar toda tu información antes de cancelar</li>
            <li>No hay penalidades ni costos de cancelación</li>
          </ul>
          
          <p><strong>Podemos suspender o terminar el servicio si:</strong></p>
          <ul>
            <li>Incumples estos términos de manera grave o reiterada</li>
            <li>Hay actividades fraudulentas o ilegales</li>
            <li>No se realiza el pago después de 15 días de vencido</li>
          </ul>
          
          <h3>10. Modificaciones</h3>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios importantes serán notificados con 30 días de anticipación a través de:</p>
          <ul>
            <li>Email a la dirección registrada</li>
            <li>Notificación dentro de la plataforma</li>
            <li>Publicación en nuestro sitio web</li>
          </ul>
          
          <h3>11. Ley Aplicable y Jurisdicción</h3>
          <p>Estos términos se rigen por las leyes de la República de Colombia. Cualquier disputa se resolverá en los tribunales de Bogotá D.C., Colombia.</p>
          
          <h3>12. Contacto Legal</h3>
          <p>Para asuntos legales o preguntas sobre estos términos:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:${this.emailContacto}" style="color: #D4AF37;">${this.emailContacto}</a></li>
            <li><strong>WhatsApp:</strong> ${this.telefonoContacto}</li>
          </ul>
          
          <p style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <strong>📌 Transparencia total:</strong> Si algo en estos términos no está claro, contáctanos. Preferimos una conversación honesta antes que un malentendido legal.
          </p>
        `
      }
    };

    if (paginas[pagina]) {
    console.log("Buscando página:", pagina);
    console.log("Página encontrada:", paginas[pagina]);
      this.paginaModalTitulo = paginas[pagina].titulo;
      this.paginaModalContenido = this.sanitizer.bypassSecurityTrustHtml(paginas[pagina].contenido);
      console.log("Abriendo modal...");
      this.showPaginaModal = true;
      document.body.style.overflow = 'hidden';
    }
      console.log("showPaginaModal:", this.showPaginaModal);
  }

  cerrarPaginaModal(): void {
    this.showPaginaModal = false;
    this.paginaModalTitulo = '';
    this.paginaModalContenido = '';
    document.body.style.overflow = 'auto';
  }

  toggleMenuMobile(): void {
    this.menuMobileAbierto = !this.menuMobileAbierto;
    if (this.menuMobileAbierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  cerrarMenuMobile(): void {
    this.menuMobileAbierto = false;
    document.body.style.overflow = 'auto';
  }

  scrollToSection(sectionId: string): void {
    console.log('scrollToSection llamado con:', sectionId);
    this.cerrarMenuMobile();
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}