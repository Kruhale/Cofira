import { Component, computed, inject, ViewEncapsulation } from '@angular/core';

import { IdiomaService } from '../../services/idioma.service';
import { TEXTOS_LICENCIAS } from './textos-licencias';

@Component({
  selector: 'app-licencias',
  standalone: true,
  imports: [],
  templateUrl: './licencias.html',
  styleUrl: './licencias.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Licencias {
  private readonly idiomaService = inject(IdiomaService);

  /* Textos legales en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_LICENCIAS[this.idiomaService.idioma()]);
  readonly fechaActualizacion = computed(() => this.textos().fechaActualizacion);
}
