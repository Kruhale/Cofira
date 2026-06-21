import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Points,
  PointLight,
  PointsMaterial,
  Scene,
  Texture,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Límite de device-pixel-ratio para no matar la GPU en pantallas retina de alto DPR.
 */
const TOPE_DPR = 2;

/**
 * Dimensiones de la jarra en espacio mundo.
 * La altura total incluye cuello + boca; el radio máximo se da en el cuerpo bombeado.
 */
const ALTURA_JARRA = 3.2;
const RADIO_MAXIMO = 1.35;

/**
 * El agua ocupa entre el 6 % y el 92 % del hueco interior (medido en fracción de
 * la altura disponible dentro de la jarra). Evita que el agua rebase la boca o
 * quede a ras del fondo mostrando un artefacto visual.
 */
const FRACCION_MINIMA = 0.06;
const FRACCION_MAXIMA = 0.92;

/**
 * Altura del espacio interior utilizable para el agua (ligeramente menor que la jarra
 * total para dejar margen de base y cuello).
 */
const ALTURA_INTERIOR = ALTURA_JARRA * 0.88;

/**
 * Y donde arranca el fondo interior (centrar la jarra en y=0 y subir ligeramente).
 */
const Y_BASE_INTERIOR = -(ALTURA_JARRA / 2) + ALTURA_JARRA * 0.06;

/**
 * Velocidad del lerp del nivel de agua por frame (0.06 = suave y notorio).
 */
const VELOCIDAD_LERP = 0.06;

/**
 * Amplitud máxima de la oscilación en Y del grupo (en radianes).
 * ~25° = 0.436 rad. El asa siempre se intuye porque nunca llega a 90°.
 */
const AMPLITUD_OSCILACION_Y = 0.436;

/**
 * Cabeceo leve en X para dar volumen sin marear.
 */
const AMPLITUD_CABECEO_X = 0.04;

// ---------------------------------------------------------------------------
// GEOMETRÍA DE LA JARRA
// ---------------------------------------------------------------------------

/**
 * Perfil de la jarra para LatheGeometry: puntos [radio, y] de abajo a arriba.
 * Base plana → cuerpo bombeado → estrechamiento del cuello → boca ligeramente abierta.
 * El perfil se normaliza al rango de altura ALTURA_JARRA.
 */
function construirPerfilJarra(): Vector2[] {
  // Cada entrada: [radio, y] — de fondo (y=-ALTURA_JARRA/2) a boca (y=+ALTURA_JARRA/2).
  const mitadAltura = ALTURA_JARRA / 2;
  return [
    new Vector2(0.18, -mitadAltura), // centro del fondo (base sólida)
    new Vector2(RADIO_MAXIMO * 0.72, -mitadAltura + 0.18), // arista del fondo
    new Vector2(RADIO_MAXIMO * 0.98, -mitadAltura + 0.45), // arranque del cuerpo
    new Vector2(RADIO_MAXIMO, -mitadAltura + 0.95), // vientre superior
    new Vector2(RADIO_MAXIMO * 0.97, -mitadAltura + 1.3), // zona media
    new Vector2(RADIO_MAXIMO * 0.88, 0.0), // transición hacia cuello
    new Vector2(RADIO_MAXIMO * 0.72, mitadAltura - 0.65), // cuello
    new Vector2(RADIO_MAXIMO * 0.68, mitadAltura - 0.42), // garganta
    new Vector2(RADIO_MAXIMO * 0.75, mitadAltura - 0.22), // inicio apertura boca
    new Vector2(RADIO_MAXIMO * 0.82, mitadAltura), // boca abierta
  ];
}

function construirGeometriaJarra(): LatheGeometry {
  const perfil = construirPerfilJarra();
  // 64 segmentos de revolución → silueta suave sin coste excesivo.
  return new LatheGeometry(perfil, 64);
}

// ---------------------------------------------------------------------------
// GEOMETRÍA DEL ASA
// ---------------------------------------------------------------------------

/**
 * Curva en "C" pegada al lado derecho del cuerpo de la jarra.
 * Los puntos están en espacio mundo (jarra centrada en origen).
 */
function construirCurvaAsa(): CatmullRomCurve3 {
  const xBase = RADIO_MAXIMO * 0.95; // radio en la zona donde arranca el asa
  const yArranqueInferior = -(ALTURA_JARRA / 2) + 0.7;
  const yArrangeSuperior = -(ALTURA_JARRA / 2) + 2.0;

  return new CatmullRomCurve3([
    new Vector3(xBase, yArranqueInferior, 0),
    new Vector3(xBase + 0.3, yArranqueInferior - 0.1, 0),
    new Vector3(xBase + 0.78, yArranqueInferior + 0.35, 0),
    new Vector3(xBase + 0.88, yArranqueInferior + 0.65, 0),
    new Vector3(xBase + 0.88, yArrangeSuperior - 0.65, 0),
    new Vector3(xBase + 0.78, yArrangeSuperior - 0.35, 0),
    new Vector3(xBase + 0.3, yArrangeSuperior + 0.1, 0),
    new Vector3(xBase, yArrangeSuperior, 0),
  ]);
}

function construirGeometriaAsa(): TubeGeometry {
  const curva = construirCurvaAsa();
  // Radio del tubo 0.055 → asa fina y elegante, 20 segmentos de sección.
  return new TubeGeometry(curva, 48, 0.055, 20, false);
}

// ---------------------------------------------------------------------------
// GEOMETRÍA DEL AGUA (cuerpo + superficie)
// ---------------------------------------------------------------------------

/**
 * Perfil interior de la jarra (radio más pequeño que el perfil exterior para
 * representar el hueco donde cabe el agua). Se recorta en base y cuello.
 */
function construirPerfilInteriorAgua(): Vector2[] {
  const grosorPared = 0.09;
  const perfil = construirPerfilJarra();
  // Resta el grosor de pared a cada radio; mantiene los mismos Y.
  return perfil
    .slice(1, perfil.length - 1)
    .map((v) => new Vector2(Math.max(0, v.x - grosorPared), v.y));
}

/**
 * Geometría del cuerpo de agua como LatheGeometry recortada en altura.
 * La altura real se actualiza en `actualizarGeometriaAgua` mediante escalado en Y
 * del Mesh, así evitamos reconstruir la geometría cada frame.
 *
 * Devuelve la geometría a escala completa (nivel = 1). El Mesh se escala en Y.
 */
function construirGeometriaAguaCuerpo(): LatheGeometry {
  const perfilInterior = construirPerfilInteriorAgua();
  return new LatheGeometry(perfilInterior, 48);
}

/**
 * Disco de superficie del agua con muchos segmentos para la onda animada.
 * El radio del disco es el radio máximo interior menos un pequeño margen.
 */
function construirGeometriaSuperficieAgua(): CircleGeometry {
  // 64 segmentos radiales + 8 anillos → vértices suficientes para ondas suaves.
  return new CircleGeometry(RADIO_MAXIMO * 0.81, 64, 8);
}

// ---------------------------------------------------------------------------
// BURBUJAS
// ---------------------------------------------------------------------------

const CANTIDAD_BURBUJAS = 160;

function construirGeometriaBurbujas(): BufferGeometry {
  const posiciones = new Float32Array(CANTIDAD_BURBUJAS * 3);
  const datos = new Float32Array(CANTIDAD_BURBUJAS * 3); // x=semilla y=velocidad z=fase

  for (let i = 0; i < CANTIDAD_BURBUJAS; i += 1) {
    const angulo = Math.random() * Math.PI * 2;
    const radio = Math.random() * RADIO_MAXIMO * 0.7;
    posiciones[i * 3] = Math.cos(angulo) * radio;
    posiciones[i * 3 + 1] = 0; // Y se calcula en renderizar con el nivel
    posiciones[i * 3 + 2] = Math.sin(angulo) * radio;
    datos[i * 3] = Math.random(); // semilla aleatoria
    datos[i * 3 + 1] = 0.18 + Math.random() * 0.28; // velocidad de ascenso
    datos[i * 3 + 2] = Math.random() * Math.PI * 2; // fase inicial
  }

  const geometria = new BufferGeometry();
  geometria.setAttribute('position', new Float32BufferAttribute(posiciones, 3));
  geometria.setAttribute('aDatos', new BufferAttribute(datos, 3));
  return geometria;
}

// ---------------------------------------------------------------------------
// INTERFAZ PÚBLICA
// ---------------------------------------------------------------------------

export interface EscenaJarraAgua {
  /** Fija el nivel de llenado: 0 = vacía, 1 = llena. */
  fijarNivel(fraccion: number, inmediato?: boolean): void;
  redimensionar(ancho: number, alto: number): void;
  renderizar(milisegundos: number): void;
  destruir(): void;
}

// ---------------------------------------------------------------------------
// CLASE INTERNA
// ---------------------------------------------------------------------------

class EscenaJarraAguaImpl implements EscenaJarraAgua {
  private readonly renderizador: WebGLRenderer;
  private readonly escena = new Scene();
  private readonly camara: PerspectiveCamera;

  /** Grupo raíz: todo lo que oscila junto (jarra + asa + agua). */
  private readonly grupoJarra = new Group();

  // Geometrías (para dispose)
  private readonly geometriaJarra: LatheGeometry;
  private readonly geometriaAsa: TubeGeometry;
  private readonly geometriaAgua: LatheGeometry;
  private readonly geometriaSuperficie: CircleGeometry;
  private readonly geometriaBurbujas: BufferGeometry;

  // Materiales (para dispose)
  private readonly materialVidrio: MeshPhysicalMaterial;
  private readonly materialAgua: MeshPhysicalMaterial;
  private readonly materialSuperficie: MeshPhysicalMaterial;
  private readonly materialBurbujas: PointsMaterial;

  // Meshes que necesitan actualización por frame
  private readonly meshAgua: Mesh;
  private readonly meshSuperficie: Mesh;
  private readonly puntosBurbujas: Points;

  // Estado del nivel
  private nivelActual = 0;
  private nivelObjetivo = 0;

  // Mapa de entorno para dispose
  private readonly mapaEntorno: Texture;

  constructor(lienzo: HTMLCanvasElement) {
    // ------------------------------------------------------------------
    // RENDERER
    // ------------------------------------------------------------------
    this.renderizador = new WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true });
    this.renderizador.setClearColor(0x000000, 0);
    this.renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, TOPE_DPR));
    this.renderizador.setSize(lienzo.clientWidth || 400, lienzo.clientHeight || 400, false);

    // ------------------------------------------------------------------
    // ENTORNO — RoomEnvironment + PMREMGenerator para que el vidrio refracte
    // y refleje. Sin esto el MeshPhysicalMaterial con transmission queda negro.
    // ------------------------------------------------------------------
    const generadorPmrem = new PMREMGenerator(this.renderizador);
    generadorPmrem.compileEquirectangularShader();
    const entorno = new RoomEnvironment();
    this.mapaEntorno = generadorPmrem.fromScene(entorno).texture;
    this.escena.environment = this.mapaEntorno;
    entorno.dispose(); // la escena auxiliar ya no hace falta
    generadorPmrem.dispose();

    // ------------------------------------------------------------------
    // CÁMARA — fov estrecho (32°) para aspecto "tele" más premium.
    // Ligerísimo picado: la cámara está 0.6 unidades por encima del centro.
    // ------------------------------------------------------------------
    this.camara = new PerspectiveCamera(32, 1, 0.1, 50);
    this.camara.position.set(0, 0.6, 9.5);
    this.camara.lookAt(0, 0, 0);

    // ------------------------------------------------------------------
    // LUCES
    // ------------------------------------------------------------------
    const luzAmbiental = new AmbientLight(0xffffff, 0.55);
    // Key light ligeramente desplazada para resaltar el volumen de la jarra.
    const luzDireccional = new DirectionalLight(0xffffff, 1.4);
    luzDireccional.position.set(2.5, 4, 3);
    // Relleno cian para brillos en el cristal y el agua.
    const luzPuntoCian = new PointLight(0x16c0e6, 2.8, 12);
    luzPuntoCian.position.set(-2.5, 1.5, 3.5);
    this.escena.add(luzAmbiental, luzDireccional, luzPuntoCian);

    // ------------------------------------------------------------------
    // MATERIAL DE VIDRIO
    // ------------------------------------------------------------------
    this.materialVidrio = new MeshPhysicalMaterial({
      color: new Color(0xf2f8ff),
      transmission: 1,
      roughness: 0.07,
      ior: 1.45,
      thickness: 1.3,
      transparent: true,
      side: DoubleSide,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.2,
    });

    // ------------------------------------------------------------------
    // JARRA (LatheGeometry)
    // ------------------------------------------------------------------
    this.geometriaJarra = construirGeometriaJarra();
    const meshJarra = new Mesh(this.geometriaJarra, this.materialVidrio);
    // El vidrio debe renderizarse después del agua para que la transparencia
    // funcione correctamente (renderOrder más alto = se dibuja encima).
    meshJarra.renderOrder = 2;

    // ------------------------------------------------------------------
    // ASA (TubeGeometry)
    // ------------------------------------------------------------------
    this.geometriaAsa = construirGeometriaAsa();
    const meshAsa = new Mesh(this.geometriaAsa, this.materialVidrio);
    meshAsa.renderOrder = 2;

    // ------------------------------------------------------------------
    // MATERIAL DEL AGUA
    // ------------------------------------------------------------------
    this.materialAgua = new MeshPhysicalMaterial({
      color: new Color(0x16c0e6),
      transmission: 0.55,
      roughness: 0.15,
      ior: 1.33,
      transparent: true,
      opacity: 0.92,
      emissive: new Color(0x04607a),
      emissiveIntensity: 0.12,
      envMapIntensity: 0.8,
      side: DoubleSide,
    });

    // ------------------------------------------------------------------
    // CUERPO DE AGUA (LatheGeometry interior, escala Y controla nivel)
    // ------------------------------------------------------------------
    this.geometriaAgua = construirGeometriaAguaCuerpo();
    this.meshAgua = new Mesh(this.geometriaAgua, this.materialAgua);
    this.meshAgua.renderOrder = 1;

    // ------------------------------------------------------------------
    // SUPERFICIE DEL AGUA (disco con onda animada)
    // ------------------------------------------------------------------
    this.geometriaSuperficie = construirGeometriaSuperficieAgua();
    this.materialSuperficie = new MeshPhysicalMaterial({
      color: new Color(0x5edbf0),
      transparent: true,
      opacity: 0.88,
      roughness: 0.08,
      emissive: new Color(0x10a0c0),
      emissiveIntensity: 0.18,
      side: DoubleSide,
    });
    this.meshSuperficie = new Mesh(this.geometriaSuperficie, this.materialSuperficie);
    // El disco apunta hacia arriba por defecto (plano XZ), lo giramos para que
    // quede horizontal (mirando hacia +Y).
    this.meshSuperficie.rotation.x = -Math.PI / 2;
    this.meshSuperficie.renderOrder = 1;

    // ------------------------------------------------------------------
    // BURBUJAS (Points cian ascendentes dentro del agua)
    // ------------------------------------------------------------------
    this.geometriaBurbujas = construirGeometriaBurbujas();
    this.materialBurbujas = new PointsMaterial({
      color: new Color(0x8ef4ff),
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
      depthWrite: false,
    });
    this.puntosBurbujas = new Points(this.geometriaBurbujas, this.materialBurbujas);
    this.puntosBurbujas.renderOrder = 1;

    // ------------------------------------------------------------------
    // GRUPO: agrupa jarra + asa + agua para oscilar juntos
    // ------------------------------------------------------------------
    this.grupoJarra.add(
      meshJarra,
      meshAsa,
      this.meshAgua,
      this.meshSuperficie,
      this.puntosBurbujas,
    );
    this.escena.add(this.grupoJarra);

    // Nivel inicial a cero inmediato para que la directiva lo fije en seguida.
    this.actualizarMeshesNivel(0);
  }

  // -------------------------------------------------------------------------
  // API PÚBLICA
  // -------------------------------------------------------------------------

  fijarNivel(fraccion: number, inmediato = false): void {
    this.nivelObjetivo = Math.max(0, Math.min(1, fraccion));
    if (inmediato) {
      this.nivelActual = this.nivelObjetivo;
      this.actualizarMeshesNivel(this.nivelActual);
    }
  }

  redimensionar(ancho: number, alto: number): void {
    if (!ancho || !alto) {
      return;
    }
    this.renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, TOPE_DPR));
    this.renderizador.setSize(ancho, alto, false);
    this.camara.aspect = ancho / alto;
    this.camara.updateProjectionMatrix();
  }

  renderizar(milisegundos: number): void {
    const segundos = milisegundos / 1000;

    // Lerp del nivel: suave, ~0.06 por frame
    this.nivelActual += (this.nivelObjetivo - this.nivelActual) * VELOCIDAD_LERP;
    this.actualizarMeshesNivel(this.nivelActual);

    // Onda animada en los vértices del disco de superficie
    this.animarOndaSuperficie(segundos);

    // Burbujas ascendentes dentro del agua
    this.animarBurbujas(segundos);

    // Oscilación elegante del grupo: ±25° en Y, cabeceo mínimo en X
    this.grupoJarra.rotation.y = Math.sin(segundos * 0.38) * AMPLITUD_OSCILACION_Y;
    this.grupoJarra.rotation.x = Math.sin(segundos * 0.21 + 0.9) * AMPLITUD_CABECEO_X;

    this.renderizador.render(this.escena, this.camara);
  }

  destruir(): void {
    this.geometriaJarra.dispose();
    this.geometriaAsa.dispose();
    this.geometriaAgua.dispose();
    this.geometriaSuperficie.dispose();
    this.geometriaBurbujas.dispose();
    this.materialVidrio.dispose();
    this.materialAgua.dispose();
    this.materialSuperficie.dispose();
    this.materialBurbujas.dispose();
    this.mapaEntorno.dispose();
    this.renderizador.dispose();
    this.renderizador.forceContextLoss();
  }

  // -------------------------------------------------------------------------
  // MÉTODOS PRIVADOS
  // -------------------------------------------------------------------------

  /**
   * Recoloca y escala el cuerpo de agua y el disco de superficie para que
   * representen el nivel actual. El cuerpo se escala en Y; la superficie se
   * desplaza a la altura exacta del agua.
   *
   * Rango real: FRACCION_MINIMA..FRACCION_MAXIMA del hueco interior.
   */
  private actualizarMeshesNivel(nivelNormalizado: number): void {
    const fraccionReal = FRACCION_MINIMA + nivelNormalizado * (FRACCION_MAXIMA - FRACCION_MINIMA);

    // Altura en unidades mundo que ocupa el agua
    const alturaAgua = fraccionReal * ALTURA_INTERIOR;

    // La geometría del agua ocupa toda la ALTURA_INTERIOR cuando scaleY = 1.
    // Escalar en Y = fraccionReal contrae la malla desde su propio centro,
    // así que la reposicionamos para que el fondo quede en Y_BASE_INTERIOR.
    const escalaY = Math.max(0.001, fraccionReal); // evitar escala cero (artefacto GPU)
    this.meshAgua.scale.y = escalaY;

    // Centro del agua: fondo del interior + mitad de la altura del agua
    const centroAguaY = Y_BASE_INTERIOR + alturaAgua / 2;
    this.meshAgua.position.y = centroAguaY;

    // La superficie se coloca justo en la cima del agua
    const ySuperficie = Y_BASE_INTERIOR + alturaAgua;
    this.meshSuperficie.position.y = ySuperficie;
    this.puntosBurbujas.position.y = Y_BASE_INTERIOR; // referencia base de burbujas
  }

  /**
   * Anima los vértices del disco de superficie con ondas sinusoidales.
   * Se modifica directamente el buffer de posiciones y se marca needsUpdate.
   *
   * La onda desplaza Z del vértice (antes del giro -90° del mesh, que convierte
   * el eje Z local en el eje Y mundo), creando la ilusión de ondulación.
   */
  private animarOndaSuperficie(segundos: number): void {
    const atributoPos = this.geometriaSuperficie.getAttribute('position') as BufferAttribute;
    const cantidad = atributoPos.count;

    for (let i = 0; i < cantidad; i += 1) {
      const x = atributoPos.getX(i);
      const y = atributoPos.getY(i); // en espacio local del disco (antes del giro)

      // Superposición de dos ondas para que parezca turbulencia natural
      const onda =
        Math.sin(x * 3.1 + segundos * 1.8) * 0.018 +
        Math.cos(y * 2.7 - segundos * 1.2 + x * 1.5) * 0.012;

      atributoPos.setZ(i, onda);
    }

    atributoPos.needsUpdate = true;
    this.geometriaSuperficie.computeVertexNormals();
  }

  /**
   * Mueve las burbujas hacia arriba dentro del agua. Cada burbuja tiene
   * velocidad y fase propias (almacenadas en el atributo aDatos).
   * Cuando supera el nivel actual del agua, se reinicia desde el fondo.
   */
  private animarBurbujas(segundos: number): void {
    const fraccionReal = FRACCION_MINIMA + this.nivelActual * (FRACCION_MAXIMA - FRACCION_MINIMA);
    const alturaAgua = fraccionReal * ALTURA_INTERIOR;
    const yTecho = Y_BASE_INTERIOR + alturaAgua;

    const atributoPos = this.geometriaBurbujas.getAttribute('position') as BufferAttribute;
    const atributoDatos = this.geometriaBurbujas.getAttribute('aDatos') as BufferAttribute;

    for (let i = 0; i < CANTIDAD_BURBUJAS; i += 1) {
      const semilla = atributoDatos.getX(i);
      const velocidad = atributoDatos.getY(i);
      const fase = atributoDatos.getZ(i);

      // Posición Y ciclíca: sube desde el fondo hasta el techo del agua
      const progresoY = (((segundos * velocidad + fase) % 1) + 1) % 1;
      const yBurbuja = Y_BASE_INTERIOR + progresoY * alturaAgua;

      // Pequeño zigzag en X para que parezca burbuja real ascendiendo
      const xActual = atributoPos.getX(i);
      const nuevoX = xActual + Math.sin(segundos * 2.1 + semilla * 11.0) * 0.003;

      atributoPos.setY(i, yBurbuja);
      atributoPos.setX(i, nuevoX);

      // Ocultar burbujas que superan el nivel del agua (float a través de la superficie)
      const visible = yBurbuja < yTecho - 0.06;
      atributoPos.setZ(i, visible ? atributoPos.getZ(i) : 9999);
    }

    atributoPos.needsUpdate = true;
  }
}

// ---------------------------------------------------------------------------
// FACTORY PÚBLICA
// ---------------------------------------------------------------------------

/**
 * Crea y devuelve una escena Three.js de jarra de cristal llenándose de agua.
 * La directiva consumidora llama a renderizar(ms) en cada frame y a
 * fijarNivel(fraccion) cuando cambia el nivel de hidratación.
 */
export function crearEscenaJarraAgua(lienzo: HTMLCanvasElement): EscenaJarraAgua {
  return new EscenaJarraAguaImpl(lienzo);
}
