---
title: "List"
description: "Continuous vertical list of text, icons or avatars, with static or interactive items, subheaders, density and selection."
group: "data-display"
icon: "format_list_bulleted"
weight: 50
example: "list"
import: "List, ListItem, ListItemButton, ListItemText, ListItemIcon, ListItemAvatar, ListItemSecondaryAction, ListSubheader"
mui: "https://mui.com/material-ui/react-list/"
---

`List` groups related items in a continuous column: navigation menus, inboxes, settings or results. Each row can carry an icon or avatar, primary and secondary text, and a trailing action. For data with several comparable columns use [Table](../table/); for a floating menu use [Menu](../menu/).

```tsx
import { List, ListItem, ListItemButton } from '@rubenchodev/materix-react';
// or just this component:
import { List, ListItem } from '@rubenchodev/materix-react/components/list';
```

## Basic usage

A `List` (a `<ul>`) with `ListItem` rows (`<li>`). The `icon` prop adds the icon and `secondary` the secondary text; text children become the primary text (the equivalent of the vanilla single-element syntax).

{{< react-demo "list/01-basic" >}}

## Row content

Text only, with an icon, with an avatar and with primary and secondary text. `avatar` accepts an image URL (painted as an Avatar with `avatarAlt`, decorative by default) or any node, for example an `<Avatar>`; it is wrapped in `ListItemAvatar` (56px). `alignItems="flex-start"` aligns the avatar with the first line of long texts.

{{< react-demo "list/02-row-content" >}}

## Interactive rows

`ListItemButton` renders a `<button type="button">` (or an `<a>` with `href`) with hover, focus, ripple and selection: clicking a row selects it and unselects the previous one within the same `List`. The selection is uncontrolled by default (`defaultValue`, the `value` of the initial row) or controlled with `value` + `onSelect`. With `selectable={false}` the rows only run their action.

{{< react-demo "list/04-interactive" >}}

## Subheaders

`ListSubheader` titles groups (an `<li>` by default). `inset` aligns the title with the text of rows that have an icon; `sticky` pins it while the list scrolls. You can also pass it through the `subheader` prop of `List`.

{{< react-demo "list/06-subheaders" >}}

## Density

`dense` on the list reduces the vertical padding of its rows (also nested ones) from 8px to 4px.

{{< react-demo "list/03-density" >}}

## Nested lists

A `List` with `nested` inside a row indents its rows by 48px (`nested={2}`: 72px) and shares the selection of the parent list. Wrap it in `Collapse` (exported by the package) to expand and collapse it; the parent row uses `aria-expanded`, `aria-controls` and `disableSelect` so it is not selected.

{{< react-demo "list/07-nested" >}}

## Secondary actions

`secondaryAction` on `ListItem` renders the action in `ListItemSecondaryAction`: aligned to the end, it accepts several actions of any width and a trailing IconButton snaps to the edge. For a clickable row with a separate action, use a `ListItem disablePadding` with the `ListItemButton` as child and the action in `secondaryAction`.

{{< react-demo "list/08-secondary-actions" >}}

## States

Hover to see the hover state and use Tab for focus. `disabled` disables the row: the native `disabled` on buttons, `aria-disabled="true"` and `tabIndex={-1}` on links, and `aria-disabled` on static rows.

{{< react-demo "list/05-states" >}}

## Real-world examples

### Side navigation

With `href` the rows are links; the selected one gets `aria-current="page"`.

{{< react-demo "list/09-use-cases" >}}

### Lists in a grid

{{< react-demo id="list/10-grid" layout="block" >}}

## Programmatic usage

`onSelect` is the equivalent of the vanilla `mtx:list:select` event: it receives `{ item, value }` (the row element and its value). The `selected` setter and `disable()`/`enable()` become the `value` prop of `List` (or `selected` on a row) and `disabled`.

{{< react-demo id="list/11-programmatic" layout="block" >}}

## Composition with subcomponents

For full control (the equivalent of the vanilla BEM syntax), compose `ListItemIcon`, `ListItemAvatar`, `ListItemText` and `ListItemSecondaryAction` inside the rows. When the children of a row are not plain text, they are rendered as is.

{{< react-demo "list/12-composition" >}}

## API reference

### List

| Prop | Type | Default | Description |
|---|---|---|---|
| `dense` | `boolean` | `false` | Compact rows (4px) throughout the list, nested ones included. |
| `disablePadding` | `boolean` | `false` | Removes the 8px vertical padding. |
| `nested` | `boolean \| 2` | `false` | Nested list: rows indented by 48px (`2` → 72px); shares the parent's selection. |
| `subheader` | `ReactNode` | — | Rendered as the first child. |
| `selectable` | `boolean` | `true` | `false`: its `ListItemButton` rows are not selected on click. |
| `value` | `string \| null` | — | Selected row (controlled). |
| `defaultValue` | `string \| null` | `null` | Initially selected row (uncontrolled). |
| `onSelect` | `(detail: { item: HTMLElement; value: string }) => void` | — | A row was selected with a click. |
| `component` | `ElementType` | `'ul'` | Root element. |

### ListItem and ListItemButton

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `string \| ReactNode` | — | Leading icon (Material Icons name or node) in `ListItemIcon`. |
| `avatar` | `string \| ReactNode` | — | Leading avatar (image URL or node) in `ListItemAvatar`. |
| `avatarAlt` | `string` | `''` | Alternative text when `avatar` is a URL. |
| `primary` | `ReactNode` | text children | Explicit primary text; other children are rendered after it. |
| `secondary` | `ReactNode` | — | Secondary text. |
| `dense` | `boolean` | inherited from `List` | Compact row. |
| `divider` | `boolean` | `false` | 1px bottom border. |
| `disabled` | `boolean` | `false` | Disabled row. |
| `alignItems` | `'center' \| 'flex-start'` | `'center'` | `flex-start` aligns the icon or avatar with the first line. |
| `disableGutters` | `boolean` | `false` | No horizontal padding. |
| `disablePadding` | `boolean` | `false` | `ListItem` only: no padding. |
| `secondaryAction` | `ReactNode` | — | `ListItem` only: action at the end of the row. |
| `selected` | `boolean` | from `List` | `ListItemButton` only: controlled selection. |
| `value` | `string` | generated id | `ListItemButton` only: value for the list selection. |
| `disableSelect` | `boolean` | `false` | `ListItemButton` only: not selected when clicked. |
| `href` | `string` | — | `ListItemButton` only: renders an `<a>`. |
| `disableRipple` | `boolean` | `false` | `ListItemButton` only: no ripple. |
| `component` | `ElementType` | `'li'` / `'button'` | Root element. |

### Parts

| Component | Props | Description |
|---|---|---|
| `ListItemText` | `primary`, `secondary` (children = primary) | `.mtx-list-item-text` with `__primary` and `__secondary`. |
| `ListItemIcon` | `icon` (or children) | `.mtx-list-item-icon`. |
| `ListItemAvatar` | — | `.mtx-list-item-avatar` (56px). |
| `ListItemSecondaryAction` | — | `.mtx-list-item-secondary-action`. |
| `ListSubheader` | `inset`, `sticky`, `component` | `.mtx-list-subheader`. |

All of them forward `ref` to the root, merge `className` and pass native attributes through.

### Callbacks

| Callback | Arguments | Vanilla event |
|---|---|---|
| `List.onSelect` | `{ item: HTMLElement; value: string }` | `mtx:list:select` (`detail.item`) |

### Vanilla equivalence

| Vanilla | React |
|---|---|
| `data-dense`, `data-nested`, `data-disable-padding` | `dense`, `nested`, `disablePadding` |
| `data-selectable="false"` | `selectable={false}` |
| `data-icon`, `data-avatar`, `data-avatar-alt` | `icon`, `avatar`, `avatarAlt` |
| `data-primary`, `data-secondary` | `primary`, `secondary` |
| `data-divider`, `data-disabled`, `data-align-start` | `divider`, `disabled`, `alignItems="flex-start"` |
| `data-disable-gutters`, `data-disable-padding` | `disableGutters`, `disablePadding` |
| `data-selected` | `defaultValue` on `List` or `selected` on the row |
| `data-no-select` | `disableSelect` |
| `data-inset`, `data-sticky` (subheader) | `inset`, `sticky` |
| `mtx:list:select` | `onSelect` |
| `selected` setter, `disable()` / `enable()` | `value` / `selected`, `disabled` |

### CSS classes

The same as the vanilla library: `mtx-list` (`--dense`, `--nested`, `--nested-2`, `--disable-padding`), `mtx-list-item` (`--dense`, `--divider`, `--align-start`, `--disable-padding`, `--disable-gutters`, `--selected`, `--disabled`), `mtx-list-item-button`, `mtx-list-item-icon`, `mtx-list-item-avatar`, `mtx-list-item-secondary-action`, `mtx-list-item-text` (`__primary`, `__secondary`) and `mtx-list-subheader` (`--inset`, `--sticky`).

## Accessibility

- Keep `<ul>`/`<li>` so screen readers announce the number of items, and give the list a name with `aria-label` when it has no visible title.
- Interactive rows must be a `<button>` (actions) or an `<a href>` (navigation) inside an `<li>`; with `component` and no `role`, the row gets `role="button"`, `tabIndex={0}` and Enter/Space.
- Selection is conveyed with valid ARIA for each element: an `<a>` gets `aria-current="page"`; a `<button>`, `aria-current="true"`; only rows with `role="option"` or `role="tab"` (or another selectable role) get `aria-selected`.
- Icons generated with `icon` are decorative; the row text is the accessible name. Secondary action buttons need their own `aria-label`.

| Key | Action |
|---|---|
| Tab / Shift+Tab | Moves focus between interactive rows and actions. |
| Enter | Activates the focused row. |
| Space | Activates the focused row if it is a button. |
