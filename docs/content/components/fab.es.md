---
title: "Fab"
description: "Botón de acción flotante para la acción principal de una pantalla: circular (56/48/40px) o extendido con texto (48px)."
group: "inputs"
icon: "add_circle"
weight: 30
example: "fab"
import: "Fab"
mui: "https://mui.com/material-ui/react-floating-action-button/"
---

**Fab** (Floating Action Button) representa la acción principal o más frecuente de una pantalla —redactar, crear, añadir— y flota sobre el contenido con una elevación alta. Usa como máximo uno por pantalla. Para acciones secundarias usa un [Button]({{< relref "/components/button" >}}); para acciones compactas en barras o filas, un [Icon Button]({{< relref "/components/icon-button" >}}).

```tsx
import { Fab } from '@rubenchodev/materix-react';
// o solo este componente:
import { Fab } from '@rubenchodev/materix-react/components/fab';
```

## Uso básico

`icon` genera un FAB circular; al añadir `label` pasa a ser un FAB extendido con texto. El FAB circular necesita `aria-label`.

{{< react-demo "fab/01-basic" >}}

## Variantes

- **Circular** (por defecto): solo icono, 56px.
- **Extendido** (`mtx-fab--extended`): icono y texto, 48px de alto. Se activa automáticamente con `label`, o con `variant="extended"` si escribes tú el contenido como `children`.

{{< react-demo id="fab/02-variants" layout="block" >}}

## Tamaños

Con `size`. A diferencia de Button, el tamaño por defecto del FAB es **large**.

| Tamaño | `size` | Circular | Extendido | Alinea con |
| :--- | :--- | :--- | :--- | :--- |
| Large | `large` (por defecto) | 56px | 48px | Text Field medium (56px) |
| Medium | `medium` | 48px | 40px | Button large, Icon Button large |
| Small | `small` | 40px | 34px | Button medium, Text Field small |

{{< react-demo id="fab/03-sizes" layout="block" >}}

## Con iconos

Combina `icon` y `label`: solo icono, icono y texto, o solo texto. Un icono string es decorativo (`aria-hidden="true"`); `icon` también acepta un nodo como un `<svg>` (24px). El texto de `label` es el nombre accesible del FAB extendido.

{{< react-demo id="fab/04-with-icons" layout="block" >}}

## Colores

Primary es el color por defecto. `color` acepta los colores de la paleta y `default`, una superficie neutra con borde, útil cuando la pantalla ya tiene mucho color primario. `inherit` toma fondo y color del contenedor.

{{< react-demo id="fab/05-colors" layout="block" >}}

## Estados

El hover sube la elevación de 6 a 12, la pulsación muestra el ripple y el foco de teclado un anillo. `disabled` quita la elevación y el color (en enlaces usa `aria-disabled="true"`, `tabIndex={-1}` y bloquea el clic).

{{< react-demo id="fab/06-states" layout="block" >}}

## Posición

`position="fixed-br"` y `"fixed-bl"` fijan el FAB a 24px de la esquina inferior derecha o izquierda de la ventana (z-index de la capa de SpeedDial). `"absolute-center"` lo centra sobre el borde superior de su contenedor posicionado, como en una barra inferior.

{{< react-demo id="fab/07-position" layout="block" >}}

```tsx
<Fab icon="add" position="fixed-br" aria-label="Crear" />
```

## Maquetación en grilla

Dentro de una grilla el FAB mantiene su tamaño; úsalo como acción principal de cada tarjeta o columna.

{{< react-demo id="fab/08-grid" layout="block" >}}

## Uso programático

Los setters `size`/`color` y `disable()`/`enable()` de vanilla pasan a ser props controladas por tu estado. `ref` te da el elemento DOM. Fab no emite eventos propios: usa `onClick`.

{{< react-demo id="fab/09-programmatic" layout="block" >}}

## Marcado BEM manual

El CSS también funciona con marcado plano (HTML estático o plantillas de servidor), sin ripple:

{{< react-demo id="fab/10-markup" open="false" >}}

## Referencia de la API

### Props

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `icon` | `ReactNode` | — | Icono inicial: nombre de Material Icons (`"add"`) o un nodo (SVG…). |
| `label` | `ReactNode` | — | Texto en un `<span>`; convierte el FAB en extendido. |
| `variant` | `'circular' \| 'extended'` | `'circular'` | Fuerza la variante extendida (con `label` siempre es extendido). |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | Ver la tabla de tamaños. |
| `color` | `'primary' \| 'secondary' \| 'default' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'inherit'` | `'primary'` | Color del FAB. |
| `position` | `'fixed-br' \| 'fixed-bl' \| 'absolute-center'` | — | Posición flotante. |
| `disabled` | `boolean` | `false` | `disabled` nativo; `aria-disabled` en enlaces. |
| `disableRipple` | `boolean` | `false` | Desactiva el ripple. |
| `href` | `string` | — | Renderiza un `<a>`. |
| `component` | `ElementType` | `'button'` / `'a'` | Elemento raíz propio. |
| `children` | `ReactNode` | — | Contenido extra tras el icono y el texto. |
| `className`, `style`, `ref`, `aria-*`, `on*`… | — | — | Se reenvían a la raíz; `className` se concatena. |

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-fab` | Clase base: círculo de 56px con elevación 6. |
| `mtx-fab--extended` | Variante extendida (48px de alto, esquinas tipo píldora). |
| `mtx-fab--medium` / `--small` | 48 / 40px circular; 40 / 34px extendido. |
| `mtx-fab--secondary`, `--success`, `--error`, `--warning`, `--info` | Colores de la paleta. |
| `mtx-fab--default` / `--inherit` | Superficie neutra con borde / colores heredados. |
| `mtx-fab--fixed-br` / `--fixed-bl` | Fijo abajo a la derecha / izquierda (24px). |
| `mtx-fab--absolute-center` | Centrado sobre el borde superior del contenedor posicionado. |

### Variables CSS

| Variable | Uso |
| :--- | :--- |
| `--mtx-color-{color}`, `--mtx-color-{color}-contrast`, `--mtx-color-{color}-dark` | Fondo, icono/texto y hover. |
| `--mtx-color-action-disabled`, `--mtx-color-action-disabled-background` | Estado deshabilitado. |
| `--mtx-elevation-6`, `--mtx-elevation-12` | Sombra en reposo y en hover/foco/pulsación. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Anillo de foco. |
| `--mtx-fab-bg`, `--mtx-fab-fg`, `--mtx-fab-hover` | Variables locales; sobrescríbelas para un color propio. |

## Accesibilidad

- Renderiza un `<button>` nativo con `type="button"`. El FAB circular necesita `aria-label`; el extendido toma el nombre de su texto.
- Colócalo en un punto lógico del orden de lectura: aunque flote visualmente, su posición en el DOM fija el orden de tabulación.
- `disabled` lo saca del orden de tabulación.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Mueve el foco. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Ejecuta la acción. |

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `data-icon="add"` | `icon="add"` |
| `data-label="Crear"` | `label="Crear"` |
| `data-variant="extended"` | `variant="extended"` |
| `data-size` / `fab.size = …` | `size` |
| `data-color` / `fab.color = …` | `color` |
| `class="mtx-fab--fixed-br"` | `position="fixed-br"` |
| `disabled` / `disable()` / `enable()` | `disabled={boolean}` |
| `Materix.getInstance(el)` | `ref` |
