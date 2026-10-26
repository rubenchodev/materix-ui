---
title: "Pagination"
description: "Lets users pick a page within a large set of results, with ellipsis, first/last buttons and a link mode for SSR."
group: "navigation"
icon: "last_page"
weight: 35
example: "pagination"
import: "Pagination, PaginationItem, usePagination"
mui: "https://mui.com/material-ui/react-pagination/"
---

**Pagination** implements MUI's `Pagination`: page buttons with ellipsis computed by the same algorithm as `usePagination`, previous/next buttons and optional first/last buttons, `text` and `outlined` variants, `circular` and `rounded` shapes, three sizes and three colors. Use it to move through result lists, blog articles or catalogs.

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Pagination } from '@rubenchodev/materix-react';

<Pagination count={10} />
```

## Basic usage

`count` (total pages) is enough. The component renders the `<nav>` landmark, the list, the buttons, the ellipsis and the translated `aria-label`s. It is uncontrolled by default (`defaultPage`, 1-based); use `page` + `onChange` to control it.

{{< react-demo id="pagination/01-basic" layout="block" >}}

## Variants

`variant="text"` (default) or `outlined`.

{{< react-demo id="pagination/02-variants" layout="block" >}}

## Shapes

`shape="circular"` (default) or `rounded` (4px radius).

{{< react-demo id="pagination/03-shapes" layout="block" >}}

## Sizes

`size="small" | "medium" | "large"`: 26px, 32px (default) and 40px items, like MUI's `PaginationItem`.

{{< react-demo id="pagination/04-sizes" layout="block" >}}

## Colors

`color="standard" | "primary" | "secondary"` sets the color of the selected page.

{{< react-demo id="pagination/05-colors" layout="block" >}}

## Navigation buttons

Show the first and last page buttons with `showFirstButton` and `showLastButton`; hide previous and next with `hidePrevButton` and `hideNextButton`.

{{< react-demo id="pagination/06-buttons" layout="block" >}}

## Pagination ranges

`siblingCount` (1) sets how many pages are shown on each side of the current one, and `boundaryCount` (1) how many at the beginning and the end.

{{< react-demo id="pagination/07-ranges" layout="block" >}}

## States

Items have hover, focus-visible (<kbd>Tab</kbd>) and ripple on press (`disableRipple` turns it off). Previous/next are disabled automatically at the ends; `disabled` disables the whole component. If the focused button becomes disabled (for example "next" on the last page), focus moves to the current page.

{{< react-demo id="pagination/08-states" layout="block" >}}

## Link mode (SSR)

With `getItemHref(page)` every item is an `<a href>`: it works with server-side rendering, can open in a new tab and needs no JavaScript to navigate. Items that cannot navigate get `aria-disabled="true"` and no `href`.

{{< react-demo id="pagination/09-links" layout="block" >}}

{{< callout type="info" title="Cancelable navigation" >}}
In link mode, clicking a page calls `onChange(event, page)` **before** navigating. If you call `event.preventDefault()`, the native navigation is cancelled and the page changes in the client (useful to load the results with `fetch` while keeping the links for crawlers). This is the equivalent of the cancelable `mtx:pagination:change` event in vanilla.
{{< /callout >}}

## Real-world example

Client-side paginated article list built with [List](../list/) inside a [Paper](../paper/).

{{< react-demo id="pagination/10-use-cases" layout="block" >}}

## Grid layout

{{< react-demo id="pagination/11-grid" layout="block" >}}

## Controlled usage and `usePagination`

In controlled mode the parent owns `page`, so it can be changed from outside (buttons, URL, store). `usePagination` exposes the same logic as MUI's hook to build your own UI: it returns `items` (`{ type, page, selected, disabled, onClick }`), `page` and `goTo`.

{{< react-demo id="pagination/12-programmatic" layout="block" >}}

```tsx
const [page, setPage] = useState(1);
<Pagination count={25} page={page} onChange={(event, next) => setPage(next)} />;

// Custom rendering
<Pagination count={10} renderItem={(item) => <PaginationItem {...item} />} />;

// Headless
const { items } = usePagination({ count: 10 });
```

## API reference

### Pagination props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `count` | `number` | `1` | Total number of pages (`0` renders only disabled navigation). |
| `page` | `number` | — | Current page, 1-based (controlled). Clamped to `[1, count]`. |
| `defaultPage` | `number` | `1` | Initial page (uncontrolled). |
| `onChange` | `(event, page: number) => void` | — | Fired when the page changes by interaction (`mtx:pagination:change`). In link mode, `event.preventDefault()` cancels the navigation. |
| `siblingCount` | `number` | `1` | Pages on each side of the current one. |
| `boundaryCount` | `number` | `1` | Pages always shown at the beginning and the end. |
| `variant` | `'text' \| 'outlined'` | `'text'` | Visual variant. |
| `shape` | `'circular' \| 'rounded'` | `'circular'` | Item shape. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Item size (26/32/40px). |
| `color` | `'standard' \| 'primary' \| 'secondary'` | `'standard'` | Color of the selected page. |
| `showFirstButton` / `showLastButton` | `boolean` | `false` | Shows the first / last page buttons. |
| `hidePrevButton` / `hideNextButton` | `boolean` | `false` | Hides the previous / next page buttons. |
| `disabled` | `boolean` | `false` | Disables all items. |
| `disableRipple` | `boolean` | `false` | Disables the ripple. |
| `getItemHref` | `(page: number) => string` | — | Link mode: renders `<a href>` instead of `<button>`. |
| `getItemAriaLabel` | `(type, page, selected) => string` | i18n | Accessible label of each item. |
| `renderItem` | `(item) => ReactNode` | `PaginationItem` | Renders each item. |
| `locale` | `string` | context | Language of the labels (overrides `I18nProvider`). |
| `ref` | `Ref<HTMLElement>` | — | Ref to the `<nav>`. |

`className`, `style`, `aria-label` and other attributes go to the `<nav>`.

### PaginationItem props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `type` | `'page' \| 'first' \| 'previous' \| 'next' \| 'last' \| 'start-ellipsis' \| 'end-ellipsis'` | Item type. |
| `page` | `number \| null` | Target page. |
| `selected` | `boolean` | Current page (`aria-current="page"`). |
| `disabled` | `boolean` | `disabled` (button) or `aria-disabled` (link). |
| `href` | `string` | Renders an `<a>`. |
| `disableRipple` | `boolean` | Disables the ripple. |

### usePagination

`usePagination({ count, page, defaultPage, onChange, siblingCount, boundaryCount, showFirstButton, showLastButton, hidePrevButton, hideNextButton, disabled })` returns `{ items, page, count, goTo, setPage }`. The pure function `getPaginationItems(options)` (`import { getPaginationItems } from '@rubenchodev/materix-react'`) returns the raw list (`'previous'`, `1`, `'start-ellipsis'`…), typed as `PaginationItemEntry[]`.

{{< callout type="warning" title="Router links" >}}
In link mode, if a router `Link` rendered through `renderItem` cancels the navigation itself, the uncontrolled component also detects it (it checks `defaultPrevented` again in a microtask). For a router-driven page, prefer the controlled mode: derive `page` from the URL.
{{< /callout >}}

### CSS classes

| Class | Element |
| :--- | :--- |
| `.mtx-pagination` | Root `<nav>`. |
| `.mtx-pagination--text` / `--outlined` | Variant. |
| `.mtx-pagination--circular` / `--rounded` | Shape. |
| `.mtx-pagination--small` / `--medium` / `--large` | Size. |
| `.mtx-pagination--color-standard` / `--color-primary` / `--color-secondary` | Color of the selected page. |
| `.mtx-pagination--disabled` | Whole component disabled. |
| `.mtx-pagination__ul` | Flex list with wrapping. |
| `.mtx-pagination__item` (`--page`, `--selected`, `--nav`, `--first`, `--previous`, `--next`, `--last`) | Interactive item. |
| `.mtx-pagination__icon` | SVG icon of the navigation buttons (mirrored in RTL). |
| `.mtx-pagination__ellipsis` | Non-interactive ellipsis. |

### CSS variables

| Variable | Usage |
| :--- | :--- |
| `--mtx-pagination-size`, `--mtx-pagination-radius`, `--mtx-pagination-padding`, `--mtx-pagination-gap`, `--mtx-pagination-font-size`, `--mtx-pagination-icon-size` | Item geometry for each size. |
| `--mtx-pagination-accent`, `--mtx-pagination-accent-dark`, `--mtx-pagination-accent-contrast` | Selected page color. |
| `--mtx-pagination-outlined-border` | Border of the `outlined` variant. |
| `--mtx-pagination-selected-mix`, `--mtx-pagination-selected-hover-mix` | Selected background opacity in `outlined`. |

## Equivalence with vanilla

| Vanilla | React |
| :--- | :--- |
| `<nav data-mtx="pagination" data-count="10" data-page="3">` | `<Pagination count={10} defaultPage={3} />` |
| `data-sibling-count`, `data-boundary-count` | `siblingCount`, `boundaryCount` |
| `data-variant`, `data-shape`, `data-size`, `data-color` | `variant`, `shape`, `size`, `color` |
| `data-show-first-button`, `data-hide-prev-button`… | `showFirstButton`, `hidePrevButton`… |
| `data-disabled` / `disable()` / `enable()` | `disabled` |
| `data-href-template="?page={page}"` | `getItemHref={(p) => '?page=' + p}` |
| `page` / `count` setters, `goTo()`, `next()`, `previous()` | `page` / `count` props (controlled) |
| `mtx:pagination:change` `{ page, previousPage, href }` (cancelable in link mode) | `onChange(event, page)`; `event.preventDefault()` in link mode. `previousPage` and `href` are not passed: keep the previous page in your state (controlled mode) and compute the URL with your own `getItemHref(page)`. |
| `getPaginationItems()` | `getPaginationItems()` and `usePagination()` |

## Accessibility

- `<nav>` landmark with `aria-label="pagination navigation"` (translated through i18n `pagination.label`; your own `aria-label` or `aria-labelledby` wins). Give each pagination on the same page its own label.
- Each page is a real `<button>` (or `<a href>` in link mode) labeled "Go to page N"; the current one has `aria-current="page"` and the label "page N".
- Navigation buttons: "Go to first/previous/next/last page"; their SVG icon is `aria-hidden`.
- Items at the ends are disabled with `disabled` (or `aria-disabled` in link mode); focus never gets lost.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through pages and navigation buttons. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the focused item (<kbd>Enter</kbd> only in link mode). |
