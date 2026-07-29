import { afterNextRender, DestroyRef, Directive, ElementRef, inject, NgZone } from '@angular/core';
import { AnimacionesService } from '../services/animaciones.service';

/**
 * Botón magnético: el botón se desplaza ligeramente hacia el cursor mientras
 * pasa por encima, y vuelve a su sitio al salir. Solo con puntero fino y sin
 * prefers-reduced-motion. Mueve el `.boton` interno del `app-button`.
 */
@Directive({
  selector: '[botonMagnetico]',
  standalone: true,
})
export class BotonMagnetico {
  private readonly elementoRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zona = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly animaciones = inject(AnimacionesService);

  private readonly fuerza = 0.32;

  constructor() {
    afterNextRender(() => this.inicializar());
  }

  private inicializar(): void {
    const anfitrion = this.elementoRef.nativeElement;
    const objetivo = anfitrion.querySelector<HTMLElement>('.boton') ?? anfitrion;
    const punteroFino = window.matchMedia('(pointer: fine)').matches;

    if (this.animaciones.movimientoReducido() || !punteroFino) {
      return;
    }

    const alMover = (evento: PointerEvent): void => {
      const caja = anfitrion.getBoundingClientRect();
      const desplazamientoX = evento.clientX - (caja.left + caja.width / 2);
      const desplazamientoY = evento.clientY - (caja.top + caja.height / 2);
      objetivo.style.transform = `translate(${desplazamientoX * this.fuerza}px, ${desplazamientoY * this.fuerza}px)`;
    };

    const alSalir = (): void => {
      objetivo.style.transform = '';
    };

    this.zona.runOutsideAngular(() => {
      anfitrion.addEventListener('pointermove', alMover);
      anfitrion.addEventListener('pointerleave', alSalir);
    });

    this.destroyRef.onDestroy(() => {
      anfitrion.removeEventListener('pointermove', alMover);
      anfitrion.removeEventListener('pointerleave', alSalir);
    });
  }
}
