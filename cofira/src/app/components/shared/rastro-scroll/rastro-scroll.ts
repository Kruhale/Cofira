import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  NgZone,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { AnimacionesService } from '../../../services/animaciones.service';

export interface SeccionRastro {
  etiqueta: string;
  objetivo: string;
}

/**
 * Rastro de scroll: regla vertical de rallitas fija a la izquierda. Una ola
 * estira y enciende las rallitas alrededor de tu posición (efecto lupa) y una
 * única etiqueta flotante viaja con la ola nombrando la sección actual. Las
 * rallitas que coinciden con una sección son algo más largas, integradas en
 * la propia regla. Clic en la regla = saltar a la sección más cercana.
 * Los ticks y la etiqueta se mueven imperativamente fuera de Angular:
 * cero change detection por frame.
 */
@Component({
  selector: 'app-rastro-scroll',
  standalone: true,
  templateUrl: './rastro-scroll.html',
  styleUrl: './rastro-scroll.scss',
  encapsulation: ViewEncapsulation.None,
})
export class RastroScroll {
  @Input() secciones: SeccionRastro[] = [];

  private readonly elementoRaiz = inject(ElementRef<HTMLElement>);
  private readonly zona = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly animaciones = inject(AnimacionesService);

  /* 36 rallitas: ola fluida con aire entre ellas */
  readonly ticks = Array.from({ length: 36 }, (_, indice) => indice);

  readonly indiceActivo = signal(0);

  private elementosTick: HTMLElement[] = [];
  private elementoEtiqueta: HTMLElement | null = null;
  private fracciones: number[] = [];
  private ticksDeSeccion = new Set<number>();
  private fraccionFooter = 1;

  constructor() {
    afterNextRender(() => this.inicializar());
  }

  alPulsar(evento: MouseEvent): void {
    const carril = evento.currentTarget as HTMLElement;
    const cajaCarril = carril.getBoundingClientRect();
    const fraccionPulsada = (evento.clientY - cajaCarril.top) / cajaCarril.height;

    let indiceCercano = 0;
    let distanciaMinima = Infinity;
    this.fracciones.forEach((fraccion, indice) => {
      const distancia = Math.abs(fraccion - fraccionPulsada);
      if (distancia < distanciaMinima) {
        distanciaMinima = distancia;
        indiceCercano = indice;
      }
    });

    const seccionCercana = this.secciones[indiceCercano];
    if (seccionCercana) {
      this.animaciones.desplazarHasta(seccionCercana.objetivo);
    }
  }

  private inicializar(): void {
    const raiz = this.elementoRaiz.nativeElement as HTMLElement;
    this.elementosTick = Array.from(raiz.querySelectorAll<HTMLElement>('.rastro__tick'));
    this.elementoEtiqueta = raiz.querySelector<HTMLElement>('.rastro__etiqueta');

    /* Bucle rAF en vez de eventos de scroll: con Lenis interpolando la posición
       cada frame, la ola queda pegada al movimiento real. Si la posición no
       cambia, solo cuesta una comparación. */
    let idRaf = 0;
    let ultimaPosicion = -1;

    const bucle = (): void => {
      if (window.scrollY !== ultimaPosicion) {
        ultimaPosicion = window.scrollY;
        this.actualizarEstado();
      }
      idRaf = requestAnimationFrame(bucle);
    };

    const alRedimensionar = (): void => {
      this.medirSecciones();
      ultimaPosicion = -1; /* fuerza repintado en el siguiente frame */
    };

    this.zona.runOutsideAngular(() => {
      idRaf = requestAnimationFrame(bucle);
      window.addEventListener('resize', alRedimensionar, { passive: true });
    });

    /* Las imágenes pueden cambiar la altura tras cargar: remedir con calma */
    setTimeout(() => {
      this.medirSecciones();
      ultimaPosicion = -1;
    }, 600);

    this.medirSecciones();

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(idRaf);
      window.removeEventListener('resize', alRedimensionar);
    });
  }

  /* Posición real de cada sección como fracción 0-1 del recorrido total,
     y qué rallita le corresponde a cada una */
  private medirSecciones(): void {
    const alturaRecorrible = document.documentElement.scrollHeight - window.innerHeight;
    if (alturaRecorrible <= 0) {
      return;
    }

    const footer = document.querySelector('app-footer');
    if (footer) {
      const topFooter = footer.getBoundingClientRect().top + window.scrollY;
      this.fraccionFooter = Math.min(1, Math.max(0, topFooter / alturaRecorrible));
    }

    this.fracciones = this.secciones.map((seccion) => {
      const elemento = document.querySelector(seccion.objetivo);
      if (!elemento) {
        return 0;
      }
      const cajaSeccion = elemento.getBoundingClientRect();
      const posicionAbsoluta = cajaSeccion.top + window.scrollY;
      return Math.min(1, Math.max(0, posicionAbsoluta / alturaRecorrible));
    });

    const totalTicks = this.elementosTick.length;
    this.ticksDeSeccion = new Set(
      this.fracciones.map((fraccion) => Math.round(fraccion * (totalTicks - 1))),
    );
  }

  private actualizarEstado(): void {
    const alturaRecorrible = document.documentElement.scrollHeight - window.innerHeight;
    const progreso = alturaRecorrible > 0 ? window.scrollY / alturaRecorrible : 0;
    const progresoLimitado = Math.min(1, Math.max(0, progreso));

    this.pintarOla(progresoLimitado);

    /* La etiqueta viaja con la ola */
    if (this.elementoEtiqueta) {
      this.elementoEtiqueta.style.top = `${progresoLimitado * 100}%`;
      /* Al entrar en el footer la etiqueta se desvanece para no pisarse con él */
      this.elementoEtiqueta.style.opacity = progresoLimitado >= this.fraccionFooter - 0.02 ? '0' : '1';
    }

    /* Sección actual: la última cuya fracción ya quedó atrás */
    let indiceCalculado = 0;
    this.fracciones.forEach((fraccion, indice) => {
      if (fraccion <= progresoLimitado + 0.02) {
        indiceCalculado = indice;
      }
    });

    if (indiceCalculado !== this.indiceActivo()) {
      this.indiceActivo.set(indiceCalculado);
    }
  }

  /* Ola gaussiana: las rallitas cercanas al cursor se estiran y se encienden.
     Las rallitas de sección parten más largas y levemente encendidas. */
  private pintarOla(progreso: number): void {
    const totalTicks = this.elementosTick.length;
    if (totalTicks === 0) {
      return;
    }

    const cursor = progreso * (totalTicks - 1);
    const amplitud = 2.6;

    this.elementosTick.forEach((tick, indice) => {
      const distancia = Math.abs(indice - cursor);
      const intensidad = Math.exp(-(distancia * distancia) / (2 * amplitud * amplitud));
      const esDeSeccion = this.ticksDeSeccion.has(indice);

      const anchoBase = esDeSeccion ? 1.15 : 0.55;
      const anchoCalculado = anchoBase + intensidad * 1.25;
      const saturacionBase = esDeSeccion ? 55 : 0;
      const saturacion = Math.round(saturacionBase + intensidad * (100 - saturacionBase));
      const luminosidad = Math.round(44 + intensidad * 14);
      const opacidadBase = esDeSeccion ? 0.5 : 0.16;
      const opacidad = opacidadBase + intensidad * (1 - opacidadBase);

      tick.style.width = `${anchoCalculado}rem`;
      tick.style.background = `hsla(24, ${saturacion}%, ${luminosidad}%, ${opacidad})`;
    });
  }
}
