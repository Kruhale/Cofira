import { Injectable, signal } from '@angular/core';

export type CodigoIdioma = 'es' | 'en';

const CLAVE_ALMACEN = 'cofira-idioma';

function leerIdiomaGuardado(): CodigoIdioma {
  const guardado = localStorage.getItem(CLAVE_ALMACEN);
  if (guardado === 'es' || guardado === 'en') {
    return guardado;
  }
  return 'es';
}

/* Único origen de verdad del idioma de la interfaz: cada componente deriva
   sus textos de este signal con computed(), así el cambio repinta todo. */
@Injectable({ providedIn: 'root' })
export class IdiomaService {
  readonly idioma = signal<CodigoIdioma>(leerIdiomaGuardado());

  cambiarIdioma(codigo: CodigoIdioma): void {
    this.idioma.set(codigo);
    localStorage.setItem(CLAVE_ALMACEN, codigo);
  }
}
