---
title: "Typography"
description: "Applies the MUI type scale (h1 to overline) to any element, separating HTML semantics from visual style."
group: "data-display"
icon: "text_fields"
weight: 70
example: "typography"
import: "Typography"
mui: "https://mui.com/material-ui/react-typography/"
---

`Typography` applies MUI's text styles (headings, subtitles, body, button, caption and overline) with the Roboto font and the theme tokens. Use it so that all the text in the interface shares a single scale. You don't need it for text already styled by its component (buttons, fields, lists…).

```tsx
import { Typography } from '@rubenchodev/materix-react';
// or only this component:
import { Typography } from '@rubenchodev/materix-react/components/typography';
```

## Basic usage

Without props, `<Typography>` is a `body1` paragraph. `variant` picks the style and `component` the tag.

{{< react-demo id="typography/01-basic" layout="block" >}}

## Type scale

The 13 MUI variants. As in MUI, no variant has margins (not even `h1`–`h6`): add them with `gutterBottom` (`0.35em`) or `paragraph` (16px).

{{< react-demo id="typography/02-scale" layout="block" >}}

| Variant | Size | Weight | Default tag |
|---|---|---|---|
| `h1` … `h6` | 96 / 60 / 48 / 34 / 24 / 20px | 300 / 300 / 400 / 400 / 400 / 500 | `h1` … `h6` |
| `subtitle1` / `subtitle2` | 16 / 14px | 400 / 500 | `p` |
| `body1` / `body2` | 16 / 14px | 400 | `p` |
| `button` | 14px, uppercase | 500 | `span` |
| `caption` | 12px | 400 | `span` |
| `overline` | 12px, uppercase | 400 | `span` |
| `inherit` | inherited | inherited | `p` |

Change the default tags with `variantMapping` (for example `variantMapping={{ subtitle1: 'h6' }}`), or pass `component` for a single element.

## Semantics vs. style

`component` defines the document structure and `variant` the appearance, so you can keep a correct heading hierarchy regardless of the visual size. A heading `component` (`h1`–`h6`) without `variant` takes its variant from the tag, like vanilla.

{{< react-demo id="typography/03-semantics" layout="block" >}}

## Colors

`color` accepts the palette colors (`primary`, `secondary`, `error`, `warning`, `info`, `success`), the text colors (`text-primary`, `text-secondary`, `text-disabled` or `disabled`) and `inherit`.

{{< react-demo id="typography/04-colors" layout="block" >}}

## Alignment

`align` accepts `left`, `center`, `right` and `justify` (`inherit` by default).

{{< react-demo id="typography/05-alignment" layout="block" >}}

## Margins and truncation

`gutterBottom` adds a `0.35em` bottom margin; `paragraph` adds 16px (and renders a `<p>` if there is no `component`); `noWrap` keeps the text on one line and truncates it with an ellipsis.

{{< react-demo id="typography/06-margins" layout="block" >}}

## Responsive typography

- **Variant per breakpoint** (mobile-first; sm 600px, md 900px, lg 1200px, xl 1536px): `variantSm`, `variantMd`, `variantLg` and `variantXl` replace `variant` from that width up.
- **Fluid scale** (MUI's `responsiveFontSizes`): `responsive` scales h1–h6 with `clamp()` between their mobile and desktop sizes. The `mtx-typography--responsive` class also works on any ancestor (for example on `<html>`).

{{< react-demo id="typography/07-responsive" layout="block" >}}

## Use cases

Article header inside a Paper: overline, title, metadata and excerpt.

{{< react-demo id="typography/08-use-cases" layout="block" >}}

## Grid

KPIs in a grid: figure in `h4`, label in `overline` and change in `caption`.

{{< react-demo id="typography/09-grid" layout="block" >}}

## Programmatic usage

Typography has no state: render it from your data and change `variant` like any other prop.

{{< react-demo id="typography/10-programmatic" layout="block" >}}

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'h1'`…`'h6'` \| `'subtitle1'` \| `'subtitle2'` \| `'body1'` \| `'body2'` \| `'button'` \| `'caption'` \| `'overline'` \| `'inherit'` | `'body1'` (or the heading `component`) | Adds `.mtx-typography--{variant}`; `inherit` adds no scale class. |
| `component` | `ElementType` | per `variantMapping` | Root element. |
| `variantMapping` | `Partial<Record<variant, ElementType>>` | see the table above | Default tag per variant. |
| `color` | `'primary'` \| `'secondary'` \| `'error'` \| `'warning'` \| `'info'` \| `'success'` \| `'text-primary'` \| `'text-secondary'` \| `'text-disabled'` \| `'disabled'` \| `'inherit'` | — | Adds `.mtx-typography--color-{color}`. |
| `align` | `'inherit'` \| `'left'` \| `'center'` \| `'right'` \| `'justify'` | `'inherit'` | Adds `.mtx-typography--{align}` and `.mtx-typography--align-{align}`. |
| `gutterBottom` | `boolean` | `false` | `0.35em` bottom margin. |
| `paragraph` | `boolean` | `false` | 16px bottom margin (`.mtx-typography--paragraph`). |
| `noWrap` | `boolean` | `false` | Single line with an ellipsis. |
| `variantSm` / `variantMd` / `variantLg` / `variantXl` | variant | — | Variant from that breakpoint up (`.mtx-typography--{bp}-{variant}`). |
| `responsive` | `boolean` | `false` | Fluid h1–h6 scale (`.mtx-typography--responsive`). |
| `className` | `string` | — | Merged with the component classes. |
| `ref` | `Ref<HTMLElement>` | — | Points to the root element. |

Any other prop (`id`, `style`, `aria-*`, events) is forwarded to the root element. The exported constant `TYPOGRAPHY_VARIANT_MAPPING` holds the default tags.

### Callbacks

Typography emits no events.

### CSS classes

| Class | Description |
|---|---|
| `.mtx-typography` | Base: no margins, theme font, primary text color. |
| `.mtx-typography--h1` … `--overline` | One class per variant. |
| `.mtx-typography--color-{color}` | Palette, text and `inherit` colors. |
| `.mtx-typography--align-{left\|center\|right\|justify}` | Alignment (plus the `--left`, `--center`… aliases). |
| `.mtx-typography--gutter-bottom` / `--paragraph` | 0.35em / 16px bottom margin. |
| `.mtx-typography--no-wrap` | Truncation with an ellipsis. |
| `.mtx-typography--{sm\|md\|lg\|xl}-{variant}` | Variant from that breakpoint up. |
| `.mtx-typography--responsive` | Fluid h1–h6 scale. |

## Accessibility

- Choose the tag by its function (`h1`–`h6` for the hierarchy, `p` for paragraphs) with `component`, and the look with `variant`: screen readers navigate by tag, not by size.
- Don't skip heading levels to get a size. Subtitles render as `<p>` by default so they don't create headings by accident.
- Status colors and `disabled` must not be the only way to convey information; pair them with text.
- Text truncated with `noWrap` is visually hidden: if it matters, offer it in full elsewhere (for example in a `title`).

## Vanilla equivalence

| Vanilla (`data-*`) | React |
|---|---|
| `<p data-mtx="typography" data-variant="body2">` | `<Typography variant="body2">` |
| `<h3 data-mtx="typography" data-variant="h5">` | `<Typography component="h3" variant="h5">` |
| `<h2 data-mtx="typography">` (variant from the tag) | `<Typography component="h2">` |
| `data-color="error"` | `color="error"` |
| `data-align="center"` | `align="center"` |
| `data-gutter-bottom` / `data-paragraph` / `data-no-wrap` | `gutterBottom` / `paragraph` / `noWrap` |
| `data-variant-md="h4"` | `variantMd="h4"` |
| `data-responsive` | `responsive` |

Differences: vanilla has no default variant on non-heading tags; React uses `body1` like MUI (`variant="inherit"` reproduces the vanilla behavior). The tag is chosen from the variant when there is no `component`.
