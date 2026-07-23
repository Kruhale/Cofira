import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Button } from '../../components/shared/button/button';
import { SuscripcionService } from '../../services/suscripcion.service';
import { NotificacionService } from '../../services/notificacion.service';
import { IdiomaService } from '../../services/idioma.service';
import { DatosPagoSimulado } from '../../models/suscripcion.model';
import { TEXTOS_ACCESO_PRO } from './textos-acceso-pro';

@Component({
  selector: 'app-acceso-pro',
  standalone: true,
  imports: [Button, ReactiveFormsModule, DatePipe, RouterLink],
  templateUrl: './acceso-pro.html',
  styleUrl: './acceso-pro.scss',
})
export class AccesoPro {
  readonly mostrarFormularioPago = signal(false);
  readonly estaCargando = signal(false);
  readonly pagoExitoso = signal(false);

  private readonly router = inject(Router);
  private readonly suscripcionService = inject(SuscripcionService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly idiomaService = inject(IdiomaService);

  /* Textos de la página en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_ACCESO_PRO[this.idiomaService.idioma()]);

  readonly esPro = this.suscripcionService.esPro;
  readonly suscripcion = this.suscripcionService.suscripcionActual;

  constructor() {
    /* Un usuario que YA es PRO debe ver su suscripción, no el muro de venta:
       pedimos el estado real al servidor. Si falla, el muro es el fallback seguro. */
    this.suscripcionService.refrescarEstado().subscribe({ error: function () {} });
  }

  readonly formularioPago = new FormGroup({
    numeroTarjeta: new FormControl('', [Validators.required, Validators.pattern(/^\d{16}$/)]),
    nombreTitular: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fechaExpiracion: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
    ]),
    cvv: new FormControl('', [Validators.required, Validators.pattern(/^\d{3,4}$/)]),
    renovacionAutomatica: new FormControl(true),
  });

  readonly beneficiosPro = computed(() => this.textos().beneficiosPro);

  mostrarPago(): void {
    this.mostrarFormularioPago.set(true);
  }

  ocultarPago(): void {
    this.mostrarFormularioPago.set(false);
    this.formularioPago.reset({ renovacionAutomatica: true });
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }

  get numeroTarjetaFormateado(): string {
    const valorSinEspacios = this.formularioPago.get('numeroTarjeta')?.value || '';
    const valorLimpio = valorSinEspacios.replace(/\s/g, '');
    const grupos = valorLimpio.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : valorLimpio;
  }

  formatearNumeroTarjeta(evento: Event): void {
    const inputElement = evento.target as HTMLInputElement;
    const valorActual = inputElement.value;
    const valorSoloNumeros = valorActual.replace(/\D/g, '');
    const valorLimitado = valorSoloNumeros.slice(0, 16);
    this.formularioPago.get('numeroTarjeta')?.setValue(valorLimitado);
  }

  formatearFechaExpiracion(evento: Event): void {
    const inputElement = evento.target as HTMLInputElement;
    const valorActual = inputElement.value;
    const valorSoloNumeros = valorActual.replace(/\D/g, '');
    const valorLimitado = valorSoloNumeros.slice(0, 4);

    if (valorLimitado.length >= 2) {
      const mes = valorLimitado.slice(0, 2);
      const anio = valorLimitado.slice(2);
      const valorFormateado = anio ? `${mes}/${anio}` : mes;
      this.formularioPago.get('fechaExpiracion')?.setValue(valorFormateado);
    } else {
      this.formularioPago.get('fechaExpiracion')?.setValue(valorLimitado);
    }
  }

  formatearCvv(evento: Event): void {
    const inputElement = evento.target as HTMLInputElement;
    const valorActual = inputElement.value;
    const valorSoloNumeros = valorActual.replace(/\D/g, '');
    const valorLimitado = valorSoloNumeros.slice(0, 4);
    this.formularioPago.get('cvv')?.setValue(valorLimitado);
  }

  puedeEnviar(): boolean {
    const formularioEsValido = this.formularioPago.valid;
    const noEstaCargando = !this.estaCargando();
    return formularioEsValido && noEstaCargando;
  }

  alEnviar(): void {
    if (!this.puedeEnviar()) {
      return;
    }

    this.estaCargando.set(true);

    const valoresFormulario = this.formularioPago.value;

    const datosPago: DatosPagoSimulado = {
      numeroTarjeta: valoresFormulario.numeroTarjeta!,
      nombreTitular: valoresFormulario.nombreTitular!,
      fechaExpiracion: valoresFormulario.fechaExpiracion!,
      cvv: valoresFormulario.cvv!,
      renovacionAutomatica: valoresFormulario.renovacionAutomatica ?? true,
    };

    this.suscripcionService.activarSuscripcionPro(datosPago).subscribe({
      next: function (this: AccesoPro) {
        this.estaCargando.set(false);
        this.pagoExitoso.set(true);
        this.notificacionService.exito(this.textos().avisoBienvenida);

        setTimeout(
          function (this: AccesoPro) {
            this.router.navigate(['/']);
          }.bind(this),
          2000,
        );
      }.bind(this),
      error: function (this: AccesoPro) {
        this.estaCargando.set(false);
        this.notificacionService.error(this.textos().avisoErrorPago);
      }.bind(this),
    });
  }
}
