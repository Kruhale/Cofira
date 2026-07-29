import { CodigoIdioma } from '../../services/idioma.service';

/* Punto de lista con etiqueta en negrita: el template lo pinta como
   <strong>etiqueta</strong> texto, igual que el HTML original. */
interface PuntoDestacado {
  etiqueta: string;
  texto: string;
}

/* Todos los textos visibles de la política de privacidad, por idioma. La
   interfaz obliga a que ambas lenguas tengan exactamente las mismas claves. */
interface TextosPrivacidad {
  tituloPagina: string;
  etiquetaFecha: string;
  fechaActualizacion: string;
  introTitulo: string;
  introParrafo1: string;
  introParrafo2: string;
  datosTitulo: string;
  datosIntro: string;
  perfilTitulo: string;
  perfilPuntos: string[];
  saludTitulo: string;
  saludPuntos: string[];
  tecnicaTitulo: string;
  tecnicaPuntos: string[];
  usoTitulo: string;
  usoIntro: string;
  usoPuntos: PuntoDestacado[];
  seguridadTitulo: string;
  seguridadIntro: string;
  seguridadPuntos: string[];
  seguridadConservacion: string;
  derechosTitulo: string;
  derechosIntro: string;
  derechosPuntos: PuntoDestacado[];
  derechosEjercicio: string;
  comparticionTitulo: string;
  comparticionIntro: string;
  comparticionPuntos: string[];
  contactoTitulo: string;
  contactoIntro: string;
  contactoEmailEtiqueta: string;
  contactoDireccionEtiqueta: string;
  contactoDireccion: string;
  contactoDpoEtiqueta: string;
}

export const TEXTOS_PRIVACIDAD: Record<CodigoIdioma, TextosPrivacidad> = {
  es: {
    tituloPagina: 'Política de Privacidad',
    etiquetaFecha: 'Última actualización:',
    fechaActualizacion: 'Enero 2025',
    introTitulo: '1. Introducción',
    introParrafo1:
      'En Cofira, nos comprometemos a proteger tu privacidad y tus datos personales. Esta política describe cómo recopilamos, utilizamos, almacenamos y protegemos la información que nos proporcionas al usar nuestra plataforma de fitness y nutrición.',
    introParrafo2:
      'Al utilizar Cofira, aceptas las prácticas descritas en esta política. Te recomendamos leerla detenidamente para entender cómo tratamos tu información.',
    datosTitulo: '2. Datos que Recopilamos',
    datosIntro:
      'Recopilamos diferentes tipos de información para proporcionarte nuestros servicios:',
    perfilTitulo: 'Información de perfil',
    perfilPuntos: [
      'Nombre y apellidos',
      'Dirección de correo electrónico',
      'Fecha de nacimiento',
      'Género',
      'Foto de perfil (opcional)',
    ],
    saludTitulo: 'Métricas de salud y fitness',
    saludPuntos: [
      'Peso y altura',
      'Objetivos de fitness (pérdida de peso, ganancia muscular, etc.)',
      'Historial de ejercicios y entrenamientos',
      'Registros de alimentación y calorías',
      'Medidas corporales',
      'Fotos de progreso (si las subes)',
    ],
    tecnicaTitulo: 'Información técnica',
    tecnicaPuntos: [
      'Dirección IP',
      'Tipo de navegador y dispositivo',
      'Páginas visitadas y tiempo de uso',
      'Preferencias de la aplicación',
    ],
    usoTitulo: '3. Cómo Usamos tus Datos',
    usoIntro: 'Utilizamos tu información para:',
    usoPuntos: [
      {
        etiqueta: 'Personalizar tu experiencia:',
        texto: 'Crear planes de entrenamiento y nutrición adaptados a tus objetivos.',
      },
      {
        etiqueta: 'Seguimiento de progreso:',
        texto: 'Generar gráficos y estadísticas sobre tu evolución.',
      },
      {
        etiqueta: 'Comunicaciones:',
        texto: 'Enviarte recordatorios, actualizaciones y contenido relevante.',
      },
      {
        etiqueta: 'Mejora del servicio:',
        texto: 'Analizar el uso de la plataforma para implementar mejoras.',
      },
      {
        etiqueta: 'Soporte técnico:',
        texto: 'Resolver dudas y problemas que puedas tener.',
      },
    ],
    seguridadTitulo: '4. Almacenamiento y Seguridad',
    seguridadIntro:
      'Tus datos se almacenan en servidores seguros ubicados en la Unión Europea. Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:',
    seguridadPuntos: [
      'Encriptación SSL/TLS para todas las comunicaciones',
      'Contraseñas hasheadas con algoritmos seguros',
      'Acceso restringido al personal autorizado',
      'Copias de seguridad regulares',
      'Monitorización continua de seguridad',
    ],
    seguridadConservacion:
      'Conservamos tus datos mientras mantengas tu cuenta activa. Si decides eliminar tu cuenta, borraremos tu información en un plazo máximo de 30 días.',
    derechosTitulo: '5. Tus Derechos (RGPD)',
    derechosIntro:
      'Conforme al Reglamento General de Protección de Datos (RGPD), tienes los siguientes derechos:',
    derechosPuntos: [
      { etiqueta: 'Acceso:', texto: 'Solicitar una copia de todos tus datos personales.' },
      { etiqueta: 'Rectificación:', texto: 'Corregir datos inexactos o incompletos.' },
      {
        etiqueta: 'Supresión:',
        texto: 'Solicitar la eliminación de tus datos ("derecho al olvido").',
      },
      {
        etiqueta: 'Portabilidad:',
        texto: 'Recibir tus datos en un formato estructurado y legible.',
      },
      {
        etiqueta: 'Oposición:',
        texto: 'Oponerte al tratamiento de tus datos para ciertos fines.',
      },
      {
        etiqueta: 'Limitación:',
        texto: 'Solicitar la restricción del tratamiento de tus datos.',
      },
    ],
    derechosEjercicio: 'Para ejercer cualquiera de estos derechos, contacta con nosotros en',
    comparticionTitulo: '6. Compartición de Datos',
    comparticionIntro:
      'No vendemos ni alquilamos tus datos personales a terceros. Solo compartimos información en los siguientes casos:',
    comparticionPuntos: [
      'Con proveedores de servicios que nos ayudan a operar la plataforma (hosting, análisis)',
      'Cuando sea requerido por ley o autoridades competentes',
      'Con tu consentimiento explícito',
    ],
    contactoTitulo: '7. Contacto',
    contactoIntro:
      'Si tienes preguntas sobre esta política de privacidad o sobre el tratamiento de tus datos, puedes contactarnos en:',
    contactoEmailEtiqueta: 'Email:',
    contactoDireccionEtiqueta: 'Dirección:',
    contactoDireccion: 'Calle Fitness 123, 28001 Madrid, España',
    contactoDpoEtiqueta: 'Delegado de Protección de Datos:',
  },
  en: {
    tituloPagina: 'Privacy Policy',
    etiquetaFecha: 'Last updated:',
    fechaActualizacion: 'January 2025',
    introTitulo: '1. Introduction',
    introParrafo1:
      'At Cofira, we are committed to protecting your privacy and your personal data. This policy describes how we collect, use, store and protect the information you provide to us when using our fitness and nutrition platform.',
    introParrafo2:
      'By using Cofira, you agree to the practices described in this policy. We encourage you to read it carefully to understand how we handle your information.',
    datosTitulo: '2. Data We Collect',
    datosIntro: 'We collect different types of information in order to provide our services:',
    perfilTitulo: 'Profile information',
    perfilPuntos: [
      'First and last name',
      'Email address',
      'Date of birth',
      'Gender',
      'Profile picture (optional)',
    ],
    saludTitulo: 'Health and fitness metrics',
    saludPuntos: [
      'Weight and height',
      'Fitness goals (weight loss, muscle gain, etc.)',
      'Exercise and workout history',
      'Food and calorie logs',
      'Body measurements',
      'Progress photos (if you upload them)',
    ],
    tecnicaTitulo: 'Technical information',
    tecnicaPuntos: [
      'IP address',
      'Browser and device type',
      'Pages visited and time spent',
      'Application preferences',
    ],
    usoTitulo: '3. How We Use Your Data',
    usoIntro: 'We use your information to:',
    usoPuntos: [
      {
        etiqueta: 'Personalize your experience:',
        texto: 'Create training and nutrition plans tailored to your goals.',
      },
      {
        etiqueta: 'Track your progress:',
        texto: 'Generate charts and statistics about your evolution.',
      },
      {
        etiqueta: 'Communications:',
        texto: 'Send you reminders, updates and relevant content.',
      },
      {
        etiqueta: 'Service improvement:',
        texto: 'Analyze how the platform is used in order to implement improvements.',
      },
      {
        etiqueta: 'Technical support:',
        texto: 'Resolve questions and issues you may have.',
      },
    ],
    seguridadTitulo: '4. Storage and Security',
    seguridadIntro:
      'Your data is stored on secure servers located in the European Union. We implement technical and organizational security measures to protect your information:',
    seguridadPuntos: [
      'SSL/TLS encryption for all communications',
      'Passwords hashed with secure algorithms',
      'Access restricted to authorized personnel',
      'Regular backups',
      'Continuous security monitoring',
    ],
    seguridadConservacion:
      'We retain your data for as long as your account remains active. If you decide to delete your account, we will erase your information within a maximum of 30 days.',
    derechosTitulo: '5. Your Rights (GDPR)',
    derechosIntro:
      'Under the General Data Protection Regulation (GDPR), you have the following rights:',
    derechosPuntos: [
      { etiqueta: 'Access:', texto: 'Request a copy of all your personal data.' },
      { etiqueta: 'Rectification:', texto: 'Correct inaccurate or incomplete data.' },
      {
        etiqueta: 'Erasure:',
        texto: 'Request the deletion of your data ("right to be forgotten").',
      },
      {
        etiqueta: 'Portability:',
        texto: 'Receive your data in a structured, machine-readable format.',
      },
      {
        etiqueta: 'Objection:',
        texto: 'Object to the processing of your data for certain purposes.',
      },
      {
        etiqueta: 'Restriction:',
        texto: 'Request that the processing of your data be restricted.',
      },
    ],
    derechosEjercicio: 'To exercise any of these rights, contact us at',
    comparticionTitulo: '6. Data Sharing',
    comparticionIntro:
      'We do not sell or rent your personal data to third parties. We only share information in the following cases:',
    comparticionPuntos: [
      'With service providers that help us operate the platform (hosting, analytics)',
      'When required by law or by competent authorities',
      'With your explicit consent',
    ],
    contactoTitulo: '7. Contact',
    contactoIntro:
      'If you have any questions about this privacy policy or about the processing of your data, you can contact us at:',
    contactoEmailEtiqueta: 'Email:',
    contactoDireccionEtiqueta: 'Address:',
    contactoDireccion: 'Calle Fitness 123, 28001 Madrid, Spain',
    contactoDpoEtiqueta: 'Data Protection Officer:',
  },
};
