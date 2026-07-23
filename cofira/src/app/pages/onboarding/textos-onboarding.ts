import { CodigoIdioma } from '../../services/idioma.service';

export interface OpcionSeleccion {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface OpcionNumerica {
  value: number;
  label: string;
  description: string;
}

export interface OpcionChip {
  id: string;
  label: string;
}

interface Beneficio {
  icono: string;
  titulo: string;
  descripcion: string;
}

/* Todos los textos visibles del onboarding, agrupados por paso y por idioma.
   Los values/ids de las opciones son los códigos que espera el backend y se
   repiten idénticos en ambas lenguas; solo cambian labels y descripciones. */
interface TextosOnboarding {
  ariaVolver: string;
  bienvenida: {
    marcaSub: string;
    titulo: string;
    tituloAcento: string;
    subtitulo: string;
    featureAlimentacionTitulo: string;
    featureAlimentacionSub: string;
    featureRutinasTitulo: string;
    featureRutinasSub: string;
    featureSeguimientoTitulo: string;
    featureSeguimientoSub: string;
    botonComenzar: string;
    tiempoEstimado: string;
    yaTienesCuenta: string;
    iniciaSesion: string;
  };
  objetivo: {
    titulo: string;
    subtitulo: string;
    opciones: OpcionSeleccion[];
    botonContinuar: string;
  };
  genero: {
    titulo: string;
    subtitulo: string;
    opciones: OpcionSeleccion[];
    botonContinuar: string;
  };
  nacimiento: {
    titulo: string;
    subtitulo: string;
    labelFecha: string;
    botonContinuar: string;
  };
  medidas: {
    titulo: string;
    subtitulo: string;
    labelAltura: string;
    labelPeso: string;
    errorAlturaMinima: string;
    errorAlturaMaxima: string;
    errorPesoMinimo: string;
    errorPesoMaximo: string;
    botonContinuar: string;
  };
  pesoObjetivo: {
    titulo: string;
    subtituloPrefijo: string;
    labelPeso: string;
    mantenerPeso: string;
    errorPesoMinimo: string;
    errorPesoMaximo: string;
    botonContinuar: string;
  };
  actividad: {
    titulo: string;
    subtitulo: string;
    opciones: OpcionSeleccion[];
    botonContinuar: string;
  };
  experiencia: {
    titulo: string;
    subtitulo: string;
    opciones: OpcionSeleccion[];
    botonContinuar: string;
  };
  diasEntreno: {
    titulo: string;
    subtitulo: string;
    opciones: OpcionNumerica[];
    botonContinuar: string;
  };
  dieta: {
    titulo: string;
    subtitulo: string;
    opciones: OpcionSeleccion[];
    botonContinuar: string;
  };
  comidas: {
    titulo: string;
    subtitulo: string;
    opciones: OpcionNumerica[];
    botonContinuar: string;
  };
  alergias: {
    titulo: string;
    subtitulo: string;
    opciones: OpcionChip[];
    botonSinAlergias: string;
    botonContinuar: string;
    sufijoSeleccionadas: string;
  };
  equipamiento: {
    titulo: string;
    subtitulo: string;
    opciones: OpcionChip[];
    botonSoloCuerpo: string;
    botonContinuar: string;
    sufijoSeleccionados: string;
  };
  resultados: {
    cargando: string;
    titulo: string;
    subtituloPrefijo: string;
    caloriasDiarias: string;
    metabolismoBasal: string;
    gastoTotal: string;
    macrosTitulo: string;
    proteina: string;
    carbohidratos: string;
    grasas: string;
    fibra: string;
    botonCrearCuenta: string;
  };
  registro: {
    titulo: string;
    subtitulo: string;
    ariaNombre: string;
    placeholderNombre: string;
    ariaEmail: string;
    placeholderEmail: string;
    errorFormatoEmail: string;
    errorEmailRegistrado: string;
    enlaceIniciarSesion: string;
    ariaContrasena: string;
    placeholderContrasena: string;
    ariaAlternarContrasena: string;
    requisitoLongitud: string;
    requisitoMayuscula: string;
    requisitoMinuscula: string;
    requisitoNumero: string;
    requisitoEspecial: string;
    ariaConfirmarContrasena: string;
    placeholderConfirmar: string;
    ariaAlternarConfirmacion: string;
    errorNoCoinciden: string;
    botonCreando: string;
    botonCrear: string;
    yaTienesCuenta: string;
    iniciarSesion: string;
    exitoCuentaCreada: string;
    errorCrearCuenta: string;
    avisoDatosNoGuardados: string;
  };
  pago: {
    exitoTitulo: string;
    exitoTexto: string;
    titulo: string;
    subtitulo: string;
    beneficios: Beneficio[];
    leyendaDatosPago: string;
    labelNumeroTarjeta: string;
    labelTitular: string;
    placeholderTitular: string;
    labelExpiracion: string;
    labelRenovacion: string;
    precioPeriodo: string;
    botonProcesando: string;
    botonActivar: string;
    botonOmitir: string;
    avisoSimulado: string;
    exitoBienvenida: string;
    errorPago: string;
  };
}

export const TEXTOS_ONBOARDING: Record<CodigoIdioma, TextosOnboarding> = {
  es: {
    ariaVolver: 'Volver al paso anterior',
    bienvenida: {
      marcaSub: 'Sistema',
      titulo: 'Come mejor,',
      tituloAcento: 'obtén resultados.',
      subtitulo:
        'Tu plan de nutrición y entrenamiento, hecho a tu medida. Responde unas preguntas y lo construimos contigo en cinco minutos.',
      featureAlimentacionTitulo: 'Plan de alimentación',
      featureAlimentacionSub: 'Macros y comidas que de verdad te apetecen',
      featureRutinasTitulo: 'Rutinas de ejercicio',
      featureRutinasSub: 'Adaptadas a tu nivel y a tu material',
      featureSeguimientoTitulo: 'Seguimiento de progreso',
      featureSeguimientoSub: 'Gráficas reales y ajustes sobre la marcha',
      botonComenzar: 'Comenzar ahora',
      tiempoEstimado: 'Solo te toma 5 minutos',
      yaTienesCuenta: '¿Ya tienes cuenta?',
      iniciaSesion: 'Inicia sesión',
    },
    objetivo: {
      titulo: 'Cual es tu objetivo principal?',
      subtitulo: 'Selecciona el objetivo que mejor describa lo que quieres lograr',
      opciones: [
        {
          value: 'LOSE_WEIGHT',
          label: 'Perder peso',
          description: 'Reducir grasa corporal manteniendo masa muscular',
          icon: 'scale-down',
        },
        {
          value: 'GAIN_MUSCLE',
          label: 'Ganar musculo',
          description: 'Aumentar masa muscular y fuerza',
          icon: 'muscle',
        },
        {
          value: 'MAINTAIN',
          label: 'Mantener peso',
          description: 'Mantener tu peso y composicion corporal actual',
          icon: 'balance',
        },
        {
          value: 'IMPROVE_HEALTH',
          label: 'Mejorar salud',
          description: 'Mejorar habitos alimenticios y bienestar general',
          icon: 'heart',
        },
      ],
      botonContinuar: 'Continuar',
    },
    genero: {
      titulo: 'Cual es tu genero?',
      subtitulo: 'Necesitamos esta informacion para calcular tus necesidades nutricionales',
      opciones: [
        { value: 'MALE', label: 'Masculino', icon: 'male' },
        { value: 'FEMALE', label: 'Femenino', icon: 'female' },
        { value: 'OTHER', label: 'Otro', icon: 'other' },
      ],
      botonContinuar: 'Continuar',
    },
    nacimiento: {
      titulo: 'Cuando naciste?',
      subtitulo: 'Tu edad nos ayuda a calcular tu metabolismo basal',
      labelFecha: 'Fecha de nacimiento',
      botonContinuar: 'Continuar',
    },
    medidas: {
      titulo: 'Tus medidas actuales',
      subtitulo: 'Necesitamos estos datos para calcular tu metabolismo',
      labelAltura: 'Altura',
      labelPeso: 'Peso actual',
      errorAlturaMinima: 'La altura mínima es 100 cm',
      errorAlturaMaxima: 'La altura máxima es 250 cm',
      errorPesoMinimo: 'El peso mínimo es 10 kg',
      errorPesoMaximo: 'El peso máximo es 300 kg',
      botonContinuar: 'Continuar',
    },
    pesoObjetivo: {
      titulo: 'Cual es tu peso objetivo?',
      subtituloPrefijo: 'Tu peso actual es de',
      labelPeso: 'Peso objetivo',
      mantenerPeso: 'Mantener peso',
      errorPesoMinimo: 'El peso mínimo es 10 kg',
      errorPesoMaximo: 'El peso máximo es 300 kg',
      botonContinuar: 'Continuar',
    },
    actividad: {
      titulo: 'Como es tu actividad diaria?',
      subtitulo: 'Selecciona el nivel que mejor describe tu rutina',
      opciones: [
        {
          value: 'SEDENTARY',
          label: 'Sedentario',
          description: 'Trabajo de escritorio, poco o nada de ejercicio',
        },
        {
          value: 'LIGHTLY_ACTIVE',
          label: 'Ligeramente activo',
          description: 'Ejercicio ligero 1-3 dias/semana',
        },
        {
          value: 'MODERATELY_ACTIVE',
          label: 'Moderadamente activo',
          description: 'Ejercicio moderado 3-5 dias/semana',
        },
        {
          value: 'VERY_ACTIVE',
          label: 'Muy activo',
          description: 'Ejercicio intenso 6-7 dias/semana',
        },
        {
          value: 'EXTRA_ACTIVE',
          label: 'Extremadamente activo',
          description: 'Atleta profesional o trabajo muy fisico',
        },
      ],
      botonContinuar: 'Continuar',
    },
    experiencia: {
      titulo: 'Cual es tu experiencia?',
      subtitulo: 'Selecciona tu nivel de experiencia en entrenamiento',
      opciones: [
        {
          value: 'SEDENTARY',
          label: 'Sedentario',
          description: 'Sin experiencia en ejercicio fisico',
        },
        {
          value: 'NOVICE',
          label: 'Principiante',
          description: 'Menos de 6 meses de experiencia',
        },
        {
          value: 'INTERMEDIATE',
          label: 'Intermedio',
          description: '6 meses a 2 anos de experiencia',
        },
        {
          value: 'ADVANCED',
          label: 'Avanzado',
          description: '2 a 5 anos de experiencia constante',
        },
        {
          value: 'ATHLETE',
          label: 'Atleta',
          description: 'Mas de 5 anos o nivel competitivo',
        },
      ],
      botonContinuar: 'Continuar',
    },
    diasEntreno: {
      titulo: 'Cuantos dias entrenas?',
      subtitulo: 'Selecciona cuantos dias a la semana puedes entrenar',
      opciones: [
        { value: 1, label: '1-2 dias', description: 'Entrenamiento minimo semanal' },
        { value: 3, label: '3-4 dias', description: 'Entrenamiento moderado' },
        { value: 5, label: '5-6 dias', description: 'Entrenamiento frecuente' },
        { value: 7, label: 'Todos los dias', description: 'Entrenamiento diario' },
      ],
      botonContinuar: 'Continuar',
    },
    dieta: {
      titulo: 'Cual es tu tipo de dieta?',
      subtitulo: 'Esto nos ayuda a personalizar tus recomendaciones',
      opciones: [
        {
          value: 'OMNIVORE',
          label: 'Omnivoro',
          description: 'Como todo tipo de alimentos',
        },
        {
          value: 'VEGETARIAN',
          label: 'Vegetariano',
          description: 'No como carne ni pescado',
        },
        {
          value: 'VEGAN',
          label: 'Vegano',
          description: 'No consumo productos de origen animal',
        },
        {
          value: 'PESCATARIAN',
          label: 'Pescetariano',
          description: 'Vegetariano que come pescado',
        },
        {
          value: 'MEDITERRANEAN',
          label: 'Mediterranea',
          description: 'Rica en aceite de oliva, pescado y verduras',
        },
      ],
      botonContinuar: 'Continuar',
    },
    comidas: {
      titulo: 'Cuantas comidas al dia?',
      subtitulo: 'Adaptaremos tu plan a tu rutina alimenticia',
      opciones: [
        { value: 2, label: '2 comidas', description: 'Ayuno intermitente o comidas grandes' },
        { value: 3, label: '3 comidas', description: 'Desayuno, almuerzo y cena' },
        { value: 4, label: '4 comidas', description: 'Tres comidas principales y un snack' },
        { value: 5, label: '5+ comidas', description: 'Multiples comidas pequenas al dia' },
      ],
      botonContinuar: 'Continuar',
    },
    alergias: {
      titulo: 'Tienes alguna alergia?',
      subtitulo: 'Selecciona todas las que apliquen (opcional)',
      opciones: [
        { id: 'gluten', label: 'Gluten' },
        { id: 'lactosa', label: 'Lactosa' },
        { id: 'huevo', label: 'Huevo' },
        { id: 'frutos-secos', label: 'Frutos secos' },
        { id: 'mariscos', label: 'Mariscos' },
        { id: 'pescado', label: 'Pescado' },
        { id: 'soja', label: 'Soja' },
        { id: 'cacahuete', label: 'Cacahuete' },
        { id: 'sesamo', label: 'Sesamo' },
        { id: 'mostaza', label: 'Mostaza' },
      ],
      botonSinAlergias: 'No tengo alergias',
      botonContinuar: 'Continuar',
      sufijoSeleccionadas: 'seleccionadas',
    },
    equipamiento: {
      titulo: 'Que equipamiento tienes?',
      subtitulo: 'Selecciona el equipamiento al que tienes acceso (opcional)',
      opciones: [
        { id: 'mancuernas', label: 'Mancuernas' },
        { id: 'barra', label: 'Barra olimpica' },
        { id: 'kettlebell', label: 'Kettlebell' },
        { id: 'bandas', label: 'Bandas elasticas' },
        { id: 'banco', label: 'Banco de pesas' },
        { id: 'rack', label: 'Rack/Jaula' },
        { id: 'poleas', label: 'Poleas/Cables' },
        { id: 'maquinas', label: 'Maquinas' },
        { id: 'bicicleta', label: 'Bicicleta estatica' },
        { id: 'cinta', label: 'Cinta de correr' },
        { id: 'remo', label: 'Maquina de remo' },
        { id: 'trx', label: 'TRX/Suspension' },
      ],
      botonSoloCuerpo: 'Solo peso corporal',
      botonContinuar: 'Continuar',
      sufijoSeleccionados: 'seleccionados',
    },
    resultados: {
      cargando: 'Calculando tu plan personalizado...',
      titulo: 'Tu plan personalizado',
      subtituloPrefijo: 'Basado en tu objetivo:',
      caloriasDiarias: 'Calorias diarias',
      metabolismoBasal: 'Metabolismo basal',
      gastoTotal: 'Gasto total (TDEE)',
      macrosTitulo: 'Macronutrientes diarios',
      proteina: 'Proteina',
      carbohidratos: 'Carbohidratos',
      grasas: 'Grasas',
      fibra: 'Fibra',
      botonCrearCuenta: 'Crear cuenta',
    },
    registro: {
      titulo: 'Crea tu cuenta',
      subtitulo: 'Guarda tu plan personalizado y accede desde cualquier dispositivo',
      ariaNombre: 'Nombre',
      placeholderNombre: 'Tu nombre',
      ariaEmail: 'Correo electrónico',
      placeholderEmail: 'tu@email.com',
      errorFormatoEmail:
        'El email debe tener un formato valido. Ejemplos: usuario@gmail.com, nombre@empresa.es',
      errorEmailRegistrado: 'Este email ya esta registrado.',
      enlaceIniciarSesion: '¿Iniciar sesion?',
      ariaContrasena: 'Contraseña',
      placeholderContrasena: 'Crea tu contraseña',
      ariaAlternarContrasena: 'Mostrar u ocultar contraseña',
      requisitoLongitud: '8 caracteres',
      requisitoMayuscula: '1 mayuscula',
      requisitoMinuscula: '1 minuscula',
      requisitoNumero: '1 numero',
      requisitoEspecial: '1 caracter especial (!@#$...)',
      ariaConfirmarContrasena: 'Confirmar contraseña',
      placeholderConfirmar: 'Repite tu contraseña',
      ariaAlternarConfirmacion: 'Mostrar u ocultar confirmacion de contraseña',
      errorNoCoinciden: 'Las contraseñas no coinciden',
      botonCreando: 'Creando cuenta...',
      botonCrear: 'Crear cuenta',
      yaTienesCuenta: '¿Ya tienes cuenta?',
      iniciarSesion: 'Iniciar sesión',
      exitoCuentaCreada: '¡Cuenta creada con éxito!',
      errorCrearCuenta: 'No se pudo crear la cuenta. Inténtalo de nuevo.',
      avisoDatosNoGuardados:
        'No se pudieron guardar todos los datos, pero tu cuenta ha sido creada.',
    },
    pago: {
      exitoTitulo: '¡Pago realizado!',
      exitoTexto: 'Ya eres parte de Cofira PRO. Redirigiendo...',
      titulo: 'Activa Cofira PRO',
      subtitulo: 'Desbloquea todas las funcionalidades premium',
      beneficios: [
        {
          icono: 'gimnasio',
          titulo: 'Gimnasio personalizado',
          descripcion: 'Rutinas adaptadas a tus objetivos',
        },
        {
          icono: 'alimentacion',
          titulo: 'Plan de alimentación',
          descripcion: 'Dietas personalizadas para ti',
        },
        {
          icono: 'seguimiento',
          titulo: 'Seguimiento completo',
          descripcion: 'Gráficos y estadísticas de progreso',
        },
      ],
      leyendaDatosPago: 'Datos de pago',
      labelNumeroTarjeta: 'Número de tarjeta',
      labelTitular: 'Nombre del titular',
      placeholderTitular: 'NOMBRE APELLIDO',
      labelExpiracion: 'Fecha expiración',
      labelRenovacion: 'Renovar automáticamente cada mes',
      precioPeriodo: '/mes',
      botonProcesando: 'Procesando pago...',
      botonActivar: 'Activar PRO',
      botonOmitir: 'Omitir por ahora',
      avisoSimulado: 'Pago simulado - No se realizará ningún cargo real',
      exitoBienvenida: '¡Bienvenido a Cofira PRO!',
      errorPago: 'Error al procesar el pago. Inténtalo de nuevo.',
    },
  },
  en: {
    ariaVolver: 'Go back to the previous step',
    bienvenida: {
      marcaSub: 'System',
      titulo: 'Eat better,',
      tituloAcento: 'get results.',
      subtitulo:
        "Your nutrition and training plan, built around you. Answer a few questions and we'll build it with you in five minutes.",
      featureAlimentacionTitulo: 'Meal plan',
      featureAlimentacionSub: "Macros and meals you'll actually enjoy",
      featureRutinasTitulo: 'Workout routines',
      featureRutinasSub: 'Matched to your level and your equipment',
      featureSeguimientoTitulo: 'Progress tracking',
      featureSeguimientoSub: 'Real charts and adjustments as you go',
      botonComenzar: 'Start now',
      tiempoEstimado: 'It only takes 5 minutes',
      yaTienesCuenta: 'Already have an account?',
      iniciaSesion: 'Log in',
    },
    objetivo: {
      titulo: 'What is your main goal?',
      subtitulo: 'Pick the goal that best describes what you want to achieve',
      opciones: [
        {
          value: 'LOSE_WEIGHT',
          label: 'Lose weight',
          description: 'Burn body fat while keeping muscle mass',
          icon: 'scale-down',
        },
        {
          value: 'GAIN_MUSCLE',
          label: 'Build muscle',
          description: 'Increase muscle mass and strength',
          icon: 'muscle',
        },
        {
          value: 'MAINTAIN',
          label: 'Maintain weight',
          description: 'Keep your current weight and body composition',
          icon: 'balance',
        },
        {
          value: 'IMPROVE_HEALTH',
          label: 'Improve health',
          description: 'Build better eating habits and overall well-being',
          icon: 'heart',
        },
      ],
      botonContinuar: 'Continue',
    },
    genero: {
      titulo: 'What is your gender?',
      subtitulo: 'We need this to calculate your nutritional needs',
      opciones: [
        { value: 'MALE', label: 'Male', icon: 'male' },
        { value: 'FEMALE', label: 'Female', icon: 'female' },
        { value: 'OTHER', label: 'Other', icon: 'other' },
      ],
      botonContinuar: 'Continue',
    },
    nacimiento: {
      titulo: 'When were you born?',
      subtitulo: 'Your age helps us calculate your basal metabolic rate',
      labelFecha: 'Date of birth',
      botonContinuar: 'Continue',
    },
    medidas: {
      titulo: 'Your current measurements',
      subtitulo: 'We need these numbers to calculate your metabolism',
      labelAltura: 'Height',
      labelPeso: 'Current weight',
      errorAlturaMinima: 'Minimum height is 100 cm',
      errorAlturaMaxima: 'Maximum height is 250 cm',
      errorPesoMinimo: 'Minimum weight is 10 kg',
      errorPesoMaximo: 'Maximum weight is 300 kg',
      botonContinuar: 'Continue',
    },
    pesoObjetivo: {
      titulo: 'What is your target weight?',
      subtituloPrefijo: 'Your current weight is',
      labelPeso: 'Target weight',
      mantenerPeso: 'Maintain weight',
      errorPesoMinimo: 'Minimum weight is 10 kg',
      errorPesoMaximo: 'Maximum weight is 300 kg',
      botonContinuar: 'Continue',
    },
    actividad: {
      titulo: 'How active is your day-to-day?',
      subtitulo: 'Pick the level that best describes your routine',
      opciones: [
        {
          value: 'SEDENTARY',
          label: 'Sedentary',
          description: 'Desk job, little or no exercise',
        },
        {
          value: 'LIGHTLY_ACTIVE',
          label: 'Lightly active',
          description: 'Light exercise 1-3 days/week',
        },
        {
          value: 'MODERATELY_ACTIVE',
          label: 'Moderately active',
          description: 'Moderate exercise 3-5 days/week',
        },
        {
          value: 'VERY_ACTIVE',
          label: 'Very active',
          description: 'Hard exercise 6-7 days/week',
        },
        {
          value: 'EXTRA_ACTIVE',
          label: 'Extremely active',
          description: 'Professional athlete or very physical job',
        },
      ],
      botonContinuar: 'Continue',
    },
    experiencia: {
      titulo: 'What is your experience level?',
      subtitulo: 'Pick your training experience level',
      opciones: [
        {
          value: 'SEDENTARY',
          label: 'Sedentary',
          description: 'No previous exercise experience',
        },
        {
          value: 'NOVICE',
          label: 'Beginner',
          description: 'Less than 6 months of experience',
        },
        {
          value: 'INTERMEDIATE',
          label: 'Intermediate',
          description: '6 months to 2 years of experience',
        },
        {
          value: 'ADVANCED',
          label: 'Advanced',
          description: '2 to 5 years of consistent training',
        },
        {
          value: 'ATHLETE',
          label: 'Athlete',
          description: 'Over 5 years or competitive level',
        },
      ],
      botonContinuar: 'Continue',
    },
    diasEntreno: {
      titulo: 'How many days do you train?',
      subtitulo: 'Pick how many days a week you can train',
      opciones: [
        { value: 1, label: '1-2 days', description: 'Minimal weekly training' },
        { value: 3, label: '3-4 days', description: 'Moderate training' },
        { value: 5, label: '5-6 days', description: 'Frequent training' },
        { value: 7, label: 'Every day', description: 'Daily training' },
      ],
      botonContinuar: 'Continue',
    },
    dieta: {
      titulo: 'What type of diet do you follow?',
      subtitulo: 'This helps us personalize your recommendations',
      opciones: [
        {
          value: 'OMNIVORE',
          label: 'Omnivore',
          description: 'I eat all kinds of food',
        },
        {
          value: 'VEGETARIAN',
          label: 'Vegetarian',
          description: 'No meat or fish',
        },
        {
          value: 'VEGAN',
          label: 'Vegan',
          description: 'No animal products at all',
        },
        {
          value: 'PESCATARIAN',
          label: 'Pescatarian',
          description: 'Vegetarian plus fish',
        },
        {
          value: 'MEDITERRANEAN',
          label: 'Mediterranean',
          description: 'Rich in olive oil, fish and vegetables',
        },
      ],
      botonContinuar: 'Continue',
    },
    comidas: {
      titulo: 'How many meals a day?',
      subtitulo: "We'll fit your plan to your eating routine",
      opciones: [
        { value: 2, label: '2 meals', description: 'Intermittent fasting or big meals' },
        { value: 3, label: '3 meals', description: 'Breakfast, lunch and dinner' },
        { value: 4, label: '4 meals', description: 'Three main meals and a snack' },
        { value: 5, label: '5+ meals', description: 'Several small meals a day' },
      ],
      botonContinuar: 'Continue',
    },
    alergias: {
      titulo: 'Do you have any allergies?',
      subtitulo: 'Select all that apply (optional)',
      opciones: [
        { id: 'gluten', label: 'Gluten' },
        { id: 'lactosa', label: 'Lactose' },
        { id: 'huevo', label: 'Egg' },
        { id: 'frutos-secos', label: 'Tree nuts' },
        { id: 'mariscos', label: 'Shellfish' },
        { id: 'pescado', label: 'Fish' },
        { id: 'soja', label: 'Soy' },
        { id: 'cacahuete', label: 'Peanut' },
        { id: 'sesamo', label: 'Sesame' },
        { id: 'mostaza', label: 'Mustard' },
      ],
      botonSinAlergias: 'No allergies',
      botonContinuar: 'Continue',
      sufijoSeleccionadas: 'selected',
    },
    equipamiento: {
      titulo: 'What equipment do you have?',
      subtitulo: 'Select the equipment you have access to (optional)',
      opciones: [
        { id: 'mancuernas', label: 'Dumbbells' },
        { id: 'barra', label: 'Olympic barbell' },
        { id: 'kettlebell', label: 'Kettlebell' },
        { id: 'bandas', label: 'Resistance bands' },
        { id: 'banco', label: 'Weight bench' },
        { id: 'rack', label: 'Rack/Cage' },
        { id: 'poleas', label: 'Cable machine' },
        { id: 'maquinas', label: 'Machines' },
        { id: 'bicicleta', label: 'Stationary bike' },
        { id: 'cinta', label: 'Treadmill' },
        { id: 'remo', label: 'Rowing machine' },
        { id: 'trx', label: 'TRX/Suspension trainer' },
      ],
      botonSoloCuerpo: 'Bodyweight only',
      botonContinuar: 'Continue',
      sufijoSeleccionados: 'selected',
    },
    resultados: {
      cargando: 'Calculating your personalized plan...',
      titulo: 'Your personalized plan',
      subtituloPrefijo: 'Based on your goal:',
      caloriasDiarias: 'Daily calories',
      metabolismoBasal: 'Basal metabolic rate',
      gastoTotal: 'Total burn (TDEE)',
      macrosTitulo: 'Daily macronutrients',
      proteina: 'Protein',
      carbohidratos: 'Carbs',
      grasas: 'Fats',
      fibra: 'Fiber',
      botonCrearCuenta: 'Create account',
    },
    registro: {
      titulo: 'Create your account',
      subtitulo: 'Save your personalized plan and access it from any device',
      ariaNombre: 'Name',
      placeholderNombre: 'Your name',
      ariaEmail: 'Email address',
      placeholderEmail: 'you@email.com',
      errorFormatoEmail:
        'The email must have a valid format. Examples: user@gmail.com, name@company.com',
      errorEmailRegistrado: 'This email is already registered.',
      enlaceIniciarSesion: 'Log in instead?',
      ariaContrasena: 'Password',
      placeholderContrasena: 'Create your password',
      ariaAlternarContrasena: 'Show or hide password',
      requisitoLongitud: '8 characters',
      requisitoMayuscula: '1 uppercase letter',
      requisitoMinuscula: '1 lowercase letter',
      requisitoNumero: '1 number',
      requisitoEspecial: '1 special character (!@#$...)',
      ariaConfirmarContrasena: 'Confirm password',
      placeholderConfirmar: 'Repeat your password',
      ariaAlternarConfirmacion: 'Show or hide password confirmation',
      errorNoCoinciden: 'Passwords do not match',
      botonCreando: 'Creating account...',
      botonCrear: 'Create account',
      yaTienesCuenta: 'Already have an account?',
      iniciarSesion: 'Log in',
      exitoCuentaCreada: 'Account created successfully!',
      errorCrearCuenta: "Couldn't create the account. Please try again.",
      avisoDatosNoGuardados: 'Not all your data could be saved, but your account has been created.',
    },
    pago: {
      exitoTitulo: 'Payment complete!',
      exitoTexto: "You're now part of Cofira PRO. Redirecting...",
      titulo: 'Activate Cofira PRO',
      subtitulo: 'Unlock every premium feature',
      beneficios: [
        {
          icono: 'gimnasio',
          titulo: 'Personalized training',
          descripcion: 'Routines tailored to your goals',
        },
        {
          icono: 'alimentacion',
          titulo: 'Meal plan',
          descripcion: 'Diets personalized for you',
        },
        {
          icono: 'seguimiento',
          titulo: 'Full tracking',
          descripcion: 'Progress charts and stats',
        },
      ],
      leyendaDatosPago: 'Payment details',
      labelNumeroTarjeta: 'Card number',
      labelTitular: 'Cardholder name',
      placeholderTitular: 'FULL NAME',
      labelExpiracion: 'Expiry date',
      labelRenovacion: 'Renew automatically every month',
      precioPeriodo: '/month',
      botonProcesando: 'Processing payment...',
      botonActivar: 'Activate PRO',
      botonOmitir: 'Skip for now',
      avisoSimulado: 'Simulated payment - no real charge will be made',
      exitoBienvenida: 'Welcome to Cofira PRO!',
      errorPago: 'Payment failed. Please try again.',
    },
  },
};
