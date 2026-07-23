import { Component, ViewEncapsulation, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { SuscripcionService } from '../../services/suscripcion.service';
import { IdiomaService } from '../../services/idioma.service';
import { Button } from '../../components/shared/button/button';
import { TEXTOS_PERFIL } from './textos-perfil';

interface DatosUsuario {
  nombre: string;
  email: string;
  fechaRegistro: string;
  peso: number | null;
  altura: number | null;
  objetivo: string;
  nivelActividad: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, Button],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Perfil {
  private readonly authService = inject(AuthService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly suscripcionService = inject(SuscripcionService);
  private readonly idiomaService = inject(IdiomaService);

  /* Textos del perfil en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_PERFIL[this.idiomaService.idioma()]);

  readonly usuarioEsPro = computed(
    function (this: Perfil) {
      return this.suscripcionService.esPro();
    }.bind(this),
  );

  readonly estaCargando = signal(false);
  readonly modoEdicion = signal(false);

  readonly datosUsuario = signal<DatosUsuario>({
    nombre: '',
    email: '',
    fechaRegistro: '',
    peso: null,
    altura: null,
    objetivo: 'Mantener peso',
    nivelActividad: 'Moderado',
  });

  readonly objetivos = computed(() => this.textos().objetivos);

  readonly nivelesActividad = computed(() => this.textos().nivelesActividad);

  /* El nivel guardado siempre viene en español del backend, por eso la
     descripción traducida se busca con ese valor como clave */
  readonly descripcionActividad = computed(() => {
    const nivelGuardado = this.datosUsuario().nivelActividad;
    const descripciones = this.textos().descripcionesActividad;
    return descripciones[nivelGuardado] ?? this.textos().descripcionActividadDefecto;
  });

  /* Número puro: la vista lo formatea con comaDecimal y estadoImc lo compara
     sin parsear (con string y coma, parseFloat cortaría en "24") */
  readonly imcCalculado = computed(() => {
    const datos = this.datosUsuario();
    if (datos.peso && datos.altura) {
      const alturaEnMetros = datos.altura / 100;
      const imc = datos.peso / (alturaEnMetros * alturaEnMetros);
      return Math.round(imc * 10) / 10;
    }
    return null;
  });

  readonly estadoImc = computed(() => {
    const valorImc = this.imcCalculado();
    if (!valorImc) return null;

    const textosImc = this.textos();
    if (valorImc < 18.5) return { texto: textosImc.imcBajo, clase: 'bajo' };
    if (valorImc < 25) return { texto: textosImc.imcNormal, clase: 'normal' };
    if (valorImc < 30) return { texto: textosImc.imcSobrepeso, clase: 'sobrepeso' };
    return { texto: textosImc.imcObesidad, clase: 'obesidad' };
  });

  // Decimal al estilo del idioma vigente: 76.5 → "76,5" (es) / "76.5" (en)
  comaDecimal(valor: number): string {
    const cifra = valor.toFixed(1);
    return this.idiomaService.idioma() === 'en' ? cifra : cifra.replace('.', ',');
  }

  constructor() {
    this.cargarDatosUsuario();
  }

  private cargarDatosUsuario(): void {
    const usuario = this.authService.currentUser();
    if (usuario) {
      this.datosUsuario.set({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        fechaRegistro: usuario.fechaRegistro || new Date().toISOString(),
        peso: usuario.peso || null,
        altura: usuario.altura || null,
        objetivo: usuario.objetivo || 'Mantener peso',
        nivelActividad: usuario.nivelActividad || 'Moderado',
      });
    }
  }

  activarEdicion(): void {
    this.modoEdicion.set(true);
  }

  cancelarEdicion(): void {
    this.modoEdicion.set(false);
    this.cargarDatosUsuario();
  }

  guardarCambios(): void {
    this.estaCargando.set(true);

    setTimeout(() => {
      this.estaCargando.set(false);
      this.modoEdicion.set(false);
      this.notificacionService.exito(this.textos().avisoPerfilActualizado);
    }, 1000);
  }

  formatearFecha(fechaIso: string): string {
    if (!fechaIso) return this.textos().fechaNoDisponible;

    const fecha = new Date(fechaIso);
    const opciones: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const localeFecha = this.idiomaService.idioma() === 'en' ? 'en-US' : 'es-ES';
    return fecha.toLocaleDateString(localeFecha, opciones);
  }
}
