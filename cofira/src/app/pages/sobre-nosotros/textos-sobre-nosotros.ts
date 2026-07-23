import { CodigoIdioma } from '../../services/idioma.service';

interface MiembroEquipo {
  nombre: string;
  cargo: string;
  foto: string;
  fotoWebp: {
    small: string;
    medium: string;
    large: string;
  };
  linkedin?: string;
}

interface Valor {
  icono: string;
  titulo: string;
  descripcion: string;
}

interface Estadistica {
  valor: string;
  etiqueta: string;
}

/* Todos los textos visibles de la página (incluidos alt y datos de las listas),
   por idioma. La interfaz obliga a que ambas lenguas tengan las mismas claves. */
interface TextosSobreNosotros {
  heroTitulo: string;
  heroSubtitulo: string;
  historiaTitulo: string;
  historiaParrafo1: string;
  historiaParrafo2: string;
  historiaParrafo3: string;
  historiaImagenAlt: string;
  galeriaTitulo: string;
  galeriaDescripcion: string;
  galeriaPesoLibreAlt: string;
  galeriaPesoLibrePie: string;
  galeriaCardioAlt: string;
  galeriaCardioPie: string;
  galeriaAlimentacionAlt: string;
  galeriaAlimentacionPie: string;
  galeriaClasesAlt: string;
  galeriaClasesPie: string;
  galeriaEstiramientosAlt: string;
  galeriaEstiramientosPie: string;
  galeriaProgresoAlt: string;
  galeriaProgresoPie: string;
  valoresTitulo: string;
  valores: Valor[];
  estadisticas: Estadistica[];
  equipoTitulo: string;
  equipoDescripcion: string;
  equipo: MiembroEquipo[];
  ctaTitulo: string;
  ctaTexto: string;
  ctaBoton: string;
}

export const TEXTOS_SOBRE_NOSOTROS: Record<CodigoIdioma, TextosSobreNosotros> = {
  es: {
    heroTitulo: 'Transformamos vidas a través del fitness',
    heroSubtitulo:
      'En Cofira creemos que cada persona merece las herramientas necesarias para alcanzar su mejor versión física y mental.',
    historiaTitulo: 'Nuestra Historia',
    historiaParrafo1:
      'Cofira nació en 2023 de una idea simple: hacer el fitness accesible y personalizado para todos. Creado por Alejandro Bravo, estudiante de Desarrollo de Aplicaciones Web, este proyecto surgió como trabajo de fin de ciclo con la visión de ayudar a las personas a alcanzar sus objetivos de fitness.',
    historiaParrafo2:
      'Hoy, Cofira es una plataforma integral que combina planificación de entrenamientos, gestión nutricional y seguimiento de progreso en una sola aplicación. Nuestro equipo de desarrolladores, nutricionistas y entrenadores trabaja cada día para ofrecerte la mejor experiencia posible.',
    historiaParrafo3:
      'Nuestra misión es clara: democratizar el acceso a planes de fitness y nutrición de calidad profesional, adaptados a las necesidades únicas de cada usuario.',
    historiaImagenAlt: 'Gimnasio moderno con equipamiento de fitness',
    galeriaTitulo: 'Nuestras Instalaciones',
    galeriaDescripcion: 'Espacios diseñados para que alcances tu mejor versión.',
    galeriaPesoLibreAlt: 'Zona de peso libre con mancuernas organizadas por tamaño',
    galeriaPesoLibrePie: 'Zona de peso libre',
    galeriaCardioAlt: 'Cintas de correr y bicicletas estáticas en la zona cardiovascular',
    galeriaCardioPie: 'Zona cardiovascular',
    galeriaAlimentacionAlt: 'Plato equilibrado con proteína, verduras y arroz integral',
    galeriaAlimentacionPie: 'Alimentación equilibrada',
    galeriaClasesAlt: 'Grupo de personas realizando ejercicios funcionales en sala',
    galeriaClasesPie: 'Clases grupales',
    galeriaEstiramientosAlt: 'Mujer practicando estiramientos sobre esterilla de yoga',
    galeriaEstiramientosPie: 'Zona de estiramientos',
    galeriaProgresoAlt: 'Persona midiendo su progreso corporal con cinta métrica',
    galeriaProgresoPie: 'Seguimiento de progreso',
    valoresTitulo: 'Nuestros Valores',
    valores: [
      {
        icono: 'heart',
        titulo: 'Pasión por el Fitness',
        descripcion:
          'Creemos que el ejercicio es medicina y transformamos vidas a través del movimiento.',
      },
      {
        icono: 'users',
        titulo: 'Comunidad',
        descripcion: 'Construimos una comunidad de apoyo donde cada logro se celebra juntos.',
      },
      {
        icono: 'target',
        titulo: 'Resultados',
        descripcion:
          'Nos enfocamos en lo que funciona, con planes basados en ciencia y experiencia.',
      },
      {
        icono: 'shield',
        titulo: 'Confianza',
        descripcion: 'Tu privacidad y seguridad son nuestra prioridad. Tus datos están protegidos.',
      },
    ],
    estadisticas: [
      { valor: '50K+', etiqueta: 'Usuarios activos' },
      { valor: '1M+', etiqueta: 'Entrenamientos completados' },
      { valor: '500K+', etiqueta: 'Comidas registradas' },
      { valor: '98%', etiqueta: 'Satisfacción' },
    ],
    equipoTitulo: 'El Creador',
    equipoDescripcion: 'Desarrollador Full Stack apasionado por el fitness y la tecnología.',
    equipo: [
      {
        nombre: 'Alejandro Bravo',
        cargo: 'CEO & Fundador',
        foto: '/assets/images/soyYo.jpg',
        fotoWebp: {
          small: '/assets/images/soyYo-200w.webp',
          medium: '/assets/images/soyYo-400w.webp',
          large: '/assets/images/soyYo-600w.webp',
        },
        linkedin: '#',
      },
    ],
    ctaTitulo: '¿Listo para empezar tu transformación?',
    ctaTexto: 'Únete a miles de usuarios que ya están alcanzando sus objetivos con Cofira.',
    ctaBoton: 'Comenzar gratis',
  },
  en: {
    heroTitulo: 'Transforming lives through fitness',
    heroSubtitulo:
      'At Cofira we believe everyone deserves the right tools to become their best self, physically and mentally.',
    historiaTitulo: 'Our Story',
    historiaParrafo1:
      'Cofira was born in 2023 from a simple idea: making fitness accessible and personal for everyone. Created by Alejandro Bravo, a Web Application Development student, the project started as his final degree work with one vision: helping people reach their fitness goals.',
    historiaParrafo2:
      'Today, Cofira is an all-in-one platform that brings workout planning, nutrition management and progress tracking together in a single app. Our team of developers, nutritionists and coaches works every day to give you the best possible experience.',
    historiaParrafo3:
      "Our mission is clear: democratizing access to professional-grade fitness and nutrition plans, tailored to each user's unique needs.",
    historiaImagenAlt: 'Modern gym with fitness equipment',
    galeriaTitulo: 'Our Facilities',
    galeriaDescripcion: 'Spaces designed to bring out your best self.',
    galeriaPesoLibreAlt: 'Free weights area with dumbbells arranged by size',
    galeriaPesoLibrePie: 'Free weights area',
    galeriaCardioAlt: 'Treadmills and stationary bikes in the cardio area',
    galeriaCardioPie: 'Cardio area',
    galeriaAlimentacionAlt: 'Balanced plate with protein, vegetables and brown rice',
    galeriaAlimentacionPie: 'Balanced nutrition',
    galeriaClasesAlt: 'Group doing functional training in a studio',
    galeriaClasesPie: 'Group classes',
    galeriaEstiramientosAlt: 'Woman stretching on a yoga mat',
    galeriaEstiramientosPie: 'Stretching area',
    galeriaProgresoAlt: 'Person measuring body progress with a tape measure',
    galeriaProgresoPie: 'Progress tracking',
    valoresTitulo: 'Our Values',
    valores: [
      {
        icono: 'heart',
        titulo: 'Passion for Fitness',
        descripcion: 'We believe exercise is medicine, and we transform lives through movement.',
      },
      {
        icono: 'users',
        titulo: 'Community',
        descripcion: 'We build a supportive community where every win is celebrated together.',
      },
      {
        icono: 'target',
        titulo: 'Results',
        descripcion: 'We focus on what works, with plans built on science and experience.',
      },
      {
        icono: 'shield',
        titulo: 'Trust',
        descripcion: 'Your privacy and security come first. Your data is protected.',
      },
    ],
    estadisticas: [
      { valor: '50K+', etiqueta: 'Active users' },
      { valor: '1M+', etiqueta: 'Workouts completed' },
      { valor: '500K+', etiqueta: 'Meals logged' },
      { valor: '98%', etiqueta: 'Satisfaction' },
    ],
    equipoTitulo: 'The Creator',
    equipoDescripcion: 'A Full Stack developer passionate about fitness and technology.',
    equipo: [
      {
        nombre: 'Alejandro Bravo',
        cargo: 'CEO & Founder',
        foto: '/assets/images/soyYo.jpg',
        fotoWebp: {
          small: '/assets/images/soyYo-200w.webp',
          medium: '/assets/images/soyYo-400w.webp',
          large: '/assets/images/soyYo-600w.webp',
        },
        linkedin: '#',
      },
    ],
    ctaTitulo: 'Ready to start your transformation?',
    ctaTexto: 'Join thousands of users already reaching their goals with Cofira.',
    ctaBoton: 'Start for free',
  },
};
