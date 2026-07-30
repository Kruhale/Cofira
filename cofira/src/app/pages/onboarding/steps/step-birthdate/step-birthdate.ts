import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OnboardingService } from '../../../../services/onboarding.service';
import { IdiomaService } from '../../../../services/idioma.service';
import { Button } from '../../../../components/shared/button/button';
import { TEXTOS_ONBOARDING } from '../../textos-onboarding';

@Component({
  selector: 'app-step-birthdate',
  standalone: true,
  imports: [FormsModule, Button],
  templateUrl: './step-birthdate.html',
  styleUrl: './step-birthdate.scss',
})
export class StepBirthdate {
  @Output() continuar = new EventEmitter<void>();
  readonly birthDate = signal<string>('');
  readonly maxDate = this.getMaxDate();
  readonly minDate = this.getMinDate();
  private readonly onboardingService = inject(OnboardingService);
  private readonly idiomaService = inject(IdiomaService);

  /* Textos del paso en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_ONBOARDING[this.idiomaService.idioma()].nacimiento);

  constructor() {
    const data = this.onboardingService.formData();
    if (data.birthDate) {
      this.birthDate.set(data.birthDate);
    }
  }

  alCambiarFecha(value: string): void {
    this.birthDate.set(value);
  }

  alContinuar(): void {
    const date = this.birthDate();
    if (date) {
      this.onboardingService.setField('birthDate', date);
      this.continuar.emit();
    }
  }

  canContinue(): boolean {
    return this.birthDate() !== '';
  }

  private getMaxDate(): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 14);
    return today.toISOString().split('T')[0];
  }

  private getMinDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 100);
    return date.toISOString().split('T')[0];
  }
}
