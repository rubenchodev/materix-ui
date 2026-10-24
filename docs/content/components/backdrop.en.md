---
title: "Backdrop"
description: "Full-screen layer that dims the page and centers an indicator while an operation runs; it does not replace a dialog."
group: "feedback"
icon: "gradient"
weight: 15
example: "backdrop"
import: "Backdrop"
mui: "https://mui.com/material-ui/react-backdrop/"
---

**Backdrop** covers the whole screen with a semi-transparent layer and centers its content, usually a [CircularProgress](../progress/). Use it to signal that the page is busy during a short operation (saving, syncing, processing a payment). **It is not a dialog**: it has no role, doesn't trap focus and offers no title or actions; if the user must read a message or make a decision, use a [Dialog](../dialog/), which already includes its own backdrop (it reuses this component).

```tsx
import { Backdrop } from '@rubenchodev/materix-react';
// or only this component:
import { Backdrop } from '@rubenchodev/materix-react/components/backdrop';
```

## Basic usage

`<Backdrop open={…}>` with the content to center. `open` is controlled: `onClose` asks to close it and you update the state. With `closeOnClick` a click on the layer closes it, and with `closeOnEscape`, the Escape key. The content is white by default, so a `CircularProgress color="inherit"` stands out in both themes.

{{< react-demo id="backdrop/01-basic" layout="block" >}}

## Variants

Two variants, as in MUI: the default one dims the page with `--mtx-backdrop-bg`, and `invisible` keeps the layer transparent (it still blocks clicks). With `invisible` the content keeps the text color, so use a colored indicator.

{{< react-demo id="backdrop/02-variants" layout="block" >}}

## With content

Children are centered with flexbox; combine them with [Stack](../stack/) and [Typography](../typography/). Any element marked with `data-mtx-backdrop-close` closes the layer (reason `click`), even without `closeOnClick`.

{{< react-demo id="backdrop/03-content" layout="block" >}}

## Closing

- `closeOnClick`: a click on the layer or on non-interactive content asks to close (reason `click`). Clicks on buttons, links or fields inside the content are ignored.
- `closeOnEscape`: Escape asks to close (reason `escape`) through the shared layer stack, so it only reaches the top layer.
- Without either flag the layer only closes when you set `open={false}` (for example, when the operation ends).

{{< react-demo id="backdrop/04-closing" layout="block" >}}

## States

`lockScroll` locks the `<body>` scroll while it is open (modal manager shared with Dialog), and `inertOthers` marks the rest of the document as `inert` (no focus, no clicks, hidden from screen readers) and restores it on close. With either of them the backdrop joins the layer stack and consumes Escape even if it doesn't close with it.

{{< react-demo id="backdrop/05-states" layout="block" >}}

## Real-world examples

Saving a form: the backdrop covers the page while the request runs and closes by itself when it finishes; then a [Snackbar](../snackbar/) confirms the result. The project name is a [TextField](../text-field/).

{{< react-demo id="backdrop/06-use-cases" layout="block" >}}

## Grid layout

The layer is rendered in a portal on `document.body` and does not take part in the layout; here a grid of triggers opens the same backdrop with different messages.

{{< react-demo id="backdrop/07-grid" layout="block" >}}

## Programmatic usage

The equivalent of `open()`/`close()`/`toggle()` is the `open` prop. `onOpen` and `onClose(event, reason)` are the equivalents of `mtx:backdrop:open` and `mtx:backdrop:close`; `onExited` fires when the fade-out ends.

{{< react-demo id="backdrop/08-programmatic" layout="block" >}}

## Reuse in other overlays

[Dialog](../dialog/), [Drawer](../drawer/) and other modal components render `Backdrop` as their background layer. These are the props they rely on:

```tsx
<Backdrop
  open={open}                 // shows the layer with the fade
  invisible={false}           // transparent layer for menus/popovers
  onClick={handleBackdropClick} // always called, before the close logic
  className="mtx-dialog__backdrop"
  transitionDuration={{ enter: 225, exit: 195 }}
  disablePortal               // the overlay already renders inside its own portal
/>
```

## API reference

### Backdrop props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Shows the layer (controlled). |
| `invisible` | `boolean` | `false` | Transparent layer (`.mtx-backdrop--invisible`). |
| `closeOnClick` | `boolean` | `false` | A click on the layer or non-interactive content asks to close. |
| `closeOnEscape` | `boolean` | `false` | Escape asks to close (layer stack). |
| `lockScroll` | `boolean` | `false` | Locks the `<body>` scroll while open. |
| `inertOthers` | `boolean` | `false` | Marks the rest of the document as `inert` while open. |
| `onClick` | `(event) => void` | — | Click on the layer; always called. |
| `onClose` | `(event, reason: 'click' \| 'escape') => void` | — | Close request. |
| `onOpen` | `() => void` | — | `open` goes from `false` to `true`. |
| `onExited` | `() => void` | — | The fade-out finished. |
| `transitionDuration` | `number \| { enter?, exit? }` | `{ enter: 225, exit: 195 }` | Fade duration in ms. |
| `disablePortal` | `boolean` | `false` | Renders in place instead of on `document.body`. |
| `container` | `Element \| ref \| () => Element` | `document.body` | Portal target. |
| `keepMounted` | `boolean` | `false` | Keeps the node (with `hidden`) while closed. |

`className` is merged; `ref`, `style` (for example a custom `zIndex`) and any other attribute go to the root `<div>`.

### Callbacks

| Callback | Vanilla event | Fired when |
|---|---|---|
| `onOpen()` | `mtx:backdrop:open` | `open` goes from `false` to `true` (not on the initial render). |
| `onClose(event, reason)` | `mtx:backdrop:close` | Click (`click`) or Escape (`escape`) asks to close. |
| `onExited()` | — | The fade-out ends and the node is unmounted. |

### CSS classes

| Class | Element |
|---|---|
| `.mtx-backdrop` | Root layer. |
| `.mtx-backdrop--open` | Open state. |
| `.mtx-backdrop--invisible` | Transparent variant. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-backdrop-bg` | Layer color (`rgba(0, 0, 0, 0.5)`). |
| `--mtx-backdrop-color` | Content color (white). |
| `--mtx-backdrop-z-index` | Stacking level (`--mtx-z-index-drawer` + 1). |

## Accessibility

- The backdrop has no role and doesn't move focus: it is a visual indicator. Give the indicator an accessible name (`CircularProgress label="Loading"`).
- While closed or fading out it has `aria-hidden="true"`.
- To keep keyboard and screen reader users out of the page while it is busy, use `inertOthers`. For messages or decisions, use a [Dialog](../dialog/), which traps focus.

| Key | Action |
|---|---|
| `Escape` | Closes the layer with `closeOnEscape` (only if it is the top layer). |
| `Tab` | Moves through interactive content inside the layer. |

## Vanilla equivalence

| Vanilla | React |
|---|---|
| `data-mtx="backdrop"` + `open()` / `close()` / `toggle()` | `<Backdrop open={…}>` |
| `data-open` | initial `open={true}` |
| `data-invisible` | `invisible` |
| `data-close-on-click`, `data-close-on-escape` | `closeOnClick`, `closeOnEscape` |
| `data-lock-scroll`, `data-inert` | `lockScroll`, `inertOthers` |
| `data-z="2000"` | `style={{ zIndex: 2000 }}` |
| `data-mtx-backdrop-open="id"` trigger | a button that sets the state |
| `data-mtx-backdrop-close` | same attribute inside the content |
| `mtx:backdrop:open` / `mtx:backdrop:close` | `onOpen` / `onClose` |
