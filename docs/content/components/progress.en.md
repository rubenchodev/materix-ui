---
title: "Progress"
description: "Circular and linear indicators that show an operation is in progress or how much is left before it finishes."
group: "feedback"
icon: "donut_large"
weight: 25
example: "progress"
mui: "https://mui.com/material-ui/react-progress/"
---

**Progress** brings together MUI's two indicators: **CircularProgress** (`data-mtx="circular-progress"`) and **LinearProgress** (`data-mtx="linear-progress"`). Use them to show that something is loading or being processed: indeterminate when you don't know how long it will take, determinate when you know the percentage. Don't use them for static metrics that never advance (a chart or plain text is clearer), or to block the whole screen without explanation (pair them with a text or use a [Dialog]({{< relref "/components/dialog" >}})).

## Basic usage

A single element is enough: the component generates the SVG or the bars, `role="progressbar"` and the accessible name. Without `data-value` the indicator is **indeterminate**; with `data-value` (0–100) it becomes **determinate**.

{{< mtx-demo title="Simplified syntax" >}}
<div data-mtx="circular-progress"></div>
<div data-mtx="circular-progress" data-value="75"></div>
{{< /mtx-demo >}}

{{< mtx-demo title="Linear" layout="block" >}}
<div data-mtx="stack" data-spacing="3">
  <div data-mtx="linear-progress"></div>
  <div data-mtx="linear-progress" data-value="40"></div>
</div>
{{< /mtx-demo >}}

## Variants

### Circular

`indeterminate` spins while the stroke grows and shrinks (MUI's animation); `determinate` draws an arc proportional to the value, starting at the top. `data-disable-shrink` keeps the stroke length fixed and only rotates, which helps when the main thread is busy. `data-track` adds the background ring.

{{< mtx-demo title="Indeterminate, disable shrink, determinate and with track" >}}
<div data-mtx="circular-progress"></div>
<div data-mtx="circular-progress" data-disable-shrink></div>
<div data-mtx="circular-progress" data-value="25"></div>
<div data-mtx="circular-progress" data-value="50"></div>
<div data-mtx="circular-progress" data-value="100"></div>
<div data-mtx="circular-progress" data-value="65" data-track></div>
{{< /mtx-demo >}}

### Linear

Four variants, as in MUI: `indeterminate`, `determinate`, `buffer` (inferred from `data-value-buffer`: shows the value, the preloaded part and an animated dotted pattern) and `query` (indeterminate in reverse, for the phase before loading starts). The bar is 4px tall; `data-rounded` rounds its ends.

{{< mtx-demo title="Linear variants" layout="block" >}}
<div data-mtx="stack" data-spacing="3">
  <div data-mtx="linear-progress"></div>
  <div data-mtx="linear-progress" data-value="60"></div>
  <div data-mtx="linear-progress" data-value="30" data-value-buffer="55"></div>
  <div data-mtx="linear-progress" data-variant="query"></div>
  <div data-mtx="linear-progress" data-value="70" data-rounded></div>
</div>
{{< /mtx-demo >}}

## Sizes

`data-size` sets the diameter in px (40 by default) and `data-thickness` the stroke width inside the 44-unit viewBox (3.6 by default). For the linear bar, change the `--mtx-linear-progress-height` variable.

{{< mtx-demo title="16, 24, 40, 56 and 80px" >}}
<div data-mtx="circular-progress" data-size="16"></div>
<div data-mtx="circular-progress" data-size="24"></div>
<div data-mtx="circular-progress"></div>
<div data-mtx="circular-progress" data-size="56"></div>
<div data-mtx="circular-progress" data-size="80" data-value="60"></div>
{{< /mtx-demo >}}

{{< mtx-demo title="Thickness 2, 3.6 and 6" >}}
<div data-mtx="circular-progress" data-thickness="2" data-value="70"></div>
<div data-mtx="circular-progress" data-value="70"></div>
<div data-mtx="circular-progress" data-thickness="6" data-value="70"></div>
{{< /mtx-demo >}}

## With label

`data-show-label` displays the rounded percentage: centered inside the circle (MUI's "CircularProgress with label" pattern) or to the right of the bar ("LinearProgress with label"). The number is decorative (`aria-hidden`); screen readers read the value from `aria-valuenow`.

{{< mtx-demo title="Visible percentage" >}}
<div data-mtx="circular-progress" data-value="10" data-show-label></div>
<div data-mtx="circular-progress" data-value="48" data-show-label data-track></div>
<div data-mtx="circular-progress" data-value="100" data-show-label data-color="success"></div>
{{< /mtx-demo >}}

{{< mtx-demo title="Bar with value" layout="block" >}}
<div data-mtx="stack" data-spacing="2">
  <div data-mtx="linear-progress" data-value="35" data-show-label></div>
  <div data-mtx="linear-progress" data-value="82" data-show-label data-color="secondary"></div>
</div>
{{< /mtx-demo >}}

## Colors

`data-color` accepts `primary` (default), `secondary`, `error`, `warning`, `info`, `success` and `inherit` (uses the container's text color). The linear track is the same color lightened by 62% in the light theme and darkened by 50% in the dark theme, as in MUI.

{{< mtx-demo title="Palette" >}}
<div data-mtx="circular-progress" data-color="primary"></div>
<div data-mtx="circular-progress" data-color="secondary"></div>
<div data-mtx="circular-progress" data-color="error"></div>
<div data-mtx="circular-progress" data-color="warning"></div>
<div data-mtx="circular-progress" data-color="info"></div>
<div data-mtx="circular-progress" data-color="success"></div>
<div class="mtx-color-text-secondary">
  <div data-mtx="circular-progress" data-color="inherit"></div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Colored bars" layout="block" >}}
<div data-mtx="stack" data-spacing="2">
  <div data-mtx="linear-progress" data-value="50" data-color="secondary"></div>
  <div data-mtx="linear-progress" data-value="50" data-color="error"></div>
  <div data-mtx="linear-progress" data-value="50" data-color="warning"></div>
  <div data-mtx="linear-progress" data-value="50" data-color="info"></div>
  <div data-mtx="linear-progress" data-color="success"></div>
</div>
{{< /mtx-demo >}}

## Custom scale

`data-min` and `data-max` (0 and 100 by default) let you express the value in your own units: `aria-valuenow` and `aria-valuemax` reflect those units and the component computes the percentage to draw.

{{< mtx-demo title="7 of 10 seats" layout="block" >}}
<div data-mtx="stack" data-spacing="1">
  <span class="mtx-typography--body2" id="doc-progress-seats">Team seats · 7 of 10</span>
  <div data-mtx="linear-progress" data-max="10" data-value="7" data-rounded aria-labelledby="doc-progress-seats"></div>
</div>
{{< /mtx-demo >}}

## States

- **Loading a region:** mark the container being updated with `aria-busy="true"` and remove it when done, so screen readers wait for the final content.
- **Loading button:** insert a decorative indicator with `Materix.createCircularProgress({ size: 20, color: 'inherit', decorative: true })`, set `aria-busy="true"` and `disabled` on the button and change its text.
- **Reduced motion:** with `prefers-reduced-motion: reduce` the circle spins more slowly without shrinking the stroke, indeterminate bars slow down and the buffer pattern stops.

{{< mtx-demo title="Busy region" >}}
<div class="mtx-d-flex mtx-align-items-center mtx-gap-2" aria-busy="true" aria-live="polite">
  <div data-mtx="circular-progress" data-size="24" data-label="Loading comments"></div>
  <span class="mtx-typography--body2">Loading comments…</span>
</div>
{{< /mtx-demo >}}

## Real-world examples

### File upload

{{< mtx-demo title="Upload with buffer" layout="block" >}}
<div class="mtx-card" data-mtx="card">
  <div class="mtx-card__content">
    <div data-mtx="stack" data-spacing="1">
      <span class="mtx-typography--subtitle2">Uploading 3 files</span>
      <div data-mtx="linear-progress" id="doc-progress-upload" data-value="0" data-value-buffer="10" data-show-label data-label="File upload"></div>
      <span class="mtx-typography--caption mtx-color-text-secondary" id="doc-progress-upload-status">Preparing…</span>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-progress-upload');
  if (!el) return;
  var upload = Materix.getInstance(el);
  var status = document.getElementById('doc-progress-upload-status');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setInterval(function () {
    var next = upload.value >= 100 ? 0 : upload.value + Math.round(Math.random() * 8);
    upload.setValue(Math.min(100, next));
    upload.setBuffer(Math.min(100, upload.value + 10 + Math.round(Math.random() * 10)));
    status.textContent = upload.value >= 100 ? 'Completed' : Math.round(upload.value) + '% · 3 files';
  }, reduce ? 1500 : 600);
});
</script>

### Save button with indicator

{{< mtx-demo title="Loading button" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" id="doc-progress-save">Save</button>
{{< /mtx-demo >}}

```javascript
const button = document.getElementById('doc-progress-save');
button.addEventListener('click', () => {
  const spinner = Materix.createCircularProgress({ size: 20, color: 'inherit', decorative: true });
  button.setAttribute('aria-busy', 'true');
  button.disabled = true;
  button.textContent = 'Saving…';
  button.prepend(spinner);
  saveChanges().finally(() => {
    button.removeAttribute('aria-busy');
    button.disabled = false;
    button.textContent = 'Save';
  });
});
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  var save = document.getElementById('doc-progress-save');
  if (!save) return;
  save.addEventListener('click', function () {
    if (save.getAttribute('aria-busy') === 'true') return;
    var spinner = Materix.createCircularProgress({ size: 20, color: 'inherit', decorative: true });
    save.setAttribute('aria-busy', 'true');
    save.disabled = true;
    save.textContent = 'Saving…';
    save.prepend(spinner);
    setTimeout(function () {
      save.removeAttribute('aria-busy');
      save.disabled = false;
      save.textContent = 'Save';
    }, 2000);
  });
});
</script>

## Full BEM syntax

For SSR you can render the full structure; the component reuses it without duplicating nodes and only computes the radius, arc, transforms and ARIA attributes.

```html
<span class="mtx-circular-progress" data-mtx="circular-progress" data-value="60">
  <svg class="mtx-circular-progress__svg" viewBox="22 22 44 44" aria-hidden="true" focusable="false">
    <circle class="mtx-circular-progress__track"></circle>   <!-- optional -->
    <circle class="mtx-circular-progress__circle"></circle>
  </svg>
  <span class="mtx-circular-progress__label"></span>          <!-- optional -->
</span>

<div class="mtx-linear-progress" data-mtx="linear-progress" data-value="60">
  <span class="mtx-linear-progress__track">
    <span class="mtx-linear-progress__dashed"></span>
    <span class="mtx-linear-progress__bar mtx-linear-progress__bar1"></span>
    <span class="mtx-linear-progress__bar mtx-linear-progress__bar2"></span>
  </span>
  <span class="mtx-linear-progress__label"></span>            <!-- optional -->
</div>
```

## Programmatic usage

`[data-mtx="circular-progress"]` and `[data-mtx="linear-progress"]` elements initialize themselves. For dynamic content use `Materix.init(el)` or the classes; `Materix.getInstance(el)` returns the instance.

```javascript
// UMD (window.Materix)
const el = document.createElement('div');
el.setAttribute('data-value', '0');
container.append(el);
const linear = Materix.init(el, 'linear-progress');   // or: new Materix.LinearProgress(el)

linear.setValue(40);          // clamps to [min, max] and updates aria-valuenow
linear.value += 10;           // equivalent getter/setter
linear.setBuffer(70);         // switches to the buffer variant
linear.color = 'success';
linear.variant = 'indeterminate';

// Circular indicator ready to insert (e.g. inside a button)
const spinner = Materix.createCircularProgress({ size: 20, color: 'inherit', decorative: true });
```

```javascript
// ES modules
import { CircularProgress, createCircularProgress } from 'materix-ui';

const circular = new CircularProgress(document.querySelector('#progress'));
circular.setValue(80);
```

{{< mtx-demo title="setValue(), color and variant" >}}
<div data-mtx="circular-progress" id="doc-progress-api-circular" data-value="30" data-show-label data-size="56"></div>
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-progress-dec">-10</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-progress-inc">+10</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-progress-color">Change color</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-progress-indet">Indeterminate</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-progress-api-circular');
  if (!el) return;
  var p = Materix.getInstance(el);
  var colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];
  var i = 0;
  document.getElementById('doc-progress-dec').addEventListener('click', function () { p.setValue(p.value - 10); });
  document.getElementById('doc-progress-inc').addEventListener('click', function () { p.setValue(p.value + 10); });
  document.getElementById('doc-progress-color').addEventListener('click', function () { i = (i + 1) % colors.length; p.color = colors[i]; });
  document.getElementById('doc-progress-indet').addEventListener('click', function () { p.variant = 'indeterminate'; });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `circular-progress` \| `linear-progress` | — | Initializes the component. |
| `data-variant` | circular: `indeterminate` \| `determinate`; linear: also `buffer` \| `query` | inferred | When not set: `buffer` if `data-value-buffer` is present (linear), `determinate` if `data-value` is present, otherwise `indeterminate`. |
| `data-value` | number | `data-min` | Current value, clamped to `[data-min, data-max]`. |
| `data-value-buffer` | number | `data-max` | Linear only: buffer value. |
| `data-min` / `data-max` | number | `0` / `100` | Scale range; reflected in `aria-valuemin` / `aria-valuemax`. |
| `data-color` | `primary` \| `secondary` \| `error` \| `warning` \| `info` \| `success` \| `inherit` | `primary` | Palette color. |
| `data-size` | number (px) | `40` | Circular only: diameter. |
| `data-thickness` | number | `3.6` | Circular only: stroke width (units of the 44 viewBox). |
| `data-disable-shrink` | boolean (presence) | absent | Circular only: disables the stroke shrink animation. |
| `data-track` | boolean (presence) | absent | Circular only: background ring `.mtx-circular-progress__track`. |
| `data-rounded` | boolean (presence) | absent | Linear only: rounded ends. |
| `data-show-label` | boolean (presence) | absent | Shows the rounded percentage (centered or to the right). |
| `data-label` | text | i18n `progress.loading` (`Loading` / `Cargando`) | Accessible name (`aria-label`). Ignored when `aria-labelledby` is set; your own `aria-label` is kept. |
| `data-decorative` | boolean (presence) | absent | Removes `role` and `aria-*` and sets `aria-hidden="true"` (indicator inside a control that already announces loading). |

### CSS classes

| Class | Description |
|---|---|
| `.mtx-circular-progress` | Circular root (`inline-flex`, sized by `--mtx-circular-progress-size`). |
| `.mtx-circular-progress--indeterminate` / `--determinate` | Active variant. |
| `.mtx-circular-progress--disable-shrink` | No stroke animation. |
| `.mtx-circular-progress--track` / `--with-label` | With background ring / with label. |
| `.mtx-circular-progress--{color}` | Palette color or `inherit`. |
| `.mtx-circular-progress__svg` | SVG (`viewBox="22 22 44 44"`), rotates when indeterminate. |
| `.mtx-circular-progress__circle` | Progress arc (`stroke: currentColor`). |
| `.mtx-circular-progress__track` | Background ring (`--mtx-color-action-selected`). |
| `.mtx-circular-progress__label` | Centered percentage (caption, `text-secondary`). |
| `.mtx-linear-progress` | Linear root (full-width block). |
| `.mtx-linear-progress--indeterminate` / `--determinate` / `--buffer` / `--query` | Active variant. |
| `.mtx-linear-progress--rounded` / `--with-label` | Rounded ends / with label (flex). |
| `.mtx-linear-progress--{color}` | Palette color or `inherit`. |
| `.mtx-linear-progress__track` | 4px track with `overflow: hidden`. |
| `.mtx-linear-progress__bar` / `__bar1` / `__bar2` | Bars: value (1) and buffer or second indeterminate bar (2). |
| `.mtx-linear-progress__dashed` | Dotted pattern of the buffer variant. |
| `.mtx-linear-progress__label` | Percentage on the right (body2, `text-secondary`). |

### Methods

| Method | Returns | Description |
|---|---|---|
| `setValue(n)` | instance | Sets the clamped value; an `indeterminate`/`query` variant switches to `determinate`. |
| `value` (get/set) | `number` | Current value in `[min, max]` units. |
| `percent` (get) | `number` | Value as a 0–100 percentage. |
| `variant` (get/set) | `string` | Current variant; unsupported values are ignored. |
| `color` (get/set) | `string` | Palette color; an invalid value applies `primary`. |
| `size` (get, circular) | `number` | Diameter in px. |
| `setBuffer(n)` (linear) | instance | Sets the buffer and switches to the `buffer` variant. |
| `valueBuffer` (get/set, linear) | `number` | Buffer value. |
| `Materix.createCircularProgress(options)` | `HTMLElement` | Creates an already initialized circular `<span>`. Options: `size` (40), `thickness` (3.6), `color` (`primary`), `value`, `label`, `decorative` (false), `disableShrink` (false), `className`, `tagName` (`span`). |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-{color}` | Color of the arc and the bar. |
| `--mtx-circular-progress-size` | Diameter (set by `data-size`). |
| `--mtx-circular-progress-duration` | Rotation duration (1.4s; 4s with reduced motion). |
| `--mtx-linear-progress-height` | Bar height (4px). |
| `--mtx-linear-progress-radius` | Bar radius (0; half the height with `data-rounded`). |
| `--mtx-linear-progress-duration` | Indeterminate animation duration (2.1s; 6s with reduced motion). |
| `--mtx-progress-track-mix` / `--mtx-progress-track-amount` | Track mix: 38% of the color with `#fff` (light) or 50% with `#000` (dark). |
| `--mtx-color-action-selected` | Background ring of `data-track`. |

## Accessibility

- The root gets `role="progressbar"` and an accessible name: `data-label`, `aria-label` or `aria-labelledby`; if none is present, i18n `progress.loading` ("Loading" / "Cargando" depending on the document language or `data-locale`).
- `aria-valuenow`, `aria-valuemin` and `aria-valuemax` are only exposed for `determinate` and `buffer`; they are removed for `indeterminate` and `query`, as WAI-ARIA recommends.
- The SVG and the percentage label have `aria-hidden="true"`, so the value is announced only once.
- Mark the region being loaded with `aria-busy="true"` and, if you want the result announced, with `aria-live="polite"`.
- Inside a button or another control that already communicates loading (`aria-busy`, "Saving…" text), use `data-decorative` or `createCircularProgress({ decorative: true })` to avoid a duplicate announcement.
- Honors `prefers-reduced-motion`: slower rotation without shrinking, slower bars and a static buffer pattern.
- It is not interactive: it doesn't receive focus or respond to the keyboard.
