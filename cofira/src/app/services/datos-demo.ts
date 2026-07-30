import { ComidasPorFecha, MenuGuardado, TipoComida } from '../models/alimentacion.model';
import { RutinaGenerada } from '../models/gimnasio.model';

/* Contenido de DEMOSTRACIÓN para cuentas gratis: un plan real y apetecible que
   enseña toda la app. Es estático (coste cero por cuenta), así que crearse mil
   cuentas gratis no da acceso a nada que cueste dinero: la IA sigue tras PRO. */

interface PlatoDemo {
  nombre: string;
  kcal: number;
  prot: number;
  carb: number;
  gras: number;
  alimentos: { descripcion: string; cantidad: string; gramos: number }[];
  preparacion: string;
}

type DiaDemo = { desayuno: PlatoDemo; comida: PlatoDemo; cena: PlatoDemo };

const PLANTILLAS_DEMO: DiaDemo[] = [
  {
    desayuno: {
      nombre: 'Tostadas integrales con tomate, AOVE y jamón',
      kcal: 640, prot: 28, carb: 78, gras: 24,
      alimentos: [
        { descripcion: 'Pan integral', cantidad: '2 rebanadas', gramos: 120 },
        { descripcion: 'Tomate rallado', cantidad: '1 tomate', gramos: 100 },
        { descripcion: 'Jamón serrano', cantidad: '4 lonchas', gramos: 60 },
        { descripcion: 'Aceite de oliva virgen extra', cantidad: '1 cucharada', gramos: 15 },
      ],
      preparacion: '1. Tuesta el pan 2-3 min hasta que quede dorado. 2. Ralla el tomate y úntalo con una pizca de sal. 3. Riega con el AOVE y termina con el jamón por encima.',
    },
    comida: {
      nombre: 'Salmón a la plancha con quinoa y verduras',
      kcal: 1290, prot: 68, carb: 172, gras: 34,
      alimentos: [
        { descripcion: 'Salmón fresco', cantidad: '1 lomo', gramos: 200 },
        { descripcion: 'Quinoa cocida', cantidad: '1 taza y media', gramos: 280 },
        { descripcion: 'Calabacín y pimiento', cantidad: '1 plato', gramos: 200 },
        { descripcion: 'Limón', cantidad: 'medio', gramos: 30 },
      ],
      preparacion: '1. Calienta la sartén fuerte y marca el salmón 3 min por cada cara. 2. Saltea el calabacín y el pimiento 5 min a fuego medio-alto. 3. Sirve sobre la quinoa caliente y exprime el limón por encima.',
    },
    cena: {
      nombre: 'Revuelto de huevos con espinacas y arroz',
      kcal: 1050, prot: 53, carb: 160, gras: 25,
      alimentos: [
        { descripcion: 'Huevos', cantidad: '3 unidades', gramos: 180 },
        { descripcion: 'Espinacas frescas', cantidad: '2 puñados', gramos: 120 },
        { descripcion: 'Arroz integral', cantidad: '1 taza y media', gramos: 260 },
        { descripcion: 'Yogur griego', cantidad: '1 unidad', gramos: 125 },
      ],
      preparacion: '1. Saltea las espinacas 2 min hasta que bajen. 2. Añade los huevos batidos y cuaja 3-4 min a fuego medio removiendo. 3. Acompaña con el arroz caliente y deja el yogur de postre.',
    },
  },
  {
    desayuno: {
      nombre: 'Porridge de avena con plátano y nueces',
      kcal: 680, prot: 24, carb: 96, gras: 22,
      alimentos: [
        { descripcion: 'Copos de avena', cantidad: '1 taza', gramos: 90 },
        { descripcion: 'Leche semidesnatada', cantidad: '1 vaso', gramos: 250 },
        { descripcion: 'Plátano', cantidad: '1 unidad', gramos: 120 },
        { descripcion: 'Nueces', cantidad: '1 puñado', gramos: 25 },
      ],
      preparacion: '1. Calienta la leche y cuece la avena 5 min a fuego suave removiendo. 2. Deja reposar 1 min fuera del fuego. 3. Corona con el plátano en rodajas y las nueces.',
    },
    comida: {
      nombre: 'Pollo al horno con boniato y ensalada',
      kcal: 1260, prot: 74, carb: 158, gras: 32,
      alimentos: [
        { descripcion: 'Pechuga de pollo', cantidad: '1 pieza grande', gramos: 220 },
        { descripcion: 'Boniato asado', cantidad: '1 grande', gramos: 300 },
        { descripcion: 'Ensalada mixta', cantidad: '1 bol', gramos: 150 },
        { descripcion: 'Aceite de oliva virgen extra', cantidad: '1 cucharada', gramos: 15 },
      ],
      preparacion: '1. Precalienta el horno a 200 °C. 2. Hornea el pollo y el boniato 25 min (dale la vuelta a mitad). 3. Aliña la ensalada con AOVE y una pizca de sal justo antes de servir.',
    },
    cena: {
      nombre: 'Pasta integral con atún y tomate',
      kcal: 1040, prot: 51, carb: 155, gras: 27,
      alimentos: [
        { descripcion: 'Pasta integral', cantidad: '1 plato', gramos: 120 },
        { descripcion: 'Atún al natural', cantidad: '2 latas', gramos: 120 },
        { descripcion: 'Salsa de tomate casera', cantidad: '1 cazo', gramos: 150 },
        { descripcion: 'Queso rallado', cantidad: '2 cucharadas', gramos: 20 },
      ],
      preparacion: '1. Cuece la pasta 9-11 min en agua con sal hasta dejarla al dente. 2. Calienta la salsa de tomate 3 min y mezcla con el atún escurrido. 3. Junta todo y termina con el queso rallado por encima.',
    },
  },
  {
    desayuno: {
      nombre: 'Yogur griego con granola y frutos rojos',
      kcal: 620, prot: 30, carb: 74, gras: 22,
      alimentos: [
        { descripcion: 'Yogur griego', cantidad: '2 unidades', gramos: 250 },
        { descripcion: 'Granola', cantidad: 'media taza', gramos: 60 },
        { descripcion: 'Frutos rojos', cantidad: '1 puñado', gramos: 100 },
        { descripcion: 'Miel', cantidad: '1 cucharadita', gramos: 10 },
      ],
      preparacion: '1. Pon la mitad del yogur en un vaso y cubre con granola. 2. Repite la capa con el resto y añade los frutos rojos. 3. Termina con un hilo de miel por encima.',
    },
    comida: {
      nombre: 'Lentejas estofadas con verduras y huevo',
      kcal: 1300, prot: 66, carb: 178, gras: 33,
      alimentos: [
        { descripcion: 'Lentejas cocidas', cantidad: '2 tazas', gramos: 350 },
        { descripcion: 'Zanahoria y puerro', cantidad: '1 taza', gramos: 150 },
        { descripcion: 'Huevo cocido', cantidad: '2 unidades', gramos: 120 },
        { descripcion: 'Pan integral', cantidad: '1 rebanada', gramos: 60 },
      ],
      preparacion: '1. Sofríe la zanahoria y el puerro 5 min a fuego medio. 2. Añade las lentejas cocidas y estofa 15 min a fuego suave con un poco de agua. 3. Sirve con el huevo cocido en cuartos y el pan.',
    },
    cena: {
      nombre: 'Merluza al vapor con patata y brócoli',
      kcal: 1030, prot: 55, carb: 152, gras: 26,
      alimentos: [
        { descripcion: 'Merluza', cantidad: '2 lomos', gramos: 220 },
        { descripcion: 'Patata cocida', cantidad: '2 medianas', gramos: 300 },
        { descripcion: 'Brócoli', cantidad: '1 taza', gramos: 150 },
        { descripcion: 'Aceite de oliva virgen extra', cantidad: '1 cucharada', gramos: 15 },
      ],
      preparacion: '1. Pon la patata al vapor 12 min; añade el brócoli a los 6 min. 2. Incorpora la merluza y cocina 6-8 min más hasta que esté jugosa. 3. Aliña con AOVE y una pizca de pimentón.',
    },
  },
];

function formatearFechaDemo(fecha: Date): string {
  const ano = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/** Menú de ejemplo de 7 días anclado a HOY (siempre vigente para el demo). */
export function construirMenuDemo(): MenuGuardado {
  const tipos: TipoComida[] = ['desayuno', 'comida', 'cena'];
  const comidasPorFecha: ComidasPorFecha = {};
  const hoy = new Date();
  let contadorComida = 1;
  let contadorAlimento = 1;

  for (let indiceDia = 0; indiceDia < 7; indiceDia++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + indiceDia);
    const plantilla = PLANTILLAS_DEMO[indiceDia % 3];

    const comidasDelDia = tipos.map((tipo) => {
      const plato = plantilla[tipo as keyof DiaDemo];
      const alimentos = plato.alimentos.map((alimento) => ({
        id: contadorAlimento++,
        descripcion: alimento.descripcion,
        icono: 'plato' as const,
        cantidad: alimento.cantidad,
        gramos: alimento.gramos,
      }));
      return {
        id: contadorComida++,
        tipo,
        nombre: plato.nombre,
        caloriasEstimadas: plato.kcal,
        proteinasGramos: plato.prot,
        carbohidratosGramos: plato.carb,
        grasasGramos: plato.gras,
        alimentos,
        preparacion: plato.preparacion,
      };
    });

    const resumen = {
      caloriasTotal: comidasDelDia.reduce((total, comida) => total + comida.caloriasEstimadas, 0),
      proteinasTotal: comidasDelDia.reduce((total, comida) => total + comida.proteinasGramos, 0),
      carbohidratosTotal: comidasDelDia.reduce((total, comida) => total + comida.carbohidratosGramos, 0),
      grasasTotal: comidasDelDia.reduce((total, comida) => total + comida.grasasGramos, 0),
    };

    comidasPorFecha[formatearFechaDemo(fecha)] = { comidas: comidasDelDia, resumenNutricional: resumen };
  }

  const fin = new Date(hoy);
  fin.setDate(hoy.getDate() + 6);
  return {
    fechaInicio: formatearFechaDemo(hoy),
    fechaFin: formatearFechaDemo(fin),
    comidasPorFecha,
  };
}

/** Rutina de ejemplo de 4 días (hipertrofia clásica). */
export const RUTINA_DEMO: RutinaGenerada = {
  diasEjercicio: [
    {
      diaSemana: 'Lunes',
      grupoMuscular: 'Pecho y tríceps',
      ejercicios: [
        { nombre: 'Press de banca', series: 4, repeticiones: '6-8', descansoSegundos: 120, descripcion: 'Baja la barra al pecho con control y empuja con fuerza.', grupoMuscular: 'Pecho', pesoSugeridoKg: 62.5 },
        { nombre: 'Press inclinado con mancuernas', series: 3, repeticiones: '8-10', descansoSegundos: 90, descripcion: 'Banco a 30 grados, codos a 45 del torso.', grupoMuscular: 'Pecho', pesoSugeridoKg: 24 },
        { nombre: 'Fondos en paralelas', series: 3, repeticiones: '8-12', descansoSegundos: 90, descripcion: 'Torso ligeramente inclinado, baja hasta 90 grados.', grupoMuscular: 'Tríceps' },
        { nombre: 'Extensión de tríceps en polea', series: 3, repeticiones: '10-12', descansoSegundos: 60, descripcion: 'Codos pegados al cuerpo, extiende sin balanceo.', grupoMuscular: 'Tríceps', pesoSugeridoKg: 30 },
      ],
    },
    {
      diaSemana: 'Martes',
      grupoMuscular: 'Espalda y bíceps',
      ejercicios: [
        { nombre: 'Peso muerto rumano', series: 4, repeticiones: '6-8', descansoSegundos: 150, descripcion: 'Cadera atrás, espalda neutra, barra pegada a las piernas.', grupoMuscular: 'Espalda baja', pesoSugeridoKg: 80 },
        { nombre: 'Dominadas', series: 4, repeticiones: '6-10', descansoSegundos: 120, descripcion: 'Agarre prono, pecho al frente, sube hasta la barbilla.', grupoMuscular: 'Dorsal' },
        { nombre: 'Remo con barra', series: 3, repeticiones: '8-10', descansoSegundos: 90, descripcion: 'Torso a 45 grados, lleva la barra al ombligo.', grupoMuscular: 'Dorsal', pesoSugeridoKg: 55 },
        { nombre: 'Curl de bíceps con barra', series: 3, repeticiones: '10-12', descansoSegundos: 60, descripcion: 'Codos fijos, sube sin balancear el torso.', grupoMuscular: 'Bíceps', pesoSugeridoKg: 27.5 },
      ],
    },
    {
      diaSemana: 'Jueves',
      grupoMuscular: 'Pierna completa',
      ejercicios: [
        { nombre: 'Sentadilla trasera', series: 4, repeticiones: '6-8', descansoSegundos: 150, descripcion: 'Baja hasta romper paralela con el core firme.', grupoMuscular: 'Cuádriceps', pesoSugeridoKg: 85 },
        { nombre: 'Zancadas con mancuernas', series: 3, repeticiones: '10 por pierna', descansoSegundos: 90, descripcion: 'Paso largo, rodilla atrás casi al suelo.', grupoMuscular: 'Glúteo', pesoSugeridoKg: 20 },
        { nombre: 'Curl femoral tumbado', series: 3, repeticiones: '10-12', descansoSegundos: 75, descripcion: 'Sube con control y aguanta arriba un segundo.', grupoMuscular: 'Femoral', pesoSugeridoKg: 40 },
        { nombre: 'Elevación de gemelos de pie', series: 4, repeticiones: '12-15', descansoSegundos: 60, descripcion: 'Sube al máximo y baja lento hasta estirar.', grupoMuscular: 'Gemelo', pesoSugeridoKg: 60 },
      ],
    },
    {
      diaSemana: 'Viernes',
      grupoMuscular: 'Hombro y core',
      ejercicios: [
        { nombre: 'Press militar con barra', series: 4, repeticiones: '6-8', descansoSegundos: 120, descripcion: 'De pie, core firme, empuja la barra por encima de la cabeza.', grupoMuscular: 'Hombro', pesoSugeridoKg: 42.5 },
        { nombre: 'Elevaciones laterales', series: 4, repeticiones: '12-15', descansoSegundos: 60, descripcion: 'Codos ligeramente flexionados, sube hasta la horizontal.', grupoMuscular: 'Hombro', pesoSugeridoKg: 10 },
        { nombre: 'Pájaros en banco inclinado', series: 3, repeticiones: '12-15', descansoSegundos: 60, descripcion: 'Pecho apoyado, abre hacia atrás apretando escápulas.', grupoMuscular: 'Hombro posterior', pesoSugeridoKg: 8 },
        { nombre: 'Plancha con peso', series: 3, repeticiones: '45-60 s', descansoSegundos: 60, descripcion: 'Cadera alineada, aprieta abdomen y glúteo.', grupoMuscular: 'Core' },
      ],
    },
  ],
};
