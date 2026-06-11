import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { SuscripcionService } from '../services/suscripcion.service';

export const proGuard: CanActivateFn = function () {
  const servicioAutenticacion = inject(AuthService);
  const servicioSuscripcion = inject(SuscripcionService);
  const enrutador = inject(Router);

  const usuarioActual = servicioAutenticacion.currentUser();

  if (!usuarioActual) {
    return enrutador.createUrlTree(['/login']);
  }

  // La autoridad sobre el acceso PRO es el SERVIDOR: preguntamos su estado
  // real en cada acceso, en vez de fiarnos del localStorage del navegador.
  const rutaAccesoPro = enrutador.createUrlTree(['/acceso-pro']);

  return servicioSuscripcion.refrescarEstado().pipe(
    map(function (estado) {
      return estado.esPro ? true : rutaAccesoPro;
    }),
    catchError(function () {
      return of(rutaAccesoPro);
    }),
  );
};
