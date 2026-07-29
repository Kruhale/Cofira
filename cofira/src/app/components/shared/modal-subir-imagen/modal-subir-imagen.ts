import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Modal } from '../modal/modal';
import { Comida } from '../../../models/alimentacion.model';
import { ConsumoComidaService } from '../../../services/consumo-comida.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { IdiomaService } from '../../../services/idioma.service';
import { AnalisisImagen } from '../../../models/consumo-comida.model';
import { TEXTOS_SUBIR_IMAGEN } from './textos-subir-imagen';

@Component({
  selector: 'app-modal-subir-imagen',
  standalone: true,
  imports: [CommonModule, Modal],
  templateUrl: './modal-subir-imagen.html',
  styleUrl: './modal-subir-imagen.scss',
})
export class ModalSubirImagen {
  @Input() abierto = false;
  @Input() comida: Comida | null = null;
  @Input() fecha = '';

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  @ViewChild('inputArchivo') inputArchivo!: ElementRef<HTMLInputElement>;

  private readonly consumoComidaService = inject(ConsumoComidaService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly idiomaService = inject(IdiomaService);

  /* Textos del modal en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_SUBIR_IMAGEN[this.idiomaService.idioma()]);

  imagenPreview: string | null = null;
  imagenBase64: string | null = null;
  nombreArchivo = '';
  analizando = false;
  guardando = false;
  analisisCompletado = false;

  resultadoAnalisis = {
    nombreComida: '',
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
    confianza: 'media' as 'alta' | 'media' | 'baja',
  };

  cerrarModal(): void {
    this.limpiarEstado();
    this.cerrar.emit();
  }

  seleccionarArchivo(): void {
    this.inputArchivo.nativeElement.click();
  }

  manejarSeleccionArchivo(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivos = input.files;

    if (!archivos || archivos.length === 0) {
      return;
    }

    const archivo = archivos[0];
    const esImagenValida = archivo.type.startsWith('image/');

    if (!esImagenValida) {
      this.notificacionService.error(this.textos().errorNoEsImagen);
      return;
    }

    this.nombreArchivo = archivo.name;
    this.leerArchivoComoBase64(archivo);
  }

  analizarImagen(): void {
    if (!this.imagenBase64 || !this.comida) {
      this.notificacionService.error(this.textos().errorSinImagen);
      return;
    }

    this.analizando = true;
    const tipoComida = this.comida.tipo;

    this.consumoComidaService.analizarImagen(this.imagenBase64, this.fecha, tipoComida).subscribe({
      next: (analisis: AnalisisImagen) => {
        this.analizando = false;
        this.analisisCompletado = true;
        this.resultadoAnalisis = {
          nombreComida: analisis.nombreComida,
          calorias: analisis.caloriasEstimadas,
          proteinas: analisis.proteinasGramos,
          carbohidratos: analisis.carbohidratosGramos,
          grasas: analisis.grasasGramos,
          confianza: analisis.confianza,
        };
        this.notificacionService.exito(this.textos().exitoAnalizada);
      },
      error: (errorCapturado) => {
        console.error('Error analizando imagen:', errorCapturado);
        this.analizando = false;
        this.notificacionService.error(this.textos().errorAnalizar);
      },
    });
  }

  guardarResultado(): void {
    if (!this.analisisCompletado || !this.imagenBase64 || !this.comida) {
      this.notificacionService.error(this.textos().errorAnalizarPrimero);
      return;
    }

    this.guardando = true;
    const tipoComida = this.comida.tipo;

    this.consumoComidaService
      .guardarAnalisisImagen(this.imagenBase64, this.fecha, tipoComida)
      .subscribe({
        next: () => {
          this.guardando = false;
          this.notificacionService.exito(this.textos().exitoRegistrada);
          this.limpiarEstado();
          this.guardado.emit();
          this.cerrar.emit();
        },
        error: (errorCapturado) => {
          console.error('Error guardando análisis:', errorCapturado);
          this.guardando = false;
          this.notificacionService.error(this.textos().errorGuardar);
        },
      });
  }

  private leerArchivoComoBase64(archivo: File): void {
    const lector = new FileReader();

    lector.onload = () => {
      const resultado = lector.result as string;
      this.imagenPreview = resultado;
      const base64SinPrefijo = resultado.split(',')[1];
      this.imagenBase64 = base64SinPrefijo;
      this.analisisCompletado = false;
    };

    lector.onerror = () => {
      this.notificacionService.error(this.textos().errorLeerImagen);
    };

    lector.readAsDataURL(archivo);
  }

  private limpiarEstado(): void {
    this.imagenPreview = null;
    this.imagenBase64 = null;
    this.nombreArchivo = '';
    this.analizando = false;
    this.guardando = false;
    this.analisisCompletado = false;
    this.resultadoAnalisis = {
      nombreComida: '',
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
      confianza: 'media',
    };
  }
}
