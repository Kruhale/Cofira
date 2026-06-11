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
 * Anima un número de 0 al `valorFinal` cuando entra en pantalla.
 * Solo toca la PRESENTACIÓN (textContent); el dato real vive en el
 * componente. Con prefers-reduced-motion escribe el valor final directo.
 */
@Directive({
  selector: '[appContadorAnimado]',
  standalone: true,
})
export class ContadorAnimadoDirective {
  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zona = inject(NgZone);
  private readonly destruccion = inject(DestroyRef);
  private readonly animaciones = inject(AnimacionesService);

  readonly valorFinal = input.required<number>();
  readonly duracion = input(1.4);
  readonly decimales = input(0);
  readonly prefijo = input('');
  readonly sufijo = input('');

  constructor() {
    afterNextRender(() => this.iniciar());
  }

  private iniciar(): void {
    const nodo = this.elemento.nativeElement;
    const escribir = (valor: number): void => {
      const formateado = valor.toLocaleString('es-ES', {
        minimumFractionDigits: this.decimales(),
        maximumFractionDigits: this.decimales(),
      });
      nodo.textContent = `${this.prefijo()}${formateado}${this.sufijo()}`;
    };

    if (this.animaciones.movimientoReducido()) {
      escribir(this.valorFinal());
      return;
    }

    this.zona.runOutsideAngular(() => {
      const proxy = { valor: 0 };
      const contexto = gsap.context(() => {
        gsap.to(proxy, {
          valor: this.valorFinal(),
          duration: this.duracion(),
          ease: 'power2.out',
          onUpdate: () => escribir(proxy.valor),
          scrollTrigger: { trigger: nodo, start: 'top 90%', once: true },
        });
      }, nodo);
      this.destruccion.onDestroy(() => contexto.revert());
    });
  }
}
