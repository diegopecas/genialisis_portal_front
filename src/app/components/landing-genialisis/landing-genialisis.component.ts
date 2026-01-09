import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BoxData {
  title: string;
  subtitle: string;
  icon: string;
  content: string;
  position: 'left' | 'center' | 'right' | 'wide';
  delay: number;
  isCTA?: boolean;
  modalContent?: {
    subtitle: string;
    body: string;
  };
}

@Component({
  selector: 'app-landing-genialisis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-genialisis.component.html',
  styleUrl: './landing-genialisis.component.scss'
})
export class LandingGenialisisComponent implements OnInit, AfterViewInit {
  
  showModal = false;
  modalTitle = '';
  modalSubtitle = '';
  modalBody = '';

  boxes: BoxData[] = [
    {
      title: 'El Problema',
      subtitle: 'Excel + WhatsApp + Cuadernos',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
      content: 'Información dispersa, docentes sobrecargadas, padres sin acceso, sin control de inventarios, cobertura curricular incierta.',
      position: 'left',
      delay: 0.2,
      modalContent: {
        subtitle: 'Excel + WhatsApp + Cuadernos = Caos',
        body: `
          <ul class="modal-list">
            <li><strong>Información dispersa:</strong> Datos en Excel, WhatsApp, cuadernos físicos. Imposible encontrar nada cuando más lo necesitas.</li>
            <li><strong>Docentes sobrecargadas:</strong> Horas extras registrando calificaciones de memoria fuera de horario laboral.</li>
            <li><strong>Padres sin información:</strong> Preguntan por WhatsApp 24/7 porque no tienen acceso a datos en tiempo real.</li>
            <li><strong>Sin control de inventarios:</strong> Te enteras de faltantes cuando ya es demasiado tarde para reordenar.</li>
            <li><strong>Cobertura curricular incierta:</strong> No sabes con certeza si trabajaste todos los indicadores prometidos.</li>
            <li><strong>Pérdida de matrículas:</strong> 3-4 matrículas perdidas al mes por falta de seguimiento profesional y organización visible.</li>
          </ul>
        `
      }
    },
    {
      title: 'La Solución',
      subtitle: 'Ecosistema Integrado',
      icon: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
      content: '<div class="big-number">60%</div>Menos tiempo administrativo con trazabilidad completa',
      position: 'right',
      delay: 0.5,
      modalContent: {
        subtitle: 'Un registro = Múltiples procesos automáticos',
        body: `
          <p><strong>Ecosistema Integrado donde cada dato genera valor en múltiples puntos:</strong></p>
          <ul class="modal-list">
            <li><strong>60% menos tiempo administrativo:</strong> Ahorra 9+ horas semanales en tareas repetitivas.</li>
            <li><strong>100% trazabilidad:</strong> Cada acción queda registrada con fecha, hora y responsable.</li>
            <li><strong>Acceso 24/7 para padres:</strong> Portal transparente donde consultan todo sin molestar por WhatsApp.</li>
            <li><strong>Armonía operacional:</strong> No digitalizamos el caos, creamos sistemas que fluyen naturalmente.</li>
            <li><strong>Garantía de cobertura:</strong> Metodología ágil con sprints educativos que aseguran el 100% del plan de estudios.</li>
          </ul>
        `
      }
    },
    {
      title: '8 Módulos',
      subtitle: 'Todo integrado',
      icon: 'M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z',
      content: '',
      position: 'center',
      delay: 0.8,
      modalContent: {
        subtitle: 'Todo lo que necesitas en un solo lugar',
        body: `
          <ul class="modal-list">
            <li><strong>Estudiantes:</strong> Vista 360° con historial médico, académico, financiero y antropométrico.</li>
            <li><strong>Académico:</strong> Sprints + Logros + Indicadores con metodología ágil garantizando cobertura curricular.</li>
            <li><strong>Calificaciones:</strong> ~5 minutos para evaluar 15 niños en tiempo real, integrado con la clase.</li>
            <li><strong>Asistencia:</strong> Verificación de personas autorizadas con trazabilidad completa de ingresos y salidas.</li>
            <li><strong>Financiero:</strong> Estados de cuenta automáticos con comprobantes profesionales y portal para padres.</li>
            <li><strong>CRM Admisiones:</strong> Seguimiento de visitas con temperatura de prospecto y conversión de matrículas.</li>
            <li><strong>Operaciones:</strong> Control de inventarios + Limpieza + Medidas antropométricas (EXCLUSIVO).</li>
            <li><strong>Reportes:</strong> Listos con un clic para auditorías, reuniones y Secretaría de Salud.</li>
          </ul>
        `
      }
    },
    {
      title: '¿Por Qué GENIALISIS?',
      subtitle: 'Control de inventarios EXCLUSIVO',
      icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      content: 'Ningún competidor lo ofrece • Metodología ágil • 100% Colombia • Evaluaciones incluidas • Tarifa plana • Todo incluido',
      position: 'right',
      delay: 1.1,
      modalContent: {
        subtitle: 'Diferenciadores únicos en el mercado',
        body: `
          <ul class="modal-list">
            <li><strong>Control de Inventarios (EXCLUSIVO):</strong> Ningún competidor lo ofrece. Sabe exactamente qué tienes, qué falta y cuándo reordenar.</li>
            <li><strong>Metodología Ágil:</strong> Sprints educativos con cobertura curricular garantizada al 100%. No promesas, sino certeza.</li>
            <li><strong>100% Colombia:</strong> Cumple requisitos de Secretaría de Salud + Soporte local que entiende tu contexto.</li>
            <li><strong>Evaluaciones Incluidas:</strong> Competidores cobran $80.000 extra por evaluaciones. En GENIALISIS están incluidas.</li>
            <li><strong>Tarifa Plana:</strong> Hasta 50 estudiantes sin cobro adicional. Predecible, transparente, justo.</li>
            <li><strong>Todo Incluido:</strong> Sin costos ocultos, sin módulos extra, sin sorpresas. Un precio, todo el poder.</li>
          </ul>
        `
      }
    },
    {
      title: 'Garantía 60 Días',
      subtitle: 'Cero riesgo',
      icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
      content: 'Si no quedas satisfecho: devolvemos tu dinero Y te entregamos todos los datos. Sin pérdida de tiempo.',
      position: 'center',
      delay: 1.4,
      modalContent: {
        subtitle: 'Prueba sin riesgo',
        body: `
          <p><strong>Nuestra promesa es simple:</strong></p>
          <ul class="modal-list">
            <li><strong>60 días de prueba:</strong> Tiempo suficiente para validar que GENIALISIS transforma tu operación.</li>
            <li><strong>Devolución completa:</strong> Si no quedas satisfecho, devolvemos el 100% de tu inversión. Sin preguntas.</li>
            <li><strong>Tus datos son tuyos:</strong> Te entregamos toda la información que ingresaste en formatos estándar (Excel, PDF).</li>
            <li><strong>Sin pérdida de tiempo:</strong> No quedas en ceros. Mantienes todo lo que construiste durante la prueba.</li>
            <li><strong>Implementación incluida:</strong> Migración de datos, capacitación del equipo, soporte completo.</li>
          </ul>
          <p style="margin-top: 20px;"><strong>¿Por qué ofrecemos esto?</strong> Porque sabemos que una vez pruebes GENIALISIS, no querrás volver al caos.</p>
        `
      }
    },
    {
      title: 'Hablemos de tu jardín',
      subtitle: '',
      icon: '',
      content: 'Agenda una sesión de 30 minutos con nuestro equipo. Sin compromiso.',
      position: 'wide',
      delay: 1.7,
      isCTA: true
    }
  ];

  modulos = ['Estudiantes', 'Académico', 'Calificaciones', 'Asistencia', 'Financiero', 'CRM', 'Operaciones', 'Reportes'];

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initAnimations();
    }, 100);
  }

  initAnimations(): void {
    gsap.to('.logo-minimal', {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    const threadWrappers = document.querySelectorAll('.thread-wrapper');
    const boxWrappers = document.querySelectorAll('.box-wrapper');

    boxWrappers.forEach((wrapper: any, index) => {
      const threadWrapper = threadWrappers[index] as HTMLElement;
      const thread = threadWrapper?.querySelector('.thread') as HTMLElement;
      const box = wrapper.querySelector('.box') as HTMLElement;

      if (!thread || !box) return;

      if (index === 0) {
        // Primera caja: animación automática con delay
        gsap.fromTo(box, 
          { y: -200, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 3, 
            ease: 'elastic.out(1, 0.3)',
            delay: 0.3
          }
        );
      } else {
        // Resto de cajas: ScrollTrigger
        gsap.timeline({
          scrollTrigger: {
            trigger: threadWrapper,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        })
        .fromTo(box, 
          { y: -200, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 3, 
            ease: 'elastic.out(1, 0.3)'
          }
        );
      }
    });
  }

  @HostListener('mouseenter', ['$event'])
  onBoxHover(event: MouseEvent): void {
    const box = (event.target as HTMLElement).closest('.box');
    if (box && !box.classList.contains('cta-box')) {
      gsap.to(box, { y: -10, duration: 0.3, ease: 'power2.out' });
    }
  }

  @HostListener('mouseleave', ['$event'])
  onBoxLeave(event: MouseEvent): void {
    const box = (event.target as HTMLElement).closest('.box');
    if (box && !box.classList.contains('cta-box')) {
      gsap.to(box, { y: 0, duration: 0.3, ease: 'power2.out' });
    }
  }

  openModal(box: BoxData): void {
    if (box.isCTA || !box.modalContent) return;
    this.modalTitle = box.title;
    this.modalSubtitle = box.modalContent.subtitle;
    this.modalBody = box.modalContent.body;
    this.showModal = true;
    setTimeout(() => {
      const modal = document.querySelector('.modal-overlay');
      const content = document.querySelector('.modal-content');
      gsap.to(modal, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(content, { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' });
    }, 10);
  }

  closeModal(): void {
    const modal = document.querySelector('.modal-overlay');
    const content = document.querySelector('.modal-content');
    gsap.to(content, { scale: 0.5, rotation: 10, opacity: 0, duration: 0.3, ease: 'back.in(1.7)' });
    gsap.to(modal, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => { this.showModal = false; } });
  }

  onCtaClick(): void {
    alert('Agendar con un agente - TODO');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showModal) this.closeModal();
  }
}