---
title: "Slider"
description: "Lets users pick a value or a range by dragging along a track, built on accessible native range inputs."
group: "inputs"
icon: "tune"
weight: 57
example: "slider"
import: "Slider"
mui: "https://mui.com/material-ui/react-slider/"
---

**Slider** lets the user select a value (or a range) from a continuous or stepped scale: volume, brightness, price filters, temperatures. As in MUI, every thumb is backed by a visually hidden native `<input type="range">`, so the keyboard, screen readers and form submission work without extra code. For an exact number the user must type, use a text field with `type="number"`; for a few discrete options, use [Radio](../radio/) buttons.

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Slider } from '@rubenchodev/materix-react';

<Slider aria-label="Volume" name="volume" defaultValue={30} />
```

## Basic usage

One element is enough: the component renders the rail, the track, the thumb with its native input and the value label. Name it with `aria-label` (or `aria-labelledby`).

{{< react-demo "slider/01-basic" >}}

## Sizes

Two sizes, as in MUI: medium (4px rail, 20px thumb) and small (2px rail, 12px thumb without shadow) with `size="small"`.

{{< react-demo "slider/02-sizes" >}}

## With icons

The slider fills the available width, so decorative icons go next to it inside a horizontal [Stack](../stack/) (MUI's "Volume" pattern).

{{< react-demo "slider/03-icons" >}}

## Colors

`color` accepts the MUI palette: `primary` (default), `secondary`, `error`, `warning`, `info` and `success`.

{{< react-demo "slider/04-colors" >}}

## States

Hovering the thumb shows an 8px halo, keyboard focus shows the same halo and dragging grows it to 14px (pressed). `disabled` renders the slider in grey and blocks interaction.

{{< react-demo "slider/05-states" >}}

## Value label

The value label is a Material Design 2 teardrop balloon. `valueLabelDisplay` is `off` (default), `auto` (on hover, focus and drag) or `on` (always visible). `valueLabelFormat` accepts a template with `{value}` (the localized number, also used as `aria-valuetext`) or a function `(value, index) => ReactNode`; `getAriaValueText` sets a different spoken text.

{{< react-demo "slider/06-value-label" >}}

## Marks

`marks` (boolean) adds a mark at every `step`; an array `[{ value, label }]` adds labelled marks (labels can be any node), and the vanilla string syntax `"0:0 °C,20:20 °C"` works too. With `step={null}` the value can only land on a mark.

{{< react-demo "slider/07-marks" >}}

## Edge mark labels

Each mark label is centered on its mark, so the labels at `min` and `max` overflow the rail by half their width. In narrow containers add `marksInset`: the first label aligns to the start of the rail and the last one to the end (bottom/top in vertical, mirrored in RTL).

{{< react-demo "slider/08-marks-inset" >}}

## Range slider

An array value (`defaultValue={[20, 60]}`) or `range` creates two thumbs, each with its own native input named `{name}-start` and `{name}-end` and labelled "Minimum" / "Maximum" (prefixed with `aria-label` or the `aria-labelledby` text). When the thumbs cross they swap, as in MUI; `disableSwap` blocks them and `minDistance` enforces a minimum gap.

{{< react-demo "slider/09-range" >}}

{{< callout type="info" title="Form submission" >}}
A range slider submits two fields: `price-start` and `price-end` for `name="price"`. `form.reset()` does not restore the slider (same as vanilla and MUI): reset its value from state.
{{< /callout >}}

## Track

`track` is `normal` (default), `inverted` (highlights the part after the value) or `false` (no track, useful with marks).

{{< react-demo "slider/10-track" >}}

## Vertical

`orientation="vertical"` grows from bottom to top (200px by default; change it with `--mtx-slider-vertical-length`). The native input gets `aria-orientation="vertical"`.

{{< react-demo "slider/11-vertical" >}}

## Right-to-left

Inside a `dir="rtl"` container the value grows from right to left, dragging follows the mirrored axis and the left arrow key increases it.

{{< react-demo "slider/12-rtl" >}}

## Real-world examples

A controlled price filter that updates a summary while dragging and submits both native inputs.

{{< react-demo "slider/13-use-cases" >}}

## Grid

Inside a [Grid](../grid/) each slider fills its column: one on mobile, two from 600px and three from 900px.

{{< react-demo "slider/14-grid" >}}

## Controlled usage

With `value` + `onChange` the parent owns the state. `onChange` fires while dragging or with the keyboard and `onChangeCommitted` when the pointer is released (or after a keyboard change). The vanilla setters (`value`, `max`, `disable()`) become prop changes and `focus()` uses `inputRef`.

{{< react-demo id="slider/15-controlled" layout="block" >}}

## API reference

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `number \| number[]` | — | Value (controlled); an array means range. |
| `defaultValue` | `number \| number[]` | midpoint / `[min, max]` | Initial value (uncontrolled). |
| `range` | `boolean` | `false` | Forces two thumbs without an initial value. |
| `onChange` | `(event: Event, value, activeThumb: number) => void` | — | While dragging or with the keyboard. |
| `onChangeCommitted` | `(event: Event, value) => void` | — | On pointer release or after a keyboard change, only when the value changed. |
| `min`, `max` | `number` | `0`, `100` | Scale. |
| `step` | `number \| null` | `1` | Increment; `null` restricts values to the marks. |
| `marks` | `boolean \| { value, label? }[] \| string` | — | Marks at each step, listed (labels are nodes) or in vanilla syntax. |
| `marksInset` | `boolean` | `false` | Keeps the `min`/`max` mark labels inside the rail. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientation. |
| `track` | `'normal' \| 'inverted' \| false` | `'normal'` | Track mode. |
| `valueLabelDisplay` | `'off' \| 'auto' \| 'on'` | `'off'` | Value label visibility. |
| `valueLabelFormat` | `string \| (value, index) => ReactNode` | — | Template with `{value}` or function. |
| `size` | `'medium' \| 'small'` | `'medium'` | Size. |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | Palette color. |
| `disabled` | `boolean` | `false` | Disables the slider. |
| `disableSwap` | `boolean` | `false` | Range: the active thumb stops at the other one. |
| `minDistance` | `number` | `0` | Range: minimum distance between thumbs. |
| `name` | `string` | — | Field name (`{name}-start` / `{name}-end` in range mode). |
| `getAriaLabel` | `(index) => string` | — | Accessible name per thumb. |
| `getAriaValueText` | `(value, index) => string` | — | `aria-valuetext`. |
| `id`, `form`, `autoFocus`, `tabIndex` | | — | Forwarded to the inputs (`id` and `autoFocus` to the first one). |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `onFocus`, `onBlur` | | — | Forwarded to the inputs. |
| `inputRef` | `Ref<HTMLInputElement>` | — | Ref to the first thumb's input. |
| `inputProps` | `InputHTMLAttributes` | — | Extra attributes for every input. |
| `ref` | `Ref<HTMLSpanElement>` | — | Ref to the root `<span>`. |

`className`, `style` and any other attribute go to the root `<span class="mtx-slider">`.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-slider` | Root. |
| `mtx-slider--small` | Small size. |
| `mtx-slider--secondary`, `--error`, `--warning`, `--info`, `--success` | Colors. |
| `mtx-slider--vertical` | Vertical orientation. |
| `mtx-slider--marked` | Has labelled marks (reserves space for the labels). |
| `mtx-slider--marks-inset` | Edge mark labels aligned inside the rail. |
| `mtx-slider--track-inverted`, `--track-false` | Track modes. |
| `mtx-slider--label-off`, `--label-auto`, `--label-on` | Value label mode. |
| `mtx-slider--dragging`, `--disabled` | States. |
| `mtx-slider__rail`, `__track` | Full rail and filled part. |
| `mtx-slider__thumb` | Thumb; `--active` while dragging, `--focused` when its input has focus. |
| `mtx-slider__input` | Visually hidden native range input. |
| `mtx-slider__value-label`, `__value-label-text` | Teardrop value label (`aria-hidden`). |
| `mtx-slider__mark`, `__mark--active` | Mark dot; active inside the track. |
| `mtx-slider__mark-label`, `--active`, `--start`, `--end` | Mark label. |

### CSS variables

| Variable | Use |
| :--- | :--- |
| `--mtx-slider-color`, `--mtx-slider-contrast` | Main color and value label text color. |
| `--mtx-slider-thickness`, `--mtx-slider-thumb-size` | Rail thickness and thumb size. |
| `--mtx-slider-halo` | Hover/focus/pressed halo color. |
| `--mtx-slider-vertical-length` | Height of a vertical slider (200px). |
| `--mtx-slider-label-size` | Minimum value label size (32px). |
| `--mtx-slider-disabled-color` | Disabled color. |

## Equivalence with vanilla

| Vanilla | React |
| :--- | :--- |
| `<input type="range" data-mtx="slider" data-label="…">` | `<Slider aria-label="…" />` |
| `value` / `data-value="20,60"` | `defaultValue` (or `value` + `onChange`), `[20, 60]` |
| `data-range` | Array value or `range` |
| `min`, `max`, `step` | `min`, `max`, `step` |
| `data-marks`, `data-marks-only`, `data-marks-inset` | `marks`, `step={null}`, `marksInset` |
| `data-value-label-display`, `data-value-label-format` | `valueLabelDisplay`, `valueLabelFormat` |
| `data-track`, `data-orientation`, `data-size`, `data-color` | `track`, `orientation`, `size`, `color` |
| `data-disable-swap`, `data-min-distance` | `disableSwap`, `minDistance` |
| `mtx:slider:input` / `mtx:slider:change` | `onChange` / `onChangeCommitted` |
| `slider.value = …`, `min`/`max`/`step` setters | Update the props |
| `disable()` / `enable()` | `disabled` |
| `focus(index)` | `inputRef.current.focus()` (first thumb) |

## Accessibility

- Each thumb is a native `<input type="range">`: the browser exposes `role="slider"`, `aria-valuemin`, `aria-valuemax` and `aria-valuenow`. With `valueLabelFormat` or `getAriaValueText` the component also sets `aria-valuetext` ("21 °C").
- In range mode each thumb gets a translated name: "Price: Minimum" / "Price: Maximum" ("Precio: Mínimo" / "Precio: Máximo" in Spanish). The prefix taken from the `aria-labelledby` element is read once (on mount or when `aria-labelledby` changes); if that text changes later, pass `aria-label` or `getAriaLabel` instead.
- Vertical sliders set `aria-orientation="vertical"`. The value label and marks are decorative (`aria-hidden`).
- The focus indicator is the 8px halo around the thumb; animations are disabled with `prefers-reduced-motion`.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> | Moves focus to the thumb (each thumb of a range is a tab stop). |
| <kbd>→</kbd> / <kbd>↑</kbd> | Increases by one step (in RTL, <kbd>←</kbd> increases). |
| <kbd>←</kbd> / <kbd>↓</kbd> | Decreases by one step. |
| <kbd>Page Up</kbd> / <kbd>Page Down</kbd> | Increases / decreases by 10% of the range. |
| <kbd>Home</kbd> / <kbd>End</kbd> | Sets the minimum / maximum. |
