---
title: "Card"
description: "A surface that groups content and actions about a single subject: header, image, text and buttons."
group: "surfaces"
icon: "web"
weight: 20
example: "card"
import: "Card, CardHeader, CardMedia, CardContent, CardActions, CardActionArea"
mui: "https://mui.com/material-ui/react-card/"
---

**Card** groups the information and actions of a single item on an elevated surface: a product, a recipe, a profile. It is built from optional parts —header, media, content, actions and action area— that you can generate with shorthand props on `Card` or compose with subcomponents. Use it when the block is self-contained and scannable within a collection; for a generic surface without structure use [Paper]({{< relref "/components/paper" >}}), and for dense lists use [List]({{< relref "/components/list" >}}).

```tsx
import { Card, CardContent, CardActions } from '@rubenchodev/materix-react';
// or just this component:
import { Card } from '@rubenchodev/materix-react/components/card';
```

## Basic usage

`title`, `subheader`, `avatar`, `actionIcon` and `image` generate the header and the image (the equivalent of the vanilla single-element syntax); the content and actions are children: `CardContent` and `CardActions`.

{{< react-demo "card/01-basic" >}}

## Variants

By default the card has elevation 1. `variant="outlined"` delimits it with a border and no shadow; `raised` raises it to 8 (like MUI's `raised`); `elevation` accepts 0–8, 12, 16 and 24; `square` removes the radius. The `h1`–`h6` and `p` styles inside `CardContent` have zero specificity, so `Typography` (or any `mtx-typography--*` class) always wins.

{{< react-demo "card/02-variants" >}}

## Header

The header (`.mtx-card__header`) is generated when there is a `title`, `subheader` or `avatar`. A string `avatar` is painted as a primary Avatar with that text; any other node (for example an `<Avatar>`) is rendered as is. `actionIcon` adds an IconButton on the right (its name comes from `actionLabel`, default "Actions"), and `action` accepts any node instead.

{{< react-demo "card/03-header" >}}

## Media

`image` generates a full-bleed 194 px `CardMedia`. By default it goes after the header; `mediaTop` places it at the top and `mediaHeight` sets the height. A generated image is decorative (`aria-hidden`) unless you pass `imageAlt`.

{{< react-demo "card/04-media" >}}

## Actions

`CardActions` is a row with 8 px of padding and gap; its buttons take MUI's compact size and are right-aligned by default (see [Actions alignment](#actions-alignment)). The `mtx-card__actions-end` class pushes one item to the far right, and `disableSpacing` removes the gap.

{{< react-demo "card/05-actions" >}}

## Actions alignment

Card actions are **right-aligned** by default, like dialog actions. Change it with `align="start|center|end|between"` on `CardActions`, or for every action row of a card with `actionsAlign` on `Card` (a row's own `align` wins).

{{< callout type="info" title="Deliberate deviation from MUI" >}}
MUI's `CardActions` aligns its buttons to the **left**. Materix aligns them to the right by default so that cards and dialogs share the same action placement. Use `align="start"` (or `actionsAlign="start"` on the card) to get the original MUI layout.
{{< /callout >}}

{{< react-demo "card/06-actions-alignment" >}}

## Action area

`CardActionArea` turns the image and text into a single clickable zone with ripple, hover and focus, without affecting the actions. It renders a `<button type="button">`, an `<a>` when it receives `href`, or any element through `component` (then it gets `role="button"`, `tabIndex={0}` and Enter/Space). With `clickable` the whole card becomes interactive (`role="button"`, ripple, Enter and Space).

{{< react-demo "card/07-action-area" >}}

## States

Normal, hover and focus (hover or use Tab) and disabled. `disabled` on a clickable card or on `CardActionArea` lowers the opacity, removes the pointer and takes it out of the tab order (`aria-disabled="true"`; on a `<button>` also the native `disabled`).

{{< react-demo "card/08-states" >}}

## Elevation in the dark theme

In dark mode, as in MUI, each elevation adds a white overlay (`--mtx-overlay-elevation-N`): elevation 0 has no overlay, the card raised to 8 looks lighter than the elevation 1 card, and `outlined` has no overlay.

{{< react-demo "card/09-dark-theme" >}}

## Real-world examples

### Product grid

Cards take the width of their column, so they adapt to any grid.

{{< react-demo id="card/10-grid" layout="block" >}}

## Programmatic usage

The vanilla methods become props and refs: `disabled` replaces `disable()`/`enable()`, `ref.current.focus()` replaces `focus()` and the `image` prop of `CardMedia` replaces its setter. There are no `mtx:*` events: use `onClick` (also fired by Enter and Space on non-native elements).

{{< react-demo id="card/11-programmatic" layout="block" >}}

## Composition with subcomponents

For full control (the equivalent of the vanilla BEM syntax), compose `CardHeader`, `CardMedia`, `CardContent` and `CardActions` yourself. Every part accepts `className`, `style`, native attributes and `ref`; `Card`, `CardHeader`, `CardMedia` and `CardContent` also accept `component`.

{{< react-demo "card/12-composition" >}}

## API reference

### Card

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'elevation' \| 'outlined'` | `'elevation'` | Shadow or border. |
| `elevation` | `0`–`8` \| `12` \| `16` \| `24` | — (elevation 1) | `--mtx-elevation-{n}` shadow. |
| `raised` | `boolean` | `false` | Elevation 8. |
| `square` | `boolean` | `false` | No radius. |
| `clickable` | `boolean` | `false` | The whole card is interactive (`role="button"`, `tabIndex=0`, ripple, Enter/Space). |
| `disabled` | `boolean` | `false` | `aria-disabled`, `.mtx-card--disabled`, `tabIndex=-1`; blocks `onClick`. |
| `actionsAlign` | `'start' \| 'center' \| 'end' \| 'between'` | `'end'` | Default alignment of its `CardActions`. |
| `title` / `subheader` | `ReactNode` | — | Texts of the generated header. |
| `avatar` | `ReactNode` | — | Header avatar; a string is painted as a primary Avatar. |
| `action` | `ReactNode` | — | Header action. |
| `actionIcon` | `string` | — | Material Icon of a generated IconButton in the header. |
| `actionLabel` | `string` | i18n `card.actions` | `aria-label` of that IconButton. |
| `image` | `string` | — | Generates a `CardMedia` with that image. |
| `imageAlt` | `string` | — | Alternative text of the generated image (decorative without it). |
| `mediaHeight` | `number \| string` | `194` (CSS) | Height of the generated image. |
| `mediaTop` | `boolean` | `false` | Places the image before the header. |
| `component` | `ElementType` | `'div'` | Root element (`article`, `section`…). |

### Subcomponents

| Component | Props | Description |
|---|---|---|
| `CardHeader` | `avatar`, `title`, `subheader`, `action`, `component` | `.mtx-card__header` with its avatar, content and action zones. |
| `CardMedia` | `image`, `alt`, `height`, `component` | Background image, or `src` when `component` is `img`, `video`, `audio`, `picture` or `iframe`. With `alt`: `alt` on `<img>`, `role="img"` + `aria-label` on other elements. |
| `CardContent` | `component` | `.mtx-card__content`. |
| `CardActions` | `align`, `disableSpacing` | `.mtx-card__actions`, right-aligned by default. |
| `CardActionArea` | `href`, `disabled`, `disableRipple`, `component` | Interactive zone with ripple; `<button>` by default, `<a>` with `href`. |

All of them forward `ref` to the root, merge `className` and pass native attributes through.

### Callbacks

Card emits no `mtx:*` events in vanilla either. Use the native `onClick` on `Card clickable` or `CardActionArea`.

### Vanilla equivalence

| Vanilla | React |
|---|---|
| `data-title`, `data-subheader`, `data-avatar` | `title`, `subheader`, `avatar` |
| `data-action-icon`, `data-action-label` | `actionIcon`, `actionLabel` (or `action`) |
| `data-image`, `data-image-alt`, `data-media-height`, `data-media-top` | `image`, `imageAlt`, `mediaHeight`, `mediaTop` |
| `data-variant`, `data-elevation`, `data-raised`, `data-square` | `variant`, `elevation`, `raised`, `square` |
| `data-clickable`, `data-disabled` | `clickable`, `disabled` |
| `data-actions-align` / `data-align` | `actionsAlign` / `align` |
| `data-disable-spacing` | `disableSpacing` |
| `data-mtx="card-media"` + `data-alt` / `data-height` | `<CardMedia alt height>` |
| `disable()` / `enable()` / `focus()` | `disabled` / `ref.current.focus()` |

### CSS classes

The same as the vanilla library: `.mtx-card`, `--outlined`, `--elevation-{n}`, `--raised`, `--square`, `--clickable`, `--disabled`, `.mtx-card-action-area` (`--disabled`), `.mtx-card__header` (`-avatar`, `-content`, `-action`), `.mtx-card__title`, `.mtx-card__subheader`, `.mtx-card__media`, `.mtx-card__content`, `.mtx-card__actions` (`--start`, `--center`, `--between`, `--disable-spacing`) and `.mtx-card__actions-end`.

## Accessibility

- Use `component="article"` or `"section"` when the card is self-contained content.
- On a `clickable` card that is not a `<button>`/`<a>`, `role="button"` and `tabIndex={0}` are added; its accessible name comes from its content. Avoid an `aria-label` that does not contain the visible text (WCAG 2.5.3 *Label in Name*).
- Prefer `CardActionArea` (native `<button>` or `<a>`): it keeps its semantics and leaves the `CardActions` buttons as independent controls. Don't nest buttons inside the area.
- Images generated with `image` are decorative unless you pass `imageAlt`; with `CardMedia`, use `alt`.
- IconButtons in the actions need an `aria-label`.

| Key | Action |
|---|---|
| `Tab` | Moves through the action area, the clickable card and the buttons. |
| `Enter` / `Space` | Activates the focused clickable card or action area. |
