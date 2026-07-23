import { Component, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { NotificacionService } from '../../services/notificacion.service';
import { SuscripcionService } from '../../services/suscripcion.service';
import { CodigoIdioma, IdiomaService } from '../../services/idioma.service';
import { Button } from '../../components/shared/button/button';
import { TEXTOS_CONFIGURACION } from './textos-configuracion';

interface Preferencias {
  notificacionesEmail: boolean;
  notificacionesPush: boolean;
  recordatoriosEntrenamiento: boolean;
  recordatoriosComidas: boolean;
  unidadesPeso: string;
  unidadesAltura: string;
}

type SeccionConfiguracion = 'general' | 'notificaciones' | 'privacidad' | 'suscripcion' | 'cuenta';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [FormsModule, RouterLink, Button],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Configuracion {
  private readonly notificacionService = inject(NotificacionService);
  private readonly suscripcionService = inject(SuscripcionService);
  private readonly idiomaService = inject(IdiomaService);
  private readonly router = inject(Router);

  /* Textos de la página en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_CONFIGURACION[this.idiomaService.idioma()]);

  /* El selector de idioma lee y escribe directamente en el IdiomaService:
     así el ajuste cambia el idioma real de toda la aplicación */
  readonly idiomaActual = computed(() => this.idiomaService.idioma());

  readonly estaCargando = signal(false);
  readonly cargandoSuscripcion = signal(false);
  readonly seccionActiva = signal<SeccionConfiguracion>('general');

  readonly esPro = computed(
    function (this: Configuracion) {
      return this.suscripcionService.esPro();
    }.bind(this),
  );

  readonly suscripcionActual = computed(
    function (this: Configuracion) {
      return this.suscripcionService.suscripcionActual();
    }.bind(this),
  );

  readonly diasRestantes = computed(
    function (this: Configuracion) {
      return this.suscripcionService.obtenerDiasRestantes();
    }.bind(this),
  );

  readonly renovacionAutomatica = computed(
    function (this: Configuracion) {
      const suscripcion = this.suscripcionActual();
      return suscripcion?.renovacionAutomatica ?? false;
    }.bind(this),
  );

  readonly preferencias = signal<Preferencias>({
    notificacionesEmail: true,
    notificacionesPush: false,
    recordatoriosEntrenamiento: true,
    recordatoriosComidas: true,
    unidadesPeso: 'kg',
    unidadesAltura: 'cm',
  });

  /* Cada idioma se muestra en su propia lengua, por eso no se traduce */
  readonly idiomas: { codigo: CodigoIdioma; nombre: string }[] = [
    { codigo: 'es', nombre: 'Español' },
    { codigo: 'en', nombre: 'English' },
  ];

  readonly unidadesPesoOpciones = computed(() => this.textos().unidadesPesoOpciones);

  readonly unidadesAlturaOpciones = computed(() => this.textos().unidadesAlturaOpciones);

  cambiarIdiomaApp(codigo: string): void {
    if (codigo === 'es' || codigo === 'en') {
      this.idiomaService.cambiarIdioma(codigo);
    }
  }

  cambiarSeccion(seccion: SeccionConfiguracion): void {
    this.seccionActiva.set(seccion);
  }

  guardarPreferencias(): void {
    this.estaCargando.set(true);

    setTimeout(() => {
      this.estaCargando.set(false);
      this.notificacionService.exito(this.textos().avisoGuardado);
    }, 800);
  }

  togglePreferencia(clave: keyof Preferencias): void {
    const prefsActuales = this.preferencias();
    const valorActual = prefsActuales[clave];

    if (typeof valorActual === 'boolean') {
      this.preferencias.set({
        ...prefsActuales,
        [clave]: !valorActual,
      });
    }
  }

  actualizarPreferencia(clave: keyof Preferencias, valor: string): void {
    const prefsActuales = this.preferencias();
    this.preferencias.set({
      ...prefsActuales,
      [clave]: valor,
    });
  }

  eliminarCuenta(): void {
    this.notificacionService.error(this.textos().avisoNoDisponibleDemo);
  }

  exportarDatos(): void {
    this.notificacionService.info(this.textos().avisoExportando);
  }

  toggleRenovacionAutomatica(): void {
    this.cargandoSuscripcion.set(true);

    this.suscripcionService.toggleRenovacionAutomatica().subscribe({
      next: function (this: Configuracion) {
        this.cargandoSuscripcion.set(false);
        const nuevoEstado = this.renovacionAutomatica();
        const mensaje = nuevoEstado
          ? this.textos().avisoRenovacionActivada
          : this.textos().avisoRenovacionDesactivada;
        this.notificacionService.exito(mensaje);
      }.bind(this),
      error: function (this: Configuracion) {
        this.cargandoSuscripcion.set(false);
        this.notificacionService.error(this.textos().avisoErrorActualizar);
      }.bind(this),
    });
  }

  cancelarSuscripcion(): void {
    this.cargandoSuscripcion.set(true);

    this.suscripcionService.cancelarSuscripcion().subscribe({
      next: function (this: Configuracion) {
        this.cargandoSuscripcion.set(false);
        this.notificacionService.exito(this.textos().avisoCancelada);
      }.bind(this),
      error: function (this: Configuracion) {
        this.cargandoSuscripcion.set(false);
        this.notificacionService.error(this.textos().avisoErrorCancelar);
      }.bind(this),
    });
  }

  activarPro(): void {
    this.router.navigate(['/acceso-pro']);
  }

  formatearFechaSuscripcion(fechaIso: string): string {
    if (!fechaIso) return this.textos().fechaNoDisponible;

    const fecha = new Date(fechaIso);
    const opciones: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const localeFecha = this.idiomaService.idioma() === 'en' ? 'en-US' : 'es-ES';
    return fecha.toLocaleDateString(localeFecha, opciones);
  }
}
