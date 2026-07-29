import { Component, ViewEncapsulation, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { OnboardingService } from '../../services/onboarding.service';
import { SuscripcionService } from '../../services/suscripcion.service';
import { IdiomaService } from '../../services/idioma.service';
import { Button } from '../../components/shared/button/button';
import { Chip } from '../../components/shared/chip/chip';
import { TEXTOS_ONBOARDING } from '../onboarding/textos-onboarding';
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

/* Forma del GET /usuarios/{id}: solo los campos que pinta esta página */
interface UsuarioDetalle {
  nombre?: string;
  peso?: number;
  altura?: number;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, Button, Chip],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Perfil {
  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly onboardingService = inject(OnboardingService);
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

  /* Mi entrenamiento: listas de opciones del onboarding (mismo i18n) y la
     selección viva del usuario, editable desde el perfil */
  readonly opcionesDeportes = computed(() => TEXTOS_ONBOARDING[this.idiomaService.idioma()].deportes.opciones);
  readonly opcionesEquipamiento = computed(() => TEXTOS_ONBOARDING[this.idiomaService.idioma()].equipamiento.opciones);
  readonly deportesSeleccionados = signal<string[]>([]);
  readonly equipoSeleccionado = signal<string[]>([]);
  readonly guardandoEntrenamiento = signal(false);

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
    this.cargarDatosServidor();
    this.cargarEntrenamiento();
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

  /* El AuthResponse del login no trae peso/altura: la verdad vive en el
     servidor y sin esta llamada el IMC salía siempre vacío */
  private cargarDatosServidor(): void {
    const usuario = this.authService.currentUser();
    if (!usuario) {
      return;
    }

    this.apiService.get<UsuarioDetalle>(`/usuarios/${usuario.id}`).subscribe({
      next: (detalle) => {
        this.datosUsuario.update((datos) => ({
          ...datos,
          nombre: detalle.nombre || datos.nombre,
          peso: detalle.peso ?? datos.peso,
          altura: detalle.altura ?? datos.altura,
        }));
      },
      error: (errorCapturado) => {
        console.error('Error al cargar el detalle del usuario:', errorCapturado);
      },
    });
  }

  private cargarEntrenamiento(): void {
    const datosOnboarding = this.onboardingService.formData();
    this.deportesSeleccionados.set([...(datosOnboarding.sports || [])]);
    this.equipoSeleccionado.set([...(datosOnboarding.equipment || [])]);
  }

  alternarDeporte(id: string): void {
    const actuales = this.deportesSeleccionados();
    if (actuales.includes(id)) {
      this.deportesSeleccionados.set(actuales.filter((deporte) => deporte !== id));
    } else {
      this.deportesSeleccionados.set([...actuales, id]);
    }
  }

  alternarEquipo(id: string): void {
    const actuales = this.equipoSeleccionado();
    if (actuales.includes(id)) {
      this.equipoSeleccionado.set(actuales.filter((equipo) => equipo !== id));
    } else {
      this.equipoSeleccionado.set([...actuales, id]);
    }
  }

  guardarEntrenamiento(): void {
    this.guardandoEntrenamiento.set(true);

    const cuerpoPeticion = {
      sports: this.deportesSeleccionados(),
      equipment: this.equipoSeleccionado(),
    };

    this.apiService.put<void>('/onboarding/sports', cuerpoPeticion).subscribe({
      next: () => {
        // El formData local también se actualiza: la próxima rutina usa la lista viva
        this.onboardingService.setField('sports', this.deportesSeleccionados());
        this.onboardingService.setField('equipment', this.equipoSeleccionado());
        this.guardandoEntrenamiento.set(false);
        this.notificacionService.exito(this.textos().avisoEntrenamientoGuardado);
      },
      error: (errorCapturado) => {
        console.error('Error al guardar el entrenamiento:', errorCapturado);
        this.guardandoEntrenamiento.set(false);
        this.notificacionService.error(this.textos().avisoEntrenamientoError);
      },
    });
  }

  activarEdicion(): void {
    this.modoEdicion.set(true);
  }

  cancelarEdicion(): void {
    this.modoEdicion.set(false);
    this.cargarDatosUsuario();
    this.cargarDatosServidor();
  }

  guardarCambios(): void {
    const usuario = this.authService.currentUser();
    if (!usuario) {
      return;
    }

    this.estaCargando.set(true);
    const datos = this.datosUsuario();

    const cuerpoPeticion = {
      nombre: datos.nombre,
      peso: datos.peso,
      altura: datos.altura,
    };

    this.apiService.put(`/usuarios/${usuario.id}`, cuerpoPeticion).subscribe({
      next: () => {
        this.estaCargando.set(false);
        this.modoEdicion.set(false);
        this.notificacionService.exito(this.textos().avisoPerfilActualizado);
      },
      error: (errorCapturado) => {
        console.error('Error al guardar el perfil:', errorCapturado);
        this.estaCargando.set(false);
        this.notificacionService.error(this.textos().avisoPerfilError);
      },
    });
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
