import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Group,
  LinearFilter,
  Mesh,
  NormalBlending,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';

/**
 * Escena WebGL de hidratación: una silueta humana hecha de partículas GPU que se
 * comporta como una vasija de cristal y se LLENA de agua hasta tu nivel. El agua
 * sumergida brilla cian, la superficie chispea espuma con oleaje, suben burbujas
 * y el contorno de cristal queda siempre visible. Detrás flota el número de litros
 * gigante y translúcido (igual que el reloj de la secuencia de ayuno).
 *
 * Todo el movimiento se calcula en el vertex shader a partir de uTiempo y uNivel:
 * cero subidas de buffer por frame. Glow en doble pasada (núcleo + halo aditivo).
 */

const CAMPO_VISION = 34;
const ALTO_MUNDO = 10;
const ALTO_CUERPO = 8.6;
const ANCHO_CUERPO = (ALTO_CUERPO * 240) / 540;
const PROF_CUERPO = 0.42;
const PARTICULAS_AGUA = 14000;
const PARTICULAS_BORDE = 5200;
const BURBUJAS = 460;
const MOTAS = 120;
const TOPE_DPR = 1.5;

/* Contorno del cuerpo (viewBox 240x540) usado para rasterizar y muestrear. */
const RUTA_CUERPO =
  'M 120 10 C 111.67 10, 100.18 9.97, 95 15 C 89.7 20.15, 88.24 32.72, 89 41 C 89.74 49.03, 95.22 57.19, 99 64 C 102.32 69.99, 111.27 75.82, 110 80 C 108.51 84.93, 92.73 86.17, 85 90 C 77.81 93.57, 69.65 95.94, 65 102 C 59.81 108.77, 58.96 119.74, 57 130 C 54.69 142.05, 53.23 157.4, 53 170 C 52.79 181.25, 53.33 192.66, 55 202 C 56.35 209.53, 57.82 220.98, 61 222 C 63.35 222.75, 67.61 218.95, 70 215 C 74.45 207.63, 74.45 188.71, 77 176 C 79.46 163.73, 82.54 139.99, 85 140 C 87.16 140.01, 89.36 158.32, 91 168 C 92.74 178.27, 95.72 189.24, 95 200 C 94.24 211.23, 88.62 221.28, 86 234 C 82.74 249.85, 80.13 269.34, 78 288 C 75.72 307.92, 74.46 328.55, 73 350 C 71.43 373.09, 70.01 398.52, 69 422 C 68.04 444.47, 67.61 471.9, 67 488 C 66.65 497.3, 62.17 505.47, 66 510 C 70.71 515.57, 93.3 518.45, 99 514 C 103.86 510.21, 101 500.05, 102 490 C 103.67 473.12, 105.51 444.84, 107 422 C 108.51 398.84, 109.6 374.23, 111 352 C 112.28 331.75, 113.1 310.14, 115 294 C 116.37 282.33, 118.33 264, 120 264 C 121.67 264, 123.63 282.33, 125 294 C 126.9 310.14, 127.72 331.75, 129 352 C 130.4 374.23, 131.49 398.84, 133 422 C 134.49 444.84, 136.33 473.12, 138 490 C 139 500.05, 136.14 510.21, 141 514 C 146.7 518.45, 169.29 515.57, 174 510 C 177.83 505.47, 173.35 497.3, 173 488 C 172.39 471.9, 171.96 444.47, 171 422 C 169.99 398.52, 168.57 373.09, 167 350 C 165.54 328.55, 164.28 307.92, 162 288 C 159.87 269.34, 157.26 249.85, 154 234 C 151.38 221.28, 145.76 211.23, 145 200 C 144.28 189.24, 147.26 178.27, 149 168 C 150.64 158.32, 152.84 140.01, 155 140 C 157.46 139.99, 160.54 163.73, 163 176 C 165.55 188.71, 165.55 207.63, 170 215 C 172.39 218.95, 176.65 222.75, 179 222 C 182.18 220.98, 183.65 209.53, 185 202 C 186.67 192.66, 187.21 181.25, 187 170 C 186.77 157.4, 185.31 142.05, 183 130 C 181.04 119.74, 180.19 108.77, 175 102 C 170.35 95.94, 162.19 93.57, 155 90 C 147.27 86.17, 131.49 84.93, 130 80 C 128.73 75.82, 137.68 69.99, 141 64 C 144.78 57.19, 150.26 49.03, 151 41 C 151.76 32.72, 150.3 20.15, 145 15 C 139.82 9.97, 128.33 10, 120 10 Z';

const PALETA_GLSL = `
  const vec3 AGUA_PROFUNDA = vec3(0.06, 0.34, 0.62);
  const vec3 AGUA_CLARA    = vec3(0.26, 0.74, 0.96);
  const vec3 ESPUMA        = vec3(0.82, 0.97, 1.0);
  const vec3 CRISTAL       = vec3(0.36, 0.62, 0.80);
`;

const VERTICE_CUERPO = `
  uniform float uTiempo;
  uniform float uNivel;
  uniform float uEscala;
  uniform float uHalo;
  uniform float uMitadAlto;
  uniform float uApertura; // 0 sin hover .. 1 hover activo sobre el cuerpo
  uniform vec2 uPuntero;   // cursor en el espacio LOCAL del cuerpo (xy)
  attribute vec4 aDatos;
  varying vec3 vColor;
  varying float vAlfa;

  ${PALETA_GLSL}

  void main() {
    float tamano = aDatos.x;
    float semilla = aDatos.y;
    float tipo = aDatos.z;
    float altura = aDatos.w; // 0 pies .. 1 cabeza

    vec3 p = position;

    // Oleaje de la superficie: ondula la lámina de agua segun x y tiempo
    float onda = sin(p.x * 2.6 + uTiempo * 1.5 + semilla * 0.6) * 0.5
               + sin(p.x * 4.9 - uTiempo * 1.05) * 0.3;
    float nivelOnda = uNivel + onda * 0.012;
    float dSup = altura - nivelOnda; // <0 sumergido, >0 al aire

    float sumergido = 1.0 - smoothstep(-0.012, 0.018, dSup);
    float superficie = exp(-pow(dSup * 26.0, 2.0));
    float prof = clamp(p.z / ${PROF_CUERPO.toFixed(2)} * 0.5 + 0.5, 0.0, 1.0);

    // Respiración global muy sutil para que nunca quede del todo quieto
    p.x += sin(uTiempo * 0.32 + altura * 3.0) * 0.018;

    // --- Apertura LOCAL al cursor: SOLO la zona bajo el ratón se "agrieta" abriendo
    // una grieta de luz (como un hielo que se rompe donde lo tocas); el resto del
    // cuerpo queda intacto. uPuntero = cursor en espacio local; uApertura = fuerza 0..1.
    float ap = uApertura;
    float local = 0.0;
    if (ap > 0.0008) {
      float dCursor = distance(p.xy, uPuntero);
      float radio = 1.7;                              // tamaño del foco que se abre
      local = ap * smoothstep(radio, 0.18, dCursor);  // 1 junto al cursor .. 0 lejos
      if (local > 0.0008) {
        vec2 fuera = (p.xy - uPuntero) / (dCursor + 1e-4);
        p.xy += fuera * local * 1.05;                 // aparta las partículas: abre el hueco
        p.z += (p.z >= 0.0 ? 1.0 : -1.0) * local * 0.5; // pizca de volumen 3D en el trozo
        p.x += sin(semilla * 31.0 + uTiempo * 2.2) * 0.06 * local;
        p.y += cos(semilla * 23.0 + uTiempo * 1.9) * 0.06 * local;
      }
    }

    // --- Burbujas (tipo 2): nacen sumergidas, ascienden y estallan en superficie ---
    if (tipo > 1.5) {
      float vel = 0.12 + semilla * 0.22;
      float subida = fract(uTiempo * vel + semilla * 7.0);
      float alturaB = altura + subida * (uNivel - altura + 0.04);
      p.y += subida * (uNivel - altura + 0.04) * (2.0 * uMitadAlto);
      p.x += sin(uTiempo * 2.2 + semilla * 11.0) * 0.05;
      float dB = alturaB - uNivel;
      float vivaB = smoothstep(0.0, 0.04, subida) * (1.0 - smoothstep(-0.02, 0.0, dB));
      vColor = mix(AGUA_CLARA, ESPUMA, 0.6);
      float tamB = tamano * uEscala * (0.6 + 0.6 * prof) * mix(1.0, 2.6, uHalo);
      gl_PointSize = clamp(tamB / -(modelViewMatrix * vec4(p, 1.0)).z, 1.0, 90.0);
      vAlfa = mix(vivaB * 0.85, vivaB * 0.05, uHalo);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      return;
    }

    // Desplazamiento por oleaje, máximo justo en la superficie
    float cercaSup = exp(-pow(dSup * 14.0, 2.0));
    if (tipo < 0.5) {
      p.y += onda * 0.10 * cercaSup;
      p.x += sin(uTiempo * 0.6 + semilla * 9.0) * 0.02 * sumergido;
    }

    vec3 color;
    float brillo;
    float alfa;

    if (tipo < 0.5) {
      // AGUA: profunda abajo, clara arriba, espuma en la lámina
      color = mix(AGUA_PROFUNDA, AGUA_CLARA, smoothstep(0.0, uNivel + 0.001, altura));
      color = mix(color, ESPUMA, superficie * 0.6);
      brillo = (0.4 + prof * 0.7) * sumergido + superficie * 0.6;
      alfa = sumergido * (0.5 + prof * 0.45) + superficie * 0.6;
    } else {
      // BORDE de cristal: siempre tenue; brilla mojado bajo el agua
      color = mix(CRISTAL, AGUA_CLARA, sumergido * 0.7);
      color = mix(color, ESPUMA, superficie * 0.6);
      brillo = 0.5 + sumergido * 0.6 + superficie * 0.8;
      alfa = 0.22 + sumergido * 0.34 + superficie * 0.5;
    }

    float titileo = 0.88 + 0.12 * sin(uTiempo * (1.1 + semilla * 2.2) + semilla * 40.0);
    vColor = color * (0.55 + brillo * 0.7) + ESPUMA * local * 1.8; // borde de la grieta: luz

    vec4 posVista = modelViewMatrix * vec4(p, 1.0);
    float tam = tamano * uEscala * (0.5 + 0.85 * prof) * (1.0 + superficie * 0.7) * titileo;
    tam *= mix(1.0, 3.2, uHalo);
    tam *= 1.0 + local * 1.6; // partículas del borde de la grieta mas grandes (brillan)
    gl_PointSize = clamp(tam / -posVista.z, 1.0, 130.0);

    vAlfa = mix(clamp(alfa, 0.0, 1.0) * 0.9, clamp(alfa, 0.0, 1.0) * 0.03, uHalo);
    vAlfa = clamp(vAlfa + local * 0.65, 0.0, 1.0);
    gl_Position = projectionMatrix * posVista;
  }
`;

const FRAGMENTO_PARTICULA = `
  varying vec3 vColor;
  varying float vAlfa;

  void main() {
    vec2 centro = gl_PointCoord - 0.5;
    float disco = 1.0 - smoothstep(0.12, 0.5, length(centro));
    float alfa = disco * vAlfa;
    if (alfa < 0.004) discard;
    gl_FragColor = vec4(vColor, alfa);
  }
`;

const VERTICE_MOTA = `
  uniform float uTiempo;
  uniform float uEscala;
  attribute vec3 aExtra;
  varying vec3 vColor;
  varying float vAlfa;

  void main() {
    float tamano = aExtra.x;
    float semilla = aExtra.y;
    float opacidad = aExtra.z;

    vec3 p = position;
    p.x += sin(uTiempo * 0.05 + semilla * 9.0) * 0.7;
    p.y += cos(uTiempo * 0.04 + semilla * 13.0) * 0.5;

    vColor = mix(vec3(0.20, 0.50, 0.74), vec3(0.55, 0.85, 1.0), semilla);
    vAlfa = opacidad * (0.6 + 0.4 * sin(uTiempo * 0.3 + semilla * 21.0));

    vec4 posVista = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = clamp(tamano * uEscala / -posVista.z, 2.0, 170.0);
    gl_Position = projectionMatrix * posVista;
  }
`;

const VERTICE_PLANO = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENTO_NUMERO = `
  uniform sampler2D uMapa;
  varying vec2 vUv;
  void main() {
    vec4 textura = texture2D(uMapa, vUv);
    if (textura.a < 0.04) discard;
    vec3 color = mix(vec3(0.28, 0.60, 0.82), vec3(0.70, 0.92, 1.0), vUv.y) + vec3(0.12);
    gl_FragColor = vec4(color, textura.a * 0.34);
  }
`;

function aleatorioGaussiano(): number {
  const u = Math.random() || 1e-6;
  const v = Math.random() || 1e-6;
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

interface Muestras {
  relleno: Array<[number, number]>;
  borde: Array<[number, number]>;
  ancho: number;
  alto: number;
}

/** Rasteriza la silueta y muestrea píxeles interiores y de borde. */
function muestrearCuerpo(): Muestras {
  const ancho = 240;
  const alto = 540;
  const lienzo = document.createElement('canvas');
  lienzo.width = ancho;
  lienzo.height = alto;
  const ctx = lienzo.getContext('2d');
  const relleno: Array<[number, number]> = [];
  const borde: Array<[number, number]> = [];

  if (!ctx) {
    return { relleno, borde, ancho, alto };
  }

  ctx.fillStyle = '#fff';
  ctx.fill(new Path2D(RUTA_CUERPO));
  const datos = ctx.getImageData(0, 0, ancho, alto).data;
  const lleno = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < ancho && y < alto && datos[(y * ancho + x) * 4 + 3] > 128;

  for (let y = 0; y < alto; y += 1) {
    for (let x = 0; x < ancho; x += 1) {
      if (!lleno(x, y)) {
        continue;
      }
      relleno.push([x, y]);
      if (!lleno(x - 1, y) || !lleno(x + 1, y) || !lleno(x, y - 1) || !lleno(x, y + 1)) {
        borde.push([x, y]);
      }
    }
  }

  // Los píxeles ya están en `datos` (copia); libera el backing store del canvas temporal.
  lienzo.width = 0;
  lienzo.height = 0;

  return { relleno, borde, ancho, alto };
}

function construirGeometriaCuerpo(muestras: Muestras): BufferGeometry {
  const total = PARTICULAS_AGUA + PARTICULAS_BORDE + BURBUJAS;
  const posiciones = new Float32Array(total * 3);
  const datos = new Float32Array(total * 4);
  let indice = 0;

  const { relleno, borde, ancho, alto } = muestras;

  const anotar = (px: number, py: number, z: number, tamano: number, tipo: number) => {
    const x = (px / ancho - 0.5) * ANCHO_CUERPO;
    const y = (0.5 - py / alto) * ALTO_CUERPO;
    const altura = 1 - py / alto;
    posiciones[indice * 3] = x;
    posiciones[indice * 3 + 1] = y;
    posiciones[indice * 3 + 2] = z;
    datos[indice * 4] = tamano;
    datos[indice * 4 + 1] = Math.random();
    datos[indice * 4 + 2] = tipo;
    datos[indice * 4 + 3] = altura;
    indice += 1;
  };

  // Agua: relleno interior con profundidad (losa fina, ley de potencia de tamaños)
  for (let i = 0; i < PARTICULAS_AGUA && relleno.length; i += 1) {
    const [px, py] = relleno[(Math.random() * relleno.length) | 0];
    const z = Math.max(-PROF_CUERPO, Math.min(PROF_CUERPO, aleatorioGaussiano() * 0.18));
    const tamano = 0.02 + 0.05 * Math.pow(Math.random(), 2);
    anotar(px + Math.random() - 0.5, py + Math.random() - 0.5, z, tamano, 0);
  }

  // Borde de cristal: contorno siempre visible
  for (let i = 0; i < PARTICULAS_BORDE && borde.length; i += 1) {
    const [px, py] = borde[(Math.random() * borde.length) | 0];
    const z = aleatorioGaussiano() * 0.06;
    const tamano = 0.016 + 0.02 * Math.random();
    anotar(px + (Math.random() - 0.5) * 0.6, py + (Math.random() - 0.5) * 0.6, z, tamano, 1);
  }

  // Burbujas: nacen en la mitad inferior del cuerpo
  const inferiores = relleno.filter(([, py]) => py / alto > 0.45);
  for (let i = 0; i < BURBUJAS && inferiores.length; i += 1) {
    const [px, py] = inferiores[(Math.random() * inferiores.length) | 0];
    const z = aleatorioGaussiano() * 0.16;
    const tamano = 0.022 + 0.026 * Math.random();
    anotar(px, py, z, tamano, 2);
  }

  const geometria = new BufferGeometry();
  geometria.setAttribute('position', new BufferAttribute(posiciones.subarray(0, indice * 3), 3));
  geometria.setAttribute('aDatos', new BufferAttribute(datos.subarray(0, indice * 4), 4));
  return geometria;
}

function construirGeometriaMotas(): BufferGeometry {
  const posiciones = new Float32Array(MOTAS * 3);
  const extras = new Float32Array(MOTAS * 3);

  for (let i = 0; i < MOTAS; i += 1) {
    posiciones[i * 3] = (Math.random() - 0.5) * 22;
    posiciones[i * 3 + 1] = (Math.random() - 0.5) * 11;
    posiciones[i * 3 + 2] = Math.random() < 0.2 ? 5 + Math.random() * 4 : -6 + Math.random() * 8;
    extras[i * 3] = 0.25 + Math.random() * 0.8;
    extras[i * 3 + 1] = Math.random();
    extras[i * 3 + 2] = 0.015 + Math.random() * 0.03;
  }

  const geometria = new BufferGeometry();
  geometria.setAttribute('position', new BufferAttribute(posiciones, 3));
  geometria.setAttribute('aExtra', new BufferAttribute(extras, 3));
  return geometria;
}

export class EscenaCuerpoAgua {
  private readonly renderizador: WebGLRenderer;
  private readonly escena = new Scene();
  private readonly camara: PerspectiveCamera;
  private readonly grupoCuerpo = new Group();

  private readonly geometriaCuerpo: BufferGeometry;
  private readonly geometriaMotas: BufferGeometry;
  private readonly materialNucleo: ShaderMaterial;
  private readonly materialHalo: ShaderMaterial;
  private readonly materialMotas: ShaderMaterial;
  private readonly materialNumero: ShaderMaterial;
  private readonly geometriaNumero: PlaneGeometry;
  private readonly numero: Mesh;

  private readonly lienzoTexto: HTMLCanvasElement;
  private readonly contextoTexto: CanvasRenderingContext2D | null;
  private readonly texturaTexto: CanvasTexture;

  private anchoMundo = ALTO_MUNDO * 1.6;
  private ratonX = 0;
  private ratonY = 0;
  private camaraX = 0;
  private camaraY = 0;
  private nivelActual = 0;
  private nivelObjetivo = 0;
  private aperturaActual = 0;
  private aperturaObjetivo = 0;
  private textoActual = '';

  constructor(lienzo: HTMLCanvasElement) {
    this.renderizador = new WebGLRenderer({
      canvas: lienzo,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    this.renderizador.setClearColor(0x000000, 0);

    const distancia = ALTO_MUNDO / 2 / Math.tan((CAMPO_VISION / 2) * (Math.PI / 180));
    this.camara = new PerspectiveCamera(CAMPO_VISION, 1.6, 0.1, 60);
    this.camara.position.set(0, 0, distancia);

    const uniformes = {
      uTiempo: { value: 0 },
      uNivel: { value: 0 },
      uEscala: { value: 1000 },
      uMitadAlto: { value: ALTO_CUERPO / 2 },
      uApertura: { value: 0 },
      uPuntero: { value: new Vector2(0, 0) },
    };

    this.geometriaCuerpo = construirGeometriaCuerpo(muestrearCuerpo());
    this.materialNucleo = new ShaderMaterial({
      vertexShader: VERTICE_CUERPO,
      fragmentShader: FRAGMENTO_PARTICULA,
      uniforms: { ...uniformes, uHalo: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    this.materialHalo = new ShaderMaterial({
      vertexShader: VERTICE_CUERPO,
      fragmentShader: FRAGMENTO_PARTICULA,
      uniforms: {
        uTiempo: uniformes.uTiempo,
        uNivel: uniformes.uNivel,
        uEscala: uniformes.uEscala,
        uMitadAlto: uniformes.uMitadAlto,
        uApertura: uniformes.uApertura,
        uPuntero: uniformes.uPuntero,
        uHalo: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    const nucleo = new Points(this.geometriaCuerpo, this.materialNucleo);
    const halo = new Points(this.geometriaCuerpo, this.materialHalo);
    nucleo.frustumCulled = false;
    halo.frustumCulled = false;
    nucleo.renderOrder = 3;
    halo.renderOrder = 2;
    this.grupoCuerpo.add(halo, nucleo);
    this.escena.add(this.grupoCuerpo);

    this.geometriaMotas = construirGeometriaMotas();
    this.materialMotas = new ShaderMaterial({
      vertexShader: VERTICE_MOTA,
      fragmentShader: FRAGMENTO_PARTICULA,
      uniforms: { uTiempo: uniformes.uTiempo, uEscala: uniformes.uEscala },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const motas = new Points(this.geometriaMotas, this.materialMotas);
    motas.frustumCulled = false;
    motas.renderOrder = 4;
    this.escena.add(motas);

    // Número de litros gigante y translúcido, detrás del cuerpo
    this.lienzoTexto = document.createElement('canvas');
    this.lienzoTexto.width = 2048;
    this.lienzoTexto.height = 1024;
    this.contextoTexto = this.lienzoTexto.getContext('2d');
    this.texturaTexto = new CanvasTexture(this.lienzoTexto);
    this.texturaTexto.minFilter = LinearFilter;

    this.materialNumero = new ShaderMaterial({
      vertexShader: VERTICE_PLANO,
      fragmentShader: FRAGMENTO_NUMERO,
      uniforms: { uMapa: { value: this.texturaTexto } },
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
    });
    this.geometriaNumero = new PlaneGeometry(8, 4);
    this.numero = new Mesh(this.geometriaNumero, this.materialNumero);
    this.numero.frustumCulled = false;
    this.numero.position.z = -1.6;
    this.numero.renderOrder = 1;
    this.escena.add(this.numero);
  }

  redimensionar(ancho: number, alto: number): void {
    if (!ancho || !alto) {
      return;
    }

    const proporcion = Math.min(window.devicePixelRatio || 1, TOPE_DPR);
    this.renderizador.setPixelRatio(proporcion);
    this.renderizador.setSize(ancho, alto, false);

    this.camara.aspect = ancho / alto;
    this.camara.updateProjectionMatrix();

    this.anchoMundo = ALTO_MUNDO * this.camara.aspect;

    const altoDispositivo = alto * proporcion;
    const escala = altoDispositivo / (2 * Math.tan((CAMPO_VISION / 2) * (Math.PI / 180)));
    this.materialNucleo.uniforms['uEscala'].value = escala;

    // Cuerpo a la izquierda; número gigante centrado y visible detrás del HUD
    this.grupoCuerpo.position.x = -this.anchoMundo * 0.3;
    const anchoNumero = Math.min(this.anchoMundo * 0.5, 9);
    this.numero.scale.set(anchoNumero / 8, anchoNumero / 8, 1);
    this.numero.position.x = -this.anchoMundo * 0.08;
    this.numero.position.y = 0.4;
  }

  apuntarRaton(x: number, y: number): void {
    this.ratonX = x;
    this.ratonY = y;
  }

  /**
   * Recibe el puntero en coordenadas normalizadas del canvas (-1..1, dentro=si el
   * cursor está sobre el lienzo) y calcula cuánto debe "abrirse" el cuerpo según
   * la cercanía al muñeco. El muñeco vive en la mitad izquierda (su centro NDC en
   * x es grupoCuerpo.position.x / (anchoMundo/2)), así que el HUD de la derecha no
   * lo dispara. Región generosa para no obligar a apuntar a la silueta fina.
   */
  fijarPuntero(cx: number, cy: number, dentro: boolean): void {
    if (!dentro) {
      this.aperturaObjetivo = 0;
      return;
    }
    // Cursor (NDC del canvas, -1..1) -> mundo -> espacio LOCAL del cuerpo, para que la
    // grieta de luz se abra EXACTAMENTE bajo el raton.
    const mundoX = cx * (this.anchoMundo / 2);
    const mundoY = -cy * (ALTO_MUNDO / 2);
    const localX = mundoX - this.grupoCuerpo.position.x;
    const localY = mundoY - this.grupoCuerpo.position.y;
    this.materialNucleo.uniforms['uPuntero'].value.set(localX, localY);
    // Solo se activa si el cursor esta sobre (o muy cerca de) la silueta.
    const margenX = ANCHO_CUERPO / 2 + 1.4;
    const margenY = ALTO_CUERPO / 2 + 0.6;
    const sobreCuerpo = Math.abs(localX) < margenX && Math.abs(localY) < margenY;
    this.aperturaObjetivo = sobreCuerpo ? 1.0 : 0.0;
  }

  fijarNivel(fraccion: number, inmediato = false): void {
    this.nivelObjetivo = Math.max(0, Math.min(1, fraccion));
    if (inmediato) {
      this.nivelActual = this.nivelObjetivo;
      this.materialNucleo.uniforms['uNivel'].value = this.nivelActual;
    }
  }

  fijarTexto(texto: string): void {
    if (texto === this.textoActual || !this.contextoTexto) {
      return;
    }
    this.textoActual = texto;

    const contexto = this.contextoTexto;
    const w = this.lienzoTexto.width;
    const h = this.lienzoTexto.height;
    contexto.clearRect(0, 0, w, h);
    contexto.font = '900 520px Anton, "Archivo", sans-serif';
    contexto.textAlign = 'center';
    contexto.textBaseline = 'middle';
    contexto.fillStyle = 'rgba(255, 255, 255, 0.9)';
    contexto.fillText(texto, w / 2, h / 2 + 18);
    this.texturaTexto.needsUpdate = true;
  }

  renderizar(milisegundos: number): void {
    const segundos = milisegundos / 1000;
    this.materialNucleo.uniforms['uTiempo'].value = segundos;
    this.materialMotas.uniforms['uTiempo'].value = segundos;

    this.nivelActual += (this.nivelObjetivo - this.nivelActual) * 0.06;
    this.materialNucleo.uniforms['uNivel'].value = this.nivelActual;

    // Apertura por hover: ease suave hacia el objetivo; el halo comparte el uniform.
    this.aperturaActual += (this.aperturaObjetivo - this.aperturaActual) * 0.09;
    this.materialNucleo.uniforms['uApertura'].value = this.aperturaActual;

    // El cuerpo NO gira: el efecto de abrir es LOCAL al cursor (solo se agrieta la zona
    // bajo el raton), asi que la figura se queda de frente y el hueco de luz aparece
    // justo donde apunta el puntero.
    this.grupoCuerpo.rotation.y = 0;
    this.grupoCuerpo.rotation.x = 0;

    // Camara: solo deriva suave de fondo (sin seguir al raton), para que el cuerpo no
    // se desplace bajo el cursor y la grieta quede alineada con el puntero.
    const objetivoX = Math.sin(segundos * 0.05) * 0.16;
    const objetivoY = Math.cos(segundos * 0.04) * 0.12;
    this.camaraX += (objetivoX - this.camaraX) * 0.04;
    this.camaraY += (objetivoY - this.camaraY) * 0.04;
    this.camara.position.x = this.camaraX;
    this.camara.position.y = this.camaraY;
    this.camara.lookAt(0, 0, 0);

    this.renderizador.render(this.escena, this.camara);
  }

  destruir(): void {
    this.geometriaCuerpo.dispose();
    this.geometriaMotas.dispose();
    this.geometriaNumero.dispose();
    this.materialNucleo.dispose();
    this.materialHalo.dispose();
    this.materialMotas.dispose();
    this.materialNumero.dispose();
    this.texturaTexto.dispose();
    this.renderizador.dispose();
    this.renderizador.forceContextLoss();
  }
}

export function crearEscenaCuerpoAgua(lienzo: HTMLCanvasElement): EscenaCuerpoAgua {
  return new EscenaCuerpoAgua(lienzo);
}
