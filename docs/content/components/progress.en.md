---
title: "Progress"
description: "Circular and linear indicators that show an operation is in progress or how much is left before it finishes."
group: "feedback"
icon: "donut_large"
weight: 25
example: "progress"
import: "CircularProgress, LinearProgress"
mui: "https://mui.com/material-ui/react-progress/"
---

**Progress** tells the user that an operation is running. `CircularProgress` fits small spaces (buttons, cards, a loading page) and `LinearProgress` is placed at the edge of a container or next to the task it measures. Use the **indeterminate** variant when the remaining time is unknown and **determinate** when you know the percentage.

## Import

```tsx
import { CircularProgress, LinearProgress } from '@rubenchodev/materix-react';
```

## Basic usage

A single `<CircularProgress />` or `<LinearProgress />` renders the SVG or the bars, `role="progressbar"` and the accessible name. Without `value` it is indeterminate; with `value` it becomes determinate.

{{< react-demo id="progress/01-basic" layout="block" >}}

## Variants

### Circular

As in MUI: `indeterminate` (spins with a stroke that grows and shrinks), `determinate` (an arc proportional to `value`) and `disableShrink` (spin only, useful when the main thread is very busy). `track` adds the background ring.

{{< react-demo id="progress/02-circular" layout="block" >}}

### Linear

Four variants: `indeterminate`, `determinate`, `buffer` (inferred from `valueBuffer`) and `query` (reversed indeterminate, for the phase before loading starts). 4px high, as in MUI; `rounded` rounds the ends.

{{< react-demo id="progress/03-linear" layout="block" >}}

## Sizes

`size` sets the diameter in px (40 by default) and `thickness` the stroke width (3.6). The height of the linear bar is changed with the `--mtx-linear-progress-height` variable.

{{< react-demo id="progress/04-sizes" layout="column" >}}

## With label

`showLabel` shows the rounded percentage: centered in the circle and to the right of the bar. The visual figure is `aria-hidden`; screen readers get the value from `aria-valuenow`.

{{< react-demo id="progress/05-with-label" layout="block" >}}

## Colors

`color` accepts the palette colors and `inherit` (takes the container's text color). The linear track is lightened in the light theme and darkened in the dark theme.

{{< react-demo id="progress/06-colors" layout="block" >}}

## Custom scale

`min` and `max` change the scale (0–100 by default): `<LinearProgress max={10} value={7} />` exposes `aria-valuemax="10"` and fills 70%. If `max <= min`, `max` becomes `min + 100`. The value is clamped to the range.

## States

The default accessible name is "Loading" / "Cargando" depending on the language (`I18nProvider`, `<html lang>` or the `locale` prop). Customize it with `label`, `aria-label` or `aria-labelledby`. Mark the region being updated with `aria-busy="true"` while it loads.

{{< react-demo id="progress/07-states" layout="block" >}}

## Real-world examples

File upload with value and buffer, seat and storage usage on a custom scale, and a [Button](../button/) with `loading`, which uses a decorative `CircularProgress` inside.

{{< react-demo id="progress/08-real-world" layout="block" >}}

## Grid layout

The linear bar fills the width of its column; the circular indicator is centered with flex.

{{< react-demo id="progress/09-grid" layout="block" >}}

## Programmatic usage

Progress is a controlled component: update `value`, `valueBuffer`, `color` or `variant` from your state. Passing `value={undefined}` switches back to indeterminate.

{{< react-demo id="progress/10-programmatic" layout="block" >}}

## API reference

### CircularProgress props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'indeterminate' \| 'determinate'` | inferred | `determinate` if there is `value`. |
| `value` | `number` | — | Current value within [`min`, `max`]. |
| `min` / `max` | `number` | `0` / `100` | Scale. |
| `size` | `number` | `40` | Diameter in px. |
| `thickness` | `number` | `3.6` | Stroke width. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success' \| 'inherit'` | `'primary'` | Palette color. |
| `disableShrink` | `boolean` | `false` | Spin without shrinking the stroke. |
| `track` | `boolean` | `false` | Background ring. |
| `showLabel` | `boolean` | `false` | Centered percentage. |
| `label` | `string` | "Loading" | Accessible name. |
| `decorative` | `boolean` | `false` | Hidden from screen readers (`aria-hidden`). |
| `locale` | `string` | context | Language of the default name. |
| `component` | `ElementType` | `'span'` | Root element. |

### LinearProgress props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'indeterminate' \| 'determinate' \| 'buffer' \| 'query'` | inferred | `buffer` with `valueBuffer`, `determinate` with `value`. |
| `value` | `number` | — | Current value. |
| `valueBuffer` | `number` | `max` | Buffer value. |
| `min` / `max` | `number` | `0` / `100` | Scale. |
| `color` | same as circular | `'primary'` | Palette color. |
| `rounded` | `boolean` | `false` | Rounded ends. |
| `showLabel` | `boolean` | `false` | Percentage to the right. |
| `label` · `decorative` · `locale` · `component` | — | — | As in CircularProgress. |

Other props go to the root; `className` is merged, `style` is combined and `ref` points to the root.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-circular-progress` · `--{indeterminate,determinate}` · `--{color}` | Circular root. |
| `mtx-circular-progress--disable-shrink` · `--track` · `--with-label` | Modifiers. |
| `mtx-circular-progress__svg` · `__track` · `__circle` · `__label` | SVG, ring, arc and label. |
| `mtx-linear-progress` · `--{indeterminate,determinate,buffer,query}` · `--{color}` | Linear root. |
| `mtx-linear-progress--rounded` · `--with-label` | Modifiers. |
| `mtx-linear-progress__track` · `__dashed` · `__bar` · `__bar1` · `__bar2` · `__label` | Track, buffer pattern, bars and label. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-{color}` | Color of the arc and the bar. |
| `--mtx-circular-progress-size` | Diameter (set by `size`). |
| `--mtx-circular-progress-duration` | Rotation duration. |
| `--mtx-linear-progress-height` | Bar height (4px). |
| `--mtx-linear-progress-radius` | Bar radius. |

### Equivalence with the vanilla version

| Vanilla | React |
| :--- | :--- |
| `data-mtx="circular-progress"` / `"linear-progress"` | `<CircularProgress />` / `<LinearProgress />` |
| `data-value` · `data-value-buffer` · `data-min` · `data-max` | `value` · `valueBuffer` · `min` · `max` |
| `data-variant` · `data-color` | `variant` · `color` |
| `data-size` · `data-thickness` · `data-disable-shrink` · `data-track` | `size` · `thickness` · `disableShrink` · `track` |
| `data-show-label` · `data-rounded` | `showLabel` · `rounded` |
| `data-label` · `data-decorative` | `label` · `decorative` |
| `setValue()` · `setBuffer()` · `color =` · `variant =` | props (controlled) |
| `Materix.createCircularProgress({ decorative: true })` | `<CircularProgress decorative />` |

## Accessibility

- The root has `role="progressbar"` and an accessible name: `label`, `aria-label` or `aria-labelledby`; if none is present, "Loading" / "Cargando".
- `aria-valuenow`, `aria-valuemin` and `aria-valuemax` are only exposed for `determinate` and `buffer`, as WAI-ARIA recommends.
- The SVG and the percentage label have `aria-hidden="true"`, so the value is announced only once.
- Inside a control that already communicates loading (`aria-busy`), use `decorative` to avoid a duplicate announcement.
- Honors `prefers-reduced-motion`. It is not interactive: it doesn't receive focus.
