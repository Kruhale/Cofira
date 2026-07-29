import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Button } from '../../components/shared/button/button';
import { GimnasioService } from '../../services/gimnasio.service';
import { Ejercicio, FeedbackEjercicio } from '../../models/gimnasio.model';
import { IdiomaService } from '../../services/idioma.service';
import { NotificacionService } from '../../services/notificacion.service';
import { SuscripcionService } from '../../services/suscripcion.service';
import { RUTINA_DEMO } from '../../services/datos-demo';
import { BannerPro } from '../../components/shared/banner-pro/banner-pro';
import { TEXTOS_GIMNASIO } from './textos-gimnasio';

@Component({
  selector: 'app-gimnasio',
  standalone: true,
  imports: [FormsModule, Button, BannerPro],
  templateUrl: './gimnasio.html',
  styleUrl: './gimnasio.scss',
})
export class Gimnasio implements OnInit {
  private readonly gimnasioService = inject(GimnasioService);
  private readonly idiomaService = inject(IdiomaService);
  private readonly suscripcionService = inject(SuscripcionService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly enrutador = inject(Router);

  /* true cuando el servidor confirma que la cuenta NO es PRO: se enseña la
     rutina de ejemplo con el banner para activar PRO */
  readonly esDemo = signal(false);

  /* Textos de la interfaz en el idioma vigente: cambiar el signal repinta todo */
  readonly textos = computed(() => TEXTOS_GIMNASIO[this.idiomaService.idioma()]);

  /* Claves SIEMPRE en español: el servicio indexa los ejercicios por estos
     nombres de día; solo la vista usa los días traducidos de diasSemana */
  private readonly diasClaveRutina = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  readonly diasSemana = computed(() => this.textos().diasSemana);

  readonly diaActualIndex = signal(0);

  feedback: FeedbackEjercicio = {
    semanaNumero: 1,
    ejerciciosDificiles: '',
    puedeMasPeso: false,
    comentarios: '',
    nivelFatiga: 3,
  };

  readonly isLoading = this.gimnasioService.isLoading;
  readonly error = this.gimnasioService.error;
  readonly tieneRutina = this.gimnasioService.tieneRutina;
  readonly estadoIA = this.gimnasioService.estadoIA;
  readonly semanaActual = this.gimnasioService.semanaActual;
  readonly feedbackEnviado = this.gimnasioService.feedbackEnviado;

  readonly ejerciciosDelDia = computed(() => {
    const diaSeleccionado = this.diasClaveRutina[this.diaActualIndex()];
    const ejerciciosPorDia = this.gimnasioService.ejerciciosPorDia();
    return ejerciciosPorDia[diaSeleccionado] ?? [];
  });

  /* Grupo muscular del día activo (p. ej. "Pecho y tríceps") para la banda */
  readonly grupoDelDia = computed(() => {
    const diaSeleccionado = this.diasClaveRutina[this.diaActualIndex()];
    const rutina = this.gimnasioService.rutinaGenerada();

    if (!rutina) {
      return '';
    }

    const diaEncontrado = rutina.diasEjercicio.find(
      (dia) => dia.diaSemana === diaSeleccionado,
    );
    return diaEncontrado?.grupoMuscular ?? '';
  });

  ngOnInit(): void {
    this.establecerDiaActual();
    this.gimnasioService.cargarSemanaDeStorage();

    // La autoridad sobre PRO es el servidor: con cuenta gratis se enseña la
    // rutina de ejemplo y no se piden datos personales al backend
    this.suscripcionService.refrescarEstado().subscribe({
      next: (estado) => {
        if (estado.esPro) {
          this.cargarDatosPro();
        } else {
          this.activarModoDemo();
        }
      },
      error: () => this.activarModoDemo(),
    });
  }

  private cargarDatosPro(): void {
    this.gimnasioService.obtenerSemanaActual().subscribe({
      next: (semana) => {
        this.feedback.semanaNumero = semana;
      },
    });

    this.cargarMiRutina();
  }

  private activarModoDemo(): void {
    this.esDemo.set(true);
    this.gimnasioService.cargarRutinaDemo(RUTINA_DEMO);
    this.seleccionarPrimerDiaConEjercicios();
  }

  /* En demo el día real puede ser de descanso: se salta al primer día con
     ejercicios para que la tabla de ejemplo nunca aparezca vacía */
  private seleccionarPrimerDiaConEjercicios(): void {
    const diaSeleccionado = this.diasClaveRutina[this.diaActualIndex()];
    const diasConRutina = RUTINA_DEMO.diasEjercicio.map((dia) => dia.diaSemana);

    if (diasConRutina.includes(diaSeleccionado)) {
      return;
    }

    const indicePrimerDia = this.diasClaveRutina.indexOf(diasConRutina[0]);
    if (indicePrimerDia >= 0) {
      this.diaActualIndex.set(indicePrimerDia);
    }
  }

  readonly hechosDelDia = computed(() => {
    return this.ejerciciosDelDia().filter((ejercicio) => ejercicio.realizado === true).length;
  });

  /* Vídeo de técnica: búsqueda directa del ejercicio en YouTube, en pestaña nueva */
  urlTecnica(nombreEjercicio: string): string {
    return 'https://www.youtube.com/results?search_query=' + encodeURIComponent('técnica ' + nombreEjercicio);
  }

  private readonly sanitizador = inject(DomSanitizer);
  readonly tecnicaAbierta = signal<string | null>(null);

  /* null = buscando el vídeo; '' = sin vídeo directo (queda el enlace) */
  readonly videoTecnicaId = signal<string | null>(null);

  /* El vídeo del ejercicio se reproduce DENTRO de la app; el sanitizador es
     obligatorio para el src de un iframe */
  readonly urlTecnicaEmbebida = computed<SafeResourceUrl | null>(() => {
    const videoId = this.videoTecnicaId();
    if (!videoId) {
      return null;
    }
    /* rel=0: al terminar solo sugiere vídeos del mismo canal, no de otros temas */
    const url = 'https://www.youtube-nocookie.com/embed/' + videoId + '?hl=es&rel=0';
    return this.sanitizador.bypassSecurityTrustResourceUrl(url);
  });

  abrirTecnica(nombreEjercicio: string): void {
    this.tecnicaAbierta.set(nombreEjercicio);
    this.videoTecnicaId.set(null);

    this.gimnasioService.obtenerVideoTecnica(nombreEjercicio).subscribe({
      next: (respuesta) => this.videoTecnicaId.set(respuesta.videoId || ''),
    });
  }

  cerrarTecnica(): void {
    this.tecnicaAbierta.set(null);
    this.videoTecnicaId.set(null);
  }

  seleccionarFatiga(nivel: number): void {
    this.feedback.nivelFatiga = nivel;
  }

  marcarRealizado(ejercicio: Ejercicio, realizado: boolean): void {
    const diaSeleccionado = this.diasClaveRutina[this.diaActualIndex()];
    const nuevoValor = ejercicio.realizado === realizado ? null : realizado;
    this.gimnasioService.marcarEjercicioRealizado(diaSeleccionado, ejercicio.id, nuevoValor);

    // En demo el check funciona en local, pero no se persiste nada
    if (nuevoValor === true && !this.esDemo()) {
      this.gimnasioService.guardarProgreso(diaSeleccionado).subscribe({
        next: () => {
          console.log('Progreso guardado correctamente');
        },
        error: (errorCapturado) => {
          console.error('Error al guardar progreso:', errorCapturado);
        },
      });
    }
  }

  enviarFeedback(): void {
    if (this.esDemo()) {
      this.enrutador.navigate(['/acceso-pro']);
      return;
    }

    this.feedback.semanaNumero = this.semanaActual();

    this.gimnasioService.guardarFeedback(this.feedback).subscribe({
      next: () => {
        this.notificacionService.exito(this.textos().feedbackGuardado);
        this.resetFeedback();
      },
      error: (errorCapturado) => {
        console.error('Error al guardar feedback:', errorCapturado);
      },
    });
  }

  private establecerDiaActual(): void {
    const hoy = new Date();
    const diaHoy = hoy.getDay();
    const indiceCorregido = diaHoy === 0 ? 6 : diaHoy - 1;
    this.diaActualIndex.set(indiceCorregido);
  }

  private cargarMiRutina(): void {
    this.gimnasioService.obtenerMiRutina().subscribe();
  }

  private resetFeedback(): void {
    this.feedback = {
      semanaNumero: this.semanaActual(),
      ejerciciosDificiles: '',
      puedeMasPeso: false,
      comentarios: '',
      nivelFatiga: 3,
    };
  }

  // Decimal al estilo del idioma vigente: 62.5 → "62,5" (es) / "62.5" (en);
  // los pesos enteros del backend (60) se quedan tal cual, sin ",0" forzado
  comaDecimal(valor: number): string {
    const cifra = Number.isInteger(valor) ? String(valor) : valor.toFixed(1);
    return this.idiomaService.idioma() === 'en' ? cifra : cifra.replace('.', ',');
  }
}
