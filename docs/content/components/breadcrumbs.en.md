---
title: "Breadcrumbs"
description: "Hierarchical navigation trail that shows where the user is and lets them jump back to any parent level."
group: "navigation"
icon: "more_horiz"
weight: 5
example: "breadcrumbs"
import: "Breadcrumbs, Link"
mui: "https://mui.com/material-ui/react-breadcrumbs/"
---

`Breadcrumbs` renders the path from the root of the site or app to the current page, like MUI's `Breadcrumbs`: a `<nav>` with an ordered list, separators hidden from assistive technologies and the last item marked with `aria-current="page"`. Use it in hierarchies of three or more levels (catalogs, documentation, file managers). Do not use it as primary navigation or for linear flows.

## Import

```tsx
import { Breadcrumbs, Link } from '@rubenchodev/materix-react';
```

## Basic usage

Pass [Links](../link/) and the current page as children. Each child goes into an `<li>`, links get `color="inherit"` and underline on hover (unless they set their own), plain text becomes a `<span class="mtx-breadcrumbs__text">`, and the last item is marked as the current page. Native `<a>` and `<button>` children are converted into Links.

{{< react-demo "breadcrumbs/01-basic" >}}

## Current page as a link

If the last item must stay a link, set `aria-current="page"` yourself: the component respects it and does not mark any other item.

{{< react-demo "breadcrumbs/02-current-link" >}}

## Separators

`separator` accepts any text (default `/`), any node, or the name of a Material icon: a string made of lowercase letters, digits and underscores, with three or more characters (`navigate_next`, `chevron_right`), is rendered as an icon.

{{< react-demo id="breadcrumbs/03-separators" layout="block" >}}

## With icons

`data-icon` on a child (or `icon` in `items`) adds a decorative Material icon before the label. As in MUI, the icon sits outside the text flow: only the label is underlined on hover.

{{< react-demo id="breadcrumbs/04-icons" layout="block" >}}

## Collapsed breadcrumbs

When there are more items than `maxItems` (8 by default), only `itemsBeforeCollapse` (1) and `itemsAfterCollapse` (1) are shown, separated by a "Show path" button. Activating it reveals the hidden items, moves focus to the first one and calls `onExpand`. The trail collapses again when its items change.

{{< react-demo id="breadcrumbs/05-collapsed" layout="block" >}}

## Typography

Like MUI, it uses `body1` in `text.secondary` and the current page in `text.primary`. For a more compact trail, use `variant="body2"` (it adds the Typography class `mtx-typography--body2`).

{{< react-demo id="breadcrumbs/06-typography" layout="block" >}}

## States

Links keep the Link states (underline on hover, focus ring with <kbd>Tab</kbd>). A trail link can be disabled with `disabled`, and its own `color` changes it.

{{< react-demo id="breadcrumbs/07-states" layout="block" >}}

## From a list of items

`items` describes the trail as data (`{ label, href?, icon?, current?, disabled?, data? }`), equivalent to vanilla's `setItems()`. Items with `href` are Links; the current page (the last one, unless an item sets `current`) is text; the rest are Links on a `<button>`. `data` becomes `data-*` attributes.

{{< react-demo id="breadcrumbs/08-items" layout="block" >}}

## Real-world example

Page header of an admin panel: trail, title and main action.

{{< react-demo id="breadcrumbs/09-use-cases" layout="block" >}}

## Grid layout

The list wraps inside its grid column.

{{< react-demo id="breadcrumbs/10-grid" layout="block" >}}

## Programmatic usage

`onNavigate(event, detail)` fires when a trail link or button is activated, with `{ index, href, label, current, item }`. Return `false` or call `event.preventDefault()` to cancel the native navigation and handle it yourself (SPA routers, folder navigation).

{{< react-demo id="breadcrumbs/11-programmatic" layout="block" >}}

```tsx
<Breadcrumbs
  items={folders.map((name, index) => ({ label: name, data: { depth: index } }))}
  onNavigate={(event, detail) => {
    event.preventDefault();
    openFolder(detail.index);
  }}
/>
```

## API reference

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | — | Links, `<a>`, `<button>`, text or other elements (Fragments are flattened); `data-icon` adds an icon. |
| `items` | `BreadcrumbItem[]` | — | Trail as data; takes precedence over `children`. |
| `separator` | `ReactNode` | `'/'` | Text, node or Material icon name. |
| `maxItems` | `number` | `8` | Maximum visible items before collapsing; `0` disables collapsing. |
| `itemsBeforeCollapse` | `number` | `1` | Items before the collapse button. |
| `itemsAfterCollapse` | `number` | `1` | Items after the collapse button. |
| `expandText` | `string` | i18n `breadcrumbs.showPath` | Accessible label of the collapse button. |
| `expanded` | `boolean` | — | Expanded trail (controlled). |
| `defaultExpanded` | `boolean` | `false` | Expanded on mount (uncontrolled); collapses again when the items change. |
| `onExpand` | `() => void` | — | The collapsed items are revealed. |
| `onNavigate` | `(event, detail) => boolean \| void` | — | An item is activated; `false` or `preventDefault()` cancels the navigation. |
| `variant` | `TypographyVariant` | `'body1'` | Typography scale of the trail (`body2` for a compact one). |
| `locale` | `string` | provider | Language of the component's own texts. |
| `aria-label` | `string` | i18n `breadcrumbs.label` | Name of the `<nav>` landmark (`aria-labelledby` is respected too). |

Other props go to the root `<nav>`; `ref` points to it.

`BreadcrumbItem`: `{ label: ReactNode; href?: string; icon?: ReactNode; current?: boolean; disabled?: boolean; data?: Record<string, string | number | boolean>; key?: string | number }`.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-breadcrumbs` | Root `<nav>`: `body1` in `text.secondary` (zero specificity, so `mtx-typography--*` can override it). |
| `mtx-breadcrumbs--collapsed` | While there are hidden items. |
| `mtx-breadcrumbs__ol` · `__li` | Flex list with wrapping · item. |
| `mtx-breadcrumbs__link` · `__text` | Item link (a Materix Link) · item without a link. |
| `mtx-breadcrumbs__item--with-icon` · `__icon` | Item with icon · decorative 24px icon outside the text flow. |
| `mtx-breadcrumbs__separator` | Separator `<li aria-hidden="true">` with 8px horizontal margin. |
| `mtx-breadcrumbs__collapsed` · `__collapse-button` | Collapse `<li>` · "Show path" button (MoreHoriz 24×16). |

CSS variables: `--mtx-breadcrumbs-separator-gap`, `--mtx-breadcrumbs-collapse-bg`, `--mtx-breadcrumbs-collapse-bg-hover` and `--mtx-breadcrumbs-collapse-color`.

### Equivalence with the vanilla version

| Vanilla | React |
| :--- | :--- |
| `<ol data-mtx="breadcrumbs">` with `<li><a>` | `<Breadcrumbs>` with `<Link>` / `<a>` children |
| `data-separator` · `data-max-items` | `separator` · `maxItems` |
| `data-items-before-collapse` · `data-items-after-collapse` | `itemsBeforeCollapse` · `itemsAfterCollapse` |
| `data-expand-label` | `expandText` |
| `class="mtx-typography--body2"` | `variant="body2"` |
| `data-icon` on `<a>` / `<span>` | `data-icon` on the child · `icon` in `items` |
| `setItems(items)` · `getItems()` | `items` prop (your own state) |
| `expand()` · `collapse()` · `expanded` | collapse button · `expanded` prop |
| `mtx:breadcrumbs:expand` | `onExpand()` |
| `mtx:breadcrumbs:navigate` (cancelable) | `onNavigate(event, detail)` (return `false` or `preventDefault()`) |

## Accessibility

- `<nav>` landmark with `aria-label="breadcrumb"` (translated through i18n `breadcrumbs.label`; your own `aria-label` or `aria-labelledby` is kept).
- Ordered list (`<ol>`): screen readers announce the number of levels.
- Separators are `<li aria-hidden="true">`, so they are not read.
- The current page has `aria-current="page"`.
- The collapse button is a real `<button>` with the translated label "Show path"; after expanding, focus moves to the first revealed item so it is not lost.

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the trail links and the collapse button. |
| <kbd>Enter</kbd> | Follows the link or expands the trail. |
| <kbd>Space</kbd> | Expands the trail (collapse button) or activates an item rendered as a button. |
