import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Button } from '../../components/shared/button/button';
import { GimnasioService } from '../../services/gimnasio.service';
import { Ejercicio, FeedbackEjercicio } from '../../models/gimnasio.model';
import { IdiomaService } from '../../services/idioma.service';
import { TEXTOS_GIMNASIO } from './textos-gimnasio';

@Component({
  selector: 'app-gimnasio',
  standalone: true,
  imports: [FormsModule, Button],
  templateUrl: './gimnasio.html',
  styleUrl: './gimnasio.scss',
})
export class Gimnasio implements OnInit {
  private readonly gimnasioService = inject(GimnasioService);
  private readonly idiomaService = inject(IdiomaService);

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

  ngOnInit(): void {
    this.establecerDiaActual();
    this.gimnasioService.cargarSemanaDeStorage();

    this.gimnasioService.obtenerSemanaActual().subscribe({
      next: (semana) => {
        this.feedback.semanaNumero = semana;
      },
    });

    this.cargarMiRutina();
  }

  toggleEjercicio(ejercicio: Ejercicio): void {
    const diaSeleccionado = this.diasClaveRutina[this.diaActualIndex()];
    this.gimnasioService.toggleExpandirEjercicio(diaSeleccionado, ejercicio.id);
  }

  marcarRealizado(ejercicio: Ejercicio, realizado: boolean): void {
    const diaSeleccionado = this.diasClaveRutina[this.diaActualIndex()];
    const nuevoValor = ejercicio.realizado === realizado ? null : realizado;
    this.gimnasioService.marcarEjercicioRealizado(diaSeleccionado, ejercicio.id, nuevoValor);

    if (nuevoValor === true) {
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
    this.feedback.semanaNumero = this.semanaActual();

    this.gimnasioService.guardarFeedback(this.feedback).subscribe({
      next: () => {
        console.log('Feedback guardado correctamente');
        this.resetFeedback();
      },
      error: (errorCapturado) => {
        console.error('Error al guardar feedback:', errorCapturado);
      },
    });
  }

  cancelarFeedback(): void {
    this.resetFeedback();
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
