---
title: "Pagination"
description: "Lets users pick a page within a large set of results, with ellipsis, first/last buttons and a link mode for SSR."
group: "navigation"
icon: "last_page"
weight: 35
example: "pagination"
mui: "https://mui.com/material-ui/react-pagination/"
---

`Pagination` implements MUI's `Pagination`: page buttons with ellipsis computed by the same algorithm as `usePagination`, previous/next buttons and optional first/last buttons, `text` and `outlined` variants, `circular` and `rounded` shapes, three sizes and three colors. Use it to move through result lists, blog articles or catalogs. For tables with "rows per page" and a range like "1–10 of 100", use the [Table](../table/) `TablePagination` instead.

## Basic usage

A single `<nav data-mtx="pagination">` with `data-count` (total pages) and optionally `data-page` (1-based). The component generates the buttons, the ellipsis and the translated `aria-label`s.

{{< mtx-demo title="Basic pagination" layout="column" >}}
<nav data-mtx="pagination" data-count="10"></nav>
<nav data-mtx="pagination" data-count="10" data-color="primary"></nav>
<nav data-mtx="pagination" data-count="10" data-color="secondary"></nav>
<nav data-mtx="pagination" data-count="10" data-disabled></nav>
{{< /mtx-demo >}}

## Variants

`data-variant="text"` (default) or `outlined`.

{{< mtx-demo title="Outlined" layout="column" >}}
<nav data-mtx="pagination" data-count="10" data-page="4" data-variant="outlined"></nav>
<nav data-mtx="pagination" data-count="10" data-page="4" data-variant="outlined" data-color="primary"></nav>
<nav data-mtx="pagination" data-count="10" data-page="4" data-variant="outlined" data-color="secondary"></nav>
<nav data-mtx="pagination" data-count="10" data-page="4" data-variant="outlined" data-disabled></nav>
{{< /mtx-demo >}}

## Shapes

`data-shape="circular"` (default) or `rounded` (4px radius).

{{< mtx-demo title="Rounded" layout="column" >}}
<nav data-mtx="pagination" data-count="10" data-page="2" data-shape="rounded" data-color="primary"></nav>
<nav data-mtx="pagination" data-count="10" data-page="2" data-shape="rounded" data-variant="outlined"></nav>
{{< /mtx-demo >}}

## Sizes

`data-size="small|medium|large"`: 26px, 32px (default) and 40px items, like MUI's `PaginationItem`.

{{< mtx-demo title="Small, medium and large" layout="column" >}}
<nav data-mtx="pagination" data-count="10" data-size="small" data-color="primary"></nav>
<nav data-mtx="pagination" data-count="10" data-color="primary"></nav>
<nav data-mtx="pagination" data-count="10" data-size="large" data-color="primary"></nav>
{{< /mtx-demo >}}

## Colors

`data-color="standard|primary|secondary"` sets the color of the selected page.

{{< mtx-demo title="Selected page color" layout="column" >}}
<nav data-mtx="pagination" data-count="6" data-page="3"></nav>
<nav data-mtx="pagination" data-count="6" data-page="3" data-color="primary"></nav>
<nav data-mtx="pagination" data-count="6" data-page="3" data-color="secondary"></nav>
{{< /mtx-demo >}}

## Buttons

Show the first and last page buttons with `data-show-first-button` and `data-show-last-button`; hide previous and next with `data-hide-prev-button` and `data-hide-next-button`.

{{< mtx-demo title="First/last and without previous/next" layout="column" >}}
<nav data-mtx="pagination" data-count="10" data-page="5" data-show-first-button data-show-last-button></nav>
<nav data-mtx="pagination" data-count="10" data-page="5" data-hide-prev-button data-hide-next-button></nav>
{{< /mtx-demo >}}

## Pagination ranges

`data-sibling-count` (1) sets how many pages are shown on each side of the current one, and `data-boundary-count` (1) how many at the beginning and the end.

{{< mtx-demo title="sibling-count and boundary-count" layout="column" >}}
<nav data-mtx="pagination" data-count="11" data-page="6"></nav>
<nav data-mtx="pagination" data-count="11" data-page="6" data-sibling-count="0"></nav>
<nav data-mtx="pagination" data-count="11" data-page="6" data-sibling-count="2"></nav>
<nav data-mtx="pagination" data-count="11" data-page="6" data-boundary-count="2"></nav>
{{< /mtx-demo >}}

## States

Items have hover, focus-visible (<kbd>Tab</kbd>) and ripple on press. Previous/next are disabled automatically at the ends; `data-disabled` disables the whole component.

{{< mtx-demo title="Last page and disabled" layout="column" >}}
<nav data-mtx="pagination" data-count="5" data-page="5" data-color="primary"></nav>
<nav data-mtx="pagination" data-count="5" data-page="2" data-color="primary" data-disabled></nav>
<nav data-mtx="pagination" data-count="5" data-page="2" data-variant="outlined" data-color="primary" data-disabled></nav>
{{< /mtx-demo >}}

## Link mode (SSR)

With `data-href-template` every item is an `<a href>` (`{page}` is replaced by the number): it works with server-side rendering, can open in a new tab and needs no JavaScript to navigate. Items that cannot navigate get `aria-disabled="true"` and no `href`.

{{< mtx-demo title="Links" layout="column" >}}
<nav data-mtx="pagination" data-count="8" data-page="3" data-href-template="?page={page}" data-variant="outlined" data-shape="rounded" data-color="primary"></nav>
{{< /mtx-demo >}}

{{< callout type="info" title="Progressive enhancement" >}}
In link mode, clicking a page emits a **cancelable** `mtx:pagination:change`. If you call `preventDefault()`, the native navigation is cancelled and the component updates the current page in the client (useful to load the page with `fetch` and keep the links for crawlers and users without JavaScript).
{{< /callout >}}

## Real-world examples

Client-side paginated article list: `mtx:pagination:change` repaints the list.

{{< mtx-demo title="Paginated list" layout="column" >}}
<ul data-mtx="list" id="doc-pg-articles" aria-live="polite"></ul>
<nav data-mtx="pagination" data-count="4" data-color="primary" aria-label="Articles pagination" id="doc-pg-articles-nav"></nav>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var articles = ['Designing accessible forms', 'A guide to color tokens', 'Responsive type with clamp()', 'Shadows and elevation in MUI', 'Visible focus states', 'Mobile navigation patterns', 'Sortable, filterable tables', 'Micro-interactions with ripple', 'Dark mode without flashing', 'Icons on a 24px grid', '12-column grids', 'Dialogs and focus management'];
  var perPage = 3;
  var list = document.getElementById('doc-pg-articles');
  var pager = Materix.getInstance(document.getElementById('doc-pg-articles-nav'));
  function render(page) {
    var start = (page - 1) * perPage;
    list.innerHTML = articles.slice(start, start + perPage).map(function (title, i) {
      return '<li data-mtx="list-item"><span data-mtx="list-item-text" data-primary="' + title + '" data-secondary="Article ' + (start + i + 1) + ' of ' + articles.length + '"></span></li>';
    }).join('');
    Materix.initAll(list);
  }
  render(pager.page);
  pager.element.addEventListener('mtx:pagination:change', function (event) { render(event.detail.page); });
});
</script>

## Full BEM syntax

Pre-rendered structure (SSR) that already looks right without JavaScript. If you add `data-mtx="pagination"`, the component reuses the `<ul>` and repaints the items from `data-count`/`data-page`.

```html
<nav class="mtx-pagination mtx-pagination--outlined mtx-pagination--rounded mtx-pagination--medium mtx-pagination--color-primary" aria-label="pagination navigation">
  <ul class="mtx-pagination__ul">
    <li><a class="mtx-pagination__item" href="?page=1" aria-label="Go to page 1">1</a></li>
    <li><a class="mtx-pagination__item mtx-pagination__item--selected" href="?page=2" aria-current="page" aria-label="page 2">2</a></li>
    <li><a class="mtx-pagination__item" href="?page=3" aria-label="Go to page 3">3</a></li>
    <li><div class="mtx-pagination__ellipsis">…</div></li>
    <li><a class="mtx-pagination__item" href="?page=9" aria-label="Go to page 9">9</a></li>
  </ul>
</nav>
```

## Programmatic usage

`goTo(n)`, `next()` and `previous()` emit `mtx:pagination:change`; assigning `page` or `count` updates silently (useful to sync with external state without loops).

{{< mtx-demo title="Methods and events" layout="column" >}}
<nav data-mtx="pagination" data-count="10" data-color="primary" data-show-first-button data-show-last-button id="doc-pg-api"></nav>
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-1">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" id="doc-pg-prev">previous()</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" id="doc-pg-next">next()</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" id="doc-pg-goto">goTo(7)</button>
</div>
<p class="mtx-typography--body2" id="doc-pg-status" aria-live="polite">Page 1</p>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var api = Materix.getInstance(document.getElementById('doc-pg-api'));
  var status = document.getElementById('doc-pg-status');
  api.element.addEventListener('mtx:pagination:change', function (event) {
    status.textContent = 'Page ' + event.detail.page + ' (previous: ' + event.detail.previousPage + ')';
  });
  document.getElementById('doc-pg-prev').addEventListener('click', function () { api.previous(); });
  document.getElementById('doc-pg-next').addEventListener('click', function () { api.next(); });
  document.getElementById('doc-pg-goto').addEventListener('click', function () { api.goTo(7); });
});
</script>

```javascript
const pagination = Materix.getInstance(document.querySelector('#results-pagination'));

pagination.element.addEventListener('mtx:pagination:change', (event) => {
  loadResults(event.detail.page);
});

pagination.goTo(3);        // emits mtx:pagination:change
pagination.count = 25;     // silent; clamps the current page if needed
pagination.page = 1;       // silent

// Direct instantiation
const pager = new Materix.Pagination(document.querySelector('nav.pager'));
```

With ES modules:

```javascript
import { Pagination, getInstance } from 'materix-ui';
```

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `pagination` | — | Initializes the component on a `<nav>` (recommended), a `<div>` (gets `role="navigation"`) or a `<ul>` (wrapped in `<nav>`). |
| `data-count` | integer ≥ 0 | `1` | Total number of pages. |
| `data-page` | integer ≥ 1 | `1` | Current page (1-based). Kept in sync by the component. |
| `data-sibling-count` | integer ≥ 0 | `1` | Pages shown on each side of the current one. |
| `data-boundary-count` | integer ≥ 0 | `1` | Pages always shown at the beginning and the end. |
| `data-variant` | `text`, `outlined` | `text` | Visual variant. |
| `data-shape` | `circular`, `rounded` | `circular` | Item shape. |
| `data-size` | `small`, `medium`, `large` | `medium` | Item size (26/32/40px). |
| `data-color` | `standard`, `primary`, `secondary` | `standard` | Color of the selected page. |
| `data-show-first-button` | boolean | — | Shows the "first page" button. |
| `data-show-last-button` | boolean | — | Shows the "last page" button. |
| `data-hide-prev-button` | boolean | — | Hides the "previous page" button. |
| `data-hide-next-button` | boolean | — | Hides the "next page" button. |
| `data-disabled` | boolean | — | Disables all items. |
| `data-href-template` | URL with `{page}` | — | Link mode: renders `<a href>` instead of `<button>`. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-pagination` | Root `<nav>`. |
| `mtx-pagination--text` / `mtx-pagination--outlined` | Variant. |
| `mtx-pagination--circular` / `mtx-pagination--rounded` | Shape. |
| `mtx-pagination--small` / `mtx-pagination--medium` / `mtx-pagination--large` | Size. |
| `mtx-pagination--color-standard` / `--color-primary` / `--color-secondary` | Color of the selected page. |
| `mtx-pagination--disabled` | Whole component disabled. |
| `mtx-pagination__ul` | Flex list with wrapping. |
| `mtx-pagination__item` | Interactive item (`<button>` or `<a>`). |
| `mtx-pagination__item--page` | Page number item. |
| `mtx-pagination__item--selected` | Current page (`aria-current="page"`). |
| `mtx-pagination__item--nav` | Navigation button, together with `--first`, `--previous`, `--next` or `--last`. |
| `mtx-pagination__icon` | SVG icon of the navigation buttons (mirrored in RTL). |
| `mtx-pagination__ellipsis` | Non-interactive ellipsis ("…"). |

### Methods

| Method | Returns | Description |
|---|---|---|
| `page` (getter/setter) | `number` | Current page. The setter clamps to `[1, count]` and does not emit an event. |
| `count` (getter/setter) | `number` | Total number of pages. The setter adjusts the current page if it falls outside. |
| `goTo(page)` | `boolean` | Goes to a page and emits `mtx:pagination:change` if it changed. |
| `next()` / `previous()` | `boolean` | Goes to the next or previous page (emits the event). |
| `disable()` / `enable()` | `void` | Disables or enables all items. |
| `disabled` (getter) | `boolean` | Disabled state. |
| `destroy()` | `void` | Removes listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |

The pure function `getPaginationItems(options)` (exported by `src/components/pagination/pagination.js`) returns the list of items (`'previous'`, `1`, `'start-ellipsis'`…) using MUI's `usePagination` algorithm.

### Events

| Event | detail | Emitted when |
|---|---|---|
| `mtx:pagination:change` | `{ page, previousPage }` (+ `href` in link mode) | The page changes by user interaction, `goTo()`, `next()` or `previous()`. In link mode it is emitted before navigating and is cancelable. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-pagination-size`, `--mtx-pagination-radius`, `--mtx-pagination-padding`, `--mtx-pagination-gap`, `--mtx-pagination-font-size`, `--mtx-pagination-icon-size` | Item geometry for each size. |
| `--mtx-pagination-accent`, `--mtx-pagination-accent-dark`, `--mtx-pagination-accent-contrast` | Color of the selected page (primary or secondary). |
| `--mtx-pagination-outlined-border` | Border of the `outlined` variant. |
| `--mtx-pagination-selected-mix`, `--mtx-pagination-selected-hover-mix` | Selected background opacity in `outlined` (8%/12% light, 16%/24% dark). |
| `--mtx-color-action-hover`, `--mtx-color-action-selected`, `--mtx-color-action-focus`, `--mtx-disabled-opacity` | Interaction states. |

## Accessibility

- Landmark `<nav>` with `aria-label="pagination navigation"` (translated through i18n `pagination.label`; your own `aria-label` is kept). Give each pagination on the same page its own `aria-label`.
- Each page is a real `<button>` (or `<a href>` in link mode) with `aria-label` "Go to page N"; the current one has `aria-current="page"` and the label "page N".
- Navigation buttons: "Go to first/previous/next/last page"; their SVG icon is `aria-hidden`.
- At the ends they are disabled with `disabled` (or `aria-disabled` in link mode). If the focused button becomes disabled after a change, focus moves to the current page.
- Focus is preserved on the same item after each repaint.

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through pages and navigation buttons. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the focused page or button (<kbd>Enter</kbd> only in link mode). |
