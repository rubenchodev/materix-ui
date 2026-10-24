---
title: "List"
description: "Lista vertical continua de texto, iconos o avatares; con ítems estáticos o interactivos, subcabeceras, densidad y selección."
group: "data-display"
icon: "format_list_bulleted"
weight: 50
example: "list"
import: "List, ListItem, ListItemButton, ListItemText, ListItemIcon, ListItemAvatar, ListItemSecondaryAction, ListSubheader"
mui: "https://mui.com/material-ui/react-list/"
---

`List` agrupa elementos relacionados en una columna continua: menús de navegación, bandejas de entrada, ajustes o resultados. Cada fila puede llevar icono o avatar, texto principal y secundario y una acción al final. Para datos con varias columnas comparables usa [Table](../table/); para un menú flotante usa [Menu](../menu/).

```tsx
import { List, ListItem, ListItemButton } from '@rubenchodev/materix-react';
// o solo este componente:
import { List, ListItem } from '@rubenchodev/materix-react/components/list';
```

## Uso básico

Una `List` (un `<ul>`) con filas `ListItem` (`<li>`). La prop `icon` añade el icono y `secondary` el texto secundario; los hijos de texto son el texto principal (el equivalente a la sintaxis simplificada de vanilla).

{{< react-demo "list/01-basic" >}}

## Contenido de la fila

Solo texto, con icono, con avatar y con texto principal y secundario. `avatar` acepta una URL de imagen (se pinta como Avatar con `avatarAlt`, decorativo por defecto) o cualquier nodo, por ejemplo un `<Avatar>`; se envuelve en `ListItemAvatar` (56px). `alignItems="flex-start"` alinea el avatar con la primera línea de los textos largos.

{{< react-demo "list/02-row-content" >}}

## Filas interactivas

`ListItemButton` pinta un `<button type="button">` (o un `<a>` con `href`) con hover, foco, ripple y selección: al pulsar una fila se selecciona y se deselecciona la anterior dentro de la misma `List`. La selección es no controlada por defecto (`defaultValue`, el `value` de la fila inicial) o controlada con `value` + `onSelect`. Con `selectable={false}` las filas solo ejecutan su acción.

{{< react-demo "list/04-interactive" >}}

## Subcabeceras

`ListSubheader` titula grupos (un `<li>` por defecto). `inset` alinea el título con el texto de las filas con icono; `sticky` lo fija mientras la lista se desplaza. También puedes pasarla con la prop `subheader` de `List`.

{{< react-demo "list/06-subheaders" >}}

## Densidad

`dense` en la lista reduce el padding vertical de sus filas (también las anidadas) de 8px a 4px.

{{< react-demo "list/03-density" >}}

## Listas anidadas

Una `List` con `nested` dentro de una fila sangra sus filas 48px (`nested={2}`: 72px) y comparte la selección de la lista padre. Envuélvela en `Collapse` (exportado por el paquete) para desplegarla y plegarla; la fila padre usa `aria-expanded`, `aria-controls` y `disableSelect` para no quedar seleccionada.

{{< react-demo "list/07-nested" >}}

## Acciones secundarias

`secondaryAction` en `ListItem` pinta la acción en `ListItemSecondaryAction`: alineada al final, admite varias acciones de cualquier ancho y un IconButton final se ajusta al borde. Para una fila pulsable con una acción aparte, usa un `ListItem disablePadding` con el `ListItemButton` como hijo y la acción en `secondaryAction`.

{{< react-demo "list/08-secondary-actions" >}}

## Estados

Pasa el ratón para ver el hover y usa Tab para el foco. `disabled` deshabilita la fila: el `disabled` nativo en botones, `aria-disabled="true"` y `tabIndex={-1}` en enlaces, y `aria-disabled` en filas estáticas.

{{< react-demo "list/05-states" >}}

## Ejemplos reales

### Navegación lateral

Con `href` las filas son enlaces; la seleccionada recibe `aria-current="page"`.

{{< react-demo "list/09-use-cases" >}}

### Listas en una grilla

{{< react-demo id="list/10-grid" layout="block" >}}

## Uso programático

`onSelect` es el equivalente al evento vanilla `mtx:list:select`: recibe `{ item, value }` (el elemento de la fila y su valor). El setter `selected` y `disable()`/`enable()` pasan a la prop `value` de `List` (o `selected` en la fila) y `disabled`.

{{< react-demo id="list/11-programmatic" layout="block" >}}

## Composición con subcomponentes

Para un control total (el equivalente a la sintaxis BEM de vanilla), compón `ListItemIcon`, `ListItemAvatar`, `ListItemText` y `ListItemSecondaryAction` dentro de las filas. Cuando los hijos de una fila no son solo texto, se pintan tal cual.

{{< react-demo "list/12-composition" >}}

## Referencia de la API

### List

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `dense` | `boolean` | `false` | Filas compactas (4px) en toda la lista, anidadas incluidas. |
| `disablePadding` | `boolean` | `false` | Quita el padding vertical de 8px. |
| `nested` | `boolean \| 2` | `false` | Lista anidada: filas sangradas 48px (`2` → 72px); comparte la selección del padre. |
| `subheader` | `ReactNode` | — | Se pinta como primer hijo. |
| `selectable` | `boolean` | `true` | `false`: sus `ListItemButton` no se seleccionan al pulsar. |
| `value` | `string \| null` | — | Fila seleccionada (controlado). |
| `defaultValue` | `string \| null` | `null` | Fila seleccionada inicial (no controlado). |
| `onSelect` | `(detail: { item: HTMLElement; value: string }) => void` | — | Se seleccionó una fila con un clic. |
| `component` | `ElementType` | `'ul'` | Elemento raíz. |

### ListItem y ListItemButton

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `icon` | `string \| ReactNode` | — | Icono inicial (nombre de Material Icons o nodo) en `ListItemIcon`. |
| `avatar` | `string \| ReactNode` | — | Avatar inicial (URL de imagen o nodo) en `ListItemAvatar`. |
| `avatarAlt` | `string` | `''` | Texto alternativo cuando `avatar` es una URL. |
| `primary` | `ReactNode` | hijos de texto | Texto principal explícito; los demás hijos se pintan después. |
| `secondary` | `ReactNode` | — | Texto secundario. |
| `dense` | `boolean` | heredado de `List` | Fila compacta. |
| `divider` | `boolean` | `false` | Borde inferior de 1px. |
| `disabled` | `boolean` | `false` | Fila deshabilitada. |
| `alignItems` | `'center' \| 'flex-start'` | `'center'` | `flex-start` alinea el icono o avatar con la primera línea. |
| `disableGutters` | `boolean` | `false` | Sin padding horizontal. |
| `disablePadding` | `boolean` | `false` | Solo `ListItem`: sin padding. |
| `secondaryAction` | `ReactNode` | — | Solo `ListItem`: acción al final de la fila. |
| `selected` | `boolean` | según `List` | Solo `ListItemButton`: selección controlada. |
| `value` | `string` | id generado | Solo `ListItemButton`: valor para la selección de la lista. |
| `disableSelect` | `boolean` | `false` | Solo `ListItemButton`: no se selecciona al pulsar. |
| `href` | `string` | — | Solo `ListItemButton`: pinta un `<a>`. |
| `disableRipple` | `boolean` | `false` | Solo `ListItemButton`: sin ripple. |
| `component` | `ElementType` | `'li'` / `'button'` | Elemento raíz. |

### Partes

| Componente | Props | Descripción |
|---|---|---|
| `ListItemText` | `primary`, `secondary` (children = principal) | `.mtx-list-item-text` con `__primary` y `__secondary`. |
| `ListItemIcon` | `icon` (o children) | `.mtx-list-item-icon`. |
| `ListItemAvatar` | — | `.mtx-list-item-avatar` (56px). |
| `ListItemSecondaryAction` | — | `.mtx-list-item-secondary-action`. |
| `ListSubheader` | `inset`, `sticky`, `component` | `.mtx-list-subheader`. |

Todos reenvían `ref` a la raíz, concatenan `className` y pasan los atributos nativos.

### Callbacks

| Callback | Argumentos | Evento vanilla |
|---|---|---|
| `List.onSelect` | `{ item: HTMLElement; value: string }` | `mtx:list:select` (`detail.item`) |

### Equivalencia con vanilla

| Vanilla | React |
|---|---|
| `data-dense`, `data-nested`, `data-disable-padding` | `dense`, `nested`, `disablePadding` |
| `data-selectable="false"` | `selectable={false}` |
| `data-icon`, `data-avatar`, `data-avatar-alt` | `icon`, `avatar`, `avatarAlt` |
| `data-primary`, `data-secondary` | `primary`, `secondary` |
| `data-divider`, `data-disabled`, `data-align-start` | `divider`, `disabled`, `alignItems="flex-start"` |
| `data-disable-gutters`, `data-disable-padding` | `disableGutters`, `disablePadding` |
| `data-selected` | `defaultValue` en `List` o `selected` en la fila |
| `data-no-select` | `disableSelect` |
| `data-inset`, `data-sticky` (subcabecera) | `inset`, `sticky` |
| `mtx:list:select` | `onSelect` |
| setter `selected`, `disable()` / `enable()` | `value` / `selected`, `disabled` |

### Clases CSS

Las mismas que la librería vanilla: `mtx-list` (`--dense`, `--nested`, `--nested-2`, `--disable-padding`), `mtx-list-item` (`--dense`, `--divider`, `--align-start`, `--disable-padding`, `--disable-gutters`, `--selected`, `--disabled`), `mtx-list-item-button`, `mtx-list-item-icon`, `mtx-list-item-avatar`, `mtx-list-item-secondary-action`, `mtx-list-item-text` (`__primary`, `__secondary`) y `mtx-list-subheader` (`--inset`, `--sticky`).

## Accesibilidad

- Mantén `<ul>`/`<li>` para que los lectores de pantalla anuncien el número de elementos, y nombra la lista con `aria-label` si no tiene un título visible.
- Las filas interactivas deben ser un `<button>` (acciones) o un `<a href>` (navegación) dentro de un `<li>`; con `component` y sin `role`, la fila recibe `role="button"`, `tabIndex={0}` y Enter/Espacio.
- La selección se comunica con ARIA válido para cada elemento: un `<a>` recibe `aria-current="page"`; un `<button>`, `aria-current="true"`; solo las filas con `role="option"` o `role="tab"` (u otro rol seleccionable) reciben `aria-selected`.
- Los iconos generados con `icon` son decorativos; el texto de la fila es el nombre accesible. Los botones de acción secundaria necesitan su propio `aria-label`.

| Tecla | Acción |
|---|---|
| Tab / Mayús+Tab | Mueve el foco entre filas interactivas y acciones. |
| Enter | Activa la fila enfocada. |
| Espacio | Activa la fila enfocada si es un botón. |
