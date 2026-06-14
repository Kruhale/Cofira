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
import type { EscenaCuerpoAgua } from './cuerpo-agua.escena';

/**
 * Silueta de hidratación en WebGL (three.js, carga perezosa): el cuerpo de
 * partículas se llena de agua hasta `nivel` (0-1) y muestra `litros` como número
 * gigante translúcido. La escena se importa solo al acercarse al viewport, se
 * pausa fuera de él y con prefers-reduced-motion pinta un único fotograma.
 */
@Directive({
  selector: 'canvas[cuerpoAgua]',
  standalone: true,
})
export class CuerpoAgua {
  nivel = input(0);
  litros = input('');

  private readonly lienzoRef = inject<ElementRef<HTMLCanvasElement>>(ElementRef);
  private readonly zona = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly animaciones = inject(AnimacionesService);

  private escena: EscenaCuerpoAgua | null = null;
  private destruida = false;

  constructor() {
    effect(() => {
      const nivel = this.nivel();
      const litros = this.litros();
      if (!this.escena) {
        return;
      }
      const reducido = this.animaciones.movimientoReducido();
      this.escena.fijarNivel(nivel, reducido);
      this.escena.fijarTexto(litros);
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
    const { crearEscenaCuerpoAgua } = await import('./cuerpo-agua.escena');

    if (this.destruida) {
      return;
    }

    const lienzo = this.lienzoRef.nativeElement;
    const escena = crearEscenaCuerpoAgua(lienzo);
    this.escena = escena;

    escena.fijarNivel(this.nivel(), true);
    escena.fijarTexto(this.litros());
    escena.redimensionar(lienzo.clientWidth, lienzo.clientHeight);
    lienzo.classList.add('funcionalidades__agua-lienzo--vivo');

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

    // Movimiento reducido: nada de animación, pero el canvas (sin preserveDrawingBuffer)
    // se vacía tras componer si no se repinta. Repintamos a tiempo fijo cada 500 ms
    // —fotograma idéntico, sin movimiento percibido— y solo si el panel está activo.
    if (this.animaciones.movimientoReducido()) {
      const visual = lienzo.closest('.funcionalidades__visual');
      let idReducido = 0;
      const repintarLento = () => {
        if (!visual || visual.classList.contains('funcionalidades__visual--activo')) {
          escena.renderizar(0);
        }
        idReducido = window.setTimeout(repintarLento, 500);
      };
      repintarLento();
      this.destroyRef.onDestroy(() => window.clearTimeout(idReducido));
      return;
    }

    const controlPuntero = new AbortController();
    if (window.matchMedia('(pointer: fine)').matches) {
      this.zona.runOutsideAngular(() => {
        window.addEventListener(
          'pointermove',
          (evento) => {
            const normalX = (evento.clientX / window.innerWidth) * 2 - 1;
            const normalY = (evento.clientY / window.innerHeight) * 2 - 1;
            escena.apuntarRaton(normalX, normalY);

            // El canvas es pointer-events:none, así que el hover sobre el muñeco se
            // mide aquí: coords relativas al lienzo (-1..1) + si el cursor está dentro.
            const caja = lienzo.getBoundingClientRect();
            const canvasX = ((evento.clientX - caja.left) / caja.width) * 2 - 1;
            const canvasY = ((evento.clientY - caja.top) / caja.height) * 2 - 1;
            const dentro =
              evento.clientX >= caja.left &&
              evento.clientX <= caja.right &&
              evento.clientY >= caja.top &&
              evento.clientY <= caja.bottom;
            escena.fijarPuntero(canvasX, canvasY, dentro);
          },
          { signal: controlPuntero.signal, passive: true },
        );

        // Si el puntero sale de la ventana o se cambia de pestaña, cierra el cuerpo.
        const cerrar = () => escena.fijarPuntero(0, 0, false);
        document.addEventListener('pointerleave', cerrar, { signal: controlPuntero.signal });
        window.addEventListener('blur', cerrar, { signal: controlPuntero.signal });
      });
    }

    // Solo pinta cuando ESTE panel es el activo (ahorra GPU: hay otra escena 3D,
    // la del ayuno, en la misma sección). Gatear por la clase `--activo` es fiable
    // —Angular la conmuta— y no congela como sí hacía el IntersectionObserver; si
    // no se puede determinar el panel, pinta igualmente (sin riesgo de quedar negro).
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

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(identificador);
      controlPuntero.abort();
    });
  }
}
