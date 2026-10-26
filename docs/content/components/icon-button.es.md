---
title: "Icon Button"
description: "Botón circular de solo icono para acciones compactas en barras de herramientas, tarjetas y filas de tabla. Siempre con aria-label."
group: "inputs"
icon: "ads_click"
weight: 20
example: "icon-button"
import: "IconButton"
mui: "https://mui.com/material-ui/react-button/#icon-button"
---

**Icon Button** dispara una acción representada solo por un icono reconocible: buscar, cerrar, compartir, abrir un menú. Es la opción adecuada en barras de herramientas, cabeceras de tarjetas y acciones por fila, donde el espacio es limitado. Si el icono no es inequívoco, usa un [Button]({{< relref "/components/button" >}}) con texto; si es la acción principal de la pantalla, usa un [Fab]({{< relref "/components/fab" >}}).

{{< callout type="warning" title="aria-label es obligatorio" >}}
Un Icon Button no tiene texto visible: sin `aria-label` (o `aria-labelledby`) los lectores de pantalla solo anunciarían "botón". Describe la acción, no el icono: "Eliminar factura", no "papelera".
{{< /callout >}}

```tsx
import { IconButton } from '@rubenchodev/materix-react';
// o solo este componente:
import { IconButton } from '@rubenchodev/materix-react/components/icon-button';
```

## Uso básico

Pasa el nombre de Material Icons en `icon`. El componente renderiza `<button type="button" class="mtx-icon-button">`, el glifo de 24px (con `aria-hidden="true"`) y el ripple centrado.

{{< react-demo "icon-button/01-basic" >}}

## Tamaños

Tres tamaños con `size`. El icono conserva siempre su cuadrícula nativa de 24px (nunca se reescala); lo que cambia es el área táctil.

| Tamaño | `size` | Área | Alinea con |
| :--- | :--- | :--- | :--- |
| Large | `large` | 48px | Button large, Fab medium |
| Medium | `medium` (por defecto) | 40px | Button medium, Text Field small |
| Small | `small` | 32px | Button small, Chip |

{{< react-demo id="icon-button/02-sizes" layout="block" >}}

## Iconos

`icon` acepta un nombre de Material Icons (string) o cualquier nodo: un `<svg>` (se pinta a 24 × 24px con `currentColor`) o un glifo de Material Symbols. También puedes escribir el icono como `children`, que tiene prioridad sobre `icon`. Con `href` la raíz pasa a ser un `<a>` sin subrayado.

{{< react-demo id="icon-button/03-icons" layout="block" >}}

## Colores

Sin `color` el icono usa el gris de acción activa (`--mtx-color-action-active`), como en MUI. `color` acepta cualquier color de la paleta, o `inherit` para tomar el color del texto que lo rodea (superficies oscuras o de color, como un AppBar).

{{< react-demo id="icon-button/04-colors" layout="block" >}}

## Estados

El hover muestra un fondo sutil, el foco de teclado un anillo del color primario y la pulsación un ripple centrado. `disabled` pone el atributo nativo (en enlaces, `aria-disabled="true"` y `tabIndex={-1}`, y bloquea el clic).

{{< react-demo id="icon-button/05-states" layout="block" >}}

## Posición en el borde

`edge="start|end"` aplica un margen negativo de 12px para que el glifo quede alineado ópticamente con el borde del contenido, como la prop `edge` de MUI. Úsalo en el primer o último elemento de una barra.

{{< react-demo id="icon-button/06-edge" layout="block" >}}

## Con insignia

Envuelve el Icon Button en un [Badge]({{< relref "/components/badge" >}}) para mostrar contadores e incluye el número en el `aria-label`. El botón no recorta su contenido (el ripple se recorta en un contenedor interno), así que la insignia nunca se corta.

{{< react-demo "icon-button/07-with-badge" >}}

## Con tooltip

Un icono solo no siempre se explica por sí mismo. Envuelve el Icon Button en un [Tooltip]({{< relref "/components/tooltip" >}}) para mostrar su nombre al pasar el puntero, al enfocarlo con el teclado o con una pulsación larga. Si el botón no tiene `aria-label`, el texto del tooltip pasa a ser su nombre accesible; si ya lo tiene, el tooltip se enlaza como descripción (`aria-describedby`).

{{< react-demo "icon-button/08-with-tooltip" >}}

{{< callout type="tip" title="Recomendado en botones de solo icono" >}}
MUI recomienda envolver todo botón de solo icono en un Tooltip. Un botón deshabilitado no recibe eventos de puntero: envuélvelo en un `<span>` dentro del Tooltip.
{{< /callout >}}

## Ejemplos reales

Una barra de formato de un editor (un grupo de Icon Button pequeños con `role="toolbar"`) y acciones por elemento donde cada `aria-label` nombra también el objeto.

{{< react-demo id="icon-button/09-use-cases" layout="block" >}}

## Grilla

Dentro de una grilla el Icon Button mantiene su tamaño fijo: nunca se estira.

{{< react-demo id="icon-button/10-grid" layout="block" >}}

## Uso programático

Los métodos de vanilla pasan a ser props: `disabled` sustituye a `disable()`/`enable()` y `ref` te da el elemento DOM. Icon Button no emite eventos propios: usa `onClick` y cualquier otro manejador nativo.

{{< react-demo id="icon-button/11-programmatic" layout="block" >}}

## Marcado BEM manual

El CSS también funciona con marcado plano (HTML estático o plantillas de servidor), sin ripple:

{{< react-demo id="icon-button/12-markup" open="false" >}}

## Referencia de la API

### Props

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `icon` | `ReactNode` | — | Nombre de Material Icons (`"search"`) o un nodo (SVG…). Se ignora si hay `children`. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Área de 32 / 40 / 48px. |
| `color` | `'default' \| 'inherit' \| 'primary' \| 'secondary' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'default'` | Color del icono. |
| `edge` | `'start' \| 'end' \| false` | `false` | Margen negativo de 12px en ese lado. |
| `disabled` | `boolean` | `false` | `disabled` nativo; `aria-disabled` en enlaces. |
| `disableRipple` | `boolean` | `false` | Desactiva el ripple centrado. |
| `href` | `string` | — | Renderiza un `<a>`. |
| `component` | `ElementType` | `'button'` / `'a'` | Elemento raíz propio (p. ej. un enlace del router). Sin `href`/`to` recibe `role="button"`, `tabIndex=0`, Enter (keydown) y Espacio (keyup); con `href`/`to` se trata como enlace. |
| `children` | `ReactNode` | — | Contenido propio (icono anidado). |
| `className`, `style`, `ref`, `aria-*`, `on*`… | — | — | Se reenvían a la raíz; `className` se concatena. |

`type` vale `"button"` por defecto para no enviar un formulario por accidente.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-icon-button` | Clase base: círculo de 40px con icono de 24px. |
| `mtx-icon-button--small` / `--large` | Área de 32px / 48px. |
| `mtx-icon-button--primary`, `--secondary`, `--success`, `--error`, `--warning`, `--info` | Color del icono. |
| `mtx-icon-button--inherit` | Hereda el color del contenedor. |
| `mtx-icon-button--edge-start` / `--edge-end` | Margen de -12px. |

### Variables CSS

| Variable | Uso |
| :--- | :--- |
| `--mtx-color-action-active` | Color del icono por defecto. |
| `--mtx-color-action-hover` / `--mtx-color-action-selected` | Fondos de hover y pulsado. |
| `--mtx-color-action-disabled` | Icono deshabilitado. |
| `--mtx-size-large-height`, `--mtx-size-medium-height`, `--mtx-size-small-height` | Áreas de 48 / 40 / 32px. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco. |
| `--mtx-ic-color` | Color local del icono; sobrescríbelo para un color propio. |

## Accesibilidad

- Renderiza un `<button>` nativo: enfocable y activable con <kbd>Enter</kbd> / <kbd>Espacio</kbd> sin código extra.
- `aria-label` es obligatorio; el icono generado lleva `aria-hidden="true"`.
- En botones que alternan un estado (favorito, negrita) añade `aria-pressed={pressed}`.
- El anillo de foco solo aparece al navegar con teclado (`:focus-visible`).

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Mueve el foco al elemento siguiente / anterior. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Ejecuta la acción. |

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `data-icon="search"` | `icon="search"` |
| `data-size="small\|large"` | `size="small\|large"` |
| `data-color="primary"` | `color="primary"` |
| `data-edge="start"` | `edge="start"` |
| `disabled` / `disable()` / `enable()` | `disabled={boolean}` |
| `<a data-mtx="icon-button" href>` | `href` o `component` |
| `Materix.getInstance(el)` | `ref` |

React nunca añade `mtx-icon-button--default` ni `mtx-icon-button--medium` (vanilla añade `--medium` con `data-size="medium"`): ninguna de las dos clases tiene CSS, así que no hay diferencia visual.
