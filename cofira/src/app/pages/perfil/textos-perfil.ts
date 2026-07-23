import { CodigoIdioma } from '../../services/idioma.service';

/* Todos los textos visibles del perfil, por idioma. La interfaz obliga a que
   ambas lenguas tengan exactamente las mismas claves. Las descripciones de
   actividad se indexan por el valor guardado en el backend (siempre en
   español), por eso las claves del Record no se traducen. */
interface TextosPerfil {
  eyebrow: string;
  tituloPorDefecto: string;
  tituloInformacion: string;
  botonEditar: string;
  labelNombre: string;
  placeholderNombre: string;
  sinEspecificar: string;
  labelEmail: string;
  labelMiembroDesde: string;
  botonCancelar: string;
  botonGuardando: string;
  botonGuardar: string;
  tituloSalud: string;
  labelPesoActual: string;
  labelAltura: string;
  labelImc: string;
  labelObjetivo: string;
  notaPerfilIncompleto: string;
  imcBajo: string;
  imcNormal: string;
  imcSobrepeso: string;
  imcObesidad: string;
  tituloActividad: string;
  objetivos: string[];
  nivelesActividad: string[];
  descripcionesActividad: Record<string, string>;
  descripcionActividadDefecto: string;
  fechaNoDisponible: string;
  avisoPerfilActualizado: string;
}

export const TEXTOS_PERFIL: Record<CodigoIdioma, TextosPerfil> = {
  es: {
    eyebrow: 'Mi cuenta',
    tituloPorDefecto: 'Mi perfil',
    tituloInformacion: 'Información Personal',
    botonEditar: 'Editar',
    labelNombre: 'Nombre',
    placeholderNombre: 'Tu nombre',
    sinEspecificar: 'No especificado',
    labelEmail: 'Correo electrónico',
    labelMiembroDesde: 'Miembro desde',
    botonCancelar: 'Cancelar',
    botonGuardando: 'Guardando...',
    botonGuardar: 'Guardar cambios',
    tituloSalud: 'Datos de Salud',
    labelPesoActual: 'Peso actual',
    labelAltura: 'Altura',
    labelImc: 'IMC',
    labelObjetivo: 'Objetivo',
    notaPerfilIncompleto: 'Completa tu perfil para ver tus métricas',
    imcBajo: 'Bajo peso',
    imcNormal: 'Normal',
    imcSobrepeso: 'Sobrepeso',
    imcObesidad: 'Obesidad',
    tituloActividad: 'Nivel de Actividad',
    objetivos: ['Perder peso', 'Ganar músculo', 'Mantener peso', 'Mejorar resistencia'],
    nivelesActividad: ['Sedentario', 'Ligero', 'Moderado', 'Activo', 'Muy activo'],
    descripcionesActividad: {
      Sedentario: 'Poco o ningún ejercicio',
      Ligero: 'Ejercicio ligero 1-3 días/semana',
      Moderado: 'Ejercicio moderado 3-5 días/semana',
      Activo: 'Ejercicio intenso 6-7 días/semana',
      'Muy activo': 'Ejercicio muy intenso o trabajo físico',
    },
    descripcionActividadDefecto: 'Nivel de actividad personalizado',
    fechaNoDisponible: 'No disponible',
    avisoPerfilActualizado: 'Perfil actualizado correctamente',
  },
  en: {
    eyebrow: 'My account',
    tituloPorDefecto: 'My profile',
    tituloInformacion: 'Personal Information',
    botonEditar: 'Edit',
    labelNombre: 'Name',
    placeholderNombre: 'Your name',
    sinEspecificar: 'Not specified',
    labelEmail: 'Email address',
    labelMiembroDesde: 'Member since',
    botonCancelar: 'Cancel',
    botonGuardando: 'Saving...',
    botonGuardar: 'Save changes',
    tituloSalud: 'Health Data',
    labelPesoActual: 'Current weight',
    labelAltura: 'Height',
    labelImc: 'BMI',
    labelObjetivo: 'Goal',
    notaPerfilIncompleto: 'Complete your profile to see your metrics',
    imcBajo: 'Underweight',
    imcNormal: 'Normal',
    imcSobrepeso: 'Overweight',
    imcObesidad: 'Obese',
    tituloActividad: 'Activity Level',
    objetivos: ['Lose weight', 'Build muscle', 'Maintain weight', 'Improve endurance'],
    nivelesActividad: ['Sedentary', 'Light', 'Moderate', 'Active', 'Very active'],
    descripcionesActividad: {
      Sedentario: 'Little or no exercise',
      Ligero: 'Light exercise 1-3 days/week',
      Moderado: 'Moderate exercise 3-5 days/week',
      Activo: 'Hard exercise 6-7 days/week',
      'Muy activo': 'Very hard exercise or a physical job',
    },
    descripcionActividadDefecto: 'Custom activity level',
    fechaNoDisponible: 'Not available',
    avisoPerfilActualizado: 'Profile updated successfully',
  },
};
