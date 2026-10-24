---
title: "CSS Baseline"
description: "Base global de Materix: tipografía Roboto, colores de fondo y texto del tema, box-sizing, foco visible y color-scheme claro u oscuro."
group: "layout"
icon: "format_paint"
weight: 20
example: "css-baseline"
import: "CssBaseline, ScopedCssBaseline"
mui: "https://mui.com/material-ui/react-css-baseline/"
---

`CssBaseline` añade la clase `mtx-root` a `<body>`, que activa la base de estilos de Materix: tipografía Roboto a 16px, colores de fondo y texto del tema, `box-sizing: border-box` en todo el árbol, anillo de foco accesible y `color-scheme` coherente con el tema claro u oscuro. Además importa `@rubenchodev/materix-ui/base.css` (tokens + base). Renderízalo una sola vez en la raíz de tu app; usa `ScopedCssBaseline` cuando Materix conviva con otros estilos. No es un reset completo: no elimina márgenes de encabezados ni listas ni normaliza formularios.

```tsx
import { CssBaseline, ScopedCssBaseline } from '@rubenchodev/materix-react';
// o solo este componente
import { CssBaseline } from '@rubenchodev/materix-react/components/css-baseline';
```

## Uso básico

Renderiza `<CssBaseline />` una vez, junto a tu app. Añade `mtx-root` a `<body>` en un efecto (seguro en SSR) y lo retira al desmontarse, salvo que la clase ya estuviera. Varias instancias se cuentan por referencia: la clase se mantiene hasta que se desmonta la última. Los hijos, si los hay, se renderizan tal cual.

```tsx
export function App() {
  return (
    <>
      <CssBaseline />
      <Main />
    </>
  );
}
```

{{< react-demo id="css-baseline/01-basic" layout="block" >}}

{{< callout type="tip" title="Equivalencia" >}}
`<CssBaseline />`, `<body data-mtx="css-baseline">` y `<body class="mtx-root">` son equivalentes. Escribir la clase en tu plantilla HTML (o usar `MaterixProvider`, que renderiza un contenedor `.mtx-root`) evita un salto visual antes de que React hidrate.
{{< /callout >}}

## Con y sin línea base

A la izquierda, un bloque con los estilos del navegador; a la derecha, el mismo contenido dentro de `ScopedCssBaseline`: Roboto 16px, interlineado 1.5, colores del tema y negrita a 700.

{{< react-demo id="css-baseline/02-comparison" layout="block" >}}

## Qué aplica

Todas las reglas salen de `base.css` y se limitan a `.mtx-root` y sus descendientes. La de movimiento reducido solo afecta a los elementos de Materix (clases `mtx-*`).

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

## Box sizing

Dentro de `mtx-root` todo usa `box-sizing: border-box`: una caja con `width: 100%`, 16px de relleno y un borde de 4px no desborda su contenedor.

{{< react-demo id="css-baseline/03-box-sizing" layout="block" >}}

## Foco visible

Usa <kbd>Tab</kbd>: botones, enlaces y elementos enfocables muestran el anillo `--mtx-focus-ring-color` solo al navegar con el teclado. Los campos de texto se excluyen porque su borde ya indica el foco.

{{< react-demo "css-baseline/04-focus" >}}

## Tema claro y oscuro

El tema se elige con `data-mtx-theme` en `<html>` (o en cualquier ancestro), normalmente mediante `ThemeProvider` / `MaterixProvider` (ver [Temas]({{< relref "/guide/theming" >}})). Los tokens cambian y `.mtx-root` adopta el fondo, el texto y el `color-scheme` correspondientes, así que los controles nativos (`<input type="date">`, barras de scroll) también se ven oscuros. Cambia el tema de esta página para verlo.

{{< react-demo id="css-baseline/05-color-scheme" layout="block" >}}

## Línea base acotada

`ScopedCssBaseline` renderiza un contenedor `.mtx-root` (un `div`, o el elemento indicado en `component`) en lugar de tocar `<body>`, por ejemplo al incrustar un widget de Materix en una página con otros estilos. Solo ese subárbol recibe la tipografía, los colores y el `box-sizing`.

{{< react-demo id="css-baseline/06-scope" layout="block" >}}

{{< callout type="info" title="Alcance" >}}
Un contenedor acotado conserva su margen (solo `body.mtx-root` recibe `margin: 0`). La regla de `prefers-reduced-motion` solo reduce las animaciones de los elementos con clases `mtx-*`; el resto de la página conserva las suyas.
{{< /callout >}}

## Aplicar en tiempo de ejecución

En vanilla, `Materix.init(el, 'css-baseline')` marca un contenedor creado en tiempo de ejecución. En React, renderiza `ScopedCssBaseline` de forma condicional.

{{< react-demo id="css-baseline/07-dynamic" layout="block" >}}

## Sintaxis BEM completa

No hay estructura interna: basta con la clase.

{{< react-demo id="css-baseline/08-bem" layout="block" >}}

## Referencia de API

### Props de CssBaseline

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `target` | `'body' \| 'html'` | `'body'` | Elemento global que recibe `mtx-root`. |
| `children` | `ReactNode` | — | Se renderiza tal cual (opcional). |

`CssBaseline` no renderiza un elemento propio, así que no acepta `ref` ni `className`.

### Props de ScopedCssBaseline

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `component` | `ElementType` | `'div'` | Elemento o componente raíz (`section`, `main`…). |
| `className` | `string` | — | Se concatena con `mtx-root`. |
| `ref` | `Ref<HTMLElement>` | — | Apunta al elemento raíz. |

Cualquier otra prop se reenvía al elemento raíz.

### Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `<body data-mtx="css-baseline">` | `<CssBaseline />` |
| `<div data-mtx="css-baseline">` | `<ScopedCssBaseline>` |
| `<section data-mtx="css-baseline">` | `<ScopedCssBaseline component="section">` |
| `Materix.init(el, 'css-baseline')` | Renderiza `ScopedCssBaseline` de forma condicional. |
| `data-mtx-theme` en un ancestro | El mismo atributo, normalmente gestionado por `ThemeProvider`. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-root` | Activa la base descrita en «Qué aplica» para el elemento y sus descendientes. |

### Callbacks

`CssBaseline` y `ScopedCssBaseline` no emiten eventos.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-font-family` | Familia tipográfica base. |
| `--mtx-color-text-primary` | Color del texto. |
| `--mtx-color-background-default` | Color de fondo. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de `:focus-visible`. |

## Accesibilidad

- El anillo de foco solo aparece con el teclado (`:focus-visible`) y tiene un desplazamiento de 2px para no tapar el contenido. Los campos de texto se excluyen porque ya indican el foco con su borde.
- `color-scheme` hace que los controles nativos y las barras de scroll respeten el contraste del tema oscuro.
- Con `prefers-reduced-motion: reduce`, las animaciones y transiciones de los elementos de Materix se reducen a 0.01ms.
- La base no cambia la semántica: sigue usando encabezados, listas y landmarks reales.
