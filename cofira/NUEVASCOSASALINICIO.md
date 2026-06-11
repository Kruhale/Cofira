# NUEVAS COSAS AL INICIO — Plan de contenido para la home de Cofira

> Basado en un barrido real de la página en el navegador (`:4600`, 11-jun-2026)
> y en el inventario de features reales de la app (servicios, rutas, assets).

---

## El diagnóstico en una frase

La home tiene buen esqueleto (hero, cifras, pasos, pilares, planes, funcionalidades, FAQ, CTA),
pero **no cuenta una historia**: no vende la IA (el diferenciador real), no tiene voz de usuarios,
le sobran vacíos negros enormes y las tarjetas siguen en el lenguaje visual viejo (cajas redondeadas
blandas) en vez del nuevo (chaflán HUD, mono, marcos de esquina).

---

## Flujo final propuesto (15 paradas)

```
 1. Hero                        existente — mejora ligera
 2. ✦ MANIFIESTO               NUEVO
 3. Cifras                      existente — rediseño (franja técnica)
 4. ✦ MARQUEE separador        NUEVO (componente reutilizable)
 5. Cómo funciona (3 pasos)     existente — rediseño (filas editoriales)
 6. ✦ LA IA EN DIRECTO         NUEVO — la sección estrella
 7. Pilares                     existente — micro-datos + enlaces
 8. ✦ UN DÍA CON COFIRA        NUEVO
 9. Funcionalidades pinned      existente — se queda igual
10. ✦ TESTIMONIOS              NUEVO (sin repetir las fotos antes/después)
11. Planes                      existente — rediseño tarjetas + toggle
12. ✦ COFIRA VS LO DE SIEMPRE  NUEVO — comparativa
13. FAQ                         existente — más preguntas + chips de filtro
14. ✦ DESDE EL BLOG            NUEVO
15. CTA final + footer          existente — solo marquee invertido antes
```

El rastro-scroll de la izquierda se amplía con las anclas nuevas (escala solo).

---

## SECCIONES NUEVAS

### 1. Manifiesto (`.manifiesto`) — tras el hero
- 3–4 frases enormes en Anton: *"No vendemos motivación. / Vendemos un sistema. / Tu único trabajo: aparecer."*
- Reveal **palabra a palabra ligado al scroll** (scrub): cada palabra pasa de gris a blanco al cruzar
  el centro; las palabras clave se encienden en naranja.
- Rompe el ritmo monótono de "eyebrow + H2" que tienen todas las secciones.

### 2. Marquee cinético (`app-cinta-marquee`) — separador reutilizable
- Banda de texto infinito en Anton outline: *ENTRENA — COME — MIDE — REPITE —*
- Velocidad **ligada al scroll de Lenis** (acelera al scrollear, deriva lenta en reposo).
- Dos pasadas: una entre pasos→IA y otra invertida justo antes del CTA final.

### 3. La IA en directo (`.demo-ia`) — ⭐ la sección estrella
**Hoy la generación IA de menús/rutinas (OpenRouter + streaming) es INVISIBLE en la landing.**
- Split: izquierda copy ("Una IA que cocina tu semana"), derecha un **terminal HUD** (mono + chaflán).
- Al entrar en viewport se "teclea" un prompt real (`objetivo: perder grasa · 2.450 kcal · sin lactosa`)
  y van apareciendo los 7 días del menú línea a línea con cursor parpadeante — replica la UX real
  del streaming, con datos fake en el TS (sin llamar a la API).
- Tabs **Menú / Rutina** para enseñar las dos generaciones. Efecto haz de luz en el panel.

### 4. Un día con Cofira (`.dia-cofira`)
- Timeline de jornada: 07:30 desayuno → 10:00 agua → 14:05 comida → 18:30 gym → 21:10 cena → 22:00 ayuno.
- Desktop: **scroll horizontal pinned** (patrón ya probado en funcionalidades) con línea de tiempo SVG
  que se dibuja y tarjetas chaflán que entran al pasar. Móvil: columna vertical simple.
- Usa los assets reales `comida-avena/pollo/salmon.png`.

### 5. Testimonios (`.testimonios`)
- ⚠️ Las fotos antes/después YA están en el comparador de funcionalidades — aquí **no se repiten**.
- 3–4 **citas grandes editoriales** (comillas naranjas gigantes como gráfica) con nombre creíble,
  edad/ciudad y una métrica por persona ("-12,4 kg · 14 semanas") animada con contador.
- Avatar = inicial en bloque chaflán naranja (eco del mini-header).
- Cabecera con "4,8 ★ valoración media · +3.200 miembros".

### 6. Cofira vs lo de siempre (`.comparativa`)
- Tabla editorial de 3 columnas: Entrenador tradicional / Apps genéricas / **Cofira** (columna chaflán
  naranja elevada) × 6 filas: precio/mes, menú al gramo, rutina adaptativa, 24/7, gráficos, cancelación.
- Sin cajas: filas con rallita superior sutil; checks/cruces SVG propios.
- Va después de planes → **rellena el vacío negro gigante** que hay ahí ahora y cierra la compra.

### 7. Desde el blog (`.blog-teaser`)
- 3 entradas como filas editoriales grandes con número 01–03, categoría en mono, "6 min de lectura"
  y flecha → `/blog`. Hover: título se enciende + flecha desliza.

---

## REDISEÑOS DE LO EXISTENTE (problemas vistos en el navegador)

### Cifras — de cajas flotantes a franja técnica
Las 4 cajas redondeadas chocan con la foto del hero y con la etiqueta "DESLIZA".
→ **Franja técnica** pegada al borde inferior del hero: números enormes en display + etiqueta mono,
separados por rallitas verticales, **sin caja ninguna**.

### Pasos 01–03 — de "3 tarjetas iguales" a filas editoriales
El cliché de las 3 cards. → Filas a todo el ancho con rallita superior, número display gigante a la
izquierda con parallax, sin cajas.

### Planes — tarjetas al lenguaje nuevo + rellenar vacíos
- Tarjetas con **chaflán y marcos de esquina** (eco del CTA del header); la anual con el borde
  gradiente naranja del botón primario.
- El vacío de la cabecera lo ocupa un **toggle Mensual/Anual** + línea de garantía en mono
  ("sin permanencia · cancela en 1 clic").

### Pilares — matar el aire muerto
Bajo cada párrafo sobra ~40% de vacío. → 2–3 **micro-datos en mono** por pilar
("ajuste semanal automático", "±5 g de precisión", "gráficas en tiempo real") + enlace
"ver cómo →" que hace scroll a su funcionalidad.

### Hero — prueba social mínima
Línea en mono bajo el subtítulo: `4,8★ · +3.200 miembros`. Reposicionar "DESLIZA".

### FAQ — más chicha + filtros
4–5 preguntas nuevas + **chips de segmento** (Todos / Empezar / Planes / Cuenta) que filtran.

---

## Orden de ejecución propuesto

1. Coherencia primero: cifras (franja) + pasos (filas) + tarjetas planes (chaflán) + vacíos.
2. Manifiesto + Marquee.
3. Demo IA (validar antes de seguir — es la apuesta grande).
4. Un día con Cofira.
5. Testimonios + Comparativa.
6. Blog teaser + hero/FAQ + rastro ampliado.

Verificación tras cada bloque: recarga completa en `:4600`, scroll real con rueda, matriz
375/768/1280 × oscuro/claro, `prefers-reduced-motion` con todo visible, consola limpia.
