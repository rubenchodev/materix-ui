---
title: "Speed Dial"
description: "Botón de acción flotante que despliega de tres a seis acciones relacionadas con etiquetas, en cuatro direcciones, por clic o al pasar el cursor."
group: "navigation"
icon: "touch_app"
weight: 50
example: "speed-dial"
import: "SpeedDial, SpeedDialAction, SpeedDialIcon"
mui: "https://mui.com/material-ui/react-speed-dial/"
---

`SpeedDial` es un [Fab](../fab/) principal que, al pulsarlo, despliega varias acciones secundarias como FAB pequeños con etiqueta, igual que el `SpeedDial` de MUI. Úsalo cuando la acción principal de una pantalla tiene de tres a seis variantes relacionadas (crear documento, hoja, presentación). Si solo hay una acción, usa un `Fab`; si las opciones son muchas o no son acciones de creación, usa un [Menu](../menu/).

```tsx
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@rubenchodev/materix-react';
// o solo este componente:
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@rubenchodev/materix-react/components/speed-dial';
```

## Uso básico

`ariaLabel` nombra el FAB principal y cada `SpeedDialAction` recibe `icon` y `tooltipTitle`. El componente pinta el FAB, el contenedor de acciones y las etiquetas.

{{< react-demo "speed-dial/01-basic" >}}

```tsx
<SpeedDial ariaLabel="Crear">
  <SpeedDialAction icon="description" tooltipTitle="Documento" />
  <SpeedDialAction icon="table_chart" tooltipTitle="Hoja de cálculo" />
  <SpeedDialAction icon="slideshow" tooltipTitle="Presentación" />
</SpeedDial>
```

{{< callout type="warning" title="Nombre accesible de cada acción" >}}
`tooltipTitle` crea la etiqueta visible y, si la acción no tiene `aria-label`, también se usa como su `aria-label`, así las acciones de solo icono siempre tienen nombre accesible. Si `tooltipTitle` no es un texto, pasa tú el `aria-label`.
{{< /callout >}}

Cerrado, las acciones son invisibles pero siguen ocupando su espacio en el flujo, como en MUI: coloca el SpeedDial en una esquina con posición absoluta o fija, por ejemplo con las utilidades `className="mtx-position-absolute mtx-right-0 mtx-bottom-0 mtx-m-2"` dentro de un contenedor posicionado (ver «Oculto y posición»).

## Direcciones

`direction` fija hacia dónde se despliegan las acciones: `up` (por defecto), `down`, `left` o `right`. En vertical las etiquetas aparecen a la izquierda de cada acción; en horizontal, encima. Las flechas siguen la dirección.

{{< react-demo id="speed-dial/02-directions" layout="block" >}}

## Colores

`color` en el SpeedDial colorea el FAB principal (`primary` por defecto); en cada `SpeedDialAction`, colorea esa acción (`secondary` por defecto). Ambos aceptan los colores de [Fab](../fab/).

{{< react-demo id="speed-dial/03-colors" layout="block" >}}

## Estados

Cerrado y abierto (el icono principal rota 45°), hover, foco y acciones deshabilitadas (`disabled`). <kbd>Escape</kbd> lo cierra y devuelve el foco al FAB.

{{< react-demo id="speed-dial/04-states" layout="block" >}}

## Etiquetas

Por defecto las etiquetas de todas las acciones se ven mientras el SpeedDial está abierto (`tooltipOpen` de MUI), con los tokens del [Tooltip](../tooltip/). Con `tooltipHover` en el SpeedDial cada acción usa un [Tooltip](../tooltip/) real que aparece al pasar el puntero **o al enfocar con el teclado**, a la izquierda en direcciones verticales y encima en horizontales; recomendado en horizontal para que no se solapen. En una acción, `tooltipOpen` fuerza un modo y `tooltipPlacement` mueve su Tooltip.

{{< react-demo id="speed-dial/05-labels" layout="block" >}}

{{< callout type="info" title="Teclado" >}}
En ambos modos la etiqueta se ve al recorrer las acciones: en el modo persistente siempre, y con `tooltipHover` el Tooltip aparece con el foco de teclado y se oculta con <kbd>Escape</kbd>. El nombre accesible de cada acción sigue siendo su `aria-label` (las etiquetas persistentes son `aria-hidden` para no leerse dos veces).
{{< /callout >}}

## Abrir al pasar el puntero

`event="hover"` abre el SpeedDial al entrar el ratón y lo cierra al salir. El clic en el FAB sigue alternándolo, así que también funciona en pantallas táctiles y con teclado.

{{< react-demo id="speed-dial/06-hover" layout="block" >}}

## Iconos

Sin `icon` el FAB muestra `<SpeedDialIcon />` (`add`), que rota 45° al abrir. `openIcon` (en el SpeedDial o en `SpeedDialIcon`) lo sustituye por otro icono mientras está abierto: el icono cerrado rota y se desvanece mientras el de apertura gira hasta su sitio. Los iconos pueden ser nombres de Material Icons o nodos como un `<svg>` (24px).

{{< react-demo id="speed-dial/07-icons" layout="block" >}}

```tsx
<SpeedDial ariaLabel="Editar" icon={<SpeedDialIcon openIcon={<EditIcon />} />}>…</SpeedDial>
<SpeedDial ariaLabel="Mensajes" icon="chat" openIcon="close">…</SpeedDial>
```

## Ejemplos reales

Galería de fotos: el SpeedDial es controlado, así que cada acción hace su tarea y lo cierra.

{{< react-demo id="speed-dial/08-use-cases" layout="block" >}}

## Oculto y posición

`hidden` encoge el FAB principal con una transición de escala y cierra las acciones (por ejemplo al hacer scroll): si estaba abierto, se llama a `onClose(null, 'hidden')` y reaparece cerrado. `position="fixed-br"` y `"fixed-bl"` lo fijan a 24px de la esquina inferior derecha o izquierda de la ventana, por encima del contenido (`z-index` 1050).

{{< react-demo id="speed-dial/09-hidden" layout="block" >}}

```tsx
<SpeedDial ariaLabel="Crear" position="fixed-br">
  <SpeedDialAction icon="description" tooltipTitle="Documento" />
</SpeedDial>
```

## Maquetación en grilla

Paneles en [Grid](../grid/) (uno por fila en móvil, dos desde 900px), cada uno con su SpeedDial en la esquina.

{{< react-demo id="speed-dial/10-grid" layout="block" >}}

## Uso programático

`open()`, `close()`, `toggle()` y `direction` de vanilla pasan a ser las props `open` y `direction`. En modo no controlado usa `defaultOpen`; `onOpen` y `onClose` reciben el evento y el motivo.

{{< react-demo id="speed-dial/11-programmatic" layout="block" >}}

```tsx
const [open, setOpen] = useState(false);

<SpeedDial
  ariaLabel="Acciones"
  open={open}
  onOpen={(event, reason) => setOpen(true)}   // 'toggle' | 'mouseEnter'
  onClose={(event, reason) => setOpen(false)} // 'toggle' | 'mouseLeave' | 'escapeKeyDown' | 'clickaway' | 'hidden'
>
  …
</SpeedDial>
```

## Marcado BEM manual

El CSS también funciona con marcado plano (HTML estático o plantillas de servidor). Sin el componente tú gestionas el estado, `aria-expanded`, `inert` y el teclado.

{{< react-demo id="speed-dial/12-markup" open="false" >}}

## Referencia de la API

### Props de SpeedDial

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `ariaLabel` | `string` | i18n `speedDial.actions` (`Actions` / `Acciones`) | `aria-label` del FAB principal. |
| `icon` | `ReactNode` | `<SpeedDialIcon />` | Nombre de Material Icons, nodo o `SpeedDialIcon`. |
| `openIcon` | `ReactNode` | — | Icono mientras está abierto cuando `icon` es un nombre o se omite. |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Dirección de despliegue. |
| `open` | `boolean` | — | Estado controlado. |
| `defaultOpen` | `boolean` | `false` | Estado inicial no controlado. |
| `onOpen` | `(event, reason) => void` | — | Solicitud de apertura (`'toggle' \| 'mouseEnter'`). |
| `onClose` | `(event, reason) => void` | — | Solicitud de cierre (`'toggle' \| 'mouseLeave' \| 'escapeKeyDown' \| 'clickaway' \| 'hidden'`); `event` es `null` con `'hidden'`. |
| `event` | `'click' \| 'hover'` | `'click'` | Con `hover` también abre al entrar el ratón y cierra al salir. |
| `tooltipHover` | `boolean` | `false` | Sustituye las etiquetas persistentes por un Tooltip por acción. |
| `color` | Colores de Fab | `'primary'` | Color del FAB principal. |
| `hidden` | `boolean` | `false` | Oculta el FAB principal con una transición de escala; si estaba abierto, se cierra y llama a `onClose(null, 'hidden')`, así no reaparece abierto. |
| `position` | `'fixed-br' \| 'fixed-bl'` | — | Fijado a una esquina de la ventana. |
| `FabProps` | `Partial<FabProps>` | — | Props extra del FAB principal. |
| `locale` | `string` | — | Idioma del `ariaLabel` por defecto. |
| `className`, `style`, `ref`, `on*`… | — | — | Se reenvían al `<div>` raíz. |

### Props de SpeedDialAction

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `icon` | `ReactNode` | — | Icono de la acción. |
| `tooltipTitle` | `ReactNode` | — | Etiqueta; también el `aria-label` si no tiene. Sin ella no hay wrapper ni etiqueta. |
| `tooltipOpen` | `boolean` | `!tooltipHover` | `true`: etiqueta persistente; `false`: Tooltip en hover/foco. |
| `tooltipPlacement` | `Placement` | `'left'` (vertical) / `'top'` (horizontal) | Colocación del Tooltip (modo hover). |
| `TooltipProps` | `Partial<TooltipProps>` | — | Props extra del Tooltip (modo hover). |
| `color` | Colores de Fab | `'secondary'` | Color del FAB pequeño de la acción. |
| `disabled`, `onClick`, `aria-label`, `ref`… | — | — | Se reenvían al [Fab](../fab/) de la acción. |

### Props de SpeedDialIcon

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `icon` | `ReactNode` | `'add'` | Icono cerrado. |
| `openIcon` | `ReactNode` | — | Icono abierto; sin él `icon` rota 45°. |
| `open` | `boolean` | Estado del SpeedDial | Fuerza el estado fuera de un SpeedDial. |

### Callbacks

| Callback | Evento vanilla | Se dispara cuando |
|---|---|---|
| `onOpen(event, reason)` | `mtx:speed-dial:open` | Se abre (clic o hover). |
| `onClose(event, reason)` | `mtx:speed-dial:close` | Se cierra (clic, clic fuera, <kbd>Escape</kbd>, salida del puntero o `hidden`). |

### Clases CSS

| Clase | Descripción |
|---|---|
| `mtx-speed-dial` | Contenedor flex (`z-index` 1050). |
| `mtx-speed-dial--direction-up` / `--down` / `--left` / `--right` | Dirección de despliegue. |
| `mtx-speed-dial--open` | Estado abierto: acciones visibles e icono principal rotado 45°. |
| `mtx-speed-dial--tooltip-hover` | Modo de etiquetas con Tooltip (hover/foco). |
| `mtx-speed-dial--fixed-br` / `mtx-speed-dial--fixed-bl` | Fijado a 24px de la esquina inferior derecha / izquierda. |
| `mtx-speed-dial__fab` | FAB principal. |
| `mtx-speed-dial__actions` | Contenedor de acciones (separación de 12px). |
| `mtx-speed-dial__action` | FAB pequeño de cada acción. |
| `mtx-speed-dial__action-wrapper` | Envoltorio acción + etiqueta, con animación escalonada (30 ms por acción). Las acciones sin `tooltipTitle` no tienen envoltorio, así que no se animan ni reciben el retardo extra a partir de la quinta. |
| `mtx-speed-dial__tooltip` | Etiqueta persistente de la acción (`aria-hidden`). |
| `mtx-speed-dial__icon` | `SpeedDialIcon` cuyo `icon` es un nodo o que tiene `openIcon` (`--open` mientras está abierto con `openIcon`). |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-duration-short`, `--mtx-duration-shorter`, `--mtx-easing-standard` | Rotación del icono, aparición de acciones y etiquetas. |
| `--mtx-tooltip-bg`, `--mtx-tooltip-color`, `--mtx-tooltip-font-size`, `--mtx-tooltip-max-width` | Etiquetas persistentes (los mismos tokens que el [Tooltip](../tooltip/)). |
| `--mtx-z-index-speed-dial` | Nivel de apilamiento (1050). |

El FAB principal y las acciones usan las variables de [Fab](../fab/).

## Accesibilidad

- El FAB principal recibe `aria-haspopup="true"`, un `aria-expanded` sincronizado y `aria-controls` hacia el contenedor de acciones; su nombre sale de `ariaLabel`.
- Las acciones son `<button>` nativos con icono decorativo (`aria-hidden`), nombrados por `tooltipTitle` o `aria-label`.
- Cerrado, el contenedor de acciones recibe `inert` y `aria-hidden="true"` y cada acción `tabIndex={-1}`, así las acciones invisibles quedan fuera del orden de tabulación. Si el foco está en las acciones al cerrar, vuelve al FAB.
- Las etiquetas persistentes son `aria-hidden` (el nombre ya está en el `aria-label`); en modo `tooltipHover` el Tooltip no duplica el nombre si coincide con el texto.
- <kbd>Escape</kbd> pasa por la pila común de capas: primero se oculta un Tooltip visible y después se cierra el SpeedDial.
- Respeta `prefers-reduced-motion`: la rotación del icono y el cambio a `openIcon` no tienen transición.

| Tecla | Acción |
|---|---|
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> en el FAB | Abre o cierra el SpeedDial. |
| Flecha en la `direction` | Mueve el foco a la acción siguiente (del FAB a la primera). |
| Flecha opuesta | Mueve el foco a la acción anterior, hasta volver al FAB. |
| <kbd>Tab</kbd> / <kbd>Mayús</kbd>+<kbd>Tab</kbd> | Recorre las acciones. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> en una acción | Ejecuta la acción. |
| <kbd>Escape</kbd> | Cierra el SpeedDial y devuelve el foco al FAB. |

## Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-mtx="speed-dial"` + `data-icon` + `data-label` | `<SpeedDial icon="…" ariaLabel="…">` |
| `<button data-icon data-tooltip data-color>` | `<SpeedDialAction icon tooltipTitle color>` |
| `data-direction`, `data-color` | `direction`, `color` |
| `data-event="hover"` | `event="hover"` |
| `data-tooltip-hover` | `tooltipHover` |
| `mtx-speed-dial--fixed-br` / `--fixed-bl` | `position="fixed-br"` / `"fixed-bl"` |
| `open()`, `close()`, `toggle()`, `isOpen` | `open` / `defaultOpen` + `onOpen` / `onClose` |
| `direction = 'left'` | `direction="left"` |
| `mtx:speed-dial:open` / `mtx:speed-dial:close` | `onOpen` / `onClose` |
