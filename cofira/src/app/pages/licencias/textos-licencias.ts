import { CodigoIdioma } from '../../services/idioma.service';

/* Punto de lista con etiqueta en negrita: el template lo pinta como
   <strong>etiqueta</strong> texto, igual que el HTML original. */
interface PuntoDestacado {
  etiqueta: string;
  texto: string;
}

/* Bloque repetido de la página: h3 con el nombre, puntos etiquetados y un
   último punto con enlace externo (repositorio, fuente o sitio web). */
interface BloqueLicencia {
  nombre: string;
  puntos: PuntoDestacado[];
  enlaceEtiqueta: string;
  enlaceUrl: string;
  enlaceTexto: string;
}

/* Todos los textos visibles de licencias y atribuciones, por idioma. La
   interfaz obliga a que ambas lenguas tengan exactamente las mismas claves. */
interface TextosLicencias {
  tituloPagina: string;
  etiquetaFecha: string;
  fechaActualizacion: string;
  cofiraTitulo: string;
  cofiraParrafo1: string;
  cofiraUsoAntes: string;
  cofiraEnlaceTerminos: string;
  cofiraUsoDespues: string;
  frameworksTitulo: string;
  frameworksIntro: string;
  frameworks: BloqueLicencia[];
  tipografiasTitulo: string;
  tipografiasIntro: string;
  tipografias: BloqueLicencia[];
  iconosTitulo: string;
  iconosIntro: string;
  iconos: BloqueLicencia[];
  imagenesTitulo: string;
  imagenesIntro: string;
  unsplash: BloqueLicencia;
  originalTitulo: string;
  originalTexto: string;
  herramientasTitulo: string;
  herramientasIntro: string;
  herramientasPuntos: PuntoDestacado[];
  textosLicenciasTitulo: string;
  mitTitulo: string;
  mitParrafo1: string;
  mitParrafo2: string;
  oflTitulo: string;
  oflTexto: string;
  contactoTitulo: string;
  contactoIntro: string;
  contactoEmailEtiqueta: string;
  contactoDireccionEtiqueta: string;
  contactoDireccion: string;
}

/* Los textos oficiales de las licencias (MIT, OFL) se citan literalmente en
   inglés en ambos idiomas: una licencia no se traduce. */
const MIT_PARRAFO_1 =
  'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:';
const MIT_PARRAFO_2 =
  'The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.';
const OFL_TEXTO =
  'This Font Software is licensed under the SIL Open Font License, Version 1.1. This license allows the fonts to be used, studied, modified and redistributed freely as long as they are not sold by themselves.';

export const TEXTOS_LICENCIAS: Record<CodigoIdioma, TextosLicencias> = {
  es: {
    tituloPagina: 'Licencias y Atribuciones',
    etiquetaFecha: 'Última actualización:',
    fechaActualizacion: 'Enero 2025',
    cofiraTitulo: '1. Licencia de Cofira',
    cofiraParrafo1:
      'Cofira es una plataforma propietaria de fitness y nutrición. Todo el código fuente, diseño, contenido y funcionalidades son propiedad exclusiva de Cofira y están protegidos por las leyes de propiedad intelectual.',
    cofiraUsoAntes: 'El uso de la plataforma está sujeto a nuestros',
    cofiraEnlaceTerminos: 'Términos de Servicio',
    cofiraUsoDespues:
      '. No está permitida la reproducción, distribución o modificación del software sin autorización expresa por escrito.',
    frameworksTitulo: '2. Frameworks y Librerías',
    frameworksIntro:
      'Cofira utiliza las siguientes tecnologías de código abierto, a las cuales agradecemos su contribución a la comunidad de desarrollo:',
    frameworks: [
      {
        nombre: 'Angular',
        puntos: [
          { etiqueta: 'Versión:', texto: '19.x' },
          { etiqueta: 'Licencia:', texto: 'MIT License' },
          { etiqueta: 'Copyright:', texto: 'Google LLC' },
        ],
        enlaceEtiqueta: 'Repositorio:',
        enlaceUrl: 'https://github.com/angular/angular',
        enlaceTexto: 'github.com/angular/angular',
      },
      {
        nombre: 'RxJS',
        puntos: [
          { etiqueta: 'Versión:', texto: '7.x' },
          { etiqueta: 'Licencia:', texto: 'Apache License 2.0' },
          { etiqueta: 'Copyright:', texto: 'Netflix, Inc., Microsoft Corp. and contributors' },
        ],
        enlaceEtiqueta: 'Repositorio:',
        enlaceUrl: 'https://github.com/ReactiveX/rxjs',
        enlaceTexto: 'github.com/ReactiveX/rxjs',
      },
      {
        nombre: 'TypeScript',
        puntos: [
          { etiqueta: 'Versión:', texto: '5.x' },
          { etiqueta: 'Licencia:', texto: 'Apache License 2.0' },
          { etiqueta: 'Copyright:', texto: 'Microsoft Corporation' },
        ],
        enlaceEtiqueta: 'Repositorio:',
        enlaceUrl: 'https://github.com/microsoft/TypeScript',
        enlaceTexto: 'github.com/microsoft/TypeScript',
      },
      {
        nombre: 'Chart.js',
        puntos: [
          { etiqueta: 'Versión:', texto: '4.x' },
          { etiqueta: 'Licencia:', texto: 'MIT License' },
          { etiqueta: 'Copyright:', texto: 'Chart.js Contributors' },
        ],
        enlaceEtiqueta: 'Repositorio:',
        enlaceUrl: 'https://github.com/chartjs/Chart.js',
        enlaceTexto: 'github.com/chartjs/Chart.js',
      },
    ],
    tipografiasTitulo: '3. Tipografías',
    tipografiasIntro:
      'Las fuentes utilizadas en Cofira provienen de Google Fonts y están disponibles bajo la Open Font License:',
    tipografias: [
      {
        nombre: 'Montserrat',
        puntos: [
          { etiqueta: 'Diseñador:', texto: 'Julieta Ulanovsky' },
          { etiqueta: 'Licencia:', texto: 'SIL Open Font License 1.1' },
        ],
        enlaceEtiqueta: 'Fuente:',
        enlaceUrl: 'https://fonts.google.com/specimen/Montserrat',
        enlaceTexto: 'Google Fonts - Montserrat',
      },
      {
        nombre: 'Poppins',
        puntos: [
          { etiqueta: 'Diseñador:', texto: 'Indian Type Foundry, Jonny Pinhorn' },
          { etiqueta: 'Licencia:', texto: 'SIL Open Font License 1.1' },
        ],
        enlaceEtiqueta: 'Fuente:',
        enlaceUrl: 'https://fonts.google.com/specimen/Poppins',
        enlaceTexto: 'Google Fonts - Poppins',
      },
    ],
    iconosTitulo: '4. Iconografía',
    iconosIntro: 'Los iconos utilizados en Cofira provienen de las siguientes fuentes:',
    iconos: [
      {
        nombre: 'Lucide Icons',
        puntos: [
          { etiqueta: 'Licencia:', texto: 'ISC License' },
          { etiqueta: 'Uso:', texto: 'Iconos de interfaz de usuario' },
        ],
        enlaceEtiqueta: 'Sitio web:',
        enlaceUrl: 'https://lucide.dev',
        enlaceTexto: 'lucide.dev',
      },
      {
        nombre: 'Heroicons',
        puntos: [
          { etiqueta: 'Licencia:', texto: 'MIT License' },
          { etiqueta: 'Copyright:', texto: 'Tailwind Labs, Inc.' },
        ],
        enlaceEtiqueta: 'Sitio web:',
        enlaceUrl: 'https://heroicons.com',
        enlaceTexto: 'heroicons.com',
      },
    ],
    imagenesTitulo: '5. Imágenes y Fotografías',
    imagenesIntro: 'Las imágenes utilizadas en la plataforma provienen de diversas fuentes:',
    unsplash: {
      nombre: 'Unsplash',
      puntos: [
        {
          etiqueta: 'Licencia:',
          texto: 'Unsplash License (libre para uso comercial y no comercial)',
        },
        { etiqueta: 'Uso:', texto: 'Fotografías de stock para secciones de marketing' },
      ],
      enlaceEtiqueta: 'Sitio web:',
      enlaceUrl: 'https://unsplash.com',
      enlaceTexto: 'unsplash.com',
    },
    originalTitulo: 'Contenido Original',
    originalTexto:
      'Las ilustraciones, gráficos y elementos visuales personalizados son creaciones originales de Cofira y están protegidos por derechos de autor.',
    herramientasTitulo: '6. Herramientas de Desarrollo',
    herramientasIntro:
      'Agradecemos a las siguientes herramientas que hacen posible el desarrollo de Cofira:',
    herramientasPuntos: [
      { etiqueta: 'Angular CLI:', texto: 'Herramienta de desarrollo (MIT License)' },
      { etiqueta: 'Sass:', texto: 'Preprocesador CSS (MIT License)' },
      { etiqueta: 'ESLint:', texto: 'Linter de código (MIT License)' },
      { etiqueta: 'Prettier:', texto: 'Formateador de código (MIT License)' },
      { etiqueta: 'Webpack:', texto: 'Empaquetador de módulos (MIT License)' },
    ],
    textosLicenciasTitulo: '7. Textos de Licencias',
    mitTitulo: 'MIT License',
    mitParrafo1: MIT_PARRAFO_1,
    mitParrafo2: MIT_PARRAFO_2,
    oflTitulo: 'SIL Open Font License 1.1',
    oflTexto: OFL_TEXTO,
    contactoTitulo: '8. Contacto',
    contactoIntro:
      'Si tienes preguntas sobre las licencias o atribuciones, puedes contactarnos en:',
    contactoEmailEtiqueta: 'Email:',
    contactoDireccionEtiqueta: 'Dirección:',
    contactoDireccion: 'Calle Fitness 123, 28001 Madrid, España',
  },
  en: {
    tituloPagina: 'Licenses and Attributions',
    etiquetaFecha: 'Last updated:',
    fechaActualizacion: 'January 2025',
    cofiraTitulo: '1. Cofira License',
    cofiraParrafo1:
      'Cofira is a proprietary fitness and nutrition platform. All source code, design, content and features are the exclusive property of Cofira and are protected by intellectual property laws.',
    cofiraUsoAntes: 'Use of the platform is subject to our',
    cofiraEnlaceTerminos: 'Terms of Service',
    cofiraUsoDespues:
      '. Reproduction, distribution or modification of the software without express written authorization is not permitted.',
    frameworksTitulo: '2. Frameworks and Libraries',
    frameworksIntro:
      'Cofira uses the following open-source technologies, whose contribution to the development community we gratefully acknowledge:',
    frameworks: [
      {
        nombre: 'Angular',
        puntos: [
          { etiqueta: 'Version:', texto: '19.x' },
          { etiqueta: 'License:', texto: 'MIT License' },
          { etiqueta: 'Copyright:', texto: 'Google LLC' },
        ],
        enlaceEtiqueta: 'Repository:',
        enlaceUrl: 'https://github.com/angular/angular',
        enlaceTexto: 'github.com/angular/angular',
      },
      {
        nombre: 'RxJS',
        puntos: [
          { etiqueta: 'Version:', texto: '7.x' },
          { etiqueta: 'License:', texto: 'Apache License 2.0' },
          { etiqueta: 'Copyright:', texto: 'Netflix, Inc., Microsoft Corp. and contributors' },
        ],
        enlaceEtiqueta: 'Repository:',
        enlaceUrl: 'https://github.com/ReactiveX/rxjs',
        enlaceTexto: 'github.com/ReactiveX/rxjs',
      },
      {
        nombre: 'TypeScript',
        puntos: [
          { etiqueta: 'Version:', texto: '5.x' },
          { etiqueta: 'License:', texto: 'Apache License 2.0' },
          { etiqueta: 'Copyright:', texto: 'Microsoft Corporation' },
        ],
        enlaceEtiqueta: 'Repository:',
        enlaceUrl: 'https://github.com/microsoft/TypeScript',
        enlaceTexto: 'github.com/microsoft/TypeScript',
      },
      {
        nombre: 'Chart.js',
        puntos: [
          { etiqueta: 'Version:', texto: '4.x' },
          { etiqueta: 'License:', texto: 'MIT License' },
          { etiqueta: 'Copyright:', texto: 'Chart.js Contributors' },
        ],
        enlaceEtiqueta: 'Repository:',
        enlaceUrl: 'https://github.com/chartjs/Chart.js',
        enlaceTexto: 'github.com/chartjs/Chart.js',
      },
    ],
    tipografiasTitulo: '3. Typefaces',
    tipografiasIntro:
      'The fonts used in Cofira come from Google Fonts and are available under the Open Font License:',
    tipografias: [
      {
        nombre: 'Montserrat',
        puntos: [
          { etiqueta: 'Designer:', texto: 'Julieta Ulanovsky' },
          { etiqueta: 'License:', texto: 'SIL Open Font License 1.1' },
        ],
        enlaceEtiqueta: 'Source:',
        enlaceUrl: 'https://fonts.google.com/specimen/Montserrat',
        enlaceTexto: 'Google Fonts - Montserrat',
      },
      {
        nombre: 'Poppins',
        puntos: [
          { etiqueta: 'Designer:', texto: 'Indian Type Foundry, Jonny Pinhorn' },
          { etiqueta: 'License:', texto: 'SIL Open Font License 1.1' },
        ],
        enlaceEtiqueta: 'Source:',
        enlaceUrl: 'https://fonts.google.com/specimen/Poppins',
        enlaceTexto: 'Google Fonts - Poppins',
      },
    ],
    iconosTitulo: '4. Iconography',
    iconosIntro: 'The icons used in Cofira come from the following sources:',
    iconos: [
      {
        nombre: 'Lucide Icons',
        puntos: [
          { etiqueta: 'License:', texto: 'ISC License' },
          { etiqueta: 'Use:', texto: 'User interface icons' },
        ],
        enlaceEtiqueta: 'Website:',
        enlaceUrl: 'https://lucide.dev',
        enlaceTexto: 'lucide.dev',
      },
      {
        nombre: 'Heroicons',
        puntos: [
          { etiqueta: 'License:', texto: 'MIT License' },
          { etiqueta: 'Copyright:', texto: 'Tailwind Labs, Inc.' },
        ],
        enlaceEtiqueta: 'Website:',
        enlaceUrl: 'https://heroicons.com',
        enlaceTexto: 'heroicons.com',
      },
    ],
    imagenesTitulo: '5. Images and Photography',
    imagenesIntro: 'The images used on the platform come from various sources:',
    unsplash: {
      nombre: 'Unsplash',
      puntos: [
        {
          etiqueta: 'License:',
          texto: 'Unsplash License (free for commercial and non-commercial use)',
        },
        { etiqueta: 'Use:', texto: 'Stock photography for marketing sections' },
      ],
      enlaceEtiqueta: 'Website:',
      enlaceUrl: 'https://unsplash.com',
      enlaceTexto: 'unsplash.com',
    },
    originalTitulo: 'Original Content',
    originalTexto:
      'Custom illustrations, graphics and visual elements are original creations of Cofira and are protected by copyright.',
    herramientasTitulo: '6. Development Tools',
    herramientasIntro:
      'We are grateful to the following tools that make the development of Cofira possible:',
    herramientasPuntos: [
      { etiqueta: 'Angular CLI:', texto: 'Development tooling (MIT License)' },
      { etiqueta: 'Sass:', texto: 'CSS preprocessor (MIT License)' },
      { etiqueta: 'ESLint:', texto: 'Code linter (MIT License)' },
      { etiqueta: 'Prettier:', texto: 'Code formatter (MIT License)' },
      { etiqueta: 'Webpack:', texto: 'Module bundler (MIT License)' },
    ],
    textosLicenciasTitulo: '7. License Texts',
    mitTitulo: 'MIT License',
    mitParrafo1: MIT_PARRAFO_1,
    mitParrafo2: MIT_PARRAFO_2,
    oflTitulo: 'SIL Open Font License 1.1',
    oflTexto: OFL_TEXTO,
    contactoTitulo: '8. Contact',
    contactoIntro:
      'If you have any questions about the licenses or attributions, you can contact us at:',
    contactoEmailEtiqueta: 'Email:',
    contactoDireccionEtiqueta: 'Address:',
    contactoDireccion: 'Calle Fitness 123, 28001 Madrid, Spain',
  },
};
