import { Component, computed, inject, ViewEncapsulation } from '@angular/core';

import { IdiomaService } from '../../services/idioma.service';
import { TEXTOS_PRIVACIDAD } from './textos-privacidad';

@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [],
  templateUrl: './privacidad.html',
  styleUrl: './privacidad.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Privacidad {
  private readonly idiomaService = inject(IdiomaService);

  /* Textos legales en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_PRIVACIDAD[this.idiomaService.idioma()]);
  readonly fechaActualizacion = computed(() => this.textos().fechaActualizacion);
}
