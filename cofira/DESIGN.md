# DESIGN.md — Cofira

> Dirección de arte y sistema de diseño del rediseño 2026.
> Filosofía: **"la oscuridad es la interfaz, el esfuerzo es la luz"**.

## Dirección de arte

Cinematográfico, técnico, premium, oscuro, editorial, atlético. Negro casi puro como lienzo;
el **naranja es la única fuente de luz** (acentos, glows, métricas encendidas). Profundidad por
capas (superficies 1→3), grano/ruido sutil sobre todo, fondos atmosféricos — nunca colores planos.
Titulares en minúscula (sentence case) con **cursiva real** reservada para resaltar nombres y métricas.

## Tipografía

| Rol | Familia | Uso |
|-----|---------|-----|
| Display | **Archivo** (variable, itálica real, eje de anchura 62→125%) | Titulares grandes sentence-case; `font-stretch: 125%` (Expanded) en el hero; pesos extremos (200 vs 800); itálica solo para énfasis |
| Cuerpo | **Hanken Grotesk** (variable) | Texto, labels, UI legible |
| Mono | **JetBrains Mono** | Etiquetas técnicas (`KCAL · HOY`), ejes de gráficas, cifras, contadores |

Self-host woff2 en `src/assets/fonts/`. Saltos de tamaño 3x+. Se retira **Anton** (mayúsculas, sin itálica).
Tokens: `--fuente-display`, `--fuente-cuerpo`, `--fuente-mono`. Los alias heredados `--font-primary`
(→ Hanken) y `--font-secondary` (→ Archivo) re-tipografían toda la app sin tocar cada componente.

## Capas de tokens (`00-settings/_variables.scss` + `07-dark-mode/_dark-mode-config.scss`)

1. **Primitivos** — HSL crudos (escalas de superficie, naranja, ámbar, transparencias).
2. **Semánticos** — `--superficie-fondo/1/2/3`, `--naranja-normal/hover/active/texto`, `--ambar`,
   `--texto-principal/secundario/suave`, `--texto-sobre-acento`, `--borde-sutil/medio`, `--exito`, `--peligro`.
3. **De componente / efecto** — `--gradiente-acento`, `--gradiente-halo`, `--vidrio-fondo`,
   `--sombra-bento`, `--glow-interior`, `--glow-acento`, glows `--naranja-glow-fuerte/media/suave`.

Dark-first: el tema oscuro (protagonista) redefine los semánticos en `_dark-mode-config.scss`;
el claro vive como valor por defecto en `_variables.scss`. **El theming vive SOLO en tokens.**

### Escala / rejilla

Espaciado en múltiplos de 4px (`--spacing-size-*`). Radios: `--radius-bento: 1.25rem`, `--radius-full`.
Display fluido: `--display-xl/lg/md` (clamp, ya existente). Etiqueta técnica: `--etiqueta-tecnica` (mono, ls 0.14em).

## Color / contraste

Acento naranja único. Para texto pequeño usar `--naranja-texto` (≥4.5:1). `--texto-sobre-acento`
decide negro (oscuro) / blanco (claro) automáticamente — nunca elegir a ojo. Cero hex a fuego en componentes.

## Motion (`services/animaciones.service.ts` + `directives/`)

GSAP + ScrollTrigger (registrados a nivel módulo) + **Lenis** (smooth-scroll solo en rutas marketing).
Reveals con stagger, parallax, pins. `afterNextRender` + `NgZone.runOutsideAngular` + `gsap.context().revert()`.
`ScrollTrigger.refresh()` tras `NavigationEnd`. Solo se anima `transform`/`opacity`. Duraciones:
`--duration-fast/base/slow`. **`prefers-reduced-motion` → estado final visible, sin movimiento.**

## Momento de firma (uno)

En **Seguimiento**: un haz de luz (máscara radial dirigida por puntero + scroll) que "enciende"
las métricas de progreso sobre el negro. Eco discreto en la sección "progreso" de la landing.
Reduced-motion → todo encendido. El resto de la interfaz, disciplinado y tranquilo.

## Imágenes

Fotografía atlética en penumbra, alto contraste, tono oscuro. Tratamiento coherente: tinte oscuro +
grano + duotono hacia el naranja. Local, webp en 3 tamaños, `width/height` siempre, lazy salvo el hero.

## Accesibilidad

Contraste AA, focus-visible (anillo naranja, mixin `foco-visible`), labels en inputs, alt en imágenes,
respeto a `prefers-reduced-motion`, jerarquía por tamaño/peso/contraste (no solo color).

## Reglas de código

BEM en español, selectores planos (sin anidar), sin `!important`, Flexbox (Grid solo para bento 2D real),
comentarios `/* Xpx */` junto a `rem`. Protocolo **"rediseña y borra"**: al restilizar una superficie,
borrar su bloque en `07-dark-mode/_dark-mode.scss` en el mismo cambio.
