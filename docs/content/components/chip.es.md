---
title: "Chip"
description: "Elemento compacto que representa una etiqueta, un filtro, una entrada o una acción; puede llevar icono, avatar y botón de eliminar."
group: "data-display"
icon: "label"
weight: 30
example: "chip"
import: "Chip"
mui: "https://mui.com/material-ui/react-chip/"
---

`Chip` representa una pieza de información compacta: una etiqueta, un filtro activo, un destinatario o una acción breve. Úsalo para listas de etiquetas, filtros seleccionables o entradas que el usuario puede quitar. Para una acción principal usa un Button; para un contador sobre un icono, un Badge.

```tsx
import { Chip } from '@rubenchodev/materix-react';
// o solo este componente:
import { Chip } from '@rubenchodev/materix-react/components/chip';
```

## Uso básico

Basta con `<Chip label="…" />`. `icon` añade un icono inicial (nombre de Material Icons o cualquier nodo) y `onDelete` añade el icono de eliminar.

{{< react-demo "chip/01-basic" >}}

## Variantes

`filled` (por defecto) usa fondo sólido; `outlined` usa borde y fondo transparente.

{{< react-demo id="chip/02-variants" layout="block" >}}

## Tamaños

`medium` (32px, por defecto) alinea con el Button pequeño; `small` (24px) encaja en tablas y listas densas.

{{< react-demo id="chip/03-sizes" layout="block" >}}

## Con iconos y avatar

`icon` añade un icono inicial, `avatar` muestra un avatar (recibe la clase `mtx-chip__avatar`) y `onDelete` añade el icono de eliminar al final, que puedes sustituir con `deleteIcon`.

{{< react-demo id="chip/04-icons" layout="block" >}}

## Colores

`color` acepta toda la paleta; en `outlined` el color se aplica al texto y al borde.

{{< react-demo id="chip/05-colors" layout="block" >}}

## Estados

Un chip con `onClick` (o `clickable`) es interactivo: cursor de puntero, estado hover, anillo de foco, `role="button"` y activación con Enter o Espacio. Con `component="button"` el chip es un `<button>` nativo sin borde ni relleno del navegador. `disabled` baja la opacidad, retira el foco y bloquea los callbacks.

{{< react-demo id="chip/06-states" layout="block" >}}

## Eliminables

`onDelete` muestra el icono de eliminar y se invoca al pulsarlo o al presionar Supr/Retroceso con el chip enfocado. El chip **no se elimina solo**: actualizas tu estado.

{{< react-demo id="chip/07-deletable" layout="block" >}}

## Filtros

Chips clicables que alternan entre `outlined` (inactivo) y `primary` (activo), con `aria-pressed` como estado accesible.

{{< react-demo id="chip/08-filters" layout="block" >}}

## Grilla

Tarjetas de proyectos en una `Grid` con sus etiquetas: 1 columna en móvil, 2 en `sm` y 3 en `md`.

{{< react-demo id="chip/09-grid" layout="block" >}}

## Uso programático

El texto, el estado deshabilitado y el resto de props son estado de React; `ref` apunta al elemento raíz (por ejemplo, para enfocarlo). El registro muestra los callbacks `onClick` y `onDelete`.

{{< react-demo id="chip/10-programmatic" layout="block" >}}

## Referencia de la API

### Props

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `label` | `ReactNode` | — | Texto del chip. Si se omite, se usan los `children`. |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Variante visual. |
| `size` | `'medium' \| 'small'` | `'medium'` | 32px o 24px. |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'default'` | Color de la paleta. |
| `icon` | `ReactNode \| string` | — | Icono inicial. Una cadena genera `<span class="mtx-chip__icon material-icons">`; un nodo recibe `mtx-chip__icon`. |
| `avatar` | `ReactNode` | — | Avatar inicial; recibe `mtx-chip__avatar`. |
| `clickable` | `boolean` | `true` si hay `onClick` | Hace el chip interactivo. |
| `onClick` | `(event) => void` | — | Clic o Enter/Espacio en un chip clicable. |
| `onDelete` | `(event) => void` | — | Muestra el icono de eliminar; se invoca con clic o Supr/Retroceso. |
| `deleteIcon` | `ReactNode` | X en círculo (SVG) | Icono de eliminar personalizado. |
| `deleteLabel` | `string` | i18n `chip.delete` | Pista (`title`) del icono de eliminar. |
| `disabled` | `boolean` | `false` | Deshabilita el chip. |
| `component` | `ElementType` | `'div'` | Elemento raíz (`'button'`, `'a'`…). |
| `locale` | `string` | contexto | Idioma de los textos propios. |

`className` se concatena; `ref`, `style` y cualquier otro atributo (`id`, `aria-*`, `data-*`, manejadores) van al elemento raíz.

### Callbacks

| Callback | Evento vanilla | Se invoca cuando |
|---|---|---|
| `onClick(event)` | `mtx:chip:click` | Se pulsa un chip clicable o se activa con Enter/Espacio. |
| `onDelete(event)` | `mtx:chip:delete` | Se pulsa el icono de eliminar o Supr/Retroceso con el chip enfocado. |

### Clases CSS

| Clase | Elemento |
|---|---|
| `.mtx-chip` | Raíz. |
| `.mtx-chip--outlined`, `.mtx-chip--small` | Variante y tamaño. |
| `.mtx-chip--{color}` | Color de la paleta. |
| `.mtx-chip--clickable`, `.mtx-chip--disabled` | Estados. |
| `.mtx-chip__avatar`, `.mtx-chip__icon`, `.mtx-chip__label`, `.mtx-chip__delete` | Partes. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-chip-height`, `--mtx-chip-height-small` | Alturas (32px / 24px). |
| `--mtx-chip-radius`, `--mtx-chip-radius-small` | Radios (16px / 12px). |
| `--mtx-chip-font-size`, `--mtx-chip-font-size-small` | Tamaño del texto. |
| `--mtx-chip-label-padding`, `--mtx-chip-label-padding-small` | Relleno del label. |
| `--mtx-chip-bg`, `--mtx-chip-text` | Fondo y texto del color `default`. |
| `--mtx-chip-delete-color`, `--mtx-chip-delete-color-hover` | Color del icono de eliminar. |
| `--mtx-chip-delete-size`, `--mtx-chip-delete-size-small` | Tamaño del icono de eliminar. |

## Accesibilidad

- Los chips estáticos son texto sin rol. Los clicables o eliminables reciben `role="button"` y `tabindex="0"` (salvo con `component` `button` o `a`); los deshabilitados, `aria-disabled="true"` y `tabindex="-1"`.
- Como en MUI, el icono de eliminar **no** es un control anidado: es un `<span aria-hidden="true">` nunca enfocable. El chip se elimina con el ratón sobre el icono o con Supr/Retroceso mientras tiene el foco, anunciado con `aria-keyshortcuts="Delete Backspace"`.
- El `title` del icono sale del diccionario i18n (`Delete` / `Eliminar`); hazlo específico con `deleteLabel` (por ejemplo, «Quitar React»).
- En filtros, indica el estado activo con `aria-pressed`.
- Los iconos por nombre se generan con `aria-hidden="true"`; marca igual tus propios nodos de icono.

| Tecla | Acción |
|---|---|
| Tab / Mayús+Tab | Mueve el foco entre chips interactivos. |
| Enter / Espacio | Activa un chip clicable (`onClick`). |
| Supr / Retroceso | En un chip eliminable, invoca `onDelete`. |
| Escape | Quita el foco del chip. |

## Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-label="…"` | `label="…"` |
| `data-variant`, `data-size`, `data-color` | `variant`, `size`, `color` |
| `data-icon="code"` | `icon="code"` |
| hijo `.mtx-chip__avatar` | `avatar={…}` |
| `data-clickable` + `mtx:chip:click` | `onClick` (o `clickable`) |
| `data-deletable` + `mtx:chip:delete` | `onDelete` |
| `data-delete-icon`, `data-delete-label` | `deleteIcon`, `deleteLabel` |
| `data-disabled`, `disable()` / `enable()` | `disabled` |
| `chip.label = '…'` | prop `label` (estado) |
| `<button data-mtx="chip">` | `component="button"` |
