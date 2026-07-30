import { CodigoIdioma } from '../../services/idioma.service';

interface OpcionUnidad {
  codigo: string;
  nombre: string;
}

/* Todos los textos visibles de configuración, por idioma. La interfaz obliga
   a que ambas lenguas tengan exactamente las mismas claves. */
interface TextosConfiguracion {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  ariaMenuSecciones: string;
  menuGeneral: string;
  menuNotificaciones: string;
  menuPrivacidad: string;
  menuSuscripcion: string;
  menuCuenta: string;
  tituloGeneral: string;
  grupoIdiomaRegion: string;
  labelIdiomaApp: string;
  grupoUnidades: string;
  labelUnidadesPeso: string;
  labelUnidadesAltura: string;
  unidadesPesoOpciones: OpcionUnidad[];
  unidadesAlturaOpciones: OpcionUnidad[];
  tituloNotificaciones: string;
  grupoCanales: string;
  emailTitulo: string;
  emailDescripcion: string;
  pushTitulo: string;
  pushDescripcion: string;
  grupoRecordatorios: string;
  recordatorioEntrenoTitulo: string;
  recordatorioEntrenoDescripcion: string;
  recordatorioComidasTitulo: string;
  recordatorioComidasDescripcion: string;
  tituloPrivacidad: string;
  grupoGestionDatos: string;
  exportarTitulo: string;
  exportarDescripcion: string;
  botonExportar: string;
  grupoLegales: string;
  enlacePrivacidad: string;
  enlaceTerminos: string;
  enlaceCookies: string;
  tituloSuscripcion: string;
  grupoEstadoSuscripcion: string;
  etiquetaEstado: string;
  estadoActiva: string;
  estadoGracia: string;
  estadoCancelada: string;
  etiquetaFechaInicio: string;
  etiquetaRenovacion: string;
  etiquetaDiasRestantes: string;
  sufijoDias: string;
  grupoRenovacion: string;
  renovacionTitulo: string;
  renovacionDescripcion: string;
  grupoCancelar: string;
  cancelarProTitulo: string;
  cancelarProDescripcion: string;
  botonCancelando: string;
  botonCancelar: string;
  grupoActivarPro: string;
  promoTitulo: string;
  promoBeneficios: string[];
  precio: string;
  precioPeriodo: string;
  botonActivarPro: string;
  tituloCuenta: string;
  grupoPeligro: string;
  eliminarCuentaTitulo: string;
  eliminarCuentaDescripcion: string;
  botonEliminar: string;
  botonGuardando: string;
  botonGuardar: string;
  fechaNoDisponible: string;
  avisoGuardado: string;
  avisoNoDisponibleDemo: string;
  avisoExportando: string;
  avisoRenovacionActivada: string;
  avisoRenovacionDesactivada: string;
  avisoErrorActualizar: string;
  avisoCancelada: string;
  avisoErrorCancelar: string;
}

export const TEXTOS_CONFIGURACION: Record<CodigoIdioma, TextosConfiguracion> = {
  es: {
    eyebrow: 'Ajustes',
    titulo: 'Configuración',
    subtitulo: 'Personaliza tu experiencia en Cofira',
    ariaMenuSecciones: 'Secciones de configuración',
    menuGeneral: 'General',
    menuNotificaciones: 'Notificaciones',
    menuPrivacidad: 'Privacidad',
    menuSuscripcion: 'Suscripción',
    menuCuenta: 'Cuenta',
    tituloGeneral: 'Preferencias Generales',
    grupoIdiomaRegion: 'Idioma y Región',
    labelIdiomaApp: 'Idioma de la aplicación',
    grupoUnidades: 'Unidades de Medida',
    labelUnidadesPeso: 'Unidades de peso',
    labelUnidadesAltura: 'Unidades de altura',
    unidadesPesoOpciones: [
      { codigo: 'kg', nombre: 'Kilogramos (kg)' },
      { codigo: 'lb', nombre: 'Libras (lb)' },
    ],
    unidadesAlturaOpciones: [
      { codigo: 'cm', nombre: 'Centímetros (cm)' },
      { codigo: 'ft', nombre: 'Pies y pulgadas' },
    ],
    tituloNotificaciones: 'Notificaciones',
    grupoCanales: 'Canales de Comunicación',
    emailTitulo: 'Notificaciones por email',
    emailDescripcion: 'Recibe actualizaciones y consejos en tu correo',
    pushTitulo: 'Notificaciones push',
    pushDescripcion: 'Recibe alertas en tu dispositivo',
    grupoRecordatorios: 'Recordatorios',
    recordatorioEntrenoTitulo: 'Recordatorios de entrenamiento',
    recordatorioEntrenoDescripcion: 'Te avisamos cuando sea hora de entrenar',
    recordatorioComidasTitulo: 'Recordatorios de comidas',
    recordatorioComidasDescripcion: 'Te recordamos registrar tus comidas',
    tituloPrivacidad: 'Privacidad y Datos',
    grupoGestionDatos: 'Gestión de Datos',
    exportarTitulo: 'Exportar mis datos',
    exportarDescripcion: 'Descarga una copia de toda tu información',
    botonExportar: 'Exportar',
    grupoLegales: 'Documentos Legales',
    enlacePrivacidad: 'Política de privacidad',
    enlaceTerminos: 'Términos y condiciones',
    enlaceCookies: 'Política de cookies',
    tituloSuscripcion: 'Suscripción',
    grupoEstadoSuscripcion: 'Estado de tu Suscripción',
    etiquetaEstado: 'Estado',
    estadoActiva: 'Activa',
    estadoGracia: 'Período de gracia',
    estadoCancelada: 'Cancelada',
    etiquetaFechaInicio: 'Fecha de inicio',
    etiquetaRenovacion: 'Próxima renovación',
    etiquetaDiasRestantes: 'Días restantes',
    sufijoDias: 'días',
    grupoRenovacion: 'Opciones de Renovación',
    renovacionTitulo: 'Renovación automática',
    renovacionDescripcion: 'Tu suscripción se renovará automáticamente cada mes',
    grupoCancelar: 'Cancelar Suscripción',
    cancelarProTitulo: 'Cancelar PRO',
    cancelarProDescripcion: 'Mantendrás acceso hasta que expire tu período actual',
    botonCancelando: 'Cancelando...',
    botonCancelar: 'Cancelar',
    grupoActivarPro: 'Activa Cofira PRO',
    promoTitulo: 'Desbloquea todo el potencial',
    promoBeneficios: [
      'Gimnasio personalizado',
      'Planes de alimentación',
      'Seguimiento de progreso',
    ],
    precio: '9,99€',
    precioPeriodo: '/mes',
    botonActivarPro: 'Activar PRO',
    tituloCuenta: 'Gestión de Cuenta',
    grupoPeligro: 'Zona de Peligro',
    eliminarCuentaTitulo: 'Eliminar cuenta',
    eliminarCuentaDescripcion: 'Esta acción es irreversible. Se eliminarán todos tus datos.',
    botonEliminar: 'Eliminar',
    botonGuardando: 'Guardando...',
    botonGuardar: 'Guardar cambios',
    fechaNoDisponible: 'No disponible',
    avisoGuardado: 'Configuración guardada correctamente',
    avisoNoDisponibleDemo: 'Esta función no está disponible en la demo',
    avisoExportando: 'Preparando exportación de datos...',
    avisoRenovacionActivada: 'Renovación automática activada',
    avisoRenovacionDesactivada: 'Renovación automática desactivada',
    avisoErrorActualizar: 'No se pudo actualizar la configuración',
    avisoCancelada: 'Suscripción cancelada. Mantendrás acceso hasta que expire.',
    avisoErrorCancelar: 'No se pudo cancelar la suscripción',
  },
  en: {
    eyebrow: 'Preferences',
    titulo: 'Settings',
    subtitulo: 'Personalize your Cofira experience',
    ariaMenuSecciones: 'Settings sections',
    menuGeneral: 'General',
    menuNotificaciones: 'Notifications',
    menuPrivacidad: 'Privacy',
    menuSuscripcion: 'Subscription',
    menuCuenta: 'Account',
    tituloGeneral: 'General Preferences',
    grupoIdiomaRegion: 'Language & Region',
    labelIdiomaApp: 'App language',
    grupoUnidades: 'Measurement Units',
    labelUnidadesPeso: 'Weight units',
    labelUnidadesAltura: 'Height units',
    unidadesPesoOpciones: [
      { codigo: 'kg', nombre: 'Kilograms (kg)' },
      { codigo: 'lb', nombre: 'Pounds (lb)' },
    ],
    unidadesAlturaOpciones: [
      { codigo: 'cm', nombre: 'Centimeters (cm)' },
      { codigo: 'ft', nombre: 'Feet and inches' },
    ],
    tituloNotificaciones: 'Notifications',
    grupoCanales: 'Communication Channels',
    emailTitulo: 'Email notifications',
    emailDescripcion: 'Get updates and tips in your inbox',
    pushTitulo: 'Push notifications',
    pushDescripcion: 'Get alerts on your device',
    grupoRecordatorios: 'Reminders',
    recordatorioEntrenoTitulo: 'Workout reminders',
    recordatorioEntrenoDescripcion: "We'll let you know when it's time to train",
    recordatorioComidasTitulo: 'Meal reminders',
    recordatorioComidasDescripcion: "We'll remind you to log your meals",
    tituloPrivacidad: 'Privacy & Data',
    grupoGestionDatos: 'Data Management',
    exportarTitulo: 'Export my data',
    exportarDescripcion: 'Download a copy of all your information',
    botonExportar: 'Export',
    grupoLegales: 'Legal Documents',
    enlacePrivacidad: 'Privacy policy',
    enlaceTerminos: 'Terms and conditions',
    enlaceCookies: 'Cookie policy',
    tituloSuscripcion: 'Subscription',
    grupoEstadoSuscripcion: 'Your Subscription Status',
    etiquetaEstado: 'Status',
    estadoActiva: 'Active',
    estadoGracia: 'Grace period',
    estadoCancelada: 'Canceled',
    etiquetaFechaInicio: 'Start date',
    etiquetaRenovacion: 'Next renewal',
    etiquetaDiasRestantes: 'Days left',
    sufijoDias: 'days',
    grupoRenovacion: 'Renewal Options',
    renovacionTitulo: 'Automatic renewal',
    renovacionDescripcion: 'Your subscription will renew automatically every month',
    grupoCancelar: 'Cancel Subscription',
    cancelarProTitulo: 'Cancel PRO',
    cancelarProDescripcion: "You'll keep access until your current period expires",
    botonCancelando: 'Canceling...',
    botonCancelar: 'Cancel',
    grupoActivarPro: 'Activate Cofira PRO',
    promoTitulo: 'Unlock the full potential',
    promoBeneficios: ['Personalized gym', 'Meal plans', 'Progress tracking'],
    precio: '9.99€',
    precioPeriodo: '/month',
    botonActivarPro: 'Activate PRO',
    tituloCuenta: 'Account Management',
    grupoPeligro: 'Danger Zone',
    eliminarCuentaTitulo: 'Delete account',
    eliminarCuentaDescripcion: 'This action is irreversible. All your data will be deleted.',
    botonEliminar: 'Delete',
    botonGuardando: 'Saving...',
    botonGuardar: 'Save changes',
    fechaNoDisponible: 'Not available',
    avisoGuardado: 'Settings saved successfully',
    avisoNoDisponibleDemo: 'This feature is not available in the demo',
    avisoExportando: 'Preparing your data export...',
    avisoRenovacionActivada: 'Automatic renewal enabled',
    avisoRenovacionDesactivada: 'Automatic renewal disabled',
    avisoErrorActualizar: 'Could not update your settings',
    avisoCancelada: "Subscription canceled. You'll keep access until it expires.",
    avisoErrorCancelar: 'Could not cancel the subscription',
  },
};
