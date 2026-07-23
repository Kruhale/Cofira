import { CodigoIdioma } from '../../services/idioma.service';
import { TipoComida } from '../../models/alimentacion.model';

/* Todos los textos visibles (y aria-labels) de la página de alimentación,
   por idioma. La interfaz obliga a que ambas lenguas tengan las mismas claves. */
interface TextosAlimentacion {
  eyebrow: string;
  titulo: string;
  contexto: string;
  generandoEtiqueta: string;
  generandoDiaPrefijo: string;
  generandoDiaConector: string;
  botonCancelarGeneracion: string;
  iniciandoGeneracion: string;
  cargando: string;
  ariaNavegacionFechas: string;
  ariaDiaAnterior: string;
  ariaAbrirCalendario: string;
  ariaDiaSiguiente: string;
  resumenTitulo: string;
  etiquetaProteinas: string;
  etiquetaCarbohidratos: string;
  etiquetaGrasas: string;
  etiquetaAgua: string;
  aguaObjetivoEtiqueta: string;
  ariaQuitarAgua: string;
  ariaAgregarAgua: string;
  vacioEtiqueta: string;
  sinMenuFecha: string;
  sinMenuAviso: string;
  botonGenerarMenu: string;
  sinComidasDia: string;
  botonRegenerarMenu: string;
  abrevProteina: string;
  abrevCarbs: string;
  abrevGrasa: string;
  ariaVerDetalles: string;
  preparacionTitulo: string;
  botonRegistrarComida: string;
  botonSubirFoto: string;
  toastDesmarcada: string;
  toastErrorDesmarcar: string;
  toastMarcada: string;
  toastErrorMarcar: string;
  tiposComida: Record<TipoComida, string>;
  diasSemana: string[];
}

export const TEXTOS_ALIMENTACION: Record<CodigoIdioma, TextosAlimentacion> = {
  es: {
    eyebrow: 'Nutrición · tu plan diario',
    titulo: 'Menú diario',
    contexto: 'Plan de 14 días generado por IA',
    generandoEtiqueta: 'Generando menú',
    generandoDiaPrefijo: 'Generando día',
    generandoDiaConector: 'de',
    botonCancelarGeneracion: 'Cancelar generación',
    iniciandoGeneracion: 'Iniciando generación del menú...',
    cargando: 'Cargando...',
    ariaNavegacionFechas: 'Navegación de fechas',
    ariaDiaAnterior: 'Día anterior',
    ariaAbrirCalendario: 'Abrir calendario',
    ariaDiaSiguiente: 'Día siguiente',
    resumenTitulo: 'Resumen del día',
    etiquetaProteinas: 'Proteínas',
    etiquetaCarbohidratos: 'Carbohidratos',
    etiquetaGrasas: 'Grasas',
    etiquetaAgua: 'Agua',
    aguaObjetivoEtiqueta: 'Objetivo',
    ariaQuitarAgua: 'Quitar vaso de agua',
    ariaAgregarAgua: 'Añadir vaso de agua',
    vacioEtiqueta: 'Sin plan',
    sinMenuFecha: 'No hay menú disponible para esta fecha',
    sinMenuAviso: 'Los menús se generan para las próximas 2 semanas',
    botonGenerarMenu: 'Generar menú semanal',
    sinComidasDia: 'No hay comidas para este día',
    botonRegenerarMenu: 'Regenerar menú semanal',
    abrevProteina: 'P',
    abrevCarbs: 'C',
    abrevGrasa: 'G',
    ariaVerDetalles: 'Ver detalles de',
    preparacionTitulo: 'Preparación',
    botonRegistrarComida: 'Registrar lo que comí',
    botonSubirFoto: 'Subir foto',
    toastDesmarcada: 'Comida desmarcada',
    toastErrorDesmarcar: 'Error al desmarcar la comida',
    toastMarcada: 'Comida marcada como consumida',
    toastErrorMarcar: 'Error al marcar la comida',
    tiposComida: {
      desayuno: 'Desayuno',
      almuerzo: 'Almuerzo',
      comida: 'Comida',
      merienda: 'Merienda',
      cena: 'Cena',
    },
    /* Orden Domingo-primero: los índices siguen a Date.getDay() */
    diasSemana: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  },
  en: {
    eyebrow: 'Nutrition · your daily plan',
    titulo: 'Daily menu',
    contexto: 'AI-generated 14-day plan',
    generandoEtiqueta: 'Generating menu',
    generandoDiaPrefijo: 'Generating day',
    generandoDiaConector: 'of',
    botonCancelarGeneracion: 'Cancel generation',
    iniciandoGeneracion: 'Starting menu generation...',
    cargando: 'Loading...',
    ariaNavegacionFechas: 'Date navigation',
    ariaDiaAnterior: 'Previous day',
    ariaAbrirCalendario: 'Open calendar',
    ariaDiaSiguiente: 'Next day',
    resumenTitulo: 'Daily summary',
    etiquetaProteinas: 'Protein',
    etiquetaCarbohidratos: 'Carbs',
    etiquetaGrasas: 'Fat',
    etiquetaAgua: 'Water',
    aguaObjetivoEtiqueta: 'Goal',
    ariaQuitarAgua: 'Remove a glass of water',
    ariaAgregarAgua: 'Add a glass of water',
    vacioEtiqueta: 'No plan',
    sinMenuFecha: 'No menu available for this date',
    sinMenuAviso: 'Menus are generated for the next 2 weeks',
    botonGenerarMenu: 'Generate weekly menu',
    sinComidasDia: 'No meals for this day',
    botonRegenerarMenu: 'Regenerate weekly menu',
    abrevProteina: 'P',
    abrevCarbs: 'C',
    abrevGrasa: 'F',
    ariaVerDetalles: 'View details for',
    preparacionTitulo: 'Preparation',
    botonRegistrarComida: 'Log what I ate',
    botonSubirFoto: 'Upload photo',
    toastDesmarcada: 'Meal unchecked',
    toastErrorDesmarcar: 'Could not uncheck the meal',
    toastMarcada: 'Meal logged as eaten',
    toastErrorMarcar: 'Could not log the meal',
    tiposComida: {
      desayuno: 'Breakfast',
      almuerzo: 'Mid-morning',
      comida: 'Lunch',
      merienda: 'Snack',
      cena: 'Dinner',
    },
    diasSemana: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
};
