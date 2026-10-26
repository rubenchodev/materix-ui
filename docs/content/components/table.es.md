---
title: "Table"
description: "Muestra conjuntos de datos en filas y columnas sobre una tabla HTML semántica, con densidad, cabecera fija, ordenación, selección y paginación."
group: "data-display"
icon: "table_chart"
weight: 60
example: "table"
import: "Table, TableContainer, TableHead, TableBody, TableFooter, TableRow, TableCell, TableCaption, TableSortLabel, TablePagination, TableToolbar, useTableSelection, useTableSort"
mui: "https://mui.com/material-ui/react-table/"
---

**Table** implementa la familia de tablas de MUI sobre un `<table>` semántico: `TableContainer`, `TableHead`, `TableBody`, `TableFooter`, `TableRow` y `TableCell`, más las piezas interactivas `TableSortLabel`, `TablePagination` y `TableToolbar`. La selección de filas se basa en datos con el hook `useTableSelection` y el [Checkbox](../checkbox/) existente. Úsala para datos de varias columnas que el usuario compara o recorre. Para una sola columna de elementos usa [List](../list/); para tarjetas de resumen, [Card](../card/).

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@rubenchodev/materix-react';

<TableContainer>
  <Table aria-label="Inventario">
    <TableHead>
      <TableRow><TableCell>Producto</TableCell><TableCell align="right">Stock</TableCell></TableRow>
    </TableHead>
    <TableBody>
      <TableRow><TableCell>Teclado</TableCell><TableCell align="right">12</TableCell></TableRow>
    </TableBody>
  </Table>
</TableContainer>
```

## Anatomía

- **TableContainer**: `<div class="mtx-table-container">` que desplaza en horizontal (y en vertical con `maxHeight`).
- **Table**: `<table class="mtx-table">`; comparte `size`, `padding`, `hover` y `selectable` con sus hijos mediante contexto.
- **TableHead / TableBody / TableFooter**: `<thead>`, `<tbody>` y `<tfoot>`. Las celdas dentro de `TableHead` se pintan como `<th scope="col">`.
- **TableRow / TableCell**: `<tr class="mtx-table-row">` y `<th>`/`<td class="mtx-table-cell">`.
- **TableCaption**: `<caption class="mtx-table-caption">`, mostrada bajo la tabla.

## Uso básico

{{< react-demo id="table/01-basic" layout="block" >}}

## Alineación numérica

Alinea a la derecha las columnas numéricas con `align="right"` en la cabecera y en las celdas del cuerpo, o con `numeric`.

{{< react-demo id="table/02-alignment" layout="block" >}}

## Tamaños

`size="medium"` (relleno de 16px, por defecto) o `size="small"` (6px vertical, `mtx-table--small`). Un `TableCell` suelto también admite `size`.

{{< react-demo id="table/03-sizes" layout="block" >}}

## Estados de fila

`hover` en `Table` resalta las filas del cuerpo (no las de cabecera ni pie); `hover` en un `TableRow` resalta solo esa fila. `selected` añade `mtx-table-row--selected` y `aria-selected="true"`.

{{< react-demo id="table/04-row-states" layout="block" >}}

## Cabecera fija

`stickyHeader` en `TableContainer` (o en `Table`) mantiene visible la cabecera y `maxHeight` (número en px o cualquier valor CSS) limita la altura. Mientras el contenedor desplaza contenido es una región enfocable (`tabindex="0"`, `role="region"`) nombrada por la leyenda, el `aria-labelledby`/`aria-label` de la tabla o un texto traducido; un `ResizeObserver` lo mantiene sincronizado, como en vanilla.

{{< react-demo id="table/05-sticky-header" layout="block" >}}

## Pie y leyenda

{{< react-demo id="table/06-footer-caption" layout="block" >}}

## Ordenación

`TableSortLabel` es controlada: `active` y `direction` describen el orden actual y `onSort(event, { direction, active, key })` informa del solicitado (equivale a `mtx:table:sort`). El `<th>` padre recibe `aria-sort` automáticamente. `useTableSort()` mantiene una sola columna activa y `sortRows` + `getComparator` ordenan los datos de forma estable. En columnas alineadas a la derecha la flecha va a la izquierda.

{{< react-demo id="table/07-sorting" layout="block" >}}

```tsx
const sort = useTableSort<'name' | 'kcal'>({ defaultOrderBy: 'name' });
const rows = sortRows(data, getComparator(sort.order, sort.orderBy ?? 'name'));

<TableCell><TableSortLabel {...sort.getSortLabelProps('name')}>Postre</TableSortLabel></TableCell>
```

## Selección

`useTableSelection(rows, getId, options)` reproduce el `data-selectable` de vanilla: la casilla de cabecera selecciona todas las filas seleccionables y habilitadas y queda indeterminada con selección parcial; las filas publican `aria-selected`; la selección se guarda por id, así que sobrevive a ordenar, filtrar y paginar. `isRowSelectable` excluye una fila (`data-no-select`), `isRowDisabled` deshabilita su casilla y `selectOnClick` alterna la fila al hacer clic fuera de sus controles.

Por defecto se conservan las claves de filas que ya no están en `rows`, así que `numSelected` y la barra siguen contándolas. Cuando `rows` es el **conjunto completo** de datos y las filas pueden borrarse (o recargarse del servidor), pasa `pruneMissing: true` para descartar esas claves automáticamente (llama a `onSelectionChange` con `reason: 'api'`). No lo uses si `rows` es solo la lista filtrada o la página actual, o la selección se perdería al filtrar o paginar.

{{< react-demo id="table/08-selection" layout="block" >}}

```tsx
const selection = useTableSelection(rows, (row) => row.id, { getRowLabel: (row) => row.name });

<Table selectable aria-label="Equipo">
  <TableHead>
    <TableRow>
      <TableCell padding="checkbox"><Checkbox {...selection.getHeaderCheckboxProps()} /></TableCell>
      <TableCell>Nombre</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {rows.map((row) => (
      <TableRow key={row.id} {...selection.getRowProps(row)}>
        <TableCell padding="checkbox"><Checkbox {...selection.getRowCheckboxProps(row)} /></TableCell>
        <TableCell>{row.name}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Barra de herramientas

`TableToolbar` (el `EnhancedTableToolbar` de MUI) muestra el `title` y las `actions` sin selección; con `numSelected > 0` se resalta, anuncia el contador en una región viva y muestra las `selectedActions`.

{{< react-demo id="table/09-toolbar" layout="block" >}}

## Paginación

`TablePagination` pinta el selector nativo de filas por página, el rango mostrado (región viva) y los botones de navegación. Puede ser controlada (`page`, `rowsPerPage`) o no controlada (`defaultPage`, `defaultRowsPerPage`); `-1` en `rowsPerPageOptions` significa "Todas" y `count={-1}` un total desconocido. Corta los datos con `paginateRows(rows, page, rowsPerPage)`. Cambiar las filas por página devuelve la página a 0 sin llamar a `onPageChange`; en modo controlado resetea `page` en `onRowsPerPageChange`.

{{< react-demo id="table/10-pagination" layout="block" >}}

## Celdas personalizadas

{{< react-demo id="table/11-custom-cells" layout="block" >}}

## Ejemplo real

Una tabla de datos con búsqueda de cliente ([TextField](../text-field/)), borrado en lote, selección, ordenación, chips de estado ([Chip](../chip/)) y paginación local.

{{< react-demo id="table/12-data-table" layout="block" >}}

## Maquetación en grilla

{{< react-demo id="table/13-grid" layout="block" >}}

## Uso programático

{{< react-demo id="table/14-programmatic" layout="block" >}}

## Referencia de la API

### Props de Table

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `size` | `'medium' \| 'small'` | `'medium'` | Densidad (`mtx-table--small`). |
| `padding` | `'normal' \| 'checkbox' \| 'none'` | `'normal'` | Relleno por defecto de las celdas. |
| `stickyHeader` | `boolean` | `false` | Cabecera fija (`mtx-table--sticky-header`). |
| `hover` | `boolean` | `false` | Resalta las filas del cuerpo al pasar el ratón. |
| `selectable` | `boolean` | `false` | Tabla seleccionable: las filas publican `aria-selected` (`"true"` / `"false"`). |
| `selectOnClick` | `boolean` | `false` | Cursor de mano en filas seleccionables (`data-select-on-click`). |

### Props de TableContainer

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `maxHeight` | `number \| string` | — | Altura máxima; activa el scroll vertical (`mtx-table-container--scroll`). |
| `stickyHeader` | `boolean` | `false` | Cabecera fija para la tabla interior. |
| `locale` | `string` | contexto | Idioma del nombre de región por defecto. |

### Props de TableRow

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `hover` | `boolean` | `false` | Resalta la fila al pasar el ratón. |
| `selected` | `boolean` | — | Fila seleccionada (`mtx-table-row--selected`, `aria-selected`). |

### Props de TableCell

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `align` | `'inherit' \| 'left' \| 'center' \| 'right' \| 'justify'` | `'inherit'` | Alineación (`mtx-table-cell--{align}`). |
| `numeric` | `boolean` | `false` | Columna numérica alineada a la derecha (`mtx-table-cell--numeric`). |
| `padding` | `'normal' \| 'checkbox' \| 'none'` | tabla | Relleno de la celda. |
| `size` | `'medium' \| 'small'` | tabla | Densidad de esta celda. |
| `variant` | `'head' \| 'body' \| 'footer'` | sección | Variante; se deduce de la sección padre. |
| `sortDirection` | `'asc' \| 'desc' \| false` | — | Publica `aria-sort`. |
| `component` | `'th' \| 'td'` | `th` en cabecera | Elemento pintado. |
| `scope` | `string` | `col`/`row` | `col` en `<th>` de cabecera, `row` en `<th>` del cuerpo. |

### Props de TableHead, TableBody, TableFooter y TableCaption

Aceptan todos los atributos nativos de `<thead>`, `<tbody>`, `<tfoot>` y `<caption>` (`className` se concatena y `ref` va al elemento). `TableHead`, `TableBody` y `TableFooter` publican su sección a filas y celdas (las celdas de cabecera pasan a `<th scope="col">` y las del pie reciben el estilo de totales); `TableCaption` genera un `id` si no se le da, para que `TableContainer` lo use como nombre de la región.

| Componente | Elemento | Clase |
| :--- | :--- | :--- |
| `TableHead` | `<thead>` | `mtx-table-head` |
| `TableBody` | `<tbody>` | `mtx-table-body` |
| `TableFooter` | `<tfoot>` | `mtx-table-footer` |
| `TableCaption` | `<caption>` | `mtx-table-caption` |

### Props de TableSortLabel

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `active` | `boolean` | `false` | Columna activa. |
| `direction` | `'asc' \| 'desc'` | `'asc'` | Dirección mostrada. |
| `sortKey` | `string` | — | Clave de la columna devuelta en `onSort`. |
| `onSort` | `(event, { direction, active, key }) => void` | — | Pide un nuevo orden (`mtx:table:sort`). |
| `icon` | `ReactNode` | flecha | Icono propio. |
| `hideSortIcon` | `boolean` | `false` | Oculta el icono mientras no está activa. |
| `disabled` | `boolean` | `false` | Deshabilita la etiqueta. |

### Props de TablePagination

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `count` | `number` | `0` | Total de filas; `-1` si es desconocido. |
| `page` / `defaultPage` | `number` | `0` | Página actual, base cero. |
| `rowsPerPage` / `defaultRowsPerPage` | `number` | `10` | Filas por página; `-1` muestra todas. |
| `rowsPerPageOptions` | `number[]` | `[10, 25, 50, 100]` | Opciones del selector. |
| `onPageChange` | `(event, page, { previousPage, reason }) => void` | — | `mtx:table:page-change`. |
| `onRowsPerPageChange` | `(event, rowsPerPage, { previousRowsPerPage, page }) => void` | — | `mtx:table:rows-per-page-change`; la página vuelve a 0 sin `onPageChange` (resetéala aquí si es controlada). |
| `showFirstButton` / `showLastButton` | `boolean` | `false` | Botones de primera / última página. |
| `disabled` | `boolean` | `false` | Deshabilita los controles (`aria-disabled`). |
| `labelRowsPerPage`, `labelAll`, `labelOf`, `labelMoreThan` | `string` | i18n | Textos. |
| `labelDisplayedRows` | `({ from, to, count, page }) => ReactNode` | — | Texto completo del rango. |
| `getItemAriaLabel` | `(type) => string` | i18n | Nombre accesible de cada botón. |
| `locale` | `string` | contexto | Idioma de los textos. |

### Props de TableToolbar

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `ReactNode` | — | Título sin selección. |
| `numSelected` | `number` | `0` | Filas seleccionadas (resaltado y contador vivo). |
| `selectedText` | `string` | i18n | Texto propio del contador con `{0}`. |
| `actions` | `ReactNode` | — | Acciones sin selección. |
| `selectedActions` | `ReactNode` | — | Acciones en lote con selección. |
| `locale` | `string` | contexto | Idioma de los textos. |

### useTableSelection

`useTableSelection(rows, getId, { selected, defaultSelected, onSelectionChange, isRowSelectable, isRowDisabled, getRowLabel, selectOnClick, pruneMissing, locale })` devuelve `selected`, `numSelected`, `selectedRows`, `allSelected`, `someSelected`, `isSelected(rowOrId)`, `canSelect(row)`, `toggleRow(rowOrId, force?)`, `selectAll()`, `clearSelection()`, `setSelected(ids)`, `getHeaderCheckboxProps()`, `getRowCheckboxProps(row)` y `getRowProps(row)`. `onSelectionChange(selected, { selected, rows, count, reason })` equivale a `mtx:table:selection-change` (`reason` es `'user'` o `'api'`).

### Helpers de datos

`sortRows(rows, comparator)` (estable), `getComparator(direction, key, locale?)`, `compareValues(a, b, locale?)`, `paginateRows(rows, page, rowsPerPage)` y `useTableSort({ defaultOrderBy, defaultOrder, onSortChange })`.

### Callbacks

| Callback | Evento vanilla | Se dispara cuando |
| :--- | :--- | :--- |
| `TableSortLabel` `onSort(event, { direction, active, key })` | `mtx:table:sort` | Se pulsa la etiqueta (o Enter/Espacio); `direction` es la solicitada. |
| `TablePagination` `onPageChange(event, page, { previousPage, reason })` | `mtx:table:page-change` | Un botón de navegación cambia la página (`reason`: `firstPage`, `previousPage`, `nextPage`, `lastPage`). |
| `TablePagination` `onRowsPerPageChange(event, rowsPerPage, { previousRowsPerPage, page })` | `mtx:table:rows-per-page-change` | Cambia el selector de filas por página. |
| `useTableSelection` `onSelectionChange(selected, { selected, rows, count, reason })` | `mtx:table:selection-change` | Cambia la selección por interacción (`'user'`) o por API (`'api'`). |

{{< callout type="info" title="Filas por página y página actual" >}}
Al cambiar las filas por página, la página vuelve a 0 **sin** llamar a `onPageChange` (igual que vanilla: el detalle del evento lleva `page: 0`). En modo controlado, resetea tú la página en `onRowsPerPageChange`: `onRowsPerPageChange={(e, n) => { setRowsPerPage(n); setPage(0); }}`.
{{< /callout >}}

### Clases CSS

| Clase | Descripción |
| :--- | :--- |
| `mtx-table-container`, `--scroll`, `--sticky` | Contenedor. |
| `mtx-table`, `--small`, `--sticky-header`, `--hover`, `--selectable` | Tabla. |
| `mtx-table-head`, `mtx-table-body`, `mtx-table-footer`, `mtx-table-caption` | Secciones y leyenda. |
| `mtx-table-row`, `--hover`, `--selected` | Fila. |
| `mtx-table-cell`, `--left`, `--center`, `--right`, `--justify`, `--numeric`, `--padding-checkbox`, `--padding-none` | Celda. |
| `mtx-table-sort-label`, `--active`, `--desc`, `__icon` | Etiqueta de orden. |
| `mtx-table-pagination`, `__toolbar`, `__select-label`, `__select`, `__displayed-rows`, `__actions`, `__button` | Paginación. |
| `mtx-table-toolbar`, `--highlight`, `__title`, `__count`, `__actions` | Barra de herramientas. |

## Equivalencia con vanilla

| Vanilla | React |
| :--- | :--- |
| `<table data-mtx="table">` con `<thead>`/`<tbody>`/`<tr>`/`<td>` simples (estilizados por descendencia y un `MutationObserver`) | `Table`, `TableHead`, `TableBody`, `TableRow` y `TableCell` (el DOM se pinta con sus clases desde el principio) |
| `data-size="small"` / `data-dense`, `data-hover`, `data-sticky-header` | `size="small"`, `hover`, `stickyHeader` |
| `table-container` con `data-max-height`, `data-sticky-header` | `TableContainer` con `maxHeight`, `stickyHeader` |
| `data-align`, `data-padding` en celdas | `align` / `numeric`, `padding` |
| `table-row` con `data-selected` / `data-hover` | `TableRow` con `selected` / `hover` |
| `data-selectable`: la tabla **inyecta** una columna de casillas y lee `data-id`, `data-selected` y `data-no-select` | La columna de casillas **la pintas tú** con `useTableSelection(rows, getId)` y [Checkbox](../checkbox/): `getHeaderCheckboxProps()`, `getRowCheckboxProps(row)`, `getRowProps(row)`; `defaultSelected`, `isRowSelectable` |
| `data-select-on-click` | `selectOnClick` (hook) + `selectOnClick` (Table, cursor) |
| getter/setter `selected`, `isSelected()`, `toggleRow()`, `selectAll()`, `clearSelection()`, `getSelectedRows()` | `selected`, `setSelected(ids)`, `isSelected()`, `toggleRow()`, `selectAll()`, `clearSelection()`, `selectedRows` |
| `table-sort-label` se alterna sola, mantiene una sola columna activa y emite `mtx:table:sort`; `data-disable-auto-toggle` deja el estado a la página | `TableSortLabel` es siempre **controlada** (`active`, `direction`, `onSort`), como vanilla con `data-disable-auto-toggle`; `useTableSort()` da el comportamiento automático (una columna activa, alternancia asc/desc) |
| `data-key`, `data-direction`, `data-active`, `data-disabled` | `sortKey`, `direction`, `active`, `disabled` |
| `table-pagination` con `data-table="#id"` oculta las filas de una **tabla del DOM** (paginación local) | Basada en datos: corta las filas con `paginateRows(rows, page, rowsPerPage)` y pasa `count={rows.length}` |
| `data-count`, `data-page`, `data-rows-per-page`, `data-rows-per-page-options`, `data-show-first-button`, `data-show-last-button` | `count`, `page`/`defaultPage`, `rowsPerPage`/`defaultRowsPerPage`, `rowsPerPageOptions`, `showFirstButton`, `showLastButton` |
| setters `page`, `rowsPerPage`, `count`, `firstPage()`, `previousPage()`, `nextPage()`, `lastPage()`, `update()` | Props controladas `page`, `rowsPerPage` y `count` (estado del padre) |
| `disable()` / `enable()`, `data-disabled` | `disabled` |
| `data-label-rows-per-page`, `data-label-all`, `data-label-of`, `data-label-more-than`, `data-label-first`… | `labelRowsPerPage`, `labelAll`, `labelOf`, `labelMoreThan`, `getItemAriaLabel` |
| `table-toolbar` con `data-table="#id"` sigue a la tabla mediante `mtx:table:selection-change`; `data-count`, `data-title`, `data-selected-text`, hijos con `data-show="default"` / `"selected"` | `TableToolbar` con `numSelected={selection.numSelected}`, `title`, `selectedText`, `actions` y `selectedActions` |
| setter `count` de la toolbar | prop `numSelected` |
| `refresh()`, `destroy()` | No hacen falta: React vuelve a pintar y limpia |

La receta "tabla de datos" de vanilla (filas pintadas desde un array, toolbar vinculada con `data-table`, paginación de la tabla del DOM) queda en React así: guarda `rows` en el estado, deriva la lista filtrada, ordenada (`sortRows`) y paginada (`paginateRows`), pasa las filas visibles a `useTableSelection` y `selection.numSelected` a `TableToolbar`. Mira el [ejemplo real](#ejemplo-real).

## Teclado

| Tecla | Acción |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Mayús</kbd>+<kbd>Tab</kbd> | Recorre la región con scroll (si desplaza), las etiquetas de orden, las casillas de selección, los controles de las filas, el selector de filas por página y los botones de paginación. |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | En un `TableSortLabel`, pide el orden siguiente. |
| <kbd>Espacio</kbd> | En una casilla, alterna la fila (o todas desde la cabecera). |
| <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> | Con la región enfocada, desplaza la tabla; en el selector de filas por página, cambia la opción. |

## Accesibilidad

- `<table>` semántico con cabeceras `<th scope="col">` y cabeceras de fila `<th scope="row">`; da nombre a la tabla con `aria-label` o `TableCaption`.
- Un `TableContainer` con scroll es una región enfocable y con nombre para que el teclado pueda desplazarlo (WCAG 2.1.1).
- `TableSortLabel` es un `<button>` nativo (Tab, Enter, Espacio) y la columna activa publica `aria-sort`.
- Las casillas de selección tienen nombres traducidos ("Seleccionar todas las filas", "Seleccionar {fila}"), la de cabecera informa `aria-checked="mixed"` y las filas publican `aria-selected`.
- `TableToolbar` es un `role="toolbar"` y anuncia el contador con `aria-live="polite"`; `TablePagination` anuncia el rango mostrado.
