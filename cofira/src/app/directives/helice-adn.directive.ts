import {
  afterNextRender,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
} from '@angular/core';
import { AnimacionesService } from '../services/animaciones.service';
import type { EscenaHeliceAdn } from './helice-adn.escena';

/**
 * Hélice de ADN metabólica en WebGL (three.js, carga perezosa): la escena 3D se
 * importa solo cuando el canvas se acerca al viewport, se pausa fuera de él y
 * con prefers-reduced-motion pinta un único fotograma estático.
 *
 * Recibe del componente el texto del reloj de ayuno (se dibuja DENTRO de la
 * escena, entrelazado con la hélice) y la fracción 0-1 del frente de combustión
 * para alinearlo con la regla temporal del DOM.
 */
@Directive({
  selector: 'canvas[heliceAdn]',
  standalone: true,
})
export class HeliceAdn {
  tiempoAyuno = input('');
  frenteAyuno = input(0);
  zonaAyuno = input<{ min: number; max: number } | null>(null);

  private readonly lienzoRef = inject<ElementRef<HTMLCanvasElement>>(ElementRef);
  private readonly zona = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly animaciones = inject(AnimacionesService);

  private escena: EscenaHeliceAdn | null = null;
  private destruida = false;
  private visible = true;

  constructor() {
    effect(() => {
      const texto = this.tiempoAyuno();
      const frente = this.frenteAyuno();
      const zona = this.zonaAyuno();

      if (!this.escena) {
        return;
      }

      const reducido = this.animaciones.movimientoReducido();
      this.escena.fijarTexto(texto);
      this.escena.fijarFrente(frente);
      this.escena.fijarZona(zona, reducido);

      // Sin bucle rAF, cada cambio de reloj exige un repintado puntual
      if (reducido) {
        this.escena.renderizar(0);
      }
    });

    afterNextRender(() => this.vigilarCercania());
    this.destroyRef.onDestroy(() => {
      this.destruida = true;
    });
  }

  /** Difiere la descarga del chunk de three hasta que la sección se acerca. */
  private vigilarCercania(): void {
    const lienzo = this.lienzoRef.nativeElement;

    const observadorCarga = new IntersectionObserver(
      (entradas) => {
        const cerca = entradas.some((entrada) => entrada.isIntersecting);
        if (!cerca) {
          return;
        }
        observadorCarga.disconnect();
        void this.montarEscena();
      },
      { rootMargin: '300px' },
    );

    observadorCarga.observe(lienzo);
    this.destroyRef.onDestroy(() => observadorCarga.disconnect());
  }

  private async montarEscena(): Promise<void> {
    const { crearEscenaHelice } = await import('./helice-adn.escena');

    if (this.destruida) {
      return;
    }

    const lienzo = this.lienzoRef.nativeElement;
    const escena = crearEscenaHelice(lienzo);
    this.escena = escena;

    escena.fijarTexto(this.tiempoAyuno());
    escena.fijarFrente(this.frenteAyuno());
    escena.redimensionar(lienzo.clientWidth, lienzo.clientHeight);
    lienzo.classList.add('funcionalidades__ayuno-lienzo--vivo');

    const observadorTamano = new ResizeObserver(() => {
      escena.redimensionar(lienzo.clientWidth, lienzo.clientHeight);
      if (this.animaciones.movimientoReducido()) {
        escena.renderizar(0);
      }
    });
    observadorTamano.observe(lienzo);

    this.destroyRef.onDestroy(() => {
      observadorTamano.disconnect();
      escena.destruir();
    });

    if (this.animaciones.movimientoReducido()) {
      escena.renderizar(0);
      return;
    }

    // Pausa el dibujo cuando el canvas no está a la vista
    const observadorVision = new IntersectionObserver((entradas) => {
      this.visible = entradas[0]?.isIntersecting ?? true;
    });
    observadorVision.observe(lienzo);

    // Parallax solo con puntero de precisión; en táctil queda la deriva autónoma
    const controlPuntero = new AbortController();
    if (window.matchMedia('(pointer: fine)').matches) {
      this.zona.runOutsideAngular(() => {
        window.addEventListener(
          'pointermove',
          (evento) => {
            const normalX = (evento.clientX / window.innerWidth) * 2 - 1;
            const normalY = (evento.clientY / window.innerHeight) * 2 - 1;
            escena.apuntarRaton(normalX, normalY);
          },
          { signal: controlPuntero.signal, passive: true },
        );
      });
    }

    let identificador = 0;
    this.zona.runOutsideAngular(() => {
      const bucle = (milisegundos: number) => {
        if (this.visible) {
          escena.renderizar(milisegundos);
        }
        identificador = requestAnimationFrame(bucle);
      };
      identificador = requestAnimationFrame(bucle);
    });

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(identificador);
      observadorVision.disconnect();
      controlPuntero.abort();
    });
  }
}
