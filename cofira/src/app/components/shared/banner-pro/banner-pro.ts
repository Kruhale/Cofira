import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IdiomaService } from '../../../services/idioma.service';
import { TEXTOS_BANNER_PRO } from './textos-banner-pro';

@Component({
  selector: 'app-banner-pro',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './banner-pro.html',
  styleUrl: './banner-pro.scss',
})
export class BannerPro {
  private readonly idiomaService = inject(IdiomaService);

  readonly textos = computed(() => TEXTOS_BANNER_PRO[this.idiomaService.idioma()]);
}
