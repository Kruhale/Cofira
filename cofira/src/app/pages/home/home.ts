import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  NgZone,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Card } from '../../components/shared/card/card';
import { Button } from '../../components/shared/button/button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParallaxSuaveDirective } from '../../directives/parallax-suave.directive';
import { HazDeLuz } from '../../directives/haz-de-luz.directive';
import { HeliceAdn } from '../../directives/helice-adn.directive';
import { CuerpoAgua } from '../../directives/cuerpo-agua.directive';
import { AnimacionesService } from '../../services/animaciones.service';
import { RastroScroll } from '../../components/shared/rastro-scroll/rastro-scroll';
import { CintaMarquee } from '../../components/shared/cinta-marquee/cinta-marquee';
import { RevelarLineasDirective } from '../../directives/revelar-lineas.directive';
import { IdiomaService } from '../../services/idioma.service';
import { MetricaProgreso, PuntoMetrica, TEXTOS_HOME, ZonaAyuno } from './textos-home';

// Punto de la serie ya proyectado al lienzo SVG (x, y derivados del valor real)
interface PuntoTrazado extends PuntoMetrica {
  x: number;
  y: number;
  yMedia: number;
}

/* Regla temporal del ayuno con escala NO lineal: las 12 h de glucógeno se
   comprimen al 30 % y la zona metabólica interesante (12-18 h) se expande,
   igual que hace la propia hélice con su gradiente de color. */
const TRAMOS_REGLA = [
  { horaInicio: 0, horaFin: 12, inicio: 0, fin: 0.3 },
  { horaInicio: 12, horaFin: 16, inicio: 0.3, fin: 0.78 },
  { horaInicio: 16, horaFin: 18, inicio: 0.78, fin: 1 },
];

function mapearHoraARegla(horas: number): number {
  const ultimoTramo = TRAMOS_REGLA[TRAMOS_REGLA.length - 1];
  const tramo = TRAMOS_REGLA.find((candidato) => horas <= candidato.horaFin) ?? ultimoTramo;
  const avanceCrudo = (horas - tramo.horaInicio) / (tramo.horaFin - tramo.horaInicio);
  const avance = Math.min(1, Math.max(0, avanceCrudo));
  return tramo.inicio + avance * (tramo.fin - tramo.inicio);
}

/* Plan 16:8 fijo y realista: se come de 12:00 a 20:00 y se ayuna de 20:00 a
   12:00. Todo se calcula contra la hora REAL del visitante: el ayuno vigente
   empezó en las últimas 20:00 y cada evento apunta a su próxima ocurrencia. */
const HORA_MS = 3600 * 1000;

function proximaOcurrenciaMs(horaDecimal: number, ahoraMs: number): number {
  const fecha = new Date(ahoraMs);
  const horas = Math.floor(horaDecimal);
  const minutos = Math.round((horaDecimal - horas) * 60);
  fecha.setHours(horas, minutos, 0, 0);
  if (fecha.getTime() <= ahoraMs) {
    fecha.setDate(fecha.getDate() + 1);
  }
  return fecha.getTime();
}

function formatearDuracion(milisegundos: number): string {
  const totalSegundos = Math.max(0, Math.floor(milisegundos / 1000));
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;
  const dosDigitos = (valor: number) => String(valor).padStart(2, '0');
  return `${dosDigitos(horas)}:${dosDigitos(minutos)}:${dosDigitos(segundos)}`;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Card,
    Button,
    ParallaxSuaveDirective,
    HazDeLuz,
    HeliceAdn,
    CuerpoAgua,
    RastroScroll,
    CintaMarquee,
    RevelarLineasDirective,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Home {
  private readonly elementoRaiz = inject(ElementRef<HTMLElement>);
  private readonly zona = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly animaciones = inject(AnimacionesService);
  private readonly idiomaService = inject(IdiomaService);

  private contexto: gsap.Context | null = null;

  /* Idioma y textos vigentes: todo el contenido de la página deriva de estos
     dos computed, así el cambio de idioma repinta la home entera. */
  readonly idioma = computed(() => this.idiomaService.idioma());
  readonly textos = computed(() => TEXTOS_HOME[this.idiomaService.idioma()]);

  /* Precarga con contador 0→100 (una vez por sesión y solo con movimiento):
     tapa la carga y desemboca en la intro del hero sin corte. */
  mostrarPrecarga = signal(
    !this.animaciones.movimientoReducido() && sessionStorage.getItem('cofira-precarga') === null,
  );
  contadorPrecarga = signal(0);

  readonly seccionesRastro = computed(() => this.textos().rastro);

  readonly palabrasManifiesto = computed(() => this.textos().manifiesto.palabras);

  readonly pasos = computed(() => this.textos().proceso.pasos);

  readonly funcionalidades = computed(() => this.textos().funcionalidades.lista);

  indiceFuncionalidadActiva = signal(0);

  // Pin del carrusel de funcionalidades. Guardar la referencia permite que al
  // clicar una viñeta el scroll salte a ese panel; si solo se fija el índice, el
  // onUpdate del pin lo revierte al instante (de ahí el "salto que no cambia").
  private disparadorFuncionalidades: ScrollTrigger | null = null;

  readonly registroComidas = computed(() => this.textos().comidas.registro);

  /* La última comida del día es la recién analizada por foto */
  readonly indiceComidaAnalizada = computed(() => this.registroComidas().length - 1);

  readonly totalesComida = computed(() => this.textos().comidas.totales);

  readonly macrosComida = computed(() => this.textos().comidas.macros);

  /* Métricas del showcase "Gráficos de progreso". Cada pestaña (Peso/Fuerza/
     Cintura) trae su serie real de 6 meses; la geometría del SVG (x, y y las
     curvas suaves) se DERIVA de los valores, así las tres pestañas son datos de
     verdad y no maquetas dibujadas a mano. */
  readonly metricas = computed(() => this.textos().grafica.metricas);

  // Geometría del lienzo (viewBox 0 0 400 150): X regular por mes, Y proyectada.
  // Arranca en 30 para que los números del eje queden fuera de la curva.
  private readonly ejeX = [30, 102.4, 174.8, 247.2, 319.6, 392];
  private readonly lienzoIzquierda = 30;
  private readonly lienzoArriba = 22;
  private readonly lienzoAbajo = 116;
  private readonly lienzoPiso = 146;

  indiceMetrica = signal(0);
  indicePuntoActivo = signal<number | null>(null);

  /* Al cambiar de métrica la curva debe volver a dibujarse: un frame con el
     trazo oculto y sin transición, y al siguiente se anima de nuevo. */
  reinicioTrazo = signal(false);

  metricaActiva = computed(() => this.metricas()[this.indiceMetrica()]);

  seleccionarMetrica(indiceMetrica: number): void {
    if (indiceMetrica === this.indiceMetrica()) {
      return;
    }
    this.indiceMetrica.set(indiceMetrica);
    this.indicePuntoActivo.set(null);
    this.reinicioTrazo.set(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.reinicioTrazo.set(false));
    });
  }

  private redondear1(valor: number): number {
    return Math.round(valor * 10) / 10;
  }

  // Proyecta un valor de la métrica a la coordenada Y del lienzo (más valor = más arriba)
  private proyectarY(valor: number, metrica: MetricaProgreso): number {
    const proporcion = (metrica.rangoMax - valor) / (metrica.rangoMax - metrica.rangoMin);
    const y = this.lienzoArriba + proporcion * (this.lienzoAbajo - this.lienzoArriba);
    return this.redondear1(y);
  }

  // Serie de la métrica activa ya proyectada al lienzo
  puntosTrazados = computed<PuntoTrazado[]>(() => {
    const metrica = this.metricaActiva();
    return metrica.puntos.map((punto, indice) => ({
      ...punto,
      x: this.ejeX[indice],
      y: this.proyectarY(punto.valor, metrica),
      yMedia: this.proyectarY(punto.media, metrica),
    }));
  });

  // Curva suave (Catmull-Rom → Bézier cúbica) que pasa por todos los puntos
  private trazarCurva(puntos: { x: number; y: number }[]): string {
    if (puntos.length === 0) {
      return '';
    }

    const tension = 0.18;
    let ruta = `M${puntos[0].x} ${puntos[0].y}`;

    for (let indice = 0; indice < puntos.length - 1; indice += 1) {
      const anterior = puntos[indice === 0 ? 0 : indice - 1];
      const actual = puntos[indice];
      const siguiente = puntos[indice + 1];
      const posterior = puntos[Math.min(indice + 2, puntos.length - 1)];

      const control1x = this.redondear1(actual.x + (siguiente.x - anterior.x) * tension);
      const control1y = this.redondear1(actual.y + (siguiente.y - anterior.y) * tension);
      const control2x = this.redondear1(siguiente.x - (posterior.x - actual.x) * tension);
      const control2y = this.redondear1(siguiente.y - (posterior.y - actual.y) * tension);

      ruta += ` C${control1x} ${control1y} ${control2x} ${control2y} ${siguiente.x} ${siguiente.y}`;
    }

    return ruta;
  }

  rutaLinea = computed(() =>
    this.trazarCurva(this.puntosTrazados().map((punto) => ({ x: punto.x, y: punto.y }))),
  );

  rutaArea = computed(
    () =>
      `${this.rutaLinea()} L392 ${this.lienzoPiso} L${this.lienzoIzquierda} ${this.lienzoPiso} Z`,
  );

  /* Banda de datos bajo la gráfica: lectura rápida de la serie completa */
  estadisticasMetrica = computed(() => {
    const metrica = this.metricaActiva();
    const puntos = metrica.puntos;

    const cambioTotal = puntos[puntos.length - 1].valor - puntos[0].valor;
    const ritmoMensual = cambioTotal / (puntos.length - 1);

    const cambiosMensuales = puntos
      .slice(1)
      .map((punto, indice) => punto.valor - puntos[indice].valor);
    const mejorCambio = metrica.sube
      ? Math.max(...cambiosMensuales)
      : Math.min(...cambiosMensuales);
    const indiceMejor = cambiosMensuales.indexOf(mejorCambio);
    const mesMejor = puntos[indiceMejor + 1].mes;

    return {
      total: this.formatearConSigno(cambioTotal, metrica.unidad),
      ritmo: this.formatearConSigno(
        ritmoMensual,
        `${metrica.unidad}${this.textos().grafica.porMes}`,
      ),
      mejor: `${this.formatearConSigno(mejorCambio, metrica.unidad)} · ${mesMejor}`,
    };
  });

  // −0.5 → "−0,5 kg" / +3.5 → "+3,5 kg" (signo tipográfico + decimal del idioma)
  private formatearConSigno(valor: number, unidad: string): string {
    const signo = valor < 0 ? '−' : '+';
    const cifra = this.comaDecimal(Math.abs(valor));
    return `${signo}${cifra} ${unidad}`;
  }

  rutaMedia = computed(() =>
    this.trazarCurva(this.puntosTrazados().map((punto) => ({ x: punto.x, y: punto.yMedia }))),
  );

  objetivoY = computed(() => this.proyectarY(this.metricaActiva().objetivo, this.metricaActiva()));

  ejesTrazados = computed(() =>
    this.metricaActiva().ejes.map((valor) => ({
      valor,
      y: this.proyectarY(valor, this.metricaActiva()),
    })),
  );

  // El tooltip mantiene los últimos datos durante el fundido de salida
  puntoMostrado = computed<PuntoTrazado>(() => {
    const puntos = this.puntosTrazados();
    const indiceActivo = this.indicePuntoActivo();
    return puntos[indiceActivo ?? puntos.length - 1];
  });

  // Punto "actual": el último de la serie, marcado siempre como dato vigente
  puntoActual = computed<PuntoTrazado>(() => {
    const puntos = this.puntosTrazados();
    return puntos[puntos.length - 1];
  });

  seleccionarPunto(indicePunto: number): void {
    this.indicePuntoActivo.set(indicePunto);
  }

  restaurarPunto(): void {
    this.indicePuntoActivo.set(null);
  }

  // Decimal al estilo del idioma vigente: 76.4 → "76,4" (es) / "76.4" (en)
  comaDecimal(valor: number): string {
    const cifra = valor.toFixed(1);
    return this.idioma() === 'en' ? cifra : cifra.replace('.', ',');
  }

  readonly fotosAntes = computed(() => this.textos().comparador.fotos);

  indiceFotoAntes = signal(0);

  posicionComparador = signal(56);

  fotoAntes() {
    return this.fotosAntes()[this.indiceFotoAntes()];
  }

  seleccionarFotoAntes(indiceFoto: number): void {
    this.indiceFotoAntes.set(indiceFoto);
  }

  // El comparador se compara solo: la división deriva en vaivén hasta que el
  // visitante mueve el ratón; al quedarse quieto 2,5 s retoma el vaivén
  private objetivoComparador = 56;
  private posicionComparadorViva = 56;
  private ultimoToqueComparadorMs = -9999;
  private bucleComparador = 0;

  moverComparador(evento: PointerEvent): void {
    const escenario = evento.currentTarget as HTMLElement;
    const caja = escenario.getBoundingClientRect();
    const porcentaje = ((evento.clientX - caja.left) / caja.width) * 100;
    const porcentajeLimitado = Math.min(90, Math.max(10, porcentaje));
    this.objetivoComparador = porcentajeLimitado;
    this.ultimoToqueComparadorMs = performance.now();

    if (this.animaciones.movimientoReducido()) {
      this.posicionComparador.set(porcentajeLimitado);
    }
  }

  private iniciarBucleComparador(): void {
    if (this.animaciones.movimientoReducido()) {
      return;
    }

    this.zona.runOutsideAngular(() => {
      const animar = (tiempoMs: number) => {
        this.bucleComparador = window.requestAnimationFrame(animar);
        const raiz = this.elementoRaiz.nativeElement as HTMLElement;
        const division = raiz.querySelector(
          '.funcionalidades__comparador-division',
        ) as HTMLElement | null;
        const capaDespues = raiz.querySelector(
          '.funcionalidades__comparador-capa--despues',
        ) as HTMLElement | null;
        if (!division || !capaDespues) {
          return;
        }

        const enReposo = tiempoMs - this.ultimoToqueComparadorMs > 2500;
        if (enReposo) {
          this.objetivoComparador = 50 + 27 * Math.sin(tiempoMs * 0.00045);
        }

        this.posicionComparadorViva +=
          (this.objetivoComparador - this.posicionComparadorViva) * 0.055;
        division.style.left = `${this.posicionComparadorViva}%`;
        capaDespues.style.clipPath = `inset(0 0 0 ${this.posicionComparadorViva}%)`;
      };

      this.bucleComparador = window.requestAnimationFrame(animar);
      this.destroyRef.onDestroy(() => window.cancelAnimationFrame(this.bucleComparador));
    });
  }

  // Hora real del visitante, tick de 1 s; todo el panel deriva de ella
  ahoraMs = signal(Date.now());

  // El ayuno vigente empezó en las últimas 20:00 (se renueva solo cada día)
  private inicioAyunoMs = computed(() => proximaOcurrenciaMs(20, this.ahoraMs()) - 24 * HORA_MS);

  segundosEnAyuno = computed(() => {
    const transcurridoMs = this.ahoraMs() - this.inicioAyunoMs();
    return Math.floor(transcurridoMs / 1000);
  });

  // Pasadas las 16 h de objetivo (las 12:00) se abre la ventana de comida
  estaAyunando = computed(() => this.segundosEnAyuno() < 16 * 3600);

  estadoAyuno = computed(() => {
    const textosAyuno = this.textos().ayuno;
    const horas = this.segundosEnAyuno() / 3600;
    if (horas >= 16) {
      return { fase: textosAyuno.faseVentana, detalle: textosAyuno.detalleVentana };
    }
    if (horas >= 12) {
      return {
        fase: textosAyuno.faseCetosis,
        detalle: `${textosAyuno.detalleCetosis} ${Math.floor(horas)} ${textosAyuno.de16}`,
      };
    }
    return {
      fase: textosAyuno.faseGlucogeno,
      detalle: `${textosAyuno.detalleGlucogeno} ${Math.floor(horas)} ${textosAyuno.de16}`,
    };
  });

  rotuloAyuno = computed(() => {
    const textosAyuno = this.textos().ayuno;
    if (!this.estaAyunando()) {
      return textosAyuno.rotuloVentana;
    }
    return `${textosAyuno.rotuloEnAyuno} ${this.tiempoAyunoCorto()}`;
  });

  // Subtítulos de las notas de fase: «estás aquí» solo en la fase real
  subGlucogeno = computed(() => {
    const textosAyuno = this.textos().ayuno;
    const horas = this.segundosEnAyuno() / 3600;
    if (horas < 12) {
      return `${textosAyuno.estasAqui} ${this.puntoActualAyuno()}`;
    }
    return textosAyuno.glucogenoHecho;
  });

  subCetosis = computed(() => {
    const textosAyuno = this.textos().ayuno;
    const horas = this.segundosEnAyuno() / 3600;
    if (horas >= 12 && horas < 16) {
      return `${textosAyuno.estasAqui} ${this.puntoActualAyuno()}`;
    }
    return textosAyuno.cetosisRango;
  });

  // Plan fijo del día; la fila «próxima» y su cuenta atrás se calculan en vivo
  filasPlan = computed(() => {
    const textosAyuno = this.textos().ayuno;
    const ahora = this.ahoraMs();
    const conLlegada = textosAyuno.eventos.map((evento) => ({
      ...evento,
      llegadaMs: proximaOcurrenciaMs(evento.hora, ahora),
    }));
    const llegadaMinima = Math.min(...conLlegada.map((evento) => evento.llegadaMs));
    return conLlegada.map((evento) => ({
      ...evento,
      esProxima: evento.llegadaMs === llegadaMinima,
      detalle:
        evento.llegadaMs === llegadaMinima
          ? `${textosAyuno.enPrefijo} ${formatearDuracion(evento.llegadaMs - ahora)}`
          : evento.detalle,
    }));
  });

  proximaComida = computed(() => {
    const comidas = this.filasPlan().filter((fila) => fila.esComida);
    return comidas.reduce((primera, candidata) =>
      candidata.llegadaMs < primera.llegadaMs ? candidata : primera,
    );
  });

  puntoActualAyuno = computed(() => {
    const total = this.segundosEnAyuno();
    const horas = Math.floor(total / 3600);
    const minutos = Math.floor((total % 3600) / 60);
    return `${horas}:${String(minutos).padStart(2, '0')}`;
  });

  // Hora real del dispositivo del visitante: el protagonista del panel
  horaActualReloj = computed(() => {
    const fecha = new Date(this.ahoraMs());
    const dosDigitos = (valor: number) => String(valor).padStart(2, '0');
    return `${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}:${dosDigitos(fecha.getSeconds())}`;
  });

  // Tiempo en ayuno legible («14 h 16 m»), sin parecer un reloj de pared
  tiempoAyunoCorto = computed(() => {
    const total = this.segundosEnAyuno();
    const horas = Math.floor(total / 3600);
    const minutos = Math.floor((total % 3600) / 60);
    return `${horas} h ${String(minutos).padStart(2, '0')} m`;
  });

  porcentajeAyuno = computed(() => {
    const objetivoSegundos = 16 * 3600;
    return Math.min(100, (this.segundosEnAyuno() / objetivoSegundos) * 100);
  });

  // Cuenta atrás a las próximas 12:00: se rompe el ayuno justo al cumplir la
  // hora 16, que es también cuando la autofagia se considera activa
  cuentaAtrasComida = computed(() =>
    formatearDuracion(proximaOcurrenciaMs(12, this.ahoraMs()) - this.ahoraMs()),
  );

  cuentaAtrasAutofagia = computed(() => this.cuentaAtrasComida());

  // Posición del frente de combustión sobre la regla temporal (fracción 0-1)
  fraccionAyuno = computed(() => mapearHoraARegla(this.segundosEnAyuno() / 3600));

  // Fases inspeccionables al pasar el ratón: encienden su tramo de la hélice
  readonly zonasAyuno = computed(() => this.textos().ayuno.zonas);

  zonaInspeccionada = signal<ZonaAyuno | null>(null);

  movimientoReducido = this.animaciones.movimientoReducido;

  // El inspector persigue al ratón con easing; objetivo y posición viven fuera
  // de Angular (campos planos + rAF) para no disparar change detection por píxel
  private objetivoInspectorX = 0;
  private objetivoInspectorY = 0;
  private posicionInspectorX = 0;
  private posicionInspectorY = 0;
  private bucleInspector = 0;

  inspeccionarZona(zona: ZonaAyuno): void {
    this.zonaInspeccionada.set(zona);

    if (!this.animaciones.movimientoReducido()) {
      this.iniciarBucleInspector();
    }
  }

  despejarZona(): void {
    this.zonaInspeccionada.set(null);
    window.cancelAnimationFrame(this.bucleInspector);
    this.bucleInspector = 0;
  }

  private vigilarRatonInspector(): void {
    this.zona.runOutsideAngular(() => {
      const controlador = new AbortController();

      window.addEventListener(
        'pointermove',
        (evento) => {
          this.objetivoInspectorX = evento.clientX;
          this.objetivoInspectorY = evento.clientY;
        },
        { signal: controlador.signal, passive: true },
      );

      this.destroyRef.onDestroy(() => controlador.abort());
    });
  }

  /** Persecución suave: el panel flota sobre el cursor con retardo elástico. */
  private iniciarBucleInspector(): void {
    if (this.bucleInspector) {
      return;
    }

    const raiz = this.elementoRaiz.nativeElement as HTMLElement;
    const escena = raiz.querySelector('.funcionalidades__ayuno');
    const cajaEscena = escena?.getBoundingClientRect();

    // Arranca pegado al cursor para que no entre volando desde una esquina
    if (cajaEscena) {
      this.posicionInspectorX = this.objetivoInspectorX - cajaEscena.left + 28;
      this.posicionInspectorY = this.objetivoInspectorY - cajaEscena.top - 210;
    }

    this.zona.runOutsideAngular(() => {
      const paso = () => {
        const inspector = raiz.querySelector('.funcionalidades__inspector') as HTMLElement | null;

        if (inspector && inspector.parentElement) {
          const caja = inspector.parentElement.getBoundingClientRect();
          const margenRaton = 28;
          const limiteDerecho = caja.width * 0.73 - inspector.offsetWidth;
          const limiteInferior = caja.height - inspector.offsetHeight - 110;

          let objetivoX = this.objetivoInspectorX - caja.left + margenRaton;
          let objetivoY = this.objetivoInspectorY - caja.top - inspector.offsetHeight - margenRaton;
          objetivoX = Math.min(limiteDerecho, Math.max(16, objetivoX));
          objetivoY = Math.min(limiteInferior, Math.max(caja.height * 0.09, objetivoY));

          this.posicionInspectorX += (objetivoX - this.posicionInspectorX) * 0.1;
          this.posicionInspectorY += (objetivoY - this.posicionInspectorY) * 0.1;
          inspector.style.transform = `translate3d(${this.posicionInspectorX}px, ${this.posicionInspectorY}px, 0)`;
        }

        this.bucleInspector = window.requestAnimationFrame(paso);
      };

      this.bucleInspector = window.requestAnimationFrame(paso);
    });
  }

  // Ticks de la regla: uno por hora, mayores en los límites de fase (0/12/16/18)
  ticksRegla = Array.from({ length: 19 }, (_, hora) => ({
    hora,
    x: mapearHoraARegla(hora) * 100,
    mayor: hora === 0 || hora === 12 || hora === 16 || hora === 18,
  }));

  // Registro de agua: 8 vasos de 0,3 L; tocar un vaso actualiza el total
  vasosAgua = [0, 1, 2, 3, 4, 5, 6, 7];

  vasosBebidos = signal(5);

  litrosAgua = computed(() => this.comaDecimal(this.vasosBebidos() * 0.3));

  porcentajeAgua = computed(() => Math.round((this.vasosBebidos() / this.vasosAgua.length) * 100));

  // Nivel visual dentro de la silueta: el 100 % llena hasta el cuello (no la
  // coronilla), para que la cabeza siempre asome sobre el agua.
  nivelAgua = computed(() => Math.round(this.porcentajeAgua() * 0.8));

  estadoHidratacion = computed(() => {
    const textosAgua = this.textos().agua;
    const pct = this.porcentajeAgua();
    if (pct >= 100) return textosAgua.estadoCumplido;
    if (pct >= 75) return textosAgua.estadoCasi;
    if (pct >= 45) return textosAgua.estadoMuyBien;
    if (pct >= 20) return textosAgua.estadoBuenCamino;
    return textosAgua.estadoEmpieza;
  });

  // Historial de la semana (6 días fijos); el día de hoy se calcula en vivo
  // desde los vasos para que la última barra siga al registro.
  semanaAgua = computed(() => {
    const textosAgua = this.textos().agua;
    const tope = 3;
    const dias = textosAgua.historial.map((dia) => ({ ...dia, hoy: false }));
    dias.push({ dia: textosAgua.diaHoy, litros: this.vasosBebidos() * 0.3, hoy: true });
    return dias.map((dia) => ({
      ...dia,
      altura: Math.min(100, Math.round((dia.litros / tope) * 100)),
    }));
  });

  seleccionarVasos(indiceVaso: number): void {
    this.vasosBebidos.set(indiceVaso + 1);
  }

  /* Tomas del día: una hora por vaso; el timeline enseña las 4 últimas */
  private readonly horasTomas = [
    '08:10',
    '09:35',
    '11:20',
    '13:05',
    '14:50',
    '16:30',
    '18:10',
    '19:45',
  ];

  tomasVisibles = computed(() =>
    this.horasTomas
      .slice(0, this.vasosBebidos())
      .map((hora, indice) => ({
        hora,
        acumulado: this.comaDecimal((indice + 1) * 0.3),
      }))
      .slice(-4),
  );

  litrosRestantes = computed(() => {
    const restante = Math.max(0, 2.4 - this.vasosBebidos() * 0.3);
    return this.comaDecimal(restante);
  });

  /* ===== Widgets: "tu pantalla de inicio, en directo" =====
     Todo deriva del mismo tick de ahoraMs que mueve el ayuno, para que el
     reloj, la fecha, el saludo y el marcador "ahora" de la regla estén vivos. */
  widgetHora = computed(() => {
    const fecha = new Date(this.ahoraMs());
    const dosDigitos = (valor: number) => String(valor).padStart(2, '0');
    return `${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}`;
  });

  widgetFecha = computed(() => {
    const textosWidgets = this.textos().widgets;
    const fecha = new Date(this.ahoraMs());
    return `${textosWidgets.dias[fecha.getDay()]} ${fecha.getDate()} ${textosWidgets.meses[fecha.getMonth()]}`;
  });

  estadoFaqAbierto: Record<number, boolean> = {};

  // Selector de ciclo de facturación: realza la tarjeta correspondiente
  cicloSeleccionado = signal<'mensual' | 'anual'>('anual');

  seleccionarCiclo(ciclo: 'mensual' | 'anual'): void {
    this.cicloSeleccionado.set(ciclo);
  }

  verFuncionalidades(): void {
    this.animaciones.desplazarHasta('.funcionalidades');
  }

  constructor() {
    afterNextRender(() => {
      this.montarCoreografia();
      this.iniciarRelojAyuno();
      this.vigilarRatonInspector();
      this.iniciarBucleComparador();
    });

    this.destroyRef.onDestroy(() => window.cancelAnimationFrame(this.bucleInspector));
  }

  private iniciarRelojAyuno(): void {
    this.zona.runOutsideAngular(() => {
      const identificador = window.setInterval(() => {
        this.ahoraMs.set(Date.now());
      }, 1000);

      this.destroyRef.onDestroy(() => window.clearInterval(identificador));
    });
  }

  alternarEstadoFaq(indiceFaq: number): void {
    this.estadoFaqAbierto[indiceFaq] = !this.estadoFaqAbierto[indiceFaq];
  }

  seleccionarFuncionalidad(indiceFuncionalidad: number): void {
    const disparador = this.disparadorFuncionalidades;

    // Sin pin activo (móvil): basta con fijar el índice.
    if (!disparador) {
      this.indiceFuncionalidadActiva.set(indiceFuncionalidad);
      return;
    }

    // Con el pin activo hay que MOVER el scroll a la posición de ese panel; así el
    // onUpdate aterriza en el índice y el snap lo mantiene (fijar el índice a secas
    // lo revierte el onUpdate al instante). El paso i vive en el progreso i/(n-1).
    const totalPasos = this.funcionalidades().length;
    const progresoDestino = indiceFuncionalidad / (totalPasos - 1);
    const recorrido = disparador.end - disparador.start;
    const posicionDestino = disparador.start + progresoDestino * recorrido;
    this.animaciones.desplazarHastaPosicion(posicionDestino);
  }

  navegarAPlanes(): void {
    this.animaciones.desplazarHasta('#seccion-planes');
  }

  private montarCoreografia(): void {
    // Sin movimiento si el usuario lo pide: el contenido queda visible y quieto.
    if (this.animaciones.movimientoReducido()) {
      return;
    }

    this.zona.runOutsideAngular(() => {
      this.contexto = gsap.context(() => {
        this.animarPrecarga();
        this.animarHero();
        this.animarManifiesto();
        this.animarProceso();
        this.animarPilares();
        this.animarPlanes();
        this.animarFuncionalidades();
        this.animarFaq();
        this.animarCtaFinal();
      }, this.elementoRaiz.nativeElement);

      ScrollTrigger.refresh();
    });

    this.destroyRef.onDestroy(() => this.contexto?.revert());
  }

  private animarPrecarga(): void {
    if (!this.mostrarPrecarga()) {
      return;
    }
    sessionStorage.setItem('cofira-precarga', '1');

    // Rescate: si el timeline muere (error de JS, pestaña en segundo plano),
    // la cortina jamás debe quedarse tapando la página.
    setTimeout(() => this.mostrarPrecarga.set(false), 4000);

    const progreso = { valor: 0 };
    const salida = gsap.timeline();
    salida
      .to(progreso, {
        valor: 100,
        duration: 1.3,
        ease: 'power2.inOut',
        onUpdate: () => this.contadorPrecarga.set(Math.round(progreso.valor)),
      })
      .to(
        '.precarga',
        {
          yPercent: -100,
          duration: 0.75,
          ease: 'power4.inOut',
          onComplete: () => this.mostrarPrecarga.set(false),
        },
        '+=0.15',
      );
  }

  private animarHero(): void {
    // Con precarga la intro espera a que la cortina se levante
    const retrasoIntro = this.mostrarPrecarga() ? 1.7 : 0;
    const entrada = gsap.timeline({ delay: retrasoIntro, defaults: { ease: 'power3.out' } });
    entrada
      .from('.hero__eyebrow', { y: 24, autoAlpha: 0, duration: 0.6 })
      .from('.hero__titulo', { y: 44, autoAlpha: 0, duration: 0.85 }, '-=0.35')
      .from('.hero__subtitulo', { y: 24, autoAlpha: 0, duration: 0.6 }, '-=0.55')
      .from('.hero__acciones', { y: 24, autoAlpha: 0, duration: 0.6 }, '-=0.45')
      .from('.hero__scroll', { autoAlpha: 0, duration: 0.6 }, '-=0.25');

    gsap.to('.hero__contenido', {
      yPercent: -16,
      autoAlpha: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  /* Reveal palabra a palabra ligado al scrub: cada palabra se enciende al
     cruzar su tramo del recorrido. Con reduced-motion no se monta nada y el
     texto queda visible en su color final. */
  private animarManifiesto(): void {
    gsap.fromTo(
      '.manifiesto__palabra',
      { opacity: 0.16 },
      {
        opacity: 1,
        stagger: 0.06,
        ease: 'none',
        scrollTrigger: {
          trigger: '.manifiesto',
          start: 'top 78%',
          end: 'center 45%',
          scrub: true,
        },
      },
    );
  }

  private animarProceso(): void {
    gsap.from('.proceso__cabecera', {
      yPercent: 45,
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.proceso__cabecera',
        start: 'top 90%',
        end: 'top 55%',
        scrub: true,
      },
    });

    gsap.utils.toArray<HTMLElement>('.proceso__paso').forEach((paso) => {
      gsap.from(paso, {
        yPercent: 50,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: paso, start: 'top 92%', end: 'top 58%', scrub: true },
      });
    });

    gsap.utils.toArray<HTMLElement>('.proceso__numero').forEach((numero) => {
      gsap.to(numero, {
        yPercent: -35,
        ease: 'none',
        scrollTrigger: { trigger: numero, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  private animarPilares(): void {
    gsap.utils.toArray<HTMLElement>('.pilar').forEach((pilar) => {
      const media = pilar.querySelector('.pilar__media');
      const texto = pilar.querySelector('.pilar__texto');
      const imagen = pilar.querySelector('.pilar__imagen');
      const invertido = pilar.classList.contains('pilar--invertido');

      gsap.from(media, {
        yPercent: 16,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: pilar, start: 'top 88%', end: 'top 52%', scrub: true },
      });

      gsap.from(texto, {
        x: invertido ? -56 : 56,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: pilar, start: 'top 86%', end: 'top 50%', scrub: true },
      });

      gsap.fromTo(
        imagen,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: pilar, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
  }

  private animarPlanes(): void {
    gsap.from('.planes__cabecera', {
      yPercent: 40,
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.planes__cabecera',
        start: 'top 90%',
        end: 'top 55%',
        scrub: true,
      },
    });

    gsap.utils.toArray<HTMLElement>('.planes__tarjeta').forEach((tarjeta, indice) => {
      gsap.from(tarjeta, {
        yPercent: 45,
        scale: 0.9,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: tarjeta,
          start: `top ${88 - indice * 4}%`,
          end: 'top 52%',
          scrub: true,
        },
      });
    });

    gsap.fromTo(
      '.planes__halo',
      { scale: 0.7, autoAlpha: 0.2 },
      {
        scale: 1.15,
        autoAlpha: 0.9,
        ease: 'none',
        scrollTrigger: {
          trigger: '.planes',
          start: 'top bottom',
          end: 'center center',
          scrub: true,
        },
      },
    );
  }

  private animarFuncionalidades(): void {
    gsap.from('.funcionalidades__cabecera', {
      yPercent: 40,
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.funcionalidades__cabecera',
        start: 'top 90%',
        end: 'top 55%',
        scrub: true,
      },
    });

    // Escena tipo Ponder: la sección se fija y el scroll va activando cada funcionalidad.
    const medios = gsap.matchMedia();

    medios.add('(min-width: 1025px)', () => {
      const totalPasos = this.funcionalidades().length;

      this.disparadorFuncionalidades = ScrollTrigger.create({
        trigger: '.funcionalidades__escena',
        start: 'top top',
        end: () => `+=${totalPasos * 320}`,
        pin: true,
        // El scroll se asienta en el panel más cercano al soltar: atrapa la inercia
        // de Lenis para que no vuele saltándose paneles ni se salga del pin.
        snap: {
          snapTo: 1 / (totalPasos - 1),
          duration: { min: 0.15, max: 0.4 },
          ease: 'power2.inOut',
          directional: false,
        },
        onUpdate: (disparador) => {
          const indiceCalculado = Math.floor(disparador.progress * totalPasos);
          const indiceLimitado = Math.min(totalPasos - 1, indiceCalculado);

          if (indiceLimitado !== this.indiceFuncionalidadActiva()) {
            this.indiceFuncionalidadActiva.set(indiceLimitado);
          }
        },
      });
    });
  }

  private animarFaq(): void {
    gsap.from('.faq__cabecera', {
      yPercent: 40,
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.faq__cabecera', start: 'top 90%', end: 'top 58%', scrub: true },
    });

    gsap.utils.toArray<HTMLElement>('.faq__item').forEach((item) => {
      gsap.from(item, {
        x: -44,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: item, start: 'top 92%', end: 'top 72%', scrub: true },
      });
    });
  }

  private animarCtaFinal(): void {
    gsap.fromTo(
      '.cta-final__halo',
      { scale: 0.6, autoAlpha: 0.2 },
      {
        scale: 1.25,
        autoAlpha: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.cta-final',
          start: 'top bottom',
          end: 'center center',
          scrub: true,
        },
      },
    );

    gsap.from('.cta-final__contenido', {
      yPercent: 30,
      scale: 0.85,
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.cta-final', start: 'top 85%', end: 'center 68%', scrub: true },
    });
  }
}
