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

type Direccion = 'arriba' | 'abajo' | 'izquierda' | 'derecha';

/**
 * Revela el elemento al entrar en el viewport (fade + desplazamiento).
 * Con `escalonado`, anima en cascada los hijos marcados con
 * `data-revelar-item`. Respeta prefers-reduced-motion (render directo).
 *
 * El contenido es visible por defecto en CSS: solo si GSAP llega a correr
 * lo oculta para revelarlo, de modo que un fallo de JS nunca deja vacío.
 */
@Directive({
  selector: '[appRevelarScroll]',
  standalone: true,
})
export class RevelarScrollDirective {
  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zona = inject(NgZone);
  private readonly destruccion = inject(DestroyRef);
  private readonly animaciones = inject(AnimacionesService);

  readonly retraso = input(0);
  readonly direccion = input<Direccion>('arriba');
  readonly distancia = input(32);
  readonly escalonado = input(false);

  constructor() {
    afterNextRender(() => this.iniciar());
  }

  private iniciar(): void {
    const nodo = this.elemento.nativeElement;
    const objetivos = this.escalonado()
      ? Array.from(nodo.querySelectorAll<HTMLElement>('[data-revelar-item]'))
      : [nodo];

    if (this.animaciones.movimientoReducido()) {
      gsap.set(objetivos, { autoAlpha: 1, x: 0, y: 0 });
      return;
    }

    this.zona.runOutsideAngular(() => {
      const contexto = gsap.context(() => {
        gsap.fromTo(
          objetivos,
          { autoAlpha: 0, ...this.calcularDesplazamiento() },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: this.retraso(),
            stagger: this.escalonado() ? 0.08 : 0,
            scrollTrigger: { trigger: nodo, start: 'top 85%', once: true },
          },
        );
      }, nodo);
      this.destruccion.onDestroy(() => contexto.revert());
    });
  }

  private calcularDesplazamiento(): { x?: number; y?: number } {
    const distancia = this.distancia();
    switch (this.direccion()) {
      case 'abajo':
        return { y: -distancia };
      case 'izquierda':
        return { x: distancia };
      case 'derecha':
        return { x: -distancia };
      default:
        return { y: distancia };
    }
  }
}
