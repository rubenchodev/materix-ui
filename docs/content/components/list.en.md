---
title: "List"
description: "Continuous vertical list of text, icons or avatars, with static or interactive items, subheaders, density and selection."
group: "data-display"
icon: "format_list_bulleted"
weight: 50
example: "list"
mui: "https://mui.com/material-ui/react-list/"
---

`List` groups related items in a continuous column: navigation menus, inboxes, settings or results. Each row can carry an icon or avatar, primary and secondary text, and a trailing action. For data with several comparable columns use [Table](../table/); for a floating menu use [Menu](../menu/).

The family registers these `data-mtx` values: `list`, `list-item` (static row), `list-item-button` (interactive row), `list-item-text`, `list-item-icon`, `list-item-avatar`, `list-item-secondary-action` and `list-subheader`. Each one adds its own `mtx-*` class, so the attribute is enough.

## Basic usage

A `<ul data-mtx="list">` with `data-mtx="list-item"` rows. `data-icon` adds a leading icon and `data-secondary` a secondary text; the component builds the inner structure.

{{< mtx-demo title="List with icons and secondary text" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Mail">
    <li data-mtx="list-item" data-icon="inbox" data-secondary="3 new messages">Inbox</li>
    <li data-mtx="list-item" data-icon="drafts" data-secondary="Saved 2 hours ago">Drafts</li>
    <li data-mtx="list-item" data-icon="send">Sent</li>
  </ul>
</div>
{{< /mtx-demo >}}

## Row content

A row can have text only, an icon, an avatar, and primary plus secondary text. For an avatar use `data-avatar="url"` or write the `data-mtx="avatar"` inside the row: the component wraps it in `mtx-list-item-avatar` (56px wide, like MUI's `ListItemAvatar`). Loose row text moves into `mtx-list-item-text`; controls, buttons and other components stay where they are.

{{< mtx-demo title="Text, icon and avatar" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Contacts">
    <li data-mtx="list-item">Text only</li>
    <li data-mtx="list-item" data-icon="star">With icon</li>
    <li data-mtx="list-item" data-avatar="https://i.pravatar.cc/120?img=5" data-secondary="ana@example.com">Ana Garcia</li>
    <li data-mtx="list-item" data-secondary="carlos@example.com"><span data-mtx="avatar" data-color="primary">CR</span>Carlos Ruiz</li>
  </ul>
</div>
{{< /mtx-demo >}}

`data-align-start` aligns the icon or avatar with the first line when the secondary text spans several lines.

{{< mtx-demo title="Top alignment" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Messages">
    <li data-mtx="list-item" data-align-start data-secondary="Here is the summary of Monday's meeting with the agreements, the owner of each task and the expected delivery dates.">
      <span class="mtx-list-item-icon"><span data-mtx="avatar" data-color="secondary">LM</span></span>
      Monday recap
    </li>
  </ul>
</div>
{{< /mtx-demo >}}

## Interactive rows

`data-mtx="list-item-button"` on a `<button>` (or an `<a>` for navigation) adds hover, visible focus, ripple and selection. Clicking a row marks it as selected (`mtx-list-item--selected`) and unselects the previous one in the same list; it also emits the `mtx:list:select` event.

{{< mtx-demo title="Selectable list" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Settings">
    <li><button data-mtx="list-item-button" data-icon="person" data-secondary="Name, photo and email">Profile</button></li>
    <li><button data-mtx="list-item-button" data-icon="settings" data-secondary="Theme and language" data-selected>Preferences</button></li>
    <li><button data-mtx="list-item-button" data-icon="lock">Security</button></li>
  </ul>
</div>
{{< /mtx-demo >}}

`data-selectable="false"` on the list (or `data-no-select` on a row) turns off automatic selection for rows that only run an action.

{{< mtx-demo title="Actions without selection" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" data-selectable="false" aria-label="Actions">
    <li><button data-mtx="list-item-button" data-icon="file_download">Download</button></li>
    <li><button data-mtx="list-item-button" data-icon="share">Share</button></li>
  </ul>
</div>
{{< /mtx-demo >}}

## Subheaders

`list-subheader` titles groups of rows. It carries the `mtx-list-subheader` class; `data-inset` aligns the title with the text of rows that have an icon, and `data-sticky` pins it while scrolling inside the list.

{{< mtx-demo title="Groups with sticky subheaders" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Settings by category" style="max-height: 240px; overflow: auto;">
    <li class="mtx-list-subheader" data-mtx="list-subheader" data-sticky>General</li>
    <li data-mtx="list-item" data-icon="account_circle">Account</li>
    <li data-mtx="list-item" data-icon="security">Privacy</li>
    <li data-mtx="list-item" data-icon="language">Language</li>
    <li class="mtx-list-subheader" data-mtx="list-subheader" data-sticky>Communications</li>
    <li data-mtx="list-item" data-icon="notifications">Notifications</li>
    <li data-mtx="list-item" data-icon="mail">Email</li>
    <li data-mtx="list-item" data-icon="sms">SMS</li>
  </ul>
</div>
{{< /mtx-demo >}}

## Density

`data-dense` on the list reduces the vertical padding of all its rows (from 8px to 4px).

{{< mtx-demo title="Dense list" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" data-dense aria-label="Files">
    <li data-mtx="list-item" data-icon="folder">Documents</li>
    <li data-mtx="list-item" data-icon="image">Photos</li>
    <li data-mtx="list-item" data-icon="videocam">Videos</li>
  </ul>
</div>
{{< /mtx-demo >}}

## Nested lists

A list with `data-nested` inside an item indents its rows by 48px. Selection is shared with the root list.

{{< mtx-demo title="Nested" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Folders">
    <li>
      <button data-mtx="list-item-button" data-icon="inbox">Inbox</button>
      <ul data-mtx="list" data-nested aria-label="Subfolders">
        <li><button data-mtx="list-item-button" data-icon="star_border">Starred</button></li>
        <li><button data-mtx="list-item-button" data-icon="label">Invoices</button></li>
      </ul>
    </li>
    <li><button data-mtx="list-item-button" data-icon="send">Sent</button></li>
  </ul>
</div>
{{< /mtx-demo >}}

## Secondary actions

Wrap the action in `mtx-list-item-secondary-action` (or `data-mtx="list-item-secondary-action"`), the equivalent of MUI's `ListItemSecondaryAction`: it sits at the end of the row, accepts several actions of any width, and a trailing IconButton snaps to the edge like `edge="end"`. With the simplified syntax, `data-icon` and `data-secondary` build the icon and text without touching the action.

{{< mtx-demo title="Trailing actions" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Documents">
    <li data-mtx="list-item" data-icon="description" data-secondary="2.4 MB" data-divider>
      Annual report.pdf
      <span class="mtx-list-item-secondary-action">
        <button data-mtx="icon-button" data-icon="file_download" aria-label="Download Annual report.pdf"></button>
        <button data-mtx="icon-button" data-icon="delete" aria-label="Delete Annual report.pdf"></button>
      </span>
    </li>
    <li data-mtx="list-item" data-icon="laptop_mac" data-secondary="Madrid · active now">
      MacBook Pro
      <span class="mtx-list-item-secondary-action">
        <button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small">Sign out</button>
      </span>
    </li>
  </ul>
</div>
{{< /mtx-demo >}}

For a clickable row with an independent action (without nesting buttons), use a `list-item` with `data-disable-padding` that holds the `list-item-button` and the action as siblings.

{{< mtx-demo title="Clickable row with an action" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="Projects">
    <li data-mtx="list-item" data-disable-padding>
      <button data-mtx="list-item-button" data-icon="folder" data-secondary="12 files" data-no-select>Project Atlas</button>
      <span class="mtx-list-item-secondary-action">
        <button data-mtx="icon-button" data-icon="more_vert" aria-label="Options for Project Atlas"></button>
      </span>
    </li>
  </ul>
</div>
{{< /mtx-demo >}}

## States

`data-disabled` disables a row: on a `list-item-button` that is a `<button>` it uses the native `disabled` attribute; on an `<a>` it uses `aria-disabled="true"` and removes it from the tab order. Hover over the rows and press Tab to see hover and focus.

{{< mtx-demo title="Normal, selected and disabled" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul data-mtx="list" aria-label="States">
    <li><button data-mtx="list-item-button" data-icon="radio_button_unchecked">Normal</button></li>
    <li><button data-mtx="list-item-button" data-icon="check_circle" data-selected>Selected</button></li>
    <li><button data-mtx="list-item-button" data-icon="block" data-disabled>Disabled</button></li>
    <li data-mtx="list-item" data-icon="block" data-disabled>Disabled static row</li>
  </ul>
</div>
{{< /mtx-demo >}}

## Real-world examples

Side navigation with links: on an `<a>`, the selected row gets `aria-current="page"`. Links are not underlined and inherit the list color; inside a Drawer, Paper, Card, Dialog or Menu the list is transparent so the surface shows through.

{{< mtx-demo title="Navigation" layout="block" >}}
<nav data-mtx="paper" data-variant="outlined" aria-label="Sections">
  <ul data-mtx="list">
    <li><a href="#overview" data-mtx="list-item-button" data-icon="dashboard" data-selected aria-current="page">Overview</a></li>
    <li><a href="#orders" data-mtx="list-item-button" data-icon="shopping_bag">Orders</a></li>
    <li><a href="#customers" data-mtx="list-item-button" data-icon="people">Customers</a></li>
    <li class="mtx-list-subheader" data-mtx="list-subheader">Reports</li>
    <li><a href="#sales" data-mtx="list-item-button" data-icon="bar_chart">Sales</a></li>
  </ul>
</nav>
{{< /mtx-demo >}}

## Full BEM syntax

With the full structure rendered on the server, the component does not duplicate nodes.

```html
<ul class="mtx-list" data-mtx="list">
  <li class="mtx-list-subheader" data-mtx="list-subheader">Mail</li>
  <li class="mtx-list-item" data-mtx="list-item">
    <span class="mtx-list-item-icon"><span class="material-icons" aria-hidden="true">inbox</span></span>
    <span class="mtx-list-item-text">
      <span class="mtx-list-item-text__primary">Inbox</span>
      <span class="mtx-list-item-text__secondary">3 new messages</span>
    </span>
  </li>
  <li>
    <button class="mtx-list-item mtx-list-item-button mtx-list-item--selected" data-mtx="list-item-button">
      <span class="mtx-list-item-text"><span class="mtx-list-item-text__primary">Settings</span></span>
    </button>
  </li>
</ul>
```

## Programmatic usage

```javascript
// Initialize a dynamically generated list (and all of its content)
Materix.initAll(document.getElementById('results'));

// Instances
const row = Materix.init(document.getElementById('row-settings')); // ListItemButton
const same = Materix.getInstance(document.getElementById('row-settings'));

row.selected = true;   // selects the row (does not emit an event)
row.disable();         // disables it
row.enable();

// Listen for selections made by the user
document.getElementById('settings-list').addEventListener('mtx:list:select', (event) => {
  console.log('Selected:', event.detail.item.textContent.trim());
});
```

With ES modules:

```javascript
import {
  List, ListItem, ListItemButton, ListItemText, ListItemIcon, ListItemAvatar,
  ListItemSecondaryAction, ListSubheader, getInstance,
} from 'materix-ui';
```

{{< mtx-demo title="Selection with event" layout="block" >}}
<div data-mtx="paper" data-variant="outlined">
  <ul id="doc-list-events" data-mtx="list" aria-label="Views">
    <li><button data-mtx="list-item-button" data-icon="view_list">List</button></li>
    <li><button data-mtx="list-item-button" data-icon="grid_view">Grid</button></li>
    <li><button data-mtx="list-item-button" data-icon="calendar_month">Calendar</button></li>
  </ul>
</div>
<p id="doc-list-status" aria-live="polite">Click a row.</p>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('doc-list-events').addEventListener('mtx:list:select', (event) => {
    document.getElementById('doc-list-status').textContent = 'mtx-select: ' + event.detail.item.textContent.trim();
  });
});
</script>

## API reference

### Data attributes

**List** (`data-mtx="list"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-dense` | Boolean (presence) | absent | Compact rows (4px vertical padding) throughout the list. |
| `data-nested` | Boolean (presence) | absent | Nested list: no padding of its own and rows indented by 48px. |
| `data-disable-padding` | Boolean (presence) | absent | Removes the list's 8px vertical padding. |
| `data-selectable` | `false` | selection enabled | With `false`, its `list-item-button` rows are not selected when clicked. |

**ListItem** (`data-mtx="list-item"`) and **ListItemButton** (`data-mtx="list-item-button"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-icon` | Material Icons name | — | Leading icon inside `mtx-list-item-icon`. |
| `data-avatar` | Image URL | — | Leading avatar inside `mtx-list-item-avatar`. |
| `data-avatar-alt` | Text | `""` (decorative) | Alternative text of the `data-avatar` image. |
| `data-primary` | Text | text content | Explicit primary text (instead of the row's loose text). |
| `data-secondary` | Text | — | Secondary text. Loose text moves into `mtx-list-item-text__primary`; actions, controls and child components are kept. |
| `data-dense` | Boolean (presence) | inherited from the list | Compact row. |
| `data-divider` | Boolean (presence) | absent | 1px bottom border. |
| `data-disabled` | Boolean (presence) | absent | Disabled row. |
| `data-align-start` | Boolean (presence) | absent | Aligns the icon or avatar with the first line. |
| `data-disable-padding` | Boolean (presence) | absent | ListItem only: no padding. |
| `data-disable-gutters` | Boolean (presence) | absent | No horizontal padding. |
| `data-selected` | Boolean (presence) | absent | ListItemButton only: selected on init. |
| `data-no-select` | Boolean (presence) | absent | ListItemButton only: not selected when clicked. |

**ListSubheader** (`data-mtx="list-subheader"`, with the `mtx-list-subheader` class)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-inset` | Boolean (presence) | absent | 72px inset to align with the text of rows that have an icon. |
| `data-sticky` | Boolean (presence) | absent | Stays pinned at the top while the list scrolls. |

**ListItemText** (`data-mtx="list-item-text"`): accepts `data-primary` and `data-secondary`; without a `__primary` child it wraps its content in one. **ListItemIcon** (`data-mtx="list-item-icon"`): with `data-icon` and no content it renders the icon. **ListItemAvatar** and **ListItemSecondaryAction** only add their class.

### CSS classes

| Class | Description |
|---|---|
| `mtx-list` | Container (`padding: 8px 0`, paper background; transparent inside Drawer, Paper, Card, Dialog and Menu). |
| `mtx-list--dense` / `--nested` / `--nested-2` / `--disable-padding` | Dense, nested (48px), second-level nested (72px), no padding. |
| `mtx-list-item` | Row (`padding: 8px 16px`, body1). |
| `mtx-list-item--dense` / `--divider` / `--align-start` | Compact, with bottom border, top-aligned. |
| `mtx-list-item--disable-padding` / `--disable-gutters` | No padding / no horizontal padding. |
| `mtx-list-item--selected` / `--disabled` | Selected / disabled. |
| `mtx-list-item--nested` / `--nested-2` | Indentation for a standalone row. |
| `mtx-list-item-button` | Interactive row (hover, focus, ripple). |
| `mtx-list-item-icon` | Icon container (24px minimum, 16px margin). |
| `mtx-list-item-avatar` | Avatar container (`ListItemAvatar`, 56px minimum width). |
| `mtx-list-item-secondary-action` | Actions at the end of the row (`ListItemSecondaryAction`); a trailing IconButton snaps to the edge. |
| `mtx-list-item-text` | Text block that fills the free space. |
| `mtx-list-item-text__primary` / `__secondary` | Primary text (body1) and secondary text (body2, secondary color). |
| `mtx-list-subheader` | Subheader (14px, weight 500, secondary color). |
| `mtx-list-subheader--inset` / `--sticky` | Inset / sticky. |

### Methods

**ListItemButton**

| Method / property | Returns | Description |
|---|---|---|
| `selected` (get/set) | `boolean` | Reads or changes the selection (class and ARIA: `aria-current` or `aria-selected` depending on the role). Does not emit an event. |
| `disabled` (get) | `boolean` | Disabled state. |
| `disable()` | `void` | Disables the row (`disabled` on buttons, `aria-disabled` and `tabindex="-1"` on other elements). |
| `enable()` | `void` | Enables it again. |
| `destroy()` | `void` | Removes the ripple and click listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |

List, ListItem, ListItemText, ListItemIcon, ListItemAvatar, ListItemSecondaryAction and ListSubheader expose no methods of their own.

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:list:select` | `{ item: HTMLElement }` | The user clicks an enabled, selectable `list-item-button`. Bubbles up from the row. |

{{< callout type="warning" title="Deprecated alias" >}}
The old name `mtx-select` is still dispatched with the same `detail` right after `mtx:list:select`, but it is deprecated and will be removed in 1.0. Listen to `mtx:list:select`.
{{< /callout >}}

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-background-paper` | Background of the list and of sticky subheaders. |
| `--mtx-color-action-hover` | Hover on interactive rows. |
| `--mtx-color-action-selected` | Background of the selected row. |
| `--mtx-color-action-active` | Icon color. |
| `--mtx-color-text-primary` / `--mtx-color-text-secondary` / `--mtx-color-text-disabled` | Primary, secondary and disabled text. |
| `--mtx-color-divider` | `data-divider` border. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring. |

## Accessibility

- Use `<ul>`/`<li>` so screen readers announce the number of items, and give the list a name with `aria-label` when it has no visible title.
- To separate items use `data-divider` on the items or an `<li data-mtx="divider">` (see [Divider](../divider/)): it stays a list item and, when empty, is hidden with `aria-hidden`. Never put an `<hr>` or an element with `role="separator"` directly inside `<ul>`/`<ol>` (axe rule `list`).
- Interactive rows must be a `<button>` (actions) or an `<a href>` (navigation) inside an `<li>`: that way they are focusable and activate from the keyboard with no extra code.
- Selection is conveyed with valid ARIA for each element: an `<a>` gets `aria-current="page"`; a `<button>`, `aria-current="true"`; only rows with `role="option"` or `role="tab"` (or another selectable role) get `aria-selected`. It is kept in sync on click, with `data-selected` and with the `selected` setter.
- Icons generated with `data-icon` are decorative; the row text is the accessible name. Secondary action buttons need their own `aria-label`.

| Key | Action |
|---|---|
| Tab / Shift+Tab | Moves focus between interactive rows and actions. |
| Enter | Activates the focused row (`<button>` or `<a>`). |
| Space | Activates the focused row if it is a `<button>`. |
