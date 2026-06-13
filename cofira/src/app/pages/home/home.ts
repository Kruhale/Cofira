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
import { RastroScroll, SeccionRastro } from '../../components/shared/rastro-scroll/rastro-scroll';
import { CintaMarquee } from '../../components/shared/cinta-marquee/cinta-marquee';

interface PalabraManifiesto {
  texto: string;
  clave: boolean;
}

interface Funcionalidad {
  titulo: string;
  descripcion: string;
}

interface ComidaRegistro {
  foto: string;
  nombre: string;
  hora: string;
  kcal: number;
  desglose: string;
}

interface MacroComida {
  nombre: string;
  gramos: number;
  objetivo: number;
  pct: number;
  color: string;
}

interface PuntoGrafica {
  mes: string;
  etiqueta: string;
  x: number;
  y: number;
  peso: string;
  cambio: string;
  media: string;
  objetivoPct: number;
}

interface Paso {
  numero: string;
  titulo: string;
  descripcion: string;
}

interface ZonaAyuno {
  clave: string;
  titulo: string;
  rango: string;
  descripcion: string;
  color: string;
  min: number;
  max: number;
  datos: { etiqueta: string; valor: string }[];
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

  private contexto: gsap.Context | null = null;

  seccionesRastro: SeccionRastro[] = [
    { etiqueta: 'Inicio', objetivo: '.hero' },
    { etiqueta: 'Manifiesto', objetivo: '.manifiesto' },
    { etiqueta: 'Cómo funciona', objetivo: '.proceso' },
    { etiqueta: 'Pilares', objetivo: '.pilares' },
    { etiqueta: 'Planes', objetivo: '#seccion-planes' },
    { etiqueta: 'Funciones', objetivo: '.funcionalidades' },
    { etiqueta: 'FAQ', objetivo: '.faq' },
    { etiqueta: 'Únete', objetivo: '.cta-final' },
  ];

  /* Manifiesto: troceado en palabras una sola vez al construir para que el
     reveal palabra a palabra sea solo CSS + un único ScrollTrigger */
  palabrasManifiesto: PalabraManifiesto[] =
    'No vendemos motivación. Vendemos un sistema. Tu único trabajo: aparecer.'
      .split(' ')
      .map((texto) => ({
        texto,
        clave: ['motivación.', 'sistema.', 'aparecer.'].includes(texto),
      }));

  pasos: Paso[] = [
    {
      numero: '01',
      titulo: 'Cuéntanos tu objetivo',
      descripcion:
        'Un onboarding rápido capta tu nivel, tus medidas y tus metas para diseñar un plan a tu medida.',
    },
    {
      numero: '02',
      titulo: 'Recibe tu plan',
      descripcion:
        'Generamos tu rutina semanal y tu menú con macros calculados al gramo, listos para empezar hoy.',
    },
    {
      numero: '03',
      titulo: 'Sigue tu progreso',
      descripcion:
        'Registra entrenos, comidas y agua. Visualiza tu evolución con gráficas y ajusta sobre la marcha.',
    },
  ];

  funcionalidades: Funcionalidad[] = [
    {
      titulo: 'Gráficos de progreso',
      descripcion: 'Visualiza peso, fuerza y macros con gráficas claras que cuentan tu evolución.',
    },
    {
      titulo: 'Fotos de progreso',
      descripcion: 'Compara tu transformación mes a mes con un timeline visual privado.',
    },
    {
      titulo: 'Ayuno intermitente',
      descripcion: 'Controla tus ventanas de ayuno y sincronízalas con tu plan nutricional.',
    },
    {
      titulo: 'Registro de agua',
      descripcion: 'Mantén tu hidratación al día con un objetivo diario y recordatorios.',
    },
    {
      titulo: 'Widgets',
      descripcion: 'Lleva tus métricas clave siempre a la vista, allá donde estés.',
    },
    {
      titulo: 'Registro de comidas',
      descripcion: 'Apunta lo que comes con análisis por foto y base de alimentos.',
    },
  ];

  indiceFuncionalidadActiva = signal(0);

  /* Registro de comidas: el desglose por comida y los gramos de macrosComida
     suman ~las kcal del día (datos coherentes, no inventados). */
  registroComidas: ComidaRegistro[] = [
    {
      foto: '/assets/images/comida-avena.png',
      nombre: 'Avena con fruta y nueces',
      hora: '08:15',
      kcal: 418,
      desglose: 'P 23 · C 61 · G 9',
    },
    {
      foto: '/assets/images/comida-pollo.png',
      nombre: 'Pollo a la plancha con arroz',
      hora: '14:05',
      kcal: 676,
      desglose: 'P 58 · C 70 · G 18',
    },
    {
      foto: '/assets/images/comida-salmon.png',
      nombre: 'Salmón con verduras asadas',
      hora: '21:10',
      kcal: 542,
      desglose: 'P 44 · C 30 · G 27',
    },
  ];

  comidaDestacada = this.registroComidas[this.registroComidas.length - 1];

  totalesComida = {
    consumidas: '1.636',
    objetivo: '2.450',
    restante: '814',
    pct: 67,
  };

  macrosComida: MacroComida[] = [
    { nombre: 'Proteína', gramos: 125, objetivo: 150, pct: 83, color: 'hsl(24, 95%, 56%)' },
    { nombre: 'Carbohidratos', gramos: 161, objetivo: 265, pct: 61, color: 'hsl(38, 95%, 56%)' },
    { nombre: 'Grasas', gramos: 54, objetivo: 80, pct: 68, color: 'hsl(43, 70%, 78%)' },
  ];

  puntosGrafica: PuntoGrafica[] = [
    {
      mes: 'Ene',
      etiqueta: 'Enero',
      x: 8,
      y: 30,
      peso: '78,6',
      cambio: 'inicio',
      media: '78,6',
      objetivoPct: 0,
    },
    {
      mes: 'Feb',
      etiqueta: 'Febrero',
      x: 85,
      y: 50,
      peso: '78,1',
      cambio: '−0,5 kg',
      media: '78,3',
      objetivoPct: 11,
    },
    {
      mes: 'Mar',
      etiqueta: 'Marzo',
      x: 162,
      y: 79,
      peso: '77,4',
      cambio: '−0,7 kg',
      media: '77,7',
      objetivoPct: 26,
    },
    {
      mes: 'Abr',
      etiqueta: 'Abril',
      x: 239,
      y: 100,
      peso: '76,9',
      cambio: '−0,5 kg',
      media: '77,1',
      objetivoPct: 37,
    },
    {
      mes: 'May',
      etiqueta: 'Mayo',
      x: 316,
      y: 112,
      peso: '76,6',
      cambio: '−0,3 kg',
      media: '76,8',
      objetivoPct: 43,
    },
    {
      mes: 'Jun',
      etiqueta: 'Junio · hoy',
      x: 392,
      y: 120,
      peso: '76,4',
      cambio: '−0,2 kg',
      media: '76,5',
      objetivoPct: 48,
    },
  ];

  indicePuntoActivo = signal<number | null>(null);

  // El tooltip mantiene los últimos datos durante el fundido de salida
  puntoMostrado(): PuntoGrafica {
    const indiceActivo = this.indicePuntoActivo();
    const indiceFinal = this.puntosGrafica.length - 1;
    return this.puntosGrafica[indiceActivo ?? indiceFinal];
  }

  seleccionarPunto(indicePunto: number): void {
    this.indicePuntoActivo.set(indicePunto);
  }

  restaurarPunto(): void {
    this.indicePuntoActivo.set(null);
  }

  fotosAntes = [
    { fecha: 'Semana 1', peso: '94,8 kg', imagen: '/assets/images/transformacion-enero.png' },
    { fecha: 'Semana 6', peso: '88,1 kg', imagen: '/assets/images/transformacion-marzo.png' },
    { fecha: 'Semana 12', peso: '82,4 kg', imagen: '/assets/images/transformacion-mayo.png' },
  ];

  indiceFotoAntes = signal(0);

  posicionComparador = signal(56);

  fotoAntes() {
    return this.fotosAntes[this.indiceFotoAntes()];
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
    const horas = this.segundosEnAyuno() / 3600;
    if (horas >= 16) {
      return { fase: 'Ventana de comida', detalle: 'ayuno completado · vuelves a las 20:00' };
    }
    if (horas >= 12) {
      return {
        fase: 'Cetosis activa',
        detalle: `quemando grasa · hora ${Math.floor(horas)} de 16`,
      };
    }
    return {
      fase: 'Fase glucógeno',
      detalle: `gastando reservas · hora ${Math.floor(horas)} de 16`,
    };
  });

  rotuloAyuno = computed(() => {
    if (!this.estaAyunando()) {
      return 'ventana de comida · el ayuno vuelve a las 20:00';
    }
    return `en ayuno desde las 20:00 · llevas ${this.tiempoAyunoCorto()}`;
  });

  // Subtítulos de las notas de fase: «estás aquí» solo en la fase real
  subGlucogeno = computed(() => {
    const horas = this.segundosEnAyuno() / 3600;
    if (horas < 12) {
      return `estás aquí · h ${this.puntoActualAyuno()}`;
    }
    return 'hora 0 – 12 · completado';
  });

  subCetosis = computed(() => {
    const horas = this.segundosEnAyuno() / 3600;
    if (horas >= 12 && horas < 16) {
      return `estás aquí · h ${this.puntoActualAyuno()}`;
    }
    return 'hora 12 – 16';
  });

  // Plan fijo del día; la fila «próxima» y su cuenta atrás se calculan en vivo
  private eventosPlan = [
    {
      hora: 12,
      etiqueta: '12:00',
      nombre: 'Romper ayuno',
      detalle: 'primera comida',
      esComida: true,
    },
    { hora: 16, etiqueta: '16:00', nombre: 'Comida 2', detalle: '480 kcal', esComida: true },
    { hora: 19.5, etiqueta: '19:30', nombre: 'Última comida', detalle: '540 kcal', esComida: true },
    {
      hora: 20,
      etiqueta: '20:00',
      nombre: 'Empieza el ayuno',
      detalle: 'objetivo 16 h',
      esComida: false,
    },
  ];

  filasPlan = computed(() => {
    const ahora = this.ahoraMs();
    const conLlegada = this.eventosPlan.map((evento) => ({
      ...evento,
      llegadaMs: proximaOcurrenciaMs(evento.hora, ahora),
    }));
    const llegadaMinima = Math.min(...conLlegada.map((evento) => evento.llegadaMs));
    return conLlegada.map((evento) => ({
      ...evento,
      esProxima: evento.llegadaMs === llegadaMinima,
      detalle:
        evento.llegadaMs === llegadaMinima
          ? `en ${formatearDuracion(evento.llegadaMs - ahora)}`
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
  zonasAyuno: ZonaAyuno[] = [
    {
      clave: 'glucogeno',
      titulo: 'Fase 1 · Glucógeno',
      rango: 'hora 0 – 12',
      descripcion: 'El cuerpo gasta sus reservas de azúcar y la insulina cae.',
      color: 'hsl(196, 70%, 62%)',
      min: 0,
      max: 0.3,
      datos: [
        { etiqueta: 'glucosa', valor: '72 mg/dl' },
        { etiqueta: 'insulina', valor: '−45 %' },
        { etiqueta: 'glucógeno', valor: '18 %' },
      ],
    },
    {
      clave: 'quema',
      titulo: 'Fase 2 · Quema de grasa',
      rango: 'hora 12 – 16',
      descripcion: 'Sin azúcar disponible, la grasa pasa a ser el combustible.',
      color: 'hsl(28, 100%, 60%)',
      min: 0.3,
      max: 0.78,
      datos: [
        { etiqueta: 'cetonas', valor: '0,6 mmol/L' },
        { etiqueta: 'lipólisis', valor: '+150 %' },
        { etiqueta: 'h. crecimiento', valor: '+300 %' },
      ],
    },
    {
      clave: 'autofagia',
      titulo: 'Fase 3 · Autofagia',
      rango: 'hora 16 – 18+',
      descripcion: 'Las células reciclan componentes dañados y se reparan.',
      color: 'hsl(276, 80%, 70%)',
      min: 0.78,
      max: 1,
      datos: [
        { etiqueta: 'cetonas', valor: '1,1 mmol/L' },
        { etiqueta: 'mitocondrias', valor: '+15 %' },
        { etiqueta: 'inflamación (PCR)', valor: '−20 %' },
      ],
    },
  ];

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

  litrosAgua = computed(() => {
    const litros = this.vasosBebidos() * 0.3;
    return litros.toFixed(1).replace('.', ',');
  });

  porcentajeAgua = computed(() => Math.round((this.vasosBebidos() / this.vasosAgua.length) * 100));

  // Nivel visual dentro de la silueta: el 100 % llena hasta el cuello (no la
  // coronilla), para que la cabeza siempre asome sobre el agua.
  nivelAgua = computed(() => Math.round(this.porcentajeAgua() * 0.8));

  estadoHidratacion = computed(() => {
    const pct = this.porcentajeAgua();
    if (pct >= 100) return 'Objetivo cumplido';
    if (pct >= 75) return 'Casi lo tienes';
    if (pct >= 45) return 'Vas muy bien';
    if (pct >= 20) return 'Vas por buen camino';
    return 'Empieza a beber';
  });

  // Historial de la semana (6 días fijos); el día de hoy se calcula en vivo
  // desde los vasos para que la última barra siga al registro.
  private readonly historialAgua = [
    { dia: 'L', litros: 2.4 },
    { dia: 'M', litros: 2.1 },
    { dia: 'X', litros: 2.6 },
    { dia: 'J', litros: 1.9 },
    { dia: 'V', litros: 2.3 },
    { dia: 'S', litros: 2.0 },
  ];

  semanaAgua = computed(() => {
    const tope = 3;
    const dias = this.historialAgua.map((dia) => ({ ...dia, hoy: false }));
    dias.push({ dia: 'D', litros: this.vasosBebidos() * 0.3, hoy: true });
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
        acumulado: ((indice + 1) * 0.3).toFixed(1).replace('.', ','),
      }))
      .slice(-4),
  );

  litrosRestantes = computed(() => {
    const restante = Math.max(0, 2.4 - this.vasosBebidos() * 0.3);
    return restante.toFixed(1).replace('.', ',');
  });

  /* ===== Widgets: "tu pantalla de inicio, en directo" =====
     Todo deriva del mismo tick de ahoraMs que mueve el ayuno, para que el
     reloj, la fecha, el saludo y el marcador "ahora" de la regla estén vivos. */
  private readonly diasWidget = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  private readonly mesesWidget = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ];

  widgetHora = computed(() => {
    const fecha = new Date(this.ahoraMs());
    const dosDigitos = (valor: number) => String(valor).padStart(2, '0');
    return `${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}`;
  });

  widgetFecha = computed(() => {
    const fecha = new Date(this.ahoraMs());
    return `${this.diasWidget[fecha.getDay()]} ${fecha.getDate()} ${this.mesesWidget[fecha.getMonth()]}`;
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
    this.indiceFuncionalidadActiva.set(indiceFuncionalidad);
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

  private animarHero(): void {
    const entrada = gsap.timeline({ defaults: { ease: 'power3.out' } });
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
      const totalPasos = this.funcionalidades.length;

      ScrollTrigger.create({
        trigger: '.funcionalidades__escena',
        start: 'top top',
        end: () => `+=${totalPasos * 320}`,
        pin: true,
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
