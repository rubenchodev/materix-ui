---
title: "Button Group"
description: "Groups related buttons into a single piece with joined borders, separators and inherited variant, size and color."
group: "inputs"
icon: "view_week"
weight: 15
example: "button-group"
mui: "https://mui.com/material-ui/react-button-group/"
---

**Button Group** joins several related [Buttons]({{< relref "/components/button" >}}) into a single piece: shared borders, separators between buttons and a single variant, size and color. Use it for sibling actions (copy / cut / paste, previous / next) or for the *split button* pattern. If the buttons represent a **selection** (active alignment, list or grid view), use [Toggle Button]({{< relref "/components/toggle-button" >}}), which manages the pressed state.

## Basic usage

A container with `data-mtx="button-group"` and plain buttons inside: the group turns them into Buttons, applies its variant (`outlined` by default) and adds `role="group"`. Give it an accessible name with `data-label` or `aria-label`.

{{< mtx-demo title="Simplified syntax" >}}
<div data-mtx="button-group" data-variant="contained" data-label="Basic actions">
  <button>One</button>
  <button>Two</button>
  <button>Three</button>
</div>
{{< /mtx-demo >}}

## Variants

`data-variant="outlined|contained|text"`, as in MUI. **Outlined** overlaps the borders by 1px; **contained** separates with the dark shade of the color and moves the elevation to the group; **text** separates with a line of the color at 50%.

{{< mtx-demo title="outlined, contained and text" layout="column" >}}
<div data-mtx="button-group" data-label="Outlined"><button>One</button><button>Two</button><button>Three</button></div>
<div data-mtx="button-group" data-variant="contained" data-label="Contained"><button>One</button><button>Two</button><button>Three</button></div>
<div data-mtx="button-group" data-variant="text" data-label="Text"><button>One</button><button>Two</button><button>Three</button></div>
{{< /mtx-demo >}}

## Sizes

`data-size="small|medium|large"` is inherited by every button: 32, 40 (default) and 48px, the same heights as IconButton and TextField.

{{< mtx-demo title="large, medium and small" layout="column" >}}
<div data-mtx="button-group" data-size="large" data-label="Large"><button>One</button><button>Two</button><button>Three</button></div>
<div data-mtx="button-group" data-label="Medium"><button>One</button><button>Two</button><button>Three</button></div>
<div data-mtx="button-group" data-size="small" data-label="Small"><button>One</button><button>Two</button><button>Three</button></div>
{{< /mtx-demo >}}

## With icons

Each child accepts the Button attributes (`data-start-icon`, `data-end-icon`). For icon-only buttons use a direct `.material-icons` with `aria-hidden="true"` and put `aria-label` on the button: the group tightens its padding.

{{< mtx-demo title="Start icon, end icon and icon only" layout="column" >}}
<div data-mtx="button-group" data-variant="contained" data-label="Clipboard">
  <button data-start-icon="content_copy">Copy</button>
  <button data-start-icon="content_cut">Cut</button>
  <button data-start-icon="content_paste">Paste</button>
</div>
<div data-mtx="button-group" data-label="Navigation">
  <button data-start-icon="arrow_back">Previous</button>
  <button data-end-icon="arrow_forward">Next</button>
</div>
<div data-mtx="button-group" data-label="Text alignment">
  <button aria-label="Align left"><span class="material-icons" aria-hidden="true">format_align_left</span></button>
  <button aria-label="Center"><span class="material-icons" aria-hidden="true">format_align_center</span></button>
  <button aria-label="Align right"><span class="material-icons" aria-hidden="true">format_align_right</span></button>
</div>
{{< /mtx-demo >}}

## Colors

`data-color` accepts `primary` (default), `secondary`, `success`, `error`, `warning`, `info` and `inherit`. A child with its own `data-color` or color class keeps it.

{{< mtx-demo title="Palette colors" layout="column" >}}
<div data-mtx="button-group" data-variant="contained" data-color="secondary" data-label="Secondary"><button>One</button><button>Two</button><button>Three</button></div>
<div data-mtx="button-group" data-color="success" data-label="Success"><button>One</button><button>Two</button><button>Three</button></div>
<div data-mtx="button-group" data-variant="text" data-color="error" data-label="Error"><button>One</button><button>Two</button><button>Three</button></div>
{{< /mtx-demo >}}

## Orientation

`data-orientation="vertical"` stacks the buttons. It does not add `aria-orientation`: that attribute is not allowed on `role="group"` (it is only added if you declare `role="toolbar"` yourself).

{{< mtx-demo title="Vertical" >}}
<div data-mtx="button-group" data-orientation="vertical" data-label="Vertical outlined"><button>One</button><button>Two</button><button>Three</button></div>
<div data-mtx="button-group" data-orientation="vertical" data-variant="contained" data-label="Vertical contained"><button>One</button><button>Two</button><button>Three</button></div>
<div data-mtx="button-group" data-orientation="vertical" data-variant="text" data-label="Vertical text"><button>One</button><button>Two</button><button>Three</button></div>
{{< /mtx-demo >}}

## Full width

`data-full-width` fills the container width and splits the space evenly between the buttons.

{{< mtx-demo title="data-full-width" layout="block" >}}
<div data-mtx="button-group" data-full-width data-variant="contained" data-label="Full width"><button>One</button><button>Two</button><button>Three</button></div>
{{< /mtx-demo >}}

## States

Hover and focus show on pointer hover or with <kbd>Tab</kbd>: the active button is painted above its neighbors' borders. `data-disabled` disables the whole group (and `enable()` only restores the buttons the group disabled); a child can be disabled on its own. `data-disable-elevation` removes the shadow from a contained group.

{{< mtx-demo title="Disabled and no elevation" layout="column" >}}
<div data-mtx="button-group" data-variant="contained" data-disabled data-label="Disabled group"><button>One</button><button>Two</button><button>Three</button></div>
<div data-mtx="button-group" data-variant="contained" data-label="One disabled child"><button>One</button><button disabled>Two</button><button>Three</button></div>
<div data-mtx="button-group" data-variant="contained" data-disable-elevation data-label="No elevation"><button>One</button><button>Two</button></div>
{{< /mtx-demo >}}

## Split button

MUI's pattern: the main action plus an arrow that opens a [Menu]({{< relref "/components/menu" >}}) through `data-open-menu="#id"`. The menu handles `aria-haspopup`, `aria-expanded`, `aria-controls`, the keyboard and closing; when an option is chosen (`mtx:menu:select`) it updates the main action's text. `role="menuitemradio"` items show the active option. With `data-position-anchor="#group-id"` on the menu, it is anchored to the **whole group** (as MUI does) instead of the arrow alone; focus still returns to the arrow on close.

{{< mtx-demo title="Split button with Menu" height="240px" >}}
<div data-mtx="button-group" data-variant="contained" data-label="Merge pull request" id="doc-split-group">
  <button id="doc-split-main">Squash and merge</button>
  <button aria-label="Select merge strategy" data-open-menu="#doc-split-menu">
    <span class="material-icons" aria-hidden="true">arrow_drop_down</span>
  </button>
</div>
<div data-mtx="menu" id="doc-split-menu" data-position-anchor="#doc-split-group">
  <div data-mtx="menu-item" role="menuitemradio" data-value="Create a merge commit">Create a merge commit</div>
  <div data-mtx="menu-item" role="menuitemradio" data-value="Squash and merge" data-checked>Squash and merge</div>
  <div data-mtx="menu-item" role="menuitemradio" data-value="Rebase and merge" data-disabled>Rebase and merge</div>
</div>
{{< /mtx-demo >}}

```javascript
document.getElementById('doc-split-menu').addEventListener('mtx:menu:select', (event) => {
  document.getElementById('doc-split-main').textContent = event.detail.item.dataset.value;
});
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('doc-split-menu').addEventListener('mtx:menu:select', function (event) {
    document.getElementById('doc-split-main').textContent = event.detail.item.getAttribute('data-value');
  });
});
</script>

## Real-world examples

### Editor toolbar

{{< mtx-demo title="Formatting and undo" >}}
<div data-mtx="button-group" data-size="small" data-label="History">
  <button aria-label="Undo"><span class="material-icons" aria-hidden="true">undo</span></button>
  <button aria-label="Redo"><span class="material-icons" aria-hidden="true">redo</span></button>
</div>
<div data-mtx="button-group" data-size="small" data-label="Text formatting">
  <button aria-label="Bold"><span class="material-icons" aria-hidden="true">format_bold</span></button>
  <button aria-label="Italic"><span class="material-icons" aria-hidden="true">format_italic</span></button>
  <button aria-label="Underline"><span class="material-icons" aria-hidden="true">format_underlined</span></button>
</div>
<div data-mtx="button-group" data-size="small" data-variant="contained" data-disable-elevation data-label="Publish">
  <button data-start-icon="publish">Publish</button>
</div>
{{< /mtx-demo >}}

### Table pagination

{{< mtx-demo title="Previous / next" >}}
<div data-mtx="button-group" data-label="Results pagination">
  <button data-start-icon="chevron_left" disabled>Previous</button>
  <button data-end-icon="chevron_right">Next</button>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

Structure for SSR: the group with its classes and Buttons already marked up. The position classes `mtx-button-group__first|middle|last` are computed by JavaScript (also in `refresh()`).

```html
<div class="mtx-button-group mtx-button-group--contained mtx-button-group--horizontal"
     role="group" aria-label="Formatting" data-mtx="button-group">
  <button type="button" class="mtx-button mtx-button--contained" data-mtx="button">Bold</button>
  <button type="button" class="mtx-button mtx-button--contained" data-mtx="button">Italic</button>
  <button type="button" class="mtx-button mtx-button--contained" data-mtx="button">Underline</button>
</div>
```

## Programmatic usage

`[data-mtx="button-group"]` elements initialize themselves; for dynamic content use `Materix.init(el)` or `new Materix.ButtonGroup(el)`.

```javascript
// UMD (window.Materix)
const group = Materix.getInstance(document.querySelector('#actions'));
group.disable();            // disables every button
group.enable();             // restores only the ones the group disabled

const extra = document.createElement('button');
extra.textContent = 'Four';
group.element.appendChild(extra);
group.refresh();            // applies variant/size/color and recomputes borders
```

```javascript
// ES modules
import { ButtonGroup } from '@rubenchodev/materix-ui';

const group = new ButtonGroup(document.querySelector('#actions'));
console.log(group.buttons.length, group.disabled);
```

{{< mtx-demo title="disable() / enable()" >}}
<div data-mtx="button-group" id="doc-group-api" data-label="Programmatic group"><button>One</button><button>Two</button><button>Three</button></div>
<button class="mtx-button mtx-button--text" data-mtx="button" id="doc-group-toggle">Toggle disabled</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var group = Materix.getInstance(document.getElementById('doc-group-api'));
  document.getElementById('doc-group-toggle').addEventListener('click', function () {
    if (group.disabled) group.enable(); else group.disable();
  });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `button-group` | — | Initializes the component. |
| `data-variant` | `outlined`, `contained`, `text` | `outlined` | Variant inherited by buttons without their own. |
| `data-size` | `small`, `medium`, `large` | `medium` | Inherited size (32 / 40 / 48px). |
| `data-color` | `primary`, `secondary`, `success`, `error`, `warning`, `info`, `inherit` | `primary` | Color inherited by buttons without their own. |
| `data-orientation` | `horizontal`, `vertical` | `horizontal` | Group direction. |
| `data-full-width` | boolean | — | Fills the width and splits the space. |
| `data-disable-elevation` | boolean | — | No shadow on contained. |
| `data-disabled` | boolean | — | Disables every button on init. |
| `data-label` | text | — | Accessible name (`aria-label`) of the group. |

Children keep every [Button]({{< relref "/components/button" >}}) attribute (`data-start-icon`, `data-end-icon`, `data-color`, `data-size`, `data-loading`…), which take precedence over the group's.

### CSS classes

| Class | Description |
|---|---|
| `.mtx-button-group` | Inline flex container with a 4px radius. |
| `.mtx-button-group--outlined` / `--contained` / `--text` | Group variant (borders and separators). |
| `.mtx-button-group--horizontal` / `--vertical` | Orientation. |
| `.mtx-button-group--full-width` | Full width. |
| `.mtx-button-group--disable-elevation` | No elevation. |
| `.mtx-button-group--disabled` | Disabled group. |
| `.mtx-button-group--{color}` / `--small` / `--large` | Color and size declared on the group. |
| `.mtx-button-group__grouped` | Each button in the group. |
| `.mtx-button-group__first` / `__middle` / `__last` | Button position (corners and separators). |

### Methods

| Method | Returns | Description |
|---|---|---|
| `disable()` | `this` | Disables every button and sets `aria-disabled` on the group. |
| `enable()` | `this` | Enables the buttons the group disabled; those disabled by the author stay disabled. |
| `refresh()` | `this` | Prepares added or removed buttons and recomputes their positions. |
| `disabled` | `boolean` | Getter: `true` when the group is disabled. |
| `buttons` | `HTMLElement[]` | Getter: direct buttons of the group. |
| `destroy()` | `void` | Releases the instance. |

### CSS variables

The group reuses the Button variables: the contained separator uses `--mtx-btn-hover` (dark shade of the color) and the text one uses `--mtx-btn-color` at 50%. The elevation uses `--mtx-elevation-2`.

## Accessibility

- The container gets `role="group"` (unless it already has a role or is a `<fieldset>`); name it with `data-label` or `aria-label` so screen readers announce the purpose of the set.
- Each child is a native `<button>` (or `<a>`): tab order is the natural one, without roving tabindex. <kbd>Tab</kbd> moves through the buttons and <kbd>Enter</kbd> / <kbd>Space</kbd> activate them.
- Vertical groups keep `role="group"` without `aria-orientation` (not allowed on that role, as in MUI). If you declare `role="toolbar"` and implement arrow-key navigation, the group adds `aria-orientation="vertical"`.
- Icon-only buttons need `aria-label`; the icon, `aria-hidden="true"`.
- `disable()` uses the native `disabled` (or `aria-disabled` on links) and sets `aria-disabled="true"` on the group.
- In the split button, the arrow receives `aria-haspopup="menu"`, `aria-controls` and `aria-expanded` from the Menu, and focus returns to it when the menu closes.

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus between the group's buttons. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the focused button (on the split button arrow, opens the menu). |
| <kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>Escape</kbd> | Inside the split button menu: navigate and close. |
