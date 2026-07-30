import { CodigoIdioma } from '../../services/idioma.service';

/* Todos los textos visibles de la página (aria-labels, placeholders y mensajes
   de estado incluidos), por idioma. La interfaz obliga a las mismas claves. */
interface TextosLogin {
  citaLinea1: string;
  citaLinea2: string;
  titulo: string;
  subtitulo: string;
  leyendaCampos: string;
  ariaEmail: string;
  placeholderEmail: string;
  ariaContrasena: string;
  placeholderContrasena: string;
  ariaAlternarContrasena: string;
  botonEntrando: string;
  botonEntrar: string;
  sinCuenta: string;
  crearCuenta: string;
  exitoSesion: string;
  errorCredenciales: string;
}

export const TEXTOS_LOGIN: Record<CodigoIdioma, TextosLogin> = {
  es: {
    citaLinea1: 'Tu progreso empieza con un solo entreno.',
    citaLinea2: 'Vuelve, registra, repite.',
    titulo: 'Bienvenido de nuevo',
    subtitulo: 'Inicia sesión para continuar',
    leyendaCampos: 'Datos de acceso',
    ariaEmail: 'Correo electrónico',
    placeholderEmail: 'tu@email.com',
    ariaContrasena: 'Contraseña',
    placeholderContrasena: 'Tu contraseña',
    ariaAlternarContrasena: 'Mostrar u ocultar contraseña',
    botonEntrando: 'Entrando...',
    botonEntrar: 'Iniciar sesión',
    sinCuenta: '¿No tienes cuenta?',
    crearCuenta: 'Crear cuenta',
    exitoSesion: '¡Sesión iniciada correctamente!',
    errorCredenciales: 'No se pudo iniciar sesión. Verifica tus credenciales.',
  },
  en: {
    citaLinea1: 'Your progress starts with a single workout.',
    citaLinea2: 'Come back, log it, repeat.',
    titulo: 'Welcome back',
    subtitulo: 'Log in to continue',
    leyendaCampos: 'Login details',
    ariaEmail: 'Email address',
    placeholderEmail: 'you@email.com',
    ariaContrasena: 'Password',
    placeholderContrasena: 'Your password',
    ariaAlternarContrasena: 'Show or hide password',
    botonEntrando: 'Signing in...',
    botonEntrar: 'Log in',
    sinCuenta: "Don't have an account?",
    crearCuenta: 'Create account',
    exitoSesion: 'Signed in successfully!',
    errorCredenciales: "Couldn't sign in. Check your credentials.",
  },
};
