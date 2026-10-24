---
title: "Typography"
description: "Aplica la escala tipográfica de MUI (h1 a overline) a cualquier elemento, separando la semántica HTML del estilo visual."
group: "data-display"
icon: "text_fields"
weight: 70
example: "typography"
import: "Typography"
mui: "https://mui.com/material-ui/react-typography/"
---

`Typography` aplica los estilos de texto de MUI (encabezados, subtítulos, cuerpo, botón, leyenda y overline) con la fuente Roboto y los tokens del tema. Úsalo para que todo el texto de la interfaz comparta una única escala. No lo necesitas para el texto que ya estiliza su componente (botones, campos, listas…).

```tsx
import { Typography } from '@rubenchodev/materix-react';
// o solo este componente:
import { Typography } from '@rubenchodev/materix-react/components/typography';
```

## Uso básico

Sin props, `<Typography>` es un párrafo `body1`. `variant` elige el estilo y `component` la etiqueta.

{{< react-demo id="typography/01-basic" layout="block" >}}

## Escala tipográfica

Las 13 variantes de MUI. Como en MUI, ninguna variante tiene márgenes (ni siquiera `h1`–`h6`): añádelos con `gutterBottom` (`0.35em`) o `paragraph` (16 px).

{{< react-demo id="typography/02-scale" layout="block" >}}

| Variante | Tamaño | Peso | Etiqueta por defecto |
|---|---|---|---|
| `h1` … `h6` | 96 / 60 / 48 / 34 / 24 / 20 px | 300 / 300 / 400 / 400 / 400 / 500 | `h1` … `h6` |
| `subtitle1` / `subtitle2` | 16 / 14 px | 400 / 500 | `p` |
| `body1` / `body2` | 16 / 14 px | 400 | `p` |
| `button` | 14 px, mayúsculas | 500 | `span` |
| `caption` | 12 px | 400 | `span` |
| `overline` | 12 px, mayúsculas | 400 | `span` |
| `inherit` | heredado | heredado | `p` |

Cambia las etiquetas por defecto con `variantMapping` (por ejemplo `variantMapping={{ subtitle1: 'h6' }}`) o pasa `component` para un único elemento.

## Semántica frente a estilo

`component` define la estructura del documento y `variant` el aspecto, de modo que puedes mantener una jerarquía de encabezados correcta sin depender del tamaño visual. Un `component` de encabezado (`h1`–`h6`) sin `variant` toma la variante de la etiqueta, como en vanilla.

{{< react-demo id="typography/03-semantics" layout="block" >}}

## Colores

`color` acepta los colores de la paleta (`primary`, `secondary`, `error`, `warning`, `info`, `success`), los de texto (`text-primary`, `text-secondary`, `text-disabled` o `disabled`) e `inherit`.

{{< react-demo id="typography/04-colors" layout="block" >}}

## Alineación

`align` acepta `left`, `center`, `right` y `justify` (`inherit` por defecto).

{{< react-demo id="typography/05-alignment" layout="block" >}}

## Márgenes y truncado

`gutterBottom` añade un margen inferior de `0.35em`; `paragraph` añade 16 px (y renderiza un `<p>` si no hay `component`); `noWrap` mantiene el texto en una línea y lo trunca con puntos suspensivos.

{{< react-demo id="typography/06-margins" layout="block" >}}

## Tipografía responsive

- **Variante por breakpoint** (mobile-first; sm 600 px, md 900 px, lg 1200 px, xl 1536 px): `variantSm`, `variantMd`, `variantLg` y `variantXl` sustituyen a `variant` desde ese ancho.
- **Escala fluida** (`responsiveFontSizes` de MUI): `responsive` escala h1–h6 con `clamp()` entre su tamaño móvil y el de escritorio. La clase `mtx-typography--responsive` también funciona en cualquier ancestro (por ejemplo en `<html>`).

{{< react-demo id="typography/07-responsive" layout="block" >}}

## Casos de uso

Cabecera de artículo dentro de un Paper: overline, título, metadatos y extracto.

{{< react-demo id="typography/08-use-cases" layout="block" >}}

## Grilla

KPI en una grilla: cifra en `h4`, etiqueta en `overline` y variación en `caption`.

{{< react-demo id="typography/09-grid" layout="block" >}}

## Uso programático

Typography no tiene estado: renderízalo a partir de tus datos y cambia `variant` como cualquier otra prop.

{{< react-demo id="typography/10-programmatic" layout="block" >}}

## API

### Props

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `variant` | `'h1'`…`'h6'` \| `'subtitle1'` \| `'subtitle2'` \| `'body1'` \| `'body2'` \| `'button'` \| `'caption'` \| `'overline'` \| `'inherit'` | `'body1'` (o la del `component` de encabezado) | Añade `.mtx-typography--{variant}`; `inherit` no añade clase de escala. |
| `component` | `ElementType` | según `variantMapping` | Elemento raíz. |
| `variantMapping` | `Partial<Record<variante, ElementType>>` | ver la tabla anterior | Etiqueta por defecto de cada variante. |
| `color` | `'primary'` \| `'secondary'` \| `'error'` \| `'warning'` \| `'info'` \| `'success'` \| `'text-primary'` \| `'text-secondary'` \| `'text-disabled'` \| `'disabled'` \| `'inherit'` | — | Añade `.mtx-typography--color-{color}`. |
| `align` | `'inherit'` \| `'left'` \| `'center'` \| `'right'` \| `'justify'` | `'inherit'` | Añade `.mtx-typography--{align}` y `.mtx-typography--align-{align}`. |
| `gutterBottom` | `boolean` | `false` | Margen inferior de `0.35em`. |
| `paragraph` | `boolean` | `false` | Margen inferior de 16 px (`.mtx-typography--paragraph`). |
| `noWrap` | `boolean` | `false` | Una sola línea con puntos suspensivos. |
| `variantSm` / `variantMd` / `variantLg` / `variantXl` | variante | — | Variante desde ese breakpoint (`.mtx-typography--{bp}-{variante}`). |
| `responsive` | `boolean` | `false` | Escala fluida de h1–h6 (`.mtx-typography--responsive`). |
| `className` | `string` | — | Se concatena con las clases del componente. |
| `ref` | `Ref<HTMLElement>` | — | Apunta al elemento raíz. |

El resto de props (`id`, `style`, `aria-*`, eventos) se reenvían al elemento raíz. La constante exportada `TYPOGRAPHY_VARIANT_MAPPING` contiene las etiquetas por defecto.

### Callbacks

Typography no emite eventos.

### Clases CSS

| Clase | Descripción |
|---|---|
| `.mtx-typography` | Base: sin márgenes, fuente del tema, color de texto primario. |
| `.mtx-typography--h1` … `--overline` | Una clase por variante. |
| `.mtx-typography--color-{color}` | Colores de paleta, de texto e `inherit`. |
| `.mtx-typography--align-{left\|center\|right\|justify}` | Alineación (más los alias `--left`, `--center`…). |
| `.mtx-typography--gutter-bottom` / `--paragraph` | Margen inferior de 0.35em / 16 px. |
| `.mtx-typography--no-wrap` | Truncado con puntos suspensivos. |
| `.mtx-typography--{sm\|md\|lg\|xl}-{variante}` | Variante desde ese breakpoint. |
| `.mtx-typography--responsive` | Escala fluida de h1–h6. |

## Accesibilidad

- Elige la etiqueta por su función (`h1`–`h6` para la jerarquía, `p` para párrafos) con `component`, y el aspecto con `variant`: los lectores de pantalla navegan por etiqueta, no por tamaño.
- No te saltes niveles de encabezado para conseguir un tamaño. Los subtítulos se renderizan como `<p>` por defecto para no crear encabezados por accidente.
- Los colores de estado y `disabled` no deben ser la única forma de transmitir información; acompáñalos de texto.
- El texto truncado con `noWrap` queda oculto visualmente: si es importante, ofrécelo completo en otro lugar (por ejemplo en un `title`).

## Equivalencia con vanilla

| Vanilla (`data-*`) | React |
|---|---|
| `<p data-mtx="typography" data-variant="body2">` | `<Typography variant="body2">` |
| `<h3 data-mtx="typography" data-variant="h5">` | `<Typography component="h3" variant="h5">` |
| `<h2 data-mtx="typography">` (variante de la etiqueta) | `<Typography component="h2">` |
| `data-color="error"` | `color="error"` |
| `data-align="center"` | `align="center"` |
| `data-gutter-bottom` / `data-paragraph` / `data-no-wrap` | `gutterBottom` / `paragraph` / `noWrap` |
| `data-variant-md="h4"` | `variantMd="h4"` |
| `data-responsive` | `responsive` |

Diferencias: vanilla no aplica variante por defecto en etiquetas que no son encabezados; React usa `body1` como MUI (`variant="inherit"` reproduce el comportamiento vanilla). Sin `component`, la etiqueta se deduce de la variante.
