import { Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Modal } from '../modal/modal';
import { Comida, TipoComida } from '../../../models/alimentacion.model';
import { ComidaAlternativa } from '../../../models/consumo-comida.model';
import { ConsumoComidaService } from '../../../services/consumo-comida.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { IdiomaService } from '../../../services/idioma.service';
import { TEXTOS_COMIDA_ALTERNATIVA } from './textos-comida-alternativa';

@Component({
  selector: 'app-modal-comida-alternativa',
  standalone: true,
  imports: [CommonModule, Modal, FormsModule],
  templateUrl: './modal-comida-alternativa.html',
  styleUrl: './modal-comida-alternativa.scss',
})
export class ModalComidaAlternativa {
  @Input() abierto = false;
  @Input() comida: Comida | null = null;
  @Input() fecha = '';

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  private readonly consumoComidaService = inject(ConsumoComidaService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly idiomaService = inject(IdiomaService);

  /* Textos del modal en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_COMIDA_ALTERNATIVA[this.idiomaService.idioma()]);

  nombreComida = '';
  calorias = 0;
  proteinas = 0;
  carbohidratos = 0;
  grasas = 0;
  guardando = false;

  cerrarModal(): void {
    this.limpiarFormulario();
    this.cerrar.emit();
  }

  guardarComidaAlternativa(): void {
    if (!this.nombreComida.trim()) {
      this.notificacionService.error(this.textos().errorNombreObligatorio);
      return;
    }

    if (!this.comida) {
      this.notificacionService.error(this.textos().errorSinComida);
      return;
    }

    this.guardando = true;
    const tipoComidaUpperCase = this.comida.tipo.toUpperCase();

    const comidaAlternativa: ComidaAlternativa = {
      nombre: this.nombreComida,
      calorias: this.calorias,
      proteinas: this.proteinas,
      carbohidratos: this.carbohidratos,
      grasas: this.grasas,
      fecha: this.fecha,
      tipoComida: tipoComidaUpperCase,
    };

    this.consumoComidaService.registrarComidaAlternativa(comidaAlternativa).subscribe({
      next: () => {
        this.notificacionService.exito(this.textos().exitoRegistrada);
        this.consumoComidaService.obtenerResumenReal(this.fecha).subscribe();
        this.guardando = false;
        this.limpiarFormulario();
        this.guardado.emit();
        this.cerrar.emit();
      },
      error: () => {
        this.notificacionService.error(this.textos().errorRegistrar);
        this.guardando = false;
      },
    });
  }

  private limpiarFormulario(): void {
    this.nombreComida = '';
    this.calorias = 0;
    this.proteinas = 0;
    this.carbohidratos = 0;
    this.grasas = 0;
  }
}
