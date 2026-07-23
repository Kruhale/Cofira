import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { OnboardingService } from '../../../../services/onboarding.service';
import { IdiomaService } from '../../../../services/idioma.service';
import { OptionCard } from '../../../../components/shared/option-card/option-card';
import { Button } from '../../../../components/shared/button/button';
import { Gender } from '../../../../models/onboarding.model';
import { TEXTOS_ONBOARDING } from '../../textos-onboarding';

@Component({
  selector: 'app-step-gender',
  standalone: true,
  imports: [OptionCard, Button],
  templateUrl: './step-gender.html',
  styleUrl: './step-gender.scss',
})
export class StepGender {
  @Output() continuar = new EventEmitter<void>();
  readonly selectedGender = signal<Gender | null>(null);
  private readonly onboardingService = inject(OnboardingService);
  private readonly idiomaService = inject(IdiomaService);

  /* Textos del paso en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_ONBOARDING[this.idiomaService.idioma()].genero);
  readonly genders = computed(() => this.textos().opciones);

  constructor() {
    const data = this.onboardingService.formData();
    if (data.gender) {
      this.selectedGender.set(data.gender);
    }
  }

  selectGender(value: string): void {
    this.selectedGender.set(value as Gender);
  }

  alContinuar(): void {
    const gender = this.selectedGender();
    if (gender) {
      this.onboardingService.setField('gender', gender);
      this.continuar.emit();
    }
  }

  canContinue(): boolean {
    return this.selectedGender() !== null;
  }
}
