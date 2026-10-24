---
title: "Popover"
description: "Paper flotante con contenido arbitrario anclado a un disparador. Se cierra al hacer clic fuera o con Escape y devuelve el foco al disparador."
group: "surfaces"
icon: "picture_in_picture"
weight: 40
example: "popover"
import: "Popover"
mui: "https://mui.com/material-ui/react-popover/"
---

Un **Popover** muestra cualquier contenido (texto, formularios, tarjetas) en una superficie [Paper](../paper/) flotante anclada a otro elemento, como el `Popover` de MUI. Úsalo para filtros, detalles rápidos, pequeñas confirmaciones o una tarjeta de cuenta. Para una lista de acciones usa un [Menu](../menu/); para una etiqueta de texto breve, un [Tooltip](../tooltip/); para una tarea que bloquea la página, un [Dialog](../dialog/).

También es la base flotante sobre la que se construyen otros componentes (selectores de fecha, paneles de filtros): resuelve el posicionamiento, la pila de capas, el foco y el cierre.

```tsx
import { Popover, usePopover } from '@rubenchodev/materix-react';
// o solo este componente:
import { Popover, usePopover } from '@rubenchodev/materix-react/components/popover';
```

## Uso básico

`usePopover()` es el equivalente de `data-open-popover="#id"`: extiende `getTriggerProps()` en el disparador y `popoverProps` en el `<Popover>`. Se abre debajo del disparador alineado a su borde inicial, con elevación 8. El foco pasa al primer control (o al panel) y vuelve al disparador al cerrarse.

{{< react-demo id="popover/01-basic" layout="block" >}}

El panel se renderiza en un portal sobre `document.body`, así que los ancestros con `overflow: hidden` o su propio `z-index` nunca lo recortan. El relleno del contenido lo decides tú: usa utilidades como `mtx-p-2`.

## Colocación

`placement` usa el mismo motor que Tooltip (`top|bottom|left|right` con `-start|-end`; `bottom-start` por defecto), con volteo y desplazamiento automáticos. `offset` fija la separación en px (0 por defecto, como en MUI).

{{< react-demo id="popover/02-placement" layout="block" >}}

## Orígenes de anclaje

La API de MUI: `anchorOrigin={{ vertical, horizontal }}` es el punto del ancla y `transformOrigin` el punto del popover que se une a él. Los valores son `top|center|bottom` y `left|center|right`, o píxeles (números). El popover se mantiene a `marginThreshold` px (16) de los bordes del viewport y la animación de crecimiento parte del origen de transformación.

{{< react-demo id="popover/03-anchor-origins" layout="block" >}}

Si se indica cualquiera de los orígenes, tiene prioridad sobre `placement`.

## Con iconos

Cualquier botón puede ser el disparador. Los de solo icono necesitan un nombre accesible (`aria-label`). El disparador recibe `aria-haspopup="dialog"`, `aria-controls` y un `aria-expanded` sincronizado. Varios disparadores pueden compartir un popover: da a cada uno una `key` (`getTriggerProps({ key })`) para que solo el activo quede expandido; cada disparador pasa a ser el ancla al pulsarlo.

{{< react-demo id="popover/04-with-icons" layout="block" >}}

El encabezado interno se convierte automáticamente en su nombre (`aria-labelledby`).

## Estados

Un disparador deshabilitado no abre el popover. Los elementos con `data-mtx-popover-close` dentro del popover lo cierran (motivo `action`) y devuelven el foco.

{{< react-demo id="popover/05-states" layout="block" >}}

## Posición por coordenadas

`anchorReference="anchorPosition"` con `anchorPosition={{ top, left }}` ancla el popover a un punto del viewport en lugar de a un elemento, por ejemplo la posición del cursor en un evento `contextmenu`. `usePopover().openPopover({ x, y })` hace lo mismo. Con `anchorReference="none"` el popover se centra en el viewport.

{{< react-demo id="popover/06-anchor-position" layout="block" >}}

## Modal

Por defecto el popover es **no modal**: no atrapa el foco ni bloquea el scroll, y salir de él con Tab lo cierra (motivo `tabOut`). Con `modal` atrapa <kbd>Tab</kbd>, bloquea el scroll de la página y añade `aria-modal="true"`, como el Popover de MUI; un clic fuera lo sigue cerrando (motivo `clickaway`) y llega al elemento pulsado, como en vanilla. `data-autofocus` en un control elige el foco inicial.

{{< react-demo id="popover/07-modal" layout="block" >}}

## Dialog desde un popover

Un botón dentro del popover puede abrir un [Dialog](../dialog/). Interactuar con el diálogo no cuenta como "clic fuera" para el popover, el primer <kbd>Escape</kbd> cierra solo el diálogo (el foco vuelve al botón dentro del popover) y el segundo cierra el popover.

{{< react-demo id="popover/08-dialog" layout="block" >}}

## Capa desde un popover

Un popover también puede abrir otro popover (o un menú). Ambas comparten la pila de capas: interactuar con la capa superior no cuenta como "clic fuera" para el popover, el primer <kbd>Escape</kbd> cierra solo la capa superior (el foco vuelve a su disparador dentro del popover) y el segundo cierra el popover.

{{< react-demo id="popover/09-nested" layout="block" >}}

## Ejemplos reales

Filtros de una tabla y una tarjeta de cuenta abierta desde un avatar, alineada al final:

{{< react-demo id="popover/10-use-cases" layout="block" >}}

## Maquetación en grilla

El popover se porta a `<body>`, así que las columnas y los contenedores con `overflow` nunca lo recortan.

{{< react-demo id="popover/11-grid" layout="block" >}}

## Interacción al pasar el ratón

El patrón hover de MUI: abrir en `mouseenter`/`focus` y cerrar en `mouseleave`/`blur`, con `disableAutoFocus`, `disableRestoreFocus` y la utilidad `mtx-pointer-events-none` para que el popover nunca robe el puntero ni el foco.

{{< react-demo id="popover/12-hover" layout="block" >}}

## Uso programático

La prop `open` equivale a `open()`/`close()`. `usePopover()` expone `openPopover(anchor)`, `close()` y `toggle(anchor)`; `onOpen` y `onClose(event, reason)` equivalen a `mtx:popover:open` y `mtx:popover:close`. La ref `action` expone `updatePosition()` (el `update()` de vanilla).

{{< react-demo id="popover/13-programmatic" layout="block" >}}

```tsx
const [open, setOpen] = useState(false);
const anchorRef = useRef<HTMLButtonElement>(null);
const action = useRef<PopoverActions>(null);

<Button ref={anchorRef} onClick={() => setOpen(true)}>Filtros</Button>
<Popover
  open={open}
  anchorEl={anchorRef}             // elemento, ref, función o ancla virtual
  onClose={(event, reason) => setOpen(false)}
  onOpen={(anchor) => console.log('abierto', anchor)}
  action={action}                   // action.current.updatePosition()
>
  …
</Popover>
```

## Reutilización en otros componentes

`Popover` está pensado como base flotante de otras superficies. Estas son las props en las que se apoyan:

```tsx
<Popover
  open={open}
  anchorEl={inputRef}                 // ref o elemento; o un ancla virtual
  placement="bottom-start"            // o anchorOrigin/transformOrigin
  offset={4}
  modal={isMobile}                    // atrapa Tab y bloquea el scroll
  disableAutoFocus                    // el propietario mueve el foco
  disableRestoreFocus                 // el propietario restaura el foco
  onClose={(event, reason) => …}      // escapeKeyDown | clickaway | tabOut | action
  role="dialog" aria-label="Elegir fecha"
  className="mtx-date-picker__popover"
/>
```

También se exportan `resolveOrigin()` (origen MUI a píxeles) y las constantes `POPOVER_MARGIN_THRESHOLD` y `POPOVER_EXIT_DURATION`.

## Referencia de la API

### Props de Popover

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `open` | `boolean` | — | Muestra el popover (controlado). |
| `anchorEl` | `Element \| VirtualElement \| ref \| () => Element` | — | Ancla (`data-anchor` o el disparador en vanilla). |
| `anchorReference` | `'anchorEl' \| 'anchorPosition' \| 'none'` | `'anchorEl'` | Qué ancla usar; `none` lo centra. |
| `anchorPosition` | `{ top, left }` | — | Punto del viewport con `anchorReference="anchorPosition"`. |
| `anchorOrigin` | `{ vertical, horizontal }` | `bottom left` | Punto del ancla (algoritmo de MUI). Prioritario sobre `placement`. |
| `transformOrigin` | `{ vertical, horizontal }` | `top left` | Punto del popover unido al ancla. |
| `placement` | `top`, `bottom`, `left`, `right` + `-start`/`-end` | `bottom-start` | Colocación con volteo y desplazamiento. |
| `offset` | `number` | `0` | Separación con el ancla (con `placement`). |
| `marginThreshold` | `number` | `16` | Distancia mínima a los bordes del viewport. |
| `elevation` | `0`–`8`, `12`, `16`, `24` | `8` | Sombra (y capa de elevación en tema oscuro). |
| `modal` | `boolean` | `false` | Tab atrapado, scroll bloqueado y `aria-modal`. |
| `label` | `string` | — | `aria-label` (si no, lo nombra el primer encabezado). |
| `onClose` | `(event, reason) => void` | — | Solicitud de cierre; motivos `escapeKeyDown`, `clickaway`, `tabOut`, `action`, `trigger`. |
| `onOpen` | `(anchor) => void` | — | Abierto y posicionado. |
| `onExited` | `() => void` | — | Terminó la transición de salida. |
| `disableAutoFocus` | `boolean` | `false` | No mueve el foco al abrir. |
| `disableRestoreFocus` | `boolean` | `false` | No devuelve el foco al cerrar. |
| `disableEscapeKeyDown` | `boolean` | `false` | Ignora Escape. |
| `disablePortal` | `boolean` | `false` | Se renderiza en su sitio en lugar de en `document.body`. |
| `container` | `Element \| ref \| () => Element` | `document.body` | Destino del portal. |
| `keepMounted` | `boolean` | `false` | Mantiene el nodo (con `hidden`) mientras está cerrado. |
| `transitionDuration` | `number` | `150` | Tiempo de salida en ms antes de ocultar/desmontar. |
| `action` | `Ref<{ updatePosition() }>` | — | Acciones imperativas. |

`id` (generado si falta), `className` (concatenado), `ref`, `style` y cualquier otro atributo van al `<div>` raíz; `role`, `tabIndex` y `aria-labelledby` se pueden sobrescribir.

### usePopover

| Miembro | Tipo | Descripción |
|---|---|---|
| `getTriggerProps({ key?, onClick? })` | `function` | `aria-haspopup`, `aria-controls`, `aria-expanded` y el `onClick` que alterna, para un disparador. |
| `popoverProps` | `object` | `id`, `open`, `anchorEl`, `onClose` para `<Popover>`. |
| `open`, `anchor` | estado | Estado abierto y ancla actual. |
| `openPopover(anchor)` | `function` | Abre anclado a un elemento, a un punto `{ x, y }` o a un ancla virtual. |
| `close()` | `function` | Lo cierra (motivo `api`). |
| `toggle(anchor)` | `function` | Alterna el estado. |

Opciones: `usePopover({ id, onOpen(anchor), onClose(reason) })`.

### Callbacks

| Callback | Evento vanilla | Se dispara cuando |
|---|---|---|
| `onOpen(anchor)` | `mtx:popover:open` | Se abre. |
| `onClose(event, reason)` | `mtx:popover:close` | Solicita cerrarse. |
| `onExited()` | — | Termina la transición de salida. |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-popover` | Superficie: Paper con radio 4px, elevación 8, `max-width`/`max-height` `calc(100% - 32px)` y scroll propio. |
| `mtx-popover--open` | Estado visible (transición de crecimiento desde el origen de transformación). |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-popover-shadow` | Sombra (la fija `elevation`; por defecto `--mtx-elevation-8`). |
| `--mtx-popover-overlay` | Capa de elevación en tema oscuro. |
| `--mtx-color-background-paper`, `--mtx-color-text-primary` | Superficie y texto. |
| `--mtx-z-index-modal` | Nivel de apilamiento (1300). |

## Accesibilidad

- El popover tiene `role="dialog"` y `tabindex="-1"`. Su nombre viene de `label` (`aria-label`), de `data-popover-title` o del primer encabezado interno (`aria-labelledby`). Con `modal` también recibe `aria-modal="true"`.
- El disparador recibe `aria-haspopup="dialog"`, `aria-controls` y un `aria-expanded` sincronizado con el estado (`getTriggerProps`).
- Al abrirse, el foco pasa a `[data-autofocus]`, al primer control enfocable o al propio panel. Al cerrarse con <kbd>Escape</kbd>, el disparador o un botón de cierre, el foco vuelve al elemento que lo tenía (o al ancla si el navegador no lo enfocó al hacer clic, como en Safari).
- Un clic fuera lo cierra sin robar el foco al elemento pulsado; si el foco se fuera a perder, vuelve al disparador.
- Si el disparador solo muestra un avatar o iniciales, nómbralo con texto visualmente oculto (`<span className="mtx-visually-hidden">…</span>`) en lugar de un `aria-label` que no contenga el texto visible (WCAG 2.5.3 *Label in Name*).

| Tecla | Acción |
|---|---|
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> en el disparador | Abre o cierra el popover. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Recorre sus controles. No modal: salir del popover lo cierra. Modal: el foco circula dentro. |
| <kbd>Escape</kbd> | Lo cierra y devuelve el foco al disparador, solo si es la capa superior. |

## Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-mtx="popover"` + `open()` / `close()` | `<Popover open={…} onClose={…}>` |
| Disparador `data-open-popover="#id"` / `aria-controls="id"` | `usePopover().getTriggerProps()` |
| `open(element)` / `open({ x, y })` / `toggle()` | `openPopover(anchor)` / `toggle(anchor)`, o `anchorEl` / `anchorPosition` |
| `update()` | `action.current.updatePosition()` |
| `data-placement`, `data-offset` | `placement`, `offset` |
| `data-anchor-origin="top right"` | `anchorOrigin={{ vertical: 'top', horizontal: 'right' }}` |
| `data-transform-origin` | `transformOrigin` |
| `data-anchor="#el"` | `anchorEl={ref}` |
| `data-label`, `data-elevation`, `data-modal` | `label`, `elevation`, `modal` |
| `data-mtx-popover-close`, `data-autofocus`, `data-popover-title` | los mismos atributos dentro del contenido |
| `mtx:popover:open` / `mtx:popover:close` (`reason`) | `onOpen` / `onClose(event, reason)` |
| Motivos `escape`, `click-away`, `tab`, `action`, `trigger` | `escapeKeyDown`, `clickaway`, `tabOut`, `action`, `trigger` |
