import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import { AnimacionesService } from '../../../services/animaciones.service';

/**
 * Cinta marquee cinética: banda de texto infinito en contorno que deriva
 * lentamente y acelera con la velocidad real del scroll (lee window.scrollY
 * en un bucle rAF, igual que el rastro-scroll, para seguir el lerp de Lenis
 * frame a frame). Texto duplicado para el bucle sin costuras.
 * Con prefers-reduced-motion la cinta queda estática y visible.
 */
@Component({
  selector: 'app-cinta-marquee',
  standalone: true,
  templateUrl: './cinta-marquee.html',
  styleUrl: './cinta-marquee.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CintaMarquee {
  @Input() palabras: string[] = ['Entrena', 'Come', 'Mide', 'Repite'];
  @Input() invertida = false;

  private readonly elementoRaiz = inject(ElementRef<HTMLElement>);
  private readonly zona = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly animaciones = inject(AnimacionesService);

  get textoCinta(): string {
    return this.palabras.map((palabra) => `${palabra} — `).join('');
  }

  constructor() {
    afterNextRender(() => this.inicializar());
  }

  private inicializar(): void {
    if (this.animaciones.movimientoReducido()) {
      return;
    }

    const raiz = this.elementoRaiz.nativeElement as HTMLElement;
    const pista = raiz.querySelector<HTMLElement>('.cinta__pista');
    if (!pista) {
      return;
    }

    let desplazamiento = 0;
    let ultimaPosicion = window.scrollY;
    let idRaf = 0;

    const paso = (): void => {
      const posicionActual = window.scrollY;
      const velocidadScroll = posicionActual - ultimaPosicion;
      ultimaPosicion = posicionActual;

      /* Deriva lenta en reposo + impulso proporcional al scroll (con techo) */
      const avanceBase = 0.5;
      const impulso = Math.min(16, Math.abs(velocidadScroll) * 0.35);
      desplazamiento += avanceBase + impulso;

      const anchoMitad = pista.scrollWidth / 2;
      if (anchoMitad > 0) {
        desplazamiento %= anchoMitad;
        const posicionX = this.invertida ? desplazamiento - anchoMitad : -desplazamiento;
        pista.style.transform = `translateX(${posicionX}px)`;
      }

      idRaf = requestAnimationFrame(paso);
    };

    this.zona.runOutsideAngular(() => {
      idRaf = requestAnimationFrame(paso);
    });

    this.destroyRef.onDestroy(() => cancelAnimationFrame(idRaf));
  }
}
