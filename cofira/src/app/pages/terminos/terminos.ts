import { Component, computed, inject, ViewEncapsulation } from '@angular/core';

import { IdiomaService } from '../../services/idioma.service';
import { TEXTOS_TERMINOS } from './textos-terminos';

@Component({
  selector: 'app-terminos',
  standalone: true,
  imports: [],
  templateUrl: './terminos.html',
  styleUrl: './terminos.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Terminos {
  private readonly idiomaService = inject(IdiomaService);

  /* Textos legales en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_TERMINOS[this.idiomaService.idioma()]);
  readonly fechaActualizacion = computed(() => this.textos().fechaActualizacion);
}
