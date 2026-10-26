---
title: "Popover"
description: "Floating Paper with arbitrary content anchored to a trigger. Closes on click away or Escape and returns focus to the trigger."
group: "surfaces"
icon: "picture_in_picture"
weight: 40
example: "popover"
import: "Popover"
mui: "https://mui.com/material-ui/react-popover/"
---

A **Popover** displays any content (text, forms, cards) on a floating [Paper](../paper/) surface anchored to another element, like MUI's `Popover`. Use it for filters, quick details, small confirmations or an account card. For a list of actions use a [Menu](../menu/); for a short text label, a [Tooltip](../tooltip/); for a task that blocks the page, a [Dialog](../dialog/).

It is also the floating base other components build on (date pickers, filter panels): it handles positioning, the layer stack, focus and closing.

```tsx
import { Popover, usePopover } from '@rubenchodev/materix-react';
// or only this component:
import { Popover, usePopover } from '@rubenchodev/materix-react/components/popover';
```

## Basic usage

`usePopover()` is the equivalent of `data-open-popover="#id"`: spread `getTriggerProps()` on the trigger and `popoverProps` on the `<Popover>`. It opens below the trigger aligned to its start edge, with elevation 8. Focus moves to the first control (or to the panel) and returns to the trigger when it closes.

{{< react-demo id="popover/01-basic" layout="block" >}}

The panel is rendered in a portal on `document.body`, so ancestors with `overflow: hidden` or their own `z-index` never clip it. Content padding is up to you: use utilities such as `mtx-p-2`.

## Placement

`placement` uses the same engine as Tooltip (`top|bottom|left|right` with `-start|-end`; default `bottom-start`), with automatic flipping and shifting. `offset` sets the gap in px (0 by default, as in MUI).

{{< react-demo id="popover/02-placement" layout="block" >}}

## Anchor origins

MUI's API: `anchorOrigin={{ vertical, horizontal }}` is the point on the anchor and `transformOrigin` the point on the popover attached to it. Values are `top|center|bottom` and `left|center|right`, or pixels (numbers). The popover stays `marginThreshold` px (16) from the viewport edges and the grow animation starts from the transform origin.

{{< react-demo id="popover/03-anchor-origins" layout="block" >}}

When either origin is set it takes precedence over `placement`.

## With icons

Any button can be the trigger. Icon-only ones need an accessible name (`aria-label`). The trigger gets `aria-haspopup="dialog"`, `aria-controls` and a synchronized `aria-expanded`. Several triggers can share one popover: give each one a `key` (`getTriggerProps({ key })`) so only the active one is expanded, and each trigger becomes the anchor when clicked.

{{< react-demo id="popover/04-with-icons" layout="block" >}}

The heading inside the popover becomes its name automatically (`aria-labelledby`).

## States

A disabled trigger does not open the popover. Elements with `data-mtx-popover-close` inside the popover close it (reason `action`) and return focus.

{{< react-demo id="popover/05-states" layout="block" >}}

## Anchor position

`anchorReference="anchorPosition"` with `anchorPosition={{ top, left }}` anchors the popover to a viewport point instead of an element, for example the cursor position in a `contextmenu` event. `usePopover().openPopover({ x, y })` does the same. With `anchorReference="none"` the popover is centered in the viewport.

{{< react-demo id="popover/06-anchor-position" layout="block" >}}

## Modal

By default the popover is **non-modal**: it does not trap focus or lock scrolling, and tabbing out of it closes it (reason `tabOut`). With `modal` it traps <kbd>Tab</kbd>, locks page scrolling and sets `aria-modal="true"`, like MUI's Popover; a click outside still closes it (reason `clickaway`) and reaches the clicked element, as in vanilla. `data-autofocus` on a control chooses the initial focus.

{{< react-demo id="popover/07-modal" layout="block" >}}

## Dialog from a popover

A button inside the popover can open a [Dialog](../dialog/). Interacting with the dialog is not a "click outside" for the popover, the first <kbd>Escape</kbd> closes only the dialog (focus returns to the button inside the popover) and the second one closes the popover.

{{< react-demo id="popover/08-dialog" layout="block" >}}

## Layer from a popover

A popover can also open another popover (or a menu). Both share the layer stack: interacting with the upper layer is not a "click outside" for the popover, the first <kbd>Escape</kbd> closes only the upper layer (focus returns to its trigger inside the popover) and the second one closes the popover.

{{< react-demo id="popover/09-nested" layout="block" >}}

## Real-world examples

Table filters and an account card opened from an avatar, aligned to the end:

{{< react-demo id="popover/10-use-cases" layout="block" >}}

## Grid layout

The popover is portaled to `<body>`, so columns and containers with `overflow` never clip it.

{{< react-demo id="popover/11-grid" layout="block" >}}

## Mouse over interaction

MUI's hover pattern: open on `mouseenter`/`focus`, close on `mouseleave`/`blur`, with `disableAutoFocus`, `disableRestoreFocus` and the `mtx-pointer-events-none` utility so the popover never steals the pointer or the focus.

{{< react-demo id="popover/12-hover" layout="block" >}}

## Programmatic usage

The `open` prop is the equivalent of `open()`/`close()`. `usePopover()` exposes `openPopover(anchor)`, `close()` and `toggle(anchor)`; `onOpen` and `onClose(event, reason)` are the equivalents of `mtx:popover:open` and `mtx:popover:close`. The `action` ref exposes `updatePosition()` (vanilla's `update()`).

{{< react-demo id="popover/13-programmatic" layout="block" >}}

```tsx
const [open, setOpen] = useState(false);
const anchorRef = useRef<HTMLButtonElement>(null);
const action = useRef<PopoverActions>(null);

<Button ref={anchorRef} onClick={() => setOpen(true)}>Filters</Button>
<Popover
  open={open}
  anchorEl={anchorRef}             // element, ref, function or virtual anchor
  onClose={(event, reason) => setOpen(false)}
  onOpen={(anchor) => console.log('open', anchor)}
  action={action}                   // action.current.updatePosition()
>
  …
</Popover>
```

## Manual trigger

The equivalent of vanilla's manual BEM usage: you can skip `usePopover` and wire the trigger yourself with `aria-controls`, `aria-haspopup="dialog"` and `aria-expanded`, giving the popover an `id` and naming it with `aria-labelledby`. A click on an element whose `aria-controls` points to the popover is never treated as "outside".

{{< react-demo id="popover/14-manual-trigger" layout="block" >}}

## Reuse in other components

`Popover` is designed as the floating base for other surfaces. The props they rely on:

```tsx
<Popover
  open={open}
  anchorEl={inputRef}                 // ref or element; or a virtual anchor
  placement="bottom-start"            // or anchorOrigin/transformOrigin
  offset={4}
  modal={isMobile}                    // traps Tab and locks scroll
  disableAutoFocus                    // the owner moves focus itself
  disableRestoreFocus                 // the owner restores focus itself
  onClose={(event, reason) => …}      // escapeKeyDown | clickaway | tabOut | action
  role="dialog" aria-label="Choose date"
  className="mtx-date-picker__popover"
/>
```

`resolveOrigin()` (MUI origin to pixels) and the constants `POPOVER_MARGIN_THRESHOLD` and `POPOVER_EXIT_DURATION` are also exported.

## API reference

### Popover props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Shows the popover (controlled). |
| `anchorEl` | `Element \| VirtualElement \| ref \| () => Element` | — | Anchor (`data-anchor` or the trigger in vanilla). |
| `anchorReference` | `'anchorEl' \| 'anchorPosition' \| 'none'` | `'anchorEl'` | Which anchor to use; `none` centers it. |
| `anchorPosition` | `{ top, left }` | — | Viewport point with `anchorReference="anchorPosition"`. |
| `anchorOrigin` | `{ vertical, horizontal }` | `bottom left` | Point on the anchor (MUI algorithm). Takes precedence over `placement`. |
| `transformOrigin` | `{ vertical, horizontal }` | `top left` | Point on the popover attached to the anchor. |
| `placement` | `top`, `bottom`, `left`, `right` + `-start`/`-end` | `bottom-start` | Placement with flip and shift. |
| `offset` | `number` | `0` | Gap from the anchor (with `placement`). |
| `marginThreshold` | `number` | `16` | Minimum distance to the viewport edges. |
| `elevation` | `0`–`8`, `12`, `16`, `24` | `8` | Shadow (and overlay in the dark theme). |
| `modal` | `boolean` | `false` | Tab trap, scroll lock and `aria-modal`. |
| `label` | `string` | — | `aria-label` (otherwise the first heading names it). |
| `onClose` | `(event, reason) => void` | — | Close request; reasons `escapeKeyDown`, `clickaway`, `tabOut`, `action` (`trigger` only comes from `usePopover`, when its trigger is clicked again). |
| `onOpen` | `(anchor) => void` | — | Opened and positioned. |
| `onExited` | `() => void` | — | The exit transition finished. |
| `disableAutoFocus` | `boolean` | `false` | Does not move focus on open. |
| `disableRestoreFocus` | `boolean` | `false` | Does not return focus on close. |
| `disableEscapeKeyDown` | `boolean` | `false` | Ignores Escape. |
| `disablePortal` | `boolean` | `false` | Renders in place instead of on `document.body`. |
| `container` | `Element \| ref \| () => Element` | `document.body` | Portal target. |
| `keepMounted` | `boolean` | `false` | Keeps the node (with `hidden`) while closed. |
| `transitionDuration` | `number` | `150` | Exit time in ms before hiding/unmounting. |
| `action` | `Ref<{ updatePosition() }>` | — | Imperative actions. |

`id` (generated if missing), `className` (merged), `ref`, `style` and any other attribute go to the root `<div>`; `role`, `tabIndex` and `aria-labelledby` can be overridden.

### usePopover

| Member | Type | Description |
|---|---|---|
| `getTriggerProps({ key?, onClick? })` | `function` | `aria-haspopup`, `aria-controls`, `aria-expanded` and the toggle `onClick` for a trigger. |
| `popoverProps` | `object` | `id`, `open`, `anchorEl`, `onClose` for `<Popover>`. |
| `open`, `anchor` | state | Open state and current anchor. |
| `openPopover(anchor)` | `function` | Opens anchored to an element, a point `{ x, y }` or a virtual anchor. |
| `close()` | `function` | Closes it (reason `api`). |
| `toggle(anchor)` | `function` | Toggles the state. |

Options: `usePopover({ id, keepMounted, onOpen(anchor), onClose(reason) })`. The trigger only gets `aria-controls` while the popover is in the DOM (open, or always with `keepMounted`), as in MUI.

### Callbacks

| Callback | Vanilla event | Fired when |
|---|---|---|
| `onOpen(anchor)` | `mtx:popover:open` | It opens. |
| `onClose(event, reason)` | `mtx:popover:close` | It asks to close. |
| `onExited()` | — | The exit transition ends. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-popover` | Surface: Paper with radius 4px, elevation 8, `max-width`/`max-height` `calc(100% - 32px)` and its own scroll. |
| `mtx-popover--open` | Visible state (grow transition from the transform origin). |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-popover-shadow` | Shadow (set by `elevation`; default `--mtx-elevation-8`). |
| `--mtx-popover-overlay` | Elevation overlay in the dark theme. |
| `--mtx-color-background-paper`, `--mtx-color-text-primary` | Surface and text. |
| `--mtx-z-index-modal` | Stacking level (1300). |

## Accessibility

- The popover has `role="dialog"` and `tabindex="-1"`. Its name comes from `label` (`aria-label`), from `data-popover-title` or from the first internal heading (`aria-labelledby`). With `modal` it also gets `aria-modal="true"`.
- The trigger gets `aria-haspopup="dialog"`, `aria-controls` and an `aria-expanded` synchronized with the state (`getTriggerProps`).
- When it opens, focus moves to `[data-autofocus]`, to the first focusable control or to the panel itself. When it closes with <kbd>Escape</kbd>, the trigger or a close button, focus returns to the element that had it (or to the anchor if the browser did not focus it on click, as in Safari).
- Clicking outside closes it without stealing focus from the element that was clicked; if focus would be lost, it returns to the trigger.
- If the trigger only shows an avatar or initials, name it with visually hidden text (`<span className="mtx-visually-hidden">…</span>`) instead of an `aria-label` that does not contain the visible text (WCAG 2.5.3 *Label in Name*).

| Key | Action |
|---|---|
| <kbd>Enter</kbd> / <kbd>Space</kbd> on the trigger | Opens or closes the popover. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through its controls. Non-modal: leaving the popover closes it. Modal: focus cycles inside. |
| <kbd>Escape</kbd> | Closes it and returns focus to the trigger, only if it is the top layer. |

## Vanilla equivalence

| Vanilla | React |
|---|---|
| `data-mtx="popover"` + `open()` / `close()` | `<Popover open={…} onClose={…}>` |
| `data-open-popover="#id"` / `aria-controls="id"` trigger | `usePopover().getTriggerProps()` |
| `open(element)` / `open({ x, y })` / `toggle()` | `openPopover(anchor)` / `toggle(anchor)`, or `anchorEl` / `anchorPosition` |
| `update()` | `action.current.updatePosition()` |
| `data-placement`, `data-offset` | `placement`, `offset` |
| `data-anchor-origin="top right"` | `anchorOrigin={{ vertical: 'top', horizontal: 'right' }}` |
| `data-transform-origin` | `transformOrigin` |
| `data-anchor="#el"` | `anchorEl={ref}` |
| `data-label`, `data-elevation`, `data-modal` | `label`, `elevation`, `modal` |
| `data-mtx-popover-close`, `data-autofocus`, `data-popover-title` | same attributes inside the content |
| `mtx:popover:open` / `mtx:popover:close` (`reason`) | `onOpen` / `onClose(event, reason)` |
| reasons `escape`, `click-away`, `tab`, `action`, `trigger` | `escapeKeyDown`, `clickaway`, `tabOut`, `action`, `trigger` |
