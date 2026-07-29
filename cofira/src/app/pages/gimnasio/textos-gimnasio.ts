import { CodigoIdioma } from '../../services/idioma.service';

/* Todos los textos visibles (y aria-labels) de la página del gimnasio,
   por idioma. La interfaz obliga a que ambas lenguas tengan las mismas claves. */
interface TextosGimnasio {
  eyebrow: string;
  titulo: string;
  tituloAcento: string;
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
  pesoCorporal: string;
  verTecnica: string;
  progresoDia: string;
  tecnicaTitulo: string;
  tecnicaCerrar: string;
  tecnicaAbrirYoutube: string;
  tecnicaBuscando: string;
  tecnicaSinVideo: string;
  ariaMarcarRealizado: string;
  ariaMarcarNoRealizado: string;
  descansoTitulo: string;
  descansoSubtitulo: string;
  feedbackEyebrow: string;
  feedbackTitulo: string;
  fatigaEtiqueta: string;
  fatigaNiveles: string[];
  preguntaMasPeso: string;
  etiquetaComentarios: string;
  placeholderComentarios: string;
  feedbackGuardado: string;
  botonEnviar: string;
  progresoTitulo: string;
  progresoDescripcion: string;
  botonVerEstadisticas: string;
  altImagenProgreso: string;
  diasSemana: string[];
}

export const TEXTOS_GIMNASIO: Record<CodigoIdioma, TextosGimnasio> = {
  es: {
    eyebrow: 'Ejercicio · Tu plan de entrenamiento',
    titulo: 'Tabla',
    tituloAcento: 'semanal',
    contextoSemana: 'Semana',
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
    pesoCorporal: 'Corporal',
    verTecnica: 'Ver técnica',
    progresoDia: 'completados hoy',
    tecnicaTitulo: 'Técnica',
    tecnicaCerrar: 'Cerrar vídeo',
    tecnicaAbrirYoutube: 'Abrir en YouTube',
    tecnicaBuscando: 'Buscando el mejor vídeo...',
    tecnicaSinVideo: 'No hemos encontrado un vídeo directo. Ábrelo en YouTube aquí abajo.',
    ariaMarcarRealizado: 'Marcar como realizado',
    ariaMarcarNoRealizado: 'Marcar como no realizado',
    descansoTitulo: 'Día de descanso',
    descansoSubtitulo: 'Sin ejercicios programados',
    feedbackEyebrow: 'Diario de entrenamiento',
    feedbackTitulo: '¿Cómo fue el entreno de hoy?',
    fatigaEtiqueta: 'Esfuerzo percibido',
    fatigaNiveles: ['Muy fácil', 'Fácil', 'Justo', 'Duro', 'Agotador'],
    preguntaMasPeso: '¿Podrías con más peso?',
    etiquetaComentarios: 'Cuéntale a tu entrenador cómo ha ido',
    placeholderComentarios:
      'Ej: el press me costó en la última serie, la carrera fue cómoda, me molestó la rodilla...',
    feedbackGuardado: 'Guardado. Tu próxima rutina lo tendrá en cuenta.',
    botonEnviar: 'Guardar el día',
    progresoTitulo: 'Ver mi progreso',
    progresoDescripcion:
      '¿Quieres ver tu progreso y cómo has evolucionado durante toda tu estancia en Cofira?',
    botonVerEstadisticas: 'Ver estadísticas',
    altImagenProgreso: 'Persona entrenando en el gimnasio',
    /* Orden Lunes-primero: coincide con la navegación de la tabla semanal */
    diasSemana: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  },
  en: {
    eyebrow: 'Training · Your weekly plan',
    titulo: 'Weekly',
    tituloAcento: 'plan',
    contextoSemana: 'Week',
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
    pesoCorporal: 'Bodyweight',
    verTecnica: 'Watch form',
    progresoDia: 'done today',
    tecnicaTitulo: 'Form',
    tecnicaCerrar: 'Close video',
    tecnicaAbrirYoutube: 'Open on YouTube',
    tecnicaBuscando: 'Finding the best video...',
    tecnicaSinVideo: 'No direct video found. Open it on YouTube below.',
    ariaMarcarRealizado: 'Mark as done',
    ariaMarcarNoRealizado: 'Mark as not done',
    descansoTitulo: 'Rest day',
    descansoSubtitulo: 'No exercises scheduled',
    feedbackEyebrow: 'Training log',
    feedbackTitulo: 'How was today\'s workout?',
    fatigaEtiqueta: 'Perceived effort',
    fatigaNiveles: ['Very easy', 'Easy', 'Just right', 'Hard', 'Exhausting'],
    preguntaMasPeso: 'Could you handle more weight?',
    etiquetaComentarios: 'Tell your coach how it went',
    placeholderComentarios:
      'E.g. the press was tough on the last set, the run felt easy, my knee bothered me...',
    feedbackGuardado: 'Saved. Your next routine will take it into account.',
    botonEnviar: 'Save the day',
    progresoTitulo: 'View my progress',
    progresoDescripcion:
      'Want to see your progress and how you have evolved during your time at Cofira?',
    botonVerEstadisticas: 'View stats',
    altImagenProgreso: 'Person training at the gym',
    diasSemana: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
};
