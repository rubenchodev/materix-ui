---
title: "Stepper"
description: "Shows progress through a sequence of numbered steps, horizontal or vertical, linear or with clickable steps, plus its compact mobile version."
group: "navigation"
icon: "linear_scale"
weight: 60
example: "stepper"
import: "Stepper, Step, StepLabel, StepContent, MobileStepper, useStepper, StepperButton, StepPanel"
mui: "https://mui.com/material-ui/react-stepper/"
---

`Stepper` conveys progress through a process split into steps (sign-up, checkout, setup wizard): which step is active, which are completed and which are still ahead. Use it when order matters and each step makes sense on its own. Don't use it to switch between views at the same level (use [Tabs](../tabs/)) or to show the progress of an ongoing operation (use [Progress](../progress/)).

## Import

```tsx
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  MobileStepper,
  useStepper,
  StepperButton,
  StepPanel,
} from '@rubenchodev/materix-react';
```

## Basic usage

The shortest form is a `<Stepper>` with a `steps` array of labels. The component renders the semantic `<ol>`, the 24px numbered icon, the connectors and the accessible text ("Step 2 of 3"), and marks the active step with `aria-current="step"`. `defaultActiveStep` (uncontrolled) or `activeStep` (controlled) is the zero-based index of the active step.

{{< react-demo id="stepper/01-basic" layout="block" >}}

```tsx
<Stepper defaultActiveStep={1} label="Reset password" steps={['Email', 'Verify code', 'New password']} />
```

Each entry of `steps` can also be an object with the `Step` props (`{ label, optional, error, completed, disabled, icon, expanded, content }`), or you can write `<Step>` children.

## Linear with actions

In linear mode (the default), steps before the active one are considered completed and the following ones disabled. `useStepper()` links a stepper through `apiRef` and exposes its state; `StepperButton action="back|next|reset"` drives it and disables itself on the first step (`back`) or once finished (`next`) unless `keepEnabled`; `StepPanel` shows the panel of the active step, and `index="finished"` the final panel once `activeStep` reaches the number of steps.

{{< react-demo id="stepper/02-linear" layout="block" >}}

```tsx
const stepper = useStepper();

<Stepper apiRef={stepper.apiRef} label="Create campaign">
  <Step label="Settings" />
  <Step label="Ad group" optional />
  <Step label="Create ad" />
</Stepper>
<StepPanel stepper={stepper} index={0}>…</StepPanel>
<StepPanel stepper={stepper} index="finished">Done</StepPanel>
<StepperButton action="back" stepper={stepper}>Back</StepperButton>
<StepperButton action="next" stepper={stepper} variant="contained">Next</StepperButton>
```

## Alternative label

`alternativeLabel` places the label below the icon and splits the width evenly. It is the most robust option on narrow screens (horizontal only).

{{< react-demo id="stepper/03-alternative-label" layout="block" >}}

## Non-linear

With `nonLinear` every step is a `<button>` (StepButton) with ripple, visible focus and activation with <kbd>Enter</kbd> or <kbd>Space</kbd>, and users can jump to any step. Completion is no longer inferred from the order: set it with `completed` or `setCompleted()`.

{{< react-demo id="stepper/04-non-linear" layout="block" >}}

## Vertical

`orientation="vertical"` stacks the steps. The children of a `<Step label>` become its StepContent, which expands with a transition only on the active step (or always, with `expanded`). Inside the stepper, a `StepperButton` without `stepper` acts on its own stepper.

{{< react-demo id="stepper/05-vertical" layout="block" >}}

## With icons

By default the StepIcon is the step number. `icon` uses a custom Material Icon by name (24px, no forced size) or any node. A completed step shows a check and a step with an error shows a warning, replacing the icon.

{{< react-demo id="stepper/06-with-icons" layout="block" >}}

## States

Active, completed, optional (`optional`, or a custom text), error with message (`error="message"`, or `error` without message) and disabled (`disabled`). The connector before an active or completed step takes the primary color.

{{< react-demo id="stepper/07-states" layout="block" >}}

{{< callout type="info" title="Responsive behavior" >}}
Below 600px, a horizontal stepper without alternative label only shows the label of the active step; the others are visually hidden but still available to screen readers. If every label must be visible on mobile, use `alternativeLabel` or the vertical orientation.
{{< /callout >}}

## Mobile stepper

`MobileStepper` is MUI's compact version: it renders the Back/Next buttons and a `dots` (default), `text` ("2 / 5") or `progress` indicator (reusing [LinearProgress](../progress/)). `position="bottom|top"` pins it to the edge of the window. `backButton`/`nextButton` replace the generated buttons with your own nodes; if they carry the `mtx-mobile-stepper__back` / `mtx-mobile-stepper__next` class, clicking them navigates.

{{< react-demo id="stepper/08-mobile-stepper" layout="block" >}}

```tsx
<MobileStepper steps={6} />
<MobileStepper variant="text" steps={5} />
<MobileStepper variant="progress" steps={6} />
```

## Real-world examples

An account sign-up wizard with validation: the cancelable `onChange` returns `false` to prevent moving forward while the [TextField](../text-field/) email is invalid, and marks the step and the field with an error (`setError()`, `error` + `helperText`).

{{< react-demo id="stepper/09-real-world" layout="block" >}}

```tsx
const handleChange: StepperChangeHandler = (activeStep, { previousStep }) => {
  if (previousStep === 0 && activeStep > 0) {
    const valid = EMAIL.test(email);
    stepper.setError(0, valid ? false : 'Enter a valid email');
    if (!valid) return false;
  }
};
```

## Grid

Inside [Grid](../grid/) the stepper takes the width of its column; in narrow columns the alternative label or the vertical orientation work best.

{{< react-demo id="stepper/10-grid" layout="block" >}}

## Programmatic usage

`apiRef` exposes `next()`, `back()`, `goTo(i)`, `reset()`, `setCompleted(i, bool)`, `setError(i, message|false)`, `setDisabled(i, bool)`, `isCompleted(i)` and the `activeStep`, `length` and `finished` getters. Every change goes through `onChange`, which can cancel it.

{{< react-demo id="stepper/11-programmatic" layout="block" >}}

```tsx
const api = useRef<StepperApi>(null);

<Stepper apiRef={api} steps={['One', 'Two']} onChange={(next, { previousStep }) => isValid(previousStep)} />;

api.current?.next();
api.current?.setError(1, 'Required field');
```

## Manual composition

The equivalent of the vanilla manual BEM usage: compose each `Step` with `StepLabel` (label, `optional`, `icon`) and `StepContent`. The connector is still generated.

{{< react-demo id="stepper/12-composition" layout="block" >}}

## API reference

### Stepper props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `activeStep` | `number` | — | Active step (controlled). Equal to the number of steps = finished. |
| `defaultActiveStep` | `number` | `0` | Initial active step (uncontrolled). |
| `onChange` | `(activeStep, detail) => boolean \| void` | — | Before the step changes (click, button or API). Return `false` or call `detail.preventDefault()` to cancel. `detail`: `{ activeStep, previousStep, reset? }`. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientation. In vertical, step children are a collapsible StepContent. |
| `alternativeLabel` | `boolean` | `false` | Label below the icon (horizontal only). |
| `nonLinear` | `boolean` | `false` | Clickable steps (`<button>`); completion is not inferred from the order. |
| `steps` | `Array<string \| StepDefinition>` | — | Steps as data instead of `<Step>` children. |
| `label` | `string` | — | `aria-label` of the `<ol>`. |
| `locale` | `string` | context | Language of the accessible texts. |
| `apiRef` | `Ref<StepperApi>` | — | Imperative API (see below). |

`ref`, `className`, `style` and other attributes go to the `<ol>`.

### Step props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `ReactNode` | — | Label. Without it, a `Step` whose children are plain content uses them as the label. |
| `optional` | `boolean \| ReactNode` | — | Translated "Optional" caption, or the given text. |
| `completed` | `boolean` | from the order (linear) | Forces the completed state (`false` prevents it). |
| `error` | `boolean \| string` | — | Error state with a warning icon; the text is shown as the message. |
| `disabled` | `boolean` | `false` | Step cannot be activated (`<button disabled>` in non-linear). |
| `icon` | `ReactNode` | number | Custom icon: Material Icons name or node. |
| `expanded` | `boolean` | `false` | In vertical, keeps the content expanded even when not active. |
| `children` | `ReactNode` | — | StepContent (with `label`) or manual parts (`StepLabel`, `StepContent`). |

**StepLabel**: `children` (label), `optional`, `icon` and `disableRipple` (override the `Step` values). **StepContent**, **StepConnector** and **StepIcon** (`icon`, `active`, `completed`, `error`) are also exported.

### Hooks and helpers

| Export | Description |
| :--- | :--- |
| `useStepper()` | Returns a controller: `apiRef` (pass it to `Stepper` or `MobileStepper`), `activeStep`, `length`, `finished`, `canBack`, `canNext` and the API methods. |
| `StepperButton` | A [Button](../button/) with `action="next\|back\|reset"`, `stepper` (controller; inside a Stepper it is optional) and `keepEnabled`. |
| `StepPanel` | `<div>` visible only while `index` is active (`index="finished"` once finished). |
| `useStepperContext()` / `useStepContext()` | Context of the enclosing Stepper / Step for custom parts. |

### MobileStepper props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `steps` | `number` | — | Number of steps (≥ 1). |
| `activeStep` / `defaultActiveStep` | `number` | `0` | Active step (controlled / uncontrolled). |
| `onChange` | `(activeStep, detail) => boolean \| void` | — | Cancelable change, as in `Stepper`. |
| `variant` | `'dots' \| 'text' \| 'progress'` | `'dots'` | Progress indicator. |
| `position` | `'static' \| 'bottom' \| 'top'` | `'static'` | `bottom`/`top` pin it to the edge of the window. |
| `backButton` / `nextButton` | `ReactNode` | generated | Own buttons (with the `mtx-mobile-stepper__back`/`__next` class they navigate). |
| `backLabel` / `nextLabel` | `string` | translated "Back"/"Next" | Texts of the generated buttons. |
| `locale` | `string` | context | Language. |
| `apiRef` | `Ref<StepperBaseApi>` | — | `next()`, `back()`, `goTo()`, `reset()`, `activeStep`, `length`. |

### Imperative API (`StepperApi`)

| Member | Returns | Description |
| :--- | :--- | :--- |
| `next()` | `boolean` | Moves to the next enabled step (up to "finished"). |
| `back()` | `boolean` | Moves to the previous enabled step. |
| `goTo(index)` | `boolean` | Activates the index (0 … `length`). `false` when out of range, disabled or canceled. |
| `reset()` | `boolean` | Returns to step 0 and clears completed and error states. |
| `setCompleted(index, completed = true)` | `void` | Marks or unmarks a step as completed. |
| `setError(index, message)` | `void` | Text = error with message; `true` = without message; `false` = clears. |
| `setDisabled(index, disabled = true)` | `void` | Enables or disables a step. |
| `isCompleted(index)` | `boolean` | Effective completed state. |
| `activeStep`, `length`, `finished` | `number`, `number`, `boolean` | Current state. |

Values set through the API take precedence over the `Step` props until `reset()`.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-stepper`, `mtx-stepper--horizontal`, `mtx-stepper--vertical` | Root and orientation. |
| `mtx-stepper--alternative-label`, `mtx-stepper--non-linear`, `mtx-stepper--finished` | Modes and finished state. |
| `mtx-step`, `mtx-step--active`, `--completed`, `--error`, `--disabled`, `--expanded`, `--last` | Step and its states. |
| `mtx-step__label-container`, `mtx-step-button` | StepLabel (`<span>`, or `<button>` in non-linear). |
| `mtx-step__icon-container`, `mtx-step-icon`, `mtx-step-icon--{number,completed,error,custom,active}` | 24px StepIcon. |
| `mtx-step__label-text`, `mtx-step__label`, `mtx-step__optional`, `mtx-step__sr` | Texts. |
| `mtx-step-connector`, `mtx-step-connector__line` | StepConnector. |
| `mtx-step__content`, `mtx-step__content-inner` | Collapsible StepContent. |
| `mtx-mobile-stepper`, `--{dots,text,progress}`, `--{static,bottom,top}`, `__back`, `__next`, `__indicator`, `__dot`, `__dot--active`, `__progress`, `__status` | MobileStepper. |

### CSS variables

| Variable | Usage |
| :--- | :--- |
| `--mtx-stepper-connector-color` | Connector and StepContent border (grey 400 in light, grey 600 in dark). |
| `--mtx-stepper-icon-size` | StepIcon size (24px). |
| `--mtx-color-primary`, `--mtx-color-primary-contrast` | Active/completed icon, active connector and number. |
| `--mtx-color-error` | Step with error. |
| `--mtx-z-index-mobile-stepper` | Fixed MobileStepper. |

### Equivalence with the vanilla version

| Vanilla | React |
| :--- | :--- |
| `<ol data-mtx="stepper">` + `<li data-label>` | `<Stepper steps={[…]} />` or `<Stepper>` + `<Step label>` |
| `data-active-step` | `activeStep` / `defaultActiveStep` |
| `data-orientation` · `data-alternative-label` · `data-non-linear` | `orientation` · `alternativeLabel` · `nonLinear` |
| `data-label` (on `<ol>`) | `label` |
| `data-optional` · `data-completed` · `data-error` · `data-disabled` · `data-icon` · `data-expanded` | `optional` · `completed` · `error` · `disabled` · `icon` · `expanded` |
| `data-panel` · `data-finished-panel` | `<StepPanel index={i}>` · `<StepPanel index="finished">` |
| `data-mtx-stepper-action` · `data-target` · `data-keep-enabled` | `<StepperButton action>` · `stepper` · `keepEnabled` |
| `mtx:stepper:change` (cancelable) | `onChange` (return `false` or `preventDefault()`) |
| `Materix.getInstance(el).next()` … | `apiRef.current.next()` … |
| `refresh()` | not needed (steps are rendered from props) |
| `data-mtx="mobile-stepper"` · `data-steps` · `data-variant` · `data-position` · `data-back-label` | `<MobileStepper steps variant position backLabel />` |
| `setSteps(count)` | `steps` prop |

## Accessibility

- A semantic `<ol>` is used: the order of the steps is part of the meaning. Name it with `label` or `aria-label`.
- The active step carries `aria-current="step"` (on the `<li>`, or on its `<button>` in non-linear mode).
- Each step includes hidden text with its position and state: "Step 2 of 3: Shipping, completed". Icons and connectors are decorative (`aria-hidden`). Texts are translated with the `I18nProvider` locale or the `locale` prop.
- In non-linear mode steps are native `<button>` elements with visible focus; disabled ones use `disabled`.
- In vertical, the content of collapsed steps is marked `inert` and `aria-hidden` so it cannot receive focus.
- MobileStepper announces the current step in an `aria-live="polite"` region; dots and the bar are decorative.
- Honors `prefers-reduced-motion`.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through clickable steps (non-linear) and the Back/Next buttons. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the focused step or button. |
