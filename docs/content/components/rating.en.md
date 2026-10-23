---
title: "Rating"
description: "Star rating to review a product or display an average score, accessible through native radios and the keyboard."
group: "inputs"
icon: "star_half"
weight: 55
example: "rating"
mui: "https://mui.com/material-ui/react-rating/"
---

**Rating** lets the user pick a score from 1 to N icons (stars by default) or displays an average in read-only mode. As in MUI, it is backed by hidden native radios with labels ("3 Stars"), so it works with the keyboard, screen readers and forms without extra JavaScript. For a long numeric scale use a [Select](../select/) or a number field.

## Basic usage

A single `<span data-mtx="rating">` renders five stars. `data-value` sets the initial value and `data-name` the radios' `name` (submitted with the form). Clicking the current value clears it.

{{< mtx-demo title="Basic usage" >}}
<span data-mtx="rating" data-value="3" data-name="product-score" aria-label="Product rating"></span>
{{< /mtx-demo >}}

## Precision

`data-precision="0.5"` allows half stars: each star contains two radios and its left half picks the x.5 value. Fractions such as `0.25` also work.

{{< mtx-demo title="Precision" layout="column" >}}
<span data-mtx="rating" data-value="4" aria-label="Whole-star precision"></span>
<span data-mtx="rating" data-value="2.5" data-precision="0.5" aria-label="Half-star precision"></span>
{{< /mtx-demo >}}

## Sizes

MUI sizes through `data-size`: small 18px, medium 24px (default) and large 30px.

{{< callout type="info" title="Icons and size" >}}
The built-in icons (`star`, `star_border`, `star_outline`, `favorite`, `favorite_border`, `thumb_up`, `thumb_up_off_alt`, `circle`, `radio_button_unchecked`) are drawn as **SVG**, which scales without losing sharpness. Any other name uses the Material Icons glyph at its native 24px in every size: its `font-size` is never forced (Materix iconography rule).
{{< /callout >}}

{{< mtx-demo title="Sizes" layout="column" >}}
<span data-mtx="rating" data-value="4" data-size="large" aria-label="Large"></span>
<span data-mtx="rating" data-value="4" aria-label="Medium"></span>
<span data-mtx="rating" data-value="4" data-size="small" aria-label="Small"></span>
{{< /mtx-demo >}}

## With icons

`data-icon` (filled) and `data-empty-icon` (empty) accept Material Icons names. If you only set `data-icon`, the empty state uses the same icon in gray. Customize the color with `--mtx-rating-color`.

{{< mtx-demo title="Custom icons" layout="column" >}}
<span data-mtx="rating" data-value="3" data-precision="0.5" data-icon="favorite" data-empty-icon="favorite_border" style="--mtx-rating-color: var(--mtx-color-error);" aria-label="Likes"></span>
<span data-mtx="rating" data-value="2" data-empty-icon="star" aria-label="Gray stars"></span>
<span data-mtx="rating" data-value="3" data-icon="thumb_up" data-empty-icon="thumb_up_off_alt" aria-label="Approval"></span>
{{< /mtx-demo >}}

## States

Hovering previews the value (the active star grows 1.2×); with <kbd>Tab</kbd> and the arrow keys it changes with a visible focus ring. `data-read-only` displays a fixed rating and `data-disabled` dims it.

{{< mtx-demo title="Interactive, read-only, disabled and empty" layout="column" >}}
<span data-mtx="rating" data-value="2" aria-label="Interactive"></span>
<span data-mtx="rating" data-value="3.5" data-precision="0.5" data-read-only></span>
<span data-mtx="rating" data-value="2" data-disabled aria-label="Disabled"></span>
<span data-mtx="rating" aria-label="No value"></span>
{{< /mtx-demo >}}

## Highlight selected only and max

`data-highlight-selected-only` highlights only the chosen icon (satisfaction scales) and `data-max` changes the number of icons.

{{< mtx-demo title="data-highlight-selected-only and data-max" layout="column" >}}
<span data-mtx="rating" data-value="3" data-highlight-selected-only data-icon="circle" data-empty-icon="radio_button_unchecked" aria-label="Satisfaction"></span>
<span data-mtx="rating" data-value="7" data-max="10" data-size="small" aria-label="Score out of 10"></span>
{{< /mtx-demo >}}

## Hover feedback

`mtx:rating:active` reports the value under the pointer (or `null` on leave) so you can show a descriptive label, like MUI's *hover feedback* demo.

{{< mtx-demo title="Hover feedback" >}}
<span data-mtx="rating" data-value="2" data-precision="0.5" id="doc-rating-feedback" aria-label="Quality"></span>
<span id="doc-rating-feedback-text"></span>
{{< /mtx-demo >}}

```javascript
const labels = { 0.5: 'Useless', 1: 'Useless+', 1.5: 'Poor', 2: 'Poor+', 2.5: 'Ok',
  3: 'Ok+', 3.5: 'Good', 4: 'Good+', 4.5: 'Excellent', 5: 'Excellent+' };
ratingEl.addEventListener('mtx:rating:active', (event) => {
  text.textContent = labels[event.detail.value ?? rating.value] ?? 'No rating';
});
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  var labels = { 0.5: 'Useless', 1: 'Useless+', 1.5: 'Poor', 2: 'Poor+', 2.5: 'Ok', 3: 'Ok+', 3.5: 'Good', 4: 'Good+', 4.5: 'Excellent', 5: 'Excellent+' };
  var el = document.getElementById('doc-rating-feedback');
  var rating = Materix.init(el);
  var text = document.getElementById('doc-rating-feedback-text');
  function show(value) { text.textContent = labels[value] || 'No rating'; }
  show(rating.value);
  el.addEventListener('mtx:rating:active', function (event) { show(event.detail.value !== null ? event.detail.value : rating.value); });
  el.addEventListener('mtx:rating:change', function (event) { show(event.detail.value); });
});
</script>

## Real-world examples

A product summary with the read-only average and a review form that submits the value like any other radio.

{{< mtx-demo title="Product and review" layout="column" >}}
<div class="mtx-d-flex mtx-align-items-center mtx-gap-1">
  <span data-mtx="rating" data-value="4.5" data-precision="0.5" data-size="small" data-read-only></span>
  <span class="mtx-typography--body2 mtx-color-text-secondary">4.5 · 1,284 reviews</span>
</div>
<form class="mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2" aria-label="Write a review">
  <span class="mtx-typography--subtitle2" id="doc-review-label">Your rating</span>
  <span data-mtx="rating" data-name="review-score" aria-labelledby="doc-review-label"></span>
  <button class="mtx-button mtx-button--contained" data-mtx="button" type="button">Submit</button>
</form>
{{< /mtx-demo >}}

## Full BEM syntax

For SSR you can write the generated structure: one `.mtx-rating__item` per icon with its hidden radio and its `<label>` carrying `data-rating-value`. The library reuses the nodes and adds any missing icons.

```html
<span class="mtx-rating" data-mtx="rating" role="radiogroup" aria-label="Rating">
  <span class="mtx-rating__item">
    <input class="mtx-rating__input" type="radio" name="score" id="score-1" value="1" />
    <label class="mtx-rating__label" for="score-1" data-rating-value="1">
      <span class="mtx-rating__visually-hidden">1 Star</span>
    </label>
  </span>
  <!-- …one .mtx-rating__item per star… -->
  <input class="mtx-rating__input mtx-rating__input--empty" type="radio" name="score" id="score-empty" value="" />
  <label class="mtx-rating__visually-hidden" for="score-empty">Empty</label>
</span>
```

## Programmatic usage

`Materix.getInstance(el)` returns the Rating: `value` (a number or `null`) can be read and written without firing events, and `mtx:rating:change` reports user changes.

```javascript
const ratingEl = document.querySelector('#score');
const rating = Materix.getInstance(ratingEl);

console.log(rating.value);  // 3
rating.value = 4.5;         // rounded to data-precision; 0 or null clears it

ratingEl.addEventListener('mtx:rating:change', (event) => {
  console.log('New rating:', event.detail.value);
});

rating.disable();
rating.enable();
rating.focus();
```

With ES modules:

```javascript
import { init, getInstance, Rating } from '@rubenchodev/materix-ui';
const rating = new Rating(document.querySelector('#score'));
```

{{< mtx-demo title="value and mtx:rating:change" >}}
<span data-mtx="rating" data-value="3" id="doc-rating" aria-label="Controlled rating"></span>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-rating-set">rating.value = 5</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-rating-clear">rating.value = null</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-rating');
  var rating = Materix.init(el);
  var status = el.closest('.doc-demo').querySelector('.doc-demo-status');
  el.addEventListener('mtx:rating:change', function (event) {
    if (status) status.textContent = 'mtx:rating:change → ' + event.detail.value;
  });
  document.getElementById('doc-rating-set').addEventListener('click', function () {
    rating.value = 5;
    if (status) status.textContent = 'value = ' + rating.value;
  });
  document.getElementById('doc-rating-clear').addEventListener('click', function () {
    rating.value = null;
    if (status) status.textContent = 'value = ' + rating.value;
  });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `rating` | — | Initialization. |
| `data-value` | number from 0 to `data-max` | — (no value) | Initial value, rounded to the precision. `0` = no rating. |
| `data-max` | integer | `5` | Number of icons. |
| `data-precision` | `1` \| `0.5` (or fractions of 1) | `1` | Minimum step. |
| `data-name` | text | `mtx-rating-N` | The radios' `name` (form submission). |
| `data-read-only` | boolean | — | Read-only: no radios, `role="img"` and `aria-label` "Rated X out of N". |
| `data-disabled` | boolean | — | Disables the radios and dims the component. |
| `data-size` | `small` \| `medium` \| `large` | `medium` | 18 / 24 / 30px SVG icons. |
| `data-icon` | Material Icons name | `star` | Filled icon. |
| `data-empty-icon` | Material Icons name | `star_border` (or `data-icon` when set) | Empty icon. |
| `data-highlight-selected-only` | boolean | — | Highlights only the selected icon. |
| `data-label` | text | — | Accessible name (`aria-label`). |

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-rating` | Container (inline-flex, `#faaf00` color). |
| `mtx-rating--small`, `--large` | 18 and 30px sizes. |
| `mtx-rating--read-only`, `--disabled` | States (applied by the JS). |
| `mtx-rating--hovering` | While previewing with the pointer. |
| `mtx-rating__item` | One icon; `--decimal` when precision is below 1; `--active` the item under the pointer (1.2 scale). |
| `mtx-rating__label` | `<label>` (or `<span>` when read-only) with `data-rating-value`; `--filled` filled; `--partial` fraction clip. |
| `mtx-rating__icon`, `__icon--filled`, `__icon--empty` | Filled and empty icons (one is shown depending on the state). |
| `mtx-rating__input`, `__input--empty` | Hidden native radios; the empty one represents "no rating". |
| `mtx-rating__visually-hidden` | Screen-reader-only text. |

### Methods

| Method | Returns | Description |
| :--- | :--- | :--- |
| `value` (get/set) | `number \| null` | Current value; the setter rounds, clamps and fires no events. |
| `max`, `precision`, `readOnly` (properties) | `number` / `boolean` | Configuration read on init. |
| `disable()` / `enable()` / `disabled` | `void` / `boolean` | Disabled state. |
| `focus()` | `void` | Focuses the checked radio (or the first one). |
| `destroy()` | `void` | Removes the listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |

### Events

| Event | detail | Fired when |
| :--- | :--- | :--- |
| `mtx:rating:change` (bubbles) | `{ value: number \| null }` | The user changes or clears the rating. Not fired when `value` is set from code. |
| `mtx:rating:active` (bubbles) | `{ value: number \| null }` | The value under the pointer changes (`null` on leave). |
| `change` (native, on the radio) | — | The user checks a radio. |

### CSS variables

| Variable | Use |
| :--- | :--- |
| `--mtx-rating-color` | Color of the filled icons (`#faaf00`). |
| `--mtx-rating-empty-color` | Color of the empty icons (`--mtx-color-action-disabled`). |
| `--mtx-rating-icon-size` | Size of the SVG icons (18 / 24 / 30px). |
| `--mtx-disabled-opacity` | Opacity of the disabled state. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring. |

## Accessibility

- Interactive: native radios sharing a `name`, each with a translated label ("1 Star", "3 Stars"; "3 estrellas" in Spanish) plus an "Empty" radio. The browser handles mutual exclusion and the arrow keys.
- When the container has a name (`aria-label`, `aria-labelledby` or `data-label`) it gets `role="radiogroup"`.
- Read-only: `role="img"` with a translated `aria-label` ("Rated 4 out of 5" / "Valoración: 4 de 5"); the icons are decorative.
- Keyboard focus is shown as a ring around the focused icon.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> | Enters the rating (on the checked value) or leaves it. |
| <kbd>→</kbd> / <kbd>↑</kbd> | Increases the value by one precision step (reversed in RTL). |
| <kbd>←</kbd> / <kbd>↓</kbd> | Decreases the value; below the minimum it moves to "Empty". |
