import { CodigoIdioma } from '../../../services/idioma.service';

/* Textos de la cabecera, la mini-cabecera y el menú móvil, por idioma */
interface TextosCabecera {
  logoEtiqueta: string;
  ariaLogo: string;
  ariaNavPrincipal: string;
  ariaAcciones: string;
  navNutricion: string;
  navEjercicio: string;
  navSeguimiento: string;
  ariaTemaClaro: string;
  ariaTemaOscuro: string;
  ariaMenuCuenta: string;
  cuentaPersonal: string;
  etiquetaCuenta: string;
  itemPerfilTitulo: string;
  itemPerfilDescripcion: string;
  itemConfigTitulo: string;
  itemConfigDescripcion: string;
  cerrarSesion: string;
  inscribete: string;
  ariaMenu: string;
  ariaNavRapida: string;
  ariaMiPerfil: string;
  entrar: string;
  ariaMenuNavegacion: string;
  menuTitulo: string;
  ariaCerrarMenu: string;
  modoClaro: string;
  modoOscuro: string;
}

export const TEXTOS_CABECERA: Record<CodigoIdioma, TextosCabecera> = {
  es: {
    logoEtiqueta: 'Sistema',
    ariaLogo: 'Cofira - inicio',
    ariaNavPrincipal: 'Navegación principal',
    ariaAcciones: 'Acciones de usuario',
    navNutricion: 'Nutrición',
    navEjercicio: 'Ejercicio',
    navSeguimiento: 'Seguimiento',
    ariaTemaClaro: 'Activar modo claro',
    ariaTemaOscuro: 'Activar modo oscuro',
    ariaMenuCuenta: 'Menú de cuenta',
    cuentaPersonal: 'Cuenta personal',
    etiquetaCuenta: 'Cuenta',
    itemPerfilTitulo: 'Mi perfil',
    itemPerfilDescripcion: 'Datos y objetivos',
    itemConfigTitulo: 'Configuración',
    itemConfigDescripcion: 'Preferencias y unidades',
    cerrarSesion: 'Cerrar sesión',
    inscribete: 'Inscríbete',
    ariaMenu: 'Menú',
    ariaNavRapida: 'Navegación rápida',
    ariaMiPerfil: 'Mi perfil',
    entrar: 'Entrar',
    ariaMenuNavegacion: 'Menú de navegación',
    menuTitulo: 'Menú',
    ariaCerrarMenu: 'Cerrar menú',
    modoClaro: 'Modo claro',
    modoOscuro: 'Modo oscuro',
  },
  en: {
    logoEtiqueta: 'System',
    ariaLogo: 'Cofira - home',
    ariaNavPrincipal: 'Main navigation',
    ariaAcciones: 'User actions',
    navNutricion: 'Nutrition',
    navEjercicio: 'Training',
    navSeguimiento: 'Tracking',
    ariaTemaClaro: 'Switch to light mode',
    ariaTemaOscuro: 'Switch to dark mode',
    ariaMenuCuenta: 'Account menu',
    cuentaPersonal: 'Personal account',
    etiquetaCuenta: 'Account',
    itemPerfilTitulo: 'My profile',
    itemPerfilDescripcion: 'Data and goals',
    itemConfigTitulo: 'Settings',
    itemConfigDescripcion: 'Preferences and units',
    cerrarSesion: 'Log out',
    inscribete: 'Sign up',
    ariaMenu: 'Menu',
    ariaNavRapida: 'Quick navigation',
    ariaMiPerfil: 'My profile',
    entrar: 'Log in',
    ariaMenuNavegacion: 'Navigation menu',
    menuTitulo: 'Menu',
    ariaCerrarMenu: 'Close menu',
    modoClaro: 'Light mode',
    modoOscuro: 'Dark mode',
  },
};
