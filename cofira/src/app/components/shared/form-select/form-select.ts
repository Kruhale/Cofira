import { Component, Input, computed, inject } from '@angular/core';
import { IdiomaService } from '../../../services/idioma.service';

@Component({
  selector: 'app-form-select',
  imports: [],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
})
export class FormSelect {
  private readonly idiomaService = inject(IdiomaService);

  @Input() etiqueta: string = '';
  @Input() nombre: string = '';
  @Input() opciones: string[] = [];
  /* Permite a la página que lo usa sobreescribir el texto vacío ya traducido */
  @Input() textoPorDefecto: string = '';

  /* Única cadena propia del componente: no justifica un diccionario */
  readonly textoOpcionVacia = computed(() => {
    if (this.textoPorDefecto) {
      return this.textoPorDefecto;
    }
    return this.idiomaService.idioma() === 'en' ? 'Select an option' : 'Selecciona una opción';
  });
}
