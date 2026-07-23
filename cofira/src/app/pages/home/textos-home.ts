import { CodigoIdioma } from '../../services/idioma.service';
import { SeccionRastro } from '../../components/shared/rastro-scroll/rastro-scroll';

/* Todos los textos visibles de la home (y sus datos maquetados) por idioma.
   Los números se duplican en es/en a propósito: así cada lengua formatea
   sus decimales y millares a su estilo (es 76,4 / 1.636 · en 76.4 / 1,636). */

export interface PalabraManifiesto {
  texto: string;
  clave: boolean;
}

export interface Paso {
  numero: string;
  titulo: string;
  descripcion: string;
}

export interface Funcionalidad {
  titulo: string;
  descripcion: string;
  categoria: string;
}

export interface ComidaRegistro {
  nombre: string;
  hora: string;
  kcal: number;
  desglose: string;
}

export interface MacroComida {
  nombre: string;
  gramos: number;
  objetivo: number;
  pct: number;
  color: string;
}

export interface PuntoMetrica {
  mes: string;
  etiqueta: string;
  valor: number;
  media: number;
  cambio: string;
  pct: number;
}

export interface MetricaProgreso {
  clave: string;
  etiqueta: string;
  unidad: string;
  actual: string;
  delta: string;
  sube: boolean;
  periodo: string;
  objetivo: number;
  objetivoEtiqueta: string;
  pctObjetivo: number;
  restante: string;
  rangoMin: number;
  rangoMax: number;
  ejes: number[];
  puntos: PuntoMetrica[];
}

export interface ZonaAyuno {
  clave: string;
  titulo: string;
  rango: string;
  descripcion: string;
  color: string;
  min: number;
  max: number;
  datos: { etiqueta: string; valor: string }[];
}

export interface FotoProgreso {
  fecha: string;
  peso: string;
  imagen: string;
}

export interface EventoPlan {
  hora: number;
  etiqueta: string;
  nombre: string;
  detalle: string;
  esComida: boolean;
}

interface TextosHero {
  eyebrow: string;
  altImagen: string;
  tituloLinea: string;
  tituloAcento: string;
  subtitulo: string;
  botonEmpezar: string;
  botonPlanes: string;
  desliza: string;
}

interface TextosPilar {
  eyebrow: string;
  altImagen: string;
  tituloPre: string;
  tituloAcento: string;
  tituloPost: string;
  descripcion: string;
  datos: string[];
}

interface TextosPlan {
  titulo: string;
  descripcion: string;
  precio: string;
  periodo: string;
  nota: string;
  boton: string;
  ventajas: string[];
}

interface TextosGrafica {
  periodo: string;
  media7: string;
  hacia: string;
  haciaTooltip: string;
  objetivoEje: string;
  leyendaObjetivo: string;
  meses: string[];
  total: string;
  ritmo: string;
  mejorMes: string;
  porMes: string;
  esteMes: string;
  sincronizado: string;
  metricas: MetricaProgreso[];
}

interface TextosAyuno {
  planTitulo: string;
  eventos: EventoPlan[];
  enPrefijo: string;
  faseVentana: string;
  detalleVentana: string;
  faseCetosis: string;
  detalleCetosis: string;
  faseGlucogeno: string;
  detalleGlucogeno: string;
  de16: string;
  rotuloVentana: string;
  rotuloEnAyuno: string;
  estasAqui: string;
  glucogenoHecho: string;
  cetosisRango: string;
  notaGlucogenoTitulo: string;
  notaGlucogenoDato: string;
  notaCetosisTitulo: string;
  notaCetosisDato: string;
  notaHormonaTitulo: string;
  notaHormonaSub: string;
  vertical: string;
  detoxTitulo: string;
  detoxSub: string;
  detoxMitocondriasValor: string;
  detoxMitocondrias: string;
  detoxInflamacionValor: string;
  detoxInflamacion: string;
  reglaGlucogeno: string;
  reglaQuema: string;
  reglaReparacion: string;
  llevas: string;
  comidaEn: string;
  pieProxima: string;
  zonas: ZonaAyuno[];
}

interface TextosAgua {
  eyebrow: string;
  objetivo: string;
  progreso: string;
  rachaLabel: string;
  mediaValor: string;
  mediaLabel: string;
  semanaTitulo: string;
  pista: string;
  ariaVaso: string;
  vasoMeta: string;
  estadoCumplido: string;
  estadoCasi: string;
  estadoMuyBien: string;
  estadoBuenCamino: string;
  estadoEmpieza: string;
  historial: { dia: string; litros: number }[];
  diaHoy: string;
}

interface TextosWidgets {
  subPre: string;
  subAcento: string;
  items: string[];
  actividad: string;
  actActivo: string;
  actEjercicios: string;
  saludo: string;
  pasos: string;
  peso: string;
  pesoCifra: string;
  pesoNota: string;
  agua: string;
  aguaCifra: string;
  diasUnidad: string;
  rachaEtiqueta: string;
  distancia: string;
  distanciaCifra: string;
  watchPasos: string;
  watchAgua: string;
  watchRacha: string;
  dias: string[];
  meses: string[];
}

interface TextosComidas {
  hoy: string;
  unidad: string;
  ia: string;
  consumido: string;
  balanceMeta: string;
  tagAnalizada: string;
  registro: ComidaRegistro[];
  totales: { consumidas: string; pct: number };
  macros: MacroComida[];
  datos: { etiqueta: string; valor: string }[];
  chipFoto: string;
  pie: string;
}

interface TextosFaq {
  eyebrow: string;
  titulo: string;
  tituloAcento: string;
  intro: string;
  contactoTitulo: string;
  metaIndice: string;
  metaTotal: string;
  pregunta1: string;
  respuesta1Pre: string;
  respuesta1Clave1: string;
  respuesta1Medio: string;
  respuesta1Clave2: string;
  respuesta1Post: string;
  pregunta2: string;
  respuesta2Pre: string;
  respuesta2Clave: string;
  respuesta2Post: string;
  pregunta3: string;
  respuesta3: string;
  pregunta4: string;
  respuesta4: string;
  pregunta5: string;
  respuesta5Pre: string;
  respuesta5Clave1: string;
  respuesta5Medio: string;
  respuesta5Clave2: string;
  respuesta5Post: string;
}

export interface TextosHome {
  rastro: SeccionRastro[];
  hero: TextosHero;
  manifiesto: { aria: string; palabras: PalabraManifiesto[] };
  proceso: { eyebrow: string; titulo: string; pasos: Paso[] };
  cintaAcciones: string[];
  cintaCompromiso: string[];
  pilares: {
    aria: string;
    verComo: string;
    entrenamiento: TextosPilar;
    nutricion: TextosPilar;
    progreso: TextosPilar;
  };
  planes: {
    eyebrow: string;
    titulo: string;
    subtitulo: string;
    ariaCiclo: string;
    opcionMensual: string;
    opcionAnual: string;
    ahorro: string;
    garantia: string;
    etiquetaAnual: string;
    mensual: TextosPlan;
    anual: TextosPlan;
  };
  funcionalidades: {
    eyebrow: string;
    titulo: string;
    ariaLista: string;
    funcion: string;
    lista: Funcionalidad[];
  };
  grafica: TextosGrafica;
  comparador: {
    eyebrow: string;
    delta: string;
    sub: string;
    hoySemana: string;
    hoyPeso: string;
    pista: string;
    fotos: FotoProgreso[];
  };
  ayuno: TextosAyuno;
  agua: TextosAgua;
  widgets: TextosWidgets;
  comidas: TextosComidas;
  faq: TextosFaq;
  ctaFinal: { titulo: string; texto: string; boton: string };
}

export const TEXTOS_HOME: Record<CodigoIdioma, TextosHome> = {
  es: {
    rastro: [
      { etiqueta: 'Inicio', objetivo: '.hero' },
      { etiqueta: 'Manifiesto', objetivo: '.manifiesto' },
      { etiqueta: 'Cómo funciona', objetivo: '.proceso' },
      { etiqueta: 'Pilares', objetivo: '.pilares' },
      { etiqueta: 'Planes', objetivo: '#seccion-planes' },
      { etiqueta: 'Funciones', objetivo: '.funcionalidades' },
      { etiqueta: 'FAQ', objetivo: '.faq' },
      { etiqueta: 'Únete', objetivo: '.cta-final' },
    ],
    hero: {
      eyebrow: 'Entrena · Come · Progresa',
      altImagen: 'Atleta entrenando con intensidad',
      tituloLinea: 'Tu cuerpo,',
      tituloAcento: 'tu sistema',
      subtitulo:
        'Entrenamiento, nutrición y seguimiento de progreso en un solo lugar. Diseñado a tu medida, medido al detalle.',
      botonEmpezar: 'Empieza tu cambio',
      botonPlanes: 'Ver planes',
      desliza: 'Desliza',
    },
    manifiesto: {
      aria: 'Manifiesto de Cofira',
      palabras: [
        { texto: 'No', clave: false },
        { texto: 'vendemos', clave: false },
        { texto: 'motivación.', clave: true },
        { texto: 'Vendemos', clave: false },
        { texto: 'un', clave: false },
        { texto: 'sistema.', clave: true },
        { texto: 'Tu', clave: false },
        { texto: 'único', clave: false },
        { texto: 'trabajo:', clave: false },
        { texto: 'aparecer.', clave: true },
      ],
    },
    proceso: {
      eyebrow: 'Cómo funciona',
      titulo: 'De cero a en marcha en tres pasos',
      pasos: [
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
      ],
    },
    cintaAcciones: ['Entrena', 'Come', 'Disciplina', 'Disfruta', 'Repite'],
    cintaCompromiso: ['Sin excusas', 'Sin permanencia', 'Sin atajos'],
    pilares: {
      aria: 'Lo que incluye Cofira',
      verComo: 'Ver cómo',
      entrenamiento: {
        eyebrow: 'Entrenamiento',
        altImagen: 'Persona entrenando con peso en un gimnasio en penumbra',
        tituloPre: 'Rutinas que ',
        tituloAcento: 'evolucionan',
        tituloPost: ' contigo',
        descripcion:
          'Cada semana ajustamos series, cargas y descansos según tu feedback real. Nada de planes genéricos: aquí manda tu cuerpo.',
        datos: [
          'Ajuste semanal automático',
          'Feedback ✓/✗ por ejercicio',
          'Hasta 7 días de rutina',
        ],
      },
      nutricion: {
        eyebrow: 'Nutrición',
        altImagen: 'Comida saludable preparada al detalle',
        tituloPre: 'Menús al ',
        tituloAcento: 'gramo',
        tituloPost: ', sin pensar',
        descripcion:
          'Generamos tu menú semanal con los macros calculados y comidas que de verdad te apetecen. Comer bien deja de ser un trabajo.',
        datos: [
          'Macros al gramo: P · C · G',
          'Hasta 7 comidas diarias',
          'Alergias y preferencias en cuenta',
        ],
      },
      progreso: {
        eyebrow: 'Progreso',
        altImagen: 'Atleta midiendo su progreso al aire libre',
        tituloPre: 'Mira cómo ',
        tituloAcento: 'avanzas',
        tituloPost: ', semana a semana',
        descripcion:
          'Peso, fuerza, macros y fotos en gráficas claras. Ves tu evolución con datos reales y ajustas sobre la marcha, no a ojo.',
        datos: [
          'Gráficas en tiempo real',
          'Fotos antes / después privadas',
          'Agua, ayuno y rachas',
        ],
      },
    },
    planes: {
      eyebrow: 'Planes',
      titulo: 'Elige tu cuota individual',
      subtitulo:
        'Profesionales 24/7 listos para atenderte. Sin permanencia: si quieres lograrlo, ¿por qué no intentarlo?',
      ariaCiclo: 'Ciclo de facturación',
      opcionMensual: 'Mensual',
      opcionAnual: 'Anual',
      ahorro: '−20%',
      garantia: 'Sin permanencia · cancela en 1 clic · profesionales 24/7',
      etiquetaAnual: 'Ahorra 20%',
      mensual: {
        titulo: 'Cuota mensual',
        descripcion: 'Flexibilidad total, cancela cuando quieras',
        precio: '19,99€',
        periodo: '/mes',
        nota: '+ IVA · facturación mensual',
        boton: 'Inscríbete',
        ventajas: [
          'Máximo de 7 comidas diarias',
          'Rutinas de ejercicios hasta 7 días',
          'Seguimiento avanzado con gráficos',
          'Asesoría nutricional personalizada',
          'Acceso a contenido exclusivo',
        ],
      },
      anual: {
        titulo: 'Cuota anual',
        descripcion: 'El plan que eligen quienes van en serio',
        precio: '15,99€',
        periodo: '/mes',
        nota: '+ IVA · facturación anual · ahorras 48€',
        boton: 'Inscríbete',
        ventajas: [
          'Máximo de 7 comidas diarias',
          'Rutinas de ejercicios hasta 7 días',
          'Seguimiento avanzado con gráficos',
          'Asesoría nutricional personalizada',
          'Acceso a contenido exclusivo',
        ],
      },
    },
    funcionalidades: {
      eyebrow: 'Todo incluido',
      titulo: 'Más funcionalidades que disfrutar',
      ariaLista: 'Funcionalidades de Cofira',
      funcion: 'Función',
      lista: [
        {
          titulo: 'Gráficos de progreso',
          descripcion:
            'Visualiza peso, fuerza y macros con gráficas claras que cuentan tu evolución.',
          categoria: 'Seguimiento',
        },
        {
          titulo: 'Fotos de progreso',
          descripcion: 'Compara tu transformación mes a mes con un timeline visual privado.',
          categoria: 'Seguimiento',
        },
        {
          titulo: 'Ayuno intermitente',
          descripcion: 'Controla tus ventanas de ayuno y sincronízalas con tu plan nutricional.',
          categoria: 'Nutrición',
        },
        {
          titulo: 'Registro de agua',
          descripcion: 'Mantén tu hidratación al día con un objetivo diario y recordatorios.',
          categoria: 'Hidratación',
        },
        {
          titulo: 'Widgets',
          descripcion: 'Lleva tus métricas clave siempre a la vista, allá donde estés.',
          categoria: 'Sistema',
        },
        {
          titulo: 'Registro de comidas',
          descripcion: 'Apunta lo que comes con análisis por foto y base de alimentos.',
          categoria: 'Nutrición',
        },
      ],
    },
    grafica: {
      periodo: 'Últimos 6 meses',
      media7: 'Media 7 días',
      hacia: 'hacia',
      haciaTooltip: 'Hacia',
      objetivoEje: 'objetivo',
      leyendaObjetivo: 'Objetivo',
      meses: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      total: 'Total',
      ritmo: 'Ritmo',
      mejorMes: 'Mejor mes',
      porMes: '/mes',
      esteMes: 'este mes',
      sincronizado: 'Sincronizado hoy a las 08:12',
      metricas: [
        {
          clave: 'peso',
          etiqueta: 'Peso',
          unidad: 'kg',
          actual: '76,4',
          delta: '−2,2 kg',
          sube: false,
          periodo: '6 meses',
          objetivo: 74,
          objetivoEtiqueta: '74,0 kg',
          pctObjetivo: 48,
          restante: 'Te faltan 2,4 kg',
          rangoMin: 73.4,
          rangoMax: 79,
          ejes: [78, 77, 76],
          puntos: [
            { mes: 'Ene', etiqueta: 'Enero', valor: 78.6, media: 78.6, cambio: 'inicio', pct: 0 },
            {
              mes: 'Feb',
              etiqueta: 'Febrero',
              valor: 78.1,
              media: 78.3,
              cambio: '−0,5 kg',
              pct: 11,
            },
            { mes: 'Mar', etiqueta: 'Marzo', valor: 77.4, media: 77.7, cambio: '−0,7 kg', pct: 26 },
            { mes: 'Abr', etiqueta: 'Abril', valor: 76.9, media: 77.1, cambio: '−0,5 kg', pct: 37 },
            { mes: 'May', etiqueta: 'Mayo', valor: 76.6, media: 76.8, cambio: '−0,3 kg', pct: 43 },
            {
              mes: 'Jun',
              etiqueta: 'Junio · hoy',
              valor: 76.4,
              media: 76.5,
              cambio: '−0,2 kg',
              pct: 48,
            },
          ],
        },
        {
          clave: 'fuerza',
          etiqueta: 'Fuerza',
          unidad: 'kg',
          actual: '81,0',
          delta: '+18,5 kg',
          sube: true,
          periodo: '6 meses',
          objetivo: 90,
          objetivoEtiqueta: '90,0 kg',
          pctObjetivo: 67,
          restante: 'Te faltan 9,0 kg',
          rangoMin: 60,
          rangoMax: 92,
          ejes: [82, 72, 62],
          puntos: [
            { mes: 'Ene', etiqueta: 'Enero', valor: 62.5, media: 62.5, cambio: 'inicio', pct: 0 },
            { mes: 'Feb', etiqueta: 'Febrero', valor: 66, media: 64.5, cambio: '+3,5 kg', pct: 13 },
            { mes: 'Mar', etiqueta: 'Marzo', valor: 70.5, media: 68, cambio: '+4,5 kg', pct: 29 },
            { mes: 'Abr', etiqueta: 'Abril', valor: 74, media: 72, cambio: '+3,5 kg', pct: 42 },
            { mes: 'May', etiqueta: 'Mayo', valor: 78, media: 76, cambio: '+4,0 kg', pct: 56 },
            {
              mes: 'Jun',
              etiqueta: 'Junio · hoy',
              valor: 81,
              media: 79.2,
              cambio: '+3,0 kg',
              pct: 67,
            },
          ],
        },
        {
          clave: 'cintura',
          etiqueta: 'Cintura',
          unidad: 'cm',
          actual: '84,5',
          delta: '−7,5 cm',
          sube: false,
          periodo: '6 meses',
          objetivo: 82,
          objetivoEtiqueta: '82,0 cm',
          pctObjetivo: 75,
          restante: 'Te faltan 2,5 cm',
          rangoMin: 81,
          rangoMax: 93,
          ejes: [92, 88, 84],
          puntos: [
            { mes: 'Ene', etiqueta: 'Enero', valor: 92, media: 92, cambio: 'inicio', pct: 0 },
            { mes: 'Feb', etiqueta: 'Febrero', valor: 90.2, media: 91, cambio: '−1,8 cm', pct: 18 },
            { mes: 'Mar', etiqueta: 'Marzo', valor: 88.4, media: 89.4, cambio: '−1,8 cm', pct: 36 },
            { mes: 'Abr', etiqueta: 'Abril', valor: 86.8, media: 87.6, cambio: '−1,6 cm', pct: 52 },
            { mes: 'May', etiqueta: 'Mayo', valor: 85.5, media: 86.2, cambio: '−1,3 cm', pct: 65 },
            {
              mes: 'Jun',
              etiqueta: 'Junio · hoy',
              valor: 84.5,
              media: 85.1,
              cambio: '−1,0 cm',
              pct: 75,
            },
          ],
        },
      ],
    },
    comparador: {
      eyebrow: 'La transformación',
      delta: '−15,6 kg',
      sub: 'en 16 semanas',
      hoySemana: 'Hoy · Semana 16',
      hoyPeso: '79,2 kg',
      pista: '‹ › desliza para comparar',
      fotos: [
        { fecha: 'Semana 1', peso: '94,8 kg', imagen: '/assets/images/transformacion-enero.png' },
        { fecha: 'Semana 6', peso: '88,1 kg', imagen: '/assets/images/transformacion-marzo.png' },
        { fecha: 'Semana 12', peso: '82,4 kg', imagen: '/assets/images/transformacion-mayo.png' },
      ],
    },
    ayuno: {
      planTitulo: 'Plan de hoy',
      eventos: [
        {
          hora: 12,
          etiqueta: '12:00',
          nombre: 'Romper ayuno',
          detalle: 'primera comida',
          esComida: true,
        },
        { hora: 16, etiqueta: '16:00', nombre: 'Comida 2', detalle: '480 kcal', esComida: true },
        {
          hora: 19.5,
          etiqueta: '19:30',
          nombre: 'Última comida',
          detalle: '540 kcal',
          esComida: true,
        },
        {
          hora: 20,
          etiqueta: '20:00',
          nombre: 'Empieza el ayuno',
          detalle: 'objetivo 16 h',
          esComida: false,
        },
      ],
      enPrefijo: 'en',
      faseVentana: 'Ventana de comida',
      detalleVentana: 'ayuno completado · vuelves a las 20:00',
      faseCetosis: 'Cetosis activa',
      detalleCetosis: 'quemando grasa · hora',
      faseGlucogeno: 'Fase glucógeno',
      detalleGlucogeno: 'gastando reservas · hora',
      de16: 'de 16',
      rotuloVentana: 'ventana de comida · el ayuno vuelve a las 20:00',
      rotuloEnAyuno: 'en ayuno desde las 20:00 · llevas',
      estasAqui: 'estás aquí · h',
      glucogenoHecho: 'hora 0 – 12 · completado',
      cetosisRango: 'hora 12 – 16',
      notaGlucogenoTitulo: 'Glucógeno agotado',
      notaGlucogenoDato: 'glucógeno 18 % · agotándose',
      notaCetosisTitulo: 'Cetosis',
      notaCetosisDato: 'cetonas 0,6 mmol/L · subiendo',
      notaHormonaTitulo: 'Hormona de crecimiento',
      notaHormonaSub: 'pico natural · +300 %',
      vertical: 'autofagia',
      detoxTitulo: 'Detox celular y reparación',
      detoxSub: 'autofagia activa en',
      detoxMitocondriasValor: '+15 %',
      detoxMitocondrias: 'mitocondrias',
      detoxInflamacionValor: '−20 %',
      detoxInflamacion: 'inflamación (PCR)',
      reglaGlucogeno: '0 h · glucógeno',
      reglaQuema: '12 h · quema de grasa',
      reglaReparacion: '16 h · reparación',
      llevas: 'llevas',
      comidaEn: 'comida en',
      pieProxima: 'Tu próxima comida a las',
      zonas: [
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
      ],
    },
    agua: {
      eyebrow: 'Hidratación · hoy',
      objetivo: 'Objetivo 2,4 L · 8 vasos de 0,3',
      progreso: 'del objetivo diario',
      rachaLabel: 'días de racha',
      mediaValor: '2,1 L',
      mediaLabel: 'media · 7 días',
      semanaTitulo: 'Esta semana',
      pista: 'Toca un vaso · 0,3 L',
      ariaVaso: 'Registrar vaso',
      vasoMeta: 'de tu objetivo',
      estadoCumplido: 'Objetivo cumplido',
      estadoCasi: 'Casi lo tienes',
      estadoMuyBien: 'Vas muy bien',
      estadoBuenCamino: 'Vas por buen camino',
      estadoEmpieza: 'Empieza a beber',
      historial: [
        { dia: 'L', litros: 2.4 },
        { dia: 'M', litros: 2.1 },
        { dia: 'X', litros: 2.6 },
        { dia: 'J', litros: 1.9 },
        { dia: 'V', litros: 2.3 },
        { dia: 'S', litros: 2.0 },
      ],
      diaHoy: 'D',
    },
    widgets: {
      subPre: 'Lleva tus métricas clave siempre a la vista, ',
      subAcento: 'allá donde estés',
      items: [
        'Pantalla de inicio y de bloqueo',
        'Apple Watch y Wear OS',
        'Se actualizan en tiempo real',
      ],
      actividad: 'Actividad',
      actActivo: '32 min activo',
      actEjercicios: '8 ejercicios',
      saludo: 'Hola, Álex',
      pasos: 'Pasos',
      peso: 'Peso',
      pesoCifra: '76,4',
      pesoNota: '−0,3 kg sem',
      agua: 'Agua',
      aguaCifra: '1,5',
      diasUnidad: 'días',
      rachaEtiqueta: 'Racha · récord',
      distancia: 'Distancia',
      distanciaCifra: '6,2',
      watchPasos: 'pasos',
      watchAgua: 'agua',
      watchRacha: 'racha',
      dias: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      meses: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    },
    comidas: {
      hoy: 'Hoy ·',
      unidad: 'comidas',
      ia: 'Análisis por foto',
      consumido: 'Consumido',
      balanceMeta: '/ 2.450 · quedan 814',
      tagAnalizada: 'Recién analizada · 98 %',
      registro: [
        {
          nombre: 'Avena con fruta y nueces',
          hora: '08:15',
          kcal: 418,
          desglose: 'P 23 · C 61 · G 9',
        },
        {
          nombre: 'Pollo a la plancha con arroz',
          hora: '14:05',
          kcal: 676,
          desglose: 'P 58 · C 70 · G 18',
        },
        {
          nombre: 'Salmón con verduras asadas',
          hora: '21:10',
          kcal: 542,
          desglose: 'P 44 · C 30 · G 27',
        },
      ],
      totales: { consumidas: '1.636', pct: 67 },
      macros: [
        { nombre: 'Proteína', gramos: 125, objetivo: 150, pct: 83, color: 'hsl(40, 6%, 94%)' },
        { nombre: 'Carbohidratos', gramos: 161, objetivo: 265, pct: 61, color: 'hsl(40, 5%, 72%)' },
        { nombre: 'Grasas', gramos: 54, objetivo: 80, pct: 68, color: 'hsl(40, 4%, 55%)' },
      ],
      datos: [
        { etiqueta: 'Media · 7 días', valor: '1.918 kcal' },
        { etiqueta: 'Proteína media', valor: '128 g' },
        { etiqueta: 'Comidas esta semana', valor: '19' },
        { etiqueta: 'Racha de registro', valor: '12 días' },
      ],
      chipFoto: 'Foto',
      pie: 'Apunta lo que comes con análisis por foto',
    },
    faq: {
      eyebrow: 'Dudas',
      titulo: 'Preguntas',
      tituloAcento: 'frecuentes',
      intro:
        'Lo que nos preguntan antes de empezar. Si no encuentras tu respuesta, estamos al otro lado.',
      contactoTitulo: '¿Tienes más preguntas?',
      metaIndice: 'Índice',
      metaTotal: '05 preguntas',
      pregunta1: '¿Qué incluye la cuota mensual de Cofira?',
      respuesta1Pre: 'La cuota mensual incluye ',
      respuesta1Clave1: 'acceso completo',
      respuesta1Medio: ' a todas las funcionalidades: planificación de hasta ',
      respuesta1Clave2: '7 comidas diarias',
      respuesta1Post:
        ', rutinas de ejercicio personalizadas, seguimiento avanzado con gráficos de progreso, asesoría nutricional y acceso a contenido exclusivo.',
      pregunta2: '¿Puedo cancelar mi suscripción en cualquier momento?',
      respuesta2Pre:
        'Sí, puedes cancelar tu suscripción cuando quieras desde la configuración de tu cuenta. ',
      respuesta2Clave: 'No hay permanencia mínima',
      respuesta2Post: ' ni penalizaciones por cancelación anticipada.',
      pregunta3: '¿Cómo funciona el seguimiento de progreso?',
      respuesta3:
        'Cofira registra tu peso, medidas corporales y fotos de progreso. Genera gráficos detallados que te muestran tu evolución a lo largo del tiempo, permitiéndote visualizar tus logros y ajustar tu plan según tus objetivos.',
      pregunta4: '¿Las rutinas y los menús se adaptan a mí?',
      respuesta4:
        'Sí. Tu rutina y tu menú semanal se generan a partir de tu objetivo, nivel, equipamiento, alergias y preferencias. Cada semana se ajustan con tu feedback real: si algo te cuesta o te sobra, el plan cambia contigo.',
      pregunta5: '¿Qué diferencia hay entre la cuota mensual y la anual?',
      respuesta5Pre: 'Las dos incluyen exactamente lo mismo. La anual sale a ',
      respuesta5Clave1: '15,99€ al mes',
      respuesta5Medio: ' en vez de 19,99€: un 20% menos, unos ',
      respuesta5Clave2: '48€ de ahorro al año',
      respuesta5Post: '.',
    },
    ctaFinal: {
      titulo: 'Empieza hoy tu transformación',
      texto: 'Tu plan personalizado te espera. Sin excusas, con un sistema que se mide solo.',
      boton: 'Crear mi cuenta',
    },
  },
  en: {
    rastro: [
      { etiqueta: 'Home', objetivo: '.hero' },
      { etiqueta: 'Manifesto', objetivo: '.manifiesto' },
      { etiqueta: 'How it works', objetivo: '.proceso' },
      { etiqueta: 'Pillars', objetivo: '.pilares' },
      { etiqueta: 'Plans', objetivo: '#seccion-planes' },
      { etiqueta: 'Features', objetivo: '.funcionalidades' },
      { etiqueta: 'FAQ', objetivo: '.faq' },
      { etiqueta: 'Join', objetivo: '.cta-final' },
    ],
    hero: {
      eyebrow: 'Train · Eat · Progress',
      altImagen: 'Athlete training with intensity',
      tituloLinea: 'Your body,',
      tituloAcento: 'your system',
      subtitulo:
        'Training, nutrition and progress tracking in one place. Built around you, measured down to the detail.',
      botonEmpezar: 'Start your change',
      botonPlanes: 'See plans',
      desliza: 'Scroll',
    },
    manifiesto: {
      aria: 'Cofira manifesto',
      palabras: [
        { texto: 'We', clave: false },
        { texto: "don't", clave: false },
        { texto: 'sell', clave: false },
        { texto: 'motivation.', clave: true },
        { texto: 'We', clave: false },
        { texto: 'sell', clave: false },
        { texto: 'a', clave: false },
        { texto: 'system.', clave: true },
        { texto: 'Your', clave: false },
        { texto: 'only', clave: false },
        { texto: 'job:', clave: false },
        { texto: 'show', clave: true },
        { texto: 'up.', clave: true },
      ],
    },
    proceso: {
      eyebrow: 'How it works',
      titulo: 'From zero to rolling in three steps',
      pasos: [
        {
          numero: '01',
          titulo: 'Tell us your goal',
          descripcion:
            'A quick onboarding captures your level, your measurements and your goals to design a plan built for you.',
        },
        {
          numero: '02',
          titulo: 'Get your plan',
          descripcion:
            'We generate your weekly routine and your menu with macros measured to the gram, ready to start today.',
        },
        {
          numero: '03',
          titulo: 'Track your progress',
          descripcion:
            'Log workouts, meals and water. See your evolution in clear charts and adjust as you go.',
        },
      ],
    },
    cintaAcciones: ['Train', 'Eat', 'Discipline', 'Enjoy', 'Repeat'],
    cintaCompromiso: ['No excuses', 'No lock-in', 'No shortcuts'],
    pilares: {
      aria: 'What Cofira includes',
      verComo: 'See how',
      entrenamiento: {
        eyebrow: 'Training',
        altImagen: 'Person lifting weights in a dim gym',
        tituloPre: 'Routines that ',
        tituloAcento: 'evolve',
        tituloPost: ' with you',
        descripcion:
          'Every week we adjust sets, loads and rest based on your real feedback. No generic plans: your body calls the shots.',
        datos: ['Automatic weekly adjustment', '✓/✗ feedback per exercise', 'Up to 7 routine days'],
      },
      nutricion: {
        eyebrow: 'Nutrition',
        altImagen: 'Healthy food prepared with care',
        tituloPre: 'Meals to the ',
        tituloAcento: 'gram',
        tituloPost: ', zero guesswork',
        descripcion:
          'We generate your weekly menu with macros already calculated and meals you actually crave. Eating well stops being a job.',
        datos: [
          'Macros to the gram: P · C · F',
          'Up to 7 meals a day',
          'Allergies and preferences covered',
        ],
      },
      progreso: {
        eyebrow: 'Progress',
        altImagen: 'Athlete checking their progress outdoors',
        tituloPre: 'Watch yourself ',
        tituloAcento: 'improve',
        tituloPost: ', week after week',
        descripcion:
          'Weight, strength, macros and photos in clear charts. You see your evolution with real data and adjust as you go, not by eye.',
        datos: ['Real-time charts', 'Private before / after photos', 'Water, fasting and streaks'],
      },
    },
    planes: {
      eyebrow: 'Plans',
      titulo: 'Pick your individual plan',
      subtitulo: 'Pros available 24/7, ready to help. No lock-in: if you want it, why not try?',
      ariaCiclo: 'Billing cycle',
      opcionMensual: 'Monthly',
      opcionAnual: 'Yearly',
      ahorro: '−20%',
      garantia: 'No lock-in · cancel in 1 click · pros 24/7',
      etiquetaAnual: 'Save 20%',
      mensual: {
        titulo: 'Monthly plan',
        descripcion: 'Total flexibility, cancel anytime',
        precio: '€19.99',
        periodo: '/mo',
        nota: '+ VAT · billed monthly',
        boton: 'Join now',
        ventajas: [
          'Up to 7 meals a day',
          'Workout routines up to 7 days',
          'Advanced tracking with charts',
          'Personalized nutrition advice',
          'Access to exclusive content',
        ],
      },
      anual: {
        titulo: 'Yearly plan',
        descripcion: 'The plan serious people choose',
        precio: '€15.99',
        periodo: '/mo',
        nota: '+ VAT · billed yearly · you save €48',
        boton: 'Join now',
        ventajas: [
          'Up to 7 meals a day',
          'Workout routines up to 7 days',
          'Advanced tracking with charts',
          'Personalized nutrition advice',
          'Access to exclusive content',
        ],
      },
    },
    funcionalidades: {
      eyebrow: 'All included',
      titulo: 'More features to enjoy',
      ariaLista: 'Cofira features',
      funcion: 'Feature',
      lista: [
        {
          titulo: 'Progress charts',
          descripcion: 'See weight, strength and macros in clear charts that tell your story.',
          categoria: 'Tracking',
        },
        {
          titulo: 'Progress photos',
          descripcion: 'Compare your transformation month by month in a private visual timeline.',
          categoria: 'Tracking',
        },
        {
          titulo: 'Intermittent fasting',
          descripcion: 'Control your fasting windows and sync them with your nutrition plan.',
          categoria: 'Nutrition',
        },
        {
          titulo: 'Water tracking',
          descripcion: 'Keep your hydration on point with a daily goal and reminders.',
          categoria: 'Hydration',
        },
        {
          titulo: 'Widgets',
          descripcion: 'Keep your key metrics always in sight, wherever you are.',
          categoria: 'System',
        },
        {
          titulo: 'Meal logging',
          descripcion: 'Log what you eat with photo analysis and a food database.',
          categoria: 'Nutrition',
        },
      ],
    },
    grafica: {
      periodo: 'Last 6 months',
      media7: '7-day average',
      hacia: 'towards',
      haciaTooltip: 'Towards',
      objetivoEje: 'goal',
      leyendaObjetivo: 'Goal',
      meses: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      total: 'Total',
      ritmo: 'Pace',
      mejorMes: 'Best month',
      porMes: '/mo',
      esteMes: 'this month',
      sincronizado: 'Synced today at 08:12',
      metricas: [
        {
          clave: 'peso',
          etiqueta: 'Weight',
          unidad: 'kg',
          actual: '76.4',
          delta: '−2.2 kg',
          sube: false,
          periodo: '6 months',
          objetivo: 74,
          objetivoEtiqueta: '74.0 kg',
          pctObjetivo: 48,
          restante: '2.4 kg to go',
          rangoMin: 73.4,
          rangoMax: 79,
          ejes: [78, 77, 76],
          puntos: [
            { mes: 'Jan', etiqueta: 'January', valor: 78.6, media: 78.6, cambio: 'start', pct: 0 },
            {
              mes: 'Feb',
              etiqueta: 'February',
              valor: 78.1,
              media: 78.3,
              cambio: '−0.5 kg',
              pct: 11,
            },
            { mes: 'Mar', etiqueta: 'March', valor: 77.4, media: 77.7, cambio: '−0.7 kg', pct: 26 },
            { mes: 'Apr', etiqueta: 'April', valor: 76.9, media: 77.1, cambio: '−0.5 kg', pct: 37 },
            { mes: 'May', etiqueta: 'May', valor: 76.6, media: 76.8, cambio: '−0.3 kg', pct: 43 },
            {
              mes: 'Jun',
              etiqueta: 'June · today',
              valor: 76.4,
              media: 76.5,
              cambio: '−0.2 kg',
              pct: 48,
            },
          ],
        },
        {
          clave: 'fuerza',
          etiqueta: 'Strength',
          unidad: 'kg',
          actual: '81.0',
          delta: '+18.5 kg',
          sube: true,
          periodo: '6 months',
          objetivo: 90,
          objetivoEtiqueta: '90.0 kg',
          pctObjetivo: 67,
          restante: '9.0 kg to go',
          rangoMin: 60,
          rangoMax: 92,
          ejes: [82, 72, 62],
          puntos: [
            { mes: 'Jan', etiqueta: 'January', valor: 62.5, media: 62.5, cambio: 'start', pct: 0 },
            {
              mes: 'Feb',
              etiqueta: 'February',
              valor: 66,
              media: 64.5,
              cambio: '+3.5 kg',
              pct: 13,
            },
            { mes: 'Mar', etiqueta: 'March', valor: 70.5, media: 68, cambio: '+4.5 kg', pct: 29 },
            { mes: 'Apr', etiqueta: 'April', valor: 74, media: 72, cambio: '+3.5 kg', pct: 42 },
            { mes: 'May', etiqueta: 'May', valor: 78, media: 76, cambio: '+4.0 kg', pct: 56 },
            {
              mes: 'Jun',
              etiqueta: 'June · today',
              valor: 81,
              media: 79.2,
              cambio: '+3.0 kg',
              pct: 67,
            },
          ],
        },
        {
          clave: 'cintura',
          etiqueta: 'Waist',
          unidad: 'cm',
          actual: '84.5',
          delta: '−7.5 cm',
          sube: false,
          periodo: '6 months',
          objetivo: 82,
          objetivoEtiqueta: '82.0 cm',
          pctObjetivo: 75,
          restante: '2.5 cm to go',
          rangoMin: 81,
          rangoMax: 93,
          ejes: [92, 88, 84],
          puntos: [
            { mes: 'Jan', etiqueta: 'January', valor: 92, media: 92, cambio: 'start', pct: 0 },
            {
              mes: 'Feb',
              etiqueta: 'February',
              valor: 90.2,
              media: 91,
              cambio: '−1.8 cm',
              pct: 18,
            },
            { mes: 'Mar', etiqueta: 'March', valor: 88.4, media: 89.4, cambio: '−1.8 cm', pct: 36 },
            { mes: 'Apr', etiqueta: 'April', valor: 86.8, media: 87.6, cambio: '−1.6 cm', pct: 52 },
            { mes: 'May', etiqueta: 'May', valor: 85.5, media: 86.2, cambio: '−1.3 cm', pct: 65 },
            {
              mes: 'Jun',
              etiqueta: 'June · today',
              valor: 84.5,
              media: 85.1,
              cambio: '−1.0 cm',
              pct: 75,
            },
          ],
        },
      ],
    },
    comparador: {
      eyebrow: 'The transformation',
      delta: '−15.6 kg',
      sub: 'in 16 weeks',
      hoySemana: 'Today · Week 16',
      hoyPeso: '79.2 kg',
      pista: '‹ › drag to compare',
      fotos: [
        { fecha: 'Week 1', peso: '94.8 kg', imagen: '/assets/images/transformacion-enero.png' },
        { fecha: 'Week 6', peso: '88.1 kg', imagen: '/assets/images/transformacion-marzo.png' },
        { fecha: 'Week 12', peso: '82.4 kg', imagen: '/assets/images/transformacion-mayo.png' },
      ],
    },
    ayuno: {
      planTitulo: "Today's plan",
      eventos: [
        {
          hora: 12,
          etiqueta: '12:00',
          nombre: 'Break fast',
          detalle: 'first meal',
          esComida: true,
        },
        { hora: 16, etiqueta: '16:00', nombre: 'Meal 2', detalle: '480 kcal', esComida: true },
        {
          hora: 19.5,
          etiqueta: '19:30',
          nombre: 'Last meal',
          detalle: '540 kcal',
          esComida: true,
        },
        {
          hora: 20,
          etiqueta: '20:00',
          nombre: 'Fast begins',
          detalle: '16 h goal',
          esComida: false,
        },
      ],
      enPrefijo: 'in',
      faseVentana: 'Eating window',
      detalleVentana: 'fast complete · back at 20:00',
      faseCetosis: 'Ketosis active',
      detalleCetosis: 'burning fat · hour',
      faseGlucogeno: 'Glycogen phase',
      detalleGlucogeno: 'burning reserves · hour',
      de16: 'of 16',
      rotuloVentana: 'eating window · fasting resumes at 20:00',
      rotuloEnAyuno: 'fasting since 20:00 · elapsed',
      estasAqui: 'you are here · h',
      glucogenoHecho: 'hour 0 – 12 · complete',
      cetosisRango: 'hour 12 – 16',
      notaGlucogenoTitulo: 'Glycogen depleted',
      notaGlucogenoDato: 'glycogen 18% · running out',
      notaCetosisTitulo: 'Ketosis',
      notaCetosisDato: 'ketones 0.6 mmol/L · rising',
      notaHormonaTitulo: 'Growth hormone',
      notaHormonaSub: 'natural peak · +300%',
      vertical: 'autophagy',
      detoxTitulo: 'Cell detox and repair',
      detoxSub: 'autophagy active in',
      detoxMitocondriasValor: '+15%',
      detoxMitocondrias: 'mitochondria',
      detoxInflamacionValor: '−20%',
      detoxInflamacion: 'inflammation (CRP)',
      reglaGlucogeno: '0 h · glycogen',
      reglaQuema: '12 h · fat burning',
      reglaReparacion: '16 h · repair',
      llevas: 'elapsed',
      comidaEn: 'food in',
      pieProxima: 'Your next meal at',
      zonas: [
        {
          clave: 'glucogeno',
          titulo: 'Phase 1 · Glycogen',
          rango: 'hour 0 – 12',
          descripcion: 'Your body burns through its sugar reserves and insulin drops.',
          color: 'hsl(196, 70%, 62%)',
          min: 0,
          max: 0.3,
          datos: [
            { etiqueta: 'glucose', valor: '72 mg/dl' },
            { etiqueta: 'insulin', valor: '−45%' },
            { etiqueta: 'glycogen', valor: '18%' },
          ],
        },
        {
          clave: 'quema',
          titulo: 'Phase 2 · Fat burning',
          rango: 'hour 12 – 16',
          descripcion: 'With no sugar available, fat becomes the fuel.',
          color: 'hsl(28, 100%, 60%)',
          min: 0.3,
          max: 0.78,
          datos: [
            { etiqueta: 'ketones', valor: '0.6 mmol/L' },
            { etiqueta: 'lipolysis', valor: '+150%' },
            { etiqueta: 'growth h.', valor: '+300%' },
          ],
        },
        {
          clave: 'autofagia',
          titulo: 'Phase 3 · Autophagy',
          rango: 'hour 16 – 18+',
          descripcion: 'Cells recycle damaged components and repair themselves.',
          color: 'hsl(276, 80%, 70%)',
          min: 0.78,
          max: 1,
          datos: [
            { etiqueta: 'ketones', valor: '1.1 mmol/L' },
            { etiqueta: 'mitochondria', valor: '+15%' },
            { etiqueta: 'inflammation (CRP)', valor: '−20%' },
          ],
        },
      ],
    },
    agua: {
      eyebrow: 'Hydration · today',
      objetivo: 'Goal 2.4 L · 8 glasses of 0.3',
      progreso: 'of your daily goal',
      rachaLabel: 'day streak',
      mediaValor: '2.1 L',
      mediaLabel: 'avg · 7 days',
      semanaTitulo: 'This week',
      pista: 'Tap a glass · 0.3 L',
      ariaVaso: 'Log glass',
      vasoMeta: 'of your goal',
      estadoCumplido: 'Goal reached',
      estadoCasi: 'Almost there',
      estadoMuyBien: 'Doing great',
      estadoBuenCamino: 'On the right track',
      estadoEmpieza: 'Start drinking',
      historial: [
        { dia: 'Mo', litros: 2.4 },
        { dia: 'Tu', litros: 2.1 },
        { dia: 'We', litros: 2.6 },
        { dia: 'Th', litros: 1.9 },
        { dia: 'Fr', litros: 2.3 },
        { dia: 'Sa', litros: 2.0 },
      ],
      diaHoy: 'Su',
    },
    widgets: {
      subPre: 'Keep your key metrics always in sight, ',
      subAcento: 'wherever you are',
      items: ['Home and lock screen', 'Apple Watch and Wear OS', 'They update in real time'],
      actividad: 'Activity',
      actActivo: '32 min active',
      actEjercicios: '8 exercises',
      saludo: 'Hi, Álex',
      pasos: 'Steps',
      peso: 'Weight',
      pesoCifra: '76.4',
      pesoNota: '−0.3 kg wk',
      agua: 'Water',
      aguaCifra: '1.5',
      diasUnidad: 'days',
      rachaEtiqueta: 'Streak · record',
      distancia: 'Distance',
      distanciaCifra: '6.2',
      watchPasos: 'steps',
      watchAgua: 'water',
      watchRacha: 'streak',
      dias: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      meses: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    comidas: {
      hoy: 'Today ·',
      unidad: 'meals',
      ia: 'Photo analysis',
      consumido: 'Consumed',
      balanceMeta: '/ 2,450 · 814 left',
      tagAnalizada: 'Just analyzed · 98%',
      registro: [
        {
          nombre: 'Oatmeal with fruit and walnuts',
          hora: '08:15',
          kcal: 418,
          desglose: 'P 23 · C 61 · F 9',
        },
        {
          nombre: 'Grilled chicken with rice',
          hora: '14:05',
          kcal: 676,
          desglose: 'P 58 · C 70 · F 18',
        },
        {
          nombre: 'Salmon with roasted vegetables',
          hora: '21:10',
          kcal: 542,
          desglose: 'P 44 · C 30 · F 27',
        },
      ],
      totales: { consumidas: '1,636', pct: 67 },
      macros: [
        { nombre: 'Protein', gramos: 125, objetivo: 150, pct: 83, color: 'hsl(40, 6%, 94%)' },
        { nombre: 'Carbs', gramos: 161, objetivo: 265, pct: 61, color: 'hsl(40, 5%, 72%)' },
        { nombre: 'Fats', gramos: 54, objetivo: 80, pct: 68, color: 'hsl(40, 4%, 55%)' },
      ],
      datos: [
        { etiqueta: '7-day average', valor: '1,918 kcal' },
        { etiqueta: 'Average protein', valor: '128 g' },
        { etiqueta: 'Meals this week', valor: '19' },
        { etiqueta: 'Logging streak', valor: '12 days' },
      ],
      chipFoto: 'Photo',
      pie: 'Log what you eat with photo analysis',
    },
    faq: {
      eyebrow: 'Questions',
      titulo: 'Frequently',
      tituloAcento: 'asked',
      intro: "What people ask us before starting. If you can't find your answer, we're right here.",
      contactoTitulo: 'Got more questions?',
      metaIndice: 'Index',
      metaTotal: '05 questions',
      pregunta1: 'What does the Cofira monthly plan include?',
      respuesta1Pre: 'The monthly plan includes ',
      respuesta1Clave1: 'full access',
      respuesta1Medio: ' to every feature: planning of up to ',
      respuesta1Clave2: '7 meals a day',
      respuesta1Post:
        ', personalized workout routines, advanced tracking with progress charts, nutrition advice and access to exclusive content.',
      pregunta2: 'Can I cancel my subscription at any time?',
      respuesta2Pre: 'Yes, you can cancel your subscription anytime from your account settings. ',
      respuesta2Clave: 'There is no minimum commitment',
      respuesta2Post: ' and no early cancellation fees.',
      pregunta3: 'How does progress tracking work?',
      respuesta3:
        'Cofira logs your weight, body measurements and progress photos. It builds detailed charts that show your evolution over time, so you can see your wins and adjust your plan to your goals.',
      pregunta4: 'Do the routines and menus adapt to me?',
      respuesta4:
        'Yes. Your routine and weekly menu are generated from your goal, level, equipment, allergies and preferences. Every week they adjust with your real feedback: if something is too hard or too easy, the plan changes with you.',
      pregunta5: 'What is the difference between the monthly and the yearly plan?',
      respuesta5Pre: 'Both include exactly the same. The yearly plan comes to ',
      respuesta5Clave1: '€15.99 a month',
      respuesta5Medio: ' instead of €19.99: 20% less, around ',
      respuesta5Clave2: '€48 saved per year',
      respuesta5Post: '.',
    },
    ctaFinal: {
      titulo: 'Start your transformation today',
      texto: 'Your personalized plan is waiting. No excuses, with a system that measures itself.',
      boton: 'Create my account',
    },
  },
};
