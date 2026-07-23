import { CodigoIdioma } from '../../services/idioma.service';

interface BeneficioPro {
  icono: string;
  titulo: string;
  descripcion: string;
}

/* Todos los textos visibles del acceso PRO, por idioma. La interfaz obliga a
   que ambas lenguas tengan exactamente las mismas claves. */
interface TextosAccesoPro {
  eyebrow: string;
  etiquetaPagoConfirmado: string;
  exitoTitulo: string;
  exitoTexto: string;
  ariaVolver: string;
  pagoTitulo: string;
  contextoPago: string;
  legendDatosPago: string;
  labelNumeroTarjeta: string;
  labelTitular: string;
  placeholderTitular: string;
  labelExpiracion: string;
  labelCvv: string;
  checkboxRenovacion: string;
  etiquetaPrecio: string;
  precio: string;
  precioPeriodo: string;
  botonProcesando: string;
  botonActivarPro: string;
  avisoPagoSimulado: string;
  tituloBloqueo: string;
  contextoBloqueo: string;
  beneficiosTitulo: string;
  beneficiosPro: BeneficioPro[];
  tituloProActivo: string;
  contextoProActivo: string;
  etiquetaEstado: string;
  estadoActiva: string;
  etiquetaExpira: string;
  etiquetaDias: string;
  enlaceGestionar: string;
  botonVolverInicio: string;
  avisoBienvenida: string;
  avisoErrorPago: string;
}

export const TEXTOS_ACCESO_PRO: Record<CodigoIdioma, TextosAccesoPro> = {
  es: {
    eyebrow: 'Cofira PRO',
    etiquetaPagoConfirmado: 'Pago confirmado',
    exitoTitulo: '¡Pago realizado!',
    exitoTexto: 'Ya eres parte de Cofira PRO. Redirigiendo...',
    ariaVolver: 'Volver',
    pagoTitulo: 'Activar Cofira PRO',
    contextoPago: 'Pago simulado · Sin cargo real',
    legendDatosPago: 'Datos de pago',
    labelNumeroTarjeta: 'Número de tarjeta',
    labelTitular: 'Nombre del titular',
    placeholderTitular: 'NOMBRE APELLIDO',
    labelExpiracion: 'Fecha expiración',
    labelCvv: 'CVV',
    checkboxRenovacion: 'Renovar automáticamente cada mes',
    etiquetaPrecio: 'Precio',
    precio: '9,99€',
    precioPeriodo: '/mes',
    botonProcesando: 'Procesando pago...',
    botonActivarPro: 'Activar PRO',
    avisoPagoSimulado: 'Pago simulado - No se realizará ningún cargo real',
    tituloBloqueo: 'Contenido exclusivo para PRO',
    contextoBloqueo: 'Requiere suscripción activa',
    beneficiosTitulo: 'Qué incluye',
    beneficiosPro: [
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
    tituloProActivo: 'Ya eres PRO',
    contextoProActivo: 'Todas las apps desbloqueadas',
    etiquetaEstado: 'Estado',
    estadoActiva: 'Activa',
    etiquetaExpira: 'Expira',
    etiquetaDias: 'Días restantes',
    enlaceGestionar: 'Gestionar suscripción',
    botonVolverInicio: 'Volver al inicio',
    avisoBienvenida: '¡Bienvenido a Cofira PRO!',
    avisoErrorPago: 'Error al procesar el pago. Inténtalo de nuevo.',
  },
  en: {
    eyebrow: 'Cofira PRO',
    etiquetaPagoConfirmado: 'Payment confirmed',
    exitoTitulo: 'Payment complete!',
    exitoTexto: "You're now part of Cofira PRO. Redirecting...",
    ariaVolver: 'Go back',
    pagoTitulo: 'Activate Cofira PRO',
    contextoPago: 'Simulated payment · No real charge',
    legendDatosPago: 'Payment details',
    labelNumeroTarjeta: 'Card number',
    labelTitular: 'Cardholder name',
    placeholderTitular: 'FULL NAME',
    labelExpiracion: 'Expiry date',
    labelCvv: 'CVV',
    checkboxRenovacion: 'Renew automatically every month',
    etiquetaPrecio: 'Price',
    precio: '9.99€',
    precioPeriodo: '/month',
    botonProcesando: 'Processing payment...',
    botonActivarPro: 'Activate PRO',
    avisoPagoSimulado: 'Simulated payment - no real charge will be made',
    tituloBloqueo: 'Exclusive PRO content',
    contextoBloqueo: 'Active subscription required',
    beneficiosTitulo: "What's included",
    beneficiosPro: [
      {
        icono: 'gimnasio',
        titulo: 'Personalized gym',
        descripcion: 'Routines tailored to your goals',
      },
      {
        icono: 'alimentacion',
        titulo: 'Meal plan',
        descripcion: 'Diets personalized for you',
      },
      {
        icono: 'seguimiento',
        titulo: 'Complete tracking',
        descripcion: 'Progress charts and statistics',
      },
    ],
    tituloProActivo: "You're PRO",
    contextoProActivo: 'All apps unlocked',
    etiquetaEstado: 'Status',
    estadoActiva: 'Active',
    etiquetaExpira: 'Expires',
    etiquetaDias: 'Days left',
    enlaceGestionar: 'Manage subscription',
    botonVolverInicio: 'Back to home',
    avisoBienvenida: 'Welcome to Cofira PRO!',
    avisoErrorPago: 'Payment failed. Please try again.',
  },
};
