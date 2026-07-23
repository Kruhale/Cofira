import { CodigoIdioma } from '../../services/idioma.service';

/* Todos los textos visibles (y aria-labels) de la página del gimnasio,
   por idioma. La interfaz obliga a que ambas lenguas tengan las mismas claves. */
interface TextosGimnasio {
  eyebrow: string;
  titulo: string;
  contextoSemana: string;
  cargandoRutina: string;
  vacioEtiqueta: string;
  rutinaPreparandose: string;
  rutinaAvisoMensual: string;
  ariaNavegacionDias: string;
  cabeceraEjercicio: string;
  cabeceraRepeticiones: string;
  cabeceraDescanso: string;
  cabeceraSeries: string;
  cabeceraPeso: string;
  cabeceraRealizado: string;
  ariaExpandirEjercicio: string;
  ariaMarcarRealizado: string;
  ariaMarcarNoRealizado: string;
  descansoTitulo: string;
  descansoSubtitulo: string;
  datoDia: string;
  datoEjercicios: string;
  datoSemana: string;
  feedbackEyebrow: string;
  feedbackTitulo: string;
  preguntaDificiles: string;
  placeholderDificiles: string;
  preguntaMasPeso: string;
  etiquetaComentarios: string;
  placeholderComentarios: string;
  botonCancelar: string;
  botonEnviar: string;
  progresoTitulo: string;
  progresoDescripcion: string;
  botonVerEstadisticas: string;
  altImagenProgreso: string;
  diasSemana: string[];
}

export const TEXTOS_GIMNASIO: Record<CodigoIdioma, TextosGimnasio> = {
  es: {
    eyebrow: 'Tu plan de entrenamiento',
    titulo: 'Tabla semanal',
    contextoSemana: 'Rutina generada por IA · Semana',
    cargandoRutina: 'Cargando tu rutina...',
    vacioEtiqueta: 'Generando rutina',
    rutinaPreparandose: 'Tu rutina se está preparando',
    rutinaAvisoMensual:
      'Las rutinas se generan automáticamente cada mes. Tu nueva rutina estará lista pronto.',
    ariaNavegacionDias: 'Navegación de días',
    cabeceraEjercicio: 'Ejercicio',
    cabeceraRepeticiones: 'Repeticiones',
    cabeceraDescanso: 'Descanso',
    cabeceraSeries: 'Series',
    cabeceraPeso: 'Peso (kg)',
    cabeceraRealizado: 'Realizado',
    ariaExpandirEjercicio: 'Expandir ejercicio',
    ariaMarcarRealizado: 'Marcar como realizado',
    ariaMarcarNoRealizado: 'Marcar como no realizado',
    descansoTitulo: 'Día de descanso',
    descansoSubtitulo: 'Sin ejercicios programados',
    datoDia: 'Día',
    datoEjercicios: 'Ejercicios',
    datoSemana: 'Semana',
    feedbackEyebrow: 'Ajusta tu próxima rutina',
    feedbackTitulo: 'Retroalimentación',
    preguntaDificiles: '¿Cuáles son los ejercicios que más te han costado?',
    placeholderDificiles:
      'Escribe aquellos ejercicios que te hayan costado y los posibles motivos...',
    preguntaMasPeso: '¿Crees que podrías con más peso?',
    etiquetaComentarios: 'Comentarios adicionales',
    placeholderComentarios:
      'Escribe cualquier comentario adicional sobre tu entrenamiento esta semana...',
    botonCancelar: 'Cancelar',
    botonEnviar: 'Enviar',
    progresoTitulo: 'Ver mi progreso',
    progresoDescripcion:
      '¿Quieres ver tu progreso y cómo has evolucionado durante toda tu estancia en Cofira?',
    botonVerEstadisticas: 'Ver estadísticas',
    altImagenProgreso: 'Persona entrenando en el gimnasio',
    /* Orden Lunes-primero: coincide con la navegación de la tabla semanal */
    diasSemana: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  },
  en: {
    eyebrow: 'Your training plan',
    titulo: 'Weekly plan',
    contextoSemana: 'AI-generated routine · Week',
    cargandoRutina: 'Loading your routine...',
    vacioEtiqueta: 'Generating routine',
    rutinaPreparandose: 'Your routine is being prepared',
    rutinaAvisoMensual:
      'Routines are generated automatically every month. Your new routine will be ready soon.',
    ariaNavegacionDias: 'Day navigation',
    cabeceraEjercicio: 'Exercise',
    cabeceraRepeticiones: 'Reps',
    cabeceraDescanso: 'Rest',
    cabeceraSeries: 'Sets',
    cabeceraPeso: 'Weight (kg)',
    cabeceraRealizado: 'Done',
    ariaExpandirEjercicio: 'Expand exercise',
    ariaMarcarRealizado: 'Mark as done',
    ariaMarcarNoRealizado: 'Mark as not done',
    descansoTitulo: 'Rest day',
    descansoSubtitulo: 'No exercises scheduled',
    datoDia: 'Day',
    datoEjercicios: 'Exercises',
    datoSemana: 'Week',
    feedbackEyebrow: 'Tune your next routine',
    feedbackTitulo: 'Feedback',
    preguntaDificiles: 'Which exercises were the hardest for you?',
    placeholderDificiles: 'List the exercises you struggled with and the possible reasons...',
    preguntaMasPeso: 'Do you think you could handle more weight?',
    etiquetaComentarios: 'Additional comments',
    placeholderComentarios: 'Write any additional comments about your training this week...',
    botonCancelar: 'Cancel',
    botonEnviar: 'Submit',
    progresoTitulo: 'View my progress',
    progresoDescripcion:
      'Want to see your progress and how you have evolved during your time at Cofira?',
    botonVerEstadisticas: 'View stats',
    altImagenProgreso: 'Person training at the gym',
    diasSemana: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
};
