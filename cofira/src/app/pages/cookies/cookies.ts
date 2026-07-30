import { Component, computed, inject, ViewEncapsulation } from '@angular/core';

import { IdiomaService } from '../../services/idioma.service';
import { TEXTOS_COOKIES } from './textos-cookies';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [],
  templateUrl: './cookies.html',
  styleUrl: './cookies.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Cookies {
  private readonly idiomaService = inject(IdiomaService);

  /* Textos legales en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_COOKIES[this.idiomaService.idioma()]);
  readonly fechaActualizacion = computed(() => this.textos().fechaActualizacion);
}
