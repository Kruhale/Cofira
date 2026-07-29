import { Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';

import { IdiomaService } from '../../services/idioma.service';
import { ArticuloBlog, TEXTOS_BLOG } from './textos-blog';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [NgClass],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Blog {
  categoriaActiva: string = 'todos';

  private readonly idiomaService = inject(IdiomaService);

  /* Textos de la página en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_BLOG[this.idiomaService.idioma()]);
  readonly categorias = computed(() => this.textos().categorias);
  readonly articulos = computed(() => this.textos().articulos);

  get articulosFiltrados(): ArticuloBlog[] {
    if (this.categoriaActiva === 'todos') {
      return this.articulos();
    }
    return this.articulos().filter((a) => a.categoria === this.categoriaActiva);
  }

  filtrarPorCategoria(categoriaId: string): void {
    this.categoriaActiva = categoriaId;
  }
}
