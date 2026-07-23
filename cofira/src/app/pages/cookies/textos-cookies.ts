import { CodigoIdioma } from '../../services/idioma.service';

/* Punto de lista con etiqueta en negrita: el template lo pinta como
   <strong>etiqueta</strong> texto, igual que el HTML original. */
interface PuntoDestacado {
  etiqueta: string;
  texto: string;
}

/* Igual que PuntoDestacado pero con enlace externo al final del punto */
interface PuntoConEnlace {
  etiqueta: string;
  texto: string;
  enlaceUrl: string;
  enlaceTexto: string;
}

/* Todos los textos visibles de la política de cookies, por idioma. La
   interfaz obliga a que ambas lenguas tengan exactamente las mismas claves. */
interface TextosCookies {
  tituloPagina: string;
  etiquetaFecha: string;
  fechaActualizacion: string;
  queSonTitulo: string;
  queSonParrafo1: string;
  queSonParrafo2: string;
  tiposTitulo: string;
  esencialesTitulo: string;
  esencialesTexto: string;
  esencialesPuntos: PuntoDestacado[];
  analiticasTitulo: string;
  analiticasTexto: string;
  analiticasPuntos: PuntoDestacado[];
  funcionalidadTitulo: string;
  funcionalidadTexto: string;
  funcionalidadPuntos: PuntoDestacado[];
  marketingTitulo: string;
  marketingTexto: string;
  marketingPuntos: PuntoDestacado[];
  duracionTitulo: string;
  duracionIntro: string;
  duracionTipos: PuntoDestacado[];
  duracionExpiraIntro: string;
  duracionExpiraPuntos: string[];
  gestionTitulo: string;
  gestionIntro: string;
  panelTitulo: string;
  panelTexto: string;
  navegadorTitulo: string;
  navegadorTexto: string;
  navegadorPuntos: PuntoDestacado[];
  gestionNotaEtiqueta: string;
  gestionNotaTexto: string;
  tercerosTitulo: string;
  tercerosIntro: string;
  tercerosPuntos: PuntoConEnlace[];
  actualizacionesTitulo: string;
  actualizacionesParrafo1: string;
  actualizacionesParrafo2: string;
  contactoTitulo: string;
  contactoIntro: string;
  contactoEmailEtiqueta: string;
  contactoDireccionEtiqueta: string;
  contactoDireccion: string;
}

export const TEXTOS_COOKIES: Record<CodigoIdioma, TextosCookies> = {
  es: {
    tituloPagina: 'Política de Cookies',
    etiquetaFecha: 'Última actualización:',
    fechaActualizacion: 'Enero 2025',
    queSonTitulo: '1. ¿Qué son las Cookies?',
    queSonParrafo1:
      'Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, tablet o móvil) cuando visitas un sitio web. Estas cookies permiten que el sitio recuerde tus acciones y preferencias durante un período de tiempo, para que no tengas que volver a introducirlos cada vez que vuelvas al sitio o navegues de una página a otra.',
    queSonParrafo2:
      'En Cofira utilizamos cookies para mejorar tu experiencia de usuario, recordar tus preferencias y analizar cómo utilizas nuestra plataforma de fitness y nutrición.',
    tiposTitulo: '2. Tipos de Cookies que Utilizamos',
    esencialesTitulo: 'Cookies Esenciales',
    esencialesTexto:
      'Son necesarias para el funcionamiento básico de la plataforma. Sin estas cookies, servicios como el inicio de sesión, el guardado de tus entrenamientos o el registro de comidas no funcionarían correctamente.',
    esencialesPuntos: [
      { etiqueta: 'session_id:', texto: 'Mantiene tu sesión activa mientras usas Cofira' },
      { etiqueta: 'csrf_token:', texto: 'Protege contra ataques de falsificación de solicitudes' },
      { etiqueta: 'user_preferences:', texto: 'Guarda tu configuración de idioma y tema' },
    ],
    analiticasTitulo: 'Cookies de Rendimiento y Analíticas',
    analiticasTexto:
      'Nos ayudan a entender cómo los usuarios interactúan con Cofira, permitiéndonos mejorar continuamente la plataforma.',
    analiticasPuntos: [
      { etiqueta: '_ga, _gid:', texto: 'Google Analytics para estadísticas de uso' },
      { etiqueta: '_cofira_analytics:', texto: 'Análisis interno de funcionalidades más usadas' },
    ],
    funcionalidadTitulo: 'Cookies de Funcionalidad',
    funcionalidadTexto:
      'Permiten recordar las elecciones que haces para proporcionarte una experiencia más personalizada.',
    funcionalidadPuntos: [
      { etiqueta: 'theme_preference:', texto: 'Recuerda si prefieres modo claro u oscuro' },
      {
        etiqueta: 'workout_settings:',
        texto: 'Guarda tus preferencias de visualización de entrenamientos',
      },
      {
        etiqueta: 'nutrition_units:',
        texto: 'Recuerda tus unidades de medida preferidas (kcal, kJ)',
      },
    ],
    marketingTitulo: 'Cookies de Marketing',
    marketingTexto:
      'Utilizamos un número limitado de cookies de marketing para mostrar contenido relevante. Puedes desactivarlas sin afectar la funcionalidad principal de Cofira.',
    marketingPuntos: [
      { etiqueta: '_fbp:', texto: 'Facebook Pixel para campañas publicitarias' },
      {
        etiqueta: 'newsletter_shown:',
        texto: 'Evita mostrar repetidamente el popup de newsletter',
      },
    ],
    duracionTitulo: '3. Duración de las Cookies',
    duracionIntro: 'Las cookies pueden ser de dos tipos según su duración:',
    duracionTipos: [
      {
        etiqueta: 'Cookies de sesión:',
        texto:
          'Se eliminan automáticamente cuando cierras el navegador. Las utilizamos principalmente para mantener tu sesión activa.',
      },
      {
        etiqueta: 'Cookies persistentes:',
        texto:
          'Permanecen en tu dispositivo durante un período determinado o hasta que las elimines manualmente. Las usamos para recordar tus preferencias.',
      },
    ],
    duracionExpiraIntro: 'Tiempos de expiración de nuestras cookies principales:',
    duracionExpiraPuntos: [
      'Cookies esenciales: Sesión o hasta 24 horas',
      'Cookies analíticas: Hasta 2 años',
      'Cookies de funcionalidad: Hasta 1 año',
      'Cookies de marketing: Hasta 90 días',
    ],
    gestionTitulo: '4. Cómo Gestionar las Cookies',
    gestionIntro: 'Tienes varias opciones para gestionar las cookies en Cofira:',
    panelTitulo: 'Panel de preferencias de Cofira',
    panelTexto:
      'Puedes acceder a nuestro panel de configuración de cookies en cualquier momento desde el menú de tu perfil. Allí podrás activar o desactivar categorías específicas de cookies.',
    navegadorTitulo: 'Configuración del navegador',
    navegadorTexto:
      'También puedes gestionar las cookies a través de la configuración de tu navegador:',
    navegadorPuntos: [
      { etiqueta: 'Chrome:', texto: 'Configuración → Privacidad y seguridad → Cookies' },
      { etiqueta: 'Firefox:', texto: 'Opciones → Privacidad y seguridad → Cookies' },
      { etiqueta: 'Safari:', texto: 'Preferencias → Privacidad → Cookies' },
      { etiqueta: 'Edge:', texto: 'Configuración → Cookies y permisos del sitio' },
    ],
    gestionNotaEtiqueta: 'Nota importante:',
    gestionNotaTexto:
      'Si desactivas las cookies esenciales, algunas funcionalidades de Cofira pueden no funcionar correctamente. Por ejemplo, no podrás mantener tu sesión iniciada o guardar tus entrenamientos.',
    tercerosTitulo: '5. Cookies de Terceros',
    tercerosIntro:
      'Algunos servicios de terceros que utilizamos en Cofira pueden establecer sus propias cookies:',
    tercerosPuntos: [
      {
        etiqueta: 'Google Analytics:',
        texto: 'Para análisis de tráfico web.',
        enlaceUrl: 'https://policies.google.com/privacy',
        enlaceTexto: 'Política de privacidad de Google',
      },
      {
        etiqueta: 'Stripe:',
        texto: 'Para procesamiento seguro de pagos.',
        enlaceUrl: 'https://stripe.com/privacy',
        enlaceTexto: 'Política de privacidad de Stripe',
      },
      {
        etiqueta: 'Cloudflare:',
        texto: 'Para seguridad y rendimiento de la plataforma.',
        enlaceUrl: 'https://www.cloudflare.com/privacypolicy/',
        enlaceTexto: 'Política de privacidad de Cloudflare',
      },
    ],
    actualizacionesTitulo: '6. Actualizaciones de esta Política',
    actualizacionesParrafo1:
      'Podemos actualizar esta política de cookies periódicamente para reflejar cambios en las cookies que utilizamos o por otros motivos operativos, legales o regulatorios.',
    actualizacionesParrafo2:
      'Te recomendamos revisar esta página regularmente para estar informado sobre nuestro uso de cookies. La fecha de la última actualización se indica al inicio de este documento.',
    contactoTitulo: '7. Contacto',
    contactoIntro: 'Si tienes preguntas sobre nuestra política de cookies, puedes contactarnos en:',
    contactoEmailEtiqueta: 'Email:',
    contactoDireccionEtiqueta: 'Dirección:',
    contactoDireccion: 'Calle Fitness 123, 28001 Madrid, España',
  },
  en: {
    tituloPagina: 'Cookie Policy',
    etiquetaFecha: 'Last updated:',
    fechaActualizacion: 'January 2025',
    queSonTitulo: '1. What Are Cookies?',
    queSonParrafo1:
      'Cookies are small text files that are stored on your device (computer, tablet or mobile) when you visit a website. These cookies allow the site to remember your actions and preferences over a period of time, so you do not have to enter them again every time you return to the site or browse from one page to another.',
    queSonParrafo2:
      'At Cofira we use cookies to improve your user experience, remember your preferences and analyze how you use our fitness and nutrition platform.',
    tiposTitulo: '2. Types of Cookies We Use',
    esencialesTitulo: 'Essential Cookies',
    esencialesTexto:
      'These are necessary for the basic operation of the platform. Without these cookies, services such as logging in, saving your workouts or logging meals would not work properly.',
    esencialesPuntos: [
      { etiqueta: 'session_id:', texto: 'Keeps your session active while you use Cofira' },
      { etiqueta: 'csrf_token:', texto: 'Protects against request forgery attacks' },
      { etiqueta: 'user_preferences:', texto: 'Stores your language and theme settings' },
    ],
    analiticasTitulo: 'Performance and Analytics Cookies',
    analiticasTexto:
      'They help us understand how users interact with Cofira, allowing us to continuously improve the platform.',
    analiticasPuntos: [
      { etiqueta: '_ga, _gid:', texto: 'Google Analytics for usage statistics' },
      { etiqueta: '_cofira_analytics:', texto: 'Internal analysis of the most used features' },
    ],
    funcionalidadTitulo: 'Functionality Cookies',
    funcionalidadTexto:
      'They allow us to remember the choices you make in order to provide you with a more personalized experience.',
    funcionalidadPuntos: [
      { etiqueta: 'theme_preference:', texto: 'Remembers whether you prefer light or dark mode' },
      { etiqueta: 'workout_settings:', texto: 'Stores your workout display preferences' },
      {
        etiqueta: 'nutrition_units:',
        texto: 'Remembers your preferred measurement units (kcal, kJ)',
      },
    ],
    marketingTitulo: 'Marketing Cookies',
    marketingTexto:
      'We use a limited number of marketing cookies to show relevant content. You can disable them without affecting the core functionality of Cofira.',
    marketingPuntos: [
      { etiqueta: '_fbp:', texto: 'Facebook Pixel for advertising campaigns' },
      {
        etiqueta: 'newsletter_shown:',
        texto: 'Prevents the newsletter popup from being shown repeatedly',
      },
    ],
    duracionTitulo: '3. Cookie Duration',
    duracionIntro: 'Cookies can be of two types depending on their duration:',
    duracionTipos: [
      {
        etiqueta: 'Session cookies:',
        texto:
          'They are automatically deleted when you close your browser. We mainly use them to keep your session active.',
      },
      {
        etiqueta: 'Persistent cookies:',
        texto:
          'They remain on your device for a set period or until you delete them manually. We use them to remember your preferences.',
      },
    ],
    duracionExpiraIntro: 'Expiration times of our main cookies:',
    duracionExpiraPuntos: [
      'Essential cookies: Session or up to 24 hours',
      'Analytics cookies: Up to 2 years',
      'Functionality cookies: Up to 1 year',
      'Marketing cookies: Up to 90 days',
    ],
    gestionTitulo: '4. How to Manage Cookies',
    gestionIntro: 'You have several options to manage cookies on Cofira:',
    panelTitulo: 'Cofira preferences panel',
    panelTexto:
      'You can access our cookie settings panel at any time from your profile menu. There you can enable or disable specific categories of cookies.',
    navegadorTitulo: 'Browser settings',
    navegadorTexto: 'You can also manage cookies through your browser settings:',
    navegadorPuntos: [
      { etiqueta: 'Chrome:', texto: 'Settings → Privacy and security → Cookies' },
      { etiqueta: 'Firefox:', texto: 'Options → Privacy & Security → Cookies' },
      { etiqueta: 'Safari:', texto: 'Preferences → Privacy → Cookies' },
      { etiqueta: 'Edge:', texto: 'Settings → Cookies and site permissions' },
    ],
    gestionNotaEtiqueta: 'Important note:',
    gestionNotaTexto:
      'If you disable essential cookies, some Cofira features may not work properly. For example, you will not be able to stay logged in or save your workouts.',
    tercerosTitulo: '5. Third-Party Cookies',
    tercerosIntro: 'Some third-party services we use on Cofira may set their own cookies:',
    tercerosPuntos: [
      {
        etiqueta: 'Google Analytics:',
        texto: 'For web traffic analysis.',
        enlaceUrl: 'https://policies.google.com/privacy',
        enlaceTexto: 'Google privacy policy',
      },
      {
        etiqueta: 'Stripe:',
        texto: 'For secure payment processing.',
        enlaceUrl: 'https://stripe.com/privacy',
        enlaceTexto: 'Stripe privacy policy',
      },
      {
        etiqueta: 'Cloudflare:',
        texto: 'For platform security and performance.',
        enlaceUrl: 'https://www.cloudflare.com/privacypolicy/',
        enlaceTexto: 'Cloudflare privacy policy',
      },
    ],
    actualizacionesTitulo: '6. Updates to This Policy',
    actualizacionesParrafo1:
      'We may update this cookie policy from time to time to reflect changes in the cookies we use or for other operational, legal or regulatory reasons.',
    actualizacionesParrafo2:
      'We recommend that you review this page regularly to stay informed about our use of cookies. The date of the last update is indicated at the top of this document.',
    contactoTitulo: '7. Contact',
    contactoIntro: 'If you have any questions about our cookie policy, you can contact us at:',
    contactoEmailEtiqueta: 'Email:',
    contactoDireccionEtiqueta: 'Address:',
    contactoDireccion: 'Calle Fitness 123, 28001 Madrid, Spain',
  },
};
