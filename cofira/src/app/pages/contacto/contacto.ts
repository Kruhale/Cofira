import { Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificacionService } from '../../services/notificacion.service';
import { IdiomaService } from '../../services/idioma.service';
import { TEXTOS_CONTACTO } from './textos-contacto';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Contacto {
  private notificacion = inject(NotificacionService);
  private readonly idiomaService = inject(IdiomaService);
  private readonly http = inject(HttpClient);

  enviando = false;

  /* Textos de la página en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_CONTACTO[this.idiomaService.idioma()]);
  readonly infoContacto = computed(() => this.textos().infoContacto);
  readonly horarios = computed(() => this.textos().horarios);
  readonly faqs = computed(() => this.textos().faqs);

  formulario = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  };

  enviarFormulario(): void {
    if (this.enviando) {
      return;
    }
    this.enviando = true;
    this.http.post(`${environment.apiUrl}/contacto`, this.formulario).subscribe({
      next: () => {
        this.notificacion.exito(this.textos().exitoEnvio);
        this.formulario = { nombre: '', email: '', asunto: '', mensaje: '' };
        this.enviando = false;
      },
      error: () => {
        this.notificacion.error(
          'No se pudo enviar el mensaje. Intentalo mas tarde.',
        );
        this.enviando = false;
      },
    });
  }
}
