---
title: "CSS Baseline"
description: "Base global de Materix: tipografía Roboto, colores de fondo y texto del tema, box-sizing, foco visible y color-scheme claro u oscuro."
group: "layout"
icon: "format_paint"
weight: 20
example: "css-baseline"
mui: "https://mui.com/material-ui/react-css-baseline/"
---

`CssBaseline` marca un elemento raíz con la clase `mtx-root`, que activa la base de estilos de Materix: tipografía Roboto a 16px, colores de fondo y texto del tema, `box-sizing: border-box` en todo el árbol, anillo de foco accesible y `color-scheme` coherente con el tema claro u oscuro. Úsalo una sola vez en el `<body>` de tu aplicación, o en un contenedor si Materix convive con otros estilos. No es un reset completo: no elimina márgenes de encabezados ni listas ni normaliza formularios.

## Uso básico

Añade `data-mtx="css-baseline"` al `<body>`. El componente añade la clase `mtx-root`; escribir `class="mtx-root"` directamente produce el mismo resultado sin JavaScript.

```html
<body data-mtx="css-baseline">
  <!-- Aplicación -->
</body>
```

{{< callout type="tip" title="Equivalencia" >}}
`<body data-mtx="css-baseline">` y `<body class="mtx-root">` son equivalentes. La clase es preferible si quieres evitar un salto visual antes de que cargue el JavaScript.
{{< /callout >}}

## Qué aplica

Todas las reglas salen de `src/styles/base.css` y se limitan a `.mtx-root` y sus descendientes. La de movimiento reducido solo afecta a los elementos de Materix (clases `mtx-*`).

| Selector | Propiedades | Efecto |
|---|---|---|
| `.mtx-root`, `.mtx-root *`, `::before`, `::after` | `box-sizing: border-box` | El relleno y el borde se incluyen en el ancho. |
| `body.mtx-root` | `margin: 0` | Quita el margen del `<body>`. Un contenedor acotado conserva su margen. |
| `.mtx-root` | `font-family: var(--mtx-font-family)`; `font-weight: 400`; `font-size: 1rem`; `line-height: 1.5` | Tipografía base Roboto (equivalente a `body1`). |
| `.mtx-root` | `color: var(--mtx-color-text-primary)`; `background-color: var(--mtx-color-background-default)` | Colores de texto y fondo del tema activo. |
| `.mtx-root` | `color-scheme: light` | Controles nativos, barras de scroll y autocompletado en claro. |
| `.mtx-root[data-mtx-theme='dark']`, `[data-mtx-theme='dark'] .mtx-root` | `color-scheme: dark` | Controles nativos en oscuro cuando el tema es oscuro. |
| `.mtx-root` | `-webkit-font-smoothing: antialiased`; `-moz-osx-font-smoothing: grayscale` | Suavizado de fuente en macOS. |
| `.mtx-root strong`, `.mtx-root b` | `font-weight: 700` | Negrita real con Roboto 700. |
| `.mtx-root :focus-visible` (excepto `input`, `textarea`, `select` y `.mtx-menu`) | `outline: var(--mtx-focus-ring-width) solid var(--mtx-focus-ring-color)`; `outline-offset: 2px` | Anillo de foco solo con teclado. |
| `.mtx-root .mtx-menu-item` | `outline: none !important` | Los ítems de menú indican el foco con su fondo. |
| `@media (prefers-reduced-motion: reduce)` → `[class*='mtx-']` | Animaciones y transiciones a `0.01ms` | Respeta la preferencia de movimiento reducido solo en elementos de Materix. |
| `@media print` → `.mtx-root` | `background-color: #fff`; `color-scheme: light` | Impresión sobre fondo blanco. |

## Tema claro y oscuro

El tema se elige con `data-mtx-theme` en `<html>` (o en cualquier ancestro). Los tokens cambian y `.mtx-root` adopta el fondo, el texto y el `color-scheme` correspondientes, de modo que los controles nativos (`<input type="date">`, barras de scroll) también se ven oscuros.

```html
<html data-mtx-theme="dark">
  <body data-mtx="css-baseline">…</body>
</html>
```

{{< mtx-demo title="Controles nativos con el tema activo" layout="column" >}}
<div data-mtx="css-baseline" class="mtx-p-2">
  <p>Texto con la tipografía base y <strong>negrita a 700</strong>.</p>
  <input type="date" aria-label="Fecha nativa">
  <select aria-label="Select nativo"><option>Opción nativa</option></select>
</div>
{{< /mtx-demo >}}

Cambia el tema de esta página para ver cómo el selector de fecha y el `<select>` nativos siguen el `color-scheme`.

## Ámbito acotado

`CssBaseline` puede aplicarse a un contenedor en lugar del `<body>`, por ejemplo al incrustar un widget de Materix en una página con otros estilos. Solo ese subárbol recibe la tipografía, los colores y el `box-sizing`.

{{< mtx-demo title="Baseline en un contenedor" layout="block" >}}
<section data-mtx="css-baseline" class="mtx-p-2">
  <h3>Widget con baseline</h3>
  <p>Este bloque usa Roboto, el fondo <code>background-default</code> y el anillo de foco de Materix.</p>
  <button class="mtx-button mtx-button--contained" data-mtx="button">Acción</button>
</section>
{{< /mtx-demo >}}

{{< callout type="info" title="Alcance" >}}
Un contenedor acotado conserva su margen (solo `body.mtx-root` recibe `margin: 0`). La regla de `prefers-reduced-motion` solo reduce las animaciones de los elementos con clases `mtx-*`; el resto de la página conserva las suyas.
{{< /callout >}}

## Sintaxis BEM completa

No hay estructura interna: basta la clase.

```html
<body class="mtx-root">…</body>
<!-- o acotado -->
<div class="mtx-root">…</div>
```

## Uso programático

```javascript
// Aplicar a un contenedor creado en tiempo de ejecución
const baseline = Materix.init(document.getElementById('widget'), 'css-baseline');

// Instanciación directa y recuperación
new Materix.CssBaseline(document.body);
Materix.getInstance(document.body);

// Cambiar el tema (los tokens y color-scheme se actualizan solos)
document.documentElement.setAttribute('data-mtx-theme', 'dark');
```

Con ES modules:

```javascript
import { CssBaseline, init } from 'materix-ui';
new CssBaseline(document.body);
```

## Referencia de API

### Atributos data-*

| Atributo | Valores | Predeterminado | Descripción |
|---|---|---|---|
| `data-mtx` | `css-baseline` | — | Añade la clase `mtx-root` al elemento. |
| `data-mtx-theme` | `light`, `dark` | `light` | En `<html>` o en un ancestro (no es un atributo del componente): selecciona el tema y el `color-scheme`. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-root` | Activa la base descrita en «Qué aplica» para el elemento y sus descendientes. |

### Métodos

`CssBaseline` no expone métodos propios.

### Eventos

`CssBaseline` no emite eventos.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-font-family` | Familia tipográfica base. |
| `--mtx-color-text-primary` | Color de texto. |
| `--mtx-color-background-default` | Color de fondo. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de `:focus-visible`. |

## Accesibilidad

- El anillo de foco solo aparece con teclado (`:focus-visible`) y tiene un desplazamiento de 2px para no tapar el contenido. Los campos de texto se excluyen porque ya indican el foco con su borde.
- `color-scheme` hace que los controles nativos y las barras de desplazamiento respeten el contraste del tema oscuro.
- Con `prefers-reduced-motion: reduce` las animaciones y transiciones de los elementos de Materix se reducen a 0.01ms.
- El baseline no cambia la semántica: sigue usando encabezados, listas y landmarks reales.
