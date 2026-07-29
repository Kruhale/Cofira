import { Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from '../modal/modal';
import { Alimento, TipoIconoAlimento } from '../../../models/alimentacion.model';
import { IdiomaService } from '../../../services/idioma.service';
import { TEXTOS_INGREDIENTES } from './textos-ingredientes';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faBreadSlice,
  faAppleWhole,
  faCarrot,
  faDrumstickBite,
  faCheese,
  faMugHot,
  faWheatAwn,
  faSeedling,
  faBowlRice,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ingredientes',
  standalone: true,
  imports: [CommonModule, Modal, FaIconComponent],
  templateUrl: './ingredientes.html',
  styleUrl: './ingredientes.scss',
})
export class Ingredientes {
  @Input() abierto: boolean = false;
  @Input() alimento: Alimento | null = null;

  @Output() cerrar = new EventEmitter<void>();

  private readonly idiomaService = inject(IdiomaService);

  /* Textos del modal en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_INGREDIENTES[this.idiomaService.idioma()]);

  private readonly mapaIconosAlimento = {
    pan: faBreadSlice,
    fruta: faAppleWhole,
    verdura: faCarrot,
    proteina: faDrumstickBite,
    lacteo: faCheese,
    bebida: faMugHot,
    cereal: faWheatAwn,
    legumbre: faSeedling,
    'fruto-seco': faBowlRice,
    pizza: faUtensils,
    plato: faUtensils,
  } as Record<TipoIconoAlimento, IconDefinition>;

  get iconoActual(): IconDefinition {
    if (!this.alimento?.icono) {
      return faUtensils as unknown as IconDefinition;
    }
    return this.mapaIconosAlimento[this.alimento.icono] || faUtensils;
  }

  get caloriasTotal(): number {
    return this.textos().ingredientes.reduce((total, ing) => total + ing.calorias, 0);
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }
}
