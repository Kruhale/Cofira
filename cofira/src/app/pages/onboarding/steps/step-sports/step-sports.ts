import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { OnboardingService } from '../../../../services/onboarding.service';
import { IdiomaService } from '../../../../services/idioma.service';
import { Button } from '../../../../components/shared/button/button';
import { Chip } from '../../../../components/shared/chip/chip';
import { TEXTOS_ONBOARDING } from '../../textos-onboarding';

@Component({
  selector: 'app-step-sports',
  standalone: true,
  imports: [Button, Chip],
  templateUrl: './step-sports.html',
  styleUrl: './step-sports.scss',
})
export class StepSports {
  @Output() continuar = new EventEmitter<void>();
  readonly deportesSeleccionados = signal<string[]>([]);
  private readonly onboardingService = inject(OnboardingService);
  private readonly idiomaService = inject(IdiomaService);

  /* Textos del paso en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_ONBOARDING[this.idiomaService.idioma()].deportes);

  constructor() {
    const data = this.onboardingService.formData();
    if (data.sports && data.sports.length > 0) {
      this.deportesSeleccionados.set([...data.sports]);
    }
  }

  estaSeleccionado(id: string): boolean {
    return this.deportesSeleccionados().includes(id);
  }

  alAlternar(id: string): void {
    const actuales = this.deportesSeleccionados();
    if (actuales.includes(id)) {
      this.deportesSeleccionados.set(actuales.filter((deporte) => deporte !== id));
    } else {
      this.deportesSeleccionados.set([...actuales, id]);
    }
  }

  alContinuar(): void {
    this.onboardingService.setField('sports', this.deportesSeleccionados());
    this.continuar.emit();
  }

  alOmitir(): void {
    this.onboardingService.setField('sports', []);
    this.continuar.emit();
  }
}
