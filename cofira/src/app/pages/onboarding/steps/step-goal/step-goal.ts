import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { OnboardingService } from '../../../../services/onboarding.service';
import { IdiomaService } from '../../../../services/idioma.service';
import { OptionCard } from '../../../../components/shared/option-card/option-card';
import { Button } from '../../../../components/shared/button/button';
import { PrimaryGoal } from '../../../../models/onboarding.model';
import { TEXTOS_ONBOARDING } from '../../textos-onboarding';

@Component({
  selector: 'app-step-goal',
  standalone: true,
  imports: [OptionCard, Button],
  templateUrl: './step-goal.html',
  styleUrl: './step-goal.scss',
})
export class StepGoal {
  @Output() continuar = new EventEmitter<void>();
  readonly selectedGoal = signal<PrimaryGoal | null>(null);
  private readonly onboardingService = inject(OnboardingService);
  private readonly idiomaService = inject(IdiomaService);

  /* Textos del paso en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_ONBOARDING[this.idiomaService.idioma()].objetivo);
  readonly goals = computed(() => this.textos().opciones);

  constructor() {
    const data = this.onboardingService.formData();
    if (data.primaryGoal) {
      this.selectedGoal.set(data.primaryGoal);
    }
  }

  selectGoal(value: string): void {
    this.selectedGoal.set(value as PrimaryGoal);
  }

  alContinuar(): void {
    const goal = this.selectedGoal();
    if (goal) {
      this.onboardingService.setField('primaryGoal', goal);
      this.continuar.emit();
    }
  }

  canContinue(): boolean {
    return this.selectedGoal() !== null;
  }
}
