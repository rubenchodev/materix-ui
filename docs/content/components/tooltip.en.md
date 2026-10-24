---
title: "Tooltip"
description: "Short informative label shown on hover, keyboard focus or long press. Wrap any element with <Tooltip title>."
group: "data-display"
icon: "info"
weight: 80
example: "tooltip"
import: "Tooltip"
mui: "https://mui.com/material-ui/react-tooltip/"
---

A **Tooltip** shows a short text label that identifies or explains an element when the user hovers over it, focuses it with the keyboard or long-presses it on a touch screen, just like MUI's `Tooltip`. It is ideal for icon-only buttons and toolbars. Do not put essential information or interactive content in it (links, buttons): for persistent messages use a helper text or an [Alert](../alert/).

```tsx
import { Tooltip } from '@rubenchodev/materix-react';
// or only this component:
import { Tooltip } from '@rubenchodev/materix-react/components/tooltip';
```

## Basic usage

Wrap a **single child** with `<Tooltip title="…">`. The child receives the merged `ref` and chained pointer and focus handlers, so it must be an element or a component that forwards them (every Materix component does). If the child has no accessible name (an icon-only [IconButton](../icon-button/)), the title becomes its `aria-label`.

{{< react-demo id="tooltip/01-basic" layout="block" >}}

## Placement

`placement` accepts 12 positions (`top|bottom|left|right` with `-start|-end`); the default is `bottom`. If it doesn't fit, it flips to the opposite side and shifts to stay on screen.

{{< react-demo id="tooltip/02-placement" layout="block" >}}

## Arrow

`arrow` adds an arrow that points at the center of the trigger, even when the tooltip shifts to fit.

{{< react-demo id="tooltip/03-arrow" layout="block" >}}

## With and without icons

It works on text buttons, buttons with a start or end icon and, above all, on icon-only buttons such as [IconButton](../icon-button/) and [Fab](../fab/), where it also provides the accessible name.

{{< react-demo id="tooltip/04-with-icons" layout="block" >}}

## Disabled elements

Disabled elements don't receive pointer or focus events: wrap them with a `<span>` so the tooltip can still explain why they are unavailable, as MUI recommends. The accessible name is applied to the first focusable element inside the wrapper.

{{< react-demo id="tooltip/05-disabled" layout="block" >}}

## Delays

By default it appears after 100 ms (`enterDelay`) and disappears on leave (`leaveDelay` 0). After one closes, the next one opens with `enterNextDelay` (0 ms) for 800 ms, ideal for toolbars.

{{< react-demo id="tooltip/06-delays" layout="block" >}}

## Follow cursor

`followCursor` anchors the tooltip to the pointer while it moves over the trigger. Such a tooltip cannot be reached by the pointer, so it does not retain it (as with `disableInteractive`).

{{< react-demo id="tooltip/07-follow-cursor" layout="block" >}}

## Long text

The maximum width is 300 px (`--mtx-tooltip-max-width`) and the text wraps onto several lines.

{{< react-demo id="tooltip/08-long-text" layout="block" >}}

## Rich content

`title` accepts any `ReactNode` (formatting, keyboard shortcuts). Keep it non-interactive. With a non-text title, an unnamed trigger is labelled with `aria-labelledby` while the tooltip is visible; `describeChild` turns it into a description.

{{< react-demo id="tooltip/09-rich-content" layout="block" >}}

## Accessibility demo

If the trigger has no accessible name, the text is applied as `aria-label`. If it already has one, the tooltip describes it with `aria-describedby` while visible.

{{< react-demo id="tooltip/10-accessibility" layout="block" >}}

## Use cases

An editor's formatting bar with keyboard shortcuts (instant opening as you move across the buttons) and extra information next to a value.

{{< react-demo id="tooltip/11-use-cases" layout="block" >}}

## Grid layout

Tooltips are portaled to `<body>`: containers with `overflow` or narrow columns of a [Grid](../grid/) don't clip them.

{{< react-demo id="tooltip/12-grid" layout="block" >}}

## Programmatic usage

`open` makes the tooltip controlled: `onOpen(event)` and `onClose(event)` ask to change it (equivalents of `mtx:tooltip:open` and `mtx:tooltip:close`). For one-off actions without state, the `action` ref exposes `open()`, `close()`, `toggle()`, `update()` and `isOpen`, the equivalent of `Materix.tooltip.show/hide` and `getTooltip()`. `hideAllTooltips()` hides every visible tooltip.

{{< react-demo id="tooltip/13-programmatic" layout="block" >}}

```tsx
const actions = useRef<TooltipActions>(null);

<Tooltip title="Copied!" action={actions}>
  <Button onClick={() => actions.current?.open()}>Copy</Button>
</Tooltip>;
```

## API reference

### Tooltip props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `ReactNode` | — | Content. Empty (`''`, `null`, `false`) disables the tooltip. |
| `children` | `ReactElement` | — | Single trigger; receives `ref` and the handlers. |
| `placement` | `Placement` | `'bottom'` | `top`, `bottom`, `left`, `right` + `-start`/`-end`. Flips and shifts automatically. |
| `arrow` | `boolean` | `false` | Shows the arrow. |
| `enterDelay` | `number` | `100` | Delay before showing on hover or focus (ms). |
| `enterNextDelay` | `number` | `0` | Delay when another tooltip closed less than 800 ms ago. |
| `leaveDelay` | `number` | `0` | Delay before hiding when the pointer leaves (ms). |
| `enterTouchDelay` | `number` | `700` | Long-press duration (ms). |
| `leaveTouchDelay` | `number` | `1500` | Time visible after releasing the long press (ms). |
| `followCursor` | `boolean` | `false` | The tooltip follows the pointer. |
| `open` | `boolean` | — | Controlled visibility. |
| `onOpen` | `(event) => void` | — | Open request. |
| `onClose` | `(event) => void` | — | Close request (leave, blur, Escape, another tooltip opening). |
| `disableHoverListener` | `boolean` | `false` | Doesn't open on hover. |
| `disableFocusListener` | `boolean` | `false` | Doesn't open on keyboard focus. |
| `disableTouchListener` | `boolean` | `false` | Doesn't open on long press. |
| `disableInteractive` | `boolean` | `false` | The tooltip doesn't retain the pointer (implicit with `followCursor`). |
| `describeChild` | `boolean` | `false` | The title describes the child (`aria-describedby`) instead of naming it. |
| `id` | `string` | generated | Id of the surface. |
| `action` | `Ref<TooltipActions>` | — | Imperative API. |
| `container` / `disablePortal` | — | `document.body` | Portal target or render in place. |
| `slotProps` | `{ tooltip?, arrow? }` | — | Extra props (`className`, `style`, `data-*`…) of the surface and the arrow. |

`ref`, `className`, `style` and any other prop go to the **child** (as in MUI); the child's own props take precedence and its handlers are chained.

### Exports

| Export | Description |
|---|---|
| `Tooltip` | Component. |
| `hideAllTooltips()` | Hides every visible tooltip immediately (`Materix.tooltip.hideAll()`). |
| `getAccessibleName(el)` | Approximate accessible name of an element (same heuristic as vanilla). |
| `TOOLTIP_DEFAULTS` | MUI timings and offsets (14 px, 24 px on touch). |

### Callbacks

| Callback | Vanilla event | Fired when |
|---|---|---|
| `onOpen(event)` | `mtx:tooltip:open` | Hover/focus after the delay, long press or `action.open()`. |
| `onClose(event)` | `mtx:tooltip:close` | Leave, blur, Escape, outside touch or another tooltip opening. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-tooltip` | Surface (`role="tooltip"`), fixed position, ported to `<body>`. |
| `mtx-tooltip--open` | Visible state (grow/fade transition). |
| `mtx-tooltip--arrow` | Tooltip with an arrow. |
| `mtx-tooltip--touch` | Opened by long press: larger font and padding. |
| `mtx-tooltip__label` | Content. |
| `mtx-tooltip__arrow` | Arrow (1em × 0.71em). |
| `[data-side]` | Final side after flipping; drives the arrow and the transform origin. |

### CSS variables

| Variable | Default | Usage |
|---|---|---|
| `--mtx-tooltip-bg` | `rgba(97, 97, 97, 0.92)` | Background and arrow. |
| `--mtx-tooltip-color` | `#ffffff` | Text. |
| `--mtx-tooltip-font-size` | `0.6875rem` | Font size. |
| `--mtx-tooltip-font-size-touch` | `0.875rem` | Font size when opened by touch. |
| `--mtx-tooltip-max-width` | `300px` | Maximum width. |
| `--mtx-z-index-tooltip` | `1500` | Stacking level, above dialogs and snackbars. |

## Accessibility

- The surface has `role="tooltip"` and is linked to the trigger following the WAI-ARIA tooltip pattern:
  - If the trigger **has no accessible name**, the text is applied as its `aria-label` (marked with `data-mtx-tooltip-label` and removed on unmount).
  - If it **already has a name**, it is kept and the tooltip is linked with `aria-describedby` while visible; if both texts match, it is not duplicated. `describeChild` always uses `aria-describedby`.
- It opens on keyboard focus (Tab yes, mouse click no) and hides on blur.
- **Hoverable** (WCAG 1.4.13): the pointer can move from the trigger onto the tooltip without it disappearing.
- **Dismissible**: <kbd>Escape</kbd> hides it without moving focus, and only it: a menu or dialog underneath stays open.
- **Persistent**: it stays visible until hover or focus are removed or it is dismissed.
- On touch screens it appears with a long press (700 ms) and hides 1.5 s after release; touching elsewhere hides it.
- It respects `prefers-reduced-motion` and draws a border in forced-colors mode.

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Focusing a trigger shows its tooltip after the delay. |
| <kbd>Escape</kbd> | Hides the visible tooltip. |

## Vanilla equivalence

| Vanilla | React |
|---|---|
| `data-mtx-tooltip="Text"` | `<Tooltip title="Text">…</Tooltip>` |
| `data-mtx="tooltip"` + `data-title` (wrapper) | `<Tooltip title="…"><span>…</span></Tooltip>` |
| `data-tooltip-placement`, `data-tooltip-arrow` | `placement`, `arrow` |
| `data-tooltip-enter-delay`, `data-tooltip-leave-delay` | `enterDelay`, `leaveDelay` |
| `data-tooltip-follow-cursor` | `followCursor` |
| `Materix.tooltip.show(el)` / `hide(el)` / `get(el)` | `open` prop or `action` ref |
| `setTitle(text)` | `title` prop |
| `Materix.tooltip.hideAll()` | `hideAllTooltips()` |
| `Materix.tooltip.sync()` | Not needed (React applies ARIA on every render). |
| `mtx:tooltip:open` / `mtx:tooltip:close` | `onOpen` / `onClose` |
