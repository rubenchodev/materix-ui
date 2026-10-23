---
title: "Menu"
description: "Temporary list of options anchored to a trigger: icons, dividers, selection, submenus, context menu and full keyboard navigation."
group: "navigation"
icon: "more_vert"
weight: 30
example: "menu"
mui: "https://mui.com/material-ui/react-menu/"
---

`Menu` displays a temporary list of actions or options on an elevated surface, anchored to the element that opens it, like MUI's `Menu` (Popper + Paper + List). Use it for contextual actions on an item (edit, duplicate, delete), account menus or compact toolbars. To pick a value in a form use [Select](../select/); for the app's main navigation, use a [Drawer](../drawer/) or [Tabs](../tabs/).

## Basic usage

A trigger with `data-open-menu="#id"` and a `data-mtx="menu"` container with that id, holding `data-mtx="menu-item"` items. Clicking opens it below the trigger; clicking an option, clicking outside the menu, <kbd>Escape</kbd> or <kbd>Tab</kbd> closes it.

{{< mtx-demo title="Basic menu" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-menu="#doc-menu-basic">Open menu</button>
<div data-mtx="menu" id="doc-menu-basic">
  <div data-mtx="menu-item">Profile</div>
  <div data-mtx="menu-item">My account</div>
  <div data-mtx="menu-item">Log out</div>
</div>
{{< /mtx-demo >}}

When it opens, the menu container is moved to a portal at the end of `<body>` so it is not clipped by the `overflow` or `z-index` of its ancestors. It remains reachable with `document.getElementById`.

## Triggers

A menu needs an `id` and an explicit trigger; there is no implicit trigger. Three options, from most to least recommended:

1. `data-open-menu="#id"` (or its alias `data-mtx-menu-trigger="#id"`) on the button. It also works for triggers added after the menu is initialized (for example, the actions button of each row in a table rendered by JavaScript): clicks are handled through delegation.
2. `aria-controls="id"` on an element that exists when the menu initializes.
3. `data-anchor="selector"` on the menu itself: that element becomes both anchor and trigger.

The component adds `aria-haspopup="menu"`, a synchronized `aria-expanded` and `aria-controls` (when missing) to the trigger. Without any of these mechanisms the menu only opens programmatically with `open(anchor)`.

{{< mtx-demo title="Per-row triggers (delegation)" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Files">
    <li data-mtx="list-item" data-icon="description">
      Annual report.pdf
      <span class="mtx-list-item-secondary-action">
        <button data-mtx="icon-button" data-icon="more_vert" aria-label="Actions for Annual report.pdf" data-open-menu="#doc-menu-rows"></button>
      </span>
    </li>
    <li data-mtx="list-item" data-icon="description">
      Budget.xlsx
      <span class="mtx-list-item-secondary-action">
        <button data-mtx="icon-button" data-icon="more_vert" aria-label="Actions for Budget.xlsx" data-open-menu="#doc-menu-rows"></button>
      </span>
    </li>
  </ul>
</div>
<div data-mtx="menu" id="doc-menu-rows">
  <div data-mtx="menu-item" data-icon="edit">Rename</div>
  <div data-mtx="menu-item" data-icon="delete">Delete</div>
</div>
{{< /mtx-demo >}}

## With icons

`data-icon` inserts a Material Icons glyph before the item text.

{{< mtx-demo title="Icons" >}}
<button class="mtx-icon-button" data-mtx="icon-button" data-icon="more_vert" aria-label="More options" data-open-menu="#doc-menu-icons"></button>
<div data-mtx="menu" id="doc-menu-icons">
  <div data-mtx="menu-item" data-icon="edit">Edit</div>
  <div data-mtx="menu-item" data-icon="content_copy">Duplicate</div>
  <div data-mtx="menu-item" data-icon="share">Share</div>
  <div data-mtx="menu-item" data-icon="delete">Delete</div>
</div>
{{< /mtx-demo >}}

## Dividers

To separate groups use an `<hr class="mtx-menu-item--divider">` or, with the simplified syntax, a `<div data-mtx="menu-item" data-divider>`: both are accessible separators (`role="separator"`), leave an 8px vertical margin, and keyboard navigation skips them.

{{< mtx-demo title="Separated groups" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-menu="#doc-menu-divider">File</button>
<div data-mtx="menu" id="doc-menu-divider">
  <div data-mtx="menu-item" data-icon="description">New</div>
  <div data-mtx="menu-item" data-icon="folder_open">Open…</div>
  <hr class="mtx-menu-item--divider">
  <div data-mtx="menu-item" data-icon="save">Save</div>
  <div data-mtx="menu-item" data-icon="print">Print</div>
  <div data-mtx="menu-item" data-divider></div>
  <div data-mtx="menu-item" data-icon="logout">Close</div>
</div>
{{< /mtx-demo >}}

## Density

`data-dense` on each item reduces its minimum height from 48px to 32px, for long menus on desktop. `data-disable-gutters` removes the horizontal padding.

{{< mtx-demo title="Dense items" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-menu="#doc-menu-dense">Format</button>
<div data-mtx="menu" id="doc-menu-dense">
  <div data-mtx="menu-item" data-dense>Single</div>
  <div data-mtx="menu-item" data-dense>1.15</div>
  <div data-mtx="menu-item" data-dense>1.5</div>
  <div data-mtx="menu-item" data-dense>Double</div>
</div>
{{< /mtx-demo >}}

## States

`data-selected` marks the current option with the `action-selected` background, and it receives focus when the menu is opened from the keyboard. `data-disabled` dims the option and excludes it from keyboard and click interaction (`aria-disabled="true"`). Hover over the items to see the hover background.

{{< mtx-demo title="Selected and disabled" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-menu="#doc-menu-states">View: List</button>
<div data-mtx="menu" id="doc-menu-states">
  <div data-mtx="menu-item" data-icon="view_list" data-selected>List</div>
  <div data-mtx="menu-item" data-icon="grid_view">Grid</div>
  <div data-mtx="menu-item" data-icon="view_timeline" data-disabled>Timeline (coming soon)</div>
</div>
{{< /mtx-demo >}}

## Checkable options

With `role="menuitemcheckbox"` the item toggles `aria-checked` when clicked; with `role="menuitemradio"` it becomes checked and unchecks the others in its group (`role="group"` or the menu). `data-checked` sets the initial state and the component adds the `mtx-menu-item__check` mark, visible only while checked. `mtx:menu:select` includes `detail.checked`.

{{< mtx-demo title="Checkboxes and single choice" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-menu="#doc-menu-checkable">View</button>
<div data-mtx="menu" id="doc-menu-checkable">
  <div data-mtx="menu-item" role="menuitemcheckbox" data-checked>Ruler</div>
  <div data-mtx="menu-item" role="menuitemcheckbox">Gridlines</div>
  <div data-mtx="menu-item" data-divider></div>
  <div role="group" aria-label="Density">
    <div data-mtx="menu-item" role="menuitemradio" data-checked>Comfortable</div>
    <div data-mtx="menu-item" role="menuitemradio">Compact</div>
  </div>
</div>
{{< /mtx-demo >}}

## Positioning

The menu is placed below the trigger, aligned to its left edge with a 4px gap. If it does not fit below and there is more room above, it opens upwards; its maximum height is the available space (with internal scrolling). While open it follows the trigger as the page scrolls, the window resizes or the trigger or menu change size, and it closes if the trigger leaves the viewport. Submenus open to the right of their item (to the left in RTL, `dir="rtl"`), flip to the other side when there is no room and shift vertically to stay inside the viewport.

- `data-anchor="selector"` uses another element as the anchor (and also turns it into a trigger). `data-position-anchor="selector"` only positions the menu against another element without turning it into a trigger (for example the whole [ButtonGroup]({{< relref "/components/button-group" >}}) of a split button); focus still returns to the trigger. The menu's previous sibling is no longer used as an implicit anchor: always declare the trigger (see "Triggers").
- `data-match-width` makes the menu's minimum width match the anchor's.
- `data-transform-origin` forces the origin of the opening animation (`top`, `bottom`…).

{{< mtx-demo title="Same width as the trigger" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-open-menu="#doc-menu-match">Sort by: relevance</button>
<div data-mtx="menu" id="doc-menu-match" data-match-width>
  <div data-mtx="menu-item" data-selected>Relevance</div>
  <div data-mtx="menu-item">Newest</div>
  <div data-mtx="menu-item">Price</div>
</div>
{{< /mtx-demo >}}

## Long scrolling

With many options the menu is limited to the free space in the viewport and scrolls its content. Type a letter to jump to the next option that starts with it.

{{< mtx-demo title="Long list with type-ahead" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-menu="#doc-menu-long">Country</button>
<div data-mtx="menu" id="doc-menu-long">
  <div data-mtx="menu-item" data-dense>Argentina</div>
  <div data-mtx="menu-item" data-dense>Bolivia</div>
  <div data-mtx="menu-item" data-dense>Brazil</div>
  <div data-mtx="menu-item" data-dense>Chile</div>
  <div data-mtx="menu-item" data-dense>Colombia</div>
  <div data-mtx="menu-item" data-dense>Costa Rica</div>
  <div data-mtx="menu-item" data-dense>Cuba</div>
  <div data-mtx="menu-item" data-dense>Dominican Republic</div>
  <div data-mtx="menu-item" data-dense>Ecuador</div>
  <div data-mtx="menu-item" data-dense>El Salvador</div>
  <div data-mtx="menu-item" data-dense>Guatemala</div>
  <div data-mtx="menu-item" data-dense>Honduras</div>
  <div data-mtx="menu-item" data-dense>Mexico</div>
  <div data-mtx="menu-item" data-dense>Nicaragua</div>
  <div data-mtx="menu-item" data-dense>Panama</div>
  <div data-mtx="menu-item" data-dense>Paraguay</div>
  <div data-mtx="menu-item" data-dense>Peru</div>
  <div data-mtx="menu-item" data-dense>Puerto Rico</div>
  <div data-mtx="menu-item" data-dense>Spain</div>
  <div data-mtx="menu-item" data-dense>Uruguay</div>
  <div data-mtx="menu-item" data-dense>Venezuela</div>
</div>
{{< /mtx-demo >}}

## Submenus

An item with `data-submenu-trigger` and `data-open-menu="#id"` opens another menu marked with `data-submenu` to its right (or to its left if it does not fit). It opens on hover, on click or with <kbd>→</kbd>, and closes with <kbd>←</kbd>. The `chevron_right` indicator is added automatically.

{{< mtx-demo title="Nested menu" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-open-menu="#doc-menu-parent">Insert</button>
<div data-mtx="menu" id="doc-menu-parent">
  <div data-mtx="menu-item" data-icon="image">Image</div>
  <div data-mtx="menu-item" data-icon="table_chart">Table</div>
  <div data-mtx="menu-item" data-icon="insert_chart" data-submenu-trigger data-open-menu="#doc-menu-child">Chart</div>
</div>
<div data-mtx="menu" id="doc-menu-child" data-submenu>
  <div data-mtx="menu-item">Bar</div>
  <div data-mtx="menu-item">Line</div>
  <div data-mtx="menu-item">Pie</div>
</div>
{{< /mtx-demo >}}

## Context menu

`Materix.Menu.createContextMenu(selector, items)` builds a menu from JSON that opens on right-click at the pointer position. Each item accepts `label`, `icon`, `image`, `disabled`, `divider`, `submenu` and `action(item, event)`.

{{< mtx-demo title="Right-click inside the area" layout="block" >}}
<div id="doc-context-area" class="mtx-paper mtx-paper--outlined mtx-p-4">Right-click here</div>
{{< /mtx-demo >}}

```javascript
Materix.Menu.createContextMenu('#doc-context-area', [
  { label: 'Copy', icon: 'content_copy', action: () => console.log('copy') },
  { label: 'Paste', icon: 'content_paste', disabled: true },
  { divider: true },
  { label: 'Share', icon: 'share', submenu: [
    { label: 'Email', icon: 'mail', action: () => console.log('email') },
    { label: 'Link', icon: 'link', action: () => console.log('link') },
  ] },
]);
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  const area = document.getElementById('doc-context-area');
  Materix.Menu.createContextMenu('#doc-context-area', [
    { label: 'Copy', icon: 'content_copy', action: () => { area.textContent = 'Action: copy'; } },
    { label: 'Paste', icon: 'content_paste', disabled: true },
    { divider: true },
    { label: 'Share', icon: 'share', submenu: [
      { label: 'Email', icon: 'mail', action: () => { area.textContent = 'Action: share by email'; } },
      { label: 'Link', icon: 'link', action: () => { area.textContent = 'Action: copy link'; } },
    ] },
  ]);
});
</script>

## Real-world examples

An account menu in an app bar: an icon button opens the user's options.

{{< mtx-demo title="Account menu" layout="block" >}}
<header data-mtx="app-bar" data-position="static" data-title="My app">
  <button class="mtx-icon-button" data-mtx="icon-button" data-icon="account_circle" aria-label="Ana Garcia's account" data-open-menu="#doc-menu-account"></button>
</header>
<div data-mtx="menu" id="doc-menu-account">
  <div data-mtx="menu-item" data-icon="person">Profile</div>
  <div data-mtx="menu-item" data-icon="settings">Settings</div>
  <hr class="mtx-menu-item--divider">
  <div data-mtx="menu-item" data-icon="logout">Log out</div>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

```html
<button class="mtx-button mtx-button--text" data-mtx="button" data-open-menu="#actions-menu">Actions</button>
<div class="mtx-menu" id="actions-menu" data-mtx="menu">
  <button type="button" class="mtx-menu-item" data-mtx="menu-item" data-value="edit">
    <span class="mtx-menu-item__icon material-icons" aria-hidden="true">edit</span>Edit
  </button>
  <button type="button" class="mtx-menu-item mtx-menu-item--selected" data-mtx="menu-item" data-value="view">
    <span class="mtx-menu-item__icon material-icons" aria-hidden="true">visibility</span>View
    <span class="mtx-menu-item__check material-icons" aria-hidden="true">check</span>
  </button>
  <hr class="mtx-menu-item--divider">
  <button type="button" class="mtx-menu-item mtx-menu-item--disabled" data-mtx="menu-item" aria-disabled="true">Archive</button>
</div>
```

## Programmatic usage

```javascript
const menu = Materix.getInstance(document.getElementById('actions-menu'));

menu.open();                                        // opens anchored to the trigger
menu.open(anotherButton, { focusFirstItem: false }); // anchors to another element
menu.close();                                       // returns focus to the trigger
menu.close({ restoreFocus: false });
console.log(menu.isOpen, menu.menuItems.length);

menu.element.addEventListener('mtx:menu:select', (event) => {
  console.log(event.detail.item.dataset.value);
});
```

With ES modules:

```javascript
import { Menu, MenuItem, getInstance } from 'materix-ui';
Menu.createContextMenu('.row', [{ label: 'Delete', icon: 'delete', action: (item) => {} }]);
```

{{< mtx-demo title="open(), close() and mtx:menu:select" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-menu-api-anchor">Anchor</button>
<div data-mtx="menu" id="doc-menu-api" data-anchor="#doc-menu-api-anchor">
  <div data-mtx="menu-item" data-value="save">Save</div>
  <div data-mtx="menu-item" data-value="export">Export</div>
</div>
<button class="mtx-button mtx-button--text" data-mtx="button" id="doc-menu-api-open">menu.open()</button>
<span id="doc-menu-api-status" aria-live="polite">No selection</span>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-menu-api');
  const menu = Materix.getInstance(el);
  const status = document.getElementById('doc-menu-api-status');
  document.getElementById('doc-menu-api-open').addEventListener('click', (event) => {
    event.stopPropagation();
    menu.open();
  });
  el.addEventListener('mtx:menu:select', (event) => {
    status.textContent = 'mtx:menu:select → ' + event.detail.item.dataset.value;
  });
});
</script>

## API reference

### Data attributes

**Trigger**

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-open-menu` | Menu `#id` | — | The element opens and closes (toggles) that menu on click and acts as its anchor. It gets `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`. Also works when added after initialization (delegation). |
| `data-mtx-menu-trigger` | Menu `#id` or `id` | — | Alias of `data-open-menu`. |
| `aria-controls` | Menu `id` | — | An element present at initialization whose `aria-controls` equals the menu id is also a trigger. |

**Menu** (`data-mtx="menu"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-anchor` | CSS selector | — | Positioning anchor and additional trigger (takes precedence over `data-open-menu` as the anchor). Without a declared trigger, the menu only opens with `open(anchor)`. |
| `data-position-anchor` | CSS selector | — | Positioning-only anchor (does not open the menu), e.g. the group of a split button. |
| `data-match-width` | boolean | — | Minimum width equal to the anchor's. |
| `data-transform-origin` | CSS value (`top`, `bottom`…) | based on placement | Origin of the opening animation. |
| `data-open` | boolean | — | Opens the menu on initialization. |
| `data-submenu` | boolean | — | Turns it into a submenu: it opens to the right of the trigger item and also on hover. |

**MenuItem** (`data-mtx="menu-item"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-icon` | Material Icons name | — | Inserts a decorative icon before the text. |
| `data-selected` | boolean | — | Selected state (`mtx-menu-item--selected`). |
| `data-disabled` | boolean | — | Disables the item (`mtx-menu-item--disabled`, `aria-disabled`). |
| `data-dense` | boolean | — | 32px minimum height. |
| `data-disable-gutters` | boolean | — | No horizontal padding. |
| `data-submenu-trigger` | boolean | — | The item opens a submenu (with `data-open-menu`) and does not close the menu when clicked. |
| `data-divider` | boolean | — | Turns the item into a separator (`role="separator"`, `mtx-menu-item--divider` class, not focusable). |
| `role` | `menuitem`, `menuitemcheckbox`, `menuitemradio` | `menuitem` | With `menuitemcheckbox` a click toggles `aria-checked`; with `menuitemradio` it checks the item and unchecks the rest of its group. |
| `data-checked` | boolean | — | With `role="menuitemcheckbox"` or `menuitemradio`, the initial `aria-checked` state. |
| `data-value` | Text | — | Free-form value to identify the option in `mtx:menu:select`. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-menu` | Menu list (`role="menu"`). |
| `mtx-menu--open` | Open state. |
| `mtx-menu__popper` | Floating container in the portal (`position: fixed`, `z-index: var(--mtx-z-index-modal)`, 1300). |
| `mtx-menu__paper` | Surface: `paper` background, elevation 8, border radius, 4px vertical padding, 112px minimum width, vertical scrolling. |
| `mtx-menu-item` | Option: 48px minimum height, 6px × 16px padding, `body1`. |
| `mtx-menu-item--dense` | 32px minimum height. |
| `mtx-menu-item--selected` | Selected background. |
| `mtx-menu-item--disabled` | Disabled text, no interaction. |
| `mtx-menu-item--disable-gutters` | No horizontal padding. |
| `mtx-menu-item--divider` | 1px divider with an 8px margin (for use on an `<hr>`). |
| `mtx-menu-item__icon` | Leading icon container (generated by `data-icon`): 36px minimum width, like `ListItemIcon` in MUI, `action-active` color. |
| `mtx-menu-item__check` | Trailing check mark aligned to the right; hidden while `aria-checked="false"`. |
| `mtx-menu-item--checked` | Checkable item in the checked state. |
| `mtx-menu-item__image` | 24px image of items created with `image` in `createContextMenu`. |
| `mtx-menu-item__expand` | Submenu indicator (added by `data-submenu-trigger`). |

### Methods

| Method | Returns | Description |
|---|---|---|
| `open(anchor?, { focusFirstItem = true, anchorEl }?)` | `void` | Opens the menu; the optional `anchor` changes the anchor. `anchorEl` positions this opening against another element (focus still returns to `anchor`). Focuses the selected option or the first enabled one. |
| `close({ restoreFocus = true }?)` | `void` | Closes the menu (and its submenus) and returns focus to the trigger. |
| `isOpen` (getter) | `boolean` | Open state. |
| `menuItems` (getter) | `HTMLElement[]` | Current `.mtx-menu-item` items. |
| `destroy()` | `void` | Removes listeners and deletes the portal container. Unlinks the instance: `getInstance()` then returns `undefined`. |
| `Menu.createContextMenu(selector, items)` (static) | `Menu \| null` | Creates a context menu from JSON and opens it on right-click over `selector`. |
| `MenuItem#checked` (get/set) | `boolean` | Reads or sets `aria-checked` on a checkable item (a radio unchecks its group). |

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:menu:open` | — | The menu finishes opening. |
| `mtx:menu:close` | — | The menu closes (for any reason). |
| `mtx:menu:select` | `{ item, checked? }` | An enabled option is clicked (not fired for submenu triggers). The menu closes before emitting it. `checked` only on checkable items. |

Events are dispatched on the menu element and bubble.

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-background-paper`, `--mtx-elevation-8`, `--mtx-shape-radius` | Menu surface. |
| `--mtx-overlay-elevation-8` | White overlay of the surface in the dark theme (MUI elevation 8). |
| `--mtx-color-text-primary`, `--mtx-color-text-disabled` | Normal and disabled text. |
| `--mtx-color-action-hover`, `--mtx-color-action-selected` | Hover and selected backgrounds. |
| `--mtx-color-action-active` | `__icon`, `__check` and `__expand` icons. |
| `--mtx-color-divider` | Divider. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Item focus with the keyboard. |
| `--mtx-font-family`, `--mtx-duration-shorter`, `--mtx-easing-standard` | Typography and background transition. |

## Accessibility

- The menu gets `role="menu"` and each item `role="menuitem"` (or the `menuitemcheckbox` / `menuitemradio` you declare, with a synchronized `aria-checked`) and `tabindex="-1"`; separators get `role="separator"`. The trigger gets `aria-haspopup="menu"`, `aria-controls` and a synchronized `aria-expanded`.
- When opened from the keyboard, focus moves to the selected option or the first enabled one; when opened with the mouse, to the menu container. When it closes with <kbd>Escape</kbd> or after a choice, focus returns to the trigger.
- Generated icons are decorative (`aria-hidden`). If the trigger is an icon-only button, give it an `aria-label`.
- Disabled items carry `aria-disabled="true"` and are skipped by the keyboard.

| Key | Action |
|---|---|
| <kbd>Enter</kbd> / <kbd>Space</kbd> (on the trigger) | Opens the menu and focuses the first option. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Next / previous option, wrapping around. |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last enabled option. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the focused option. |
| Letter | Jumps to the next option starting with that letter. |
| <kbd>→</kbd> | Opens the submenu of the focused item. |
| <kbd>←</kbd> | Closes the submenu and returns to the parent menu. |
| <kbd>Escape</kbd> | Closes the menu and returns focus to the trigger. |
| <kbd>Tab</kbd> | Closes the menu and lets focus move on. |
