---
title: "Typography"
description: "Applies the MUI type scale (h1 to overline) to any element, separating HTML semantics from visual style."
group: "data-display"
icon: "text_fields"
weight: 70
example: "typography"
mui: "https://mui.com/material-ui/react-typography/"
---

`Typography` applies MUI's text styles (headings, subtitles, body, button, caption and overline) with the Roboto font and the theme tokens. Use it so that all the text in the interface shares a single scale. You don't need it for text already styled by its component (buttons, fields, lists…).

## Basic usage

Add `data-mtx="typography"` to a heading: `<h1>`–`<h6>` take their variant automatically. On any other tag, set the variant with `data-variant`.

{{< mtx-demo title="Heading and paragraph" layout="block" >}}
<h4 data-mtx="typography" data-gutter-bottom>Monthly report</h4>
<p data-mtx="typography" data-variant="body1">Sales grew 12% over the previous month, driven by the online channel.</p>
{{< /mtx-demo >}}

## Type scale

The 13 MUI variants. Sizes are expressed in `rem` (16px base).

{{< mtx-demo title="Headings" layout="block" >}}
<h1 data-mtx="typography">h1. Heading</h1>
<h2 data-mtx="typography">h2. Heading</h2>
<h3 data-mtx="typography">h3. Heading</h3>
<h4 data-mtx="typography">h4. Heading</h4>
<h5 data-mtx="typography">h5. Heading</h5>
<h6 data-mtx="typography">h6. Heading</h6>
{{< /mtx-demo >}}

{{< mtx-demo title="Subtitles, body and auxiliary styles" layout="block" >}}
<p data-mtx="typography" data-variant="subtitle1">subtitle1. Supporting text for headings and sections.</p>
<p data-mtx="typography" data-variant="subtitle2">subtitle2. Compact supporting text with more weight.</p>
<p data-mtx="typography" data-variant="body1">body1. The application's main text, designed for continuous reading.</p>
<p data-mtx="typography" data-variant="body2">body2. Secondary text for descriptions, notes and metadata.</p>
<span data-mtx="typography" data-variant="button">button. Button text</span>
<p data-mtx="typography" data-variant="caption">caption. Image caption or helper text.</p>
<p data-mtx="typography" data-variant="overline">overline. Category or eyebrow label</p>
{{< /mtx-demo >}}

| Variant | Size | Weight | Line height | Notes |
|---|---|---|---|---|
| `h1` | 6rem (96px) | 300 | 1.167 | letter-spacing −0.01562em |
| `h2` | 3.75rem (60px) | 300 | 1.2 | letter-spacing −0.00833em |
| `h3` | 3rem (48px) | 400 | 1.167 | |
| `h4` | 2.125rem (34px) | 400 | 1.235 | letter-spacing 0.00735em |
| `h5` | 1.5rem (24px) | 400 | 1.334 | |
| `h6` | 1.25rem (20px) | 500 | 1.6 | |
| `subtitle1` | 1rem (16px) | 400 | 1.75 | |
| `subtitle2` | 0.875rem (14px) | 500 | 1.57 | |
| `body1` | 1rem (16px) | 400 | 1.5 | |
| `body2` | 0.875rem (14px) | 400 | 1.43 | |
| `button` | 0.875rem (14px) | 500 | 1.75 | uppercase |
| `caption` | 0.75rem (12px) | 400 | 1.66 | |
| `overline` | 0.75rem (12px) | 400 | 2.66 | uppercase |

As in MUI, no variant has margins (not even `h1`–`h6`): add `data-gutter-bottom` (`0.35em`) or `data-paragraph` (16px) when you need spacing, or use the spacing utilities.

## Semantics vs. style

The tag defines the document structure and `data-variant` defines the appearance. This lets you keep a correct heading hierarchy without depending on visual size.

{{< mtx-demo title="h2 styled as h5" layout="block" >}}
<h2 data-mtx="typography" data-variant="h5" data-gutter-bottom>Main section (semantic h2, h5 style)</h2>
<h3 data-mtx="typography" data-variant="subtitle1">Subsection (semantic h3, subtitle1 style)</h3>
<p data-mtx="typography" data-variant="body2">Subsection content.</p>
{{< /mtx-demo >}}

## Colors

`data-color` accepts the palette colors (`primary`, `secondary`, `error`, `warning`, `info`, `success`), the text colors (`text-primary`, `text-secondary`, `text-disabled` or `disabled`) and `inherit`.

{{< mtx-demo title="Palette and text colors" layout="block" >}}
<p data-mtx="typography" data-variant="body1" data-color="primary">Primary</p>
<p data-mtx="typography" data-variant="body1" data-color="secondary">Secondary</p>
<p data-mtx="typography" data-variant="body1" data-color="text-secondary">Secondary text</p>
<p data-mtx="typography" data-variant="body1" data-color="disabled" aria-disabled="true">Disabled text</p>
<p data-mtx="typography" data-variant="body1" data-color="error">Error</p>
<p data-mtx="typography" data-variant="body1" data-color="warning">Warning</p>
<p data-mtx="typography" data-variant="body1" data-color="info">Info</p>
<p data-mtx="typography" data-variant="body1" data-color="success">Success</p>
{{< /mtx-demo >}}

## Alignment

`data-align` accepts `left`, `center`, `right` and `justify`.

{{< mtx-demo title="Alignment" layout="block" >}}
<p data-mtx="typography" data-variant="body1" data-align="left">Left-aligned</p>
<p data-mtx="typography" data-variant="body1" data-align="center">Centered</p>
<p data-mtx="typography" data-variant="body1" data-align="right">Right-aligned</p>
{{< /mtx-demo >}}

## Margins and truncation

`data-gutter-bottom` adds a `0.35em` bottom margin to any variant; and `data-paragraph` (the `mtx-typography--paragraph` class) adds 16px. `data-no-wrap` keeps the text on one line and truncates it with an ellipsis according to the container width.

{{< mtx-demo title="gutterBottom, paragraph and noWrap" layout="block" >}}
<p data-mtx="typography" data-variant="subtitle2" data-gutter-bottom>With data-gutter-bottom</p>
<p data-mtx="typography" data-variant="body2" data-paragraph>Paragraph with a 16px bottom margin (data-paragraph).</p>
<p data-mtx="typography" data-variant="body1" data-no-wrap>A very long text that does not fit on a single line and is truncated with an ellipsis instead of wrapping to the next line, regardless of the screen width.</p>
{{< /mtx-demo >}}

## Responsive typography

Two mechanisms, usable with the simplified syntax or as plain classes:

- **Variant per breakpoint** (mobile-first, same breakpoints as Grid: sm 600px, md 900px, lg 1200px, xl 1536px): `data-variant-{sm|md|lg|xl}="h3"` or the `mtx-typography--{bp}-{variant}` class. The base variant applies on mobile and each breakpoint replaces it from there up.
- **Fluid scale** (equivalent to MUI's `responsiveFontSizes`): `data-responsive` or the `mtx-typography--responsive` class. h1–h6 scale with `clamp()` between their mobile size (≤600px) and their desktop size (≥1200px): h1 3.5→6rem, h2 2.375→3.75rem, h3 2→3rem, h4 1.5625→2.125rem, h5 1.25→1.5rem, h6 1.125→1.25rem. The class redefines the `--mtx-type-h1…h6` tokens, so it works on the element itself or on any ancestor (`<html class="mtx-typography--responsive">` applies it to the whole page, including components that use those tokens).

{{< mtx-demo title="Variant per breakpoint" layout="column" >}}
<h2 data-mtx="typography" data-variant="h5" data-variant-md="h4" data-variant-lg="h3">h5 on mobile, h4 from 900px, h3 from 1200px</h2>
<p class="mtx-typography--body2 mtx-typography--md-body1">body2 on mobile and body1 from 900px (plain class)</p>
{{< /mtx-demo >}}

{{< mtx-demo title="Fluid scale" layout="column" >}}
<h1 data-mtx="typography" data-variant="h2" data-responsive>Fluid headline</h1>
<h2 data-mtx="typography" data-variant="h4" data-responsive>Fluid subtitle</h2>
{{< /mtx-demo >}}

## Real-world examples

The header of an article card with an overline, title, metadata and excerpt.

{{< mtx-demo title="Article header" layout="block" >}}
<span data-mtx="typography" data-variant="overline" data-color="primary">Guide</span>
<h3 data-mtx="typography" data-variant="h5" data-gutter-bottom>How to prepare a quarterly budget</h3>
<p data-mtx="typography" data-variant="caption" data-color="text-secondary" data-gutter-bottom>By Ana Garcia · 6 min read</p>
<p data-mtx="typography" data-variant="body2">We walk through the steps to estimate income and expenses, set safety margins and review the budget every month.</p>
{{< /mtx-demo >}}

## Full BEM syntax

The classes work without JavaScript.

```html
<h2 class="mtx-typography mtx-typography--h4 mtx-typography--color-primary">Heading</h2>
<p class="mtx-typography mtx-typography--body2 mtx-typography--text-secondary mtx-typography--align-center">
  Centered secondary text
</p>
<p class="mtx-typography mtx-typography--body1 mtx-typography--no-wrap">Truncated text…</p>
```

## Programmatic usage

Typography has no methods or events; you only need to initialize dynamically created elements.

```javascript
const title = document.createElement('h2');
title.setAttribute('data-variant', 'h5');
title.textContent = 'New section';
container.append(title);

Materix.init(title, 'typography');   // or new Materix.Typography(title)
Materix.initAll(container);          // everything inside a container
```

With ES modules:

```javascript
import { Typography } from 'materix-ui';
new Typography(document.querySelector('#title'));
```

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-variant` | `h1`–`h6`, `subtitle1`, `subtitle2`, `body1`, `body2`, `button`, `caption`, `overline` | the tag if it is `h1`–`h6`; otherwise none | Typographic style. Takes precedence over the tag. |
| `data-color` | `primary`, `secondary`, `error`, `warning`, `info`, `success`, `text-primary`, `text-secondary`, `text-disabled`, `disabled`, `inherit` | primary text color | Adds `mtx-typography--color-{color}`. |
| `data-align` | `left`, `center`, `right`, `justify` | inherited | Text alignment. |
| `data-gutter-bottom` | Boolean (presence) | absent | `0.35em` bottom margin. |
| `data-no-wrap` | Boolean (presence) | absent | Single line with an ellipsis. |
| `data-paragraph` | Boolean (presence) | absent | 16px bottom margin (`mtx-typography--paragraph`). |
| `data-variant-{sm,md,lg,xl}` | Variant | — | Variant from that breakpoint up (`mtx-typography--{bp}-{variant}`). |
| `data-responsive` | Boolean (presence; `"false"` is ignored) | absent | Fluid h1–h6 scale (`mtx-typography--responsive`). |

### CSS classes

| Class | Description |
|---|---|
| `mtx-typography` | Base: no margins, theme font, primary text color. |
| `mtx-typography--h1` … `--overline` | One class per variant, without margins. They work as plain classes, without `.mtx-typography` or JavaScript. |
| `mtx-typography--color-{color}` | Applied by `data-color`: `primary`, `secondary`, `error`, `warning`, `info`, `success`, `text-primary`, `text-secondary`, `text-disabled`, `disabled`, `inherit`. |
| `mtx-typography--text-primary` / `--text-secondary` / `--disabled` | Text colors. `--primary` and `--secondary` are aliases for the primary and secondary text colors. |
| `mtx-typography--error` / `--warning` / `--info` / `--success` | Status colors. |
| `mtx-typography--align-left` / `-center` / `-right` / `-justify` | Alignment (aliases without `align-`: `--left`, `--center`…). |
| `mtx-typography--gutter-bottom` | `0.35em` bottom margin. |
| `mtx-typography--paragraph` | 16px bottom margin. |
| `mtx-typography--{sm,md,lg,xl}-{variant}` | Variant from that breakpoint up (mobile-first). |
| `mtx-typography--responsive` | Fluid h1–h6 scale with `clamp()`; on the element or an ancestor. |
| `mtx-typography--no-wrap` | Truncation with an ellipsis. |

### Methods

Typography exposes no methods of its own.

### Events

Typography emits no events.

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-font-family` | Font family (Roboto). |
| `--mtx-type-h1` … `--mtx-type-overline` | `font` shorthand (weight, size, line height and family) for each variant. |
| `--mtx-color-text-primary` / `--mtx-color-text-secondary` / `--mtx-color-text-disabled` | Text colors. |
| `--mtx-color-primary`, `--mtx-color-secondary`, `--mtx-color-error`, `--mtx-color-warning`, `--mtx-color-info`, `--mtx-color-success` | Palette and status colors. |

## Accessibility

- Choose the tag by its function (`<h1>`–`<h6>` for the hierarchy, `<p>` for paragraphs) and the variant by its appearance: screen readers navigate by tag, not by size.
- Don't skip heading levels to get a size: use `data-variant`.
- Status colors and `disabled` must not be the only way to convey information; pair them with text.
- Text truncated with `data-no-wrap` is visually hidden: if it is important, offer it in full elsewhere (for example, in a `title` or in the detail view).
