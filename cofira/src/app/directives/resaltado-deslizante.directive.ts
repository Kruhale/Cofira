import { afterNextRender, DestroyRef, Directive, ElementRef, inject, NgZone } from '@angular/core';
import { AnimacionesService } from '../services/animaciones.service';

/**
 * Resaltado deslizante: un chip de cristal se desliza de un enlace a otro
 * siguiendo el puntero, estirándose mientras viaja (estilo paleta de macOS).
 * El chip es un elemento decorativo (.mini-cabecera__resaltado) que la
 * directiva mueve midiendo el enlace bajo el cursor. Con
 * prefers-reduced-motion no se activa y queda el hover simple de color.
 */
@Directive({
  selector: '[resaltadoDeslizante]',
  standalone: true,
})
export class ResaltadoDeslizante {
  private readonly elementoRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zona = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly animaciones = inject(AnimacionesService);

  constructor() {
    afterNextRender(() => this.inicializar());
  }

  private inicializar(): void {
    const contenedor = this.elementoRef.nativeElement;
    const resaltado = contenedor.querySelector<HTMLElement>('.mini-cabecera__resaltado');
    const enlaces = Array.from(contenedor.querySelectorAll<HTMLElement>('.mini-cabecera__enlace'));
    const punteroFino = window.matchMedia('(pointer: fine)').matches;

    if (!resaltado || enlaces.length === 0 || !punteroFino) {
      return;
    }

    if (this.animaciones.movimientoReducido()) {
      return;
    }

    const moverHaciaEnlace = (enlace: HTMLElement): void => {
      resaltado.style.width = `${enlace.offsetWidth}px`;
      resaltado.style.transform = `translateX(${enlace.offsetLeft}px) translateY(-50%)`;
      resaltado.style.opacity = '1';
    };

    const ocultarResaltado = (): void => {
      resaltado.style.opacity = '0';
    };

    const escuchas: Array<{ objetivo: HTMLElement; manejador: () => void }> = [];

    this.zona.runOutsideAngular(() => {
      enlaces.forEach((enlace) => {
        const manejador = (): void => moverHaciaEnlace(enlace);
        enlace.addEventListener('pointerenter', manejador);
        escuchas.push({ objetivo: enlace, manejador });
      });

      contenedor.addEventListener('pointerleave', ocultarResaltado);
    });

    this.destroyRef.onDestroy(() => {
      escuchas.forEach((escucha) =>
        escucha.objetivo.removeEventListener('pointerenter', escucha.manejador),
      );
      contenedor.removeEventListener('pointerleave', ocultarResaltado);
    });
  }
}
