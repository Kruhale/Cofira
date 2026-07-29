import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  NgZone,
} from '@angular/core';
import { gsap } from 'gsap';
import { AnimacionesService } from '../services/animaciones.service';

/**
 * Parallax vertical suave ligado al scroll (scrub). Pensado para fotos de
 * hero, nunca para listas. Desactivado con prefers-reduced-motion.
 */
@Directive({
  selector: '[appParallaxSuave]',
  standalone: true,
})
export class ParallaxSuaveDirective {
  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zona = inject(NgZone);
  private readonly destruccion = inject(DestroyRef);
  private readonly animaciones = inject(AnimacionesService);

  /** Fracción del alto que se desplaza (0.15 = 15%). */
  readonly velocidad = input(0.15);

  constructor() {
    afterNextRender(() => this.iniciar());
  }

  private iniciar(): void {
    if (this.animaciones.movimientoReducido()) {
      return;
    }
    const nodo = this.elemento.nativeElement;

    this.zona.runOutsideAngular(() => {
      const contexto = gsap.context(() => {
        gsap.to(nodo, {
          yPercent: this.velocidad() * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: nodo,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      }, nodo);
      this.destruccion.onDestroy(() => contexto.revert());
    });
  }
}
