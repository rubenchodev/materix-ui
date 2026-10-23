---
title: "Slider"
description: "Lets users pick a value or a range by dragging along a track, built on accessible native range inputs."
group: "inputs"
icon: "tune"
weight: 57
example: "slider"
mui: "https://mui.com/material-ui/react-slider/"
---

**Slider** lets the user select a value (or a range) from a continuous or stepped scale: volume, brightness, price filters, temperatures. As in MUI, every thumb is backed by a visually hidden native `<input type="range">`, so the keyboard, screen readers and form submission work without extra code. For an exact number the user must type, use a [Text Field](../text-field/) with `type="number"`; for a few discrete options, use a [Toggle Button](../toggle-button/) group or [Radio](../radio/) buttons.

## Basic usage

A single `<input type="range" data-mtx="slider">` builds the rail, track, thumb and value label. `min`, `max`, `step`, `value` and `name` are kept on the native input, and `data-label` sets the accessible name.

{{< mtx-demo title="Basic usage" layout="column" >}}
<input type="range" data-mtx="slider" name="volume" min="0" max="100" value="30" data-label="Volume">
{{< /mtx-demo >}}

## Sizes

Two sizes, as in MUI: medium (4px rail, 20px thumb) and small (2px rail, 12px thumb without shadow).

{{< mtx-demo title="Sizes" layout="column" >}}
<input type="range" data-mtx="slider" value="50" data-value-label-display="auto" data-label="Medium slider">
<input type="range" data-mtx="slider" value="50" data-size="small" data-value-label-display="auto" data-label="Small slider">
{{< /mtx-demo >}}

## With icons

The slider fills the available width, so decorative icons go next to it inside a horizontal [Stack](../stack/) (MUI's "Volume" pattern).

{{< mtx-demo title="Icons on both ends" layout="column" >}}
<div data-mtx="stack" data-direction="row" data-spacing="2" data-align="center">
  <span class="material-icons mtx-color-text-secondary" aria-hidden="true">volume_down</span>
  <input type="range" data-mtx="slider" value="60" data-label="Volume">
  <span class="material-icons mtx-color-text-secondary" aria-hidden="true">volume_up</span>
</div>
{{< /mtx-demo >}}

## Colors

`data-color` accepts the MUI palette: `primary`, `secondary`, `error`, `warning`, `info` and `success`.

{{< mtx-demo title="Colors" layout="column" >}}
<input type="range" data-mtx="slider" value="60" data-label="Primary">
<input type="range" data-mtx="slider" value="60" data-color="secondary" data-label="Secondary">
<input type="range" data-mtx="slider" value="60" data-color="error" data-label="Error">
<input type="range" data-mtx="slider" value="60" data-color="warning" data-label="Warning">
<input type="range" data-mtx="slider" value="60" data-color="info" data-label="Info">
<input type="range" data-mtx="slider" value="60" data-color="success" data-label="Success">
{{< /mtx-demo >}}

## States

Hovering the thumb shows an 8px halo, keyboard focus shows the same halo and dragging grows it to 14px (pressed). `data-disabled` renders the slider in grey and blocks interaction.

{{< mtx-demo title="Enabled and disabled" layout="column" >}}
<input type="range" data-mtx="slider" value="35" data-value-label-display="auto" data-label="Enabled">
<input type="range" data-mtx="slider" value="35" data-disabled data-label="Disabled">
<input type="range" data-mtx="slider" data-range data-value="20,70" data-disabled data-label="Disabled range">
{{< /mtx-demo >}}

## Value label

The value label is a Material Design 2 teardrop balloon. `data-value-label-display` is `off` (default), `auto` (on hover, focus and drag) or `on` (always visible). `data-value-label-format` replaces `{value}` with the localized number and is also used as `aria-valuetext`.

{{< mtx-demo title="Value label" layout="column" >}}
<div class="mtx-pt-5">
  <input type="range" data-mtx="slider" value="30" data-value-label-display="auto" data-label="Auto label">
</div>
<div class="mtx-pt-5">
  <input type="range" data-mtx="slider" min="-10" max="40" value="21" data-value-label-display="on" data-value-label-format="{value} °C" data-label="Temperature">
</div>
{{< /mtx-demo >}}

## Marks

`data-marks="true"` adds a mark at every `step`; a `"value:label,…"` list adds labelled marks (a JSON array `[{"value":0,"label":"0 °C"}]` also works). With `data-marks-only` the value can only land on a mark, like MUI's `step={null}`.

{{< mtx-demo title="Marks" layout="column" >}}
<input type="range" data-mtx="slider" value="30" step="10" data-marks="true" data-value-label-display="auto" data-label="Steps of 10">
<input type="range" data-mtx="slider" value="20" data-marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" data-value-label-display="auto" data-value-label-format="{value} °C" data-label="Temperature with marks">
<input type="range" data-mtx="slider" value="37" data-marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" data-marks-only data-value-label-display="auto" data-value-label-format="{value} °C" data-label="Restricted temperature">
{{< /mtx-demo >}}

## Edge mark labels

As in MUI, each mark label is centered on its mark, so the labels at `min` and `max` overflow the rail by half their width. In narrow containers (cards, side panels, 390px phones) add `data-marks-inset`: the first label aligns to the start of the rail and the last one to the end (bottom/top in vertical, mirrored in RTL), while the intermediate labels stay centered.

{{< mtx-demo title="Edge mark labels" layout="column" >}}
<div data-mtx="container" data-max-width="xs" data-disable-gutters>
<div data-mtx="card" data-variant="outlined">
<div data-mtx="card-content">
<input type="range" data-mtx="slider" value="37" data-marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" data-label="Temperature, centered edge labels">
<input type="range" data-mtx="slider" value="37" data-marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" data-marks-inset data-label="Temperature, inset edge labels">
<input type="range" data-mtx="slider" value="2" min="1" max="3" data-marks="1:Minimum,2:Medium,3:Maximum" data-marks-only data-marks-inset data-label="Quality">
</div>
</div>
</div>
{{< /mtx-demo >}}

## Range slider

`data-range` with `data-value="20,60"` creates two thumbs, each with its own native input named `{name}-start` and `{name}-end` and labelled "Minimum" / "Maximum". When the thumbs cross they swap, as in MUI; `data-disable-swap` blocks them and `data-min-distance` enforces a minimum gap.

{{< mtx-demo title="Range" layout="column" >}}
<input type="range" data-mtx="slider" name="price" data-range data-value="20,60" data-value-label-display="auto" data-label="Price">
<input type="range" data-mtx="slider" data-range data-value="30,50" data-disable-swap data-value-label-display="auto" data-label="No swap">
<input type="range" data-mtx="slider" data-range data-value="30,50" data-min-distance="10" data-value-label-display="auto" data-label="Minimum distance">
{{< /mtx-demo >}}

{{< callout type="info" title="Form submission" >}}
A range slider submits two fields: `price-start` and `price-end` for `name="price"`. In the full BEM syntax you write both inputs yourself and keep their names.
{{< /callout >}}

## Track

`data-track` is `normal` (default), `inverted` (highlights the part after the value) or `false` (no track, useful with marks).

{{< mtx-demo title="Track" layout="column" >}}
<input type="range" data-mtx="slider" value="30" data-track="inverted" data-marks="0:0,25:25,50:50,75:75,100:100" data-label="Inverted track">
<input type="range" data-mtx="slider" value="37" data-track="false" data-marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" data-label="No track">
{{< /mtx-demo >}}

## Vertical

`data-orientation="vertical"` grows from bottom to top (200px by default; change it with `--mtx-slider-vertical-length`). The native input gets `aria-orientation="vertical"`.

{{< mtx-demo title="Vertical" >}}
<input type="range" data-mtx="slider" data-orientation="vertical" value="30" data-value-label-display="auto" data-label="Vertical">
<input type="range" data-mtx="slider" data-orientation="vertical" data-range data-value="20,70" data-value-label-display="auto" data-label="Vertical range">
<input type="range" data-mtx="slider" data-orientation="vertical" value="37" data-color="secondary" data-marks="0:0 °C,20:20 °C,37:37 °C,100:100 °C" data-label="Vertical temperature">
{{< /mtx-demo >}}

## Right-to-left

Inside a `dir="rtl"` container the value grows from right to left and the left arrow key increases it.

{{< mtx-demo title="RTL" layout="column" >}}
<div dir="rtl">
  <input type="range" data-mtx="slider" value="30" data-marks="0:0,50:50,100:100" data-value-label-display="auto" data-label="RTL slider">
</div>
{{< /mtx-demo >}}

## Real-world examples

A price filter that syncs a summary while dragging (`mtx:slider:input`) and submits both native inputs.

{{< mtx-demo title="Price filter" layout="column" >}}
<form class="mtx-d-flex mtx-flex-column mtx-gap-2" id="doc-slider-filter-form" aria-label="Product filter">
  <span class="mtx-typography--subtitle2" id="doc-slider-filter-label">Price (USD)</span>
  <input type="range" data-mtx="slider" id="doc-slider-filter" name="price" min="0" max="1000" step="10" data-range data-value="200,700" data-min-distance="50" data-value-label-display="auto" data-value-label-format="${value}" aria-labelledby="doc-slider-filter-label">
  <div class="mtx-d-flex mtx-align-items-center mtx-gap-2">
    <span class="mtx-typography--body2" id="doc-slider-filter-range" aria-live="polite">$200 – $700</span>
    <button class="mtx-button mtx-button--contained" data-mtx="button" type="submit">Apply filter</button>
  </div>
</form>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-slider-filter');
  var slider = Materix.init(el);
  var text = document.getElementById('doc-slider-filter-range');
  var form = document.getElementById('doc-slider-filter-form');
  slider.element.addEventListener('mtx:slider:input', function (event) {
    text.textContent = '$' + event.detail.value[0] + ' – $' + event.detail.value[1];
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var data = new FormData(form);
    text.textContent = 'Applied: price-start=' + data.get('price-start') + ', price-end=' + data.get('price-end');
  });
});
</script>

## Full BEM syntax

For SSR you can write the full structure: a `.mtx-slider` container, rail, track and one `.mtx-slider__thumb` per input (two for a range). The library reuses the nodes and adds the missing value labels and marks.

```html
<span class="mtx-slider" data-mtx="slider" data-value-label-display="auto">
  <span class="mtx-slider__rail"></span>
  <span class="mtx-slider__track"></span>
  <span class="mtx-slider__thumb">
    <input type="range" class="mtx-slider__input" name="brightness" min="0" max="10" value="4" aria-label="Brightness">
  </span>
</span>
```

## Programmatic usage

`Materix.getInstance(el)` works with the original input or with the generated `.mtx-slider` container. `value` is a number (or `[start, end]` in range mode) and can be set without firing events.

```javascript
const input = document.querySelector('#volume');
const slider = Materix.getInstance(input);

console.log(slider.value);   // 30
slider.value = 75;           // rounded to step and clamped to [min, max]
slider.max = 200;            // min / max / step setters re-clamp the value

slider.element.addEventListener('mtx:slider:input', (event) => {
  console.log('Dragging:', event.detail.value);
});
slider.element.addEventListener('mtx:slider:change', (event) => {
  console.log('Committed:', event.detail.value);
});

slider.disable();
slider.enable();
slider.focus(1);             // focuses the second thumb of a range
slider.destroy();            // removes listeners and restores the original <input>
```

With ES modules:

```javascript
import { Slider } from 'materix-ui';
const price = new Slider(document.querySelector('#price'));
price.value = [100, 400];
```

{{< mtx-demo title="value and events" layout="column" >}}
<input type="range" data-mtx="slider" id="doc-slider" value="40" data-value-label-display="auto" data-label="Controlled slider">
<div class="mtx-d-flex mtx-gap-1 mtx-flex-wrap">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-slider-set">slider.value = 75</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-slider-disable">disable()</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-slider-enable">enable()</button>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-slider');
  var slider = Materix.init(el);
  var status = el.closest('.doc-demo') && el.closest('.doc-demo').querySelector('.doc-demo-status');
  function show(message) { if (status) status.textContent = message; }
  slider.element.addEventListener('mtx:slider:input', function (event) { show('mtx:slider:input → ' + event.detail.value); });
  slider.element.addEventListener('mtx:slider:change', function (event) { show('mtx:slider:change → ' + event.detail.value); });
  document.getElementById('doc-slider-set').addEventListener('click', function () { slider.value = 75; show('value = ' + slider.value); });
  document.getElementById('doc-slider-disable').addEventListener('click', function () { slider.disable(); show('disabled'); });
  document.getElementById('doc-slider-enable').addEventListener('click', function () { slider.enable(); show('enabled'); });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `slider` | — | Initialization (on the `<input type="range">` or on a `.mtx-slider` container). |
| `min`, `max`, `step` (or `data-min`, `data-max`, `data-step`) | number | `0`, `100`, `1` | Scale and increment. Native attributes take precedence. |
| `value` / `data-value` | number, or `"start,end"` in range mode | midpoint (single), `min,max` (range) | Initial value, rounded to the step. |
| `data-label` | text | — | Accessible name (`aria-label`); in range mode it prefixes "Minimum" / "Maximum". |
| `data-size` | `small` \| `medium` | `medium` | 2px / 4px rail, 12px / 20px thumb. |
| `data-color` | `primary` \| `secondary` \| `error` \| `warning` \| `info` \| `success` | `primary` | Palette color. |
| `data-orientation` | `horizontal` \| `vertical` | `horizontal` | Orientation. |
| `data-range` | boolean | — | Two thumbs (`{name}-start` / `{name}-end`). |
| `data-disable-swap` | boolean | — | Range: the active thumb stops at the other one instead of swapping. |
| `data-min-distance` | number | `0` | Range: minimum distance between the thumbs. |
| `data-marks` | `true` \| `"value:label,…"` \| JSON | — | Marks at each step or at the listed values. |
| `data-marks-only` | boolean | — | Restricts values to the marks (MUI `step={null}`). |
| `data-marks-inset` | boolean | — | Keeps the `min`/`max` mark labels inside the rail (first aligned to the start, last to the end). |
| `data-value-label-display` | `off` \| `auto` \| `on` | `off` | Value label visibility. |
| `data-value-label-format` | text with `{value}` | — | Label format; also used as `aria-valuetext`. |
| `data-track` | `normal` \| `inverted` \| `false` | `normal` | Track mode. |
| `data-disabled` (or `disabled`) | boolean | — | Disables the slider. |

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-slider` | Root container (generated around the input). |
| `mtx-slider--small` | Small size. |
| `mtx-slider--secondary`, `--error`, `--warning`, `--info`, `--success` | Colors. |
| `mtx-slider--vertical` | Vertical orientation. |
| `mtx-slider--marked` | Has labelled marks (reserves space for the labels). |
| `mtx-slider--marks-inset` | Edge mark labels aligned inside the rail (`data-marks-inset`). |
| `mtx-slider--track-inverted`, `--track-false` | Track modes. |
| `mtx-slider--label-off`, `--label-auto`, `--label-on` | Value label mode. |
| `mtx-slider--dragging`, `--disabled` | States applied by the JS. |
| `mtx-slider__rail` | Full rail (38% opacity). |
| `mtx-slider__track` | Filled part of the rail. |
| `mtx-slider__thumb` | Thumb; `--active` while dragging, `--focused` when its input has focus. |
| `mtx-slider__input` | Visually hidden native range input. |
| `mtx-slider__value-label`, `__value-label-text` | Teardrop value label (`aria-hidden`). |
| `mtx-slider__mark`, `__mark--active` | Mark dot; active inside the track. |
| `mtx-slider__mark-label`, `__mark-label--active` | Mark label. |
| `mtx-slider__mark-label--start`, `--end` | Labels of the marks at `min` and `max` (only change alignment with `--marks-inset`). |

### Methods

| Method | Returns | Description |
| :--- | :--- | :--- |
| `value` (get/set) | `number \| number[]` | Current value (`[start, end]` in range mode). The setter accepts a number, an array or `"a,b"`, rounds, clamps and fires no events. |
| `min`, `max`, `step` (get/set) | `number` | Scale; the setters update the inputs, regenerate step marks and re-clamp the value. |
| `range`, `orientation`, `inputs` (properties) | `boolean` / `string` / `HTMLInputElement[]` | Read on init. |
| `formatValue(value)` | `string` | Text used by the value label and `aria-valuetext`. |
| `disable()` / `enable()` / `disabled` | `void` / `boolean` | Disabled state. |
| `focus(index = 0)` | `void` | Focuses a thumb. |
| `destroy()` | `void` | Removes listeners and, for the single-element syntax, restores the original `<input>`. |

### Events

| Event | detail | Fired when |
| :--- | :--- | :--- |
| `mtx:slider:input` (bubbles) | `{ value, activeThumb }` | The value changes while dragging or with the keyboard. |
| `mtx:slider:change` (bubbles) | `{ value }` | The pointer is released with a new value, or after a keyboard change. Not fired when `value` is set from code. |
| `input` / `change` (native, on the active input) | — | Mirrors the above for forms and frameworks. |

### CSS variables

| Variable | Use |
| :--- | :--- |
| `--mtx-slider-color`, `--mtx-slider-contrast` | Main color and value label text color (set by `data-color`). |
| `--mtx-slider-thickness`, `--mtx-slider-thumb-size` | Rail thickness and thumb size. |
| `--mtx-slider-halo` | Hover/focus/pressed halo color (16% alpha). |
| `--mtx-slider-vertical-length` | Height of a vertical slider (200px). |
| `--mtx-slider-label-size` | Minimum value label size (32px). |
| `--mtx-slider-disabled-color` | Disabled color (grey 400 / grey 600 in dark theme). |

## Accessibility

- Each thumb is a native `<input type="range">`: the browser exposes `role="slider"`, `aria-valuemin`, `aria-valuemax` and `aria-valuenow`. With `data-value-label-format` the component also sets `aria-valuetext` ("21 °C").
- Name it with `data-label`, `aria-label` or `aria-labelledby`. In range mode each thumb gets a translated name: "Price: Minimum" / "Price: Maximum" ("Precio: Mínimo" / "Precio: Máximo" in Spanish).
- Vertical sliders set `aria-orientation="vertical"`. The value label and marks are decorative (`aria-hidden`).
- The focus indicator is the 8px halo around the thumb; animations are disabled with `prefers-reduced-motion`.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> | Moves focus to the thumb (each thumb of a range is a tab stop). |
| <kbd>→</kbd> / <kbd>↑</kbd> | Increases by one step (in RTL, <kbd>←</kbd> increases). |
| <kbd>←</kbd> / <kbd>↓</kbd> | Decreases by one step. |
| <kbd>Page Up</kbd> / <kbd>Page Down</kbd> | Increases / decreases by 10% of the range. |
| <kbd>Home</kbd> / <kbd>End</kbd> | Sets the minimum / maximum. |
