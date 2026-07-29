import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * Punto único de configuración de GSAP + Lenis para toda la app.
 *
 * - Registra ScrollTrigger una sola vez.
 * - Expone `movimientoReducido` (signal) leyendo prefers-reduced-motion,
 *   para que cada directiva pueda renderizar el estado final sin animar.
 * - Lenis (scroll suave cinematográfico) SOLO en rutas de marketing; dentro de
 *   la app PRO se detiene para no estorbar a tablas, modales y scrolls horizontales.
 * - Tras cada navegación recalcula las posiciones de los ScrollTrigger.
 */
@Injectable({ providedIn: 'root' })
export class AnimacionesService {
  private readonly enrutador = inject(Router);

  readonly movimientoReducido = signal(false);

  private lenis: Lenis | null = null;
  private readonly rutasMarketing = ['/', '/home', '/sobre-nosotros', '/blog', '/acceso-pro'];

  constructor() {
    gsap.registerPlugin(ScrollTrigger);

    const consultaMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.movimientoReducido.set(consultaMovimiento.matches);
    consultaMovimiento.addEventListener('change', (evento) =>
      this.movimientoReducido.set(evento.matches),
    );

    if (!this.movimientoReducido()) {
      this.iniciarScrollSuave();
    }

    this.enrutador.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe((evento) => {
        this.ajustarScrollSuave((evento as NavigationEnd).urlAfterRedirects);
        // Esperamos a que la nueva ruta pinte antes de recalcular triggers.
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
  }

  private iniciarScrollSuave(): void {
    gsap.ticker.add((tiempo) => {
      this.lenis?.raf(tiempo * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    this.ajustarScrollSuave(this.enrutador.url);
  }

  /**
   * Crea Lenis solo en rutas de marketing y lo destruye en el resto.
   * Un Lenis parado (stop) sigue capturando la rueda del raton y bloquea
   * el scroll nativo, por eso hay que destruirlo en vez de pararlo.
   */
  private ajustarScrollSuave(url: string): void {
    if (this.movimientoReducido()) return;

    const ruta = url.split('?')[0].split('#')[0];
    const esRutaMarketing = this.rutasMarketing.includes(ruta);

    if (esRutaMarketing && !this.lenis) {
      this.lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      this.lenis.on('scroll', () => ScrollTrigger.update());
    }

    if (!esRutaMarketing && this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }

    window.scrollTo(0, 0);
  }

  /** Desplazamiento suave hasta un elemento, usando Lenis si está activo. */
  desplazarHasta(objetivo: string | HTMLElement, desfase = 0): void {
    if (this.lenis) {
      this.lenis.scrollTo(objetivo, { offset: desfase });
      return;
    }

    const elemento = typeof objetivo === 'string' ? document.querySelector(objetivo) : objetivo;
    elemento?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** Desplazamiento a una posición exacta de scroll, sin que Lenis la revierta. */
  desplazarHastaPosicion(posicion: number): void {
    if (this.lenis) {
      this.lenis.scrollTo(posicion, { duration: 0.8 });
      return;
    }

    window.scrollTo({ top: posicion, behavior: 'smooth' });
  }
}
