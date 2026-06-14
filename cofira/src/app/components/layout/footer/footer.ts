import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../../../services/theme.service';
import { AnimacionesService } from '../../../services/animaciones.service';
import { RevelarScrollDirective } from '../../../directives/revelar-scroll.directive';
import { ContadorAnimadoDirective } from '../../../directives/contador-animado.directive';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, RevelarScrollDirective, ContadorAnimadoDirective],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Footer {
  private readonly themeService = inject(ThemeService);
  private readonly elementRef = inject(ElementRef);
  private readonly animaciones = inject(AnimacionesService);
  private readonly destroyRef = inject(DestroyRef);

  /** Personas entrenando ahora: sube EN VIVO para que la comunidad se sienta viva. */
  readonly entrenando = signal(24819);
  readonly entrenandoTexto = computed(() => this.entrenando().toLocaleString('es-ES'));
  private temporizadorVivo = 0;
  private elementoNumero: HTMLElement | null = null;

  constructor() {
    afterNextRender(() => {
      this.elementoNumero = this.elementRef.nativeElement.querySelector('.pie__pulso-num');
      this.arrancarComunidadEnVivo();
    });
    this.destroyRef.onDestroy(() => clearTimeout(this.temporizadorVivo));
  }

  /** Incrementos pequeños a intervalos irregulares: parece tráfico real, no un reloj. */
  private arrancarComunidadEnVivo(): void {
    if (this.animaciones.movimientoReducido()) {
      return;
    }
    const programarSiguiente = (): void => {
      const esperaMs = 2600 + Math.random() * 3600;
      this.temporizadorVivo = window.setTimeout(() => {
        this.entrenando.update((valor) => valor + 1 + Math.floor(Math.random() * 3));
        this.destellarNumero();
        programarSiguiente();
      }, esperaMs);
    };
    programarSiguiente();
  }

  /** Pop sutil del número justo cuando sube: refuerza la sensación de dato en vivo. */
  private destellarNumero(): void {
    if (!this.elementoNumero?.isConnected) {
      return;
    }
    this.elementoNumero.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.06)', offset: 0.35 },
        { transform: 'scale(1)' },
      ],
      { duration: 520, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    );
  }

  anioActual = new Date().getFullYear();

  socialLinks = [
    { name: 'YouTube', url: 'https://youtube.com/cofira' },
    { name: 'Facebook', url: 'https://facebook.com/cofira' },
    { name: 'Twitter', url: 'https://twitter.com/cofira' },
    { name: 'Instagram', url: 'https://instagram.com/cofira' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/cofira' },
  ];

  idiomaActual = 'ES';
  idiomas = ['ES', 'EN', 'FR', 'DE'];
  mostrarIdiomas = false;

  get modoOscuro(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTema(): void {
    this.themeService.toggle();
  }

  cambiarIdioma(idioma: string): void {
    this.idiomaActual = idioma;
    this.mostrarIdiomas = false;
  }

  toggleIdiomas(): void {
    this.mostrarIdiomas = !this.mostrarIdiomas;
  }

  @HostListener('document:keydown.escape')
  cerrarIdiomasConEscape(): void {
    this.mostrarIdiomas = false;
  }

  @HostListener('document:click', ['$event'])
  cerrarIdiomasSiClicFuera(evento: Event): void {
    const elementoClicado = evento.target as HTMLElement;
    const contenedorIdioma = this.elementRef.nativeElement.querySelector('.pie__idioma');

    const clicFueDelSelectorIdioma = !contenedorIdioma?.contains(elementoClicado);

    if (clicFueDelSelectorIdioma) {
      this.mostrarIdiomas = false;
    }
  }
}
