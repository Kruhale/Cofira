import { Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificacionService } from '../../services/notificacion.service';
import { IdiomaService } from '../../services/idioma.service';
import { TEXTOS_CONTACTO } from './textos-contacto';

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
    console.log('Formulario enviado:', this.formulario);
    this.notificacion.exito(this.textos().exitoEnvio);
    this.formulario = { nombre: '', email: '', asunto: '', mensaje: '' };
  }
}
