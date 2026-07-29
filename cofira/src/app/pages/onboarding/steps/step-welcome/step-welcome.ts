import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../../../components/shared/button/button';
import { IdiomaService } from '../../../../services/idioma.service';
import { TEXTOS_ONBOARDING } from '../../textos-onboarding';

@Component({
  selector: 'app-step-welcome',
  standalone: true,
  imports: [Button, RouterLink],
  templateUrl: './step-welcome.html',
  styleUrl: './step-welcome.scss',
})
export class StepWelcome {
  @Output() continuar = new EventEmitter<void>();
  private readonly idiomaService = inject(IdiomaService);

  /* Textos del paso en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_ONBOARDING[this.idiomaService.idioma()].bienvenida);

  alContinuar(): void {
    this.continuar.emit();
  }
}
