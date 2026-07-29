import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { DatosPagoSimulado, EstadoSuscripcion, Suscripcion } from '../models/suscripcion.model';

// Estado tal y como lo devuelve el backend, que es la ÚNICA autoridad sobre
// quién es PRO. El cliente solo lee este estado; nunca lo decide.
interface EstadoSuscripcionBackend {
  esPro: boolean;
  estado: 'activa' | 'expirada' | 'sin_suscripcion';
  fechaExpiracion: string | null;
  diasRestantes: number;
}

@Injectable({ providedIn: 'root' })
export class SuscripcionService {
  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthService);

  readonly suscripcionActual = signal<Suscripcion | null>(null);
  readonly estaCargando = signal(false);

  readonly esPro = computed(() => this.suscripcionActual()?.estadoSuscripcion === 'activa');

  readonly estadoSuscripcion = computed<EstadoSuscripcion | 'sin_suscripcion'>(() => {
    const suscripcion = this.suscripcionActual();
    return suscripcion ? suscripcion.estadoSuscripcion : 'sin_suscripcion';
  });

  constructor() {
    // Al arrancar, si hay sesión, preguntamos al servidor el estado real.
    if (this.authService.currentUser()) {
      this.refrescarEstado().subscribe();
    }
  }

  // Pregunta al backend el estado PRO real del usuario autenticado.
  refrescarEstado(): Observable<EstadoSuscripcionBackend> {
    return this.apiService
      .get<EstadoSuscripcionBackend>('/suscripcion/estado')
      .pipe(tap((estado) => this.aplicarEstado(estado)));
  }

  activarSuscripcionPro(_datosPago: DatosPagoSimulado): Observable<Suscripcion | null> {
    this.estaCargando.set(true);
    return this.apiService.post<EstadoSuscripcionBackend>('/suscripcion/activar', {}).pipe(
      map((estado) => {
        this.aplicarEstado(estado);
        this.estaCargando.set(false);
        return this.suscripcionActual();
      }),
      catchError((error) => {
        this.estaCargando.set(false);
        throw error;
      }),
    );
  }

  cancelarSuscripcion(): Observable<boolean> {
    this.estaCargando.set(true);
    return this.apiService.post<EstadoSuscripcionBackend>('/suscripcion/cancelar', {}).pipe(
      map((estado) => {
        this.aplicarEstado(estado);
        this.estaCargando.set(false);
        return true;
      }),
      catchError(() => {
        this.estaCargando.set(false);
        return of(false);
      }),
    );
  }

  reactivarSuscripcion(datosPago: DatosPagoSimulado): Observable<Suscripcion | null> {
    return this.activarSuscripcionPro(datosPago);
  }

  // La renovación automática es solo una preferencia visual: no afecta al acceso.
  toggleRenovacionAutomatica(): Observable<boolean> {
    const suscripcionActual = this.suscripcionActual();
    if (!suscripcionActual) return of(false);

    this.suscripcionActual.set({
      ...suscripcionActual,
      renovacionAutomatica: !suscripcionActual.renovacionAutomatica,
    });
    return of(true);
  }

  verificarEstadoSuscripcion(): EstadoSuscripcion | 'sin_suscripcion' {
    return this.estadoSuscripcion();
  }

  obtenerDiasRestantes(): number {
    return this.suscripcionActual()?.diasRestantes ?? 0;
  }

  estaEnPeriodoGracia(): boolean {
    return this.suscripcionActual()?.enPeriodoGracia ?? false;
  }

  limpiarSuscripcion(): void {
    this.suscripcionActual.set(null);
    this.sincronizarUsuarioPro(false);
  }

  private aplicarEstado(estado: EstadoSuscripcionBackend): void {
    const suscripcion = this.mapearSuscripcion(estado);
    this.suscripcionActual.set(suscripcion);
    this.sincronizarUsuarioPro(estado.esPro);
  }

  private mapearSuscripcion(estado: EstadoSuscripcionBackend): Suscripcion | null {
    if (estado.estado === 'sin_suscripcion' || !estado.fechaExpiracion) {
      return null;
    }

    const renovacionPrevia = this.suscripcionActual()?.renovacionAutomatica ?? false;
    return {
      idSuscripcion: 0,
      fechaInicio: '',
      fechaExpiracion: estado.fechaExpiracion,
      renovacionAutomatica: renovacionPrevia,
      estadoSuscripcion: estado.estado === 'activa' ? 'activa' : 'expirada',
      diasRestantes: estado.diasRestantes,
      enPeriodoGracia: false,
    };
  }

  private sincronizarUsuarioPro(esPro: boolean): void {
    const usuarioActual = this.authService.currentUser();
    if (!usuarioActual) return;
    this.authService.currentUser.set({ ...usuarioActual, esPro });
  }
}
