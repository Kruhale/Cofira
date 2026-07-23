import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';

import { GimnasioService } from '../../services/gimnasio.service';
import { OnboardingService } from '../../services/onboarding.service';
import { AguaService } from '../../services/agua.service';
import { ConsumoComidaService } from '../../services/consumo-comida.service';
import { HistorialEntrenamiento } from '../../models/gimnasio.model';
import { IdiomaService } from '../../services/idioma.service';
import { AnimacionesService } from '../../services/animaciones.service';
import { TEXTOS_SEGUIMIENTO } from './textos-seguimiento';

interface PuntoGrafico {
  x: number;
  y: number;
  fecha: string;
  peso: number;
}

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  templateUrl: './seguimiento.html',
  styleUrl: './seguimiento.scss',
})
export class Seguimiento implements OnInit {
  private readonly gimnasioService = inject(GimnasioService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly aguaService = inject(AguaService);
  private readonly consumoComidaService = inject(ConsumoComidaService);
  private readonly idiomaService = inject(IdiomaService);
  private readonly animaciones = inject(AnimacionesService);

  /* El punto pulsante del último dato usa SMIL (<animate>), que no obedece
     el @media prefers-reduced-motion: hay que apagarlo a mano con este signal */
  readonly movimientoReducido = this.animaciones.movimientoReducido;

  /* Textos de la interfaz en el idioma vigente: cambiar el signal repinta todo */
  readonly textos = computed(() => TEXTOS_SEGUIMIENTO[this.idiomaService.idioma()]);

  readonly caloriasDiarias = signal(2000);
  readonly proteinasObjetivo = signal(120);
  readonly carbohidratosObjetivo = signal(250);
  readonly grasasObjetivo = signal(65);
  readonly fibraObjetivo = signal(25);

  readonly aguaConsumida = this.aguaService.aguaConsumida;
  readonly aguaObjetivo = signal(3);

  readonly ejerciciosDisponibles = signal<string[]>([]);
  readonly ejercicioSeleccionado = signal<string>('');
  readonly historialEjercicio = signal<HistorialEntrenamiento[]>([]);
  readonly cargandoGrafico = signal(false);

  readonly macrosConsumo = computed(() => {
    const resumen = this.consumoComidaService.resumenSemanal();
    const diasSemana = 7;

    const objetivosSemana = {
      calorias: this.caloriasDiarias() * diasSemana,
      proteinas: this.proteinasObjetivo() * diasSemana,
      carbohidratos: this.carbohidratosObjetivo() * diasSemana,
      grasas: this.grasasObjetivo() * diasSemana,
    };

    if (!resumen) {
      return {
        diasConDatos: 0,
        calorias: { consumido: 0, objetivo: objetivosSemana.calorias, porcentaje: 0 },
        proteinas: {
          consumido: 0,
          objetivo: objetivosSemana.proteinas,
          porcentaje: 0,
          porcentajeGrafica: 0,
        },
        carbohidratos: {
          consumido: 0,
          objetivo: objetivosSemana.carbohidratos,
          porcentaje: 0,
          porcentajeGrafica: 0,
        },
        grasas: {
          consumido: 0,
          objetivo: objetivosSemana.grasas,
          porcentaje: 0,
          porcentajeGrafica: 0,
        },
      };
    }

    const totalGramosConsumidos =
      resumen.proteinasConsumidas + resumen.carbohidratosConsumidos + resumen.grasasConsumidas;

    return {
      diasConDatos: resumen.comidasRegistradas,
      calorias: {
        consumido: resumen.caloriasConsumidas,
        objetivo: objetivosSemana.calorias,
        porcentaje:
          objetivosSemana.calorias > 0
            ? Math.round((resumen.caloriasConsumidas / objetivosSemana.calorias) * 100)
            : 0,
      },
      proteinas: {
        consumido: resumen.proteinasConsumidas,
        objetivo: objetivosSemana.proteinas,
        porcentaje:
          objetivosSemana.proteinas > 0
            ? Math.round((resumen.proteinasConsumidas / objetivosSemana.proteinas) * 100)
            : 0,
        porcentajeGrafica:
          totalGramosConsumidos > 0
            ? Math.round((resumen.proteinasConsumidas / totalGramosConsumidos) * 100)
            : 0,
      },
      carbohidratos: {
        consumido: resumen.carbohidratosConsumidos,
        objetivo: objetivosSemana.carbohidratos,
        porcentaje:
          objetivosSemana.carbohidratos > 0
            ? Math.round((resumen.carbohidratosConsumidos / objetivosSemana.carbohidratos) * 100)
            : 0,
        porcentajeGrafica:
          totalGramosConsumidos > 0
            ? Math.round((resumen.carbohidratosConsumidos / totalGramosConsumidos) * 100)
            : 0,
      },
      grasas: {
        consumido: resumen.grasasConsumidas,
        objetivo: objetivosSemana.grasas,
        porcentaje:
          objetivosSemana.grasas > 0
            ? Math.round((resumen.grasasConsumidas / objetivosSemana.grasas) * 100)
            : 0,
        porcentajeGrafica:
          totalGramosConsumidos > 0
            ? Math.round((resumen.grasasConsumidas / totalGramosConsumidos) * 100)
            : 0,
      },
    };
  });

  /* Rango del lienzo derivado de los datos con margen, como la gráfica de la
     landing: así un punto de 70kg no queda perdido en un eje que arranca en 0 */
  readonly rangoPesoGrafico = computed(() => {
    const historial = this.historialEjercicio();
    if (historial.length === 0) {
      return { suelo: 0, techo: 100 };
    }

    const pesosRegistrados = historial.map((registro) => registro.pesoKg || 0);
    const pesoMinimo = Math.min(...pesosRegistrados);
    const pesoMaximo = Math.max(...pesosRegistrados);
    const margenRango = Math.max((pesoMaximo - pesoMinimo) * 0.25, 2.5);

    const sueloSinRedondear = pesoMinimo - margenRango;
    const techoSinRedondear = pesoMaximo + margenRango;
    const suelo = Math.max(Math.floor(sueloSinRedondear / 2.5) * 2.5, 0);
    const techo = Math.ceil(techoSinRedondear / 2.5) * 2.5;

    return { suelo, techo };
  });

  readonly puntosGrafico = computed(() => {
    const historial = this.historialEjercicio();
    if (historial.length === 0) {
      return [];
    }

    const rango = this.rangoPesoGrafico();
    const amplitudRango = rango.techo - rango.suelo;

    const puntos: PuntoGrafico[] = historial.map((registro, indice) => {
      const pesoRegistro = registro.pesoKg || 0;
      const proporcionHorizontal = indice / Math.max(historial.length - 1, 1);
      const proporcionVertical = (pesoRegistro - rango.suelo) / amplitudRango;

      const x = this.margenIzquierdo + proporcionHorizontal * this.anchoGrafico;
      const y = this.margenSuperior + this.altoGrafico - proporcionVertical * this.altoGrafico;

      return {
        x,
        y,
        fecha: this.formatearFechaCorta(registro.fechaEntrenamiento),
        peso: pesoRegistro,
      };
    });

    return puntos;
  });

  readonly guiasEjeY = computed(() => {
    const rango = this.rangoPesoGrafico();
    const totalGuias = 5;
    const guias: { y: number; peso: number }[] = [];

    for (let indice = 0; indice < totalGuias; indice++) {
      const fraccion = indice / (totalGuias - 1);
      const pesoGuia = rango.techo - (rango.techo - rango.suelo) * fraccion;
      const y = this.margenSuperior + fraccion * this.altoGrafico;

      guias.push({ y, peso: Math.round(pesoGuia * 10) / 10 });
    }

    return guias;
  });

  readonly resumenFuerza = computed(() => {
    const historial = this.historialEjercicio();
    if (historial.length === 0) {
      return { ultimoPeso: 0, mejorMarca: 0, sesiones: 0 };
    }

    const pesosRegistrados = historial.map((registro) => registro.pesoKg || 0);
    const ultimoPeso = pesosRegistrados[pesosRegistrados.length - 1];
    const mejorMarca = Math.max(...pesosRegistrados);

    return { ultimoPeso, mejorMarca, sesiones: historial.length };
  });

  readonly polylinePoints = computed(() => {
    const puntos = this.puntosGrafico();
    return puntos.map((p) => `${p.x},${p.y}`).join(' ');
  });

  readonly fechasEjeX = computed(() => {
    const puntos = this.puntosGrafico();
    if (puntos.length <= 7) {
      return puntos;
    }

    const paso = Math.ceil(puntos.length / 7);
    const fechasFiltradas: PuntoGrafico[] = [];

    for (let i = 0; i < puntos.length; i += paso) {
      fechasFiltradas.push(puntos[i]);
    }

    if (fechasFiltradas[fechasFiltradas.length - 1] !== puntos[puntos.length - 1]) {
      fechasFiltradas.push(puntos[puntos.length - 1]);
    }

    return fechasFiltradas;
  });

  /* Geometría del lienzo SVG de la gráfica de fuerza */
  private readonly anchoGrafico = 510;
  private readonly altoGrafico = 215;
  private readonly margenIzquierdo = 50;
  private readonly margenSuperior = 20;

  constructor() {
    effect(() => {
      const actualizacion = this.gimnasioService.progresoActualizado();

      if (actualizacion > 0) {
        this.recargarDatosGrafico();
      }
    });
  }

  ngOnInit(): void {
    this.cargarObjetivosNutricionales();
    this.cargarEjerciciosDisponibles();
    this.aguaService.obtenerConsumoHoy().subscribe();
    this.consumoComidaService.obtenerResumenSemanal().subscribe();
  }

  seleccionarEjercicio(nombreEjercicio: string): void {
    this.ejercicioSeleccionado.set(nombreEjercicio);
    this.cargarProgresoEjercicio(nombreEjercicio);
  }

  private cargarObjetivosNutricionales(): void {
    this.onboardingService.getNutritionTargets().subscribe({
      next: (objetivos) => {
        this.caloriasDiarias.set(objetivos.dailyCalories || 2000);
        this.proteinasObjetivo.set(objetivos.proteinGrams || 120);
        this.carbohidratosObjetivo.set(objetivos.carbsGrams || 250);
        this.grasasObjetivo.set(objetivos.fatGrams || 65);
        this.fibraObjetivo.set(objetivos.fiberGrams || 25);
      },
      error: () => {
        console.error('No se pudieron cargar los objetivos nutricionales');
      },
    });
  }

  private cargarEjerciciosDisponibles(): void {
    this.gimnasioService.obtenerEjerciciosUnicos().subscribe({
      next: (ejercicios) => {
        this.ejerciciosDisponibles.set(ejercicios);

        if (ejercicios.length > 0) {
          this.ejercicioSeleccionado.set(ejercicios[0]);
          this.cargarProgresoEjercicio(ejercicios[0]);
        }
      },
      error: () => {
        console.error('No se pudieron cargar los ejercicios');
      },
    });
  }

  private cargarProgresoEjercicio(nombreEjercicio: string): void {
    this.cargandoGrafico.set(true);

    this.gimnasioService.obtenerProgresoPorEjercicio(nombreEjercicio).subscribe({
      next: (historial) => {
        this.historialEjercicio.set(historial);
        this.cargandoGrafico.set(false);
      },
      error: () => {
        this.historialEjercicio.set([]);
        this.cargandoGrafico.set(false);
      },
    });
  }

  private recargarDatosGrafico(): void {
    const ejercicioActual = this.ejercicioSeleccionado();

    if (!ejercicioActual) {
      return;
    }

    this.gimnasioService.obtenerProgresoPorEjercicio(ejercicioActual).subscribe({
      next: (historial) => {
        this.historialEjercicio.set(historial);
      },
    });
  }

  private formatearFechaCorta(fecha: string): string {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1;
    return `${dia}/${mes}`;
  }

  // Decimal al estilo del idioma vigente: 62.5 → "62,5" (es) / "62.5" (en)
  comaDecimal(valor: number): string {
    const cifra = valor.toFixed(1);
    return this.idiomaService.idioma() === 'en' ? cifra : cifra.replace('.', ',');
  }
}
