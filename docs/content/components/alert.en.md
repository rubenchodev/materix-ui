---
title: "Alert"
description: "A short, prominent message that reports the outcome of an action or the state of the system without interrupting the user."
group: "feedback"
icon: "warning"
weight: 10
example: "alert"
import: "Alert, AlertTitle"
mui: "https://mui.com/material-ui/react-alert/"
---

**Alert** shows a short, important message inside the page flow, with a color and an icon that communicate its severity (`success`, `info`, `warning`, `error`). Use it to confirm an operation, warn about a problem or explain a validation error next to the affected content. Don't use it for temporary notifications that disappear on their own (use a Snackbar) or for decisions that block the task (use a Dialog).

```tsx
import { Alert, AlertTitle } from '@rubenchodev/materix-react';
// or only this component:
import { Alert, AlertTitle } from '@rubenchodev/materix-react/components/alert';
```

## Basic usage

`<Alert severity="…">` is enough: the component renders the severity icon, the `.mtx-alert__message` container and, with `title`, the title.

{{< react-demo id="alert/01-basic" layout="block" >}}

## Variants

Three variants, as in MUI: `standard` (soft background, default), `filled` (solid background) and `outlined` (border only). `standard` and `outlined` use the severity color darkened in the light theme and lightened in the dark theme, so the text keeps its contrast.

{{< react-demo id="alert/02-variants" layout="block" >}}

## With and without icons

By default the severity SVG icon is rendered at 22px, as in MUI. `icon` replaces it (a node, or a Material Icons name, which keeps its 24px grid) and `icon={false}` removes it.

{{< react-demo id="alert/03-icons" layout="block" >}}

## Severities

`severity` sets the color and the icon. Use `success`, `info`, `warning` or `error` according to the meaning of the message; without the prop, `success` is applied.

{{< react-demo id="alert/04-severities" layout="block" >}}

## Title

`title` renders a bold `.mtx-alert__title` above the message. You can also write `<AlertTitle>` as the first child, as in MUI.

{{< react-demo id="alert/05-title" layout="block" >}}

## Actions

`action` places content to the right of the message (for example, an "Undo" button).

{{< react-demo id="alert/06-actions" layout="block" >}}

## Dismissible

`onClose` (or `dismissible`) adds an accessible close button; `closeLabel` changes its label for screen readers (by default, `Close` / `Cerrar` from the i18n dictionary). When closed, the alert fades out for 200 ms, receives `hidden` (it leaves the flow: no gap is left) and calls `onClosed`. Uncontrolled alerts close by themselves; with `open`, `onClose` is a request and you update the state.

{{< react-demo id="alert/07-dismissible" layout="block" >}}

## In forms

Bind `open` to the validation result (the fields are outlined `TextField`s): a closed alert has `hidden` and takes no space. Submit the empty form to see the error and fill it in to see the success message.

{{< react-demo id="alert/08-forms" layout="block" >}}

## Grid layout

Alerts take the width of their container, so they fit any grid column.

{{< react-demo id="alert/09-grid" layout="block" >}}

## Programmatic usage

The equivalent of `close()`/`open()` is the `open` prop. `onOpen` and `onClosed` are the equivalents of the `mtx:alert:open` and `mtx:alert:close` events; new alerts are just rendered.

{{< react-demo id="alert/10-programmatic" layout="block" >}}

## API reference

### Alert props

| Prop | Type | Default | Description |
|---|---|---|---|
| `severity` | `'success' \| 'info' \| 'warning' \| 'error'` | `'success'` | Color and icon. |
| `variant` | `'standard' \| 'filled' \| 'outlined'` | `'standard'` | Visual variant. |
| `title` | `ReactNode` | — | Title above the message (`.mtx-alert__title`). |
| `icon` | `ReactNode \| string \| false` | severity SVG | Custom icon (inside `.mtx-alert__icon`); `false` hides it. |
| `action` | `ReactNode` | — | Content to the right of the message. |
| `onClose` | `(event) => void` | — | Click on the close button; its presence shows the button. |
| `dismissible` | `boolean` | `false` | Shows the close button without `onClose`. |
| `closeLabel` | `string` | i18n `alert.close` | Accessible name of the close button. |
| `open` | `boolean` | — | Controlled visibility. |
| `defaultOpen` | `boolean` | `true` | Initial uncontrolled visibility. |
| `onOpen` | `() => void` | — | A closed alert is shown again. |
| `onClosed` | `() => void` | — | The close animation finished and the alert is hidden. |
| `role` | `string` | `'alert'` | Use `'status'` for messages that shouldn't interrupt. |
| `locale` | `string` | context | Language of the built-in texts. |

`className` is merged; `ref`, `style` and any other attribute go to the root `<div>`.

`AlertTitle` renders `<div class="mtx-alert__title">` and accepts the attributes of a `<div>`.

### Callbacks

| Callback | Vanilla event | Fired when |
|---|---|---|
| `onClose(event)` | — (click on `.mtx-alert__close`) | The close button is clicked. |
| `onClosed()` | `mtx:alert:close` | The close animation finishes (or immediately with `prefers-reduced-motion`). |
| `onOpen()` | `mtx:alert:open` | `open` goes from `false` to `true`. |

### CSS classes

| Class | Element |
|---|---|
| `.mtx-alert` | Root. |
| `.mtx-alert--{severity}`, `.mtx-alert--{variant}` | Severity and variant. |
| `.mtx-alert__icon` | Icon container. |
| `.mtx-alert__message` | Message (with the title). |
| `.mtx-alert__title` | Title. |
| `.mtx-alert__close` | Close button. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-{severity}` | `filled` background, `outlined` border and base of the `standard` soft background. |
| `--mtx-alert-text-mix` / `--mtx-alert-bg-mix` | Tones mixed with the severity color in `standard`/`outlined`. |
| `--mtx-color-{severity}-contrast` | Text color in `filled`. |
| `--mtx-shape-radius` | Corner radius (4 px). |

## Accessibility

- The root has `role="alert"`, which screen readers announce immediately. For informational messages that shouldn't interrupt, pass `role="status"`.
- Generated SVG icons have `aria-hidden="true"` and `focusable="false"`; the meaning must be in the text, not only in the color.
- The close button is a native `<button type="button">` with an `aria-label` configurable through `closeLabel`.
- If you pass a custom icon node, mark it with `aria-hidden="true"`.

| Key | Action |
|---|---|
| `Tab` | Moves focus to the action and the close button. |
| `Enter` / `Space` | Activates the focused button (close or action). |

## Vanilla equivalence

| Vanilla | React |
|---|---|
| `data-severity`, `data-variant` | `severity`, `variant` |
| `data-title="…"` | `title="…"` or `<AlertTitle>` |
| child `.mtx-alert__icon` / `data-icon="false"` | `icon={…}` / `icon={false}` |
| button next to `.mtx-alert__message` | `action={…}` |
| `data-dismissible`, `data-close-label` | `onClose` or `dismissible`, `closeLabel` |
| `close()` / `open()` | `open` (controlled) |
| `mtx:alert:close` / `mtx:alert:open` | `onClosed` / `onOpen` |
| `hidden` on the element | `open={false}` / `defaultOpen={false}` |
