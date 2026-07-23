import { CodigoIdioma } from '../../services/idioma.service';

interface InfoContacto {
  icono: string;
  titulo: string;
  valor: string;
  enlace?: string;
}

interface Horario {
  dia: string;
  horario: string;
}

interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

/* Todos los textos visibles de la página (formulario, datos de contacto y FAQ),
   por idioma. La interfaz obliga a que ambas lenguas tengan las mismas claves. */
interface TextosContacto {
  titulo: string;
  subtitulo: string;
  formTitulo: string;
  labelNombre: string;
  placeholderNombre: string;
  labelEmail: string;
  placeholderEmail: string;
  labelAsunto: string;
  opcionAsuntoDefecto: string;
  opcionSoporte: string;
  opcionFacturacion: string;
  opcionSugerencia: string;
  opcionColaboracion: string;
  opcionOtro: string;
  labelMensaje: string;
  placeholderMensaje: string;
  botonEnviar: string;
  infoTitulo: string;
  infoContacto: InfoContacto[];
  horariosTitulo: string;
  horarios: Horario[];
  faqTitulo: string;
  faqs: PreguntaFrecuente[];
  exitoEnvio: string;
}

export const TEXTOS_CONTACTO: Record<CodigoIdioma, TextosContacto> = {
  es: {
    titulo: 'Contacta con nosotros',
    subtitulo:
      '¿Tienes alguna pregunta? Estamos aquí para ayudarte. Respondo en menos de 24 horas.',
    formTitulo: 'Envíanos un mensaje',
    labelNombre: 'Nombre completo',
    placeholderNombre: 'Tu nombre',
    labelEmail: 'Email',
    placeholderEmail: 'tu@email.com',
    labelAsunto: 'Asunto',
    opcionAsuntoDefecto: 'Selecciona un asunto',
    opcionSoporte: 'Soporte técnico',
    opcionFacturacion: 'Facturación',
    opcionSugerencia: 'Sugerencia',
    opcionColaboracion: 'Colaboración',
    opcionOtro: 'Otro',
    labelMensaje: 'Mensaje',
    placeholderMensaje: 'Cuéntanos en qué podemos ayudarte...',
    botonEnviar: 'Enviar mensaje',
    infoTitulo: 'Información de contacto',
    infoContacto: [
      {
        icono: 'mail',
        titulo: 'Email General',
        valor: 'info@cofira.com',
        enlace: 'mailto:info@cofira.com',
      },
      {
        icono: 'headphones',
        titulo: 'Soporte Técnico',
        valor: 'soporte@cofira.com',
        enlace: 'mailto:soporte@cofira.com',
      },
      {
        icono: 'phone',
        titulo: 'Teléfono',
        valor: '+34 900 123 456',
        enlace: 'tel:+34900123456',
      },
      {
        icono: 'map',
        titulo: 'Dirección',
        valor: 'Calle Fitness 123, 28001 Madrid, España',
      },
    ],
    horariosTitulo: 'Horario de atención',
    horarios: [
      { dia: 'Lunes - Viernes', horario: '9:00 - 20:00' },
      { dia: 'Sábados', horario: '10:00 - 14:00' },
      { dia: 'Domingos', horario: 'Cerrado' },
    ],
    faqTitulo: 'Preguntas Frecuentes',
    faqs: [
      {
        pregunta: '¿Cómo puedo cancelar mi suscripción?',
        respuesta:
          'Puedes cancelar tu suscripción en cualquier momento desde la sección "Mi cuenta" > "Suscripción". El acceso permanecerá activo hasta el final del período facturado.',
      },
      {
        pregunta: '¿Ofrecen planes personalizados?',
        respuesta:
          'Sí, todos nuestros planes de entrenamiento y nutrición se adaptan a tus objetivos, nivel de experiencia y preferencias alimentarias.',
      },
      {
        pregunta: '¿Puedo usar Cofira sin conexión?',
        respuesta:
          'Sí, puedes descargar tus entrenamientos y planes de comidas para acceder a ellos sin conexión desde nuestra app móvil.',
      },
      {
        pregunta: '¿Tienen garantía de devolución?',
        respuesta:
          'Ofrecemos 30 días de garantía de devolución en todos nuestros planes premium. Si no estás satisfecho, te devolvemos el dinero sin preguntas.',
      },
    ],
    exitoEnvio: '¡Mensaje enviado! Te responderemos pronto.',
  },
  en: {
    titulo: 'Get in touch',
    subtitulo: "Have a question? We're here to help. You'll hear back within 24 hours.",
    formTitulo: 'Send us a message',
    labelNombre: 'Full name',
    placeholderNombre: 'Your name',
    labelEmail: 'Email',
    placeholderEmail: 'you@email.com',
    labelAsunto: 'Subject',
    opcionAsuntoDefecto: 'Choose a subject',
    opcionSoporte: 'Technical support',
    opcionFacturacion: 'Billing',
    opcionSugerencia: 'Suggestion',
    opcionColaboracion: 'Partnership',
    opcionOtro: 'Other',
    labelMensaje: 'Message',
    placeholderMensaje: 'Tell us how we can help...',
    botonEnviar: 'Send message',
    infoTitulo: 'Contact information',
    infoContacto: [
      {
        icono: 'mail',
        titulo: 'General email',
        valor: 'info@cofira.com',
        enlace: 'mailto:info@cofira.com',
      },
      {
        icono: 'headphones',
        titulo: 'Technical support',
        valor: 'soporte@cofira.com',
        enlace: 'mailto:soporte@cofira.com',
      },
      {
        icono: 'phone',
        titulo: 'Phone',
        valor: '+34 900 123 456',
        enlace: 'tel:+34900123456',
      },
      {
        icono: 'map',
        titulo: 'Address',
        valor: 'Calle Fitness 123, 28001 Madrid, Spain',
      },
    ],
    horariosTitulo: 'Support hours',
    horarios: [
      { dia: 'Monday - Friday', horario: '9:00 - 20:00' },
      { dia: 'Saturdays', horario: '10:00 - 14:00' },
      { dia: 'Sundays', horario: 'Closed' },
    ],
    faqTitulo: 'Frequently Asked Questions',
    faqs: [
      {
        pregunta: 'How do I cancel my subscription?',
        respuesta:
          'You can cancel your subscription anytime from "My account" > "Subscription". Your access stays active until the end of the billed period.',
      },
      {
        pregunta: 'Do you offer personalized plans?',
        respuesta:
          'Yes — every training and nutrition plan adapts to your goals, experience level and dietary preferences.',
      },
      {
        pregunta: 'Can I use Cofira offline?',
        respuesta:
          'Yes, you can download your workouts and meal plans and access them offline from our mobile app.',
      },
      {
        pregunta: 'Do you have a money-back guarantee?',
        respuesta:
          "All premium plans come with a 30-day money-back guarantee. If you're not happy, you get your money back, no questions asked.",
      },
    ],
    exitoEnvio: "Message sent! We'll get back to you soon.",
  },
};
