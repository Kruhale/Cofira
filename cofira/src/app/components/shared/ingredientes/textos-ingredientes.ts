import { CodigoIdioma } from '../../../services/idioma.service';

export interface IngredienteDetalle {
  nombre: string;
  cantidad: string;
  calorias: number;
}

/* Textos visibles del modal de ingredientes, por idioma. La lista es la de
   demostración del componente; cantidades y calorías no varían por lengua. */
interface TextosIngredientes {
  tituloModal: string;
  totalCalorias: string;
  subtituloLista: string;
  ingredientes: IngredienteDetalle[];
}

export const TEXTOS_INGREDIENTES: Record<CodigoIdioma, TextosIngredientes> = {
  es: {
    tituloModal: 'Ingredientes',
    totalCalorias: 'Total de calorías:',
    subtituloLista: 'Ingredientes detallados',
    ingredientes: [
      { nombre: 'Harina de trigo', cantidad: '200g', calorias: 360 },
      { nombre: 'Queso mozzarella', cantidad: '150g', calorias: 280 },
      { nombre: 'Salsa de tomate', cantidad: '100g', calorias: 30 },
      { nombre: 'Aceite de oliva', cantidad: '15ml', calorias: 120 },
    ],
  },
  en: {
    tituloModal: 'Ingredients',
    totalCalorias: 'Total calories:',
    subtituloLista: 'Detailed ingredients',
    ingredientes: [
      { nombre: 'Wheat flour', cantidad: '200g', calorias: 360 },
      { nombre: 'Mozzarella cheese', cantidad: '150g', calorias: 280 },
      { nombre: 'Tomato sauce', cantidad: '100g', calorias: 30 },
      { nombre: 'Olive oil', cantidad: '15ml', calorias: 120 },
    ],
  },
};
