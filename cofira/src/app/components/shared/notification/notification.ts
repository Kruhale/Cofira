import { Component, Input, Output, EventEmitter, OnInit, computed, inject } from '@angular/core';
import { IdiomaService } from '../../../services/idioma.service';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification implements OnInit {
  private readonly idiomaService = inject(IdiomaService);

  @Input() tipo: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() mensaje: string = '';
  @Input() duracion: number = 3000;
  @Input() puedeCerrarse: boolean = true;
  @Output() alCerrar = new EventEmitter<void>();

  /* Única cadena propia del componente: no justifica un diccionario */
  readonly ariaCerrar = computed(() =>
    this.idiomaService.idioma() === 'en' ? 'Close notification' : 'Cerrar notificación',
  );

  estaCerrando: boolean = false;

  ngOnInit() {
    if (this.duracion > 0) {
      setTimeout(() => {
        this.cerrar();
      }, this.duracion);
    }
  }

  cerrar() {
    this.estaCerrando = true;
    setTimeout(() => {
      this.alCerrar.emit();
    }, 500);
  }
}
