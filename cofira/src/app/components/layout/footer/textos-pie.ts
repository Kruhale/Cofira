import { CodigoIdioma } from '../../../services/idioma.service';

/* Todos los textos visibles (y aria-labels) del pie, por idioma. La interfaz
   obliga a que ambas lenguas tengan exactamente las mismas claves. */
interface TextosPie {
  ctaEyebrow: string;
  ctaTitulo: string;
  ctaAcento: string;
  newsletterTexto: string;
  newsletterEtiqueta: string;
  newsletterPlaceholder: string;
  newsletterBoton: string;
  newsletterNota: string;
  ariaLogo: string;
  descripcion: string;
  appPreApple: string;
  appPreGoogle: string;
  ariaAppStore: string;
  ariaGooglePlay: string;
  navProducto: string;
  enlaceNutricion: string;
  enlaceEjercicio: string;
  enlaceSeguimiento: string;
  navCompania: string;
  enlaceSobreNosotros: string;
  enlaceBlog: string;
  enlaceContacto: string;
  navLegal: string;
  enlacePrivacidad: string;
  enlaceTerminos: string;
  enlaceCookies: string;
  enlaceLicencias: string;
  contactoTitulo: string;
  contactoEscribenos: string;
  contactoDireccionLinea2: string;
  estadoSoporte: string;
  ariaPulso: string;
  pulsoCaption: string;
  pulsoLector: string;
  pulsoSub: string;
  pulsoSemanaEtiqueta: string;
  pulsoSemanaSub: string;
  copyright: string;
  ariaEnlacesLegales: string;
  legalPrivacidad: string;
  legalTerminos: string;
  legalCookies: string;
  ariaCambiarIdioma: string;
  ariaTemaClaro: string;
  ariaTemaOscuro: string;
}

export const TEXTOS_PIE: Record<CodigoIdioma, TextosPie> = {
  es: {
    ctaEyebrow: 'Empieza hoy',
    ctaTitulo: 'Tu mejor versión,',
    ctaAcento: 'sin excusas.',
    newsletterTexto: 'Recibe rutinas y tips cada semana. Sin spam.',
    newsletterEtiqueta: 'Tu email',
    newsletterPlaceholder: 'tu@email.com',
    newsletterBoton: 'Únete',
    newsletterNota: 'Cancela cuando quieras.',
    ariaLogo: 'Cofira - inicio',
    descripcion:
      'Tu plataforma integral para entrenamiento, nutrición y seguimiento de progreso. Alcanza tus metas de salud y fitness.',
    appPreApple: 'Descárgalo en',
    appPreGoogle: 'Disponible en',
    ariaAppStore: 'Descárgalo en el App Store',
    ariaGooglePlay: 'Disponible en Google Play',
    navProducto: 'Producto',
    enlaceNutricion: 'Nutrición',
    enlaceEjercicio: 'Ejercicio',
    enlaceSeguimiento: 'Seguimiento',
    navCompania: 'Compañía',
    enlaceSobreNosotros: 'Sobre Nosotros',
    enlaceBlog: 'Blog',
    enlaceContacto: 'Contacto',
    navLegal: 'Legal',
    enlacePrivacidad: 'Privacidad',
    enlaceTerminos: 'Términos',
    enlaceCookies: 'Cookies',
    enlaceLicencias: 'Licencias',
    contactoTitulo: 'Hablemos',
    contactoEscribenos: 'Escríbenos',
    contactoDireccionLinea2: '28013 Madrid, España',
    estadoSoporte: 'Soporte en línea',
    ariaPulso: 'Comunidad Cofira en vivo',
    pulsoCaption: 'Comunidad Cofira · En vivo',
    pulsoLector: 'Más de 24.000 personas entrenando ahora en la comunidad.',
    pulsoSub: 'Entrenando ahora',
    pulsoSemanaEtiqueta: 'Esta semana',
    pulsoSemanaSub: 'nuevas altas',
    copyright: 'Cofira. Todos los derechos reservados.',
    ariaEnlacesLegales: 'Enlaces legales',
    legalPrivacidad: 'Política de Privacidad',
    legalTerminos: 'Términos de Servicio',
    legalCookies: 'Cookies',
    ariaCambiarIdioma: 'Cambiar idioma',
    ariaTemaClaro: 'Activar modo claro',
    ariaTemaOscuro: 'Activar modo oscuro',
  },
  en: {
    ctaEyebrow: 'Start today',
    ctaTitulo: 'Your best self,',
    ctaAcento: 'no excuses.',
    newsletterTexto: 'Get routines and tips every week. No spam.',
    newsletterEtiqueta: 'Your email',
    newsletterPlaceholder: 'you@email.com',
    newsletterBoton: 'Join',
    newsletterNota: 'Cancel anytime.',
    ariaLogo: 'Cofira - home',
    descripcion:
      'Your all-in-one platform for training, nutrition and progress tracking. Reach your health and fitness goals.',
    appPreApple: 'Download on the',
    appPreGoogle: 'Get it on',
    ariaAppStore: 'Download on the App Store',
    ariaGooglePlay: 'Get it on Google Play',
    navProducto: 'Product',
    enlaceNutricion: 'Nutrition',
    enlaceEjercicio: 'Training',
    enlaceSeguimiento: 'Tracking',
    navCompania: 'Company',
    enlaceSobreNosotros: 'About Us',
    enlaceBlog: 'Blog',
    enlaceContacto: 'Contact',
    navLegal: 'Legal',
    enlacePrivacidad: 'Privacy',
    enlaceTerminos: 'Terms',
    enlaceCookies: 'Cookies',
    enlaceLicencias: 'Licenses',
    contactoTitulo: "Let's talk",
    contactoEscribenos: 'Write to us',
    contactoDireccionLinea2: '28013 Madrid, Spain',
    estadoSoporte: 'Support online',
    ariaPulso: 'Cofira community live',
    pulsoCaption: 'Cofira community · Live',
    pulsoLector: 'Over 24,000 people training right now in the community.',
    pulsoSub: 'Training now',
    pulsoSemanaEtiqueta: 'This week',
    pulsoSemanaSub: 'new sign-ups',
    copyright: 'Cofira. All rights reserved.',
    ariaEnlacesLegales: 'Legal links',
    legalPrivacidad: 'Privacy Policy',
    legalTerminos: 'Terms of Service',
    legalCookies: 'Cookies',
    ariaCambiarIdioma: 'Change language',
    ariaTemaClaro: 'Switch to light mode',
    ariaTemaOscuro: 'Switch to dark mode',
  },
};
