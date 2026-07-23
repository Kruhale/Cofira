import { CodigoIdioma } from '../../services/idioma.service';

/* Punto de lista con etiqueta en negrita: el template lo pinta como
   <strong>etiqueta</strong> texto, igual que el HTML original. */
interface PuntoDestacado {
  etiqueta: string;
  texto: string;
}

/* Todos los textos visibles de los términos de servicio, por idioma. La
   interfaz obliga a que ambas lenguas tengan exactamente las mismas claves. */
interface TextosTerminos {
  tituloPagina: string;
  etiquetaFecha: string;
  fechaActualizacion: string;
  aceptacionTitulo: string;
  aceptacionParrafo1: string;
  aceptacionParrafo2: string;
  servicioTitulo: string;
  servicioIntro: string;
  servicioPuntos: PuntoDestacado[];
  cuentaTitulo: string;
  cuentaIntro: string;
  cuentaPuntos: string[];
  cuentaSuspension: string;
  usoTitulo: string;
  usoIntro: string;
  usoPuntos: string[];
  propiedadTitulo: string;
  propiedadParrafo1: string;
  propiedadParrafo2: string;
  propiedadPuntos: string[];
  responsabilidadTitulo: string;
  responsabilidadAvisoEtiqueta: string;
  responsabilidadAvisoTexto: string;
  responsabilidadPuntos: string[];
  responsabilidadLimite: string;
  pagosTitulo: string;
  pagosIntro: string;
  pagosPuntos: string[];
  modificacionesTitulo: string;
  modificacionesTexto: string;
  leyTitulo: string;
  leyTexto: string;
  contactoTitulo: string;
  contactoIntro: string;
  contactoEmailEtiqueta: string;
  contactoDireccionEtiqueta: string;
  contactoDireccion: string;
}

export const TEXTOS_TERMINOS: Record<CodigoIdioma, TextosTerminos> = {
  es: {
    tituloPagina: 'Términos de Servicio',
    etiquetaFecha: 'Última actualización:',
    fechaActualizacion: 'Enero 2025',
    aceptacionTitulo: '1. Aceptación de los Términos',
    aceptacionParrafo1:
      'Al acceder y utilizar Cofira, aceptas estar sujeto a estos Términos de Servicio y a nuestra Política de Privacidad. Si no estás de acuerdo con alguno de estos términos, te rogamos que no utilices nuestra plataforma.',
    aceptacionParrafo2:
      'Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios significativos a través de la plataforma o por correo electrónico.',
    servicioTitulo: '2. Descripción del Servicio',
    servicioIntro: 'Cofira es una plataforma digital de fitness y nutrición que ofrece:',
    servicioPuntos: [
      {
        etiqueta: 'Planificación de entrenamientos:',
        texto: 'Rutinas de ejercicios personalizadas de hasta 7 días.',
      },
      {
        etiqueta: 'Gestión nutricional:',
        texto: 'Planes de alimentación con hasta 7 comidas diarias y asesoría personalizada.',
      },
      {
        etiqueta: 'Seguimiento de progreso:',
        texto: 'Gráficos avanzados, fotos de progreso, registro de peso y medidas corporales.',
      },
      {
        etiqueta: 'Herramientas adicionales:',
        texto:
          'Control de ayuno intermitente, registro de consumo de agua, widgets personalizables.',
      },
    ],
    cuentaTitulo: '3. Registro y Cuenta',
    cuentaIntro:
      'Para utilizar Cofira, debes crear una cuenta proporcionando información veraz y actualizada. Eres responsable de:',
    cuentaPuntos: [
      'Mantener la confidencialidad de tu contraseña',
      'Todas las actividades que ocurran bajo tu cuenta',
      'Notificarnos inmediatamente cualquier uso no autorizado',
      'Asegurarte de tener al menos 16 años de edad',
    ],
    cuentaSuspension:
      'Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos.',
    usoTitulo: '4. Uso Aceptable',
    usoIntro: 'Al utilizar Cofira, te comprometes a NO:',
    usoPuntos: [
      'Usar la plataforma para fines ilegales o no autorizados',
      'Compartir tu cuenta con terceros',
      'Intentar acceder a áreas restringidas del sistema',
      'Distribuir virus, malware o código malicioso',
      'Realizar ingeniería inversa del software',
      'Suplantar la identidad de otras personas',
      'Publicar contenido ofensivo, difamatorio o que viole derechos de terceros',
      'Utilizar bots o sistemas automatizados sin autorización',
    ],
    propiedadTitulo: '5. Propiedad Intelectual',
    propiedadParrafo1:
      'Todo el contenido de Cofira, incluyendo pero no limitado a textos, gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales y software, es propiedad de Cofira o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual.',
    propiedadParrafo2:
      'Se te concede una licencia limitada, no exclusiva y no transferible para usar la plataforma de acuerdo con estos términos. Esta licencia no incluye el derecho a:',
    propiedadPuntos: [
      'Modificar o copiar los materiales',
      'Usar los materiales para fines comerciales',
      'Eliminar marcas de propiedad o copyright',
      'Transferir los materiales a terceros',
    ],
    responsabilidadTitulo: '6. Limitación de Responsabilidad',
    responsabilidadAvisoEtiqueta: 'Importante:',
    responsabilidadAvisoTexto:
      'Cofira es una herramienta de apoyo para el fitness y la nutrición, pero NO sustituye el consejo médico profesional.',
    responsabilidadPuntos: [
      'Antes de comenzar cualquier programa de ejercicios o dieta, consulta con un profesional de la salud.',
      'No somos responsables de lesiones o problemas de salud derivados del uso de nuestras recomendaciones.',
      'Los resultados pueden variar según cada persona y no garantizamos resultados específicos.',
      'La información nutricional proporcionada es orientativa y puede contener inexactitudes.',
    ],
    responsabilidadLimite:
      'En la máxima medida permitida por la ley, Cofira no será responsable de daños indirectos, incidentales, especiales o consecuentes derivados del uso de la plataforma.',
    pagosTitulo: '7. Suscripciones y Pagos',
    pagosIntro: 'Cofira ofrece diferentes planes de suscripción. Al suscribirte:',
    pagosPuntos: [
      'Autorizas el cobro recurrente según el plan elegido',
      'Puedes cancelar tu suscripción en cualquier momento desde tu perfil',
      'Los reembolsos se procesan según nuestra política de devoluciones',
      'Los precios pueden cambiar con previo aviso de 30 días',
    ],
    modificacionesTitulo: '8. Modificaciones del Servicio',
    modificacionesTexto:
      'Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio en cualquier momento, con o sin previo aviso. No seremos responsables ante ti o terceros por cualquier modificación, suspensión o discontinuación del servicio.',
    leyTitulo: '9. Ley Aplicable',
    leyTexto:
      'Estos términos se regirán e interpretarán de acuerdo con las leyes de España. Cualquier disputa será sometida a la jurisdicción exclusiva de los tribunales de Madrid.',
    contactoTitulo: '10. Contacto',
    contactoIntro:
      'Para cualquier pregunta sobre estos Términos de Servicio, puedes contactarnos en:',
    contactoEmailEtiqueta: 'Email:',
    contactoDireccionEtiqueta: 'Dirección:',
    contactoDireccion: 'Calle Fitness 123, 28001 Madrid, España',
  },
  en: {
    tituloPagina: 'Terms of Service',
    etiquetaFecha: 'Last updated:',
    fechaActualizacion: 'January 2025',
    aceptacionTitulo: '1. Acceptance of the Terms',
    aceptacionParrafo1:
      'By accessing and using Cofira, you agree to be bound by these Terms of Service and by our Privacy Policy. If you do not agree with any of these terms, please do not use our platform.',
    aceptacionParrafo2:
      'We reserve the right to modify these terms at any time. We will notify you of significant changes through the platform or by email.',
    servicioTitulo: '2. Description of the Service',
    servicioIntro: 'Cofira is a digital fitness and nutrition platform that offers:',
    servicioPuntos: [
      {
        etiqueta: 'Workout planning:',
        texto: 'Personalized exercise routines of up to 7 days.',
      },
      {
        etiqueta: 'Nutrition management:',
        texto: 'Meal plans with up to 7 daily meals and personalized guidance.',
      },
      {
        etiqueta: 'Progress tracking:',
        texto: 'Advanced charts, progress photos, weight and body measurement logs.',
      },
      {
        etiqueta: 'Additional tools:',
        texto: 'Intermittent fasting control, water intake logging, customizable widgets.',
      },
    ],
    cuentaTitulo: '3. Registration and Account',
    cuentaIntro:
      'To use Cofira, you must create an account providing truthful and up-to-date information. You are responsible for:',
    cuentaPuntos: [
      'Maintaining the confidentiality of your password',
      'All activities that occur under your account',
      'Notifying us immediately of any unauthorized use',
      'Ensuring that you are at least 16 years old',
    ],
    cuentaSuspension:
      'We reserve the right to suspend or terminate accounts that violate these terms.',
    usoTitulo: '4. Acceptable Use',
    usoIntro: 'By using Cofira, you agree NOT to:',
    usoPuntos: [
      'Use the platform for illegal or unauthorized purposes',
      'Share your account with third parties',
      'Attempt to access restricted areas of the system',
      'Distribute viruses, malware or malicious code',
      'Reverse engineer the software',
      'Impersonate other people',
      'Post content that is offensive, defamatory or infringes third-party rights',
      'Use bots or automated systems without authorization',
    ],
    propiedadTitulo: '5. Intellectual Property',
    propiedadParrafo1:
      'All Cofira content, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads and software, is the property of Cofira or its content providers and is protected by intellectual property laws.',
    propiedadParrafo2:
      'You are granted a limited, non-exclusive, non-transferable license to use the platform in accordance with these terms. This license does not include the right to:',
    propiedadPuntos: [
      'Modify or copy the materials',
      'Use the materials for commercial purposes',
      'Remove proprietary or copyright notices',
      'Transfer the materials to third parties',
    ],
    responsabilidadTitulo: '6. Limitation of Liability',
    responsabilidadAvisoEtiqueta: 'Important:',
    responsabilidadAvisoTexto:
      'Cofira is a support tool for fitness and nutrition, but it does NOT replace professional medical advice.',
    responsabilidadPuntos: [
      'Before starting any exercise program or diet, consult a healthcare professional.',
      'We are not responsible for injuries or health problems arising from the use of our recommendations.',
      'Results may vary from person to person and we do not guarantee specific results.',
      'The nutritional information provided is indicative and may contain inaccuracies.',
    ],
    responsabilidadLimite:
      'To the maximum extent permitted by law, Cofira shall not be liable for indirect, incidental, special or consequential damages arising from the use of the platform.',
    pagosTitulo: '7. Subscriptions and Payments',
    pagosIntro: 'Cofira offers different subscription plans. By subscribing:',
    pagosPuntos: [
      'You authorize recurring charges according to the chosen plan',
      'You can cancel your subscription at any time from your profile',
      'Refunds are processed in accordance with our refund policy',
      'Prices may change with 30 days prior notice',
    ],
    modificacionesTitulo: '8. Changes to the Service',
    modificacionesTexto:
      'We reserve the right to modify, suspend or discontinue any aspect of the service at any time, with or without notice. We shall not be liable to you or to any third party for any modification, suspension or discontinuation of the service.',
    leyTitulo: '9. Governing Law',
    leyTexto:
      'These terms shall be governed by and construed in accordance with the laws of Spain. Any dispute shall be submitted to the exclusive jurisdiction of the courts of Madrid.',
    contactoTitulo: '10. Contact',
    contactoIntro: 'For any questions about these Terms of Service, you can contact us at:',
    contactoEmailEtiqueta: 'Email:',
    contactoDireccionEtiqueta: 'Address:',
    contactoDireccion: 'Calle Fitness 123, 28001 Madrid, Spain',
  },
};
