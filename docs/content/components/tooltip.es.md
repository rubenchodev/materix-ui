---
title: "Tooltip"
description: "Etiqueta informativa breve que aparece al pasar el puntero, enfocar con teclado o mantener pulsado. Envuelve cualquier elemento con <Tooltip title>."
group: "data-display"
icon: "info"
weight: 80
example: "tooltip"
import: "Tooltip"
mui: "https://mui.com/material-ui/react-tooltip/"
---

Un **Tooltip** muestra una etiqueta de texto breve que identifica o explica un elemento cuando el usuario pasa el puntero por encima, lo enfoca con el teclado o lo mantiene pulsado en una pantalla táctil, igual que el `Tooltip` de MUI. Es ideal para botones de solo icono y barras de herramientas. No pongas en él información esencial ni contenido interactivo (enlaces, botones): para mensajes persistentes usa un texto de ayuda o un [Alert](../alert/).

```tsx
import { Tooltip } from '@rubenchodev/materix-react';
// o solo este componente:
import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
```

## Uso básico

Envuelve un **único hijo** con `<Tooltip title="…">`. El hijo recibe la `ref` fusionada y los manejadores de puntero y foco encadenados, así que debe ser un elemento o un componente que los reenvíe (todos los de Materix lo hacen). Si el hijo no tiene nombre accesible (un [IconButton](../icon-button/) de solo icono), el título pasa a ser su `aria-label`.

{{< react-demo id="tooltip/01-basic" layout="block" >}}

## Posición

`placement` admite 12 posiciones (`top|bottom|left|right` con `-start|-end`); por defecto `bottom`. Si no cabe, voltea al lado opuesto y se desplaza para seguir en pantalla.

{{< react-demo id="tooltip/02-placement" layout="block" >}}

## Flecha

`arrow` añade una flecha que apunta al centro del disparador, incluso cuando el tooltip se desplaza para caber.

{{< react-demo id="tooltip/03-arrow" layout="block" >}}

## Con y sin iconos

Funciona en botones de texto, con icono inicial o final y, sobre todo, en botones de solo icono como [IconButton](../icon-button/) y [Fab](../fab/), donde además aporta el nombre accesible.

{{< react-demo id="tooltip/04-with-icons" layout="block" >}}

## Elementos deshabilitados

Los elementos deshabilitados no reciben eventos de puntero ni de foco: envuélvelos en un `<span>` para que el tooltip siga explicando por qué no están disponibles, como recomienda MUI. El nombre accesible se aplica al primer elemento enfocable del envoltorio.

{{< react-demo id="tooltip/05-disabled" layout="block" >}}

## Retardos

Por defecto aparece a los 100 ms (`enterDelay`) y desaparece al salir (`leaveDelay` 0). Tras cerrarse uno, el siguiente abre con `enterNextDelay` (0 ms) durante 800 ms, ideal para barras de herramientas.

{{< react-demo id="tooltip/06-delays" layout="block" >}}

## Seguir el cursor

`followCursor` ancla el tooltip al puntero mientras se mueve sobre el disparador. Ese tooltip no puede alcanzarse con el puntero, así que no lo retiene (como con `disableInteractive`).

{{< react-demo id="tooltip/07-follow-cursor" layout="block" >}}

## Texto largo

El ancho máximo es de 300 px (`--mtx-tooltip-max-width`) y el texto se reparte en varias líneas.

{{< react-demo id="tooltip/08-long-text" layout="block" >}}

## Contenido enriquecido

`title` admite cualquier `ReactNode` (formato, atajos de teclado). Mantenlo no interactivo. Con un título no textual, un disparador sin nombre se etiqueta con `aria-labelledby` mientras el tooltip es visible; `describeChild` lo convierte en descripción.

{{< react-demo id="tooltip/09-rich-content" layout="block" >}}

## Demostración de accesibilidad

Si el disparador no tiene nombre accesible, el texto se aplica como `aria-label`. Si ya lo tiene, el tooltip lo describe con `aria-describedby` mientras es visible.

{{< react-demo id="tooltip/10-accessibility" layout="block" >}}

## Casos de uso

La barra de formato de un editor con atajos de teclado (apertura instantánea al recorrer los botones) e información extra junto a un valor.

{{< react-demo id="tooltip/11-use-cases" layout="block" >}}

## Maquetación en grilla

Los tooltips se portan a `<body>`: los contenedores con `overflow` o las columnas estrechas de un [Grid](../grid/) no los recortan.

{{< react-demo id="tooltip/12-grid" layout="block" >}}

## Uso programático

`open` hace el tooltip controlado: `onOpen(event)` y `onClose(event)` solicitan el cambio (equivalen a `mtx:tooltip:open` y `mtx:tooltip:close`). Para acciones puntuales sin estado, la ref `action` expone `open()`, `close()`, `toggle()`, `update()` e `isOpen`, el equivalente de `Materix.tooltip.show/hide` y `getTooltip()`. `hideAllTooltips()` oculta todos los tooltips visibles.

{{< react-demo id="tooltip/13-programmatic" layout="block" >}}

```tsx
const actions = useRef<TooltipActions>(null);

<Tooltip title="¡Copiado!" action={actions}>
  <Button onClick={() => actions.current?.open()}>Copiar</Button>
</Tooltip>;
```

## Uso avanzado

Equivalente del envoltorio vanilla `data-mtx="tooltip"`: un `<span>` envuelve al disparador y se combinan varias opciones (`placement`, `arrow`, `enterDelay`, `leaveDelay`, `describeChild`). Los atributos ARIA van al primer elemento enfocable del envoltorio. La superficie generada, portada a `<body>`, es:

{{< react-demo id="tooltip/14-advanced" layout="block" >}}

```html
<div class="mtx-tooltip mtx-tooltip--open mtx-tooltip--arrow" role="tooltip" id="mtx-tooltip-…" data-side="right">
  <span class="mtx-tooltip__label">Exportar a CSV</span>
  <span class="mtx-tooltip__arrow" aria-hidden="true"></span>
</div>
```

## Referencia de la API

### Props de Tooltip

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `title` | `ReactNode` | — | Contenido. Vacío (`''`, `null`, `false`) desactiva el tooltip. |
| `children` | `ReactElement` | — | Disparador único; recibe la `ref` y los manejadores. |
| `placement` | `Placement` | `'bottom'` | `top`, `bottom`, `left`, `right` + `-start`/`-end`. Voltea y se desplaza automáticamente. |
| `arrow` | `boolean` | `false` | Muestra la flecha. |
| `enterDelay` | `number` | `100` | Retardo antes de mostrarse por hover o foco (ms). |
| `enterNextDelay` | `number` | `0` | Retardo si otro tooltip se cerró hace menos de 800 ms. |
| `leaveDelay` | `number` | `0` | Retardo antes de ocultarse al salir el puntero (ms). |
| `enterTouchDelay` | `number` | `700` | Duración de la pulsación larga (ms). |
| `leaveTouchDelay` | `number` | `1500` | Tiempo visible tras soltar la pulsación (ms). |
| `followCursor` | `boolean` | `false` | El tooltip sigue al puntero. |
| `open` | `boolean` | — | Visibilidad controlada. |
| `onOpen` | `(event) => void` | — | Solicitud de apertura. |
| `onClose` | `(event) => void` | — | Solicitud de cierre (salida, pérdida de foco, Escape, apertura de otro tooltip). |
| `disableHoverListener` | `boolean` | `false` | No abre con hover. |
| `disableFocusListener` | `boolean` | `false` | No abre con el foco de teclado. |
| `disableTouchListener` | `boolean` | `false` | No abre con pulsación larga. |
| `disableInteractive` | `boolean` | `false` | El tooltip no retiene el puntero (implícito con `followCursor`). |
| `describeChild` | `boolean` | `false` | El título describe al hijo (`aria-describedby`) en lugar de nombrarlo. |
| `id` | `string` | generado | Id de la superficie. |
| `action` | `Ref<TooltipActions>` | — | API imperativa. |
| `container` / `disablePortal` | — | `document.body` | Destino del portal o renderizado en su sitio. |
| `slotProps` | `{ tooltip?, arrow? }` | — | Props extra (`className`, `style`, `data-*`…) de la superficie y la flecha. |

`ref`, `className`, `style` y cualquier otra prop van al **hijo** (como en MUI); las props propias del hijo prevalecen y sus manejadores se encadenan.

### Exportaciones

| Exportación | Descripción |
|---|---|
| `Tooltip` | Componente. |
| `hideAllTooltips()` | Oculta al instante todos los tooltips visibles (`Materix.tooltip.hideAll()`). |
| `getAccessibleName(el)` | Nombre accesible aproximado de un elemento (misma heurística que vanilla). |
| `TOOLTIP_DEFAULTS` | Tiempos y separaciones de MUI (14 px, 24 px en táctil). |

### Callbacks

| Callback | Evento vanilla | Se dispara cuando |
|---|---|---|
| `onOpen(event)` | `mtx:tooltip:open` | Hover/foco tras el retardo, pulsación larga o `action.open()`. |
| `onClose(event)` | `mtx:tooltip:close` | Salida, pérdida de foco, Escape, toque fuera o apertura de otro tooltip. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-tooltip` | Superficie (`role="tooltip"`), posición fija, portada a `<body>`. |
| `mtx-tooltip--open` | Estado visible (transición de escala y opacidad). |
| `mtx-tooltip--arrow` | Tooltip con flecha. |
| `mtx-tooltip--touch` | Abierto por pulsación larga: fuente y relleno mayores. |
| `mtx-tooltip__label` | Contenido. |
| `mtx-tooltip__arrow` | Flecha (1em × 0.71em). |
| `[data-side]` | Lado final tras voltear; controla la flecha y el origen de la transformación. |

### Variables CSS

| Variable | Por defecto | Uso |
|---|---|---|
| `--mtx-tooltip-bg` | `rgba(97, 97, 97, 0.92)` | Fondo y flecha. |
| `--mtx-tooltip-color` | `#ffffff` | Texto. |
| `--mtx-tooltip-font-size` | `0.6875rem` | Tamaño de fuente. |
| `--mtx-tooltip-font-size-touch` | `0.875rem` | Tamaño de fuente al abrir por toque. |
| `--mtx-tooltip-max-width` | `300px` | Ancho máximo. |
| `--mtx-z-index-tooltip` | `1500` | Nivel de apilamiento, por encima de diálogos y snackbars. |

## Accesibilidad

- La superficie tiene `role="tooltip"` y se vincula al disparador según el patrón tooltip de WAI-ARIA:
  - Si el disparador **no tiene nombre accesible**, el texto se aplica como su `aria-label` (marcado con `data-mtx-tooltip-label` y retirado al desmontar).
  - Si **ya tiene nombre**, se conserva y el tooltip se vincula con `aria-describedby` mientras es visible; si ambos textos coinciden, no se duplica. `describeChild` usa siempre `aria-describedby`.
- Se abre con el foco de teclado (Tab sí, clic de ratón no) y se oculta al perder el foco.
- **Hoverable** (WCAG 1.4.13): el puntero puede pasar del disparador al tooltip sin que desaparezca.
- **Descartable**: <kbd>Escape</kbd> lo oculta sin mover el foco, y solo a él: un menú o diálogo debajo sigue abierto.
- **Persistente**: sigue visible hasta que se retira el hover o el foco, o se descarta.
- En pantallas táctiles aparece con una pulsación larga (700 ms) y se oculta 1,5 s después de soltar; tocar en otro sitio lo oculta.
- Respeta `prefers-reduced-motion` y dibuja un borde en modo de colores forzados.

| Tecla | Acción |
|---|---|
| <kbd>Tab</kbd> | Al enfocar un disparador, su tooltip aparece tras el retardo. |
| <kbd>Escape</kbd> | Oculta el tooltip visible. |

## Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-mtx-tooltip="Texto"` | `<Tooltip title="Texto">…</Tooltip>` |
| `data-mtx="tooltip"` + `data-title` (envoltorio) | `<Tooltip title="…"><span>…</span></Tooltip>` |
| `data-tooltip-placement`, `data-tooltip-arrow` | `placement`, `arrow` |
| `data-tooltip-enter-delay`, `data-tooltip-leave-delay` | `enterDelay`, `leaveDelay` |
| `data-tooltip-follow-cursor` | `followCursor` |
| `Materix.tooltip.show(el)` / `hide(el)` / `get(el)` | Prop `open` o ref `action` |
| `setTitle(texto)` | Prop `title` |
| `Materix.tooltip.hideAll()` | `hideAllTooltips()` |
| `Materix.tooltip.sync()` | No hace falta (React aplica el ARIA en cada render). |
| `mtx:tooltip:open` / `mtx:tooltip:close` | `onOpen` / `onClose` |
