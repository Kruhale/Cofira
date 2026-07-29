import { CodigoIdioma } from '../../../services/idioma.service';

/* Todos los textos visibles del modal de comida alternativa, por idioma. La
   interfaz obliga a que ambas lenguas tengan exactamente las mismas claves. */
interface TextosComidaAlternativa {
  tituloModal: string;
  enLugarDe: string;
  labelQueComiste: string;
  placeholderComida: string;
  leyendaMacros: string;
  labelCalorias: string;
  labelProteinas: string;
  labelCarbohidratos: string;
  labelGrasas: string;
  botonCancelar: string;
  botonGuardando: string;
  botonGuardar: string;
  errorNombreObligatorio: string;
  errorSinComida: string;
  exitoRegistrada: string;
  errorRegistrar: string;
}

export const TEXTOS_COMIDA_ALTERNATIVA: Record<CodigoIdioma, TextosComidaAlternativa> = {
  es: {
    tituloModal: 'Registrar comida alternativa',
    enLugarDe: 'En lugar de:',
    labelQueComiste: '¿Qué comiste?',
    placeholderComida: 'Ej: Ensalada César con pollo',
    leyendaMacros: 'Valores nutricionales (estimados)',
    labelCalorias: 'Calorías',
    labelProteinas: 'Proteínas',
    labelCarbohidratos: 'Carbohidratos',
    labelGrasas: 'Grasas',
    botonCancelar: 'Cancelar',
    botonGuardando: 'Guardando...',
    botonGuardar: 'Guardar',
    errorNombreObligatorio: 'El nombre de la comida es obligatorio',
    errorSinComida: 'No se ha seleccionado una comida',
    exitoRegistrada: 'Comida alternativa registrada',
    errorRegistrar: 'Error al registrar la comida',
  },
  en: {
    tituloModal: 'Log an alternative meal',
    enLugarDe: 'Instead of:',
    labelQueComiste: 'What did you eat?',
    placeholderComida: 'E.g. Caesar salad with chicken',
    leyendaMacros: 'Nutritional values (estimated)',
    labelCalorias: 'Calories',
    labelProteinas: 'Protein',
    labelCarbohidratos: 'Carbs',
    labelGrasas: 'Fats',
    botonCancelar: 'Cancel',
    botonGuardando: 'Saving...',
    botonGuardar: 'Save',
    errorNombreObligatorio: 'The meal name is required',
    errorSinComida: 'No meal selected',
    exitoRegistrada: 'Alternative meal logged',
    errorRegistrar: 'Could not log the meal',
  },
};
