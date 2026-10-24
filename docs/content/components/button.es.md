---
title: "Button"
description: "Botón de acción con variantes text, outlined y contained, tres alturas canónicas (48/40/32px), colores de la paleta, iconos y estado de carga."
group: "inputs"
icon: "smart_button"
weight: 10
example: "button"
import: "Button"
mui: "https://mui.com/material-ui/react-button/"
---

**Button** permite al usuario ejecutar una acción o confirmar una decisión con un clic: guardar un formulario, abrir un diálogo, enviar un mensaje. Úsalo cuando la acción tenga un texto que la describa. Si la acción solo puede representarse con un icono, usa [Icon Button](../icon-button/); si es la acción principal y persistente de toda la pantalla, usa [Fab](../fab/). Para navegar a otra página, pasa `href` y el botón renderiza un `<a>`.

{{< callout type="tip" title="¿Button, Icon Button o Fab?" >}}
| Componente | Cuándo usarlo | Ejemplo |
| :--- | :--- | :--- |
| **Button** | Acción con texto; jerarquía mediante la variante. | "Guardar", "Cancelar" |
| **Icon Button** | Acción compacta reconocible por su icono, en barras o filas. | Buscar, cerrar, más opciones |
| **Fab** | La acción principal de la pantalla, flotando sobre el contenido. | Redactar correo, crear evento |
{{< /callout >}}

## Importación

```tsx
import { Button } from '@rubenchodev/materix-react';
// o solo este componente
import { Button } from '@rubenchodev/materix-react/components/button';
```

El componente importa su propio CSS (`button.css` y `progress.css` para el spinner de carga). Importa `@rubenchodev/materix-ui/base.css` una vez en tu aplicación.

## Uso básico

Un único `<Button>` con su `variant`. El componente renderiza un `<button type="button">` nativo, añade el ripple y gestiona el estado deshabilitado; no hay estructura interna que escribir.

{{< react-demo "button/01-basic" >}}

## Variantes

La jerarquía visual se expresa con la variante, igual que en MUI:

- **Contained** (`variant="contained"`): énfasis alto, relleno y con elevación. Reservado para la acción principal; idealmente una por bloque.
- **Outlined** (`variant="outlined"`): énfasis medio, para acciones secundarias importantes.
- **Text** (`variant="text"`, por defecto): énfasis bajo, para acciones en diálogos, tarjetas o junto a un botón contained.

{{< react-demo "button/02-variants" >}}

## Tamaños

Tres alturas canónicas con `size`. **Medium (40px) es el tamaño por defecto** y coincide con la altura de un Text Field small, así que ambos se alinean en la misma fila.

| Tamaño | `size` | Altura | Se alinea con |
| :--- | :--- | :--- | :--- |
| Large | `large` | 48px | Icon Button large, Fab medium, Fab extendido |
| Medium | `medium` (por defecto) | 40px | Text Field small, Icon Button medium, Fab small |
| Small | `small` | 32px | Icon Button small, Chip |

{{< react-demo "button/03-sizes" >}}

## Con iconos

`startIcon` y `endIcon` aceptan el nombre de la ligadura de Material Icons (`startIcon="add"`) o cualquier nodo (un `<svg>`, otra fuente de iconos). El botón los envuelve en `<span class="mtx-button__icon mtx-button__icon--start" aria-hidden="true">` (o `--end`), añade `material-icons` cuando pasas un nombre y los desplaza 4px hacia el borde (2px en small) como MUI. Los iconos son decorativos porque el texto ya nombra la acción; un `<svg>` se pinta a 24 × 24px con `currentColor`.

Con `iconOnly` el botón pasa a ser cuadrado y circular (48/40/32px según el tamaño). Requiere `aria-label`. Para iconos sin fondo es preferible [Icon Button](../icon-button/).

{{< react-demo "button/04-icons" >}}

## Colores

Primary es el color por defecto. `color` acepta `secondary`, `success`, `error`, `warning`, `info` e `inherit` en las tres variantes. Con `inherit`, text y outlined toman el color del contenedor: úsalo sobre superficies oscuras o de color (AppBar, banners, llamadas a la acción).

### Sobre una superficie de color

`surface="primary"` (o `secondary`) adapta el botón a un fondo de ese color: contained se invierte (fondo papel con texto primary, `mtx-button--on-primary`) y text/outlined toman el color del contenedor.

### Contraste AA

Los botones cumplen WCAG AA (4.5:1) por defecto: text y outlined usan `--mtx-color-{color}-text` y contained `warning`/`info` usa texto oscuro. Para obtener los colores exactos de MUI, añade `data-mtx-contrast="mui"` a `<html>` o a un contenedor.

{{< react-demo id="button/05-colors" layout="block" >}}

## Estados

Hover, foco visible (al navegar con <kbd>Tab</kbd>) y pulsación (ripple) se aplican automáticamente. `disabled` usa el atributo nativo: atenúa el botón, lo saca del orden de tabulación y bloquea el ripple.

{{< react-demo "button/06-states" >}}

## Carga

Con `loading` el botón entra en estado de carga como el `loading` de MUI: se deshabilita (`disabled`, o `aria-disabled` en enlaces), recibe `aria-busy="true"` y muestra un [CircularProgress](../progress/) decorativo de 16px del color del texto. `loadingPosition` elige la posición: `center` (por defecto; el texto se vuelve transparente y el ancho no cambia), `start` o `end` (sustituyen el icono inicial o final sin cambiar el ancho; sin icono, el indicador se añade en ese lado). `loadingIndicator` muestra un texto (o cualquier nodo) en lugar del spinner.

Cuando `loading` vuelve a `false`, se recupera el estado previo: un botón con `disabled` sigue deshabilitado. El botón conserva su nombre accesible; para anunciar el progreso, añade tu propia región `aria-live`.

{{< react-demo "button/07-loading" >}}

## Ancho completo

`fullWidth` hace que el botón ocupe el 100% de su contenedor.

{{< react-demo id="button/08-full-width" layout="column" >}}

## Sin elevación

`disableElevation` elimina la sombra de la variante contained en todos sus estados.

{{< react-demo "button/09-elevation" >}}

## Mayúsculas

El texto se muestra tal como se escribe. Añade `uppercase` para el estilo en mayúsculas característico de Material Design 2.

{{< react-demo "button/10-uppercase" >}}

## Como enlace

Si la acción navega a otra URL, pasa `href`: el botón renderiza un `<a>` y conserva la semántica de enlace (abrir en otra pestaña, copiar la dirección) con el aspecto de un botón. Como `<a>` no admite `disabled`, un enlace deshabilitado recibe `aria-disabled="true"`, `tabindex="-1"` y se bloquea su clic.

Para usar el enlace de un router, pásalo en `component` (`<Button component={RouterLink} href="/plans">`). Cualquier otro elemento (`component="span"`) recibe `role="button"`, `tabindex="0"` y activación con <kbd>Enter</kbd>/<kbd>Espacio</kbd>.

{{< react-demo "button/11-as-link" >}}

## Ejemplos reales

Un pie de formulario con una única acción principal contained y una barra de acciones de tabla con botones small.

{{< react-demo id="button/12-use-cases" layout="block" >}}

## Maquetación en grilla

Con `fullWidth` los botones llenan la columna de una grilla.

{{< react-demo id="button/13-grid" layout="block" >}}

## Uso programático

En React el estado vive en las props: `disabled`, `loading` y el resto los controla tu estado. `ref` apunta al elemento DOM raíz (`focus()`, medidas). Button no emite eventos propios: usa `onClick` y los demás manejadores nativos.

{{< react-demo id="button/14-programmatic" layout="block" >}}

## Referencia de la API

### Props

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `variant` | `'text' \| 'outlined' \| 'contained'` | `'text'` | Variante visual. |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'inherit'` | `'primary'` | Color de la paleta. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 32 / 40 / 48px. |
| `disabled` | `boolean` | `false` | `disabled` nativo; `aria-disabled` + `tabindex="-1"` en enlaces. |
| `startIcon` / `endIcon` | `ReactNode` (texto = nombre de Material Icons) | — | Icono decorativo al inicio / final. |
| `iconOnly` | `boolean` | `false` | Botón cuadrado de solo icono (`mtx-button--icon`). |
| `fullWidth` | `boolean` | `false` | Ancho del 100%. |
| `disableElevation` | `boolean` | `false` | Sin sombra en contained. |
| `uppercase` | `boolean` | `false` | Texto en mayúsculas. |
| `surface` | `'primary' \| 'secondary'` | — | Adapta el botón a un fondo de color. |
| `loading` | `boolean` | `false` | Estado de carga (deshabilitado, `aria-busy`, indicador). |
| `loadingPosition` | `'center' \| 'start' \| 'end'` | `'center'` | Posición del indicador. |
| `loadingIndicator` | `ReactNode` | spinner | Texto o nodo en lugar del spinner. |
| `disableRipple` | `boolean` | `false` | Desactiva el ripple. |
| `href` | `string` | — | Renderiza un `<a>`. |
| `component` | `ElementType` | `'button'` | Elemento o componente raíz. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo nativo (solo en `<button>`). |

El resto de props (`id`, `aria-*`, `data-*`, `onClick`…) van al elemento raíz; `className` se concatena y `ref` apunta a la raíz.

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-button` | Clase base. |
| `mtx-button--contained` · `--outlined` · `--text` | Variante. |
| `mtx-button--{color}` | Color de la paleta o `inherit`. |
| `mtx-button--on-primary` · `--on-secondary` | Sobre una superficie de color. |
| `mtx-button--large` · `--small` | Altura de 48px / 32px. |
| `mtx-button--full-width` · `--disable-elevation` · `--uppercase` · `--icon` | Modificadores. |
| `mtx-button__icon` · `--start` · `--end` | Contenedor del icono y desplazamiento MUI. |
| `mtx-button--loading` · `--loading-{center,start,end}` | Estado de carga. |
| `mtx-button__loading-indicator` · `--center` · `--start` · `--end` · `--text` | Contenedor del indicador (`aria-hidden`). |
| `mtx-button__icon--loading-hidden` | Icono sustituido por el indicador. |

### Variables CSS

| Variable | Uso en Button |
| :--- | :--- |
| `--mtx-color-{color}` · `--mtx-color-{color}-dark` · `--mtx-color-{color}-contrast` | Fondo, hover y texto de contained. |
| `--mtx-color-{color}-text` | Texto y borde en outlined y text. |
| `--mtx-size-large-height` · `--mtx-size-medium-height` · `--mtx-size-small-height` | Alturas de 48 / 40 / 32px. |
| `--mtx-btn-bg`, `--mtx-btn-hover`, `--mtx-btn-fg`, `--mtx-btn-color` | Variables locales; sobrescríbelas para un color propio. |

### Equivalencia con la versión vanilla

| Vanilla | React |
| :--- | :--- |
| `class="mtx-button mtx-button--contained"` | `variant="contained"` |
| `data-size="small"` | `size="small"` |
| `data-color="error"` / `mtx-button--error` | `color="error"` |
| `data-surface="primary"` | `surface="primary"` |
| `data-start-icon="add"` / `data-end-icon="send"` | `startIcon="add"` / `endIcon="send"` |
| `mtx-button--icon` | `iconOnly` |
| `mtx-button--full-width` · `--disable-elevation` · `--uppercase` | `fullWidth` · `disableElevation` · `uppercase` |
| `data-loading` · `data-loading-position` · `data-loading-indicator` | `loading` · `loadingPosition` · `loadingIndicator` |
| `<a class="mtx-button" href>` | `href` (o `component`) |
| `disable()` / `enable()` · `setLoading()` | props `disabled` · `loading` |

## Accesibilidad

- Usa `<Button>` (un `<button>` nativo) para acciones y `href` para navegar.
- Los botones de solo icono (`iconOnly`) necesitan `aria-label`. Los iconos junto al texto llevan `aria-hidden="true"`.
- `disabled` saca el botón del orden de tabulación. En enlaces aplica `aria-disabled="true"` y `tabindex="-1"` y bloquea el clic.
- Durante la carga el botón está deshabilitado con `aria-busy="true"` y conserva su nombre accesible. El indicador es `aria-hidden`.
- El ripple respeta `prefers-reduced-motion`.

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Mayús</kbd>+<kbd>Tab</kbd> | Mueve el foco al botón siguiente / anterior. |
| <kbd>Enter</kbd> | Activa el botón o sigue el enlace. |
| <kbd>Espacio</kbd> | Activa el botón. |
