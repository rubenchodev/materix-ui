---
title: "Snackbar"
description: "Brief, temporary notification at an edge of the screen that confirms an action and can offer to undo it."
group: "feedback"
icon: "chat_bubble"
weight: 30
example: "snackbar"
import: "Snackbar, SnackbarProvider, useSnackbar"
mui: "https://mui.com/material-ui/react-snackbar/"
---

**Snackbar** shows a short floating message at an edge of the screen to confirm the outcome of an action ("Email sent", "Item deleted") and, optionally, offer a single action such as "Undo". It does not interrupt the user and can close on its own. Do not use it for errors the user must resolve (use an [Alert](../alert/) next to the content) or for mandatory decisions (use a [Dialog](../dialog/)).

```tsx
import { Snackbar, SnackbarProvider, useSnackbar } from '@rubenchodev/materix-react';
// or only this component:
import { Snackbar, SnackbarProvider, useSnackbar } from '@rubenchodev/materix-react/components/snackbar';
```

## Basic usage

`<Snackbar open={…} message="…">` is enough. `open` is controlled: `onClose(event, reason)` asks to close it and you update the state. It closes with Escape, on a click outside or, with `autoHideDuration`, when the time runs out.

{{< react-demo id="snackbar/01-basic" layout="block" >}}

## With action

A text `action` renders the `.mtx-snackbar__action` button on the right; `onAction` runs when it is pressed and `closeOnAction` closes the snackbar (reason `action`). Any other node (for example an [IconButton](../icon-button/)) is rendered as is.

{{< react-demo id="snackbar/02-action" layout="block" >}}

## Position

`anchorOrigin` combines `vertical` (`top`/`bottom`) with `horizontal` (`left`/`center`/`right`); by default, bottom center. Below 600px the snackbar spans the full width with an 8px side margin.

{{< react-demo id="snackbar/03-position" layout="block" >}}

## Duration

Without `autoHideDuration` (or with `null`) the snackbar does not close by itself. The timer pauses while the pointer or focus is on it and restarts with the full duration when they leave.

{{< react-demo id="snackbar/04-duration" layout="block" >}}

## Consecutive

`SnackbarProvider` keeps a queue and shows one notice at a time: a new notice closes the visible one and appears when its exit transition ends, as in MUI's *Consecutive Snackbars* example.

{{< react-demo id="snackbar/05-consecutive" layout="block" >}}

## With Alert

For notifications with a severity, place an [Alert](../alert/) as the child of a snackbar without `message`. The `mtx-p-0 mtx-bg-transparent` utilities remove the snackbar padding and background, and `mtx-flex-1` stretches the alert.

{{< react-demo id="snackbar/06-with-alert" layout="block" >}}

## Quick notices with useSnackbar()

For one-off confirmations you don't need to declare a snackbar: wrap the app once with `<SnackbarProvider>` and call `useSnackbar().enqueue(message | options)`. The shared snackbar uses `role="status"` and a 4 s duration by default; `onAction` runs when the action is pressed and closes the notice. `enqueue` returns a key that `close(key)` accepts.

{{< react-demo id="snackbar/07-quick-notice" layout="block" >}}

```tsx
const { enqueue } = useSnackbar();
enqueue('Link copied');
enqueue({
  message: 'Conversation archived',
  action: 'Undo',
  onAction: () => restoreConversation(),
  duration: 6000,
  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
});
```

## Real-world examples

A subscription form with an `Email` [TextField](../text-field/): when the address is valid, the shared snackbar confirms it and offers to undo it.

{{< react-demo id="snackbar/08-use-cases" layout="block" >}}

## Grid layout

A typical case: actions in a [Grid](../grid/) where each one confirms its result with the shared snackbar.

{{< react-demo id="snackbar/09-grid" layout="block" >}}

## Programmatic usage

The equivalent of `open()`/`close()` is the `open` prop; `setMessage()`/`setAction()` are the `message` and `action` props. `onOpen`, `onAction` and `onClose(event, reason)` are the equivalents of `mtx:snackbar:open`, `mtx:snackbar:action` and `mtx:snackbar:close`. Escape only closes the most recent snackbar, and never while a dialog or menu is open on top.

{{< react-demo id="snackbar/10-programmatic" layout="block" >}}

## API reference

### Snackbar props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Shows the snackbar (controlled). |
| `onClose` | `(event, reason) => void` | — | Close request; `reason` is `timeout`, `clickaway`, `escapeKeyDown` or `action` (`api` is reserved for `useSnackbar().close()`). |
| `message` | `ReactNode` | — | Message (`.mtx-snackbar__message`). |
| `action` | `ReactNode` | — | Text → `.mtx-snackbar__action` button; node → rendered as is. |
| `onAction` | `(event) => void` | — | Click on the generated action. |
| `closeOnAction` | `boolean` | `false` | The generated action closes the snackbar (reason `action`). |
| `autoHideDuration` | `number \| null` | `null` | Auto-close in ms; `null` disables it. |
| `anchorOrigin` | `{ vertical, horizontal }` | `{ vertical: 'bottom', horizontal: 'center' }` | Position. |
| `role` | `'alert' \| 'status'` | `'alert'` | Live role of the message. |
| `disableClickAway` | `boolean` | `false` | A click outside doesn't ask to close. |
| `onOpen` | `() => void` | — | `open` goes from `false` to `true`. |
| `onExited` | `() => void` | — | The exit transition finished (the node is unmounted). |
| `children` | `ReactNode` | — | Extra content between the message and the action (for example an Alert). |

`className` is merged; `ref`, `style` and any other attribute go to the root `<div>`.

### SnackbarProvider and useSnackbar

| Prop of `SnackbarProvider` | Type | Default | Description |
|---|---|---|---|
| `anchorOrigin` | `{ vertical, horizontal }` | bottom center | Default position. |
| `autoHideDuration` | `number \| null` | `4000` | Default duration. |
| `role` | `'alert' \| 'status'` | `'status'` | Default live role. |
| `className` | `string` | — | Classes of the shared snackbar. |

`useSnackbar()` returns `{ enqueue, close }` and throws if there is no provider above.

| `enqueue` option | Type | Description |
|---|---|---|
| `message` | `ReactNode` | Message. |
| `action` | `string \| null \| false` | Action label. |
| `onAction` | `(event) => void` | Runs when the action is pressed and closes the notice; without it the action doesn't close. |
| `duration` | `number \| null` | Duration of this notice. |
| `anchorOrigin` | `{ vertical, horizontal }` | Position of this notice. |
| `role` | `'alert' \| 'status'` | Live role of this notice. |
| `onClose` | `(reason) => void` | The notice closed: `timeout`, `clickaway`, `escapeKeyDown`, `action`, `api` (closed with `close()`) or `replaced` (a newer one replaced it). |
| `key` | `string \| number` | Own identifier for `close(key)`. |

### Callbacks

| Callback | Vanilla event | Fired when |
|---|---|---|
| `onOpen()` | `mtx:snackbar:open` | `open` goes from `false` to `true`. |
| `onAction(event)` | `mtx:snackbar:action` | The generated action is clicked. |
| `onClose(event, reason)` | `mtx:snackbar:close` | Timer, click outside, Escape or action ask to close. |
| `onExited()` | — | The exit transition ends. |

### CSS classes

| Class | Element |
|---|---|
| `.mtx-snackbar` | Root. |
| `.mtx-snackbar--{vertical}-{horizontal}` | Position (`bottom-center`, `top-right`…). |
| `.mtx-snackbar--open` | Visible state. |
| `.mtx-snackbar__message` | Message. |
| `.mtx-snackbar__action` | Generated action button. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-snackbar-bg` / `--mtx-snackbar-color` | Background and text (inverted in the dark theme). |
| `--mtx-snackbar-action-color` | Action color. |
| `--mtx-z-index-snackbar` | Stacking level (1400). |
| `--mtx-elevation-6` | Shadow. |

## Accessibility

- The message has `role="alert"` (urgent, announced immediately) or `role="status"` for non-urgent notices; the shared snackbar of `SnackbarProvider` uses `status`.
- The generated action is a native `<button type="button">`; the timer pauses while it has focus so keyboard users have time to use it.
- Avoid essential information that disappears: use a long `autoHideDuration` (or none) when the notice has an action.

| Key | Action |
|---|---|
| `Escape` | Closes the most recent snackbar (reason `escapeKeyDown`) if no dialog or menu is open. |
| `Tab` | Moves focus to the action. |
| `Enter` / `Space` | Activates the action. |

## Vanilla equivalence

| Vanilla | React |
|---|---|
| `data-mtx="snackbar"` + `open()` / `close()` | `<Snackbar open={…}>` |
| `data-message`, `setMessage()` | `message` |
| `data-action`, `setAction()` | `action` |
| `data-close-on-action` | `closeOnAction` |
| `data-duration="4000"` / `none` | `autoHideDuration={4000}` / `null` |
| `data-anchor="top-right"` | `anchorOrigin={{ vertical: 'top', horizontal: 'right' }}` |
| `data-role="status"` | `role="status"` |
| `open({ message, action, onAction, duration })` | props, or `enqueue({ … })` |
| `Materix.snackbar.show()` / `showSnackbar()` | `SnackbarProvider` + `useSnackbar().enqueue()` |
| `mtx:snackbar:open` / `:action` / `:close` | `onOpen` / `onAction` / `onClose` |
