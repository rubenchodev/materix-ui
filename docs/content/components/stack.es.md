---
title: "Stack"
description: "Apila elementos en una dirección (columna o fila) con separación uniforme, alineación, ajuste de línea, divisores y cambios por breakpoint."
group: "layout"
icon: "view_agenda"
weight: 40
example: "stack"
import: "Stack"
mui: "https://mui.com/material-ui/react-stack/"
---

`Stack` coloca sus hijos uno tras otro en una sola dirección y los separa con `gap`, igual que el `Stack` de MUI. Úsalo para formularios, barras de acciones, listas de tarjetas o cualquier bloque que se apile en móvil y pase a fila en escritorio. Cuando el contenido necesita columnas alineadas entre filas, usa [Grid]({{< relref "/components/grid" >}}); para centrar y limitar el ancho de la página, [Container]({{< relref "/components/container" >}}).

```tsx
import { Stack } from '@rubenchodev/materix-react';
// o solo este componente
import { Stack } from '@rubenchodev/materix-react/components/stack';
```

## Uso básico

Un único `<Stack>`. La dirección por defecto es columna (como en MUI) y `spacing` fija la separación en múltiplos de 8px.

{{< react-demo id="stack/01-basic" layout="block" >}}

## Dirección

`direction`: `column` (por defecto), `row`, `column-reverse` o `row-reverse` (`col` se acepta como alias heredado de `column`). El orden de lectura y de tabulación sigue al JSX.

{{< react-demo id="stack/02-direction" layout="block" >}}

## Espaciado

Escala `0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10` (× 8px) aplicada con `gap`: sin márgenes en los hijos. Los valores fuera de la escala se ignoran (con un aviso en desarrollo).

{{< react-demo id="stack/03-spacing" layout="block" >}}

## Responsive

`direction` y `spacing` aceptan un objeto por breakpoint (`sm` 600px, `md` 900px, `lg` 1200px, `xl` 1536px) o un array que empieza en `xs`, como en MUI. Cada valor aplica desde ese ancho hacia arriba. Aquí: columna con 8px en móvil, fila con 16px desde 600px y 32px desde 900px.

{{< react-demo id="stack/04-responsive" layout="block" >}}

```tsx
<Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>…</Stack>
// lo mismo con arrays (xs, sm, md…)
<Stack direction={['column', 'row']} spacing={[1, 2, 4]}>…</Stack>
```

## Alineación

`alignItems` alinea en el eje cruzado (`start`, `center`, `end`, `stretch`, `baseline`) y `justifyContent` distribuye en el eje principal (`start`, `center`, `end`, `between`, `around`, `evenly`). También se aceptan los valores CSS (`flex-start`, `space-between`…).

{{< react-demo id="stack/05-alignment" layout="block" >}}

## Divisores

`divider` inserta un `<hr class="mtx-divider mtx-stack__divider" aria-hidden="true">` decorativo entre cada par de hijos: horizontal en columna y vertical en fila (también cuando la dirección cambia por breakpoint). También puedes pasar tu propio nodo, como en MUI: `divider={<span aria-hidden="true">·</span>}`. Los divisores se recalculan solos al cambiar los hijos (no hace falta `refresh()`).

{{< react-demo id="stack/06-dividers" layout="block" >}}

## Ajuste de línea

Con `wrap` los hijos pasan a la línea siguiente cuando no caben (útil para grupos de chips o botones). El `gap` también separa las líneas.

{{< react-demo id="stack/07-wrap" layout="block" >}}

## Grilla

Un Stack dentro de cada ítem de Grid: la grilla reparte las columnas y el stack ordena el contenido de cada una.

{{< react-demo id="stack/08-grid" layout="block" >}}

## Ejemplos reales

Una barra de acciones de formulario y una tarjeta de perfil hechas solo con Stack. `component="form"` convierte el stack en el propio formulario.

{{< react-demo id="stack/09-real-world" layout="block" >}}

## Props controladas

En vanilla, `setDirection()`, `setSpacing()`, `setAlign()`, `setJustify()`, `setWrap()`, `setDivider()` y `refresh()` modifican un elemento existente. En React cambias las props desde el estado; los divisores siguen a los hijos en cada render.

{{< react-demo id="stack/10-controlled" layout="block" >}}

## Sintaxis BEM completa

Las clases funcionan sin el componente; en ese caso los divisores se escriben a mano.

{{< react-demo id="stack/11-bem" layout="block" >}}

## Referencia de API

### Props

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `direction` | `StackResponsive<'row' \| 'column' \| 'row-reverse' \| 'column-reverse' \| 'col'>` | — (`column` en CSS) | Dirección flex, fija o por breakpoint. |
| `spacing` | `StackResponsive<0 \| 0.5 \| 1 \| 1.5 \| 2 \| 2.5 \| 3 \| 4 \| 5 \| 6 \| 8 \| 10>` | — | Separación × 8px, fija o por breakpoint. |
| `alignItems` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` (+ `flex-start`, `flex-end`) | — | Alineación en el eje cruzado. |
| `justifyContent` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` (+ valores CSS) | — | Distribución en el eje principal. |
| `wrap` | `boolean` | `false` | Permite que los hijos salten de línea. |
| `divider` | `boolean \| ReactNode` | — | `true` inserta un `<hr>` decorativo; un nodo se inserta tal cual. |
| `component` | `ElementType` | `'div'` | Elemento o componente raíz (`form`, `nav`, `ul`…). |
| `className` | `string` | — | Se concatena con las clases del componente. |
| `ref` | `Ref<HTMLElement>` | — | Apunta al elemento raíz. |

`StackResponsive<T>` es `T`, `{ xs?, sm?, md?, lg?, xl? }` o un array `[xs, sm, md, lg, xl]`. Cualquier otra prop se reenvía al elemento raíz.

### Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-mtx="stack"` | `<Stack>` |
| `data-direction="row"` / `data-direction-md="row"` | `direction="row"` / `direction={{ md: 'row' }}` |
| `data-spacing="2"` / `data-spacing-sm="3"` | `spacing={2}` / `spacing={{ sm: 3 }}` |
| `data-align="center"` | `alignItems="center"` |
| `data-justify="between"` | `justifyContent="between"` |
| `data-wrap` | `wrap` |
| `data-divider` | `divider` |
| `setDirection()`, `setSpacing()`, `setAlign()`, `setJustify()`, `setWrap()`, `setDivider()`, `refresh()` | Cambia la prop correspondiente; los divisores se recalculan en el render. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-stack` | Contenedor flex en columna. |
| `mtx-stack--{row\|column\|row-reverse\|column-reverse}` | Dirección desde xs. |
| `mtx-stack--{bp}-{dirección}` | Dirección desde `sm`, `md`, `lg` o `xl`. |
| `mtx-stack--spacing-{n}` / `mtx-stack--{bp}-spacing-{n}` | Separación (`1_5` para 1.5). |
| `mtx-stack--align-{start\|center\|end\|stretch\|baseline}` | Alineación en el eje cruzado. |
| `mtx-stack--justify-{start\|center\|end\|between\|around\|evenly}` | Distribución en el eje principal. |
| `mtx-stack--wrap` | Ajuste de línea. |
| `mtx-stack__divider` | Divisor entre hijos (junto con `mtx-divider`). |

### Callbacks

`Stack` no tiene eventos propios.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-spacing-{n}` | Valores de separación de la escala. |
| `--mtx-color-divider` | Color de los divisores. |

## Accesibilidad

- Stack no añade roles: usa `component` para renderizar el elemento semántico adecuado (`<form>`, `<nav>`, `<ul>` con hijos `<li>`…).
- Los divisores generados son decorativos (`aria-hidden="true"`): la estructura ya comunica la agrupación. Si pasas tu propio nodo en `divider`, márcalo también con `aria-hidden` cuando sea solo visual.
- Con `row-reverse` / `column-reverse` el orden visual se invierte pero el de lectura y tabulación sigue al JSX: úsalos solo cuando el orden no importe.
