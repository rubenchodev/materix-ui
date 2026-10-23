---
title: "Utilidades"
description: "Clases mtx-* mobile-first de display, flex, alineación, gap, espaciado, tamaño, texto, color, posición, bordes y elevación para maquetar sin CSS propio."
weight: 35
icon: "build"
---

Materix incluye un sistema de **clases utilitarias** de una sola propiedad, al estilo de Bootstrap, con los tokens y la estética de MUI. Junto a [Container]({{< relref "/components/container" >}}), [Stack]({{< relref "/components/stack" >}}) y [Grid]({{< relref "/components/grid" >}}) permiten maquetar una aplicación completa sin escribir CSS propio: tu hoja de estilos queda solo para la marca (ilustraciones, gradientes, gráficos).

- Todas empiezan por `mtx-` y llevan `!important`, de modo que ganan siempre a los estilos de componente.
- Los valores salen de los tokens `--mtx-*`: cambian con el tema claro/oscuro y con tu tema de marca.
- Se cargan con `materix.min.css`; no requieren JavaScript.

## Breakpoints e infijos

Las utilidades responsive son *mobile-first*: la clase sin infijo aplica desde 0px y la clase con infijo aplica **desde** ese ancho hacia arriba (`min-width`). El infijo va justo después del grupo: `mtx-d-md-none`, `mtx-p-lg-4`, `mtx-flex-sm-row`, `mtx-text-md-start`.

| Infijo | Ancho mínimo | Ejemplo |
|---|---|---|
| (ninguno) | 0px | `mtx-d-none` |
| `sm` | 600px | `mtx-d-sm-block` |
| `md` | 900px | `mtx-flex-md-row` |
| `lg` | 1200px | `mtx-gap-lg-4` |
| `xl` | 1536px | `mtx-px-xl-6` |

{{< mtx-demo title="Cambia el ancho de la ventana" layout="row" >}}
<span class="mtx-d-sm-none mtx-bg-primary mtx-rounded mtx-px-2 mtx-py-1">xs</span>
<span class="mtx-d-none mtx-d-sm-inline-block mtx-d-md-none mtx-bg-primary mtx-rounded mtx-px-2 mtx-py-1">sm</span>
<span class="mtx-d-none mtx-d-md-inline-block mtx-d-lg-none mtx-bg-primary mtx-rounded mtx-px-2 mtx-py-1">md</span>
<span class="mtx-d-none mtx-d-lg-inline-block mtx-d-xl-none mtx-bg-primary mtx-rounded mtx-px-2 mtx-py-1">lg</span>
<span class="mtx-d-none mtx-d-xl-inline-block mtx-bg-primary mtx-rounded mtx-px-2 mtx-py-1">xl</span>
{{< /mtx-demo >}}

### Escala de espaciado

Gap, margin y padding usan la escala `{n}` = `0`, `0_5`, `1`, `1_5`, `2`, `2_5`, `3`, `4`, `5`, `6`, `8`, `10`, que equivale a `n × 8px` mediante los tokens `--mtx-spacing-{n}` (`0_5` = 4px, `1_5` = 12px, `2_5` = 20px).

## Display

| Clases | Responsive | Propiedad |
|---|---|---|
| `mtx-d-{none, block, inline, inline-block, flex, inline-flex, grid, contents}` | Sí: `mtx-d-{bp}-*` | `display` |

El atributo `hidden` gana siempre dentro de `.mtx-root` (`[hidden] { display: none !important }`), aunque el elemento tenga `mtx-d-flex`.

{{< mtx-demo title="Ocultar en móvil, mostrar desde md" layout="row" >}}
<span class="mtx-d-inline-flex mtx-align-items-center mtx-gap-1"><span class="material-icons" aria-hidden="true">smartphone</span>Siempre visible</span>
<span class="mtx-d-none mtx-d-md-inline-flex mtx-align-items-center mtx-gap-1"><span class="material-icons" aria-hidden="true">desktop_windows</span>Solo desde 900px</span>
{{< /mtx-demo >}}

## Flex

| Clases | Responsive | Propiedad |
|---|---|---|
| `mtx-flex-{row, column, row-reverse, column-reverse}` | Sí | `flex-direction` |
| `mtx-flex-wrap` · `mtx-flex-nowrap` | Sí | `flex-wrap` |
| `mtx-flex-1` | No | `flex: 1 1 0%` |
| `mtx-flex-grow-{0,1}` · `mtx-flex-shrink-{0,1}` | No | `flex-grow` / `flex-shrink` |
| `mtx-min-w-0` | No | `min-width: 0` (permite truncar texto dentro de flex) |

{{< mtx-demo title="Columna en móvil, fila desde md, centro flexible" layout="block" >}}
<div class="mtx-d-flex mtx-flex-column mtx-flex-md-row mtx-gap-1">
  <div class="mtx-paper mtx-paper--outlined mtx-p-2 mtx-flex-shrink-0">Fijo</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2 mtx-flex-1 mtx-min-w-0 mtx-text-truncate">Ocupa el resto del espacio y trunca un texto largo que no cabe</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2 mtx-flex-shrink-0">Fijo</div>
</div>
{{< /mtx-demo >}}

## Alineación

| Clases | Responsive | Propiedad |
|---|---|---|
| `mtx-align-items-{start, center, end, baseline, stretch}` | Sí | `align-items` |
| `mtx-align-self-{start, center, end, stretch}` | Sí | `align-self` |
| `mtx-justify-content-{start, center, end, between, around, evenly}` | Sí | `justify-content` |
| `mtx-align-content-{start, center, between}` | Sí | `align-content` |

{{< mtx-demo title="Barra con título y acciones" layout="block" >}}
<div class="mtx-d-flex mtx-justify-content-between mtx-align-items-center mtx-p-2 mtx-border mtx-rounded">
  <span class="mtx-typography--h6">Pedidos</span>
  <button class="mtx-button mtx-button--contained" data-mtx="button" type="button">Nuevo</button>
</div>
{{< /mtx-demo >}}

## Gap

| Clases | Responsive | Propiedad |
|---|---|---|
| `mtx-gap-{n}` | Sí | `gap` |
| `mtx-row-gap-{n}` · `mtx-column-gap-{n}` | Sí | `row-gap` / `column-gap` |

{{< mtx-demo title="gap-1 en móvil, gap-md-4 desde 900px" layout="block" >}}
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-1 mtx-gap-md-4">
  <div data-mtx="chip" data-label="Uno"></div>
  <div data-mtx="chip" data-label="Dos"></div>
  <div data-mtx="chip" data-label="Tres"></div>
</div>
{{< /mtx-demo >}}

## Espaciado

| Clases | Responsive | Propiedad |
|---|---|---|
| `mtx-m-{n}` · `mtx-mx-{n}` · `mtx-my-{n}` | Sí | `margin`, `margin-inline`, `margin-block` |
| `mtx-mt-{n}` · `mtx-mb-{n}` · `mtx-ms-{n}` · `mtx-me-{n}` | Sí | `margin-top`, `margin-bottom`, `margin-inline-start`, `margin-inline-end` |
| `mtx-p-{n}` · `mtx-px-{n}` · `mtx-py-{n}` | Sí | `padding`, `padding-inline`, `padding-block` |
| `mtx-pt-{n}` · `mtx-pb-{n}` · `mtx-ps-{n}` · `mtx-pe-{n}` | No | `padding-top`, `padding-bottom`, `padding-inline-*` |
| `mtx-{m, ms, me, mx, mt, mb}-auto` | Sí | margen automático |
| `mtx-ml-{0..4,auto}` · `mtx-mr-*` · `mtx-pl-{0..4}` · `mtx-pr-*` | No | Alias heredados (físicos). Prefiere `ms`/`me`/`ps`/`pe`. |

`s` (start) y `e` (end) son **lógicas**: respetan la dirección del texto (en RTL, `ms` es el margen derecho).

{{< mtx-demo title="mtx-ms-auto empuja a la derecha" layout="block" >}}
<div class="mtx-d-flex mtx-align-items-center mtx-gap-1 mtx-p-1 mtx-border mtx-rounded">
  <span class="mtx-typography--subtitle2 mtx-px-1">Materix</span>
  <button class="mtx-button mtx-button--text mtx-ms-auto" data-mtx="button" type="button">Entrar</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" type="button">Registro</button>
</div>
{{< /mtx-demo >}}

## Tamaño

| Clase | Propiedad |
|---|---|
| `mtx-w-{25, 50, 75, 100, auto}` | `width` |
| `mtx-h-{100, auto}` | `height` |
| `mtx-mw-100` · `mtx-mh-100` | `max-width: 100%` · `max-height: 100%` |
| `mtx-vh-100` · `mtx-min-vh-100` | `height` / `min-height` de `100dvh` (con respaldo `100vh`) |

## Texto y tipografía

| Clases | Responsive | Propiedad |
|---|---|---|
| `mtx-text-{start, center, end}` | Sí | `text-align` (lógico) |
| `mtx-text-nowrap` · `mtx-text-wrap` | No | `white-space` |
| `mtx-text-truncate` | No | una línea con puntos suspensivos |
| `mtx-line-clamp-{2, 3}` | No | recorta a 2 o 3 líneas |
| `mtx-text-{uppercase, lowercase, capitalize}` · `mtx-text-decoration-none` | No | transformación / subrayado |
| `mtx-fw-{light, regular, medium, bold}` | No | `font-weight` 300 / 400 / 500 / 700 |
| `mtx-tabular-nums` · `mtx-lh-1` | No | cifras tabulares · `line-height: 1` |
| `mtx-typography--{h1…h6, subtitle1, subtitle2, body1, body2, caption, overline, button}` | No | Escala tipográfica MUI como clase pura, en cualquier etiqueta y sin JS |
| `mtx-typography--{sm, md, lg, xl}-{variante}` | Sí | Cambia la variante desde ese breakpoint (mobile-first): `mtx-typography--h4 mtx-typography--md-h3` |
| `mtx-typography--responsive` | — | Escala fluida de h1–h6 con `clamp()` (como `responsiveFontSizes` de MUI); en el elemento o en un ancestro, incluido `<html>` |

{{< mtx-demo title="Tipografía como clase" layout="column" >}}
<h3 class="mtx-typography--h6">Un h3 con aspecto h6</h3>
<span class="mtx-typography--overline mtx-color-text-secondary">Overline en un span</span>
<p class="mtx-typography--body2 mtx-line-clamp-2">Este párrafo largo usa mtx-line-clamp-2: Materix UI implementa los componentes de Material UI con CSS y JavaScript vanilla, sin frameworks ni Shadow DOM, con accesibilidad desde el diseño y temas claro y oscuro basados en tokens.</p>
<span class="mtx-typography--h5 mtx-tabular-nums mtx-fw-medium">12.480,00 €</span>
{{< /mtx-demo >}}

{{< mtx-demo title="Tipografía responsive" layout="column" >}}
<h3 class="mtx-typography--h5 mtx-typography--md-h4 mtx-typography--lg-h3">h5 en móvil, h4 desde 900px, h3 desde 1200px</h3>
<h2 class="mtx-typography--h3 mtx-typography--responsive">Titular fluido con clamp()</h2>
{{< /mtx-demo >}}

Más detalles en [Typography]({{< relref "/components/typography" >}}).

## Color

| Clases | Propiedad |
|---|---|
| `mtx-color-{text-primary, text-secondary, text-disabled, primary, secondary, success, error, warning, info, inherit}` | `color` |
| `mtx-bg-{paper, default, action-hover, action-selected, transparent}` | `background-color` |
| `mtx-bg-primary` · `mtx-bg-secondary` | fondo de paleta **y** color de contraste |

{{< mtx-demo title="Texto y fondos" layout="row" >}}
<span class="mtx-color-primary">primary</span>
<span class="mtx-color-success">success</span>
<span class="mtx-color-error">error</span>
<span class="mtx-color-text-secondary">text-secondary</span>
<span class="mtx-bg-primary mtx-rounded mtx-px-2 mtx-py-1">bg-primary</span>
<span class="mtx-bg-action-selected mtx-rounded mtx-px-2 mtx-py-1">bg-action-selected</span>
{{< /mtx-demo >}}

## Accesibilidad

| Clase | Uso |
|---|---|
| `mtx-visually-hidden` | Oculta visualmente; los lectores de pantalla lo leen. Para etiquetas de botones solo-icono o encabezados de sección. |
| `mtx-visually-hidden-focusable` | Igual, pero visible cuando él o un descendiente recibe el foco. |
| `mtx-skip-link` | Enlace «Saltar al contenido»: fijo arriba a la izquierda, oculto hasta recibir foco con Tab, estilo de botón contained primary. |

```html
<body class="mtx-root">
  <a class="mtx-skip-link" href="#main">Saltar al contenido</a>
  …
  <main id="main" tabindex="-1">…</main>
</body>
```

## Posición, capas y overflow

| Clase | Propiedad |
|---|---|
| `mtx-position-{static, relative, absolute, fixed, sticky}` | `position` |
| `mtx-sticky-top` · `mtx-sticky-{bp}-top` | `position: sticky` con `top: var(--mtx-app-bar-height)` (56px en móvil, 64px desde 600px): queda justo bajo la App Bar |
| `mtx-top-0` · `mtx-bottom-0` · `mtx-start-0` · `mtx-end-0` · `mtx-inset-0` | desplazamientos a 0 (`start`/`end` lógicos) |
| `mtx-z-{0, 1, 2, 3, app-bar, drawer, modal}` | `z-index` (los tres últimos reutilizan `--mtx-z-index-*`) |
| `mtx-scroll-smooth` | `scroll-behavior: smooth` (normalmente en `<html>`); se desactiva con `prefers-reduced-motion: reduce` |
| `mtx-scroll-mt-app-bar` | `scroll-margin-top: var(--mtx-app-bar-height)`: el destino de un ancla no queda bajo la App Bar |
| `mtx-overflow-{hidden, auto, visible}` · `mtx-overflow-x-auto` · `mtx-overflow-y-auto` | `overflow` |

Las páginas con una [App Bar]({{< relref "/components/app-bar" >}}) `fixed` o `sticky` ya reservan su altura en `<html>` con `scroll-padding-top` automático; `mtx-scroll-mt-app-bar` sirve para destinos concretos o cuando ese ajuste se desactiva.

```html
<html class="mtx-scroll-smooth">
  …
  <section id="precios" class="mtx-scroll-mt-app-bar">…</section>
```

## Bordes, radio y elevación

| Clase | Propiedad |
|---|---|
| `mtx-border` · `mtx-border-{top, bottom, start, end}` | borde de 1px con `--mtx-color-divider` |
| `mtx-border-0` | sin borde |
| `mtx-border-{primary, error, divider}` | color del borde |
| `mtx-rounded` · `mtx-rounded-{0, 2, 3}` | radio de 4px (`--mtx-shape-radius`), 0, 8px, 12px |
| `mtx-rounded-circle` · `mtx-rounded-pill` | 50% · 9999px |
| `mtx-elevation-{0…8, 12, 16, 24}` | sombras MUI `--mtx-elevation-*` |

{{< mtx-demo title="Bordes y elevación" layout="row" >}}
<span class="mtx-border mtx-rounded mtx-p-2">border</span>
<span class="mtx-border mtx-border-primary mtx-rounded-2 mtx-p-2">primary · r2</span>
<span class="mtx-bg-paper mtx-rounded mtx-elevation-2 mtx-p-2">elevation-2</span>
<span class="mtx-bg-paper mtx-rounded mtx-elevation-8 mtx-p-2">elevation-8</span>
{{< /mtx-demo >}}

## Varios

| Clase | Uso |
|---|---|
| `mtx-stretched-link` | Extiende el área clicable del enlace a su ancestro con `position: relative` (tarjetas clicables sin anidar elementos interactivos). |
| `mtx-stretched-link-above` | Saca un control (botón, chip, enlace) por encima del área del `mtx-stretched-link` para que siga siendo clicable. Equivale a `mtx-position-relative mtx-z-2`. |
| `mtx-list-unstyled` | Lista sin viñetas, `padding` ni `margin` (para `<ul>`/`<ol>` en flex o grid). Se combina con `mtx-m*-{n}`. |
| `mtx-pointer-events-none` · `mtx-user-select-none` · `mtx-cursor-pointer` | Interacción del puntero. |
| `mtx-object-cover` | `object-fit: cover` para imágenes y vídeos. |

### Controles sobre un enlace extendido

El `::after` de `mtx-stretched-link` cubre el contenedor con `z-index: 1`. Como en Bootstrap, los controles que deban seguir funcionando dentro del contenedor llevan `mtx-stretched-link-above` (o `mtx-position-relative mtx-z-2`).

{{< mtx-demo title="Tarjeta clicable con acciones propias" layout="column" >}}
<article class="mtx-position-relative mtx-bg-paper mtx-border mtx-rounded mtx-p-2 mtx-d-flex mtx-flex-column mtx-gap-1">
  <h3 class="mtx-typography--h6"><a class="mtx-stretched-link mtx-text-decoration-none mtx-color-inherit" href="#controles-sobre-un-enlace-extendido">Guía de utilidades</a></h3>
  <p class="mtx-typography--body2 mtx-color-text-secondary">Toda la tarjeta abre el artículo; las acciones de abajo siguen siendo independientes.</p>
  <ul class="mtx-list-unstyled mtx-d-flex mtx-gap-1" role="list">
    <li><a class="mtx-button mtx-button--outlined mtx-stretched-link-above" data-mtx="button" data-size="small" href="#varios">CSS</a></li>
    <li><button type="button" class="mtx-button mtx-button--text mtx-position-relative mtx-z-2" data-mtx="button" data-size="small" data-start-icon="bookmark_border">Guardar</button></li>
  </ul>
</article>
{{< /mtx-demo >}}

> `list-style: none` hace que Safari/VoiceOver deje de anunciar la lista: añade `role="list"` cuando la semántica de lista importe.

## Recetas

Patrones habituales resueltos solo con utilidades y componentes de Materix.

### App shell

Barra superior, navegación lateral visible desde 900px y contenido principal centrado.

{{< mtx-demo title="App shell" layout="block" height="360px" >}}
<div class="mtx-d-flex mtx-flex-column mtx-border mtx-rounded mtx-overflow-hidden">
  <header data-mtx="app-bar" data-position="static" data-color="primary" data-title="Panel" data-start-icon="menu"></header>
  <div class="mtx-d-flex mtx-flex-1">
    <nav class="mtx-d-none mtx-d-md-block mtx-border-end mtx-bg-paper mtx-flex-shrink-0" aria-label="Principal">
      <ul data-mtx="list" aria-label="Secciones">
        <li data-mtx="list-item" data-icon="dashboard">Resumen</li>
        <li data-mtx="list-item" data-icon="shopping_cart">Pedidos</li>
        <li data-mtx="list-item" data-icon="people">Clientes</li>
      </ul>
    </nav>
    <main class="mtx-flex-1 mtx-min-w-0 mtx-py-3">
      <div data-mtx="container" data-max-width="md">
        <h2 class="mtx-typography--h5 mtx-mt-0 mtx-mb-2">Resumen</h2>
        <p class="mtx-typography--body2 mtx-color-text-secondary">El contenido se centra con Container y la navegación lateral aparece desde 900px con mtx-d-none mtx-d-md-block.</p>
      </div>
    </main>
  </div>
</div>
{{< /mtx-demo >}}

En una página real usa `mtx-min-vh-100` en el envoltorio y, para la navegación, el componente [Drawer]({{< relref "/components/drawer" >}}).

### Autenticación centrada

{{< mtx-demo title="Formulario centrado" layout="block" >}}
<div class="mtx-d-flex mtx-align-items-center mtx-justify-content-center mtx-bg-default mtx-py-5 mtx-px-2">
  <form class="mtx-bg-paper mtx-border mtx-rounded mtx-p-3 mtx-p-sm-4 mtx-w-100" data-mtx="container" data-max-width="xs" data-disable-gutters>
    <div data-mtx="stack" data-spacing="2">
      <div class="mtx-text-center">
        <h2 class="mtx-typography--h5 mtx-mt-0">Iniciar sesión</h2>
        <p class="mtx-typography--body2 mtx-color-text-secondary">Accede a tu cuenta</p>
      </div>
      <input data-mtx="text-field" data-label="Correo electrónico" data-variant="outlined" type="email" autocomplete="email">
      <input data-mtx="text-field" data-label="Contraseña" data-variant="outlined" type="password" autocomplete="current-password">
      <button class="mtx-button mtx-button--contained mtx-w-100" data-mtx="button" type="button">Entrar</button>
    </div>
  </form>
</div>
{{< /mtx-demo >}}

### Estado vacío

{{< mtx-demo title="Sin resultados" layout="block" >}}
<div class="mtx-d-flex mtx-flex-column mtx-align-items-center mtx-text-center mtx-gap-1 mtx-py-5 mtx-px-2 mtx-border mtx-rounded">
  <span class="material-icons mtx-color-text-disabled" aria-hidden="true">inbox</span>
  <h3 class="mtx-typography--subtitle1 mtx-my-0">No hay mensajes</h3>
  <p class="mtx-typography--body2 mtx-color-text-secondary">Cuando recibas un correo aparecerá aquí.</p>
  <button class="mtx-button mtx-button--outlined mtx-mt-1" data-mtx="button" type="button">Redactar</button>
</div>
{{< /mtx-demo >}}

### Tarjeta de estadística

{{< mtx-demo title="KPI" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div class="mtx-bg-paper mtx-border mtx-rounded mtx-p-2 mtx-d-flex mtx-flex-column mtx-gap-1">
      <div class="mtx-d-flex mtx-justify-content-between mtx-align-items-center">
        <span class="mtx-typography--overline mtx-color-text-secondary">Ingresos</span>
        <span class="material-icons mtx-color-success" aria-hidden="true">trending_up</span>
      </div>
      <span class="mtx-typography--h4 mtx-tabular-nums">48.290 €</span>
      <span class="mtx-typography--body2 mtx-color-success mtx-fw-medium">+12,4 % vs. mes anterior</span>
    </div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div class="mtx-bg-paper mtx-border mtx-rounded mtx-p-2 mtx-d-flex mtx-flex-column mtx-gap-1">
      <div class="mtx-d-flex mtx-justify-content-between mtx-align-items-center">
        <span class="mtx-typography--overline mtx-color-text-secondary">Devoluciones</span>
        <span class="material-icons mtx-color-error" aria-hidden="true">trending_down</span>
      </div>
      <span class="mtx-typography--h4 mtx-tabular-nums">1,8 %</span>
      <span class="mtx-typography--body2 mtx-color-error mtx-fw-medium">+0,3 pts vs. mes anterior</span>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

## Mantenimiento

`src/styles/utilities.css` es un archivo **generado**. Para añadir o cambiar utilidades edita la tabla de `scripts/gen-utilities.mjs` y ejecuta:

```bash
npm run gen:utilities
```

Un test comprueba que el archivo commiteado coincide con el generador.
