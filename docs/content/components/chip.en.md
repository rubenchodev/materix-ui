---
title: "Chip"
description: "A compact element that represents a tag, a filter, an input or an action; it can have an icon, an avatar and a delete button."
group: "data-display"
icon: "label"
weight: 30
example: "chip"
mui: "https://mui.com/material-ui/react-chip/"
---

`Chip` represents a compact piece of information: a tag, an active filter, a recipient or a short action. Use it for tag lists, selectable filters or inputs the user can remove. For a primary action use [Button]({{< relref "/components/button" >}}); for a counter on an icon use [Badge]({{< relref "/components/badge" >}}).

## Basic usage

An empty element with `data-mtx="chip"` and `data-label`. The component generates the label, the icon and the delete button based on the attributes.

{{< mtx-demo title="Basic chips" >}}
<div data-mtx="chip" data-label="Tag"></div>
<div data-mtx="chip" data-label="Outlined" data-variant="outlined"></div>
<div data-mtx="chip" data-label="JavaScript" data-icon="code" data-color="primary"></div>
{{< /mtx-demo >}}

## Variants

`filled` (default) uses a solid background; `outlined` uses a border and a transparent background.

{{< mtx-demo title="Filled and outlined" >}}
<div data-mtx="chip" data-label="Filled"></div>
<div data-mtx="chip" data-label="Outlined" data-variant="outlined"></div>
<div data-mtx="chip" data-label="Filled primary" data-color="primary"></div>
<div data-mtx="chip" data-label="Outlined primary" data-variant="outlined" data-color="primary"></div>
{{< /mtx-demo >}}

## Sizes

`medium` (32px, default) and `small` (24px).

{{< mtx-demo title="Medium and small" >}}
<div data-mtx="chip" data-label="Medium · 32px" data-icon="star"></div>
<div data-mtx="chip" data-label="Small · 24px" data-size="small" data-icon="star"></div>
<div data-mtx="chip" data-label="Medium" data-deletable data-color="primary"></div>
<div data-mtx="chip" data-label="Small" data-size="small" data-deletable data-color="primary"></div>
{{< /mtx-demo >}}

## With icons and avatar

`data-icon` adds a Material Icons start icon. For an avatar, place a child with the `mtx-chip__avatar` class (it can be a 24px [Avatar]({{< relref "/components/avatar" >}})).

{{< mtx-demo title="Icon and avatar" >}}
<div data-mtx="chip" data-label="No icon"></div>
<div data-mtx="chip" data-label="With icon" data-icon="face"></div>
<div data-mtx="chip" data-label="Anna Garcia">
  <span class="mtx-chip__avatar" data-mtx="avatar" data-size="small" data-color="primary">A</span>
</div>
<div data-mtx="chip" data-label="Charles Reed" data-variant="outlined">
  <span class="mtx-chip__avatar" data-mtx="avatar" data-size="small" data-src="https://i.pravatar.cc/80?img=12" data-alt=""></span>
</div>
{{< /mtx-demo >}}

## Colors

`data-color` accepts the whole palette. In `outlined`, the color is applied to the text and the border.

{{< mtx-demo title="Filled" >}}
<div data-mtx="chip" data-label="Default"></div>
<div data-mtx="chip" data-label="Primary" data-color="primary"></div>
<div data-mtx="chip" data-label="Secondary" data-color="secondary"></div>
<div data-mtx="chip" data-label="Error" data-color="error"></div>
<div data-mtx="chip" data-label="Warning" data-color="warning"></div>
<div data-mtx="chip" data-label="Info" data-color="info"></div>
<div data-mtx="chip" data-label="Success" data-color="success"></div>
{{< /mtx-demo >}}

{{< mtx-demo title="Outlined" >}}
<div data-mtx="chip" data-label="Default" data-variant="outlined"></div>
<div data-mtx="chip" data-label="Primary" data-color="primary" data-variant="outlined"></div>
<div data-mtx="chip" data-label="Secondary" data-color="secondary" data-variant="outlined"></div>
<div data-mtx="chip" data-label="Error" data-color="error" data-variant="outlined"></div>
<div data-mtx="chip" data-label="Warning" data-color="warning" data-variant="outlined"></div>
<div data-mtx="chip" data-label="Info" data-color="info" data-variant="outlined"></div>
<div data-mtx="chip" data-label="Success" data-color="success" data-variant="outlined"></div>
{{< /mtx-demo >}}

## Clickable

`data-clickable` makes the chip interactive: pointer cursor, hover state, focus ring, `role="button"` and activation with Enter or Space. It emits `mtx:chip:click`.

{{< mtx-demo title="Clickable chips" >}}
<div data-mtx="chip" data-label="Clickable" data-clickable></div>
<div data-mtx="chip" data-label="Clickable outlined" data-variant="outlined" data-clickable></div>
<div data-mtx="chip" data-label="With icon" data-icon="bolt" data-color="primary" data-clickable></div>
<button type="button" data-mtx="chip" data-label="On a native button" data-clickable></button>
{{< /mtx-demo >}}

## Deletable

`data-deletable` adds the delete button and emits `mtx:chip:delete` when it's clicked or when Delete/Backspace is pressed while the chip has focus. The chip **doesn't remove itself**: you decide what to do when you receive the event.

{{< mtx-demo title="Deletable tags" >}}
<div data-mtx="chip" data-label="React" data-deletable></div>
<div data-mtx="chip" data-label="Vue" data-deletable></div>
<div data-mtx="chip" data-label="Svelte" data-deletable data-variant="outlined"></div>
<div data-mtx="chip" data-label="Angular" data-deletable data-color="primary" data-delete-label="Remove Angular"></div>
{{< /mtx-demo >}}

```javascript
document.addEventListener('mtx:chip:delete', (event) => {
  event.target.remove();
});
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('mtx:chip:delete', (event) => {
    event.target.remove();
  });
});
</script>

## States

`data-disabled` disables the chip: it lowers the opacity, removes focus and blocks events.

{{< mtx-demo title="Disabled" >}}
<div data-mtx="chip" data-label="Disabled" data-disabled></div>
<div data-mtx="chip" data-label="Disabled" data-variant="outlined" data-disabled></div>
<div data-mtx="chip" data-label="Disabled clickable" data-clickable data-disabled data-color="primary"></div>
<div data-mtx="chip" data-label="Disabled deletable" data-deletable data-disabled></div>
{{< /mtx-demo >}}

## Real-world examples

Search filters: clickable chips that toggle between `outlined` (inactive) and `filled primary` (active), with `aria-pressed` to indicate their state.

{{< mtx-demo title="Filters" >}}
<div data-mtx="chip" data-label="Open" data-filter data-clickable data-color="primary" aria-pressed="true"></div>
<div data-mtx="chip" data-label="In review" data-filter data-clickable data-variant="outlined" aria-pressed="false"></div>
<div data-mtx="chip" data-label="Closed" data-filter data-clickable data-variant="outlined" aria-pressed="false"></div>
{{< /mtx-demo >}}

```javascript
document.addEventListener('mtx:chip:click', (event) => {
  const chip = event.target;
  if (!chip.hasAttribute('data-filter')) return;
  const active = chip.getAttribute('aria-pressed') !== 'true';
  chip.setAttribute('aria-pressed', String(active));
  chip.classList.toggle('mtx-chip--primary', active);
  chip.classList.toggle('mtx-chip--outlined', !active);
});
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('mtx:chip:click', (event) => {
    const chip = event.target;
    if (!chip.hasAttribute('data-filter')) return;
    const active = chip.getAttribute('aria-pressed') !== 'true';
    chip.setAttribute('aria-pressed', String(active));
    chip.classList.toggle('mtx-chip--primary', active);
    chip.classList.toggle('mtx-chip--outlined', !active);
  });
});
</script>

## Full BEM syntax

If the structure already exists, the component reuses `.mtx-chip__label`, `.mtx-chip__icon` and `.mtx-chip__delete`.

```html
<div class="mtx-chip mtx-chip--primary mtx-chip--outlined" data-mtx="chip" data-deletable>
  <span class="mtx-chip__icon material-icons" aria-hidden="true">star</span>
  <span class="mtx-chip__label">Favorite</span>
  <span class="mtx-chip__delete" aria-hidden="true" title="Delete Favorite">
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">…</svg>
  </span>
</div>
```

## Programmatic usage

```javascript
// Initialize a dynamically created chip
const chip = Materix.init(document.getElementById('tag-js'));

// Direct instantiation or retrieval of the instance
const same = Materix.getInstance(document.getElementById('tag-js'));

chip.label = 'TypeScript'; // changes the text
chip.disable();            // disables it (aria-disabled, no focus)
chip.enable();

document.getElementById('tag-js').addEventListener('mtx:chip:delete', (e) => e.target.remove());
```

With ES modules:

```javascript
import { Chip } from '@rubenchodev/materix-ui';

const el = document.createElement('div');
el.setAttribute('data-label', 'New');
el.setAttribute('data-deletable', '');
document.querySelector('#tags').append(el);
new Chip(el);
```

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-label` | Text | element text | Chip text. If missing, the element's direct text is used. |
| `data-variant` | `filled`, `outlined` | `filled` | Background or border style. |
| `data-size` | `medium`, `small` | `medium` | 32px or 24px height. |
| `data-color` | `default`, `primary`, `secondary`, `error`, `warning`, `info`, `success` | `default` | Palette color. |
| `data-icon` | Material Icons name | — | Decorative start icon. |
| `data-clickable` | Boolean (presence) | absent | Interactive chip: hover, focus, `role="button"`, Enter/Space and the `mtx:chip:click` event. |
| `data-deletable` | Boolean (presence) | absent | Adds the delete icon (click, or Delete/Backspace on the focused chip) and the `mtx:chip:delete` event. |
| `data-delete-label` | Text | i18n `chip.delete` (`Delete` / `Eliminar`) | Tooltip (`title`) of the delete icon. |
| `data-delete-icon` | HTML | circular X SVG | Content of the delete icon. |
| `data-disabled` | Boolean (presence) | absent | Starts the chip disabled. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-chip` | Base block (32px, 16px radius). |
| `mtx-chip__label` | Text, with an ellipsis if it doesn't fit. |
| `mtx-chip__icon` | Start icon. |
| `mtx-chip__avatar` | Start avatar container. |
| `mtx-chip__delete` | Delete icon (not focusable, `aria-hidden`). |
| `mtx-chip--outlined` | Bordered variant. |
| `mtx-chip--small` | 24px size. |
| `mtx-chip--primary` … `--success` | Palette color. |
| `mtx-chip--clickable` | Interaction states (cursor, hover, focus, pressed). |
| `mtx-chip--disabled` | Disabled state. |

### Methods

| Method / property | Returns | Description |
|---|---|---|
| `label` (get/set) | `string` | Chip text. |
| `disabled` (get) | `boolean` | `true` if `aria-disabled="true"`. |
| `disable()` | `void` | Disables it, removes it from the tab order and disables the delete button. |
| `enable()` | `void` | Enables the chip again. |
| `emit(name, detail)` | `void` | Dispatches `mtx:chip:{name}` with bubbling. |
| `destroy()` | `void` | Removes the click, keyboard and delete listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:chip:click` | `{}` | A chip with `data-clickable` is clicked (or activated with Enter/Space). |
| `mtx:chip:delete` | `{}` | The delete button is clicked or Delete/Backspace is pressed while the chip has focus. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-chip-height`, `--mtx-chip-height-small` | Heights (32px / 24px). |
| `--mtx-chip-radius`, `--mtx-chip-radius-small` | Radii (16px / 12px). |
| `--mtx-chip-font-size`, `--mtx-chip-font-size-small` | Text size. |
| `--mtx-chip-label-padding`, `--mtx-chip-label-padding-small` | Label padding. |
| `--mtx-chip-bg`, `--mtx-chip-text` | Background and text of the `default` color. |
| `--mtx-chip-delete-color`, `--mtx-chip-delete-color-hover` | Delete icon color. |
| `--mtx-chip-delete-size`, `--mtx-chip-delete-size-small` | Delete icon size. |

## Accessibility

- Static chips are text with no role. Chips with `data-clickable` or `data-deletable` get `role="button"` and `tabindex="0"` (unless the element is already a `<button>` or `<a>`).
- As in MUI, the delete icon is **not** a nested control: it is a `<span aria-hidden="true">` that is never focusable, so the `role="button"` chip contains no interactive descendants (axe `nested-interactive`). The chip is deleted with the mouse on the icon or with Delete/Backspace while the chip has focus; the chip announces those keys with `aria-keyshortcuts="Delete Backspace"`. A pre-rendered `<button class="mtx-chip__delete">` is converted into that `<span>`.
- The icon's `title` comes from the i18n dictionary (`Delete` in English, `Eliminar` in Spanish, following the element's `lang`); make it specific with `data-delete-label` (for example, "Remove React").
- For filters, indicate the active state with `aria-pressed`.
- Icons generated with `data-icon` have `aria-hidden="true"`.

| Key | Action |
|---|---|
| Tab / Shift+Tab | Moves focus between interactive chips. |
| Enter / Space | Activates a clickable chip (emits `mtx:chip:click`). |
| Delete / Backspace | On a deletable chip, emits `mtx:chip:delete`. |
| Escape | Removes focus from the chip. |
