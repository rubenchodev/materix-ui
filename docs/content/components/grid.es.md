---
title: "Grid"
description: "Grilla flexbox de 12 columnas con cinco breakpoints (xs–xl), separación con gap en múltiplos de 8px (también por breakpoint) y alineación, para páginas responsivas."
group: "layout"
icon: "grid_view"
weight: 10
example: "grid"
import: "Grid"
mui: "https://mui.com/material-ui/react-grid/"
---

`Grid` reparte el ancho disponible en 12 columnas y deja que cada ítem declare cuántas ocupa en cada breakpoint, igual que el `Grid` de MUI (v2: flexbox con `gap`, sin márgenes negativos). Úsalo para maquetar páginas, formularios y paneles que cambian de columnas según el ancho de pantalla. Para apilar elementos en una sola dirección con una separación fija no necesitas una grilla: usa [Stack]({{< relref "/components/stack" >}}); para centrar y limitar el ancho de la página, [Container]({{< relref "/components/container" >}}).

```tsx
import { Grid } from '@rubenchodev/materix-react';
// o solo este componente
import { Grid } from '@rubenchodev/materix-react/components/grid';
```

## Uso básico

Un `<Grid container>` con `spacing` e ítems con columnas por breakpoint mediante `size` (API de MUI Grid v2). Redimensiona la ventana: 1 columna en móvil, 2 en tablet y 4 en escritorio.

{{< react-demo id="grid/01-basic" layout="block" >}}

Un `Grid` sin `container` ni tamaño actúa como contenedor (igual que en vanilla) y un `Grid` con tamaño es un ítem. Los tamaños se escriben como `size={{ xs: 12, md: 6 }}`, como array `size={[12, 6]}` (desde `xs`) o con las props sueltas `xs`, `sm`, `md`, `lg`, `xl` (los atributos `data-xs`… de vanilla); las props sueltas prevalecen sobre `size`.

## Columnas

Cada ítem ocupa `n/12` del ancho. Cuando la suma supera 12, los siguientes ítems saltan a una nueva línea.

{{< react-demo id="grid/02-columns" layout="block" >}}

## Breakpoints

Mobile-first: cada valor aplica desde su ancho mínimo hacia arriba. `xs` 0px · `sm` 600px · `md` 900px · `lg` 1200px · `xl` 1536px. Declara siempre `xs` como base.

{{< react-demo id="grid/03-breakpoints" layout="block" >}}

## Espaciado

`spacing={n}` separa filas y columnas `n × 8px` con `gap` de CSS, como MUI Grid v2. No hay márgenes negativos ni rellenos en los ítems, así que la grilla nunca desborda a su padre ni necesita un envoltorio con `overflow: hidden`. El ancho de cada columna descuenta su parte proporcional del gap (`100% · n/12 − gap · (12 − n)/12`), de modo que 12 columnas siempre suman el 100%.

Vale cualquier entero de `0` a `12` y los medios pasos `0.5`, `1.5` y `2.5` (4, 12 y 20px). Los valores fuera de la escala se ignoran con un aviso en desarrollo. El espaciado solo se aplica a contenedores.

{{< react-demo id="grid/04-spacing" layout="block" >}}

### Espaciado por filas y columnas

`rowSpacing` y `columnSpacing` fijan por separado la separación vertical y horizontal.

{{< react-demo id="grid/05-row-column-spacing" layout="block" >}}

### Espaciado responsive

`spacing`, `rowSpacing` y `columnSpacing` aceptan un objeto por breakpoint (o un array desde `xs`).

{{< react-demo id="grid/06-responsive-spacing" layout="block" >}}

## Auto-layout

`size="grow"` (o `true`, por ejemplo `xs` como prop booleana) hace que el ítem crezca y reparta el espacio libre con los demás ítems que crecen. `size="auto"` ajusta el ítem al ancho de su contenido (`flex: 0 0 auto`).

{{< react-demo id="grid/07-auto-layout" layout="block" >}}

## Alineación y dirección

`justifyContent` distribuye los ítems en horizontal (`flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`) y `alignItems` los alinea en vertical (`flex-start`, `center`, `flex-end`, `stretch`, `baseline`). También se aceptan los alias cortos `start`, `end`, `between`, `around` y `evenly`.

{{< react-demo id="grid/08-alignment" layout="block" >}}

`direction` cambia el sentido del flujo (`row`, `row-reverse`, `column`, `column-reverse`) y `wrap` el ajuste de línea (`wrap` por defecto, `nowrap`, `wrap-reverse`).

{{< react-demo id="grid/09-direction" layout="block" >}}

## Grillas anidadas

Un ítem con `container` también es contenedor: dentro vuelve a haber 12 columnas, con su propio espaciado.

{{< react-demo id="grid/10-nested" layout="block" >}}

## Casos de uso reales

Un panel con métricas (1 → 2 → 4 columnas) y un bloque principal con barra lateral, más un formulario que se apila en móvil. `component` renderiza la grilla como cualquier elemento (`ul`, `section`, `form`…).

{{< react-demo id="grid/11-real-world" layout="block" >}}

## Props controladas

En vanilla, `setSpacing(n, bp?)`, `setRowSpacing()`, `setColumnSpacing()`, `setJustifyContent()`, `setAlignItems()` y `setDirection()` sustituyen clases y los ítems nuevos se registran con `Materix.init()`. En React las props son la API y los ítems nuevos son simplemente nuevos hijos.

{{< react-demo id="grid/12-controlled" layout="block" >}}

## Sintaxis BEM completa

Con las clases escritas a mano la grilla funciona sin el componente.

{{< react-demo id="grid/13-bem" layout="block" >}}

## Referencia de API

### Props

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `container` | `boolean` | `false` | Contenedor flex de 12 columnas. Sin `container` ni tamaño, Grid actúa como contenedor. |
| `item` | `boolean` | `false` | Fuerza el papel de ítem sin tamaño. |
| `size` | `GridResponsive<GridSize>` | — | Columnas por breakpoint (MUI Grid v2). |
| `xs`, `sm`, `md`, `lg`, `xl` | `GridSize` | — | Columnas desde ese breakpoint (prevalecen sobre `size`). |
| `spacing` | `GridResponsive<GridSpacing>` | — | Separación de filas y columnas × 8px (solo contenedores). |
| `rowSpacing` | `GridResponsive<GridSpacing>` | — | Separación entre filas × 8px. |
| `columnSpacing` | `GridResponsive<GridSpacing>` | — | Separación entre columnas × 8px. |
| `direction` | `'row' \| 'column' \| 'row-reverse' \| 'column-reverse'` | — (`row`) | Dirección flex. |
| `wrap` | `'wrap' \| 'nowrap' \| 'wrap-reverse'` | — (`wrap`) | Ajuste de línea. |
| `justifyContent` | `'flex-start' \| 'center' \| 'flex-end' \| 'space-between' \| 'space-around' \| 'space-evenly'` | — | Distribución horizontal. |
| `alignItems` | `'flex-start' \| 'center' \| 'flex-end' \| 'stretch' \| 'baseline'` | — | Alineación vertical. |
| `component` | `ElementType` | `'div'` | Elemento o componente raíz. |
| `className` | `string` | — | Se concatena con las clases del componente. |
| `ref` | `Ref<HTMLElement>` | — | Apunta al elemento raíz. |

`GridSize` es `1`–`12`, `true` / `'grow'` o `'auto'`. `GridSpacing` es `0`–`12`, `0.5`, `1.5` o `2.5`. `GridResponsive<T>` es `T`, `{ xs?, sm?, md?, lg?, xl? }` o un array desde `xs`. Cualquier otra prop se reenvía al elemento raíz. También se exportan los normalizadores `normalizeGridSize()` y `normalizeGridSpacing()`.

### Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-mtx="grid"` (sin tamaño) | `<Grid>` o `<Grid container>` |
| `data-mtx="grid" data-xs="12" data-md="6"` | `<Grid size={{ xs: 12, md: 6 }}>` o `<Grid xs={12} md={6}>` |
| `data-xs="true"` / `data-xs="auto"` | `size="grow"` (o `xs`) / `size="auto"` |
| `data-container` / `data-item` | `container` / `item` |
| `data-spacing="2"` / `data-spacing-md="3"` | `spacing={2}` / `spacing={{ md: 3 }}` |
| `data-row-spacing`, `data-column-spacing` (+ `-{bp}`) | `rowSpacing`, `columnSpacing` |
| `data-direction` | `direction` |
| `data-justify` | `justifyContent` |
| `data-align` | `alignItems` |
| `mtx-grid--wrap-*` (solo CSS) | `wrap` |
| `setSpacing()`, `setRowSpacing()`, `setColumnSpacing()`, `setDirection()`, `setJustifyContent()`, `setAlignItems()` | Cambia la prop correspondiente. |
| `isContainer`, `isItem` | Se derivan de `container`, `item` y los tamaños. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-grid` | Clase base de todo contenedor e ítem. |
| `mtx-grid--container` | Contenedor flex de 12 columnas con `gap`. |
| `mtx-grid--item` | Ítem de la grilla. |
| `mtx-grid--{bp}-{1..12\|true\|auto}` | Columnas desde un breakpoint. |
| `mtx-grid--spacing-{n}` / `mtx-grid--{bp}-spacing-{n}` | Separación de filas y columnas (`2_5` para 2.5). |
| `mtx-grid--row-spacing-{n}`, `mtx-grid--column-spacing-{n}` (+ `{bp}-`) | Solo filas o solo columnas. |
| `mtx-grid--direction-{valor}` | Dirección flex. |
| `mtx-grid--wrap-{wrap\|nowrap\|reverse}` | Ajuste de línea. |
| `mtx-grid--justify-{valor}` | Distribución horizontal. |
| `mtx-grid--align-{valor}` | Alineación vertical. |

### Callbacks

`Grid` no tiene eventos propios.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-spacing-unit` | Unidad de espaciado (8px). |
| `--mtx-grid-parent-column-spacing` | Separación entre columnas del contenedor padre, descontada del ancho de cada ítem. |

## Accesibilidad

- La grilla es puramente visual: no añade roles ni cambia la semántica. Usa elementos con significado (`component="main"`, `"section"`, `"form"`) para los bloques que maquetas.
- El orden de lectura y de tabulación sigue al JSX, no a la posición visual. Con `direction="row-reverse"` o `column-reverse` el orden visual se invierte pero el del teclado no: úsalos solo cuando el orden no importe.
- Comprueba que el contenido siga siendo legible a 320px de ancho (WCAG 1.4.10): define siempre `xs` para que las columnas se apilen en móvil.
