import { Component, ViewEncapsulation, computed, inject } from '@angular/core';

import { IdiomaService } from '../../services/idioma.service';
import { TEXTOS_SOBRE_NOSOTROS } from './textos-sobre-nosotros';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [],
  templateUrl: './sobre-nosotros.html',
  styleUrl: './sobre-nosotros.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SobreNosotros {
  private readonly idiomaService = inject(IdiomaService);

  /* Textos de la página en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_SOBRE_NOSOTROS[this.idiomaService.idioma()]);
  readonly equipo = computed(() => this.textos().equipo);
  readonly valores = computed(() => this.textos().valores);
  readonly estadisticas = computed(() => this.textos().estadisticas);
}
