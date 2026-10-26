---
title: "Menu"
description: "Temporary list of options anchored to a trigger: icons, shortcuts, dividers, selection, checkable items, submenus, context menu and full keyboard navigation."
group: "navigation"
icon: "more_vert"
weight: 30
example: "menu"
import: "Menu, MenuItem, MenuList, MenuDivider, MenuGroup, Submenu, ContextMenu, useMenu, useContextMenu"
mui: "https://mui.com/material-ui/react-menu/"
---

**Menu** displays a temporary list of actions or options on an elevated surface, anchored to the element that opens it, like MUI's `Menu` (Popper + Paper + MenuList). Use it for contextual actions on an item (edit, duplicate, delete), account menus or compact toolbars. To pick a value in a form use a [NativeSelect](../native-select/); for the app's main navigation, use [Tabs](../tabs/).

```tsx
import { Menu, MenuItem, useMenu } from '@rubenchodev/materix-react';
// or only this component:
import { Menu, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';
```

**Anatomy:** `.mtx-menu__popper` (positioned in a portal) › `.mtx-menu__paper` (elevation 8) › `.mtx-menu` (`role="menu"`) › `.mtx-menu-item` (`role="menuitem"`) with optional `.mtx-menu-item__icon`, text, shortcut and `.mtx-menu-item__check` / `.mtx-menu-item__expand`.

## Basic usage

`useMenu()` is the equivalent of vanilla's `data-open-menu`: spread `triggerProps` on the trigger and `menuProps` on the `Menu`. The trigger toggles the menu and gets `aria-haspopup`, `aria-expanded` and `aria-controls`. The menu closes when an option is chosen, on a click outside, with <kbd>Escape</kbd> or with <kbd>Tab</kbd>.

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

## Triggers

Without `useMenu`, the menu is fully controlled, as in MUI: `open`, `anchorEl` and `onClose`. A single `Menu` can serve every row of a list: each button stores itself as `anchorEl`, so rows added later work too (vanilla needed click delegation for that).

{{< react-demo id="menu/02-triggers" layout="block" >}}

## Density

Items have a minimum height of 48px; with `dense` (on the `Menu` or on each `MenuItem`), 32px. `disableGutters` removes the side padding.

{{< react-demo "menu/03-density" >}}

## With and without icons

`icon` inserts the icon before the text: a Material Icons name (`icon="edit"`) or any node (an SVG). Give icon-only triggers an `aria-label`.

{{< react-demo "menu/04-icons" >}}

## Dividers

`<MenuDivider />` or `<MenuItem divider />` (the equivalent of `data-divider`) render a `role="separator"` that the keyboard skips.

{{< react-demo "menu/05-dividers" >}}

## States

`selected` highlights the current option and receives focus when the menu is opened with the keyboard; `disabled` adds `aria-disabled="true"` and removes it from the navigation.

{{< react-demo "menu/06-states" >}}

## Checkable options

`role="menuitemcheckbox"` toggles `aria-checked` on click (`checked` + `onCheckedChange`, or `defaultChecked`). `role="menuitemradio"` items inside a `MenuGroup` with `value`/`defaultValue` behave as a single choice; `onSelect` also receives the new `checked` state. The check mark only shows on checked options.

{{< react-demo "menu/07-checkable" >}}

## Secondary text and shortcuts

`shortcut` aligns a keyboard shortcut or metadata at the end; `secondary` adds a second line under the text; `image` shows a 24px picture instead of an icon.

{{< react-demo "menu/08-secondary" >}}

## Positioning

The menu opens below the anchor, aligned to its start edge (`placement="bottom-start"`); if there is no room it flips upwards, and while the page scrolls it keeps the chosen side (`lockSide`). The height is limited to the available space and, in RTL, the alignment is mirrored. `matchWidth` matches the anchor width; `anchorEl` can be any element, a ref or a virtual anchor. If the anchor leaves the viewport the menu asks to close with `anchorHidden`.

{{< react-demo "menu/09-positioning" >}}

## Long scroll

With many options the content scrolls inside the paper. Type a letter to jump to the next option starting with it.

{{< react-demo "menu/10-long-scroll" >}}

## Submenus

`<Submenu label icon>` renders an item with `aria-haspopup="menu"` and a chevron that opens a nested menu next to it: on hover (after 100 ms), on click, or with <kbd>→</kbd>, <kbd>Enter</kbd> or <kbd>Space</kbd>. Hovering another item closes it after 50 ms; <kbd>←</kbd> or <kbd>Escape</kbd> close it and return focus to its item. Choosing an option closes the whole chain and reaches the root `onSelect`. In RTL it opens to the left, the chevron is mirrored and the arrow keys are swapped; if there is no room, it flips to the other side.

{{< react-demo "menu/11-submenus" >}}

## Context menu

`<ContextMenu target items>` is the equivalent of `Materix.Menu.createContextMenu(selector, items)`: `target` is an element, a ref or a CSS selector (delegated on `document`, so areas added later also work); each item accepts `label`, `icon`, `image`, `shortcut`, `disabled`, `divider`, `action` and `submenu`. It opens on right-click at the pointer position (`anchorPosition`); with the <kbd>Menu</kbd> key or <kbd>Shift</kbd>+<kbd>F10</kbd> it anchors to the area and focuses the first option. For your own markup, `useContextMenu()` returns `onContextMenu` and the props of a `Menu`.

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

## Real-world example

Account menu in an [App Bar](../app-bar/), aligned to the end of the icon with `placement="bottom-end"`.

{{< react-demo id="menu/13-real-world" layout="block" >}}

## Grid layout

[Cards](../card/) in a [Grid](../grid/) with their own actions menu; the menu is rendered in a portal, so the card does not clip it.

{{< react-demo id="menu/14-grid" layout="block" >}}

## Programmatic usage

The equivalent of `open()`/`close()` is the `open` prop. `onOpen`, `onSelect(detail, event)` and `onClose(event, reason)` are the equivalents of `mtx:menu:open`, `mtx:menu:select` and `mtx:menu:close`. `restoreFocusTo` chooses who receives focus when the menu closes.

{{< react-demo id="menu/15-programmatic" layout="block" >}}

## Composition: MenuList

`Menu` is made of a portal, a Grow transition, the paper and a `MenuList`. `MenuList` on its own (inside a [Paper](../paper/)) keeps the keyboard navigation for always-visible menus. The split button of [Button Group](../button-group/) anchors a `Menu` to the whole group with `matchWidth` and returns focus to the arrow.

{{< react-demo "menu/16-menu-list" >}}

## Full composition

The equivalent of vanilla's *Manual BEM usage*: there is no hand-written markup in React, but every part can be replaced. Items can be native `<button>` elements (`component="button"`), icons can be any node (an inline SVG) and checked options show their `.mtx-menu-item__check`; the resulting DOM is the same BEM structure.

{{< react-demo "menu/17-composition" >}}

## API reference

### Menu props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Shows the menu (controlled). |
| `anchorEl` | `Element \| Ref \| VirtualElement` | — | Positioning anchor. |
| `anchorPosition` | `{ top, left }` | — | Anchors to a viewport point (context menu); takes precedence over `anchorEl`. |
| `onClose` | `(event, reason) => void` | — | Close request; `reason`: `escapeKeyDown`, `backdropClick`, `tabKeyDown`, `itemClick`, `anchorHidden` or `submenuClose`. |
| `onOpen` | `() => void` | — | The menu opened. |
| `onSelect` | `(detail, event) => void` | — | An item (also in a submenu) was chosen; `detail = { item, value, checked? }`. |
| `closeOnSelect` | `boolean` | `true` | Asks to close (`itemClick`) after a choice. |
| `autoFocus` | `boolean` | `true` | Moves focus into the menu when it opens. |
| `autoFocusItem` | `boolean` | keyboard | Focuses the selected or first item; by default only if the last interaction was the keyboard (otherwise the container). |
| `dense` | `boolean` | `false` | 32px items. |
| `matchWidth` | `boolean` | `false` | Minimum width equal to the anchor's. |
| `placement` | `Placement` | `'bottom-start'` | Preferred side and alignment. |
| `offset` | `number` | `4` | Gap with the anchor (px). |
| `transformOrigin` | `string` | computed | Origin of the Grow animation. |
| `keepMounted` | `boolean` | `false` | Keeps the closed menu in the DOM (hidden, `aria-hidden`). |
| `disablePortal` | `boolean` | `false` | Renders in place instead of `document.body`. |
| `container` | `Element \| Ref` | `document.body` | Portal target. |
| `restoreFocusTo` | `HTMLElement \| Ref` | element focused before opening | Receives focus when the menu closes. |
| `slotProps` | `{ popper, paper }` | — | Attributes of `.mtx-menu__popper` and `.mtx-menu__paper`. |

`ref`, `id`, `className` and any other attribute go to the `role="menu"` element.

### MenuItem props

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `ReactNode` | — | Leading icon (name or node). |
| `image` / `imageAlt` | `string` | — | 24px leading image (decorative by default). |
| `secondary` | `ReactNode` | — | Second line of text. |
| `shortcut` | `ReactNode` | — | Shortcut or metadata at the end. |
| `value` | `string` | — | Value in `onSelect` and `MenuGroup`. |
| `role` | `'menuitem' \| 'menuitemcheckbox' \| 'menuitemradio'` | `'menuitem'` | ARIA role. |
| `checked` / `defaultChecked` / `onCheckedChange` | — | — | Checked state of checkable items. |
| `selected` | `boolean` | `false` | Current option. |
| `disabled` | `boolean` | `false` | `aria-disabled`, skipped by the keyboard. |
| `dense` | `boolean` | inherited | 32px. |
| `disableGutters` | `boolean` | `false` | Removes the side padding. |
| `divider` | `boolean` | `false` | Renders a separator. |
| `disableRipple` | `boolean` | `false` | Without ripple. |
| `href` / `component` | — | `div` | Link (`<a>`) or another element. |

### Other components and hooks

| API | Description |
|---|---|
| `MenuList` | `role="menu"` list with keyboard navigation; props `dense`, `autoFocus`, `autoFocusItem`, `onSelect`. |
| `MenuDivider` | `role="separator"`. |
| `MenuGroup` | `role="group"` with `label`; `value` / `defaultValue` / `onChange` manage its `menuitemradio` items. |
| `Submenu` | `label`, `children` (items), item props for the trigger and `menuProps` for the nested `Menu`. |
| `ContextMenu` | `target` (element, ref or selector) and `items`; other props go to the `Menu`. |
| `useMenu({ id?, defaultOpen? })` | `{ open, openMenu, closeMenu, toggleMenu, triggerProps, menuProps }`. |
| `useContextMenu()` | `{ open, closeMenu, onContextMenu, openFor(event, area), menuProps }`. |

### Callbacks

| Callback | Vanilla event | Fired when |
|---|---|---|
| `onOpen()` | `mtx:menu:open` | `open` becomes `true`. |
| `onSelect(detail, event)` | `mtx:menu:select` | An enabled item is activated (not a submenu trigger). |
| `onClose(event, reason)` | `mtx:menu:close` | Escape, click outside, Tab, a choice, hidden anchor or ← in a submenu ask to close. |

### CSS classes

| Class | Element |
|---|---|
| `.mtx-menu__popper` | Positioned container (`position: fixed`, `dir` of the context). |
| `.mtx-menu__paper` | Surface (elevation 8, scroll). |
| `.mtx-menu` / `.mtx-menu--open` | `role="menu"` list / open state. |
| `.mtx-menu-item` | Item. |
| `.mtx-menu-item--dense`, `--selected`, `--disabled`, `--checked`, `--disable-gutters` | Item modifiers. |
| `.mtx-menu-item--divider` | Separator. |
| `.mtx-menu-item__icon`, `__image`, `__check`, `__expand`, `__shortcut` | Item parts. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-elevation-8`, `--mtx-overlay-elevation-8` | Shadow and dark-theme overlay of the paper. |
| `--mtx-color-background-paper`, `--mtx-color-text-primary` | Surface and text. |
| `--mtx-color-action-hover`, `--mtx-color-action-selected` | Hover and selected backgrounds. |
| `--mtx-color-action-active` | `__icon`, `__check` and `__expand` icons. |
| `--mtx-color-divider` | Divider. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Item focus with the keyboard. |
| `--mtx-z-index-modal` | Stacking level of the popper. |

## Accessibility

- The list has `role="menu"` and each item `role="menuitem"` (or `menuitemcheckbox` / `menuitemradio` with a synchronized `aria-checked`) and `tabindex="-1"` (roving focus); separators have `role="separator"`. `useMenu` gives the trigger `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` (while open) and labels the menu with `aria-labelledby`.
- Opened from the keyboard, focus goes to the selected or first enabled option; with the mouse, to the menu container. After <kbd>Escape</kbd> or a choice, focus returns to the trigger; after a click outside, it stays where the user clicked.
- Generated icons are decorative (`aria-hidden`). Give icon-only triggers an `aria-label`.
- Escape is delivered through the shared layer stack: it closes only the topmost menu or submenu, never a dialog underneath.
- With `prefers-reduced-motion` the menu appears without the Grow animation.

| Key | Action |
|---|---|
| <kbd>Enter</kbd> / <kbd>Space</kbd> (trigger) | Opens the menu and focuses the first option. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Next / previous option, wrapping around. |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last enabled option. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the focused option (opens a submenu). |
| Letter | Next option starting with that letter. |
| <kbd>→</kbd> (<kbd>←</kbd> in RTL) | Opens the submenu of the focused item. |
| <kbd>←</kbd> (<kbd>→</kbd> in RTL) | Closes the submenu and returns to its item. |
| <kbd>Escape</kbd> | Closes the topmost menu and returns focus. |
| <kbd>Tab</kbd> | Closes the menu; focus continues from the trigger. |

## Vanilla equivalence

| Vanilla | React |
|---|---|
| `data-open-menu="#id"` / `aria-controls` / `data-anchor` | `useMenu()` (`triggerProps` + `menuProps`) or `open` + `anchorEl` |
| `data-position-anchor` / `open(trigger, { anchorEl })` | `anchorEl` (position) + `restoreFocusTo` (focus) |
| `data-match-width` | `matchWidth` |
| `data-transform-origin` | `transformOrigin` |
| `data-open` | `open` (initial `true`) |
| `data-mtx="menu-item"` | `<MenuItem>` |
| `data-icon`, `data-selected`, `data-disabled`, `data-dense`, `data-disable-gutters` | `icon`, `selected`, `disabled`, `dense`, `disableGutters` |
| `data-divider` / `<hr class="mtx-menu-item--divider">` | `<MenuItem divider />` / `<MenuDivider />` |
| `role="menuitemcheckbox"` + `data-checked` | `role="menuitemcheckbox"` + `checked` / `defaultChecked` |
| `role="group"` with `menuitemradio` | `<MenuGroup value>` with `role="menuitemradio"` |
| `data-submenu-trigger` + `data-submenu` | `<Submenu label>` |
| `Menu.createContextMenu(selector, items)` | `<ContextMenu target items>` / `useContextMenu()` |
| `open()` / `close({ restoreFocus })` / `isOpen` | `open` prop / `onClose` / `restoreFocusTo` |
| `mtx:menu:open` / `:select` / `:close` | `onOpen` / `onSelect` / `onClose` |
