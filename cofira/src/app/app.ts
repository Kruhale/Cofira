import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Header } from './components/layout/header/header';
import { Footer } from './components/layout/footer/footer';
import { NotificationContainer } from './components/shared/notification-container/notification-container';
import { AnimacionesService } from './services/animaciones.service';
import { IdiomaService } from './services/idioma.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, NotificationContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('cofira');
  private readonly animaciones = inject(AnimacionesService);
  private readonly router = inject(Router);
  private readonly idiomaService = inject(IdiomaService);

  /* Única cadena visible de la shell: no justifica un diccionario propio */
  protected readonly textoSaltar = computed(() =>
    this.idiomaService.idioma() === 'en' ? 'Skip to main content' : 'Saltar al contenido principal',
  );

  private readonly urlActual = toSignal(
    this.router.events.pipe(
      filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
      map((evento) => evento.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  // El onboarding es un flujo enfocado a pantalla completa: sin header ni footer
  // de marketing (chocaban con su propia cabecera de progreso).
  protected readonly mostrarCromo = computed(() => !this.urlActual().startsWith('/onboarding'));
}
