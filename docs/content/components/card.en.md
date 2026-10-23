---
title: "Card"
description: "A surface that groups content and actions about a single subject: header, image, text and buttons."
group: "surfaces"
icon: "web"
weight: 20
example: "card"
mui: "https://mui.com/material-ui/react-card/"
---

**Card** groups the information and actions of a single item on an elevated surface: a product, a recipe, a profile. It's built from optional parts —header, media, content, actions and action area— generated from `data-*` attributes. Use it when the block is self-contained and scannable within a collection; for a generic surface without structure use [Paper]({{< relref "/components/paper" >}}), and for dense lists use [List]({{< relref "/components/list" >}}).

## Basic usage

`data-title`, `data-subheader`, `data-avatar` and `data-image` generate the header and the image; the content and actions are declared with `data-mtx="card-content"` and `data-mtx="card-actions"`.

{{< mtx-demo title="Complete card" >}}
<div data-mtx="card" class="doc-card-sample"
     data-avatar="R"
     data-title="Valencian paella"
     data-subheader="September 14, 2026"
     data-action-icon="more_vert"
     data-image="https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80">
  <div data-mtx="card-content">A Mediterranean dish with bomba rice, saffron, free-range chicken and fresh vegetables.</div>
  <div data-mtx="card-actions">
    <button data-mtx="icon-button" data-icon="favorite" aria-label="Add to favorites"></button>
    <button data-mtx="icon-button" data-icon="share" aria-label="Share"></button>
  </div>
</div>
{{< /mtx-demo >}}

<style>.doc-card-sample { width: 100%; max-width: 345px; }</style>

## Variants

By default the card has elevation 1. `data-variant="outlined"` delimits it with a border and no shadow; `data-raised` raises it to 8 (like MUI's `raised`); `data-elevation` accepts 0–8, 12, 16 and 24; `data-square` removes the radius.

{{< mtx-demo title="Elevation, outlined, raised and square" >}}
<div data-mtx="card">
  <div data-mtx="card-content"><h3>Default</h3><p>Elevation 1.</p></div>
</div>
<div data-mtx="card" data-variant="outlined">
  <div data-mtx="card-content"><h3>Outlined</h3><p>Border, no shadow.</p></div>
</div>
<div data-mtx="card" data-raised>
  <div data-mtx="card-content"><h3>Raised</h3><p>Elevation 8.</p></div>
</div>
<div data-mtx="card" data-elevation="4" data-square>
  <div data-mtx="card-content"><h3>Square</h3><p>Elevation 4, no radius.</p></div>
</div>
{{< /mtx-demo >}}

## Header

The header (`.mtx-card__header`) is generated if there's a `data-title`, `data-subheader` or `data-avatar`. The avatar is a primary [Avatar]({{< relref "/components/avatar" >}}) with the given text; `data-action-icon` adds an IconButton on the right with the given Material Icons icon.

{{< mtx-demo title="Header variants" layout="row" >}}
<div data-mtx="card" class="doc-card-sample" data-title="Quarterly report">
  <div data-mtx="card-content">Title only.</div>
</div>
<div data-mtx="card" class="doc-card-sample" data-avatar="AM" data-title="Anna Martin" data-subheader="Product design" data-action-icon="more_vert">
  <div data-mtx="card-content">Avatar, title, subheader and action.</div>
</div>
{{< /mtx-demo >}}

## Media

`data-image` (or `data-media`) generates a 194 px full-bleed `.mtx-card__media`. By default it's placed after the header; `data-media-top` puts it at the top and `data-media-height` (or `data-height`) sets the height in pixels. An image generated this way is decorative: if it conveys information, use your own `data-mtx="card-media"` with `data-alt`.

{{< mtx-demo title="Image on top, 140 px" >}}
<div data-mtx="card" class="doc-card-sample" data-variant="outlined" data-media-top data-media-height="140"
     data-title="Green lizard" data-subheader="Reptilia · Squamata"
     data-image="https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=800&q=80">
  <div data-mtx="card-content">More than 6,000 species, found on every continent except Antarctica.</div>
  <div data-mtx="card-actions">
    <button class="mtx-button mtx-button--text" data-mtx="button">Share</button>
    <button class="mtx-button mtx-button--text" data-mtx="button">Learn more</button>
  </div>
</div>
{{< /mtx-demo >}}

## Actions

`card-actions` is a row with 8 px of padding and gap; the buttons take MUI's compact size (32 px tall, 13 px text) and are right-aligned by default (see [Action alignment](#action-alignment)). `mtx-card__actions-end` pushes one item to the far right while the rest stay at the start, and `data-disable-spacing` removes the gap.

{{< mtx-demo title="Actions" >}}
<div data-mtx="card" class="doc-card-sample">
  <div data-mtx="card-content"><h3>Saved recipe</h3><p>Prep time: 45 minutes.</p></div>
  <div data-mtx="card-actions">
    <button data-mtx="icon-button" data-icon="favorite_border" aria-label="Like"></button>
    <button data-mtx="icon-button" data-icon="share" aria-label="Share"></button>
    <button class="mtx-button mtx-button--contained mtx-card__actions-end" data-mtx="button">Cook</button>
  </div>
</div>
{{< /mtx-demo >}}

## Action alignment

Card actions are **right-aligned** by default, just like dialog actions. Change it with `data-align="start|center|end|between"` on `card-actions`, or set it for every action row of a card with `data-actions-align` on the card (a row's own `data-align` wins). The attribute also works without JavaScript.

{{< callout type="info" title="Deliberate deviation from MUI" >}}
MUI's `CardActions` aligns its buttons to the **left**. Materix aligns them to the right by default so that cards and dialogs share the same action placement. Use `data-align="start"` (or `data-actions-align="start"` on the card) to get the original MUI layout.
{{< /callout >}}

{{< mtx-demo title="Action alignment" >}}
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-2">
  <div data-mtx="card" class="doc-card-sample">
    <div data-mtx="card-content"><h3 class="mtx-card__title">Backup</h3><p>Last backup 2 hours ago. (end)</p></div>
    <div data-mtx="card-actions">
      <button class="mtx-button mtx-button--text" data-mtx="button">History</button>
      <button class="mtx-button mtx-button--text" data-mtx="button">Restore</button>
    </div>
  </div>
  <div data-mtx="card" class="doc-card-sample">
    <div data-mtx="card-content"><h3 class="mtx-card__title">Backup</h3><p>Last backup 2 hours ago. (start)</p></div>
    <div data-mtx="card-actions" data-align="start">
      <button class="mtx-button mtx-button--text" data-mtx="button">History</button>
      <button class="mtx-button mtx-button--text" data-mtx="button">Restore</button>
    </div>
  </div>
  <div data-mtx="card" class="doc-card-sample">
    <div data-mtx="card-content"><h3 class="mtx-card__title">Free plan</h3><p>Up to 3 projects. (center)</p></div>
    <div data-mtx="card-actions" data-align="center">
      <button class="mtx-button mtx-button--contained" data-mtx="button">Get started</button>
    </div>
  </div>
  <div data-mtx="card" class="doc-card-sample" data-actions-align="between">
    <div data-mtx="card-content"><h3 class="mtx-card__title">Order #1042</h3><p>Out for delivery. (between)</p></div>
    <div data-mtx="card-actions">
      <button data-mtx="icon-button" data-icon="more_vert" aria-label="More options"></button>
      <button class="mtx-button mtx-button--contained" data-mtx="button">Track</button>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

```html
<div data-mtx="card-actions">…</div>                      <!-- right (default) -->
<div data-mtx="card-actions" data-align="start">…</div>   <!-- left, like MUI -->
<div data-mtx="card-actions" data-align="center">…</div>
<div data-mtx="card" data-actions-align="between">…</div> <!-- every action row of the card -->
```

## Action area

`data-mtx="card-action-area"` turns the image and text into a single clickable zone with ripple, hover and a focus ring, without affecting the `card-actions` buttons. If it's a `<button>` or `<a>`, its native semantics are used; on any other element it adds `role="button"`, `tabindex="0"` and Enter and Space support. With `data-clickable` on the card itself, the whole card becomes interactive.

{{< mtx-demo title="CardActionArea and clickable card" layout="row" >}}
<div data-mtx="card" class="doc-card-sample">
  <button data-mtx="card-action-area">
    <div data-mtx="card-media" data-height="140" data-alt="Colorful domes of Saint Basil's Cathedral"
         data-image="https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80"></div>
    <div data-mtx="card-content">
      <div class="mtx-card__title">Discover Moscow</div>
      <div>Museums, theaters and the most ornate metro in the world.</div>
    </div>
  </button>
  <div data-mtx="card-actions">
    <button class="mtx-button mtx-button--text" data-mtx="button">Book</button>
  </div>
</div>
<div data-mtx="card" class="doc-card-sample" data-variant="outlined" data-clickable
     data-avatar="S" data-title="Settings" data-subheader="Account and privacy">
  <div data-mtx="card-content">The whole card responds to clicks and the keyboard.</div>
</div>
{{< /mtx-demo >}}

## States

Clickable cards and action areas support `data-disabled`: they get `aria-disabled="true"`, reduced opacity, no pointer events and are removed from the tab order. Hover raises a clickable card to 4 and keyboard focus shows the `--mtx-focus-ring-color` ring.

{{< mtx-demo title="Normal and disabled" >}}
<div data-mtx="card" data-clickable data-title="Normal" data-subheader="Hover or press Tab">
  <div data-mtx="card-content">Interactive.</div>
</div>
<div data-mtx="card" data-clickable data-disabled data-title="Disabled" data-subheader="aria-disabled=true">
  <div data-mtx="card-content">Not interactive.</div>
</div>
{{< /mtx-demo >}}

## Real-world examples

### Product grid

Cards take the width of their [Grid]({{< relref "/components/grid" >}}) column: one column on mobile, two on tablet and three on desktop.

{{< mtx-demo title="Catalog" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <div data-mtx="card" data-media-top data-media-height="160"
         data-image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80">
      <div data-mtx="card-content"><h3>Classic watch</h3><p>Leather strap. $89.00</p></div>
      <div data-mtx="card-actions">
        <button class="mtx-button mtx-button--contained" data-mtx="button">Add to cart</button>
        <button data-mtx="icon-button" data-icon="favorite_border" aria-label="Save watch" class="mtx-card__actions-end"></button>
      </div>
    </div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <div data-mtx="card" data-media-top data-media-height="160"
         data-image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80">
      <div data-mtx="card-content"><h3>Headphones</h3><p>30 h battery life. $149.00</p></div>
      <div data-mtx="card-actions">
        <button class="mtx-button mtx-button--contained" data-mtx="button">Add to cart</button>
        <button data-mtx="icon-button" data-icon="favorite_border" aria-label="Save headphones" class="mtx-card__actions-end"></button>
      </div>
    </div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6" data-md="4">
    <div data-mtx="card" data-media-top data-media-height="160"
         data-image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80">
      <div data-mtx="card-content"><h3>Sneakers</h3><p>Lightweight and breathable. $75.00</p></div>
      <div data-mtx="card-actions">
        <button class="mtx-button mtx-button--contained" data-mtx="button">Add to cart</button>
        <button data-mtx="icon-button" data-icon="favorite_border" aria-label="Save sneakers" class="mtx-card__actions-end"></button>
      </div>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

If the card already contains `.mtx-card__header` (or `.mtx-card-header`) or `.mtx-card__media` (or `.mtx-card-media`), they aren't generated: the component only adds behavior.

```html
<article class="mtx-card" data-mtx="card">
  <header class="mtx-card__header" data-mtx="card-header">
    <div class="mtx-card__header-avatar">
      <div class="mtx-avatar mtx-avatar--secondary" data-mtx="avatar">JS</div>
    </div>
    <div class="mtx-card__header-content">
      <span class="mtx-card__title">Modern web development</span>
      <span class="mtx-card__subheader">Clean architecture in JavaScript</span>
    </div>
    <div class="mtx-card__header-action">
      <button class="mtx-icon-button" data-mtx="icon-button" aria-label="Course options">
        <span class="material-icons" aria-hidden="true">more_vert</span>
      </button>
    </div>
  </header>
  <div class="mtx-card__media" data-mtx="card-media" data-image="course.jpg" data-height="160" data-alt="Laptop showing code"></div>
  <div class="mtx-card__content" data-mtx="card-content">Build component libraries without frameworks.</div>
  <div class="mtx-card__actions" data-mtx="card-actions">
    <button class="mtx-button mtx-button--text" data-mtx="button">View project</button>
  </div>
</article>
```

## Programmatic usage

Cards initialize when the page loads. `Card` and `CardActionArea` expose `disable()`, `enable()`, `focus()` and the `disabled` getter; `CardMedia` exposes the `image` property. They don't emit their own events: listen for the native `click`, which interactive zones also fire on Enter and Space.

```javascript
// UMD (window.Materix)
const el = document.getElementById('card-settings');      // with data-clickable
const card = Materix.getInstance(el);
el.addEventListener('click', () => openSettings());
card.disable();      // aria-disabled="true", tabindex=-1
card.enable();
card.focus();

const media = Materix.getInstance(document.querySelector('#hero [data-mtx="card-media"]'));
media.image = 'new-cover.jpg';   // background-image (or src if it's an <img>)
```

```javascript
// ES modules
import { Card, CardActionArea, CardMedia } from 'materix-ui';

const card = new Card(document.querySelector('#product'));
```

## API reference

### Data attributes

**Card** (`data-mtx="card"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-title` | text | — | Title of the generated header. |
| `data-subheader` | text | — | Subheader of the generated header. |
| `data-avatar` | text | — | Text of a primary Avatar in the header. |
| `data-action-icon` | Material Icon name | — | IconButton on the right of the header. |
| `data-action-label` | text | i18n `card.actions` (`Actions` / `Acciones`) | `aria-label` of the header IconButton. |
| `data-image` / `data-media` | URL | — | Generates `.mtx-card__media` with that background image. |
| `data-image-alt` | text | — | Alternative text of the generated media (`role="img"` + `aria-label`); without it the media is decorative (`aria-hidden`). |
| `data-media-height` / `data-height` | pixels | `194` (CSS) | Height of the generated media. |
| `data-media-top` | boolean (presence) | absent | Places the media before the header. |
| `data-variant` | `outlined` | — | Border instead of shadow. |
| `data-elevation` | `0`–`8`, `12`, `16`, `24` | — (elevation 1) | `--mtx-elevation-{n}` shadow. |
| `data-raised` | boolean (presence) | absent | Elevation 8. |
| `data-square` | boolean (presence) | absent | No radius. |
| `data-clickable` | boolean (presence) | absent | The whole card is interactive (`role="button"`, `tabindex="0"`, ripple, Enter/Space). |
| `data-disabled` | boolean (presence) | absent | Disables the card (`aria-disabled`). |
| `data-actions-align` | `start` \| `center` \| `end` \| `between` | `end` | Alignment of the card's action rows that don't declare their own `data-align`. |

**Parts**

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx="card-content"` | — | — | Adds `.mtx-card__content`. |
| `data-mtx="card-actions"` | — | — | Adds `.mtx-card__actions`. |
| `data-align` (on card-actions) | `start` \| `center` \| `end` \| `between` | `end` | Alignment of the actions. `start` is the MUI layout. |
| `data-disable-spacing` (on card-actions) | boolean | absent | Removes the gap between actions. |
| `data-mtx="card-header"` | — | — | Adds `.mtx-card__header` (BEM syntax). |
| `data-mtx="card-media"` | — | — | Adds `.mtx-card__media`. |
| `data-image` (on card-media) | URL | — | Background image (or `src` if it's an `<img>`). |
| `data-height` / `data-media-height` (on card-media) | pixels | `194` (CSS) | Height. |
| `data-alt` (on card-media) | text | — | `alt` on `<img>`; on any other element, `role="img"` and `aria-label`. Without it, an `<img>` gets `alt=""` and a background image `aria-hidden="true"`. |
| `data-mtx="card-action-area"` | — | — | Clickable zone with ripple and focus. |
| `data-disabled` (on card-action-area) | boolean | absent | Disables the area. |

### CSS classes

| Class | Description |
|---|---|
| `.mtx-card` | Flex column surface, elevation 1, `overflow: hidden`. |
| `.mtx-card--outlined` | `--mtx-color-divider` border, no shadow. |
| `.mtx-card--elevation-{n}` | Shadow for n = 0–8, 12, 16, 24. |
| `.mtx-card--raised` | Elevation 8. |
| `.mtx-card--square` | No radius. |
| `.mtx-card--clickable` | Pointer cursor, elevation 4 on hover and focus ring. |
| `.mtx-card--disabled` | Reduced opacity and no pointer events. |
| `.mtx-card-action-area` | Interactive zone with hover (4%) and focus (12%) overlays. |
| `.mtx-card-action-area--disabled` | Disabled area. |
| `.mtx-card__header` | Header row (16 px padding). |
| `.mtx-card__header-avatar` / `__header-content` / `__header-action` | Header zones. |
| `.mtx-card__title` / `.mtx-card__subheader` | Header texts. |
| `.mtx-card__media` | Full-bleed image, 194 px by default, `background-size: cover`. |
| `.mtx-card__content` | Content (16 px; 24 px at the bottom if it's the last child). Styles child `h1`–`h6` and `p` with zero specificity (`:where`): a `mtx-typography--*` class or a utility on them always wins. |
| `.mtx-card__actions` | Actions row with 8 px padding and gap, right-aligned by default (`justify-content: flex-end`). |
| `.mtx-card__actions--start` / `--center` / `--between` | Alignment of the actions (added from `data-align` / `data-actions-align`; `end` needs no class). |
| `.mtx-card__actions--disable-spacing` | No gap between actions. |
| `.mtx-card__actions-end` | Pushes the item to the right (`margin-left: auto`). |

### Methods

| Method | Returns | Description |
|---|---|---|
| `Card#disable()` | `void` | `aria-disabled="true"`, `--disabled` class, `tabindex=-1`. |
| `Card#enable()` | `void` | Reverts `disable()`; restores `tabindex=0` if it's clickable. |
| `Card#focus()` | `void` | Focuses the card. |
| `Card#disabled` | `boolean` | Getter: `true` if it has `aria-disabled="true"`. |
| `Card#destroy()` | `void` | Removes the listeners of a clickable card. |
| `CardActionArea#disable()` / `enable()` / `focus()` / `destroy()` | `void` | Same as Card; on a `<button>` it also toggles `disabled`. |
| `CardActionArea#disabled` | `boolean` | State getter. |
| `CardMedia#image` | `string` | URL getter/setter (background or `src`). |
| `CardActions#align` | `string` | Getter/setter: `start`, `center`, `end` or `between` (throws `RangeError` for any other value). |

### Events

Card doesn't emit `mtx:*` events. Use the native `click` event on the clickable card or the action area; on non-native elements the component also fires it on Enter and Space.

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-background-paper` | Card background. |
| `--mtx-color-text-primary` / `--mtx-color-text-secondary` | Title and content. |
| `--mtx-color-text-disabled` / `--mtx-disabled-opacity` | Disabled state. |
| `--mtx-color-divider` | `outlined` border. |
| `--mtx-color-grey-300` | Media background while loading. |
| `--mtx-elevation-*` | Shadows. |
| `--mtx-overlay-elevation-*` | White overlay per elevation in the dark theme (`background-image`, MUI formula). `none` in light. |
| `--mtx-focus-ring-width` / `--mtx-focus-ring-color` | Focus ring. |
| `--mtx-shape-radius` | Radius. |
| `--mtx-duration-standard` / `--mtx-duration-shortest` / `--mtx-easing-standard` | Transitions. |

## Accessibility

- Use `<article>` or `<section>` as the root when the card is self-contained content.
- On a `data-clickable` card without a `<button>`/`<a>`, `role="button"` and `tabindex="0"` are added; its accessible name comes from its content (title, subheader and text). Avoid an `aria-label` that does not contain the visible text (WCAG 2.5.3 *Label in Name*, axe `label-content-name-mismatch`); if you need one, start it with the visible title.
- Prefer `CardActionArea` on a native `<button>` or `<a>`: it keeps its semantics and leaves the `card-actions` buttons as independent controls (don't nest buttons inside the area).
- Images generated with `data-image` on the card are decorative (`aria-hidden`) unless you add `data-image-alt`; use it when the image conveys information.
- IconButtons in the actions need an `aria-label`.

| Key | Action |
|---|---|
| `Tab` | Moves through the action area, the clickable card and the buttons. |
| `Enter` / `Space` | Activates the focused clickable card or action area. |
