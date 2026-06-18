import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContactosService, TamanoEstablecimiento, TipoConsulta, ComoConocio } from '../../services/contactos.service';
import { ConfiguracionService } from '../../services/configuracion.service';
import { SeoService } from '../../services/seo.service';
import { CalendlyService } from '../../services/calendly.service';

interface Stat {
  value: string;
  label: string;
  icon: SafeHtml;
}

interface Problem {
  icon: SafeHtml;
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
  iaNote?: string;
}

interface Differentiator {
  title: string;
  description: string;
  icon: SafeHtml;
  badge?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-landing-genialisis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
  // URL de agendamiento Calendly (se carga desde configuraciones públicas)
  calendlyUrl: string | null = null;
  // Controla la visibilidad del botón "volver arriba"
  mostrarBotonArriba: boolean = false;

  stats: Stat[] = [
    {
      value: '60%',
      label: 'Ahorro en tiempo administrativo',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>')
    },
    {
      value: '100%',
      label: 'Cobertura curricular garantizada',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>')
    },
    {
      value: '5 min',
      label: 'Para evaluar 15 niños',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 13V9.5"/><path d="M9 2h6"/><path d="m18 6 1.4-1.4"/></svg>')
    },
    {
      value: '24/7',
      label: 'Acceso para padres',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>')
    }
  ];

  problems: Problem[] = [
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>'),
      title: 'Información dispersa',
      description: 'Datos en Excel, WhatsApp, cuadernos físicos. Imposible encontrar nada cuando más lo necesitas.'
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>'),
      title: 'Docentes sobrecargadas',
      description: 'Horas extras registrando calificaciones de memoria fuera de horario laboral.'
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.4 8.4 0 0 1-4-1L3 21l2-5.5a8.4 8.4 0 0 1-1-4A8.5 8.5 0 0 1 21 11.5z"/><path d="M9.6 9a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2-2.4 2"/><path d="M12 15.5h.01"/></svg>'),
      title: 'Padres sin información',
      description: 'Preguntan por WhatsApp 24/7 porque no tienen acceso a datos en tiempo real.'
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>'),
      title: 'Sin control de inventarios',
      description: 'Te enteras de faltantes cuando ya es demasiado tarde para reordenar.'
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>'),
      title: 'Cobertura incierta',
      description: 'No sabes con certeza si trabajaste todos los indicadores prometidos.'
    },
    {
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="m22 17-8.5-8.5-5 5L2 7"/><path d="M16 17h6v-6"/></svg>'),
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
      title: 'Gestión académica',
      description: 'Estudiantes (vista 360°), sprints, logros, calificaciones y asistencia en un solo flujo.',
      iaNote: 'Análisis de cobertura con IA',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'),
      fullDescription: `
        <p><strong>El corazón pedagógico de GENIALISIS: toda la vida académica del niño en un solo lugar.</strong></p>
        <p><strong>Vista 360° del estudiante:</strong></p>
        <ul>
          <li>Datos personales, médicos y acudientes con control granular de permisos.</li>
          <li>Estado de cuenta, asistencia, evaluaciones y medidas en una sola pantalla.</li>
          <li>Historial completo académico, disciplinario y social.</li>
        </ul>
        <p><strong>Sprints, logros e indicadores:</strong></p>
        <ul>
          <li>Metodología ágil con ciclos cortos y control de capacidad por grupo y área.</li>
          <li>Visualización del progreso y alerta de logros sin actividades asignadas.</li>
          <li>La IA analiza la cobertura curricular y detecta vacíos automáticamente.</li>
        </ul>
        <p><strong>Calificaciones en tiempo real:</strong> evaluación en dos momentos (ánimo/salud y efectividad/intentos), todos los niños en una pantalla. ~5 minutos para un grupo completo y los reportes se generan solos.</p>
        <p><strong>Asistencia:</strong> registro de ingreso y salida con verificación de personas autorizadas y conteo en tiempo real.</p>
      `
    },
    {
      title: 'Financiero',
      description: 'Estados de cuenta, comprobantes en 1 clic, cartera y recaudo siempre al día.',
      iaNote: 'Registro de comprobantes con IA',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>'),
      fullDescription: `
        <p><strong>Gestión financiera automatizada. Los padres dejan de preguntar "¿cuánto debo?" por WhatsApp.</strong></p>
        <ul>
          <li><strong>Productos y conceptos:</strong> pensión, matrícula, alimentación, transporte y servicios extra con detalle y saldos.</li>
          <li><strong>Registro de pagos:</strong> múltiples métodos, referencia bancaria y estado de contabilización.</li>
          <li><strong>Comprobantes profesionales:</strong> generación automática con datos del establecimiento, número consecutivo y opción de imprimir, exportar o compartir por WhatsApp.</li>
          <li><strong>IA:</strong> registra el comprobante de pago leyéndolo por ti, sin digitación manual.</li>
          <li><strong>Cartera y recaudo:</strong> saldos pendientes, vencidos y proyección, siempre actualizados.</li>
        </ul>
      `
    },
    {
      title: 'Portal de padres',
      description: 'Consulta 24/7: fotos diarias, evaluaciones, estado de cuenta y asistencia.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'),
      fullDescription: `
        <p><strong>Un espacio exclusivo donde los acudientes ven todo lo de su hijo en tiempo real, 24/7.</strong></p>
        <ul>
          <li><strong>Fotos de las actividades diarias:</strong> ven qué hace su hijo cada día.</li>
          <li><strong>Estado de cuenta:</strong> total cobrado, pagado, pendiente y vencido.</li>
          <li><strong>Evaluaciones académicas:</strong> seguimiento del progreso por áreas.</li>
          <li><strong>Asistencia y observaciones:</strong> ingresos, salidas y notas del día.</li>
          <li><strong>Documentos:</strong> descarga de estados de cuenta en PDF y compartir por WhatsApp.</li>
        </ul>
        <p><strong>Beneficio:</strong> los padres se autoatienden, dejan de saturar el WhatsApp del jardín y la comunicación se profesionaliza.</p>
      `
    },
    {
      title: 'WhatsApp integrado',
      description: 'Bandeja única: las conversaciones quedan en el sistema, varios colaboradores responden el mismo chat, con análisis y monitoreo.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-4-1L3 21l2-5.5a8.38 8.38 0 0 1-1-4A8.5 8.5 0 0 1 21 11.5z"/></svg>'),
      fullDescription: `
        <p><strong>Toda la comunicación con los padres por WhatsApp Business, centralizada dentro de GENIALISIS.</strong></p>
        <ul>
          <li><strong>Bandeja única:</strong> cada conversación con los acudientes queda registrada en el sistema.</li>
          <li><strong>Trabajo en equipo:</strong> varios colaboradores responden el mismo chat sin perder el hilo.</li>
          <li><strong>Notificaciones automáticas:</strong> fotos, comprobantes y asistencia enviados a los padres.</li>
          <li><strong>Análisis y monitoreo:</strong> mide tiempos de respuesta y supervisa la calidad de la atención.</li>
        </ul>
        <p><strong>Beneficio:</strong> nada se pierde en chats personales y la comunicación queda como activo del establecimiento, no de una persona.</p>
      `
    },
    {
      title: 'Gestión de colaboradores',
      description: 'Control de ingreso, actividades, permisos, agenda, pagos y préstamos del personal.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'),
      fullDescription: `
        <p><strong>El módulo de talento humano de tu jardín, sin hojas de cálculo paralelas.</strong></p>
        <ul>
          <li><strong>Control de ingreso:</strong> registro de entradas y salidas del personal.</li>
          <li><strong>Actividades:</strong> seguimiento de las labores y responsabilidades de cada colaborador.</li>
          <li><strong>Permisos y agenda:</strong> solicitudes, ausencias y programación del equipo.</li>
          <li><strong>Pagos y préstamos:</strong> nómina, anticipos y préstamos con su trazabilidad.</li>
        </ul>
        <p><strong>Beneficio:</strong> orden y transparencia con tu equipo, todo conectado al resto del sistema.</p>
      `
    },
    {
      title: 'CRM de admisiones',
      description: 'Seguimiento de visitas, temperatura de prospecto y conversión de matrículas.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>'),
      fullDescription: `
        <p><strong>Protocolo profesional de admisiones. Deja de perder matrículas por falta de seguimiento.</strong></p>
        <ul>
          <li><strong>Registro de visitas:</strong> datos de los padres, del niño y canal de captación.</li>
          <li><strong>Temperatura del prospecto:</strong> explorando, listo para despegar, sembrando semilla o descartado.</li>
          <li><strong>Seguimiento estructurado:</strong> próximo contacto, horario preferido y compromisos del establecimiento.</li>
          <li><strong>Dashboard de conversión:</strong> visitas vs matrículas y estadísticas por canal.</li>
        </ul>
        <p><strong>Beneficio:</strong> cada visita se trabaja con método y seguimiento, lo que se traduce en más matrículas.</p>
      `
    },
    {
      title: 'Operaciones e inventarios',
      description: 'Control de inventarios (exclusivo en el mercado), limpieza y alimentación.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>'),
      fullDescription: `
        <p><strong>Control operativo completo. Único en el mercado: ningún competidor ofrece inventarios.</strong></p>
        <ul>
          <li><strong>Inventarios:</strong> mobiliario, limpieza y alimentación con movimientos y alertas de faltantes.</li>
          <li><strong>Registro de limpieza:</strong> áreas, fichas técnicas, frecuencia y responsables.</li>
          <li><strong>Alimentación:</strong> menús, salidas de cocina e integración financiera.</li>
          <li><strong>Cumplimiento normativo:</strong> fichas listas para auditorías de Secretaría de Salud.</li>
        </ul>
        <p><strong>Beneficio:</strong> auditorías resueltas en segundos y cero sorpresas con faltantes.</p>
      `
    },
    {
      title: 'Restaurante',
      description: 'La cocina sabe cuántos almuerzos y onces preparar cada día. Los cobros de lo vendido se generan automáticamente y el inventario se controla solo.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7a3 3 0 0 0 3 3v10"/><path d="M6 2v6"/><path d="M9 2v6"/><path d="M16 2c-1.7 0-3 1.8-3 4.5s1.3 4.5 3 4.5v11"/></svg>'),
      fullDescription: `
        <p><strong>Gestión completa del servicio de alimentación, conectada con cocina, finanzas e inventario.</strong></p>
        <ul>
          <li><strong>Producción del día:</strong> la cocina ve exactamente cuántos almuerzos y onces debe preparar, según lo registrado.</li>
          <li><strong>Cobros automáticos:</strong> lo vendido (almuerzos, onces y extras) se cobra solo, sin digitar nada aparte.</li>
          <li><strong>Inventario:</strong> el consumo descuenta insumos y alerta faltantes para reordenar a tiempo.</li>
          <li><strong>Integración:</strong> el dato fluye al estado de cuenta del padre y a los reportes financieros.</li>
        </ul>
        <p><strong>Beneficio:</strong> cero desperdicio, cero cobros perdidos y una cocina que sabe qué hacer cada mañana.</p>
      `
    },
    {
      title: 'Tamizajes y antropometría',
      description: 'Tamizajes de desarrollo (EAD-3) y medidas de peso y talla, listos para Secretaría de Salud.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'),
      fullDescription: `
        <p><strong>Seguimiento del desarrollo y crecimiento de cada niño, con respaldo normativo.</strong></p>
        <ul>
          <li><strong>Tamizajes de desarrollo:</strong> evaluación por áreas con la escala EAD-3.</li>
          <li><strong>Medidas antropométricas:</strong> registro masivo de peso y talla con gráficas de evolución.</li>
          <li><strong>Integración:</strong> los datos alimentan la Vista 360° del estudiante.</li>
          <li><strong>Cumplimiento:</strong> reportes listos para Secretaría de Salud.</li>
        </ul>
        <p><strong>Beneficio:</strong> evidencia del desarrollo infantil lista para padres y entes de control.</p>
      `
    }
  ];

  differentiators: Differentiator[] = [
    {
      title: 'IA integrada en los procesos',
      description: 'La IA trabaja dentro del sistema: analiza tu cobertura curricular, registra los comprobantes de pago y responde tus consultas sobre los datos del jardín.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/><path d="M19 4v3M20.5 5.5h-3M5 17v2M6 18H4"/></svg>'),
      badge: 'IA'
    },
    {
      title: 'Control de Inventarios',
      description: 'Único en el mercado. Ningún competidor lo ofrece. Sabe exactamente qué tienes, qué falta y cuándo reordenar.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>'),
      badge: 'EXCLUSIVO'
    },
    {
      title: 'Metodología Ágil',
      description: 'Sprints educativos con cobertura curricular garantizada al 100%. No promesas, sino certeza medible.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg>'),
      badge: ''
    },
    {
      title: '100% Colombia',
      description: 'Cumple requisitos de Secretaría de Salud + Soporte local que entiende tu contexto y habla tu idioma.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>'),
      badge: ''
    },
    {
      title: 'Evaluaciones Incluidas',
      description: 'Competidores cobran $80.000 extra por evaluaciones. En GENIALISIS están incluidas sin costo adicional.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'),
      badge: ''
    },
    {
      title: 'Tarifa Plana',
      description: 'Hasta 50 estudiantes sin cobro adicional. Predecible, transparente, justo. Sin sorpresas en la factura.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>'),
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
      answer: 'Con nuestra metodología de Sprints Académicos. El sistema tiene "tanques de capacidad" por grupo y área. Si intentas crear más actividades de las que caben en 2 semanas, el sistema te alerta. También visualizas en tiempo real qué logros e indicadores aún no tienen actividades asignadas, y la IA analiza la cobertura por ti. No es una promesa, es una certeza medible con datos.'
    },
    {
      question: '¿Cómo está integrada la IA en GENIALISIS?',
      answer: 'La IA trabaja dentro de tus procesos, no como un extra de moda: analiza tu cobertura curricular y detecta vacíos, registra los comprobantes de pago leyéndolos por ti, y responde consultas en lenguaje natural sobre los datos del jardín. Está pensada para ahorrarte trabajo real, no para impresionar.'
    },
    {
      question: '¿Es verdad que evaluar 15 niños toma solo 5 minutos?',
      answer: 'Sí. La evaluación está integrada en la actividad pedagógica, no es trabajo extra. La docente evalúa en DOS momentos: al inicio (estado de ánimo + salud) y al final (efectividad + intentos). La interfaz muestra todos los niños en una sola pantalla. Son ~20 segundos por niño. Total: 5 minutos. Los reportes se generan automáticamente.'
    },
    {
      question: '¿Cómo funciona el modelo de precios?',
      answer: 'Somos el sistema de gestión escolar con el mejor precio del mercado y la mejor relación costo-beneficio. Tarifa plana mensual sin cobros adicionales por módulos ni sorpresas. Todo incluido: evaluaciones, inventarios, CRM, IA, portal para padres, WhatsApp y soporte. Pagas un precio justo, predecible y sin letra pequeña.'
    },
    {
      question: '¿Qué pasa si decido no continuar después de los 60 días?',
      answer: 'Te devolvemos el 100% de tu inversión sin preguntas Y te entregamos todos tus datos en formatos estándar (Excel, PDF). No quedas en ceros. Mantienes todo lo que construiste durante esos 60 días.'
    },
    {
      question: '¿Necesito conocimientos técnicos para usar GENIALISIS?',
      answer: 'No. Si sabes usar Word y Excel, puedes usar GENIALISIS. La capacitación es parte de la implementación. Tu equipo sigue trabajando como siempre: las maestras registran actividades, las directoras consultan dashboards y los padres ven la información de sus hijos. Todo es intuitivo y está diseñado para el flujo de trabajo real de un establecimiento educativo colombiano.'
    },
    {
      question: '¿Los padres pueden ver información de sus hijos?',
      answer: 'Sí. GENIALISIS incluye un portal exclusivo para padres donde consultan 24/7: fotos de las actividades diarias, estado de cuenta, evaluaciones, asistencia, observaciones y más. Además, toda la comunicación por WhatsApp queda centralizada en el sistema. Los padres dejan de preguntar por WhatsApp porque tienen todo actualizado en tiempo real.'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private contactosService: ContactosService,
    private configuracionService: ConfiguracionService,
    private seoService: SeoService,
    private calendlyService: CalendlyService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.initContactForm();
    // El SEO se aplica siempre (prerender + navegador) para que quede en el HTML estático.
    this.aplicarSeo();

    // Las llamadas a la API y las APIs de navegador solo corren en el cliente,
    // no durante el prerender en tiempo de build.
    if (isPlatformBrowser(this.platformId)) {
      this.cargarTamanosEstablecimiento();
      this.cargarTiposConsulta();
      this.cargarComoConocio();
      this.cargarConfiguracionContacto();
      this.cargarConfiguracionPublica();
      this.calendlyService.cargarWidget();
      window.scrollTo(0, 0);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initAnimations();
      }, 100);
    }
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
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Escuchar cambios en comoConocio para mostrar/ocultar campo detalle
    this.contactForm.get('comoConocio')?.valueChanges.subscribe(value => {
      this.onComoConocioChange(value);
    });
  }

  /**
   * Aplica metadatos y datos estructurados JSON-LD (Organization,
   * SoftwareApplication y FAQPage) construidos a partir del contenido real.
   */
  aplicarSeo(): void {
    const tituloPagina = 'GENIALISIS | Software de gestión para jardines infantiles y preescolares en Colombia';
    const descripcionPagina = 'GENIALISIS es la plataforma colombiana que centraliza gestión académica, finanzas, portal de padres, WhatsApp, colaboradores, admisiones, inventarios y tamizajes para jardines infantiles, con IA integrada en los procesos. Ahorra 60% del tiempo administrativo y garantiza el 100% de cobertura curricular.';
    const urlSitio = 'https://genialisis.com/';

    this.seoService.actualizarMetadatos({
      titulo: tituloPagina,
      descripcion: descripcionPagina,
      url: urlSitio,
      imagen: urlSitio + 'assets/images/logo.png',
      tipo: 'website'
    });

    const organizationLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'GENIALISIS',
      url: urlSitio,
      logo: urlSitio + 'assets/images/logo.png',
      description: descripcionPagina,
      areaServed: 'CO',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: this.telefonoContacto,
        email: this.emailContacto,
        contactType: 'sales',
        availableLanguage: ['Spanish']
      }
    };

    const softwareLd = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'GENIALISIS',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'Software de gestión escolar',
      operatingSystem: 'Web',
      url: urlSitio,
      description: descripcionPagina,
      featureList: this.modules.map(m => m.title),
      offers: {
        '@type': 'Offer',
        category: 'Suscripción mensual de tarifa plana'
      }
    };

    const faqLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    this.seoService.establecerJsonLd(organizationLd, 'ld-organization');
    this.seoService.establecerJsonLd(softwareLd, 'ld-software');
    this.seoService.establecerJsonLd(faqLd, 'ld-faq');
  }

  initAnimations(): void {
    // Hero logo animation con CSS (sin GSAP)
    const heroLogo = document.querySelector('.hero-logo') as HTMLElement;
    if (heroLogo) {
      heroLogo.style.animation = 'float 3s ease-in-out infinite';
    }

    // Intersection Observer para animaciones al scroll.
    // El margen inferior negativo retrasa el disparo hasta que el elemento
    // ya entró bien en pantalla, así el efecto de "flotar" sí se nota.
    const observerOptions = {
      threshold: 0,
      rootMargin: '0px 0px -160px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observar elementos agrupados: el escalonado se reinicia en cada grupo,
    // así las secciones de más abajo no acumulan un retraso largo.
    const groupSelectors = [
      '.stat-card', '.problem-card', '.flow-step', '.benefit-card',
      '.module-card', '.diff-card', '.faq-item'
    ];

    groupSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, index) => {
        (el as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
      });
    });

    // Elementos únicos (sin escalonado), aparecen de inmediato al entrar en pantalla
    document.querySelectorAll('.guarantee-card').forEach(el => {
      observer.observe(el);
    });
  }

  scrollToContact(): void {
    this.contactSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollToModules(): void {
    this.modulesSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Muestra u oculta el botón "volver arriba" según el desplazamiento.
   * Solo corre en el navegador; durante el prerender no hay eventos de scroll.
   */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.mostrarBotonArriba = window.scrollY > 600;
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * CTA principal "Agendar Demo": abre Calendly si hay URL configurada;
   * si no, cae al comportamiento anterior de hacer scroll al formulario.
   */
  agendarDemo(): void {
    if (this.calendlyUrl) {
      this.calendlyService.abrirPopup(this.calendlyUrl);
    } else {
      this.scrollToContact();
    }
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

  /**
   * Carga la URL de Calendly desde las configuraciones públicas del backend.
   */
  cargarConfiguracionPublica(): void {
    this.configuracionService.obtenerConfiguracionesPublicas().subscribe({
      next: (response) => {
        if (response.success && response.configuraciones.calendly_url) {
          this.calendlyUrl = response.configuraciones.calendly_url;
        }
      },
      error: (error) => {
        console.error('Error cargando configuración pública:', error);
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

          <p style="margin-top: 24px; padding: 16px; background: rgba(212,175,55,0.1); border-radius: 8px;">
            <strong>Tip:</strong> Si nos contactas por WhatsApp, recibimos tu mensaje de inmediato y podemos agendar una videollamada para mostrarte el sistema en tiempo real.
          </p>
        `
      }
    };

    if (paginas[pagina]) {
      this.paginaModalTitulo = paginas[pagina].titulo;
      this.paginaModalContenido = this.sanitizer.bypassSecurityTrustHtml(paginas[pagina].contenido);
      this.showPaginaModal = true;
      document.body.style.overflow = 'hidden';
    }
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
    this.cerrarMenuMobile();
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}