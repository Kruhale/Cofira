import {
  Component,
  computed,
  HostListener,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChartLine, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../shared/button/button';
import { ResaltadoDeslizante } from '../../../directives/resaltado-deslizante.directive';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { IdiomaService } from '../../../services/idioma.service';
import { TEXTOS_CABECERA } from './textos-cabecera';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Button, FaIconComponent, ResaltadoDeslizante],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly idiomaService = inject(IdiomaService);

  /* Textos de la cabecera en el idioma vigente */
  readonly textos = computed(() => TEXTOS_CABECERA[this.idiomaService.idioma()]);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly userNombre = this.authService.userNombre;
  readonly userEmail = computed(() => this.authService.currentUser()?.email ?? '');
  readonly inicialUsuario = computed(() => {
    const fuente = this.userNombre() || this.userEmail() || '?';
    return fuente.charAt(0).toUpperCase();
  });
  readonly esPro = computed(() => this.authService.currentUser()?.esPro ?? false);

  readonly iconoSol = faSun;
  readonly iconoLuna = faMoon;
  readonly iconoGrafico = faChartLine;

  menuAbierto = false;
  menuCuentaAbierto = false;

  // Cabecera transparente sobre el hero oscuro (home / sobre-nosotros) cuando estamos arriba del todo.
  private readonly desplazado = signal(false);
  // Mini-cabecera flotante: aparece cuando la cabecera principal ya quedó atrás.
  private readonly desplazadoLejos = signal(false);
  private readonly rutaActual = signal(this.router.url);

  readonly cabeceraTransparente = computed(() => {
    const ruta = this.rutaActual().split('?')[0].split('#')[0];
    const esPaginaConHero = ruta === '/' || ruta === '/home' || ruta === '/sobre-nosotros';
    return esPaginaConHero && !this.desplazado();
  });

  readonly miniCabeceraVisible = computed(() => this.desplazadoLejos());

  constructor() {
    this.router.events
      .pipe(
        filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((evento) => this.rutaActual.set(evento.urlAfterRedirects));
  }

  @HostListener('window:scroll')
  alHacerScroll(): void {
    this.desplazado.set(window.scrollY > 24);
    this.desplazadoLejos.set(window.scrollY > 320);
  }

  @HostListener('document:keydown.escape')
  cerrarMenusConEscape(): void {
    this.cerrarMenu();
    this.cerrarMenuCuenta();
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  toggleMenuCuenta() {
    this.menuCuentaAbierto = !this.menuCuentaAbierto;
  }

  cerrarMenuCuenta() {
    this.menuCuentaAbierto = false;
  }

  get modoOscuro(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTema(): void {
    this.themeService.toggle();
  }

  logout(): void {
    this.authService.logout();
    this.cerrarMenuCuenta();
  }
}
