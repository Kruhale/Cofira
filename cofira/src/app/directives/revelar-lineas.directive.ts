import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  NgZone,
} from '@angular/core';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { AnimacionesService } from '../services/animaciones.service';

/**
 * Revela un titular línea a línea: cada línea sube desde detrás de una
 * máscara (overflow hidden) al entrar en viewport. Es el patrón editorial
 * de titulares de las webs de referencia del rediseño.
 *
 * Con movimiento reducido no se divide ni anima nada: el titular queda
 * tal cual lo pintó Angular, así un fallo de JS nunca deja texto oculto.
 */
@Directive({
  selector: '[appRevelarLineas]',
  standalone: true,
})
export class RevelarLineasDirective {
  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zona = inject(NgZone);
  private readonly destruccion = inject(DestroyRef);
  private readonly animaciones = inject(AnimacionesService);

  constructor() {
    gsap.registerPlugin(SplitText);
    afterNextRender(() => this.iniciar());
  }

  private async iniciar(): Promise<void> {
    if (this.animaciones.movimientoReducido()) {
      return;
    }

    // Sin las fuentes cargadas SplitText partiría las líneas por donde no es
    await document.fonts.ready;

    const nodo = this.elemento.nativeElement;

    this.zona.runOutsideAngular(() => {
      const contexto = gsap.context(() => {
        const division = SplitText.create(nodo, { type: 'lines', mask: 'lines', aria: 'auto' });
        gsap.from(division.lines, {
          yPercent: 110,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.09,
          scrollTrigger: { trigger: nodo, start: 'top 85%', once: true },
        });
      }, nodo);
      this.destruccion.onDestroy(() => contexto.revert());
    });
  }
}
