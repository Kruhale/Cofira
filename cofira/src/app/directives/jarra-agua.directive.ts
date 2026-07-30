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
import type { EscenaJarraAgua } from './jarra-agua.escena';

/**
 * Jarra de cristal en WebGL (three.js, carga perezosa): se llena de agua hasta
 * `nivel` (0-1) y oscila despacio en 3D. La escena se importa solo al acercarse
 * al viewport, se pausa cuando el panel no está activo y, con prefers-reduced-motion,
 * pinta un único fotograma quieto.
 */
@Directive({
  selector: 'canvas[jarraAgua]',
  standalone: true,
})
export class JarraAgua {
  nivel = input(0);

  private readonly lienzoRef = inject<ElementRef<HTMLCanvasElement>>(ElementRef);
  private readonly zona = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly animaciones = inject(AnimacionesService);

  private escena: EscenaJarraAgua | null = null;
  private destruida = false;

  constructor() {
    effect(() => {
      const nivel = this.nivel();
      if (!this.escena) {
        return;
      }
      const reducido = this.animaciones.movimientoReducido();
      this.escena.fijarNivel(nivel, reducido);
      if (reducido) {
        this.escena.renderizar(0);
      }
    });

    afterNextRender(() => this.vigilarCercania());
    this.destroyRef.onDestroy(() => {
      this.destruida = true;
    });
  }

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
    const { crearEscenaJarraAgua } = await import('./jarra-agua.escena');

    if (this.destruida) {
      return;
    }

    const lienzo = this.lienzoRef.nativeElement;
    const escena = crearEscenaJarraAgua(lienzo);
    this.escena = escena;

    // Si el componente se destruyó durante el await del import, el contexto WebGL
    // ya existe: destrúyelo aquí para no fugar el contexto ni las geometrías.
    if (this.destruida) {
      escena.destruir();
      return;
    }

    escena.fijarNivel(this.nivel(), true);
    escena.redimensionar(lienzo.clientWidth, lienzo.clientHeight);
    lienzo.classList.add('funcionalidades__jarra-lienzo--vivo');

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

    // Movimiento reducido: un único fotograma quieto, sin bucle.
    if (this.animaciones.movimientoReducido()) {
      escena.renderizar(0);
      return;
    }

    // Solo pinta cuando este panel es el activo (ahorra GPU: hay otras escenas en
    // la sección). Gatear por la clase `--activo` es fiable —Angular la conmuta.
    const visual = lienzo.closest('.funcionalidades__visual');
    let identificador = 0;
    this.zona.runOutsideAngular(() => {
      const bucle = (milisegundos: number) => {
        if (!visual || visual.classList.contains('funcionalidades__visual--activo')) {
          escena.renderizar(milisegundos);
        }
        identificador = requestAnimationFrame(bucle);
      };
      identificador = requestAnimationFrame(bucle);
    });

    this.destroyRef.onDestroy(() => cancelAnimationFrame(identificador));
  }
}
