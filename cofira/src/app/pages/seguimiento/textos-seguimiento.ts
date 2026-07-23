import { CodigoIdioma } from '../../services/idioma.service';

/* Todos los textos visibles (y aria-labels) de la página de seguimiento,
   por idioma. La interfaz obliga a que ambas lenguas tengan las mismas claves. */
interface TextosSeguimiento {
  eyebrow: string;
  titulo: string;
  contexto: string;
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
    titulo: 'Tu progreso',
    contexto: 'Semana en curso · macros y fuerza',
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
    titulo: 'Your progress',
    contexto: 'Current week · macros and strength',
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
