---
title: "Form Helper Text"
description: "Helper and error text below a form control, plus FormControl and FormLabel to share error, disabled and required state with the controls inside."
group: "inputs"
icon: "info"
weight: 45
example: "form-helper-text"
import: "FormHelperText, FormControl, FormLabel, useFormControl"
mui: "https://mui.com/material-ui/api/form-helper-text/"
---

**FormHelperText** is the caption below a control that explains what to enter or why the value is invalid. **FormControl** groups a label, a control and its helper text and shares `error`, `disabled` and `required` through a context, so every piece updates together; **FormLabel** is the group label. Checkbox, Switch and RadioGroup already render these pieces for you with `helperText` and `error`; use them directly to compose your own layouts or to build new controls with `useFormControl()`.

{{< callout type="tip" title="When to compose it yourself" >}}
For a single control, prefer the `helperText`/`error` props of [Checkbox](../checkbox/), [Switch](../switch/) or [Radio](../radio/). Reach for `FormControl` when several controls share one label and one message, or when you write a custom control.
{{< /callout >}}

```tsx
import '@rubenchodev/materix-ui/base.css';
import { FormControl, FormHelperText, FormLabel } from '@rubenchodev/materix-react';

<FormControl error>
  <FormLabel>Consent</FormLabel>
  {/* control */}
  <FormHelperText>You must accept the terms.</FormHelperText>
</FormControl>
```

## Basic usage

`FormHelperText` renders a `<p class="mtx-form-helper-text">` with an auto-generated id. `error` turns it red; `disabled` dims it and sets `aria-disabled`.

{{< react-demo "form-helper-text/01-basic" >}}

## FormControl and FormLabel

Inside a `FormControl`, the label, the helper text and the controls inherit `error` and `disabled`. Checkbox, Switch and RadioGroup also link every `FormHelperText` of the group with `aria-describedby`.

{{< react-demo "form-helper-text/02-form-control" >}}

## Contained

`contained` adds a 14px inline margin so the text lines up with the content of an outlined or filled text field.

{{< react-demo "form-helper-text/03-contained" >}}

## Custom control with useFormControl

`useFormControl()` returns the closest FormControl state (or `undefined`): `error`, `disabled`, `required` and `helperTextIds`, the ids of the helper texts with content, ready for `aria-describedby`.

{{< react-demo "form-helper-text/04-use-form-control" >}}

## API reference

### FormHelperText props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `error` | `boolean` | from `FormControl` | Error color (`--error`). |
| `disabled` | `boolean` | from `FormControl` | Dims the text (`--disabled` + `aria-disabled`). Inherited only as `aria-disabled`. |
| `contained` | `boolean` | `false` | Inline margin of an outlined/filled field (`--contained`). |
| `id` | `string` | auto | Id used by `aria-describedby`. |
| `ref` | `Ref<HTMLParagraphElement>` | — | Ref to the `<p>`. |

### FormControl props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `error` | `boolean` | `false` | Error state shared with the children (`.mtx-form-control--error`). |
| `disabled` | `boolean` | `false` | Disabled state shared with the children (`.mtx-form-control--disabled`). |
| `required` | `boolean` | `false` | Required state shared with the children. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the `<div>`. |

### FormLabel props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `required` | `boolean` | from `FormControl` | Appends an asterisk (` *`, `aria-hidden`). |
| `error` | `boolean` | from `FormControl` | Error color. |
| `disabled` | `boolean` | from `FormControl` | Dimmed color. |

Renders `.mtx-form-label` (primary color on focus within). Vanilla has no CSS for the asterisk nor for a standalone label in error/disabled state, so the asterisk is a plain `<span aria-hidden="true">` and the state colors are applied inline with the `--mtx-color-error-text` / `--mtx-color-text-disabled` tokens.

**Differences with MUI:** `FormControl` has no `fullWidth`, `margin`, `variant`, `size` or `focused` props, because vanilla has no CSS for them; use layout utilities around it. The controls of this library stretch their own wrapper when they are `fullWidth`.

### useFormControl()

Returns `{ error, disabled, required, helperTextIds, registerHelperText } | undefined`. `registerHelperText(id)` is used by `FormHelperText` and returns the unregister function. Only group-level helpers are registered: the `helperText` of Checkbox, Switch or RadioGroup describes only its own control, and a control with its own `helperText` does not link the group helpers.

`className`, `style` and other attributes go to the root element of each component.

### CSS classes

| Class | Element |
| :--- | :--- |
| `.mtx-form-control` | Wrapper (`--error`, `--disabled`). |
| `.mtx-form-label` | Group label. |
| `.mtx-form-helper-text` | Helper text (`--error`, `--contained`, `--disabled`). |

## Equivalence with vanilla

| Vanilla | React |
| :--- | :--- |
| `<p data-mtx="form-helper-text" data-error>` | `<FormHelperText error>` |
| `helper.error = true` / `setText()` | `error` prop / children |
| `<div class="mtx-form-control">` (manual) | `<FormControl>` |
| `data-helper-text` / `data-error` on Checkbox, Switch, RadioGroup | `helperText` / `error` props of those components |
| `HelperTextController` (`aria-describedby`, `aria-invalid`) | `FormControl` context + `useFormControl()` |

## Accessibility

- The helper text is linked to the control with `aria-describedby`, so it is read after the control name without being part of it.
- Error state is conveyed with `aria-invalid="true"` on the control, not by color alone: put the reason in the helper text.
- Disabled helper texts carry `aria-disabled="true"` so their dimmed color is treated as disabled content.
- Name groups of controls with `FormLabel` + `aria-labelledby` (and `role="group"` on the `FormControl`).
- A standalone `Radio` inside a `FormControl` inherits `aria-invalid` and the helper texts in `aria-describedby`, like Checkbox and Switch; inside a `RadioGroup` both go on the radiogroup.
