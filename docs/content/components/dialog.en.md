---
title: "Dialog"
description: "A modal window that interrupts the task to ask for a decision or show critical information, with trapped focus and Escape to close."
group: "feedback"
icon: "open_in_browser"
weight: 20
example: "dialog"
import: "Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions"
mui: "https://mui.com/material-ui/react-dialog/"
---

**Dialog** opens a modal panel over the page: it locks scrolling, traps keyboard focus and requires a decision before continuing. Use it for confirmations, short forms or information the user must not miss. Don't use it for notices that need no response (use [Snackbar](../snackbar/) or [Alert](../alert/)) or for side navigation (use a Drawer).

```tsx
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@rubenchodev/materix-react';
// or only this component:
import { Dialog } from '@rubenchodev/materix-react/components/dialog';
```

## Basic usage

The simplest form is a single element: `<Dialog open={…} onClose={…} title="…">` with the content as children. `open` is controlled: `onClose(event, reason)` asks to close it and you update the state. The dialog is rendered in a portal on `document.body`, with the shared [Backdrop](../backdrop/) as its background; Escape and a click on the backdrop close it.

{{< react-demo id="dialog/01-basic" layout="block" >}}

```tsx
const [open, setOpen] = useState(false);

<Button variant="contained" onClick={() => setOpen(true)}>Open dialog</Button>
<Dialog open={open} onClose={() => setOpen(false)} title="Use the device location">
  <p>Let apps determine your location to show you nearby results.</p>
</Dialog>
```

## Anatomy

| Part | Component | Class |
|---|---|---|
| Root (fixed, in a portal) | `Dialog` | `.mtx-dialog` |
| Background | [Backdrop](../backdrop/) | `.mtx-backdrop.mtx-dialog__backdrop` |
| Panel (`role="dialog"`) | — (`paperProps`) | `.mtx-dialog__paper` |
| Title | `DialogTitle` (or `title`) | `.mtx-dialog__title` |
| Content | `DialogContent` | `.mtx-dialog__content` |
| Descriptive text | `DialogContentText` (or `description`) | `.mtx-dialog__content-text` |
| Actions | `DialogActions` (or `actions`) | `.mtx-dialog__actions` |

## With actions

`actions` wraps its buttons in a `DialogActions`, always placed at the end of the panel, outside the content. `description` generates a `DialogContentText` at the start of the content and links it with `aria-describedby`. Any element with `data-mtx-dialog-close` inside the dialog asks to close it (reason `closeButtonClick`). The main action uses `contained` and the secondary one `text`.

{{< react-demo id="dialog/02-actions" layout="block" >}}

```tsx
<Dialog
  open={open}
  onClose={close}
  maxWidth="sm"
  title="Discard draft?"
  description="The message will be deleted and you will not be able to recover it."
  actions={
    <>
      <Button onClick={close} data-dialog-autofocus>Cancel</Button>
      <Button variant="contained" onClick={close}>Discard</Button>
    </>
  }
/>
```

## Actions alignment

As in MUI, actions go on the right by default (`end`). Change it with `align="start|center|end|between"` on `DialogActions`, or for the whole dialog with `actionsAlign` (it applies to the actions without their own `align`). `between` separates an auxiliary action on the left from the main ones on the right. `disableSpacing` removes the gap between buttons.

{{< react-demo id="dialog/03-actions-alignment" layout="block" >}}

```tsx
<Dialog open={open} onClose={close} title="Export report">
  <DialogActions align="between">
    <Button startIcon="help_outline">Help</Button>
    <div className="mtx-d-flex mtx-gap-1">
      <Button onClick={close}>Cancel</Button>
      <Button variant="contained" onClick={close}>Export</Button>
    </div>
  </DialogActions>
</Dialog>
```

## Sizes

`maxWidth` sets the panel's maximum width: `xs` (20rem), `sm` (24rem), `md` (32rem, default), `lg` (48rem), `xl` (64rem) or `false` (no limit). The panel takes 100% of the available width up to that maximum; `fullWidth={false}` makes it as wide as its content. `fullScreen` takes the whole window and removes the rounded corners, the recommended pattern on mobile for long tasks.

{{< react-demo id="dialog/04-sizes" layout="block" >}}

## Destructive confirmation

For irreversible actions use a title phrased as a question, explain the consequence and color the action with `color="error"`. `role="alertdialog"` tells assistive technologies that the dialog requires an urgent response, and `data-dialog-autofocus` sends the initial focus to "Cancel", the safe option.

{{< react-demo id="dialog/05-confirmation" layout="block" >}}

## Form inside a dialog

A `<form>` can hold the [TextField](../text-field/) fields and be submitted from a button in the actions (`type="submit" form="…"`). The first field gets focus on open, or the one marked with `data-dialog-autofocus`, and `Tab` doesn't leave the panel. If the content starts directly with a field, the shared CSS reserves space at the top so the floating label is not clipped.

{{< react-demo id="dialog/06-form" layout="block" >}}

```tsx
<Dialog open={open} onClose={close} maxWidth="sm" title="Subscribe to the newsletter">
  <DialogContent>
    <form id="subscribe" onSubmit={handleSubmit}>
      <DialogContentText>Get the Materix UI news once a month.</DialogContentText>
      <TextField label="Name" name="name" required fullWidth />
      <TextField label="Email" type="email" name="email" required fullWidth
        inputProps={{ 'data-dialog-autofocus': '' }} />
    </form>
  </DialogContent>
  <DialogActions>
    <Button onClick={close}>Cancel</Button>
    <Button variant="contained" type="submit" form="subscribe">Subscribe</Button>
  </DialogActions>
</Dialog>
```

## Scroll: paper and body

With `scroll="paper"` (default) the content scrolls inside the panel; `DialogContent dividers` separates the areas and `DialogTitle sticky` / `DialogActions sticky` pin the title and the actions. With `scroll="body"` the panel grows with its content and the dialog container is what scrolls.

{{< react-demo id="dialog/07-scroll" layout="block" >}}

## Modal behavior

By default the dialog closes with a click on the backdrop (`backdropClick`) and with Escape (`escapeKeyDown`). `disableBackdropClose` and `disableEscapeKeyDown` force the user to choose an explicit action (Escape is still consumed by the dialog, so it doesn't reach the layers below). While it is open, page scrolling is locked (`disableScrollLock` turns it off).

{{< react-demo id="dialog/08-behavior" layout="block" >}}

## Nested dialogs and Escape

Dialogs join the shared layer stack: a dialog opened from another one is stacked above it (its `z-index` rises automatically), focus is trapped only in the top one, and each Escape closes only the top layer.

{{< react-demo id="dialog/09-nested" layout="block" >}}

## Stacked layers and Escape

A [Popover](../popover/), a [Menu](../menu/) and a [Tooltip](../tooltip/) opened inside a dialog join the same layer stack: each Escape closes only the top layer (a visible tooltip first), focus moves into them without being pulled back to the panel, and interacting with them never closes the dialog.

{{< react-demo id="dialog/10-layers" layout="block" >}}

## Grid layout

Inside the content you can use [Grid](../grid/) for multi-column forms; combine it with `maxWidth="lg"` to give the columns room.

{{< react-demo id="dialog/11-grid" layout="block" >}}

## Programmatic usage

The equivalent of `open()`/`close()` is the `open` prop. `onOpen` and `onClose(event, reason)` are the equivalents of `mtx:dialog:open` and `mtx:dialog:close`; `onEntered` and `onExited` fire when the panel animation ends. With `keepMounted` the dialog stays in the DOM while closed.

{{< react-demo id="dialog/12-programmatic" layout="block" >}}

## Composition

For full control, compose the parts: `DialogTitle` names the dialog (`aria-labelledby`) and the first `DialogContentText` describes it (`aria-describedby`); the ids are generated from the dialog `id` (or a unique id). You can mix both forms: `title` and `actions` are still added when you use `DialogContent` as a child.

{{< react-demo id="dialog/13-composition" layout="block" >}}

```tsx
<Dialog open={open} onClose={close} maxWidth="sm">
  <DialogTitle sticky>Composed structure</DialogTitle>
  <DialogContent>
    <DialogContentText>…</DialogContentText>
  </DialogContent>
  <DialogActions sticky>
    <Button onClick={close}>Cancel</Button>
    <Button variant="contained" onClick={close}>OK</Button>
  </DialogActions>
</Dialog>
```

## API reference

### Dialog props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Shows the dialog (controlled). |
| `onClose` | `(event, reason: 'backdropClick' \| 'escapeKeyDown' \| 'closeButtonClick') => void` | — | Close request. |
| `onOpen` | `() => void` | — | The dialog opens (also if it mounts open). |
| `onEntered` / `onExited` | `() => void` | — | The enter / exit animation ended. |
| `title` | `ReactNode` | — | Generates a `DialogTitle`. |
| `description` | `ReactNode` | — | Generates a `DialogContentText` at the start of the generated content. |
| `actions` | `ReactNode` | — | Buttons wrapped in a `DialogActions`. |
| `actionsAlign` | `'start' \| 'center' \| 'end' \| 'between'` | `'end'` | Alignment for the actions without `align`. |
| `role` | `'dialog' \| 'alertdialog'` | `'dialog'` | Role of the panel. |
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| false` | `'md'` (32rem) | Maximum width of the panel. |
| `fullWidth` | `boolean` | `true` | The panel fills the width up to `maxWidth`. |
| `fullScreen` | `boolean` | `false` | Full-screen panel (`.mtx-dialog--full`). |
| `scroll` | `'paper' \| 'body'` | `'paper'` | Area that scrolls. |
| `disableEscapeKeyDown` | `boolean` | `false` | Escape doesn't close. |
| `disableBackdropClose` | `boolean` | `false` | A backdrop click doesn't close. |
| `disableScrollLock` | `boolean` | `false` | Doesn't lock the `<body>` scroll. |
| `disableRestoreFocus` | `boolean` | `false` | Doesn't return focus to the trigger on close. |
| `disableEnforceFocus` | `boolean` | `false` | Lets focus leave the panel. |
| `hideBackdrop` | `boolean` | `false` | Doesn't render the backdrop. |
| `keepMounted` | `boolean` | `false` | Keeps the dialog in the DOM while closed. |
| `disablePortal` | `boolean` | `false` | Renders in place instead of on `document.body`. |
| `container` | `Element \| ref \| () => Element` | `document.body` | Portal target. |
| `transitionDuration` | `number \| { enter?, exit? }` | `250` | Panel animation in ms. |
| `paperProps` | `HTMLAttributes & { ref }` | — | Props of the panel. |
| `backdropProps` | `Partial<BackdropProps>` | — | Props of the [Backdrop](../backdrop/). |

`className`, `style`, `id`, `ref` and any other attribute go to the root `.mtx-dialog`; `aria-label`, `aria-labelledby` and `aria-describedby` go to the panel and take precedence over the automatic ones.

### Parts

| Component | Props | Description |
|---|---|---|
| `DialogTitle` | `sticky` | `<h2>` title; names the dialog. |
| `DialogContent` | `dividers` | Content area. |
| `DialogContentText` | — | `<p>` descriptive text; the first one describes the dialog. |
| `DialogActions` | `align`, `disableSpacing`, `sticky` | Actions bar. |

### Attributes inside the content

| Attribute | Effect |
|---|---|
| `data-dialog-autofocus` | Receives the initial focus (a container delegates to its first control). |
| `data-mtx-dialog-close` | A click asks to close with reason `closeButtonClick`. |

### Callbacks

| Callback | Vanilla event | Fired when |
|---|---|---|
| `onOpen()` | `mtx:dialog:open` | `open` becomes `true`. |
| `onClose(event, reason)` | `mtx:dialog:close` (`detail.reason`) | Backdrop, Escape or `data-mtx-dialog-close` ask to close. |
| `onExited()` | — | The exit animation ends. |

### CSS classes

| Class | Element |
|---|---|
| `.mtx-dialog` | Root. |
| `.mtx-dialog--open` | Open state (also during the exit animation). |
| `.mtx-dialog--scroll-paper`, `--scroll-body` | Scroll mode. |
| `.mtx-dialog--max-sm` … `--max-xl` | Maximum width. |
| `.mtx-dialog--full` | Full screen. |
| `.mtx-dialog__backdrop` | Background (a `Backdrop`). |
| `.mtx-dialog__paper` | Panel. |
| `.mtx-dialog__title`, `--sticky` | Title. |
| `.mtx-dialog__content`, `--dividers` | Content. |
| `.mtx-dialog__content-text` | Descriptive text. |
| `.mtx-dialog__actions`, `--start`, `--center`, `--between`, `--disable-spacing`, `--sticky` | Actions. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-z-index-modal` | Stacking level (1300). |
| `--mtx-backdrop-bg` | Backdrop color. |
| `--mtx-elevation-24` | Panel shadow. |

## Accessibility

- The panel has `role="dialog"` (or `alertdialog`) and `aria-modal="true"`; it is named by the title (`aria-labelledby`) and described by the first `DialogContentText` (`aria-describedby`). Without a title, give it an `aria-label`.
- On open, focus goes to the element with `data-dialog-autofocus`, to the first focusable control, or to the panel; on close it returns to the element that had it.
- Focus is trapped inside the top dialog; layers opened from it (popover, menu) keep their own focus.
- Page scrolling is locked while it is open.

| Key | Action |
|---|---|
| `Escape` | Closes the top dialog (unless `disableEscapeKeyDown`). |
| `Tab` / `Shift+Tab` | Moves cyclically through the controls of the panel. |

## Vanilla equivalence

| Vanilla | React |
|---|---|
| `data-mtx="dialog"` + `open()` / `close()` | `<Dialog open={…} onClose={…}>` |
| `data-title`, `data-description` | `title`, `description` |
| `.mtx-dialog__actions` / `data-mtx="dialog-actions"` | `actions` or `<DialogActions>` |
| `data-actions-align`, `data-align`, `data-disable-spacing` | `actionsAlign`, `align`, `disableSpacing` |
| `mtx-dialog--max-sm` … `--max-xl`, `mtx-dialog--full` | `maxWidth`, `fullScreen` |
| `data-scroll="body"` | `scroll="body"` |
| `data-disable-backdrop-close`, `data-disable-escape` | `disableBackdropClose`, `disableEscapeKeyDown` |
| `data-mtx-dialog-open="id"` trigger | a button that sets the state |
| `data-mtx-dialog-close`, `data-dialog-autofocus` | same attributes |
| `mtx:dialog:open` / `mtx:dialog:close` | `onOpen` / `onClose` |
