---
title: "Table"
description: "Displays data sets in rows and columns on a semantic HTML table, with density, sticky header, sorting, selection and pagination."
group: "data-display"
icon: "table_chart"
weight: 60
example: "table"
import: "Table, TableContainer, TableHead, TableBody, TableFooter, TableRow, TableCell, TableCaption, TableSortLabel, TablePagination, TableToolbar, useTableSelection, useTableSort"
mui: "https://mui.com/material-ui/react-table/"
---

**Table** implements MUI's table family on a semantic `<table>`: `TableContainer`, `TableHead`, `TableBody`, `TableFooter`, `TableRow` and `TableCell`, plus the interactive pieces `TableSortLabel`, `TablePagination` and `TableToolbar`. Row selection is data-driven with the `useTableSelection` hook and the existing [Checkbox](../checkbox/). Use it for multi-column data that users compare or scan. For a single column of items use [List](../list/); for summary cards use [Card](../card/).

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@rubenchodev/materix-react';

<TableContainer>
  <Table aria-label="Inventory">
    <TableHead>
      <TableRow><TableCell>Product</TableCell><TableCell align="right">Stock</TableCell></TableRow>
    </TableHead>
    <TableBody>
      <TableRow><TableCell>Keyboard</TableCell><TableCell align="right">12</TableCell></TableRow>
    </TableBody>
  </Table>
</TableContainer>
```

## Anatomy

- **TableContainer**: `<div class="mtx-table-container">` that scrolls horizontally (and vertically with `maxHeight`).
- **Table**: `<table class="mtx-table">`; shares `size`, `padding`, `hover` and `selectable` with its children through context.
- **TableHead / TableBody / TableFooter**: `<thead>`, `<tbody>` and `<tfoot>`. Cells inside `TableHead` render as `<th scope="col">`.
- **TableRow / TableCell**: `<tr class="mtx-table-row">` and `<th>`/`<td class="mtx-table-cell">`.
- **TableCaption**: `<caption class="mtx-table-caption">`, shown below the table.

## Basic usage

{{< react-demo id="table/01-basic" layout="block" >}}

## Numeric alignment

Right-align numeric columns with `align="right"` on the header and the body cells, or with `numeric`.

{{< react-demo id="table/02-alignment" layout="block" >}}

## Sizes

`size="medium"` (16px padding, default) or `size="small"` (6px vertical padding, `mtx-table--small`). A single `TableCell` also accepts `size`.

{{< react-demo id="table/03-sizes" layout="block" >}}

## Row states

`hover` on `Table` highlights the body rows (header and footer rows are not affected); `hover` on a `TableRow` highlights only that row. `selected` adds `mtx-table-row--selected` and `aria-selected="true"`.

{{< react-demo id="table/04-row-states" layout="block" >}}

## Sticky header

`stickyHeader` on `TableContainer` (or `Table`) keeps the header visible and `maxHeight` (number in px or any CSS value) limits the height. While the container scrolls it becomes a focusable region (`tabindex="0"`, `role="region"`) named by the caption, the table's `aria-labelledby`/`aria-label` or a translated fallback; a `ResizeObserver` keeps it in sync, as in vanilla.

{{< react-demo id="table/05-sticky-header" layout="block" >}}

## Footer and caption

{{< react-demo id="table/06-footer-caption" layout="block" >}}

## Sorting

`TableSortLabel` is controlled: `active` and `direction` describe the current order and `onSort(event, { direction, active, key })` reports the requested one (the equivalent of `mtx:table:sort`). The parent `<th>` gets `aria-sort` automatically. `useTableSort()` keeps a single active column and `sortRows` + `getComparator` sort the data with a stable sort. In right-aligned columns the arrow is placed on the left.

{{< react-demo id="table/07-sorting" layout="block" >}}

```tsx
const sort = useTableSort<'name' | 'kcal'>({ defaultOrderBy: 'name' });
const rows = sortRows(data, getComparator(sort.order, sort.orderBy ?? 'name'));

<TableCell><TableSortLabel {...sort.getSortLabelProps('name')}>Dessert</TableSortLabel></TableCell>
```

## Selection

`useTableSelection(rows, getId, options)` reproduces vanilla's `data-selectable`: the header checkbox selects every selectable, enabled row and turns indeterminate with a partial selection; rows get `aria-selected`; the selection is stored by id, so it survives sorting, filtering and pagination. `isRowSelectable` excludes a row (`data-no-select`), `isRowDisabled` disables its checkbox and `selectOnClick` toggles a row when clicking outside its controls.

By default the keys of rows that are no longer in `rows` are kept, so `numSelected` and the toolbar still count them. When `rows` is the **whole data set** and rows can be deleted (or reloaded from the server), pass `pruneMissing: true` to drop those keys automatically (it calls `onSelectionChange` with `reason: 'api'`). Do not use it when `rows` is only the filtered or current page, or the selection would be lost on filtering or paging.

{{< react-demo id="table/08-selection" layout="block" >}}

```tsx
const selection = useTableSelection(rows, (row) => row.id, { getRowLabel: (row) => row.name });

<Table selectable aria-label="Team">
  <TableHead>
    <TableRow>
      <TableCell padding="checkbox"><Checkbox {...selection.getHeaderCheckboxProps()} /></TableCell>
      <TableCell>Name</TableCell>
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

## Toolbar

`TableToolbar` (MUI's `EnhancedTableToolbar`) shows the `title` and the `actions` with no selection; with `numSelected > 0` it is highlighted, announces the count in a live region and shows the `selectedActions`.

{{< react-demo id="table/09-toolbar" layout="block" >}}

## Pagination

`TablePagination` renders the native rows-per-page select, the displayed range (live region) and the navigation buttons. It can be controlled (`page`, `rowsPerPage`) or uncontrolled (`defaultPage`, `defaultRowsPerPage`); `-1` in `rowsPerPageOptions` means "All" and `count={-1}` an unknown total. Slice the data with `paginateRows(rows, page, rowsPerPage)`.

{{< react-demo id="table/10-pagination" layout="block" >}}

## Custom cells

{{< react-demo id="table/11-custom-cells" layout="block" >}}

## Real-world example

A data table with a customer search ([TextField](../text-field/)), bulk delete, selection, sorting, status chips ([Chip](../chip/)) and local pagination.

{{< react-demo id="table/12-data-table" layout="block" >}}

## Grid layout

{{< react-demo id="table/13-grid" layout="block" >}}

## Programmatic usage

{{< react-demo id="table/14-programmatic" layout="block" >}}

## API reference

### Table props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `'medium' \| 'small'` | `'medium'` | Density (`mtx-table--small`). |
| `padding` | `'normal' \| 'checkbox' \| 'none'` | `'normal'` | Default padding of the cells. |
| `stickyHeader` | `boolean` | `false` | Sticky header (`mtx-table--sticky-header`). |
| `hover` | `boolean` | `false` | Highlights body rows on hover. |
| `selectable` | `boolean` | `false` | Selectable table: rows publish `aria-selected` (`"true"` / `"false"`). |
| `selectOnClick` | `boolean` | `false` | Pointer cursor on selectable rows (`data-select-on-click`). |

### TableContainer props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `maxHeight` | `number \| string` | — | Maximum height; enables vertical scroll (`mtx-table-container--scroll`). |
| `stickyHeader` | `boolean` | `false` | Sticky header for the inner table. |
| `locale` | `string` | context | Language of the fallback region name. |

### TableRow props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `hover` | `boolean` | `false` | Highlights the row on hover. |
| `selected` | `boolean` | — | Selected row (`mtx-table-row--selected`, `aria-selected`). |

### TableCell props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `align` | `'inherit' \| 'left' \| 'center' \| 'right' \| 'justify'` | `'inherit'` | Text alignment (`mtx-table-cell--{align}`). |
| `numeric` | `boolean` | `false` | Right-aligned numeric column (`mtx-table-cell--numeric`). |
| `padding` | `'normal' \| 'checkbox' \| 'none'` | table | Cell padding. |
| `size` | `'medium' \| 'small'` | table | Density of this cell. |
| `variant` | `'head' \| 'body' \| 'footer'` | section | Variant; inferred from the parent section. |
| `sortDirection` | `'asc' \| 'desc' \| false` | — | Publishes `aria-sort`. |
| `component` | `'th' \| 'td'` | `th` in head | Rendered element. |
| `scope` | `string` | `col`/`row` | `col` for header `<th>`, `row` for body `<th>`. |

### TableSortLabel props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `active` | `boolean` | `false` | Active column. |
| `direction` | `'asc' \| 'desc'` | `'asc'` | Shown direction. |
| `sortKey` | `string` | — | Column key returned in `onSort`. |
| `onSort` | `(event, { direction, active, key }) => void` | — | Requests a new order (`mtx:table:sort`). |
| `icon` | `ReactNode` | arrow | Custom icon. |
| `hideSortIcon` | `boolean` | `false` | Hides the icon while inactive. |
| `disabled` | `boolean` | `false` | Disables the label. |

### TablePagination props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `count` | `number` | `0` | Total rows; `-1` if unknown. |
| `page` / `defaultPage` | `number` | `0` | Current page, 0-based. |
| `rowsPerPage` / `defaultRowsPerPage` | `number` | `10` | Rows per page; `-1` shows all. |
| `rowsPerPageOptions` | `number[]` | `[10, 25, 50, 100]` | Select options. |
| `onPageChange` | `(event, page, { previousPage, reason }) => void` | — | `mtx:table:page-change`. |
| `onRowsPerPageChange` | `(event, rowsPerPage, { previousRowsPerPage, page }) => void` | — | `mtx:table:rows-per-page-change`; the page goes back to 0. |
| `showFirstButton` / `showLastButton` | `boolean` | `false` | First / last page buttons. |
| `disabled` | `boolean` | `false` | Disables the controls (`aria-disabled`). |
| `labelRowsPerPage`, `labelAll`, `labelOf`, `labelMoreThan` | `string` | i18n | Texts. |
| `labelDisplayedRows` | `({ from, to, count, page }) => ReactNode` | — | Full range text. |
| `getItemAriaLabel` | `(type) => string` | i18n | Accessible name of each button. |
| `locale` | `string` | context | Language of the texts. |

### TableToolbar props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `ReactNode` | — | Title shown with no selection. |
| `numSelected` | `number` | `0` | Selected rows (highlight and live count). |
| `selectedText` | `string` | i18n | Custom count text with `{0}`. |
| `actions` | `ReactNode` | — | Actions shown with no selection. |
| `selectedActions` | `ReactNode` | — | Bulk actions shown with a selection. |
| `locale` | `string` | context | Language of the texts. |

### useTableSelection

`useTableSelection(rows, getId, { selected, defaultSelected, onSelectionChange, isRowSelectable, isRowDisabled, getRowLabel, selectOnClick, pruneMissing, locale })` returns `selected`, `numSelected`, `selectedRows`, `allSelected`, `someSelected`, `isSelected(rowOrId)`, `canSelect(row)`, `toggleRow(rowOrId, force?)`, `selectAll()`, `clearSelection()`, `setSelected(ids)`, `getHeaderCheckboxProps()`, `getRowCheckboxProps(row)` and `getRowProps(row)`. `onSelectionChange(selected, { selected, rows, count, reason })` is the equivalent of `mtx:table:selection-change` (`reason` is `'user'` or `'api'`).

### Data helpers

`sortRows(rows, comparator)` (stable), `getComparator(direction, key, locale?)`, `compareValues(a, b, locale?)`, `paginateRows(rows, page, rowsPerPage)` and `useTableSort({ defaultOrderBy, defaultOrder, onSortChange })`.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-table-container`, `--scroll`, `--sticky` | Container. |
| `mtx-table`, `--small`, `--sticky-header`, `--hover`, `--selectable` | Table. |
| `mtx-table-head`, `mtx-table-body`, `mtx-table-footer`, `mtx-table-caption` | Sections and caption. |
| `mtx-table-row`, `--hover`, `--selected` | Row. |
| `mtx-table-cell`, `--left`, `--center`, `--right`, `--justify`, `--numeric`, `--padding-checkbox`, `--padding-none` | Cell. |
| `mtx-table-sort-label`, `--active`, `--desc`, `__icon` | Sort label. |
| `mtx-table-pagination`, `__toolbar`, `__select-label`, `__select`, `__displayed-rows`, `__actions`, `__button` | Pagination. |
| `mtx-table-toolbar`, `--highlight`, `__title`, `__count`, `__actions` | Toolbar. |

## Accessibility

- Semantic `<table>` with `<th scope="col">` headers and `<th scope="row">` row headers; give the table a name with `aria-label` or `TableCaption`.
- A scrolling `TableContainer` is a focusable, named region so keyboard users can scroll it (WCAG 2.1.1).
- `TableSortLabel` is a native `<button>` (Tab, Enter, Space) and the active column publishes `aria-sort`.
- Selection checkboxes have translated names ("Select all rows", "Select {row}"), the header checkbox reports `aria-checked="mixed"` and rows publish `aria-selected`.
- `TableToolbar` is a `role="toolbar"` and announces the selected count with `aria-live="polite"`; `TablePagination` announces the displayed range.
