---
title: "Speed Dial"
description: "Floating action button that reveals three to six related, labeled actions in four directions, on click or on hover."
group: "navigation"
icon: "touch_app"
weight: 50
example: "speed-dial"
mui: "https://mui.com/material-ui/react-speed-dial/"
---

`SpeedDial` is a primary [Fab](../fab/) that, when pressed, reveals several secondary actions as small labeled FABs, just like MUI's `SpeedDial`. Use it when a screen's primary action has three to six related variants (create document, spreadsheet, presentation). If there is only one action, use a `Fab`; if there are many options or they are not creation actions, use a [Menu](../menu/).

## Basic usage

A `data-mtx="speed-dial"` container with `data-icon` (the primary FAB icon) and `data-label` (its accessible name), and inside it one `<button>` per action with `data-icon` and `data-tooltip`. The component builds the primary FAB, the actions container and the labels.

{{< mtx-demo title="SpeedDial opening upwards" layout="center" height="320px" >}}
<div data-mtx="speed-dial" data-icon="add" data-label="Create">
  <button data-icon="description" data-tooltip="Document" aria-label="Document"></button>
  <button data-icon="table_chart" data-tooltip="Spreadsheet" aria-label="Spreadsheet"></button>
  <button data-icon="slideshow" data-tooltip="Presentation" aria-label="Presentation"></button>
</div>
{{< /mtx-demo >}}

{{< callout type="warning" title="Accessible name for each action" >}}
`data-tooltip` creates the visible label and, if the button has no `aria-label`/`aria-labelledby`, is also copied to `aria-label`, so icon-only actions always have an accessible name.
{{< /callout >}}

When closed, the actions are invisible but still take up their space in the layout flow, as in MUI: place the SpeedDial in a corner with absolute or fixed positioning (see the "Position" section).

## Directions

`data-direction` sets where the actions open: `up` (default), `down`, `left` or `right`. Vertically, labels appear to the left of each action; horizontally, above it.

{{< mtx-demo title="up · down · left · right" layout="row" height="320px" >}}
<div data-mtx="speed-dial" data-direction="up" data-icon="north" data-label="Upwards">
  <button data-icon="content_copy" data-tooltip="Copy" aria-label="Copy"></button>
  <button data-icon="share" data-tooltip="Share" aria-label="Share"></button>
</div>
<div data-mtx="speed-dial" data-direction="down" data-icon="south" data-label="Downwards">
  <button data-icon="content_copy" data-tooltip="Copy" aria-label="Copy"></button>
  <button data-icon="share" data-tooltip="Share" aria-label="Share"></button>
</div>
<div data-mtx="speed-dial" data-direction="left" data-tooltip-hover data-icon="west" data-label="Leftwards">
  <button data-icon="content_copy" data-tooltip="Copy" aria-label="Copy"></button>
  <button data-icon="share" data-tooltip="Share" aria-label="Share"></button>
</div>
<div data-mtx="speed-dial" data-direction="right" data-tooltip-hover data-icon="east" data-label="Rightwards">
  <button data-icon="content_copy" data-tooltip="Copy" aria-label="Copy"></button>
  <button data-icon="share" data-tooltip="Share" aria-label="Share"></button>
</div>
{{< /mtx-demo >}}

## Colors

`data-color` on the container colors the primary FAB (`primary` by default), and on each action, that action's FAB (`secondary` by default). It accepts the palette colors.

{{< mtx-demo title="FAB and action colors" layout="center" height="300px" >}}
<div data-mtx="speed-dial" data-icon="edit" data-color="secondary" data-label="Edit">
  <button data-icon="delete" data-color="error" data-tooltip="Delete" aria-label="Delete"></button>
  <button data-icon="save" data-color="success" data-tooltip="Save" aria-label="Save"></button>
  <button data-icon="info" data-color="info" data-tooltip="Details" aria-label="Details"></button>
</div>
{{< /mtx-demo >}}

## Labels

By default the labels of all actions are visible while the SpeedDial is open (equivalent to MUI's `tooltipOpen`), styled like the [Tooltip](../tooltip/). With `data-tooltip-hover` each action uses a real [Tooltip](../tooltip/) (`data-mtx-tooltip`) that appears on hover **or keyboard focus**, to the left for vertical directions and above for horizontal ones; recommended for horizontal directions so they don't overlap.

{{< mtx-demo title="Labels on hover only" layout="center" height="300px" >}}
<div data-mtx="speed-dial" data-tooltip-hover data-icon="add" data-label="Create">
  <button data-icon="description" data-tooltip="Document" aria-label="Document"></button>
  <button data-icon="table_chart" data-tooltip="Spreadsheet" aria-label="Spreadsheet"></button>
</div>
{{< /mtx-demo >}}

{{< callout type="info" title="Keyboard" >}}
In both modes the label is visible while tabbing through the actions: in the persistent mode it always is, and with `data-tooltip-hover` the Tooltip appears on keyboard focus and hides with <kbd>Escape</kbd>. Each action's accessible name is still its `aria-label` (persistent labels are `aria-hidden` so they are not read twice).
{{< /callout >}}

## Opening on hover

`data-event="hover"` opens the SpeedDial when the pointer enters and closes it when it leaves. Clicking the FAB still toggles it, so it also works on touch screens and with the keyboard.

{{< mtx-demo title="data-event=&quot;hover&quot;" layout="center" height="300px" >}}
<div data-mtx="speed-dial" data-event="hover" data-icon="menu" data-label="Quick actions">
  <button data-icon="print" data-tooltip="Print" aria-label="Print"></button>
  <button data-icon="download" data-tooltip="Download" aria-label="Download"></button>
</div>
{{< /mtx-demo >}}

## Position

The `mtx-speed-dial--fixed-br` and `mtx-speed-dial--fixed-bl` classes pin it 24px from the bottom-right or bottom-left corner of the viewport, above the content (`z-index` 1050).

```html
<div data-mtx="speed-dial" class="mtx-speed-dial--fixed-br" data-icon="add" data-label="Create">
  <button data-icon="description" data-tooltip="Document" aria-label="Document"></button>
</div>
```

There is no declarative "always open" mode: to show it expanded, call `open()` (see "Programmatic usage").

## Real-world examples

Actions for a photo gallery: each action performs its task and closes the SpeedDial.

{{< mtx-demo title="Gallery" layout="center" height="300px" >}}
<div data-mtx="speed-dial" id="doc-speed-dial-gallery" data-icon="add_a_photo" data-label="Add to gallery">
  <button data-icon="photo_camera" data-tooltip="Take photo" aria-label="Take photo"></button>
  <button data-icon="upload" data-tooltip="Upload file" aria-label="Upload file"></button>
  <button data-icon="create_new_folder" data-tooltip="New album" aria-label="New album"></button>
</div>
<p id="doc-speed-dial-gallery-status" aria-live="polite">Choose an action.</p>
{{< /mtx-demo >}}

```javascript
const el = document.getElementById('doc-speed-dial-gallery');
el.querySelectorAll('.mtx-speed-dial__action').forEach((action) => {
  action.addEventListener('click', () => {
    console.log(action.getAttribute('aria-label'));
    Materix.getInstance(el).close();
  });
});
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-speed-dial-gallery');
  const status = document.getElementById('doc-speed-dial-gallery-status');
  el.querySelectorAll('.mtx-speed-dial__action').forEach((action) => {
    action.addEventListener('click', () => {
      status.textContent = 'Action: ' + action.getAttribute('aria-label');
      Materix.getInstance(el).close();
    });
  });
});
</script>

## Full BEM syntax

With a hand-written structure the component reuses the FAB and the actions container, and only wraps each action that has `data-tooltip` in `mtx-speed-dial__action-wrapper`.

```html
<div class="mtx-speed-dial" data-mtx="speed-dial" data-direction="up">
  <button type="button" class="mtx-fab mtx-fab--primary mtx-speed-dial__fab" aria-label="Create">
    <span class="material-icons" aria-hidden="true">add</span>
  </button>
  <div class="mtx-speed-dial__actions">
    <button type="button" class="mtx-fab mtx-fab--small mtx-fab--secondary mtx-speed-dial__action"
            data-tooltip="Document" aria-label="Document">
      <span class="material-icons" aria-hidden="true">description</span>
    </button>
  </div>
</div>
```

## Programmatic usage

```javascript
const dial = Materix.getInstance(document.getElementById('actions'));
dial.open();
dial.close();
dial.toggle();
console.log(dial.isOpen);
dial.direction = 'left';      // changes the direction class

dial.element.addEventListener('mtx:speed-dial:open', (event) => {
  console.log('opened', event.detail.speedDial);
});
dial.element.addEventListener('mtx:speed-dial:close', () => console.log('closed'));
```

With ES modules:

```javascript
import { SpeedDial, getInstance } from '@rubenchodev/materix-ui';
const dial = new SpeedDial(document.getElementById('actions'));
```

{{< mtx-demo title="open(), close() and direction" layout="row" height="300px" >}}
<div data-mtx="speed-dial" id="doc-speed-dial-api" data-icon="add" data-label="Actions">
  <button data-icon="mail" data-tooltip="Email" aria-label="Email"></button>
  <button data-icon="link" data-tooltip="Link" aria-label="Link"></button>
</div>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-dial="open">open()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-dial="close">close()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-dial="direction">direction = right / up</button>
<span id="doc-speed-dial-status" aria-live="polite"></span>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-speed-dial-api');
  const dial = Materix.getInstance(el);
  const status = document.getElementById('doc-speed-dial-status');
  document.querySelectorAll('[data-doc-dial]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const action = btn.dataset.docDial;
      if (action === 'direction') dial.direction = dial.direction === 'up' ? 'right' : 'up';
      else dial[action]();
    });
  });
  el.addEventListener('mtx:speed-dial:open', () => { status.textContent = 'mtx:speed-dial:open'; });
  el.addEventListener('mtx:speed-dial:close', () => { status.textContent = 'mtx:speed-dial:close'; });
});
</script>

## API reference

### Data attributes

**SpeedDial** (`data-mtx="speed-dial"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-icon` | Material Icons name | — | Generates the primary FAB if neither `.mtx-speed-dial__fab` nor `.mtx-fab` exists. The icon rotates 45° when open. |
| `data-label` | Text | i18n `speedDial.actions` (`Actions` / `Acciones`) | `aria-label` of the generated primary FAB. |
| `data-color` | `primary`, `secondary`, `error`, `warning`, `info`, `success` | `primary` | Color of the generated primary FAB. |
| `data-direction` | `up`, `down`, `left`, `right` | `up` | Opening direction. |
| `data-event` | `click`, `hover` | `click` | With `hover` it also opens when the pointer enters and closes when it leaves. |
| `data-tooltip-hover` | boolean | — | Replaces the persistent labels with one [Tooltip](../tooltip/) per action (hover and keyboard focus). |

**Action** (child `<button>`, simplified syntax)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-icon` | Material Icons name | — | Action icon. |
| `data-tooltip` | Text | — | Visible label next to the action; also its `aria-label` when it has none. |
| `data-color` | Palette colors | `secondary` | Color of the action's small FAB. |
| `aria-label` | Text | — | Accessible name (required; not generated). |

### CSS classes

| Class | Description |
|---|---|
| `mtx-speed-dial` | Flex container (`z-index` 1050). |
| `mtx-speed-dial--direction-up` / `--down` / `--left` / `--right` | Opening direction. |
| `mtx-speed-dial--open` | Open state: actions visible and primary icon rotated 45°. |
| `mtx-speed-dial--tooltip-hover` | Tooltip label mode (hover/focus). |
| `mtx-speed-dial--fixed-br` / `mtx-speed-dial--fixed-bl` | Pinned 24px from the bottom-right / bottom-left corner. |
| `mtx-speed-dial__fab` | Primary FAB. |
| `mtx-speed-dial__actions` | Actions container (12px gap). |
| `mtx-speed-dial__action` | Small FAB for each action. |
| `mtx-speed-dial__action-wrapper` | Action + label wrapper, with a staggered animation. |
| `mtx-speed-dial__tooltip` | Persistent action label (default mode, `aria-hidden`). |

### Methods

| Method | Returns | Description |
|---|---|---|
| `open()` | `void` | Reveals the actions and sets `aria-expanded="true"` on the FAB. |
| `close()` | `void` | Collapses the actions. |
| `toggle()` | `void` | Toggles the state. |
| `isOpen` (getter) | `boolean` | Open state. |
| `direction` (get/set) | `string` | Current direction; setting it changes the class. |
| `destroy()` | `void` | Removes the listeners from the FAB, the container and the document. |

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:speed-dial:open` | `{ speedDial }` | It opens (click, hover or `open()`). |
| `mtx:speed-dial:close` | `{ speedDial }` | It closes (click, click away, <kbd>Escape</kbd>, pointer leaving or `close()`). |

The previous names `mtx-speed-dial-open` and `mtx-speed-dial-close` are still emitted as deprecated aliases until 1.0.

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-duration-short`, `--mtx-duration-shorter`, `--mtx-easing-standard` | Icon rotation, appearance of actions and labels. |
| `--mtx-tooltip-bg`, `--mtx-tooltip-color`, `--mtx-tooltip-font-size`, `--mtx-tooltip-max-width` | Persistent labels (the same tokens as the [Tooltip](../tooltip/)). |
| `--mtx-font-family` | Label typography. |

The primary FAB and the actions use the [Fab](../fab/) variables.

## Accessibility

- The primary FAB gets `aria-haspopup="true"` and a synchronized `aria-expanded`; its name comes from `data-label` (or from the `aria-label` you write in the BEM syntax).
- Actions are native `<button>` elements with a decorative icon (`aria-hidden`): they need an `aria-label`.
- While the SpeedDial is closed, the actions container gets `inert` and `aria-hidden="true"` and each action `tabindex="-1"`, so invisible actions are out of the tab order; opening restores them. The FAB has `aria-controls` pointing to the actions container.
- Persistent labels have `aria-hidden="true"` (the name is already in the `aria-label`); with `data-tooltip-hover` the Tooltip does not duplicate the name when it matches the text.
- It respects `prefers-reduced-motion` through the global `CssBaseline` rule.

| Key | Action |
|---|---|
| <kbd>Enter</kbd> / <kbd>Space</kbd> on the FAB | Opens or closes the SpeedDial. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the actions. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on an action | Runs the action. |
| <kbd>Escape</kbd> | Closes the SpeedDial and returns focus to the FAB (and hides the visible Tooltip). |
