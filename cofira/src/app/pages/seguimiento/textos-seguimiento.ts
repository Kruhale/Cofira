import { CodigoIdioma } from '../../services/idioma.service';

/* Todos los textos visibles (y aria-labels) de la página de seguimiento,
   por idioma. La interfaz obliga a que ambas lenguas tengan las mismas claves. */
interface TextosSeguimiento {
  eyebrow: string;
  titulo: string;
  tituloAcento: string;
  contexto: string;
  entrenadorEyebrow: string;
  entrenadorCargando: string;
  entrenadorConsejoEtiqueta: string;
  entrenadorDemo: { comentario: string; consejo: string };
  anilloKcal: string;
  anilloAdherencia: string;
  anilloAgua: string;
  anilloEjercicios: string;
  macrosEtiqueta: string;
  etiquetaProteinas: string;
  etiquetaCarbohidratos: string;
  etiquetaGrasas: string;
  etiquetaFibraObjetivo: string;
  etiquetaAguaHoy: string;
  etiquetaRegistros: string;
  sinDatosAlimentacion: string;
  ayudaGenerarMenu: string;
  fuerzaEyebrow: string;
  fuerzaTitulo: string;
  sinEjerciciosRegistrados: string;
  cargandoDatos: string;
  sinDatosPeso: string;
  ayudaRegistrarPeso: string;
  ariaGraficoFuerza: string;
  datoUltimoPeso: string;
  datoMejorMarca: string;
  datoSesiones: string;
}

export const TEXTOS_SEGUIMIENTO: Record<CodigoIdioma, TextosSeguimiento> = {
  es: {
    eyebrow: 'Seguimiento · tu evolución',
    titulo: 'Tu',
    tituloAcento: 'progreso',
    contexto: 'Semana en curso · macros y fuerza',
    entrenadorEyebrow: 'Tu entrenador · IA',
    entrenadorCargando: 'Leyendo tu semana...',
    entrenadorConsejoEtiqueta: 'Consejo',
    entrenadorDemo: {
      comentario:
        'Aquí hablará tu entrenador: cada día leerá tus entrenos, tu agua y tus comidas registradas, y te dirá cómo vas de verdad — con tus datos, no con frases hechas.',
      consejo: 'Activa PRO y este análisis se hará a diario con tu semana real.',
    },
    anilloKcal: 'Kcal semana',
    anilloAdherencia: 'Comidas registradas',
    anilloAgua: 'Agua hoy',
    anilloEjercicios: 'Ejercicios esta semana',
    macrosEtiqueta: 'Macronutrientes · semana',
    etiquetaProteinas: 'Proteínas',
    etiquetaCarbohidratos: 'Carbohidratos',
    etiquetaGrasas: 'Grasas',
    etiquetaFibraObjetivo: 'Fibra objetivo',
    etiquetaAguaHoy: 'Agua hoy',
    etiquetaRegistros: 'Comidas registradas',
    sinDatosAlimentacion: 'Sin datos de alimentación',
    ayudaGenerarMenu: 'Genera tu menú semanal para ver tus macros',
    fuerzaEyebrow: 'Fuerza · evolución',
    fuerzaTitulo: 'Ganancia de fuerza',
    sinEjerciciosRegistrados: 'No hay ejercicios registrados',
    cargandoDatos: 'Cargando datos...',
    sinDatosPeso: 'No hay datos de peso registrados para este ejercicio.',
    ayudaRegistrarPeso:
      'Registra el peso levantado en tus entrenamientos para ver tu progreso aquí.',
    ariaGraficoFuerza: 'Gráfico de evolución de fuerza',
    datoUltimoPeso: 'Último peso',
    datoMejorMarca: 'Mejor marca',
    datoSesiones: 'Sesiones',
  },
  en: {
    eyebrow: 'Tracking · your evolution',
    titulo: 'Your',
    tituloAcento: 'progress',
    contexto: 'Current week · macros and strength',
    entrenadorEyebrow: 'Your coach · AI',
    entrenadorCargando: 'Reading your week...',
    entrenadorConsejoEtiqueta: 'Tip',
    entrenadorDemo: {
      comentario:
        'This is where your coach will speak: every day it will read your workouts, water and logged meals, and tell you how you are really doing — with your data, not canned phrases.',
      consejo: 'Go PRO and this analysis will run daily on your real week.',
    },
    anilloKcal: 'Weekly kcal',
    anilloAdherencia: 'Meals logged',
    anilloAgua: 'Water today',
    anilloEjercicios: 'Exercises this week',
    macrosEtiqueta: 'Macronutrients · week',
    etiquetaProteinas: 'Protein',
    etiquetaCarbohidratos: 'Carbs',
    etiquetaGrasas: 'Fat',
    etiquetaFibraObjetivo: 'Fiber target',
    etiquetaAguaHoy: 'Water today',
    etiquetaRegistros: 'Meals logged',
    sinDatosAlimentacion: 'No nutrition data',
    ayudaGenerarMenu: 'Generate your weekly menu to see your macros',
    fuerzaEyebrow: 'Strength · evolution',
    fuerzaTitulo: 'Strength gains',
    sinEjerciciosRegistrados: 'No exercises logged',
    cargandoDatos: 'Loading data...',
    sinDatosPeso: 'No weight data logged for this exercise.',
    ayudaRegistrarPeso: 'Log the weight you lift in your workouts to see your progress here.',
    ariaGraficoFuerza: 'Strength progress chart',
    datoUltimoPeso: 'Last weight',
    datoMejorMarca: 'Best lift',
    datoSesiones: 'Sessions',
  },
};
