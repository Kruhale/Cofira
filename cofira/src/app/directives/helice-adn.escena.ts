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
  WebGLRenderer,
} from 'three';

/**
 * Escena WebGL de la "secuencia metabólica": doble hélice de ADN de partículas GPU
 * que llena la pantalla, con el reloj de ayuno entrelazado DENTRO de la escena
 * (oclusión real: las hebras cercanas pasan por delante de los dígitos y las
 * lejanas quedan detrás), pulsos de energía irregulares, filamentos secundarios,
 * chispas, bokeh y un "frente de combustión" alineado con la regla temporal del DOM.
 *
 * Todo el movimiento se calcula en el vertex shader a partir de uTiempo: cero
 * subidas de buffer por frame. El glow es doble pasada (núcleo + halo aditivo).
 */

const CAMPO_VISION = 34;
const ALTO_MUNDO = 10;
const PARTICULAS_POR_HEBRA = 8000;
const TRAVESANOS = 64;
const PUNTOS_POR_TRAVESANO = 84;
const PARTICULAS_FILAMENTO = 2200;
const PARTICULAS_CHISPA = 650;
const MOTAS_POLVO = 130;
const TOPE_DPR = 1.5;

/* El gradiente temporal vive entre el 4 % y el 73 % del ancho de pantalla
   (la misma franja que ocupa la regla del DOM); la hélice se prolonga un 14 %
   más allá de los bordes para que no se vea dónde nace. */
const FRANJA_GLSL = `
  const float SOBREANCHO = 1.14;
  float fraccionInstrumento(float progreso) {
    float fraccionX = 0.5 + (progreso - 0.5) * SOBREANCHO;
    return clamp((fraccionX - 0.04) / 0.69, 0.0, 1.0);
  }
`;

/* Anclas de color en sRGB directo (sin THREE.Color: WYSIWYG en el canvas).
   Narrativa de luminancia: cian acero apagado -> naranja al rojo vivo -> violeta denso. */
const PALETA_GLSL = `
  const vec3 CIAN_ACERO = vec3(0.32, 0.60, 0.74);
  const vec3 NARANJA_VIVO = vec3(1.0, 0.40, 0.05);
  const vec3 BLANCO_CALIDO = vec3(1.0, 0.82, 0.58);
  const vec3 VIOLETA_DENSO = vec3(0.50, 0.27, 0.88);

  vec3 colorDeFase(float fraccion) {
    vec3 color = mix(CIAN_ACERO, NARANJA_VIVO, smoothstep(0.32, 0.55, fraccion));
    return mix(color, VIOLETA_DENSO, smoothstep(0.80, 0.97, fraccion));
  }
`;

const VERTICE_HELICE = `
  uniform float uTiempo;
  uniform float uLargo;
  uniform float uRadio;
  uniform float uEscala;
  uniform float uFrente;
  uniform float uHalo;
  uniform float uZonaMin;
  uniform float uZonaMax;
  uniform float uZonaBrillo;
  attribute vec3 aDesvio;
  attribute vec3 aExtra;
  varying vec3 vColor;
  varying float vAlfa;

  const float PI = 3.14159265;
  const float VUELTAS = 4.5;
  ${FRANJA_GLSL}
  ${PALETA_GLSL}

  void main() {
    float progreso = position.x;
    float mezclaHebra = position.y;
    float radioEspiral = position.z;
    float tamanoBase = aExtra.x;
    float semilla = aExtra.y;
    float esChispa = aExtra.z;

    float giro = mod(uTiempo * 0.34, PI * 2.0);
    float angulo = progreso * VUELTAS * PI * 2.0 + giro;
    vec3 puntoA = vec3((progreso - 0.5) * uLargo, sin(angulo) * uRadio, cos(angulo) * uRadio);
    vec3 puntoB = vec3(puntoA.x, sin(angulo + PI) * uRadio, cos(angulo + PI) * uRadio);
    vec3 punto = mix(puntoA, puntoB, mezclaHebra);

    // La cinta entera ondula por la pantalla (eje vivo, no una barra recta)
    punto.y += sin(progreso * 4.2 - mod(uTiempo * 0.18, 6.2832)) * uRadio * 0.38;

    // Filamentos secundarios: espiral fina enroscada alrededor de la hebra
    float faseEspiral = progreso * 30.0 * PI * 2.0 + semilla * PI * 2.0 + mod(uTiempo * 0.6, PI * 2.0);
    punto.y += radioEspiral * uRadio * sin(faseEspiral);
    punto.z += radioEspiral * uRadio * cos(faseEspiral);

    // Chispas: nacen en la hebra, derivan hacia fuera y se apagan
    float vida = fract(uTiempo * (0.05 + semilla * 0.08) + semilla * 9.0);
    punto += aDesvio * mix(1.0, 1.0 + vida * 7.0, esChispa);

    float fraccion = fraccionInstrumento(progreso);

    // El clímax luminoso vive en la zona naranja; los extremos respiran apagados
    float zona = 0.66 + 0.42 * smoothstep(0.24, 0.42, fraccion) * (1.0 - smoothstep(0.80, 0.96, fraccion));

    // Frente de combustión: nudo blanco-caliente en la hora actual del ayuno
    float frente = exp(-pow((fraccion - uFrente) * 16.0, 2.0));

    // Pulsos de energía irregulares: velocidades inconmensurables + ventana lenta
    float d1 = fract(progreso - uTiempo * 0.029 + 0.13);
    d1 = min(d1, 1.0 - d1);
    float d2 = fract(progreso + uTiempo * 0.016 + 0.57);
    d2 = min(d2, 1.0 - d2);
    float pulso = exp(-pow(d1 * 26.0, 2.0)) * max(0.0, sin(uTiempo * 0.45 + 1.7))
                + exp(-pow(d2 * 30.0, 2.0)) * max(0.0, sin(uTiempo * 0.31));

    vec4 posicionVista = modelViewMatrix * vec4(punto, 1.0);
    float profundidad = clamp(punto.z / uRadio * 0.5 + 0.5, 0.0, 1.0);

    float brillo = (0.30 + profundidad * 0.95) * zona
                 + frente * 1.5
                 + pulso * (0.4 + profundidad * 0.7);

    // Peldanos de la escalera: barras tan protagonistas como las hebras
    // (0 en las hebras, 1 en el centro del travesano; las hebras quedan intactas)
    float esPeldano = sin(mezclaHebra * PI);
    brillo *= 1.0 + 0.8 * esPeldano;
    brillo *= mix(1.0, 1.0 - vida * 0.9, esChispa);

    // Foco de inspección: la fase bajo el ratón se enciende y el resto se atenúa
    float dentroZona = smoothstep(uZonaMin - 0.05, uZonaMin + 0.03, fraccion)
                     * (1.0 - smoothstep(uZonaMax - 0.03, uZonaMax + 0.05, fraccion));
    float focoZona = dentroZona * uZonaBrillo;
    brillo *= 1.0 + focoZona * 0.9;
    brillo *= 1.0 - uZonaBrillo * 0.3 * (1.0 - dentroZona);

    vec3 color = colorDeFase(fraccion);
    float calor = clamp(frente * 0.7 + pulso * 0.25 + (profundidad - 0.88) * 0.9, 0.0, 0.5);
    color = mix(color, BLANCO_CALIDO, calor);
    vColor = color * (0.55 + brillo * 0.75);

    float titileo = 0.86 + 0.14 * sin(uTiempo * (1.2 + semilla * 2.4) + semilla * 40.0);
    float tamano = tamanoBase * uEscala * (0.55 + 0.95 * profundidad) * (1.0 + pulso * 0.5) * titileo;
    tamano *= 1.0 + 1.0 * esPeldano;
    tamano *= 1.0 + focoZona * 0.22;
    tamano *= mix(1.0, 3.0, uHalo);
    gl_PointSize = clamp(tamano / -posicionVista.z, 1.0, 140.0);

    float alfaNucleo = clamp(brillo, 0.0, 1.0) * 0.85;
    vAlfa = mix(alfaNucleo, clamp(brillo, 0.0, 1.0) * 0.034, uHalo);
    gl_Position = projectionMatrix * posicionVista;
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

const VERTICE_POLVO = `
  uniform float uTiempo;
  uniform float uEscala;
  attribute vec3 aExtra;
  varying vec3 vColor;
  varying float vAlfa;

  ${PALETA_GLSL}

  void main() {
    float tamanoBase = aExtra.x;
    float semilla = aExtra.y;
    float opacidad = aExtra.z;

    vec3 punto = position;
    punto.x += sin(uTiempo * 0.05 + semilla * 9.0) * 0.7;
    punto.y += cos(uTiempo * 0.04 + semilla * 13.0) * 0.5;

    float fraccion = clamp(punto.x / 14.0 + 0.5, 0.0, 1.0);
    vColor = colorDeFase(fraccion);
    vAlfa = opacidad * (0.7 + 0.3 * sin(uTiempo * 0.3 + semilla * 21.0));

    vec4 posicionVista = modelViewMatrix * vec4(punto, 1.0);
    gl_PointSize = clamp(tamanoBase * uEscala / -posicionVista.z, 2.0, 190.0);
    gl_Position = projectionMatrix * posicionVista;
  }
`;

const VERTICE_RELOJ = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENTO_RELOJ = `
  uniform sampler2D uMapa;
  uniform float uFraccionIzquierda;
  uniform float uFraccionDerecha;
  varying vec2 vUv;

  ${PALETA_GLSL}

  void main() {
    vec4 textura = texture2D(uMapa, vUv);
    if (textura.a < 0.05) discard;
    float fraccion = clamp(mix(uFraccionIzquierda, uFraccionDerecha, vUv.x), 0.0, 1.0);
    vec3 color = colorDeFase(fraccion) + vec3(0.38);
    gl_FragColor = vec4(color, textura.a * 0.47);
  }
`;

function aleatorioGaussiano(): number {
  const u = Math.random() || 1e-6;
  const v = Math.random() || 1e-6;
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function construirGeometriaHelice(): BufferGeometry {
  const total =
    PARTICULAS_POR_HEBRA * 2 +
    TRAVESANOS * PUNTOS_POR_TRAVESANO +
    PARTICULAS_FILAMENTO * 2 +
    PARTICULAS_CHISPA;

  const posiciones = new Float32Array(total * 3);
  const desvios = new Float32Array(total * 3);
  const extras = new Float32Array(total * 3);
  let indice = 0;

  const anotar = (
    progreso: number,
    mezclaHebra: number,
    radioEspiral: number,
    desvio: [number, number, number],
    tamano: number,
    esChispa: number,
  ) => {
    posiciones[indice * 3] = progreso;
    posiciones[indice * 3 + 1] = mezclaHebra;
    posiciones[indice * 3 + 2] = radioEspiral;
    desvios[indice * 3] = desvio[0];
    desvios[indice * 3 + 1] = desvio[1];
    desvios[indice * 3 + 2] = desvio[2];
    extras[indice * 3] = tamano;
    extras[indice * 3 + 1] = Math.random();
    extras[indice * 3 + 2] = esChispa;
    indice += 1;
  };

  // Hebras principales: ley de potencia de tamaños (muchas diminutas, pocas gordas)
  // y dispersión gaussiana mixta: 22 % núcleo prieto, 78 % bruma alrededor
  for (let hebra = 0; hebra < 2; hebra += 1) {
    for (let particula = 0; particula < PARTICULAS_POR_HEBRA; particula += 1) {
      const sigma = Math.random() < 0.78 ? 0.018 : 0.055;
      const tamano = 0.018 + 0.046 * Math.pow(Math.random(), 2);
      anotar(
        Math.random(),
        hebra,
        0,
        [aleatorioGaussiano() * sigma, aleatorioGaussiano() * sigma, aleatorioGaussiano() * sigma],
        tamano,
        0,
      );
    }
  }

  // Travesaños: puentes de partículas entre ambas hebras
  for (let travesano = 0; travesano < TRAVESANOS; travesano += 1) {
    const progreso = (travesano + 0.5) / TRAVESANOS;
    for (let punto = 0; punto < PUNTOS_POR_TRAVESANO; punto += 1) {
      const mezcla = punto / (PUNTOS_POR_TRAVESANO - 1);
      anotar(
        progreso,
        mezcla,
        0,
        [aleatorioGaussiano() * 0.024, aleatorioGaussiano() * 0.024, aleatorioGaussiano() * 0.024],
        0.03 + 0.018 * Math.random(),
        0,
      );
    }
  }

  // Filamentos secundarios enroscados alrededor de cada hebra
  for (let hebra = 0; hebra < 2; hebra += 1) {
    for (let particula = 0; particula < PARTICULAS_FILAMENTO; particula += 1) {
      const radioEspiral = 0.09 + Math.random() * 0.07;
      anotar(
        Math.random(),
        hebra,
        radioEspiral,
        [aleatorioGaussiano() * 0.01, aleatorioGaussiano() * 0.01, aleatorioGaussiano() * 0.01],
        0.011 + Math.random() * 0.009,
        0,
      );
    }
  }

  // Chispas que se desprenden de las crestas y derivan hacia arriba
  for (let chispa = 0; chispa < PARTICULAS_CHISPA; chispa += 1) {
    const direccion: [number, number, number] = [
      aleatorioGaussiano() * 0.05,
      Math.abs(aleatorioGaussiano()) * 0.07 + 0.02,
      aleatorioGaussiano() * 0.05,
    ];
    anotar(
      Math.random(),
      Math.round(Math.random()),
      0,
      direccion,
      0.018 + Math.random() * 0.016,
      1,
    );
  }

  const geometria = new BufferGeometry();
  geometria.setAttribute('position', new BufferAttribute(posiciones, 3));
  geometria.setAttribute('aDesvio', new BufferAttribute(desvios, 3));
  geometria.setAttribute('aExtra', new BufferAttribute(extras, 3));
  return geometria;
}

function construirGeometriaPolvo(): BufferGeometry {
  const posiciones = new Float32Array(MOTAS_POLVO * 3);
  const extras = new Float32Array(MOTAS_POLVO * 3);

  for (let mota = 0; mota < MOTAS_POLVO; mota += 1) {
    posiciones[mota * 3] = (Math.random() - 0.5) * 24;
    posiciones[mota * 3 + 1] = (Math.random() - 0.5) * 11;
    // Mayoría al fondo; unas pocas muy cerca de cámara como bokeh de primer plano
    posiciones[mota * 3 + 2] =
      Math.random() < 0.18 ? 6 + Math.random() * 5 : -7 + Math.random() * 9;
    extras[mota * 3] = 0.25 + Math.random() * 0.9;
    extras[mota * 3 + 1] = Math.random();
    extras[mota * 3 + 2] = 0.018 + Math.random() * 0.035;
  }

  const geometria = new BufferGeometry();
  geometria.setAttribute('position', new BufferAttribute(posiciones, 3));
  geometria.setAttribute('aExtra', new BufferAttribute(extras, 3));
  return geometria;
}

export class EscenaHeliceAdn {
  private readonly renderizador: WebGLRenderer;
  private readonly escena = new Scene();
  private readonly camara: PerspectiveCamera;
  private readonly grupoHelice = new Group();

  private readonly geometriaHelice: BufferGeometry;
  private readonly geometriaPolvo: BufferGeometry;
  private readonly materialNucleo: ShaderMaterial;
  private readonly materialHalo: ShaderMaterial;
  private readonly materialPolvo: ShaderMaterial;
  private readonly materialReloj: ShaderMaterial;
  private readonly geometriaReloj: PlaneGeometry;
  private readonly reloj: Mesh;

  private readonly lienzoTexto: HTMLCanvasElement;
  private readonly contextoTexto: CanvasRenderingContext2D | null;
  private readonly texturaTexto: CanvasTexture;

  private anchoMundo = ALTO_MUNDO * 1.6;
  private ratonX = 0;
  private ratonY = 0;
  private camaraX = 0;
  private camaraY = 0;
  private textoActual = '';
  private zonaObjetivo = 0;

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

    const uniformesComunes = {
      uTiempo: { value: 0 },
      uLargo: { value: this.anchoMundo * 1.14 },
      uRadio: { value: ALTO_MUNDO * 0.22 },
      uEscala: { value: 1000 },
      uFrente: { value: 0.6 },
      uZonaMin: { value: 0 },
      uZonaMax: { value: 0 },
      uZonaBrillo: { value: 0 },
    };

    this.geometriaHelice = construirGeometriaHelice();
    this.materialNucleo = new ShaderMaterial({
      vertexShader: VERTICE_HELICE,
      fragmentShader: FRAGMENTO_PARTICULA,
      uniforms: { ...uniformesComunes, uHalo: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    // Pasada halo: misma geometría con sprites 3,4x más grandes y alfa bajo = bloom barato
    this.materialHalo = new ShaderMaterial({
      vertexShader: VERTICE_HELICE,
      fragmentShader: FRAGMENTO_PARTICULA,
      uniforms: {
        uTiempo: uniformesComunes.uTiempo,
        uLargo: uniformesComunes.uLargo,
        uRadio: uniformesComunes.uRadio,
        uEscala: uniformesComunes.uEscala,
        uFrente: uniformesComunes.uFrente,
        uZonaMin: uniformesComunes.uZonaMin,
        uZonaMax: uniformesComunes.uZonaMax,
        uZonaBrillo: uniformesComunes.uZonaBrillo,
        uHalo: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    const nucleo = new Points(this.geometriaHelice, this.materialNucleo);
    const halo = new Points(this.geometriaHelice, this.materialHalo);
    nucleo.frustumCulled = false;
    halo.frustumCulled = false;
    nucleo.renderOrder = 2;
    halo.renderOrder = 1;
    this.grupoHelice.add(halo, nucleo);
    this.grupoHelice.rotation.z = -0.06;
    this.escena.add(this.grupoHelice);

    this.geometriaPolvo = construirGeometriaPolvo();
    this.materialPolvo = new ShaderMaterial({
      vertexShader: VERTICE_POLVO,
      fragmentShader: FRAGMENTO_PARTICULA,
      uniforms: { uTiempo: uniformesComunes.uTiempo, uEscala: uniformesComunes.uEscala },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const polvo = new Points(this.geometriaPolvo, this.materialPolvo);
    polvo.frustumCulled = false;
    polvo.renderOrder = 3;
    this.escena.add(polvo);

    // Reloj entrelazado: plano con textura de texto que ESCRIBE profundidad solo
    // en los trazos (discard fuera) -> las hebras lejanas quedan ocluidas por los
    // dígitos y las cercanas pasan por delante, como en un render 3D real.
    this.lienzoTexto = document.createElement('canvas');
    this.lienzoTexto.width = 2048;
    this.lienzoTexto.height = 512;
    this.contextoTexto = this.lienzoTexto.getContext('2d');
    this.texturaTexto = new CanvasTexture(this.lienzoTexto);
    this.texturaTexto.minFilter = LinearFilter;

    this.materialReloj = new ShaderMaterial({
      vertexShader: VERTICE_RELOJ,
      fragmentShader: FRAGMENTO_RELOJ,
      uniforms: {
        uMapa: { value: this.texturaTexto },
        uFraccionIzquierda: { value: 0.03 },
        uFraccionDerecha: { value: 1.04 },
      },
      transparent: true,
      depthWrite: true,
      blending: NormalBlending,
    });
    this.geometriaReloj = new PlaneGeometry(4, 1);
    this.reloj = new Mesh(this.geometriaReloj, this.materialReloj);
    this.reloj.frustumCulled = false;
    this.reloj.renderOrder = 0;
    this.escena.add(this.reloj);
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
    this.materialNucleo.uniforms['uLargo'].value = this.anchoMundo * 1.14;

    // Escala de gl_PointSize: píxeles de dispositivo por unidad de mundo a distancia 1
    const altoDispositivo = alto * proporcion;
    const escala = altoDispositivo / (2 * Math.tan((CAMPO_VISION / 2) * (Math.PI / 180)));
    this.materialNucleo.uniforms['uEscala'].value = escala;

    // El reloj abarca del 6 % al 76 % del ancho (libre del raíl y del rastro izquierdo)
    const anchoReloj = this.anchoMundo * 0.7;
    this.reloj.scale.set(anchoReloj / 4, anchoReloj / 4, 1);
    this.reloj.position.x = -0.09 * this.anchoMundo;
  }

  apuntarRaton(x: number, y: number): void {
    this.ratonX = x;
    this.ratonY = y;
  }

  fijarFrente(fraccion: number): void {
    this.materialNucleo.uniforms['uFrente'].value = fraccion;
  }

  /** Foco de inspección de una fase (al hacer hover en sus bandas del DOM). */
  fijarZona(zona: { min: number; max: number } | null, inmediato = false): void {
    if (zona) {
      this.materialNucleo.uniforms['uZonaMin'].value = zona.min;
      this.materialNucleo.uniforms['uZonaMax'].value = zona.max;
    }
    this.zonaObjetivo = zona ? 1 : 0;

    if (inmediato) {
      this.materialNucleo.uniforms['uZonaBrillo'].value = this.zonaObjetivo;
    }
  }

  fijarTexto(texto: string): void {
    if (texto === this.textoActual || !this.contextoTexto) {
      return;
    }
    this.textoActual = texto;

    const contexto = this.contextoTexto;
    contexto.clearRect(0, 0, this.lienzoTexto.width, this.lienzoTexto.height);
    contexto.font = '900 380px Satoshi, "Archivo", sans-serif';
    contexto.textAlign = 'center';
    contexto.textBaseline = 'middle';
    contexto.fillStyle = 'rgba(255, 255, 255, 0.78)';
    contexto.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    contexto.lineWidth = 3;
    contexto.fillText(texto, this.lienzoTexto.width / 2, this.lienzoTexto.height / 2 + 14);
    contexto.strokeText(texto, this.lienzoTexto.width / 2, this.lienzoTexto.height / 2 + 14);
    this.texturaTexto.needsUpdate = true;
  }

  renderizar(milisegundos: number): void {
    const segundos = milisegundos / 1000;
    this.materialNucleo.uniforms['uTiempo'].value = segundos;

    const brilloZona = this.materialNucleo.uniforms['uZonaBrillo'];
    brilloZona.value += (this.zonaObjetivo - brilloZona.value) * 0.08;

    // Deriva cinematográfica + parallax suave hacia el puntero
    const objetivoX = this.ratonX * 0.55 + Math.sin(segundos * 0.05) * 0.3;
    const objetivoY = -this.ratonY * 0.35 + Math.cos(segundos * 0.04) * 0.2;
    this.camaraX += (objetivoX - this.camaraX) * 0.04;
    this.camaraY += (objetivoY - this.camaraY) * 0.04;
    this.camara.position.x = this.camaraX;
    this.camara.position.y = this.camaraY;
    this.camara.lookAt(0, 0, 0);

    this.renderizador.render(this.escena, this.camara);
  }

  destruir(): void {
    this.geometriaHelice.dispose();
    this.geometriaPolvo.dispose();
    this.geometriaReloj.dispose();
    this.materialNucleo.dispose();
    this.materialHalo.dispose();
    this.materialPolvo.dispose();
    this.materialReloj.dispose();
    this.texturaTexto.dispose();
    this.renderizador.dispose();
    this.renderizador.forceContextLoss();
  }
}

export function crearEscenaHelice(lienzo: HTMLCanvasElement): EscenaHeliceAdn {
  return new EscenaHeliceAdn(lienzo);
}
