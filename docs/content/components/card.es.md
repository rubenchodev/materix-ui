---
title: "Card"
description: "Superficie que agrupa contenido y acciones sobre un mismo tema: encabezado, imagen, texto y botones."
group: "surfaces"
icon: "web"
weight: 20
example: "card"
import: "Card, CardHeader, CardMedia, CardContent, CardActions, CardActionArea"
mui: "https://mui.com/material-ui/react-card/"
---

**Card** agrupa la información y las acciones de un único elemento sobre una superficie elevada: un producto, una receta, un perfil. Se construye con partes opcionales —encabezado, imagen, contenido, acciones y área de acción— que puedes generar con props abreviadas en `Card` o componer con subcomponentes. Úsala cuando el bloque es autónomo y se recorre dentro de una colección; para una superficie genérica sin estructura usa [Paper]({{< relref "/components/paper" >}}) y para listas densas [List]({{< relref "/components/list" >}}).

```tsx
import { Card, CardContent, CardActions } from '@rubenchodev/materix-react';
// o solo este componente:
import { Card } from '@rubenchodev/materix-react/components/card';
```

## Uso básico

`title`, `subheader`, `avatar`, `actionIcon` e `image` generan el encabezado y la imagen (el equivalente a la sintaxis simplificada de vanilla); el contenido y las acciones son hijos: `CardContent` y `CardActions`.

{{< react-demo "card/01-basic" >}}

## Variantes

Por defecto la tarjeta tiene elevación 1. `variant="outlined"` la delimita con un borde sin sombra; `raised` la eleva a 8 (como `raised` de MUI); `elevation` acepta 0–8, 12, 16 y 24; `square` quita el radio. Los estilos de `h1`–`h6` y `p` dentro de `CardContent` tienen especificidad cero, así que `Typography` (o cualquier clase `mtx-typography--*`) siempre gana.

{{< react-demo "card/02-variants" >}}

## Encabezado

El encabezado (`.mtx-card__header`) se genera si hay `title`, `subheader` o `avatar`. Un `avatar` de texto se pinta como un Avatar primario con ese texto; cualquier otro nodo (por ejemplo un `<Avatar>`) se pinta tal cual. `actionIcon` añade un IconButton a la derecha (su nombre sale de `actionLabel`, por defecto "Acciones" / "Actions"), y `action` acepta cualquier nodo en su lugar.

{{< react-demo "card/03-header" >}}

## Imagen

`image` genera un `CardMedia` a sangre de 194 px. Por defecto va después del encabezado; `mediaTop` lo coloca arriba y `mediaHeight` cambia el alto. La imagen generada es decorativa (`aria-hidden`) salvo que pases `imageAlt`.

{{< react-demo "card/04-media" >}}

## Acciones

`CardActions` es una fila con 8 px de padding y separación; sus botones toman el tamaño compacto de MUI y se alinean a la derecha por defecto (ver [Alineación de las acciones](#alineación-de-las-acciones)). La clase `mtx-card__actions-end` empuja un elemento al extremo derecho y `disableSpacing` quita la separación.

{{< react-demo "card/05-actions" >}}

## Alineación de las acciones

Las acciones se alinean **a la derecha** por defecto, igual que las de un diálogo. Cámbialo con `align="start|center|end|between"` en `CardActions`, o para todas las filas de una tarjeta con `actionsAlign` en `Card` (el `align` propio de la fila gana).

{{< callout type="info" title="Desviación consciente de MUI" >}}
`CardActions` de MUI alinea sus botones a la **izquierda**. Materix los alinea a la derecha por defecto para que tarjetas y diálogos compartan la misma posición de acciones. Usa `align="start"` (o `actionsAlign="start"` en la tarjeta) para recuperar el estilo MUI.
{{< /callout >}}

{{< react-demo "card/06-actions-alignment" >}}

## Área de acción

`CardActionArea` convierte la imagen y el texto en una única zona pulsable con ripple, hover y foco, sin afectar a las acciones. Pinta un `<button type="button">`, un `<a>` cuando recibe `href`, o cualquier elemento con `component` (entonces recibe `role="button"`, `tabIndex={0}` y Enter/Espacio). Con `clickable` toda la tarjeta es interactiva (`role="button"`, ripple, Enter y Espacio).

{{< react-demo "card/07-action-area" >}}

## Estados

Normal, hover y foco (pasa el ratón o usa Tab) y deshabilitado. `disabled` en una tarjeta clickable o en `CardActionArea` reduce la opacidad, quita el puntero y la saca del orden de tabulación (`aria-disabled="true"`; en un `<button>`, además, el `disabled` nativo).

{{< react-demo "card/08-states" >}}

## Elevación en el tema oscuro

En modo oscuro, como en MUI, cada elevación suma una capa blanca (`--mtx-overlay-elevation-N`): la elevación 0 no lleva capa, la tarjeta elevada a 8 se ve más clara que la de elevación 1, y `outlined` tampoco lleva capa.

{{< react-demo "card/09-dark-theme" >}}

## Ejemplos reales

### Cuadrícula de productos

Las tarjetas toman el ancho de su columna, así que se adaptan a cualquier grilla.

{{< react-demo id="card/10-grid" layout="block" >}}

## Uso programático

Los métodos de vanilla pasan a props y refs: `disabled` sustituye a `disable()`/`enable()`, `ref.current.focus()` a `focus()` y la prop `image` de `CardMedia` a su setter. No hay eventos `mtx:*`: usa `onClick` (también lo disparan Enter y Espacio en elementos no nativos).

{{< react-demo id="card/11-programmatic" layout="block" >}}

## Composición con subcomponentes

Para un control total (el equivalente a la sintaxis BEM de vanilla), compón tú mismo `CardHeader`, `CardMedia`, `CardContent` y `CardActions`. Todas las partes aceptan `className`, `style`, atributos nativos y `ref`; `Card`, `CardHeader`, `CardMedia` y `CardContent` aceptan además `component`.

{{< react-demo "card/12-composition" >}}

## Referencia de la API

### Card

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `variant` | `'elevation' \| 'outlined'` | `'elevation'` | Sombra o borde. |
| `elevation` | `0`–`8` \| `12` \| `16` \| `24` | — (elevación 1) | Sombra `--mtx-elevation-{n}`. |
| `raised` | `boolean` | `false` | Elevación 8. |
| `square` | `boolean` | `false` | Sin radio. |
| `clickable` | `boolean` | `false` | Toda la tarjeta es interactiva (`role="button"`, `tabIndex=0`, ripple, Enter/Espacio). |
| `disabled` | `boolean` | `false` | `aria-disabled`, `.mtx-card--disabled`, `tabIndex=-1`; con `clickable` también bloquea `onClick`. |
| `actionsAlign` | `'start' \| 'center' \| 'end' \| 'between'` | `'end'` | Alineación por defecto de sus `CardActions`. |
| `title` / `subheader` | `ReactNode` | — | Textos del encabezado generado. |
| `avatar` | `ReactNode` | — | Avatar del encabezado; una cadena se pinta como Avatar primario. |
| `action` | `ReactNode` | — | Acción del encabezado (se ignora sin `title`, `subheader` ni `avatar`, como en vanilla). |
| `actionIcon` | `string` | — | Material Icon de un IconButton generado en el encabezado (se ignora sin `title`, `subheader` ni `avatar`, como en vanilla). |
| `actionLabel` | `string` | i18n `card.actions` | `aria-label` de ese IconButton. |
| `image` | `string` | — | Genera un `CardMedia` con esa imagen. |
| `imageAlt` | `string` | — | Texto alternativo de la imagen generada (decorativa sin él). |
| `mediaHeight` | `number \| string` | `194` (CSS) | Alto de la imagen generada. |
| `mediaTop` | `boolean` | `false` | Coloca la imagen antes del encabezado. |
| `component` | `ElementType` | `'div'` | Elemento raíz (`article`, `section`…). |

### Subcomponentes

| Componente | Props | Descripción |
|---|---|---|
| `CardHeader` | `avatar`, `title`, `subheader`, `action`, `component` | `.mtx-card__header` con sus zonas de avatar, contenido y acción. |
| `CardMedia` | `image`, `alt`, `height`, `component` | Imagen de fondo, o `src` cuando `component` es `img`, `video`, `audio`, `picture` o `iframe`. Con `alt`: `alt` en `<img>`, `role="img"` + `aria-label` en otros elementos. |
| `CardContent` | `component` | `.mtx-card__content`. |
| `CardActions` | `align`, `disableSpacing` | `.mtx-card__actions`, alineada a la derecha por defecto. |
| `CardActionArea` | `href`, `disabled`, `disableRipple`, `component` | Zona interactiva con ripple; `<button>` por defecto, `<a>` con `href`. |

Todos reenvían `ref` a la raíz, concatenan `className` y pasan los atributos nativos. `CardHeader` pinta siempre su zona de contenido, aunque solo haya avatar.

### CardContext y useCardContext

`Card` comparte `{ actionsAlign }` con sus partes mediante `CardContext`; `useCardContext()` lo devuelve (o `null` fuera de una tarjeta). Úsalo en tus propias filas de acciones para seguir la alineación de la tarjeta.

### Callbacks

Card tampoco emite eventos `mtx:*` en vanilla. Usa el `onClick` nativo en `Card clickable` o en `CardActionArea`.

### Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-title`, `data-subheader`, `data-avatar` | `title`, `subheader`, `avatar` |
| `data-action-icon`, `data-action-label` | `actionIcon`, `actionLabel` (o `action`) |
| `data-image`, `data-image-alt`, `data-media-height`, `data-media-top` | `image`, `imageAlt`, `mediaHeight`, `mediaTop` |
| `data-variant`, `data-elevation`, `data-raised`, `data-square` | `variant`, `elevation`, `raised`, `square` |
| `data-clickable`, `data-disabled` | `clickable`, `disabled` |
| `data-actions-align` / `data-align` | `actionsAlign` / `align` |
| `data-disable-spacing` | `disableSpacing` |
| `data-mtx="card-media"` + `data-alt` / `data-height` | `<CardMedia alt height>` |
| `disable()` / `enable()` / `focus()` | `disabled` / `ref.current.focus()` |

### Clases CSS

Las mismas que la librería vanilla: `.mtx-card`, `--outlined`, `--elevation-{n}`, `--raised`, `--square`, `--clickable`, `--disabled`, `.mtx-card-action-area` (`--disabled`), `.mtx-card__header` (`-avatar`, `-content`, `-action`), `.mtx-card__title`, `.mtx-card__subheader`, `.mtx-card__media`, `.mtx-card__content`, `.mtx-card__actions` (`--start`, `--center`, `--between`, `--disable-spacing`) y `.mtx-card__actions-end`.

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-color-background-paper` | Fondo de la tarjeta. |
| `--mtx-color-text-primary` / `--mtx-color-text-secondary` | Título y contenido. |
| `--mtx-color-text-disabled` / `--mtx-disabled-opacity` | Estado deshabilitado. |
| `--mtx-color-divider` | Borde de `outlined`. |
| `--mtx-color-grey-300` | Fondo de la imagen mientras carga. |
| `--mtx-elevation-*` | Sombras. |
| `--mtx-overlay-elevation-*` | Capa blanca por elevación en el tema oscuro (`none` en claro). |
| `--mtx-focus-ring-width` / `--mtx-focus-ring-color` | Anillo de foco. |
| `--mtx-shape-radius` | Radio. |
| `--mtx-duration-standard` / `--mtx-duration-shortest` / `--mtx-easing-standard` | Transiciones. |

## Accesibilidad

- Usa `component="article"` o `"section"` cuando la tarjeta es contenido autónomo.
- En una tarjeta `clickable` que no es `<button>`/`<a>` se añaden `role="button"` y `tabIndex={0}`; su nombre accesible sale de su contenido. Evita un `aria-label` que no contenga el texto visible (WCAG 2.5.3 *Label in Name*).
- Prefiere `CardActionArea` (`<button>` o `<a>` nativos): conserva su semántica y deja los botones de `CardActions` como controles independientes. No anides botones dentro del área.
- Las imágenes generadas con `image` son decorativas salvo que pases `imageAlt`; con `CardMedia`, usa `alt`.
- Los IconButton de las acciones necesitan `aria-label`.

| Tecla | Acción |
|---|---|
| `Tab` | Recorre el área de acción, la tarjeta clickable y los botones. |
| `Enter` / `Espacio` | Activa la tarjeta clickable o el área de acción enfocada. |
