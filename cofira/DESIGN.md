# DESIGN.md — Cofira

> Art direction and design system.
> Philosophy: **"darkness is the interface, effort is the light."**

Note: the codebase is intentionally written in Spanish (BEM class names, tokens, comments, i18n dictionaries); this document describes the system in English.

## Art direction

Cinematic, technical, premium, dark, editorial, athletic. Near-black canvas; **orange is the only light source** (accents, glows, lit metrics). Depth through layered surfaces (1→3), subtle grain over everything, atmospheric backgrounds — never flat colors. Sentence-case headlines, with true italics reserved for highlighting names and metrics.

## Typography

| Role | Family | Usage |
|------|--------|-------|
| Display | **Satoshi** (fallback: Archivo) | Large sentence-case headlines; extreme weight contrast |
| Body | **Hanken Grotesk** (variable) | Text, labels, readable UI |
| Mono | **JetBrains Mono** | Technical labels (`KCAL · HOY`), chart axes, figures, counters |

Self-hosted woff2 under `src/assets/fonts/`. 3x+ size jumps between levels. Tokens: `--fuente-display`, `--fuente-cuerpo`, `--fuente-mono`. The legacy aliases `--font-primary` (→ Hanken) and `--font-secondary` (→ display) re-typeset the whole app without touching every component.

## Token layers (`00-settings/_variables.scss` + `07-dark-mode/_dark-mode-config.scss`)

1. **Primitives** — raw HSL (surface scales, orange, amber, alpha ramps).
2. **Semantic** — `--superficie-fondo/1/2/3`, `--naranja-normal/hover/active/texto`, `--ambar`, `--texto-principal/secundario/suave`, `--texto-sobre-acento`, `--borde-sutil/medio`, `--exito`, `--peligro`.
3. **Component / effect** — `--gradiente-acento`, `--gradiente-halo`, `--vidrio-fondo`, `--sombra-bento`, `--glow-interior`, `--glow-acento`, and the orange glows `--naranja-glow-fuerte/media/suave`.

Dark-first: the dark theme (the protagonist) redefines the semantic tokens in `_dark-mode-config.scss`; light mode lives as the default values in `_variables.scss`. **Theming lives ONLY in tokens.**

### Scale / grid

Spacing in 4px multiples (`--spacing-size-*`). Radii: `--radius-bento: 1.25rem`, `--radius-full`. Fluid display sizes: `--display-xl/lg/md`. Technical label style: `--etiqueta-tecnica` (mono, 0.14em tracking).

## Color / contrast

A single orange accent. Small text uses `--naranja-texto` (≥4.5:1). `--texto-sobre-acento` resolves to black (dark) / white (light) automatically — never picked by eye. Zero hardcoded hex values inside components.

## Motion (`services/animaciones.service.ts` + `directives/`)

GSAP + ScrollTrigger (registered once at module level) + **Lenis** (smooth scroll on marketing routes only). Staggered reveals, parallax, pinned scenes. `afterNextRender` + `NgZone.runOutsideAngular` + `gsap.context().revert()`. `ScrollTrigger.refresh()` after `NavigationEnd`. Only `transform`/`opacity` are animated. Durations: `--duration-fast/base/slow`. **`prefers-reduced-motion` → final state visible, no movement.**

## Signature moment (just one)

In **Seguimiento**: a beam of light (a pointer- and scroll-driven radial mask) that "lights up" the progress metrics against the black. A discreet echo lives in the landing's progress section. Reduced-motion → everything stays lit. The rest of the interface remains disciplined and quiet.

## Imagery

Athletic photography in low light, high contrast, dark tone. Consistent treatment: dark tint + grain + duotone toward orange. Local assets, webp in 3 sizes, `width`/`height` always set, lazy-loaded except the hero.

## Accessibility

AA contrast, visible focus (orange ring via the `foco-visible` mixin), labeled inputs, alt text on images, `prefers-reduced-motion` respected, hierarchy through size/weight/contrast (never color alone).

## Code conventions

Spanish BEM, flat selectors (no nesting), no `!important`, Flexbox (Grid only for true 2D bento layouts), `/* Xpx */` comments next to `rem` values. **"Restyle and delete" protocol**: when a surface is restyled, its override block in `07-dark-mode/_dark-mode.scss` is deleted in the same change.
