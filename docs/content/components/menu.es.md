---
title: "Menu"
description: "Lista temporal de opciones anclada a un disparador: iconos, atajos, separadores, selección, opciones marcables, submenús, menú contextual y navegación completa por teclado."
group: "navigation"
icon: "more_vert"
weight: 30
example: "menu"
import: "Menu, MenuItem, MenuList, MenuDivider, MenuGroup, Submenu, ContextMenu, useMenu, useContextMenu"
mui: "https://mui.com/material-ui/react-menu/"
---

**Menu** muestra una lista temporal de acciones u opciones sobre una superficie elevada, anclada al elemento que la abre, como el `Menu` de MUI (Popper + Paper + MenuList). Úsalo para acciones contextuales sobre un elemento (editar, duplicar, eliminar), menús de cuenta o barras de herramientas compactas. Para elegir un valor en un formulario usa un [NativeSelect](../native-select/); para la navegación principal, [Tabs](../tabs/).

```tsx
import { Menu, MenuItem, useMenu } from '@rubenchodev/materix-react';
// o solo este componente:
import { Menu, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';
```

**Anatomía:** `.mtx-menu__popper` (posicionado en un portal) › `.mtx-menu__paper` (elevación 8) › `.mtx-menu` (`role="menu"`) › `.mtx-menu-item` (`role="menuitem"`) con `.mtx-menu-item__icon`, texto, atajo y `.mtx-menu-item__check` / `.mtx-menu-item__expand` opcionales.

## Uso básico

`useMenu()` equivale al `data-open-menu` de vanilla: esparce `triggerProps` en el disparador y `menuProps` en el `Menu`. El disparador alterna el menú y recibe `aria-haspopup`, `aria-expanded` y `aria-controls`. El menú se cierra al elegir una opción, con un clic fuera, con <kbd>Escape</kbd> o con <kbd>Tab</kbd>.

{{< react-demo "menu/01-basic" >}}

```tsx
const menu = useMenu();

<Button variant="contained" {...menu.triggerProps}>Open menu</Button>
<Menu {...menu.menuProps}>
  <MenuItem>Profile</MenuItem>
  <MenuItem>My account</MenuItem>
  <MenuItem>Sign out</MenuItem>
</Menu>
```

## Disparadores

Sin `useMenu`, el menú es totalmente controlado, como en MUI: `open`, `anchorEl` y `onClose`. Un único `Menu` puede servir a todas las filas de una lista: cada botón se guarda como `anchorEl`, así que también funcionan las filas añadidas después (vanilla necesitaba delegación de clics para ello).

{{< react-demo id="menu/02-triggers" layout="block" >}}

## Densidad

Los ítems miden 48px de alto mínimo; con `dense` (en el `Menu` o en cada `MenuItem`), 32px. `disableGutters` quita el padding lateral.

{{< react-demo "menu/03-density" >}}

## Con y sin iconos

`icon` inserta el icono antes del texto: un nombre de Material Icons (`icon="edit"`) o cualquier nodo (un SVG). Da a los disparadores de solo icono un `aria-label`.

{{< react-demo "menu/04-icons" >}}

## Separadores

`<MenuDivider />` o `<MenuItem divider />` (equivalente a `data-divider`) pintan un `role="separator"` que el teclado salta.

{{< react-demo "menu/05-dividers" >}}

## Estados

`selected` resalta la opción actual y recibe el foco cuando el menú se abre con teclado; `disabled` añade `aria-disabled="true"` y la saca de la navegación.

{{< react-demo "menu/06-states" >}}

## Opciones marcables

`role="menuitemcheckbox"` alterna `aria-checked` al hacer clic (`checked` + `onCheckedChange`, o `defaultChecked`). Los ítems `role="menuitemradio"` dentro de un `MenuGroup` con `value`/`defaultValue` funcionan como opción única; `onSelect` también recibe el nuevo estado `checked`. La marca solo se ve en las opciones marcadas.

{{< react-demo "menu/07-checkable" >}}

## Texto secundario y atajos

`shortcut` alinea un atajo de teclado o un metadato al final; `secondary` añade una segunda línea bajo el texto; `image` muestra una imagen de 24px en lugar de un icono.

{{< react-demo "menu/08-secondary" >}}

## Posicionamiento

El menú se abre bajo el ancla, alineado a su borde inicial (`placement="bottom-start"`); si no hay sitio voltea hacia arriba y, mientras la página se desplaza, conserva el lado elegido (`lockSide`). El alto se limita al espacio disponible y, en RTL, la alineación se refleja. `matchWidth` iguala el ancho del ancla; `anchorEl` puede ser cualquier elemento, una ref o un ancla virtual. Si el ancla sale de la vista el menú pide cerrarse con `anchorHidden`.

{{< react-demo "menu/09-positioning" >}}

## Desplazamiento largo

Con muchas opciones el contenido se desplaza dentro del paper. Escribe una letra para saltar a la siguiente opción que empieza por ella.

{{< react-demo "menu/10-long-scroll" >}}

## Submenús

`<Submenu label icon>` pinta un ítem con `aria-haspopup="menu"` y un chevron que abre un menú anidado a su lado: con hover (tras 100 ms), con clic, o con <kbd>→</kbd>, <kbd>Enter</kbd> o <kbd>Espacio</kbd>. Pasar a otro ítem lo cierra a los 50 ms; <kbd>←</kbd> o <kbd>Escape</kbd> lo cierran y devuelven el foco a su ítem. Elegir una opción cierra toda la cadena y llega al `onSelect` raíz. En RTL se abre hacia la izquierda, el chevron se refleja y las flechas se invierten; si no hay sitio, voltea al otro lado.

{{< react-demo "menu/11-submenus" >}}

## Menú contextual

`<ContextMenu target items>` equivale a `Materix.Menu.createContextMenu(selector, items)`: `target` es un elemento, una ref o un selector CSS (delegado en `document`, así que también sirven las áreas añadidas después); cada ítem acepta `label`, `icon`, `image`, `shortcut`, `disabled`, `divider`, `action` y `submenu`. Se abre con clic derecho en la posición del puntero (`anchorPosition`); con la tecla <kbd>Menú</kbd> o <kbd>Mayús</kbd>+<kbd>F10</kbd> se ancla al área y enfoca la primera opción. Para un marcado propio, `useContextMenu()` devuelve `onContextMenu` y las props de un `Menu`.

{{< react-demo id="menu/12-context-menu" layout="block" >}}

```tsx
<ContextMenu
  target="#canvas"
  items={[
    { label: 'Copy', icon: 'content_copy', shortcut: '⌘C', action: () => copy() },
    { label: 'Paste', icon: 'content_paste', disabled: true },
    { divider: true },
    { label: 'Share', icon: 'share', submenu: [{ label: 'Email', icon: 'mail', action: share }] },
  ]}
/>
```

## Ejemplo real

Menú de cuenta en una [App Bar](../app-bar/), alineado al final del icono con `placement="bottom-end"`.

{{< react-demo id="menu/13-real-world" layout="block" >}}

## Maquetación en grilla

[Tarjetas](../card/) en un [Grid](../grid/) con su propio menú de acciones; el menú se pinta en un portal y la tarjeta no lo recorta.

{{< react-demo id="menu/14-grid" layout="block" >}}

## Uso programático

El equivalente de `open()`/`close()` es la prop `open`. `onOpen`, `onSelect(detail, event)` y `onClose(event, reason)` equivalen a `mtx:menu:open`, `mtx:menu:select` y `mtx:menu:close`. `restoreFocusTo` decide quién recibe el foco al cerrarse el menú.

{{< react-demo id="menu/15-programmatic" layout="block" >}}

## Composición: MenuList

`Menu` se compone de un portal, una transición Grow, el paper y una `MenuList`. `MenuList` sola (dentro de un [Paper](../paper/)) conserva la navegación por teclado para menús siempre visibles. El botón dividido de [Button Group](../button-group/) ancla un `Menu` a todo el grupo con `matchWidth` y devuelve el foco a la flecha.

{{< react-demo "menu/16-menu-list" >}}

## Composición completa

Equivale al *uso manual BEM* de vanilla: en React no se escribe el marcado a mano, pero cada pieza es sustituible. Los ítems pueden ser `<button>` nativos (`component="button"`), los iconos cualquier nodo (un SVG en línea) y las opciones marcadas muestran su `.mtx-menu-item__check`; el DOM resultante es la misma estructura BEM.

{{< react-demo "menu/17-composition" >}}

## Referencia de la API

### Props de Menu

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `open` | `boolean` | — | Muestra el menú (controlado). |
| `anchorEl` | `Element \| Ref \| VirtualElement` | — | Ancla de posición. |
| `anchorPosition` | `{ top, left }` | — | Ancla en un punto del viewport (menú contextual); prevalece sobre `anchorEl`. |
| `onClose` | `(event, reason) => void` | — | Petición de cierre; `reason`: `escapeKeyDown`, `backdropClick`, `tabKeyDown`, `itemClick`, `anchorHidden` o `submenuClose`. |
| `onOpen` | `() => void` | — | El menú se abrió. |
| `onSelect` | `(detail, event) => void` | — | Se eligió un ítem (también de un submenú); `detail = { item, value, checked? }`. |
| `closeOnSelect` | `boolean` | `true` | Pide cerrar (`itemClick`) tras una elección. |
| `autoFocus` | `boolean` | `true` | Mueve el foco al menú al abrirse. |
| `autoFocusItem` | `boolean` | teclado | Enfoca el ítem seleccionado o el primero; por defecto solo si la última interacción fue con teclado (si no, el contenedor). |
| `dense` | `boolean` | `false` | Ítems de 32px. |
| `matchWidth` | `boolean` | `false` | Ancho mínimo igual al del ancla. |
| `placement` | `Placement` | `'bottom-start'` | Lado y alineación preferidos. |
| `offset` | `number` | `4` | Separación con el ancla (px). |
| `transformOrigin` | `string` | calculado | Origen de la animación Grow. |
| `keepMounted` | `boolean` | `false` | Mantiene el menú cerrado en el DOM (oculto, `aria-hidden`). |
| `disablePortal` | `boolean` | `false` | Pinta en su sitio en lugar de `document.body`. |
| `container` | `Element \| Ref` | `document.body` | Destino del portal. |
| `restoreFocusTo` | `HTMLElement \| Ref` | elemento enfocado al abrir | Recibe el foco al cerrarse el menú. |
| `slotProps` | `{ popper, paper }` | — | Atributos de `.mtx-menu__popper` y `.mtx-menu__paper`. |

`ref`, `id`, `className` y cualquier otro atributo van al elemento `role="menu"`.

### Props de MenuItem

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `icon` | `ReactNode` | — | Icono inicial (nombre o nodo). |
| `image` / `imageAlt` | `string` | — | Imagen inicial de 24px (decorativa por defecto). |
| `secondary` | `ReactNode` | — | Segunda línea de texto. |
| `shortcut` | `ReactNode` | — | Atajo o metadato al final. |
| `value` | `string` | — | Valor en `onSelect` y en `MenuGroup`. |
| `role` | `'menuitem' \| 'menuitemcheckbox' \| 'menuitemradio'` | `'menuitem'` | Rol ARIA. |
| `checked` / `defaultChecked` / `onCheckedChange` | — | — | Estado marcado de los ítems marcables. |
| `selected` | `boolean` | `false` | Opción actual. |
| `disabled` | `boolean` | `false` | `aria-disabled`, fuera de la navegación por teclado. |
| `dense` | `boolean` | heredado | 32px. |
| `disableGutters` | `boolean` | `false` | Quita el padding lateral. |
| `divider` | `boolean` | `false` | Pinta un separador. |
| `disableRipple` | `boolean` | `false` | Sin ripple. |
| `href` / `component` | — | `div` | Enlace (`<a>`) u otro elemento. |

### Otros componentes y hooks

| API | Descripción |
|---|---|
| `MenuList` | Lista `role="menu"` con navegación por teclado; props `dense`, `autoFocus`, `autoFocusItem`, `onSelect`. |
| `MenuDivider` | `role="separator"`. |
| `MenuGroup` | `role="group"` con `label`; `value` / `defaultValue` / `onChange` gestionan sus `menuitemradio`. |
| `Submenu` | `label`, `children` (ítems), props de ítem para el disparador y `menuProps` para el `Menu` anidado. |
| `ContextMenu` | `target` (elemento, ref o selector) e `items`; el resto de props van al `Menu`. |
| `useMenu({ id?, defaultOpen? })` | `{ open, openMenu, closeMenu, toggleMenu, triggerProps, menuProps }`. |
| `useContextMenu()` | `{ open, closeMenu, onContextMenu, openFor(event, area), menuProps }`. |

### Callbacks

| Callback | Evento vanilla | Se dispara cuando |
|---|---|---|
| `onOpen()` | `mtx:menu:open` | `open` pasa a `true`. |
| `onSelect(detail, event)` | `mtx:menu:select` | Se activa un ítem habilitado (no un disparador de submenú). |
| `onClose(event, reason)` | `mtx:menu:close` | Escape, clic fuera, Tab, una elección, el ancla oculta o ← en un submenú piden cerrar. |

### Clases CSS

| Clase | Elemento |
|---|---|
| `.mtx-menu__popper` | Contenedor posicionado (`position: fixed`, `dir` del contexto). |
| `.mtx-menu__paper` | Superficie (elevación 8, scroll). |
| `.mtx-menu` / `.mtx-menu--open` | Lista `role="menu"` / estado abierto. |
| `.mtx-menu-item` | Ítem. |
| `.mtx-menu-item--dense`, `--selected`, `--disabled`, `--checked`, `--disable-gutters` | Modificadores del ítem. |
| `.mtx-menu-item--divider` | Separador. |
| `.mtx-menu-item__icon`, `__image`, `__check`, `__expand`, `__shortcut` | Partes del ítem. |

### Variables CSS

| Variable | Uso |
|---|---|
| `--mtx-elevation-8`, `--mtx-overlay-elevation-8` | Sombra y superposición del paper en tema oscuro. |
| `--mtx-color-background-paper`, `--mtx-color-text-primary` | Superficie y texto. |
| `--mtx-color-action-hover`, `--mtx-color-action-selected` | Fondos de hover y selección. |
| `--mtx-color-action-active` | Iconos `__icon`, `__check` y `__expand`. |
| `--mtx-color-divider` | Separador. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Foco del ítem con teclado. |
| `--mtx-z-index-modal` | Nivel de apilamiento del popper. |

## Accesibilidad

- La lista tiene `role="menu"` y cada ítem `role="menuitem"` (o `menuitemcheckbox` / `menuitemradio` con `aria-checked` sincronizado) y `tabindex="-1"` (foco itinerante); los separadores, `role="separator"`. `useMenu` da al disparador `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` (mientras está abierto) y etiqueta el menú con `aria-labelledby`.
- Abierto con teclado, el foco va a la opción seleccionada o a la primera habilitada; con ratón, al contenedor del menú. Tras <kbd>Escape</kbd> o una elección, el foco vuelve al disparador; tras un clic fuera, se queda donde el usuario pulsó.
- Los iconos generados son decorativos (`aria-hidden`). Da a los disparadores de solo icono un `aria-label`.
- Escape se entrega mediante la pila de capas compartida: cierra solo el menú o submenú superior, nunca un diálogo inferior.
- Con `prefers-reduced-motion` el menú aparece sin la animación Grow.

| Tecla | Acción |
|---|---|
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> (disparador) | Abre el menú y enfoca la primera opción. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Opción siguiente / anterior, con vuelta al principio. |
| <kbd>Inicio</kbd> / <kbd>Fin</kbd> | Primera / última opción habilitada. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Activa la opción enfocada (abre un submenú). |
| Letra | Siguiente opción que empieza por esa letra. |
| <kbd>→</kbd> (<kbd>←</kbd> en RTL) | Abre el submenú del ítem enfocado. |
| <kbd>←</kbd> (<kbd>→</kbd> en RTL) | Cierra el submenú y vuelve a su ítem. |
| <kbd>Escape</kbd> | Cierra el menú superior y devuelve el foco. |
| <kbd>Tab</kbd> | Cierra el menú; el foco continúa desde el disparador. |

## Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-open-menu="#id"` / `aria-controls` / `data-anchor` | `useMenu()` (`triggerProps` + `menuProps`) o `open` + `anchorEl` |
| `data-position-anchor` / `open(trigger, { anchorEl })` | `anchorEl` (posición) + `restoreFocusTo` (foco) |
| `data-match-width` | `matchWidth` |
| `data-transform-origin` | `transformOrigin` |
| `data-open` | `open` (inicial `true`) |
| `data-mtx="menu-item"` | `<MenuItem>` |
| `data-icon`, `data-selected`, `data-disabled`, `data-dense`, `data-disable-gutters` | `icon`, `selected`, `disabled`, `dense`, `disableGutters` |
| `data-divider` / `<hr class="mtx-menu-item--divider">` | `<MenuItem divider />` / `<MenuDivider />` |
| `role="menuitemcheckbox"` + `data-checked` | `role="menuitemcheckbox"` + `checked` / `defaultChecked` |
| `role="group"` con `menuitemradio` | `<MenuGroup value>` con `role="menuitemradio"` |
| `data-submenu-trigger` + `data-submenu` | `<Submenu label>` |
| `Menu.createContextMenu(selector, items)` | `<ContextMenu target items>` / `useContextMenu()` |
| `open()` / `close({ restoreFocus })` / `isOpen` | prop `open` / `onClose` / `restoreFocusTo` |
| `mtx:menu:open` / `:select` / `:close` | `onOpen` / `onSelect` / `onClose` |
