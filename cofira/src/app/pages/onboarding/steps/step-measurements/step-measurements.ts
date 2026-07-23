import { Component, computed, effect, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OnboardingService } from '../../../../services/onboarding.service';
import { IdiomaService } from '../../../../services/idioma.service';
import { Button } from '../../../../components/shared/button/button';
import { Notification } from '../../../../components/shared/notification/notification';
import { TEXTOS_ONBOARDING } from '../../textos-onboarding';

@Component({
  selector: 'app-step-measurements',
  standalone: true,
  imports: [FormsModule, Button, Notification],
  templateUrl: './step-measurements.html',
  styleUrl: './step-measurements.scss',
})
export class StepMeasurements {
  @Output() continuar = new EventEmitter<void>();
  readonly alturaCm = signal<number | null>(null);
  readonly pesoActualKg = signal<number | null>(null);
  readonly mostrarNotificacion = signal(false);
  readonly mensajeNotificacion = signal('');
  private readonly onboardingService = inject(OnboardingService);
  private readonly idiomaService = inject(IdiomaService);
  private ultimoErrorMostrado = '';

  /* Textos del paso en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_ONBOARDING[this.idiomaService.idioma()].medidas);

  readonly errorAltura = computed(() => {
    const altura = this.alturaCm();
    if (altura === null) return null;
    if (altura < 100) return this.textos().errorAlturaMinima;
    if (altura > 250) return this.textos().errorAlturaMaxima;
    return null;
  });

  readonly errorPeso = computed(() => {
    const peso = this.pesoActualKg();
    if (peso === null) return null;
    if (peso < 10) return this.textos().errorPesoMinimo;
    if (peso > 300) return this.textos().errorPesoMaximo;
    return null;
  });

  constructor() {
    const datosFormulario = this.onboardingService.formData();
    if (datosFormulario.heightCm) {
      this.alturaCm.set(datosFormulario.heightCm);
    }
    if (datosFormulario.currentWeightKg) {
      this.pesoActualKg.set(datosFormulario.currentWeightKg);
    }

    effect(() => {
      const errorAltura = this.errorAltura();
      const errorPeso = this.errorPeso();
      const errorActual = errorAltura || errorPeso;

      if (errorActual && errorActual !== this.ultimoErrorMostrado) {
        this.ultimoErrorMostrado = errorActual;
        this.mensajeNotificacion.set(errorActual);
        this.mostrarNotificacion.set(true);
      } else if (!errorActual) {
        this.ultimoErrorMostrado = '';
      }
    });
  }

  cerrarNotificacion(): void {
    this.mostrarNotificacion.set(false);
  }

  alCambiarAltura(valor: string): void {
    const numero = parseFloat(valor);
    this.alturaCm.set(isNaN(numero) ? null : numero);
  }

  alCambiarPeso(valor: string): void {
    const numero = parseFloat(valor);
    this.pesoActualKg.set(isNaN(numero) ? null : numero);
  }

  alContinuar(): void {
    const altura = this.alturaCm();
    const peso = this.pesoActualKg();
    if (altura && peso) {
      this.onboardingService.setField('heightCm', altura);
      this.onboardingService.setField('currentWeightKg', peso);
      this.continuar.emit();
    }
  }

  puedeContinuar(): boolean {
    const altura = this.alturaCm();
    const peso = this.pesoActualKg();
    return (
      altura !== null &&
      altura >= 100 &&
      altura <= 250 &&
      peso !== null &&
      peso >= 10 &&
      peso <= 300
    );
  }
}
