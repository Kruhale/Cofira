import { Component, Input, computed, inject } from '@angular/core';
import { IdiomaService } from '../../../services/idioma.service';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  private readonly idiomaService = inject(IdiomaService);

  @Input() tipo: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() mensaje: string = '';
  @Input() puedeCerrarse: boolean = true;

  /* Única cadena propia del componente: no justifica un diccionario */
  readonly ariaCerrar = computed(() =>
    this.idiomaService.idioma() === 'en' ? 'Close alert' : 'Cerrar alerta',
  );

  esVisible: boolean = true;

  cerrar() {
    this.esVisible = false;
  }
}
