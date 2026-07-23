import { CodigoIdioma } from '../../services/idioma.service';

export interface CategoriaBlog {
  id: string;
  label: string;
}

export interface ArticuloBlog {
  id: number;
  titulo: string;
  extracto: string;
  imagen: string;
  categoria: 'nutricion' | 'ejercicio' | 'bienestar';
  categoriaLabel: string;
  fecha: string;
  tiempoLectura: string;
  autor: string;
}

/* Todos los textos visibles de la página (categorías y artículos incluidos),
   por idioma. La interfaz obliga a que ambas lenguas tengan las mismas claves. */
interface TextosBlog {
  titulo: string;
  subtitulo: string;
  ariaFiltrar: string;
  categorias: CategoriaBlog[];
  articulos: ArticuloBlog[];
  sufijoLectura: string;
  prefijoAutor: string;
  leerMas: string;
  ariaLeerMas: string;
  sinResultados: string;
  newsletterTitulo: string;
  newsletterTexto: string;
  ariaNewsletter: string;
  newsletterPlaceholder: string;
  newsletterBoton: string;
}

export const TEXTOS_BLOG: Record<CodigoIdioma, TextosBlog> = {
  es: {
    titulo: 'Blog de Cofira',
    subtitulo:
      'Consejos, guías y artículos sobre fitness, nutrición y bienestar para ayudarte a alcanzar tus objetivos.',
    ariaFiltrar: 'Filtrar por categoría',
    categorias: [
      { id: 'todos', label: 'Todos' },
      { id: 'ejercicio', label: 'Ejercicio' },
      { id: 'nutricion', label: 'Nutrición' },
      { id: 'bienestar', label: 'Bienestar' },
    ],
    articulos: [
      {
        id: 1,
        titulo: '5 Ejercicios Esenciales para Principiantes',
        extracto:
          'Descubre los movimientos fundamentales que todo principiante debería dominar antes de avanzar a rutinas más complejas. Desde sentadillas hasta planchas.',
        imagen: 'assets/images/blog/ejercicios-principiantes',
        categoria: 'ejercicio',
        categoriaLabel: 'Ejercicio',
        fecha: '15 Dic 2024',
        tiempoLectura: '5 min',
        autor: 'Alejandro Bravo',
      },
      {
        id: 2,
        titulo: 'Guía Completa de Macronutrientes',
        extracto:
          'Aprende a calcular tus macros de forma precisa. Proteínas, carbohidratos y grasas: cuánto necesitas según tus objetivos de fitness.',
        imagen: 'assets/images/blog/macronutrientes',
        categoria: 'nutricion',
        categoriaLabel: 'Nutrición',
        fecha: '12 Dic 2024',
        tiempoLectura: '8 min',
        autor: 'Alejandro Bravo',
      },
      {
        id: 3,
        titulo: 'Cómo Mantener la Motivación a Largo Plazo',
        extracto:
          'La constancia es clave en el fitness. Te compartimos estrategias psicológicas probadas para mantener la motivación incluso en los días difíciles.',
        imagen: 'assets/images/blog/motivacion',
        categoria: 'bienestar',
        categoriaLabel: 'Bienestar',
        fecha: '8 Dic 2024',
        tiempoLectura: '6 min',
        autor: 'Alejandro Bravo',
      },
      {
        id: 4,
        titulo: 'La Rutina de Calentamiento Perfecta',
        extracto:
          'Un buen calentamiento previene lesiones y mejora el rendimiento. Te enseñamos una rutina completa de 10 minutos para antes de entrenar.',
        imagen: 'assets/images/blog/calentamiento',
        categoria: 'ejercicio',
        categoriaLabel: 'Ejercicio',
        fecha: '5 Dic 2024',
        tiempoLectura: '4 min',
        autor: 'Alejandro Bravo',
      },
      {
        id: 5,
        titulo: 'Alimentos Clave para Ganar Masa Muscular',
        extracto:
          'La alimentación es el 70% de tus resultados. Conoce los alimentos más efectivos para construir músculo de forma natural y saludable.',
        imagen: 'assets/images/blog/masa-muscular',
        categoria: 'nutricion',
        categoriaLabel: 'Nutrición',
        fecha: '1 Dic 2024',
        tiempoLectura: '7 min',
        autor: 'Alejandro Bravo',
      },
      {
        id: 6,
        titulo: 'Beneficios del Ayuno Intermitente',
        extracto:
          'El ayuno intermitente va más allá de perder peso. Descubre cómo puede mejorar tu energía, claridad mental y salud metabólica.',
        imagen: 'assets/images/blog/ayuno-intermitente',
        categoria: 'bienestar',
        categoriaLabel: 'Bienestar',
        fecha: '28 Nov 2024',
        tiempoLectura: '9 min',
        autor: 'Alejandro Bravo',
      },
    ],
    sufijoLectura: 'lectura',
    prefijoAutor: 'Por',
    leerMas: 'Leer más',
    ariaLeerMas: 'Leer más sobre ',
    sinResultados: 'No hay artículos en esta categoría todavía.',
    newsletterTitulo: 'Mantente al día',
    newsletterTexto:
      'Suscríbete a nuestra newsletter y recibe los mejores consejos de fitness y nutrición directamente en tu bandeja de entrada.',
    ariaNewsletter: 'Email para newsletter',
    newsletterPlaceholder: 'tu@email.com',
    newsletterBoton: 'Suscribirse',
  },
  en: {
    titulo: 'Cofira Blog',
    subtitulo:
      'Tips, guides and articles on fitness, nutrition and well-being to help you reach your goals.',
    ariaFiltrar: 'Filter by category',
    categorias: [
      { id: 'todos', label: 'All' },
      { id: 'ejercicio', label: 'Training' },
      { id: 'nutricion', label: 'Nutrition' },
      { id: 'bienestar', label: 'Well-being' },
    ],
    articulos: [
      {
        id: 1,
        titulo: '5 Essential Exercises for Beginners',
        extracto:
          'Master the fundamental movements every beginner should own before moving on to more advanced routines. From squats to planks.',
        imagen: 'assets/images/blog/ejercicios-principiantes',
        categoria: 'ejercicio',
        categoriaLabel: 'Training',
        fecha: 'Dec 15, 2024',
        tiempoLectura: '5 min',
        autor: 'Alejandro Bravo',
      },
      {
        id: 2,
        titulo: 'The Complete Guide to Macronutrients',
        extracto:
          'Learn how to dial in your macros. Protein, carbs and fat: how much you need based on your fitness goals.',
        imagen: 'assets/images/blog/macronutrientes',
        categoria: 'nutricion',
        categoriaLabel: 'Nutrition',
        fecha: 'Dec 12, 2024',
        tiempoLectura: '8 min',
        autor: 'Alejandro Bravo',
      },
      {
        id: 3,
        titulo: 'How to Stay Motivated for the Long Run',
        extracto:
          'Consistency is everything in fitness. Proven psychological strategies to stay motivated even on the hard days.',
        imagen: 'assets/images/blog/motivacion',
        categoria: 'bienestar',
        categoriaLabel: 'Well-being',
        fecha: 'Dec 8, 2024',
        tiempoLectura: '6 min',
        autor: 'Alejandro Bravo',
      },
      {
        id: 4,
        titulo: 'The Perfect Warm-up Routine',
        extracto:
          'A good warm-up prevents injuries and boosts performance. Here is a complete 10-minute routine for before you train.',
        imagen: 'assets/images/blog/calentamiento',
        categoria: 'ejercicio',
        categoriaLabel: 'Training',
        fecha: 'Dec 5, 2024',
        tiempoLectura: '4 min',
        autor: 'Alejandro Bravo',
      },
      {
        id: 5,
        titulo: 'Key Foods for Building Muscle',
        extracto:
          'Nutrition is 70% of your results. Discover the most effective foods to build muscle naturally and healthily.',
        imagen: 'assets/images/blog/masa-muscular',
        categoria: 'nutricion',
        categoriaLabel: 'Nutrition',
        fecha: 'Dec 1, 2024',
        tiempoLectura: '7 min',
        autor: 'Alejandro Bravo',
      },
      {
        id: 6,
        titulo: 'The Benefits of Intermittent Fasting',
        extracto:
          'Intermittent fasting goes beyond weight loss. See how it can improve your energy, mental clarity and metabolic health.',
        imagen: 'assets/images/blog/ayuno-intermitente',
        categoria: 'bienestar',
        categoriaLabel: 'Well-being',
        fecha: 'Nov 28, 2024',
        tiempoLectura: '9 min',
        autor: 'Alejandro Bravo',
      },
    ],
    sufijoLectura: 'read',
    prefijoAutor: 'By',
    leerMas: 'Read more',
    ariaLeerMas: 'Read more about ',
    sinResultados: 'No articles in this category yet.',
    newsletterTitulo: 'Stay in the loop',
    newsletterTexto:
      'Subscribe to our newsletter and get the best fitness and nutrition tips straight to your inbox.',
    ariaNewsletter: 'Email for the newsletter',
    newsletterPlaceholder: 'you@email.com',
    newsletterBoton: 'Subscribe',
  },
};
