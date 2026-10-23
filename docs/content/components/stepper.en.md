---
title: "Stepper"
description: "Shows progress through a sequence of numbered steps, horizontal or vertical, linear or with clickable steps, plus its compact mobile version."
group: "navigation"
icon: "linear_scale"
weight: 60
example: "stepper"
mui: "https://mui.com/material-ui/react-stepper/"
---

`Stepper` conveys progress through a process split into steps (sign-up, checkout, setup wizard): which step is active, which are completed and which are still ahead. Use it when order matters and each step makes sense on its own. Don't use it to switch between views at the same level (use [Tabs](../tabs/)) or to show the progress of an ongoing operation (use [Progress](../progress/)).

## Basic usage

An `<ol data-mtx="stepper">` with one `<li data-label>` per step. The component generates the 24px numbered icon, the connectors and the accessible text ("Step 2 of 3"), and marks the active step with `aria-current="step"`. `data-active-step` is the zero-based index of the active step.

{{< mtx-demo title="Horizontal stepper" layout="block" >}}
<ol data-mtx="stepper" data-active-step="1" aria-label="Reset password">
  <li data-label="Email"></li>
  <li data-label="Verify code"></li>
  <li data-label="New password"></li>
</ol>
{{< /mtx-demo >}}

## Linear with actions

In linear mode (the default), steps before the active one are considered completed and the following ones disabled. Buttons with `data-mtx-stepper-action="back|next|reset"` and `data-target="#id"` drive the stepper without writing JavaScript; `data-panel` on each step shows its panel only while it is active, and `data-finished-panel` shows the final panel once `activeStep` reaches the number of steps.

{{< mtx-demo title="Linear wizard" layout="column" >}}
<ol id="doc-stepper-linear" data-mtx="stepper" data-finished-panel="#doc-stepper-done" aria-label="Create campaign">
  <li data-label="Settings" data-panel="#doc-stepper-p1"></li>
  <li data-label="Ad group" data-optional data-panel="#doc-stepper-p2"></li>
  <li data-label="Create ad" data-panel="#doc-stepper-p3"></li>
</ol>
<p id="doc-stepper-p1">Step 1: choose the goal and the budget.</p>
<p id="doc-stepper-p2" hidden>Step 2: define audiences and placements.</p>
<p id="doc-stepper-p3" hidden>Step 3: write the ad.</p>
<p id="doc-stepper-done" hidden>All steps completed.</p>
<div>
  <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-stepper-action="back" data-target="#doc-stepper-linear">Back</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-stepper-action="next" data-target="#doc-stepper-linear">Next</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-stepper-action="reset" data-target="#doc-stepper-linear">Reset</button>
</div>
{{< /mtx-demo >}}

`back` buttons are disabled automatically on the first step and `next` buttons once finished (add `data-keep-enabled` to opt out).

## Alternative label

`data-alternative-label` places the label below the icon and splits the width evenly. It is the most robust option on narrow screens.

{{< mtx-demo title="data-alternative-label" layout="block" >}}
<ol data-mtx="stepper" data-alternative-label data-active-step="1" aria-label="Order">
  <li data-label="Cart"></li>
  <li data-label="Shipping"></li>
  <li data-label="Payment"></li>
  <li data-label="Confirmation"></li>
</ol>
{{< /mtx-demo >}}

## Non-linear

With `data-non-linear` every step is a `<button>` (StepButton) with ripple, visible focus and activation with <kbd>Enter</kbd> or <kbd>Space</kbd>, and users can jump to any step. Completion is no longer inferred from the order: set it with `data-completed` or `setCompleted()`.

{{< mtx-demo title="data-non-linear" layout="block" >}}
<ol data-mtx="stepper" data-non-linear data-active-step="1" aria-label="Profile">
  <li data-label="Personal details" data-completed></li>
  <li data-label="Address"></li>
  <li data-label="Preferences" data-optional></li>
</ol>
{{< /mtx-demo >}}

## Vertical

`data-orientation="vertical"` stacks the steps. The `<li>` content becomes StepContent, which expands with a transition only on the active step (or always, with `data-expanded`). Inside the stepper, `data-mtx-stepper-action` without `data-target` acts on its own stepper.

{{< mtx-demo title="Vertical stepper" layout="block" >}}
<ol data-mtx="stepper" data-orientation="vertical" aria-label="Launch a campaign">
  <li data-label="Select campaign settings">
    <p>Choose the campaign type, the country and the daily budget.</p>
    <button class="mtx-button mtx-button--contained mtx-button--small" data-mtx="button" data-mtx-stepper-action="next">Continue</button>
  </li>
  <li data-label="Create an ad group" data-optional>
    <p>An ad group contains one or more ads that share the same audience.</p>
    <button class="mtx-button mtx-button--contained mtx-button--small" data-mtx="button" data-mtx-stepper-action="next">Continue</button>
    <button class="mtx-button mtx-button--text mtx-button--small" data-mtx="button" data-mtx-stepper-action="back">Back</button>
  </li>
  <li data-label="Create an ad">
    <p>Write the headline and check the preview.</p>
    <button class="mtx-button mtx-button--contained mtx-button--small" data-mtx="button" data-mtx-stepper-action="next">Finish</button>
    <button class="mtx-button mtx-button--text mtx-button--small" data-mtx="button" data-mtx-stepper-action="back">Back</button>
  </li>
</ol>
{{< /mtx-demo >}}

## With icons

By default the StepIcon is the step number. `data-icon` uses a custom Material Icon (24px, no forced size). A completed step shows a check and a step with an error shows a warning, replacing the icon.

{{< mtx-demo title="data-icon" layout="block" >}}
<ol data-mtx="stepper" data-active-step="1" aria-label="Purchase">
  <li data-label="Account" data-icon="person"></li>
  <li data-label="Payment" data-icon="credit_card"></li>
  <li data-label="Shipping" data-icon="local_shipping"></li>
</ol>
{{< /mtx-demo >}}

## States

Active, completed, optional (`data-optional`, with custom text when given a value), error with message (`data-error="message"`) and disabled (`data-disabled`). The connector before an active or completed step takes the primary color.

{{< mtx-demo title="Error with message" layout="block" >}}
<ol data-mtx="stepper" data-active-step="2" aria-label="Payment">
  <li data-label="Address"></li>
  <li data-label="Payment" data-error="Card declined"></li>
  <li data-label="Review"></li>
</ol>
{{< /mtx-demo >}}

{{< mtx-demo title="Optional, completed and disabled" layout="block" >}}
<ol data-mtx="stepper" data-non-linear aria-label="States">
  <li data-label="Active"></li>
  <li data-label="Completed" data-completed></li>
  <li data-label="Optional" data-optional="Can be skipped"></li>
  <li data-label="Disabled" data-disabled></li>
</ol>
{{< /mtx-demo >}}

{{< callout type="info" title="Responsive behavior" >}}
Below 600px, a horizontal stepper without alternative label only shows the label of the active step; the others are visually hidden but still available to screen readers. If every label must be visible on mobile, use `data-alternative-label` or the vertical orientation.
{{< /callout >}}

## Mobile stepper

`data-mtx="mobile-stepper"` is MUI's compact version: it generates the Back/Next buttons and a `dots` (default), `text` ("2 / 5") or `progress` indicator (reusing [LinearProgress](../progress/)). `data-position="bottom|top"` pins it to the edge of the window.

{{< mtx-demo title="MobileStepper variants" layout="column" >}}
<div data-mtx="mobile-stepper" data-steps="6" data-active-step="1"></div>
<div data-mtx="mobile-stepper" data-variant="text" data-steps="5"></div>
<div data-mtx="mobile-stepper" data-variant="progress" data-steps="6" data-active-step="2"></div>
{{< /mtx-demo >}}

## Real-world examples

Account sign-up with validation: the cancelable `mtx:stepper:change` event prevents moving forward when the email is invalid and flags the step with an error.

{{< mtx-demo title="Wizard with validation" layout="column" >}}
<ol id="doc-stepper-signup" data-mtx="stepper" data-alternative-label aria-label="Account sign-up">
  <li data-label="Account" data-panel="#doc-signup-1"></li>
  <li data-label="Company" data-panel="#doc-signup-2"></li>
  <li data-label="Plan" data-panel="#doc-signup-3"></li>
</ol>
<div id="doc-signup-1">
  <input id="doc-signup-email" data-mtx="text-field" data-label="Work email" data-variant="outlined" type="email" required />
</div>
<div id="doc-signup-2" hidden>
  <input data-mtx="text-field" data-label="Company name" data-variant="outlined" type="text" />
</div>
<p id="doc-signup-3" hidden>Team plan · $12 per user per month.</p>
<div>
  <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-stepper-action="back" data-target="#doc-stepper-signup">Back</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-stepper-action="next" data-target="#doc-stepper-signup">Next</button>
</div>
{{< /mtx-demo >}}

```javascript
const signup = document.getElementById('doc-stepper-signup');
signup.addEventListener('mtx:stepper:change', (event) => {
  const stepper = Materix.getInstance(signup);
  if (event.detail.previousStep === 0 && event.detail.activeStep > 0) {
    const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value);
    stepper.setError(0, valid ? false : 'Enter a valid email');
    if (!valid) event.preventDefault();
  }
});
```

<script>
document.addEventListener('DOMContentLoaded', () => {
  const signup = document.getElementById('doc-stepper-signup');
  const email = document.getElementById('doc-signup-email');
  if (!signup || !email) return;
  signup.addEventListener('mtx:stepper:change', (event) => {
    const stepper = Materix.getInstance(signup);
    if (event.detail.previousStep === 0 && event.detail.activeStep > 0) {
      const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value);
      stepper.setError(0, valid ? false : 'Enter a valid email');
      if (!valid) event.preventDefault();
    }
  });
});
</script>

## Full BEM syntax

For SSR or fine-grained control: if each `<li class="mtx-step">` already contains `.mtx-step__label-container`, the component reuses it (no duplicated connectors or labels) and only paints the icon, the accessible text and the states.

```html
<ol class="mtx-stepper mtx-stepper--horizontal" data-mtx="stepper" data-active-step="1">
  <li class="mtx-step">
    <span class="mtx-step__label-container">
      <span class="mtx-step__icon-container"></span>
      <span class="mtx-step__label-text"><span class="mtx-step__label">Details</span></span>
    </span>
  </li>
  <li class="mtx-step">
    <span class="mtx-step-connector"><span class="mtx-step-connector__line"></span></span>
    <span class="mtx-step__label-container">
      <span class="mtx-step__icon-container"></span>
      <span class="mtx-step__label-text"><span class="mtx-step__label">Review</span></span>
    </span>
    <div class="mtx-step__content">Content (visible in vertical only)</div>
  </li>
</ol>
```

## Programmatic usage

```javascript
const stepper = Materix.getInstance(document.getElementById('wizard'));
// or: const stepper = new Materix.Stepper(element);

stepper.next();                        // next enabled step
stepper.back();                        // previous enabled step
stepper.goTo(2);                       // index (0 … number of steps)
stepper.setCompleted(0, true);         // mark or unmark as completed
stepper.setError(1, 'Required field'); // message, true (no message) or false
stepper.reset();                       // back to the first step, clears states
console.log(stepper.activeStep, stepper.finished);

stepper.element.addEventListener('mtx:stepper:change', (event) => {
  const { activeStep, previousStep } = event.detail;
  if (!isValid(previousStep)) event.preventDefault(); // cancels the change
});
```

With ES modules:

```javascript
import { Stepper, MobileStepper, getInstance } from 'materix-ui';
```

{{< mtx-demo title="API and events" layout="column" >}}
<ol id="doc-stepper-api" data-mtx="stepper" data-non-linear aria-label="API">
  <li data-label="One"></li>
  <li data-label="Two"></li>
  <li data-label="Three"></li>
</ol>
<div>
  <button class="mtx-button mtx-button--outlined mtx-button--small" data-mtx="button" data-doc-stepper="back">back()</button>
  <button class="mtx-button mtx-button--outlined mtx-button--small" data-mtx="button" data-doc-stepper="next">next()</button>
  <button class="mtx-button mtx-button--outlined mtx-button--small" data-mtx="button" data-doc-stepper="complete">setCompleted(active)</button>
  <button class="mtx-button mtx-button--outlined mtx-button--small" data-mtx="button" data-doc-stepper="error">setError(active)</button>
  <button class="mtx-button mtx-button--outlined mtx-button--small" data-mtx="button" data-doc-stepper="reset">reset()</button>
</div>
<span id="doc-stepper-status" aria-live="polite"></span>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-stepper-api');
  if (!el) return;
  const stepper = Materix.getInstance(el);
  const status = document.getElementById('doc-stepper-status');
  document.querySelectorAll('[data-doc-stepper]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.docStepper;
      if (action === 'complete') stepper.setCompleted(stepper.activeStep, !stepper.isCompleted(stepper.activeStep));
      else if (action === 'error') stepper.setError(stepper.activeStep, 'Check this step');
      else stepper[action]();
    });
  });
  el.addEventListener('mtx:stepper:change', (event) => {
    status.textContent = 'mtx:stepper:change → activeStep ' + event.detail.activeStep + ', previousStep ' + event.detail.previousStep;
  });
});
</script>

## API reference

### Data attributes

**Stepper** (`data-mtx="stepper"`, on an `<ol>`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-active-step` | number (0 … steps) | `0` | Index of the active step. Equal to the number of steps = finished. Updated while navigating. |
| `data-orientation` | `horizontal`, `vertical` | `horizontal` | Orientation. In vertical, the `<li>` content is a collapsible StepContent. |
| `data-alternative-label` | boolean | — | Label below the icon (horizontal only). |
| `data-non-linear` | boolean | — | Clickable steps (`<button>`); completion is not inferred from the order. |
| `data-finished-panel` | CSS selector | — | Element shown only when finished (`activeStep === length`). |
| `data-label` | text | — | `aria-label` of the `<ol>` when it has none. |

**Step** (child `<li>`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-label` | text | `<li>` text | Step label. Without `data-label`, a text-only `<li>` uses that text. |
| `data-optional` | boolean or text | — | Shows the translated "Optional" caption or the given text. |
| `data-completed` | boolean, `"false"` | from the order (linear) | Forces the completed state (or prevents it with `"false"`). |
| `data-error` | text or empty | — | Error state with a warning icon; the text is shown as the message. |
| `data-disabled` | boolean | — | Step cannot be activated (`<button disabled>` in non-linear). |
| `data-icon` | Material Icons name | number | Custom step icon. |
| `data-expanded` | boolean | — | In vertical, keeps the content expanded even when not active. |
| `data-panel` | CSS selector | — | External panel visible only with the active step (`hidden` otherwise). |

**Declarative triggers**

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx-stepper-action` | `next`, `back`, `reset` | — | On any button: runs the method on click. |
| `data-target` | CSS selector | ancestor stepper | Controlled Stepper or MobileStepper. |
| `data-keep-enabled` | boolean | — | Does not sync the trigger's `disabled` with the active step. |

**MobileStepper** (`data-mtx="mobile-stepper"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-steps` | number ≥ 1 | `1` | Number of steps. |
| `data-active-step` | number | `0` | Active step. |
| `data-variant` | `dots`, `text`, `progress` | `dots` | Progress indicator. |
| `data-position` | `static`, `bottom`, `top` | `static` | `bottom`/`top` pin it to the edge of the window. |
| `data-back-label`, `data-next-label` | text | translated "Back"/"Next" | Button texts. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-stepper` | Root (flex, no list styles). |
| `mtx-stepper--horizontal`, `mtx-stepper--vertical` | Orientation. |
| `mtx-stepper--alternative-label` | Label below the icon, equal-width steps. |
| `mtx-stepper--non-linear` | Non-linear mode. |
| `mtx-stepper--finished` | All steps passed. |
| `mtx-step` | Step (`<li>`). |
| `mtx-step--active`, `mtx-step--completed`, `mtx-step--error`, `mtx-step--disabled`, `mtx-step--expanded`, `mtx-step--last` | Step states. |
| `mtx-step__label-container` | StepLabel (`<span>`, or `<button>` in non-linear). |
| `mtx-step-button` | StepButton (non-linear): ripple, hover and focus. |
| `mtx-step__icon-container`, `mtx-step-icon` | Container and 24px StepIcon. |
| `mtx-step-icon--number`, `--completed`, `--error`, `--custom`, `--active` | Icon variants. |
| `mtx-step__label-text`, `mtx-step__label`, `mtx-step__optional` | Texts: label and caption (optional or error message). |
| `mtx-step__sr` | Screen-reader-only text. |
| `mtx-step-connector`, `mtx-step-connector__line` | StepConnector. |
| `mtx-step__content`, `mtx-step__content-inner` | Collapsible StepContent (vertical). |
| `mtx-mobile-stepper`, `mtx-mobile-stepper--{dots,text,progress}`, `--{static,bottom,top}` | MobileStepper and its variants. |
| `mtx-mobile-stepper__back`, `__next`, `__indicator`, `__dot`, `__dot--active`, `__progress`, `__status` | MobileStepper parts. |

### Methods

**Stepper**

| Method | Returns | Description |
|---|---|---|
| `next()` | `boolean` | Moves to the next enabled step (up to "finished"). |
| `back()` | `boolean` | Moves to the previous enabled step. |
| `goTo(index)` | `boolean` | Activates the index (0 … `length`). `false` when out of range, disabled or canceled. |
| `reset()` | `boolean` | Returns to step 0 and clears completed and error states. |
| `setCompleted(index, completed = true)` | `this` | Marks or unmarks a step as completed. |
| `setError(index, message)` | `this` | Text = error with message; `true` = error without message; `false` = clears. |
| `setDisabled(index, disabled = true)` | `this` | Enables or disables a step. |
| `isCompleted(index)` | `boolean` | Effective completed state of the step. |
| `refresh()` | `void` | Re-reads the `<li>` elements after adding or removing steps. |
| `activeStep` (getter/setter) | `number` | Active step; assigning it is the same as `goTo()`. |
| `length`, `finished` (getters) | `number`, `boolean` | Number of steps and whether all were passed. |
| `destroy()` | `void` | Removes the listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |

**MobileStepper**: `next()`, `back()`, `goTo(index)`, `reset()`, `setSteps(count)`, `activeStep`, `steps`, `destroy()`.

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:stepper:change` | `{ activeStep, previousStep }` (`reset: true` from `reset()`) | Before the step changes (click, trigger or API). Cancelable with `preventDefault()` for validation. Fired by both Stepper and MobileStepper. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-stepper-connector-color` | Connector and StepContent border color (grey 400 in light, grey 600 in dark). |
| `--mtx-stepper-icon-size` | StepIcon size (24px). |
| `--mtx-color-primary`, `--mtx-color-primary-contrast` | Active/completed icon, active connector and number. |
| `--mtx-color-text-disabled` | Icon of pending steps. |
| `--mtx-color-text-primary`, `--mtx-color-text-secondary` | Labels. |
| `--mtx-color-error` | Step with error. |
| `--mtx-color-action-hover`, `--mtx-focus-ring-*` | StepButton hover and focus. |
| `--mtx-color-background-default`, `--mtx-color-action-disabled`, `--mtx-z-index-mobile-stepper` | MobileStepper. |

## Accessibility

- A semantic `<ol>` is used: the order of the steps is part of the meaning. Name it with `aria-label`.
- The active step carries `aria-current="step"` (on the `<li>`, or on its `<button>` in non-linear mode).
- Each step includes hidden text with its position and state: "Step 2 of 3: Shipping, completed". Icons and connectors are decorative (`aria-hidden`). Texts are translated from the document `lang` or `data-locale`.
- In non-linear mode steps are native `<button>` elements with visible focus; disabled ones use `disabled`.
- In vertical, the content of collapsed steps is marked `inert` and `aria-hidden` so it cannot receive focus.
- MobileStepper announces the current step in an `aria-live="polite"` region; dots and the bar are decorative.
- Honors `prefers-reduced-motion`.

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through clickable steps (non-linear) and the Back/Next buttons. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the focused step or button. |
