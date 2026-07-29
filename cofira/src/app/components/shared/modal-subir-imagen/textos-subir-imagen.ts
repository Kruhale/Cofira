import { CodigoIdioma } from '../../../services/idioma.service';

type NivelConfianza = 'alta' | 'media' | 'baja';

/* Todos los textos visibles del modal de análisis por imagen, por idioma. El
   backend devuelve la confianza como 'alta'|'media'|'baja'; valoresConfianza
   traduce ese código sin tocar la clase CSS que lo usa como modificador. */
interface TextosSubirImagen {
  tituloModal: string;
  subtituloPrefijo: string;
  textoSubida: string;
  altPreview: string;
  botonCambiar: string;
  botonAnalizando: string;
  botonAnalizar: string;
  tituloResultados: string;
  labelCalorias: string;
  labelProteinas: string;
  labelCarbohidratos: string;
  labelGrasas: string;
  labelConfianza: string;
  valoresConfianza: Record<NivelConfianza, string>;
  botonCancelar: string;
  botonGuardando: string;
  botonGuardarResultado: string;
  errorNoEsImagen: string;
  errorSinImagen: string;
  exitoAnalizada: string;
  errorAnalizar: string;
  errorAnalizarPrimero: string;
  exitoRegistrada: string;
  errorGuardar: string;
  errorLeerImagen: string;
}

export const TEXTOS_SUBIR_IMAGEN: Record<CodigoIdioma, TextosSubirImagen> = {
  es: {
    tituloModal: 'Analizar comida con IA',
    subtituloPrefijo: 'Sube una foto de lo que comiste en lugar de:',
    textoSubida: 'Haz clic para seleccionar una imagen',
    altPreview: 'Preview de la comida',
    botonCambiar: 'Cambiar imagen',
    botonAnalizando: 'Analizando...',
    botonAnalizar: 'Analizar con IA',
    tituloResultados: 'Análisis completado',
    labelCalorias: 'Calorías',
    labelProteinas: 'Proteínas',
    labelCarbohidratos: 'Carbohidratos',
    labelGrasas: 'Grasas',
    labelConfianza: 'Confianza:',
    valoresConfianza: { alta: 'alta', media: 'media', baja: 'baja' },
    botonCancelar: 'Cancelar',
    botonGuardando: 'Guardando...',
    botonGuardarResultado: 'Guardar resultado',
    errorNoEsImagen: 'Por favor selecciona una imagen',
    errorSinImagen: 'Selecciona una imagen primero',
    exitoAnalizada: 'Imagen analizada correctamente',
    errorAnalizar: 'No se pudo analizar la imagen',
    errorAnalizarPrimero: 'Primero debes analizar la imagen',
    exitoRegistrada: 'Comida registrada correctamente',
    errorGuardar: 'No se pudo guardar el registro',
    errorLeerImagen: 'Error al leer la imagen',
  },
  en: {
    tituloModal: 'Analyze food with AI',
    subtituloPrefijo: 'Upload a photo of what you ate instead of:',
    textoSubida: 'Click to select an image',
    altPreview: 'Food preview',
    botonCambiar: 'Change image',
    botonAnalizando: 'Analyzing...',
    botonAnalizar: 'Analyze with AI',
    tituloResultados: 'Analysis complete',
    labelCalorias: 'Calories',
    labelProteinas: 'Protein',
    labelCarbohidratos: 'Carbs',
    labelGrasas: 'Fats',
    labelConfianza: 'Confidence:',
    valoresConfianza: { alta: 'high', media: 'medium', baja: 'low' },
    botonCancelar: 'Cancel',
    botonGuardando: 'Saving...',
    botonGuardarResultado: 'Save result',
    errorNoEsImagen: 'Please select an image',
    errorSinImagen: 'Select an image first',
    exitoAnalizada: 'Image analyzed successfully',
    errorAnalizar: 'Could not analyze the image',
    errorAnalizarPrimero: 'You must analyze the image first',
    exitoRegistrada: 'Meal logged successfully',
    errorGuardar: 'Could not save the entry',
    errorLeerImagen: 'Could not read the image',
  },
};
