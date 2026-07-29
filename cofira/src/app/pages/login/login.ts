import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { IdiomaService } from '../../services/idioma.service';
import { Button } from '../../components/shared/button/button';
import { TEXTOS_LOGIN } from './textos-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  readonly formularioLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  readonly estaCargando = signal(false);
  readonly mostrarContrasena = signal(false);
  private readonly authService = inject(AuthService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly router = inject(Router);
  private readonly idiomaService = inject(IdiomaService);

  /* Textos de la página en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_LOGIN[this.idiomaService.idioma()]);

  alternarContrasena(): void {
    this.mostrarContrasena.update((v) => !v);
  }

  alEnviar(): void {
    if (this.formularioLogin.invalid || this.estaCargando()) {
      return;
    }

    this.estaCargando.set(true);

    const valorFormulario = this.formularioLogin.value;

    this.authService
      .login({
        username: valorFormulario.email!,
        password: valorFormulario.password!,
      })
      .subscribe({
        next: () => {
          this.estaCargando.set(false);
          this.notificacionService.exito(this.textos().exitoSesion);
          this.router.navigate(['/']);
        },
        error: () => {
          this.estaCargando.set(false);
          this.notificacionService.error(this.textos().errorCredenciales);
        },
      });
  }
}
