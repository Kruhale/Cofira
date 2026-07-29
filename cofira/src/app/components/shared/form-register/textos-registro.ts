import { CodigoIdioma } from '../../../services/idioma.service';

/* Todos los textos visibles del formulario de registro, por idioma. La
   interfaz obliga a que ambas lenguas tengan exactamente las mismas claves. */
interface TextosRegistro {
  leyendaCuenta: string;
  labelNombre: string;
  placeholderNombre: string;
  errorNombre: string;
  labelApellido: string;
  placeholderApellido: string;
  errorApellido: string;
  labelEmail: string;
  placeholderEmail: string;
  errorEmail: string;
  labelContrasena: string;
  placeholderContrasena: string;
  errorContrasena: string;
  labelConfirmar: string;
  placeholderConfirmar: string;
  errorNoCoinciden: string;
  etiquetaTerminos: string;
  errorTerminos: string;
  botonRegistrarse: string;
  exitoRegistro: string;
  avisoCamposInvalidos: string;
}

export const TEXTOS_REGISTRO: Record<CodigoIdioma, TextosRegistro> = {
  es: {
    leyendaCuenta: 'Crea tu cuenta',
    labelNombre: 'Nombre:',
    placeholderNombre: 'Escribe tu nombre',
    errorNombre: 'El nombre es requerido (mínimo 2 caracteres)',
    labelApellido: 'Apellido:',
    placeholderApellido: 'Escribe tu apellido',
    errorApellido: 'El apellido es requerido (mínimo 2 caracteres)',
    labelEmail: 'Email:',
    placeholderEmail: 'tu@email.com',
    errorEmail: 'Por favor, introduce un email válido',
    labelContrasena: 'Contraseña:',
    placeholderContrasena: 'Mínimo 6 caracteres',
    errorContrasena: 'La contraseña debe tener al menos 6 caracteres',
    labelConfirmar: 'Confirmar Contraseña:',
    placeholderConfirmar: 'Repite tu contraseña',
    errorNoCoinciden: 'Las contraseñas no coinciden',
    etiquetaTerminos: 'Acepto los términos y condiciones',
    errorTerminos: 'Debes aceptar los términos y condiciones',
    botonRegistrarse: 'Registrarse',
    exitoRegistro: '¡Registro completado correctamente!',
    avisoCamposInvalidos: 'Por favor, completa todos los campos correctamente',
  },
  en: {
    leyendaCuenta: 'Create your account',
    labelNombre: 'First name:',
    placeholderNombre: 'Enter your first name',
    errorNombre: 'First name is required (at least 2 characters)',
    labelApellido: 'Last name:',
    placeholderApellido: 'Enter your last name',
    errorApellido: 'Last name is required (at least 2 characters)',
    labelEmail: 'Email:',
    placeholderEmail: 'you@email.com',
    errorEmail: 'Please enter a valid email address',
    labelContrasena: 'Password:',
    placeholderContrasena: 'At least 6 characters',
    errorContrasena: 'The password must be at least 6 characters long',
    labelConfirmar: 'Confirm password:',
    placeholderConfirmar: 'Repeat your password',
    errorNoCoinciden: 'Passwords do not match',
    etiquetaTerminos: 'I accept the terms and conditions',
    errorTerminos: 'You must accept the terms and conditions',
    botonRegistrarse: 'Sign up',
    exitoRegistro: 'Registration completed successfully!',
    avisoCamposInvalidos: 'Please fill in all fields correctly',
  },
};
