import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Button } from '../../components/shared/button/button';
import { Calendario } from '../../components/shared/calendario/calendario';
import { Ingredientes } from '../../components/shared/ingredientes/ingredientes';
import { ModalComidaAlternativa } from '../../components/shared/modal-comida-alternativa/modal-comida-alternativa';
import { ModalSubirImagen } from '../../components/shared/modal-subir-imagen/modal-subir-imagen';
import { AlimentacionService } from '../../services/alimentacion.service';
import { AuthService } from '../../services/auth.service';
import { ContadorAnimadoDirective } from '../../directives/contador-animado.directive';
import { NotificacionService } from '../../services/notificacion.service';
import { AguaService } from '../../services/agua.service';
import { ConsumoComidaService } from '../../services/consumo-comida.service';
import { Alimento, Comida, TipoComida } from '../../models/alimentacion.model';
import { MarcarComidaConsumidaRequest } from '../../models/consumo-comida.model';
import { IdiomaService } from '../../services/idioma.service';
import { SuscripcionService } from '../../services/suscripcion.service';
import { construirMenuDemo } from '../../services/datos-demo';
import { BannerPro } from '../../components/shared/banner-pro/banner-pro';
import { TEXTOS_ALIMENTACION } from './textos-alimentacion';

@Component({
  selector: 'app-alimentacion',
  standalone: true,
  imports: [
    Button,
    Calendario,
    Ingredientes,
    ModalComidaAlternativa,
    ModalSubirImagen,
    ContadorAnimadoDirective,
    BannerPro,
  ],
  templateUrl: './alimentacion.html',
  styleUrl: './alimentacion.scss',
})
export class Alimentacion implements OnInit {
  private readonly alimentacionService = inject(AlimentacionService);
  private readonly notificacionService = inject(NotificacionService);
  private readonly aguaService = inject(AguaService);
  private readonly consumoComidaService = inject(ConsumoComidaService);
  private readonly idiomaService = inject(IdiomaService);
  private readonly authService = inject(AuthService);
  private readonly suscripcionService = inject(SuscripcionService);
  private readonly enrutador = inject(Router);

  /* true cuando el servidor confirma que la cuenta NO es PRO: se enseña el
     plan de ejemplo con el banner para activar PRO */
  readonly esDemo = signal(false);

  /* Anillo de kcal: 2π×r(52) del SVG; el offset descubre el arco según el %
     del objetivo diario que cubre el plan */
  private readonly CIRCUNFERENCIA_ANILLO = 326.7;
  readonly caloriasObjetivo = signal(this.leerObjetivoCalorias());

  readonly anilloDashoffset = computed(() => {
    const kcalPlan = this.resumenNutricional()?.caloriasTotal || 0;
    const progreso = Math.min(kcalPlan / this.caloriasObjetivo(), 1);
    return this.CIRCUNFERENCIA_ANILLO * (1 - progreso);
  });

  /* Textos de la interfaz en el idioma vigente: cambiar el signal repinta todo */
  readonly textos = computed(() => TEXTOS_ALIMENTACION[this.idiomaService.idioma()]);

  readonly fechaActualDate = signal(new Date());

  /* Saludo por franja horaria + nombre de pila: la app te habla a ti */
  readonly saludoPersonal = computed(() => {
    const hora = new Date().getHours();
    const textosActuales = this.textos();

    let saludo = textosActuales.saludoNoche;
    if (hora >= 6 && hora < 13) {
      saludo = textosActuales.saludoManana;
    } else if (hora >= 13 && hora < 21) {
      saludo = textosActuales.saludoTarde;
    }

    const nombreCompleto = this.authService.userNombre();
    const nombrePila = nombreCompleto.split(' ')[0];
    return nombrePila ? `${saludo}, ${nombrePila}` : saludo;
  });
  readonly aguaConsumida = this.aguaService.aguaConsumida;
  readonly aguaActualizando = this.aguaService.actualizando;
  readonly aguaObjetivo = signal(3);

  /* 12 vasos de 0.25L: las muescas del panel de agua hasta el objetivo de 3L */
  readonly listaMuescasAgua = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  readonly muescasAguaLlenas = computed(() => {
    const vasosConsumidos = Math.round(this.aguaConsumida() / 0.25);
    return Math.min(vasosConsumidos, this.listaMuescasAgua.length);
  });

  readonly registrosPorTipo = this.consumoComidaService.registrosPorTipo;
  readonly resumenReal = this.consumoComidaService.resumenReal;
  readonly consumoLoading = this.consumoComidaService.isLoading;

  modalAlternativaAbierto = false;
  modalImagenAbierto = false;
  comidaParaRegistrar: Comida | null = null;

  constructor() {
    effect(
      () => {
        const mensajeError = this.alimentacionService.error();
        if (mensajeError) {
          this.notificacionService.error(mensajeError, 5000);
          this.alimentacionService.error.set(null);
        }
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      const fecha = this.fechaActualDate();
      const fechaString = this.formatearFecha(fecha);
      this.consumoComidaService.obtenerRegistrosPorFecha(fechaString).subscribe();
      this.consumoComidaService.obtenerResumenReal(fechaString).subscribe();
    });
  }
  calendarioAbierto = false;
  ingredientesAbierto = false;
  alimentoSeleccionado: Alimento | null = null;
  comidaSeleccionada: Comida | null = null;

  readonly isLoading = this.alimentacionService.isLoading;
  readonly tieneMenu = this.alimentacionService.tieneMenu;
  readonly estadoIA = this.alimentacionService.estadoIA;
  readonly menuGenerado = this.alimentacionService.menuGenerado;
  readonly progresoGeneracion = this.alimentacionService.progresoGeneracion;
  readonly estaGenerando = this.alimentacionService.estaGenerando;

  readonly comidasDelDia = computed(() => {
    return this.alimentacionService.obtenerComidasDelDia(this.fechaActualDate());
  });

  readonly resumenNutricional = computed(() => {
    return this.alimentacionService.obtenerResumenDelDia(this.fechaActualDate());
  });

  readonly tieneMenuParaFecha = computed(() => {
    const fechaActual = this.fechaActualDate();
    const fechaInicio = this.alimentacionService.fechaInicio();
    const fechaFin = this.alimentacionService.fechaFin();

    if (!fechaInicio || !fechaFin) {
      return false;
    }

    const fechaActualSinHora = new Date(fechaActual);
    fechaActualSinHora.setHours(0, 0, 0, 0);

    // Parseo LOCAL: new Date("2026-07-27") interpreta UTC y en verano (UTC+2)
    // dejaba el primer día del plan fuera de rango hasta las 2:00
    const inicio = this.parsearFechaLocal(fechaInicio);
    const fin = this.parsearFechaLocal(fechaFin);

    return fechaActualSinHora >= inicio && fechaActualSinHora <= fin;
  });

  /* Tira de días del plan: un chip por día entre fechaInicio y fechaFin */
  readonly listaDiasMenu = computed(() => {
    const fechaInicio = this.alimentacionService.fechaInicio();
    const fechaFin = this.alimentacionService.fechaFin();

    if (!fechaInicio || !fechaFin) {
      return [];
    }

    const inicio = this.parsearFechaLocal(fechaInicio);
    const fin = this.parsearFechaLocal(fechaFin);
    const hoyString = this.formatearFecha(new Date());

    const listaDias: {
      fecha: Date;
      letraDia: string;
      numeroDia: number;
      esHoy: boolean;
      etiquetaAria: string;
    }[] = [];
    const diaActual = new Date(inicio);

    while (diaActual <= fin && listaDias.length < 14) {
      listaDias.push({
        fecha: new Date(diaActual),
        letraDia: this.textos().diasSemanaCorto[diaActual.getDay()],
        numeroDia: diaActual.getDate(),
        esHoy: this.formatearFecha(diaActual) === hoyString,
        etiquetaAria: `${this.textos().diasSemana[diaActual.getDay()]} ${diaActual.getDate()}`,
      });
      diaActual.setDate(diaActual.getDate() + 1);
    }

    return listaDias;
  });

  /* Rango del plan para la meta de cabecera: "27 jul — 02 ago" */
  readonly rangoPlanTexto = computed(() => {
    const fechaInicio = this.alimentacionService.fechaInicio();
    const fechaFin = this.alimentacionService.fechaFin();

    if (!fechaInicio || !fechaFin) {
      return '';
    }

    const inicio = this.parsearFechaLocal(fechaInicio);
    const fin = this.parsearFechaLocal(fechaFin);
    const idioma = this.idiomaService.idioma() === 'en' ? 'en-US' : 'es-ES';
    const formato: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };

    const inicioTexto = inicio.toLocaleDateString(idioma, formato);
    const finTexto = fin.toLocaleDateString(idioma, formato);
    return `${inicioTexto} — ${finTexto}`;
  });

  readonly fechaActual = computed(() => {
    const fecha = this.fechaActualDate();
    const diaSemana = this.textos().diasSemana[fecha.getDay()];
    const dia = fecha.getDate();
    return `${diaSemana} ${dia}`;
  });

  ngOnInit(): void {
    this.aguaService.obtenerConsumoHoy().subscribe();

    // La autoridad sobre PRO es el servidor: con cuenta gratis se carga el
    // menú de ejemplo y nunca se lanza la generación con IA
    this.suscripcionService.refrescarEstado().subscribe({
      next: (estado) => {
        if (estado.esPro) {
          this.verificarYGenerarMenuSiNecesario();
        } else {
          this.activarModoDemo();
        }
      },
      error: () => this.activarModoDemo(),
    });
  }

  private activarModoDemo(): void {
    this.esDemo.set(true);
    this.alimentacionService.cargarMenuDemo(construirMenuDemo());
  }

  private leerObjetivoCalorias(): number {
    try {
      const targetsGuardados = localStorage.getItem('cofira_nutrition_targets');
      if (!targetsGuardados) {
        return 2200;
      }
      const targets = JSON.parse(targetsGuardados);
      const objetivo = Number(targets.dailyCalories);
      return objetivo > 0 ? objetivo : 2200;
    } catch {
      return 2200;
    }
  }

  private verificarYGenerarMenuSiNecesario(): void {
    const cargaCompletada = this.alimentacionService.cargaInicialCompletada();

    if (!cargaCompletada) {
      setTimeout(() => this.verificarYGenerarMenuSiNecesario(), 100);
      return;
    }

    if (!this.tieneMenu()) {
      this.generarMenuSemanalAutomatico();
    } else {
      this.alimentacionService.verificarYRegenerarSiNecesario();
    }
  }

  seleccionarDia(fecha: Date): void {
    this.fechaActualDate.set(new Date(fecha));
  }

  esDiaActivo(fecha: Date): boolean {
    return this.formatearFecha(fecha) === this.formatearFecha(this.fechaActualDate());
  }

  diaAnterior(): void {
    this.fechaActualDate.update((fecha) => new Date(fecha.getTime() - 24 * 60 * 60 * 1000));
  }

  diaSiguiente(): void {
    this.fechaActualDate.update((fecha) => new Date(fecha.getTime() + 24 * 60 * 60 * 1000));
  }

  abrirCalendario(): void {
    this.calendarioAbierto = true;
  }

  cerrarCalendario(): void {
    this.calendarioAbierto = false;
  }

  seleccionarFechaCalendario(fecha: Date): void {
    this.fechaActualDate.set(fecha);
    this.cerrarCalendario();
  }

  verIngredientes(alimento: Alimento, comida: Comida): void {
    this.alimentoSeleccionado = alimento;
    this.comidaSeleccionada = comida;
    this.ingredientesAbierto = true;
  }

  cerrarIngredientes(): void {
    this.ingredientesAbierto = false;
    this.alimentoSeleccionado = null;
    this.comidaSeleccionada = null;
  }

  /* La preparación llega como "1. ... 2. ..." — se parte en pasos para
     pintarla como receta; si no viene numerada se enseña tal cual */
  pasosPreparacion(comida: Comida): string[] {
    const preparacion = comida.preparacion || '';
    const pasos = preparacion.split(/\s*\d+\.\s+/).filter((paso) => paso.trim().length > 0);
    return pasos.length >= 2 ? pasos : [];
  }

  regenerarMenu(): void {
    if (this.esDemo()) {
      this.enrutador.navigate(['/acceso-pro']);
      return;
    }
    this.alimentacionService.generarMenuSemanalConStreaming();
  }

  cancelarGeneracion(): void {
    this.alimentacionService.cancelarGeneracion();
  }

  private generarMenuSemanalAutomatico(): void {
    this.alimentacionService.verificarConexionIA().subscribe({
      next: (estado) => {
        if (estado.conectado) {
          this.alimentacionService.generarMenuSemanalConStreaming();
        }
      },
    });
  }

  agregarAgua(): void {
    this.aguaService.agregarAgua();
  }

  quitarAgua(): void {
    this.aguaService.quitarAgua();
  }

  estaComidaConsumida(comida: Comida): boolean {
    const tipoComidaUpperCase = comida.tipo.toUpperCase();
    return this.consumoComidaService.estaComidaConsumida(tipoComidaUpperCase);
  }

  toggleComidaConsumida(comida: Comida): void {
    const tipoComidaUpperCase = comida.tipo.toUpperCase();
    const fechaString = this.formatearFecha(this.fechaActualDate());
    const estaConsumida = this.estaComidaConsumida(comida);

    if (estaConsumida) {
      this.consumoComidaService.desmarcarComida(fechaString, tipoComidaUpperCase).subscribe({
        next: () => {
          this.notificacionService.exito(this.textos().toastDesmarcada);
          this.consumoComidaService.obtenerResumenReal(fechaString).subscribe();
        },
        error: () => this.notificacionService.error(this.textos().toastErrorDesmarcar),
      });
    } else {
      const solicitud: MarcarComidaConsumidaRequest = {
        fecha: fechaString,
        tipoComida: tipoComidaUpperCase,
        comidaMenuId: comida.id,
        consumioMenu: true,
        caloriasReales: comida.caloriasEstimadas,
        proteinasReales: comida.proteinasGramos,
        carbohidratosReales: comida.carbohidratosGramos,
        grasasReales: comida.grasasGramos,
      };

      this.consumoComidaService.marcarComidaConsumida(solicitud).subscribe({
        next: () => {
          this.notificacionService.exito(this.textos().toastMarcada);
          this.consumoComidaService.obtenerResumenReal(fechaString).subscribe();
        },
        error: () => this.notificacionService.error(this.textos().toastErrorMarcar),
      });
    }
  }

  abrirModalAlternativa(comida: Comida): void {
    this.comidaParaRegistrar = comida;
    this.modalAlternativaAbierto = true;
  }

  cerrarModalAlternativa(): void {
    this.modalAlternativaAbierto = false;
    this.comidaParaRegistrar = null;
  }

  abrirModalImagen(comida: Comida): void {
    this.comidaParaRegistrar = comida;
    this.modalImagenAbierto = true;
  }

  cerrarModalImagen(): void {
    this.modalImagenAbierto = false;
    this.comidaParaRegistrar = null;
  }

  refrescarDatosConsumo(): void {
    const fechaString = this.formatearFecha(this.fechaActualDate());
    this.consumoComidaService.obtenerRegistrosPorFecha(fechaString).subscribe();
    this.consumoComidaService.obtenerResumenReal(fechaString).subscribe();
  }

  formatearFecha(fecha: Date): string {
    const ano = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  private parsearFechaLocal(fechaTexto: string): Date {
    const [ano, mes, dia] = fechaTexto.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
  }

  // Decimal al estilo del idioma vigente: 0.5 → "0,5" (es) / "0.5" (en)
  comaDecimal(valor: number): string {
    const cifra = valor.toFixed(1);
    return this.idiomaService.idioma() === 'en' ? cifra : cifra.replace('.', ',');
  }
}
