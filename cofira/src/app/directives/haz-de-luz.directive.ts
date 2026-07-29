import { afterNextRender, DestroyRef, Directive, ElementRef, inject, NgZone } from '@angular/core';
import { AnimacionesService } from '../services/animaciones.service';

/**
 * Haz de luz que sigue al cursor sobre un fondo oscuro y "enciende" las
 * métricas que tiene debajo (mix-blend-mode en el CSS del componente).
 * Solo en puntero fino y sin prefers-reduced-motion; si no, queda estático.
 */
@Directive({
  selector: '[hazDeLuz]',
  standalone: true,
})
export class HazDeLuz {
  private readonly elementoRef = inject(ElementRef<HTMLElement>);
  private readonly zona = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly animaciones = inject(AnimacionesService);

  constructor() {
    afterNextRender(() => this.inicializar());
  }

  private inicializar(): void {
    const elemento = this.elementoRef.nativeElement;
    const punteroFino = window.matchMedia('(pointer: fine)').matches;

    if (this.animaciones.movimientoReducido() || !punteroFino) {
      elemento.style.setProperty('--haz-x', '32%');
      elemento.style.setProperty('--haz-y', '26%');
      elemento.classList.add('haz--estatico');
      return;
    }

    const alMover = (evento: PointerEvent): void => {
      const caja = elemento.getBoundingClientRect();
      const porcentajeX = ((evento.clientX - caja.left) / caja.width) * 100;
      const porcentajeY = ((evento.clientY - caja.top) / caja.height) * 100;
      elemento.style.setProperty('--haz-x', `${porcentajeX}%`);
      elemento.style.setProperty('--haz-y', `${porcentajeY}%`);
      elemento.classList.add('haz--activo');
    };

    const alSalir = (): void => elemento.classList.remove('haz--activo');

    this.zona.runOutsideAngular(() => {
      elemento.addEventListener('pointermove', alMover, { passive: true });
      elemento.addEventListener('pointerleave', alSalir);
    });

    this.destroyRef.onDestroy(() => {
      elemento.removeEventListener('pointermove', alMover);
      elemento.removeEventListener('pointerleave', alSalir);
    });
  }
}
