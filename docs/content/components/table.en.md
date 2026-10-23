---
title: "Table"
description: "Displays data sets in rows and columns on a semantic HTML table, with density, sticky header, sorting, selection and pagination."
group: "data-display"
icon: "table_chart"
weight: 60
example: "table"
mui: "https://mui.com/material-ui/react-table/"
---

`Table` styles a regular HTML `<table>` with the MUI look and adds optional interactive pieces: row selection (`data-selectable`), a toolbar (`table-toolbar`), sort labels (`table-sort-label`) and pagination (`table-pagination`). Styles apply by descendant selectors and a `MutationObserver` also decorates rows added after initialization. Use it for multi-column data that users compare or scan. For a single column of items use [List](../list/); for summary cards use [Card](../card/).

## Basic usage

Write a standard HTML table with `data-mtx="table"`: the component adds the classes to `thead`, `tbody`, `tfoot`, rows and cells, and sets `scope="col"` on the header cells. Wrap it in `data-mtx="table-container"` so it scrolls horizontally inside its box on narrow screens.

{{< mtx-demo title="Basic table" layout="block" >}}
<div data-mtx="table-container">
  <table data-mtx="table">
    <thead>
      <tr>
        <th>Product</th>
        <th>Category</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Laptop Pro 16"</td><td>Computers</td><td>In stock</td></tr>
      <tr><td>Mechanical keyboard</td><td>Accessories</td><td>In stock</td></tr>
      <tr><td>4K monitor 27"</td><td>Displays</td><td>Out of stock</td></tr>
    </tbody>
  </table>
</div>
{{< /mtx-demo >}}

## Numeric alignment

Right-align numeric columns so figures can be compared at a glance: `data-align="right"` (also `center`, `left`, `justify` or `numeric`) on the cell is enough; no `data-mtx` is needed on each cell.

{{< mtx-demo title="Numeric columns" layout="block" >}}
<div data-mtx="table-container">
  <table data-mtx="table">
    <thead>
      <tr>
        <th>Dessert (100 g)</th>
        <th data-align="right">Calories</th>
        <th data-align="right">Fat (g)</th>
        <th data-align="right">Protein (g)</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Frozen yoghurt</td><td data-align="right">159</td><td data-align="right">6.0</td><td data-align="right">4.0</td></tr>
      <tr><td>Ice cream sandwich</td><td data-align="right">237</td><td data-align="right">9.0</td><td data-align="right">4.3</td></tr>
      <tr><td>Cupcake</td><td data-align="right">305</td><td data-align="right">3.7</td><td data-align="right">4.3</td></tr>
    </tbody>
  </table>
</div>
{{< /mtx-demo >}}

## Sizes

`data-size="small"` (or `data-dense`) reduces the vertical cell padding from 16px to 6px, for tables with many rows.

{{< mtx-demo title="Dense" layout="block" >}}
<div data-mtx="table-container">
  <table data-mtx="table" data-size="small">
    <thead>
      <tr><th>User</th><th>Role</th><th data-align="right">Logins</th></tr>
    </thead>
    <tbody>
      <tr><td>Ana Garcia</td><td>Administrator</td><td data-align="right">128</td></tr>
      <tr><td>Luis Perez</td><td>Editor</td><td data-align="right">57</td></tr>
      <tr><td>Maria Torres</td><td>Viewer</td><td data-align="right">12</td></tr>
    </tbody>
  </table>
</div>
{{< /mtx-demo >}}

## Row states

`data-hover` on the table highlights the row under the pointer. `data-selected` on a `table-row` marks it as selected (primary background at 8% and `aria-selected="true"`).

{{< mtx-demo title="Hover and selected row" layout="block" >}}
<div data-mtx="table-container">
  <table data-mtx="table" data-hover>
    <thead>
      <tr><th>Order</th><th>Customer</th><th data-align="right">Amount</th></tr>
    </thead>
    <tbody>
      <tr><td>#1001</td><td>Ana Garcia</td><td data-align="right">$120.00</td></tr>
      <tr data-mtx="table-row" data-selected><td>#1002</td><td>Luis Perez</td><td data-align="right">$89.50</td></tr>
      <tr><td>#1003</td><td>Maria Torres</td><td data-align="right">$42.90</td></tr>
    </tbody>
  </table>
</div>
{{< /mtx-demo >}}

## Sticky header

`data-sticky-header` (on the container or the table) keeps the header row fixed while scrolling, like MUI's `stickyHeader`. `data-max-height` on the container limits its height (number = px, or any CSS length) and enables internal scrolling.

{{< mtx-demo title="Sticky header" layout="block" >}}
<div data-mtx="table-container" data-sticky-header data-max-height="220">
  <table data-mtx="table" data-size="small">
    <thead>
      <tr><th>City</th><th data-align="right">Population</th></tr>
    </thead>
    <tbody>
      <tr><td>Tokyo</td><td data-align="right">13,960,000</td></tr>
      <tr><td>London</td><td data-align="right">8,982,000</td></tr>
      <tr><td>New York</td><td data-align="right">8,336,000</td></tr>
      <tr><td>Madrid</td><td data-align="right">3,332,000</td></tr>
      <tr><td>Berlin</td><td data-align="right">3,645,000</td></tr>
      <tr><td>Rome</td><td data-align="right">2,873,000</td></tr>
      <tr><td>Paris</td><td data-align="right">2,161,000</td></tr>
      <tr><td>Vienna</td><td data-align="right">1,897,000</td></tr>
      <tr><td>Lisbon</td><td data-align="right">545,000</td></tr>
    </tbody>
  </table>
</div>
{{< /mtx-demo >}}

## Footer and caption

A `<tfoot>` gets totals styling (secondary text on a subtle background). A `<caption>` is shown as a legend below the table and gets the `mtx-table-caption` class automatically; it also gives the table its accessible name.

{{< mtx-demo title="Totals and caption" layout="block" >}}
<div data-mtx="table-container">
  <table data-mtx="table">
    <caption>First-quarter sales, in thousands of dollars.</caption>
    <thead>
      <tr><th>Month</th><th data-align="right">Sales</th></tr>
    </thead>
    <tbody>
      <tr><td>January</td><td data-align="right">42.1</td></tr>
      <tr><td>February</td><td data-align="right">38.7</td></tr>
      <tr><td>March</td><td data-align="right">51.3</td></tr>
    </tbody>
    <tfoot>
      <tr><td>Total</td><td data-align="right">132.1</td></tr>
    </tfoot>
  </table>
</div>
{{< /mtx-demo >}}

## Sorting

Put a `<button data-mtx="table-sort-label">` inside the header. Clicking it toggles the arrow between ascending and descending, **deactivates the other labels in the same header** (a single active column, as in MUI), sets `aria-sort` on its `<th>` (removing it from the others) and emits `mtx:table:sort` with `{ direction, active, key }`. In right-aligned columns the arrow is placed to the left of the text. **The component does not reorder rows**: do it yourself when you receive the event.

{{< mtx-demo title="Sort by column" layout="block" >}}
<div data-mtx="table-container">
  <table id="doc-sort-table" data-mtx="table">
    <thead>
      <tr>
        <th><button data-mtx="table-sort-label" data-key="name" data-active>Dessert</button></th>
        <th data-align="right"><button data-mtx="table-sort-label" data-key="kcal">Calories</button></th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Donut</td><td data-align="right">452</td></tr>
      <tr><td>Eclair</td><td data-align="right">262</td></tr>
      <tr><td>Cupcake</td><td data-align="right">305</td></tr>
      <tr><td>Frozen yoghurt</td><td data-align="right">159</td></tr>
    </tbody>
  </table>
</div>
{{< /mtx-demo >}}

```javascript
const table = document.getElementById('doc-sort-table');
table.addEventListener('mtx:table:sort', (event) => {
  const { key, direction } = event.detail;
  const column = key === 'kcal' ? 1 : 0;
  const body = table.tBodies[0];
  const rows = [...body.rows].sort((a, b) => {
    const x = a.cells[column].textContent;
    const y = b.cells[column].textContent;
    const cmp = column === 1 ? Number(x) - Number(y) : x.localeCompare(y, 'en');
    return direction === 'asc' ? cmp : -cmp;
  });
  body.append(...rows);
});
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('doc-sort-table');
  table.addEventListener('mtx:table:sort', (event) => {
    const { key, direction } = event.detail;
    const column = key === 'kcal' ? 1 : 0;
    const body = table.tBodies[0];
    const rows = [...body.rows].sort((a, b) => {
      const x = a.cells[column].textContent;
      const y = b.cells[column].textContent;
      const cmp = column === 1 ? Number(x) - Number(y) : x.localeCompare(y, 'en');
      return direction === 'asc' ? cmp : -cmp;
    });
    body.append(...rows);
  });
});
</script>

## Selection

`data-selectable` on the table enables built-in selection (MUI's *EnhancedTable* pattern): a checkbox column is added, the header checkbox selects or deselects every enabled row and becomes indeterminate on partial selection, and selected rows get `mtx-table-row--selected`. Each row is identified by `data-id` (an internal key is generated when missing) and the selection survives re-rendering the rows. With `data-select-on-click`, clicking anywhere on the row that is not a control also toggles it. The table emits `mtx:table:selection-change` with `{ selected, rows, count, reason }`.

{{< mtx-demo title="Selectable rows" layout="block" >}}
<div data-mtx="table-container">
  <table data-mtx="table" data-selectable data-select-on-click data-hover aria-label="Team">
    <thead>
      <tr><th>Name</th><th data-align="right">Age</th></tr>
    </thead>
    <tbody>
      <tr data-id="ana"><td>Ana García</td><td data-align="right">32</td></tr>
      <tr data-id="luis" data-selected><td>Luis Pérez</td><td data-align="right">41</td></tr>
      <tr data-id="maria"><td>María Torres</td><td data-align="right">27</td></tr>
    </tbody>
  </table>
</div>
{{< /mtx-demo >}}

- `data-selected` on a row marks it as selected the first time the table sees it.
- If you already write your own checkboxes in `data-padding="checkbox"` cells (first cell of the row), the table reuses them instead of creating new ones; a `disabled` checkbox excludes the row from "select all".
- `data-no-select` on a `<tr>` leaves it out of the selection (useful for system or locked rows: it gets an empty checkbox cell so the columns stay aligned; a "no results" row with a single `colspan` cell gets its `colspan` widened instead).
- Accessible names are generated and translated: "Select all rows" and "Select {first cell}" (or the row's `data-label`).

## Toolbar

`data-mtx="table-toolbar"` is the bar above the table (MUI's *EnhancedTableToolbar*). With `data-table="#id"` it follows the selection: with no selected rows it shows the title (`data-title`) and the `data-show="default"` children; with a selection it is highlighted (`mtx-table-toolbar--highlight`, primary at 12%), replaces the title with the "N selected" counter (an `aria-live="polite"` region) and shows the `data-show="selected"` children. It has `role="toolbar"` and takes its name from the title.

{{< mtx-demo title="Toolbar with bulk actions" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <div data-mtx="table-toolbar" data-table="#doc-toolbar-table" data-title="Nutrition">
    <div class="mtx-table-toolbar__actions" data-show="default">
      <button data-mtx="icon-button" data-icon="filter_list" aria-label="Filter list"></button>
    </div>
    <div class="mtx-table-toolbar__actions" data-show="selected">
      <button data-mtx="icon-button" data-icon="delete" aria-label="Delete selected"></button>
    </div>
  </div>
  <div data-mtx="table-container">
    <table id="doc-toolbar-table" data-mtx="table" data-selectable data-select-on-click data-hover aria-label="Nutrition">
      <thead>
        <tr><th>Dessert (100 g)</th><th data-align="right">Calories</th></tr>
      </thead>
      <tbody>
        <tr data-id="cupcake"><td>Cupcake</td><td data-align="right">305</td></tr>
        <tr data-id="donut" data-selected><td>Donut</td><td data-align="right">452</td></tr>
        <tr data-id="eclair"><td>Eclair</td><td data-align="right">262</td></tr>
      </tbody>
    </table>
  </div>
</div>
{{< /mtx-demo >}}

Without `data-table`, the toolbar looks for a table inside its own parent container; you can also set the counter manually with `toolbar.count = n`. For custom text use `data-selected-text="{0} users selected"`.

## Pagination

`data-mtx="table-pagination"` builds the rows-per-page selector, the visible range and the navigation buttons. With `data-table="#selector"` it paginates the rows of the given `<tbody>` on its own; without it, it works with `data-count` and you load the data when you receive `mtx:table:page-change`. Its texts are translated using the active locale.

{{< mtx-demo title="Local pagination" layout="block" >}}
<div data-mtx="table-container">
  <table id="doc-paged-table" data-mtx="table" data-size="small">
    <thead>
      <tr><th>Code</th><th>Country</th></tr>
    </thead>
    <tbody>
      <tr><td>AR</td><td>Argentina</td></tr>
      <tr><td>BO</td><td>Bolivia</td></tr>
      <tr><td>CL</td><td>Chile</td></tr>
      <tr><td>CO</td><td>Colombia</td></tr>
      <tr><td>EC</td><td>Ecuador</td></tr>
      <tr><td>ES</td><td>Spain</td></tr>
      <tr><td>MX</td><td>Mexico</td></tr>
      <tr><td>PE</td><td>Peru</td></tr>
    </tbody>
  </table>
</div>
<div data-mtx="table-pagination" data-table="#doc-paged-table" data-rows-per-page="3" data-rows-per-page-options="3,5,-1" data-show-first-button data-show-last-button></div>
{{< /mtx-demo >}}

## Real-world examples

A complete "data table": Paper + toolbar + selectable table with sorting + pagination. **Selection, the counter and local pagination are handled by Materix; you only keep the data, the sort order and the filter** and re-render the `<tbody>`. New rows are styled and get their checkbox automatically, and the selection is kept by `data-id`. The working example is in `/examples/table` ("Data table" section).

```html
<div data-mtx="paper" data-variant="outlined">
  <div data-mtx="table-toolbar" data-table="#orders" data-title="Orders">
    <div class="mtx-table-toolbar__actions" data-show="default">
      <input id="search" data-mtx="text-field" data-label="Search customer" data-size="small" data-start-icon="search" type="search">
    </div>
    <div class="mtx-table-toolbar__actions" data-show="selected">
      <button id="delete" class="mtx-button mtx-button--text mtx-button--error" data-mtx="button">Delete</button>
    </div>
  </div>
  <div data-mtx="table-container">
    <table id="orders" data-mtx="table" data-selectable data-hover aria-label="Orders">
      <thead>
        <tr>
          <th><button data-mtx="table-sort-label" data-key="client" data-active>Customer</button></th>
          <th data-align="right"><button data-mtx="table-sort-label" data-key="total">Amount</button></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  <div id="pager" data-mtx="table-pagination" data-table="#orders" data-rows-per-page="5"></div>
</div>
```

```javascript
document.addEventListener('DOMContentLoaded', () => {
  let orders = [/* { id, client, total } */];
  let sort = { key: 'client', direction: 'asc' };
  let query = '';
  const table = document.getElementById('orders');
  const api = Materix.getInstance(table);
  const pager = Materix.getInstance(document.getElementById('pager'));

  const render = () => {
    const factor = sort.direction === 'asc' ? 1 : -1;
    const rows = orders
      .filter((o) => o.client.toLowerCase().includes(query))
      .sort((a, b) => factor * (sort.key === 'total' ? a.total - b.total : a.client.localeCompare(b.client)));
    table.tBodies[0].innerHTML = rows
      .map((o) => `<tr data-id="${o.id}"><td>${o.client}</td><td data-align="right">${o.total}</td></tr>`)
      .join('');
    pager.page = 0;
    pager.update();
  };

  table.addEventListener('mtx:table:sort', (e) => { sort = e.detail; render(); });
  document.getElementById('search').addEventListener('input', (e) => { query = e.target.value.toLowerCase(); render(); });
  document.getElementById('delete').addEventListener('click', () => {
    orders = orders.filter((o) => !api.isSelected(o.id));
    api.clearSelection();
    render();
  });
  render();
});
```

With server-side pagination, remove `data-table` from the pagination, use `data-count` and render the page when you receive `mtx:table:page-change`: the selection by `data-id` is kept across pages (the header checkbox reflects only the visible rows).

## Full BEM syntax

Each part has its own `data-mtx` and class, which is useful when the table is rendered on the server.

```html
<div class="mtx-table-container" data-mtx="table-container">
  <table class="mtx-table mtx-table--small" data-mtx="table">
    <thead class="mtx-table-head" data-mtx="table-head">
      <tr class="mtx-table-row" data-mtx="table-row">
        <th class="mtx-table-cell" data-mtx="table-cell" scope="col">Dessert</th>
        <th class="mtx-table-cell mtx-table-cell--right" data-mtx="table-cell" scope="col">Calories</th>
      </tr>
    </thead>
    <tbody class="mtx-table-body" data-mtx="table-body">
      <tr class="mtx-table-row mtx-table-row--selected" data-mtx="table-row" aria-selected="true">
        <td class="mtx-table-cell" data-mtx="table-cell">Cupcake</td>
        <td class="mtx-table-cell mtx-table-cell--right" data-mtx="table-cell">305</td>
      </tr>
    </tbody>
    <tfoot class="mtx-table-footer" data-mtx="table-footer">…</tfoot>
  </table>
</div>
```

The toolbar in BEM (no JavaScript; you control the highlight):

```html
<div class="mtx-table-toolbar mtx-table-toolbar--highlight" role="toolbar" aria-label="Order actions">
  <div class="mtx-table-toolbar__count" aria-live="polite">2 selected</div>
  <div class="mtx-table-toolbar__actions">…</div>
</div>
```

## Programmatic usage

```javascript
// Initialize a dynamically inserted table
Materix.initAll(document.getElementById('report'));

// Selection (table with data-selectable)
const table = Materix.getInstance(document.getElementById('orders'));
table.selected;                 // ['1001', '1004'] (data-id values)
table.selected = ['1002'];      // replaces the selection
table.toggleRow('1003');        // toggles (accepts a key or a <tr>)
table.selectAll();              // every enabled row
table.clearSelection();         // also clears keys of rows no longer in the DOM
table.isSelected('1002');       // true / false
table.getSelectedRows();        // selected <tr> elements present in the DOM
table.refresh();                // re-decorates manually (usually not needed)

document.getElementById('orders').addEventListener('mtx:table:selection-change', (event) => {
  console.log(event.detail); // { selected, rows, count, reason: 'user' | 'api' | 'refresh' }
});

// Toolbar
const toolbar = Materix.getInstance(document.getElementById('orders-toolbar'));
toolbar.count = 3;              // sets the counter without a linked table

// Pagination
const pager = Materix.getInstance(document.getElementById('pager'));
pager.count = 240;          // total (or -1 when unknown)
pager.rowsPerPage = 25;     // goes back to page 0
pager.page = 3;             // zero-based index (no event)
pager.nextPage();           // emits mtx:table:page-change
pager.update();             // recalculates after sorting or adding rows

// Sorting
const sort = Materix.getInstance(document.querySelector('[data-key="total"]'));
sort.direction = 'desc';
sort.active = true;         // updates the <th>'s aria-sort
```

With ES modules:

```javascript
import { Table, TableContainer, TableRow, TableCell, TableSortLabel, TablePagination, TableToolbar } from 'materix-ui';
```

## API reference

### Data attributes

**Table** (`data-mtx="table"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-size` | `small` | normal | Compact cells (6px vertical). |
| `data-dense` | Boolean (presence) | absent | Alias of `data-size="small"`. |
| `data-hover` | Boolean (presence) | absent | Highlights the body row under the pointer (not header or footer). |
| `data-sticky-header` | Boolean (presence) | absent | Sticky header (also on the container). |
| `data-selectable` | Boolean (presence) | absent | Built-in selection with a checkbox column and the `mtx:table:selection-change` event. |
| `data-select-on-click` | Boolean (presence) | absent | With `data-selectable`, clicking the row (outside controls) toggles it. |

**Rows and cells** (any `<tr>`, `<th>` or `<td>` of the table, no `data-mtx` needed)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-id` (on `<tr>`) | Text | internal key | Row identifier in the selection. |
| `data-selected` (on `<tr>`) | Boolean (presence) | absent | Row selected when it appears. |
| `data-no-select` (on `<tr>`) | Boolean (presence) | absent | Excludes the row from the selection (it gets an empty checkbox cell to keep the columns aligned). |
| `data-label` (on `<tr>`) | Text | first cell | Text for its checkbox's accessible name. |
| `data-align` | `left`, `center`, `right`, `justify`, `numeric` | `left` | Text alignment (`numeric` equals `right`). |
| `data-padding` | `checkbox`, `none` | normal | Narrow checkbox cell (48px) or no padding. |
| `data-sort-direction` | `asc`, `desc` | — | Sets `aria-sort` (only with `data-mtx="table-cell"`). |

**TableContainer** (`data-mtx="table-container"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-sticky-header` | Boolean (presence) | absent | Makes the inner table's header sticky. |
| `data-max-height` | Number (px) or CSS length | — | Maximum height with internal scrolling (`mtx-table-container--scroll`). |

**TableRow** (`data-mtx="table-row"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-selected` | Boolean (presence) | absent | Selected row (`aria-selected="true"`). |
| `data-hover` | Boolean (presence) | absent | Hover on this row only. |

**TableToolbar** (`data-mtx="table-toolbar"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-table` | CSS selector | table in the same parent container | Table whose selection it follows. |
| `data-title` | Text | — | Title (`mtx-table-toolbar__title`, h6 typography) and accessible name. |
| `data-selected-text` | Text with `{0}` | i18n ("{0} selected") | Counter text. |
| `data-count` | Integer | `0` | Initial counter without a linked table. |
| `data-show` (on children) | `default`, `selected` | — | Visible only without a selection or only with one. |

**TableSortLabel** (`data-mtx="table-sort-label"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-key` | Text | `null` | Column identifier, sent in the event. |
| `data-active` | Boolean (presence) | absent | Currently sorted column (arrow visible). |
| `data-direction` | `asc`, `desc` | `asc` | Current direction. |
| `data-disable-auto-toggle` | Boolean (presence) | absent | Emits the event without changing direction or state (controlled mode). |
| `data-disabled` | Boolean (presence) | absent | Starts disabled. |

**TablePagination** (`data-mtx="table-pagination"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-table` | CSS selector | — | Table whose `<tbody>` rows are paginated locally. |
| `data-count` | Integer or `-1` | number of rows in `data-table` | Total rows; `-1` = unknown ("more than N"). |
| `data-page` | Integer ≥ 0 | `0` | Initial page (zero-based). |
| `data-rows-per-page` | Integer or `-1` | `10` | Rows per page; `-1` = all. |
| `data-rows-per-page-options` | Comma-separated list | `10,25,50,100` | Selector options (`-1` = "All"). |
| `data-show-first-button` | Boolean (presence) | absent | Shows the first-page button. |
| `data-show-last-button` | Boolean (presence) | absent | Shows the last-page button. |
| `data-disabled` | Boolean (presence) | absent | Starts disabled. |
| `data-label-rows-per-page` | Text | i18n ("Rows per page:") | Selector label. |
| `data-label-of` / `data-label-more-than` | Text | i18n ("of" / "more than") | Texts for the visible range. |
| `data-label-all` | Text | i18n ("All") | Text for the `-1` option. |
| `data-label-first` / `-previous` / `-next` / `-last` | Text | i18n | `aria-label` of each button. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-table-container` | Relative box with `overflow-x: auto`. |
| `mtx-table-container--scroll` | With `data-max-height`: internal vertical scrolling. |
| `mtx-table` | Full-width table, collapsed borders, paper background. Styles `thead`, `tbody`, `tfoot`, `th` and `td` by descendant selectors. |
| `mtx-table--small` / `--dense` | Compact cells. |
| `mtx-table--hover` | Hover on body rows. |
| `mtx-table--sticky-header` | Sticky header (separate borders). |
| `mtx-table--selectable` | Table with built-in selection. |
| `mtx-table-head` / `mtx-table-body` / `mtx-table-footer` | Sections (the footer with a subtle background and secondary text). |
| `mtx-table-row`, `mtx-table-row--hover`, `mtx-table-row--selected` | Row, hover and selected. |
| `mtx-table-cell` | Cell (16px padding, bottom border). |
| `mtx-table-cell--left` / `--center` / `--right` / `--justify` / `--numeric` | Alignment. |
| `mtx-table-cell--padding-checkbox` / `--padding-none` / `--checkbox` | Checkbox cells or no padding. |
| `mtx-table-cell--action` | Right-aligned actions cell. |
| `mtx-table-caption` | Legend below the table (added automatically to `<caption>`). |
| `mtx-table-toolbar`, `--highlight` | Toolbar and its state with a selection. |
| `mtx-table-toolbar__title`, `__count`, `__count--empty`, `__actions`, `__actions--grow`, `__spacer` | Toolbar parts. |
| `mtx-table-sort-label`, `--active`, `--desc`, `__icon` | Sort label, active, descending and arrow (18px SVG). |
| `mtx-table-pagination`, `__toolbar`, `__select-label`, `__select`, `__displayed-rows`, `__actions`, `__button` | Parts of the generated pagination. |

### Methods

**Table**

| Method / property | Returns | Description |
|---|---|---|
| `selected` (get/set) | `string[]` | Selected keys; assigning replaces the selection. |
| `getSelectedRows()` | `HTMLTableRowElement[]` | Selected rows present in the DOM. |
| `isSelected(rowOrKey)` | `boolean` | Whether a row or key is selected. |
| `toggleRow(rowOrKey, force?)` | `void` | Toggles or forces a row's selection. |
| `selectAll()` / `clearSelection()` | `void` | Selects every enabled row / empties the selection. |
| `refresh()` | `void` | Re-decorates rows and cells (done automatically on DOM changes). |
| `destroy()` | `void` | Removes listeners and the observer. Unlinks the instance: `getInstance()` then returns `undefined`. |

**TableToolbar**

| Method / property | Returns | Description |
|---|---|---|
| `count` (get/set) | `number` | Number of selected rows shown. |
| `destroy()` | `void` | Removes the listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |

**TableSortLabel**

| Method / property | Returns | Description |
|---|---|---|
| `active` (get/set) | `boolean` | Active column; updates the `<th>`'s `aria-sort`. |
| `direction` (get/set) | `'asc' \| 'desc'` | Arrow direction. |
| `disabled` (get) | `boolean` | Disabled state. |
| `disable()` / `enable()` | `void` | Disables or enables. |
| `focus()` | `void` | Focuses the label. |
| `destroy()` | `void` | Removes the listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |

**TablePagination**

| Method / property | Returns | Description |
|---|---|---|
| `count` (get/set) | `number` | Total rows (`-1` unknown). |
| `page` (get/set) | `number` | Current page (zero-based); setting it emits no event. |
| `rowsPerPage` (get/set) | `number` | Rows per page; goes back to page 0. |
| `update()` | `void` | Recalculates the range, buttons and visible rows. |
| `firstPage()` / `previousPage()` / `nextPage()` / `lastPage()` | `void` | Navigation; they emit `mtx:table:page-change` if the page changes. |
| `disabled` (get) | `boolean` | Disabled state. |
| `disable()` / `enable()` | `void` | Disables or enables all the controls. |
| `destroy()` | `void` | Removes listeners and shows all rows again. Unlinks the instance: `getInstance()` then returns `undefined`. |

Table, TableContainer, TableHead, TableBody, TableFooter, TableRow and TableCell expose no methods of their own.

### Events

| Event | detail | Emitted when |
|---|---|---|
| `mtx:table:selection-change` | `{ selected: string[], rows: HTMLTableRowElement[], count, reason: 'user' \| 'api' \| 'refresh' }` | The selection changes (checkboxes, row click, methods or new rows with `data-selected`). Emitted on the `<table>`. |
| `mtx:table:sort` | `{ direction: 'asc' \| 'desc', active: true, key: string \| null }` | A `table-sort-label` is clicked (or activated with the keyboard). `direction` is the new direction. |
| `mtx:table:page-change` | `{ page, previousPage, reason }` | The page changes via the buttons or the navigation methods. `reason`: `firstPage`, `previousPage`, `nextPage` or `lastPage`. |
| `mtx:table:rows-per-page-change` | `{ rowsPerPage, previousRowsPerPage, page: 0 }` | The user changes the rows-per-page selector. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-background-paper` | Table and header background. |
| `--mtx-color-divider` | Cell and selector borders. |
| `--mtx-color-text-primary` / `--mtx-color-text-secondary` | Cell text, and footer, pagination and caption text. |
| `--mtx-color-action-hover` | Row hover and footer background. |
| `--mtx-color-primary` | Background of selected rows (8%–12%). |
| `--mtx-color-action-active` / `--mtx-color-action-disabled` | Pagination buttons and sort arrow. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring. |
| `--mtx-type-body2` | Pagination typography. |
| `--mtx-table-cell-padding` | Cell padding (16px; 6px 16px in small). |

## Accessibility

- Always use `<table>`, `<thead>`, `<th>` and `<tbody>`: the component adds `scope="col"` to header cells (and `scope="row"` to `<th>` in the body). Add a `<caption>` or an `aria-label` on the table to name it.
- A `table-container` that scrolls (with `data-max-height`, or when the table overflows horizontally) gets `tabindex="0"` and `role="region"` so it can be scrolled with the keyboard (WCAG 2.1.1). Its name comes from the `<caption>` (`aria-labelledby`), the table's `aria-label`/`aria-labelledby`, or "Scrollable table". A `tabindex` you set yourself is respected.
- The sorted column exposes `aria-sort="ascending|descending"` on its `<th>`, and only one column has it at a time; the arrow is decorative (`aria-hidden`).
- With `data-selectable`, each checkbox gets a translated name ("Select all rows", "Select Ana García"); the header one exposes `aria-checked="mixed"` when indeterminate and rows get `aria-selected`.
- The toolbar has `role="toolbar"`, takes its name from the title and announces the selected counter with `aria-live="polite"`.
- Pagination announces the visible range (`aria-live="polite"`) and its buttons have translated names ("Next page").
- `table-container` scrolls the table inside its box: the page has no horizontal scrolling on mobile.

| Key | Action |
|---|---|
| Tab / Shift+Tab | Moves through toolbar actions, sort labels, checkboxes, the selector and page buttons. |
| Enter / Space | Activates the focused sort label or page button. |
| Space | Checks or unchecks the focused checkbox. |
| Up/Down arrows | Change the rows-per-page selector value. |
