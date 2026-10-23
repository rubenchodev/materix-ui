---
title: "Button"
description: "Action button with text, outlined and contained variants, three canonical heights (48/40/32px), palette colors and icons."
group: "inputs"
icon: "smart_button"
weight: 10
example: "button"
mui: "https://mui.com/material-ui/react-button/"
---

**Button** lets users take an action or confirm a decision with a single click: submit a form, open a dialog, send a message. Use it when the action has a text label that describes it. If the action can only be represented by an icon, use [Icon Button]({{< relref "/components/icon-button" >}}); if it's the primary, persistent action of the whole screen, use a [Fab]({{< relref "/components/fab" >}}). To navigate to another page, render the button as an `<a href>` link.

{{< callout type="tip" title="Button, Icon Button or Fab?" >}}
| Component | When to use it | Example |
| :--- | :--- | :--- |
| **Button** | Action with a text label; hierarchy through the variant. | "Save", "Cancel" |
| **Icon Button** | Compact action recognizable by its icon, in toolbars or rows. | Search, close, more options |
| **Fab** | The primary action of the screen, floating above the content. | Compose email, create event |
{{< /callout >}}

## Basic usage

A single `<button>` with the variant class and `data-mtx="button"`. The library adds the ripple effect and handles the disabled state; there's no inner structure to write.

{{< mtx-demo title="Basic usage" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button">Save</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button">Preview</button>
<button class="mtx-button mtx-button--text" data-mtx="button">Cancel</button>
{{< /mtx-demo >}}

{{< callout type="info" >}}
Button has no `data-variant`: the variant is chosen with classes (`mtx-button--contained`, `--outlined`, `--text`). The color accepts the class (`mtx-button--error`) or `data-color`, the size `data-size` and the icons `data-start-icon` / `data-end-icon`.
{{< /callout >}}

## Variants

Visual hierarchy is expressed through the variant, just like in MUI:

- **Contained** (`mtx-button--contained`): high emphasis, filled and elevated. Reserved for the primary action; ideally one per block.
- **Outlined** (`mtx-button--outlined`): medium emphasis, for important secondary actions.
- **Text** (`mtx-button--text`): low emphasis, for actions in dialogs, cards or next to a contained button.

{{< mtx-demo title="Variants" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button">Contained</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button">Outlined</button>
<button class="mtx-button mtx-button--text" data-mtx="button">Text</button>
{{< /mtx-demo >}}

## Sizes

Three canonical heights with `data-size`. **Medium (40px) is the default** and matches the height of a small [Text Field]({{< relref "/components/text-field" >}}), so both line up in the same row.

| Size | `data-size` | Height | Aligns with |
| :--- | :--- | :--- | :--- |
| Large | `large` | 48px | Large Icon Button, medium Fab, extended Fab |
| Medium | — (default) or `medium` | 40px | Small Text Field, medium Icon Button, small Fab |
| Small | `small` | 32px | Small Icon Button, Chip |

{{< mtx-demo title="Sizes" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-size="large">Large · 48px</button>
<button class="mtx-button mtx-button--contained" data-mtx="button">Medium · 40px</button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-size="small">Small · 32px</button>
{{< /mtx-demo >}}

{{< mtx-demo title="Alignment with a small Text Field (40px)" >}}
<div style="width: 280px; max-width: 100%;">
  <input data-mtx="text-field" data-label="Email" data-size="small" type="email" />
</div>
<button class="mtx-button mtx-button--contained" data-mtx="button">Subscribe</button>
{{< /mtx-demo >}}

## With icons

With `data-start-icon` and `data-end-icon` (like MUI's `startIcon` / `endIcon`) the Material ligature name is enough: the button generates `<span class="mtx-button__icon mtx-button__icon--start material-icons" aria-hidden="true">` before the text (or `--end` after it). The icon is decorative because the text already names the action, and it moves 4px towards the edge (2px on small) as in MUI.

{{< mtx-demo title="Start and end icon (simplified syntax)" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-start-icon="add">New</button>
<button class="mtx-button mtx-button--outlined mtx-button--error" data-mtx="button" data-start-icon="delete">Delete</button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-end-icon="send">Send</button>
<a class="mtx-button mtx-button--text" data-mtx="button" href="#with-icons" data-end-icon="arrow_forward">Next</a>
{{< /mtx-demo >}}

{{< mtx-demo title="In the three sizes" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-size="large" data-start-icon="save">Large</button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-start-icon="save">Medium</button>
<button class="mtx-button mtx-button--contained" data-mtx="button" data-size="small" data-start-icon="save">Small</button>
{{< /mtx-demo >}}

For an SVG or another icon font, write the `<span class="mtx-button__icon">` by hand (add `mtx-button__icon--start` / `--end` for the same offset); if an icon already exists on that side, `data-start-icon` / `data-end-icon` don't duplicate it.

{{< mtx-demo title="Manual icon (BEM)" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button">
  <span class="mtx-button__icon mtx-button__icon--start material-icons" aria-hidden="true">download</span>
  Download
</button>
{{< /mtx-demo >}}

With `mtx-button--icon` the button becomes circular and square (48/40/32px depending on the size). It requires an `aria-label`. For icons without a background, [Icon Button]({{< relref "/components/icon-button" >}}) is preferable.

{{< mtx-demo title="Icon only" >}}
<button class="mtx-button mtx-button--contained mtx-button--icon" data-mtx="button" data-size="large" aria-label="Favorite">
  <span class="mtx-button__icon material-icons" aria-hidden="true">star</span>
</button>
<button class="mtx-button mtx-button--contained mtx-button--icon" data-mtx="button" aria-label="Favorite">
  <span class="mtx-button__icon material-icons" aria-hidden="true">star</span>
</button>
<button class="mtx-button mtx-button--contained mtx-button--icon" data-mtx="button" data-size="small" aria-label="Favorite">
  <span class="mtx-button__icon material-icons" aria-hidden="true">star</span>
</button>
{{< /mtx-demo >}}

## Colors

Primary is the default color (no class required). The `mtx-button--secondary`, `--success`, `--error`, `--warning` and `--info` modifiers work with all three variants.

{{< mtx-demo title="Colors" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button">Primary</button>
<button class="mtx-button mtx-button--contained mtx-button--secondary" data-mtx="button">Secondary</button>
<button class="mtx-button mtx-button--contained mtx-button--success" data-mtx="button">Success</button>
<button class="mtx-button mtx-button--contained mtx-button--error" data-mtx="button">Error</button>
<button class="mtx-button mtx-button--contained mtx-button--warning" data-mtx="button">Warning</button>
<button class="mtx-button mtx-button--contained mtx-button--info" data-mtx="button">Info</button>
{{< /mtx-demo >}}

{{< mtx-demo title="Colors in outlined and text" >}}
<button class="mtx-button mtx-button--outlined mtx-button--secondary" data-mtx="button">Secondary</button>
<button class="mtx-button mtx-button--outlined mtx-button--error" data-mtx="button">Error</button>
<button class="mtx-button mtx-button--text mtx-button--success" data-mtx="button">Success</button>
<button class="mtx-button mtx-button--text mtx-button--info" data-mtx="button">Info</button>
{{< /mtx-demo >}}

`data-color` applies the same modifier from the simplified syntax. With `inherit` (`mtx-button--inherit`, like MUI's `color="inherit"`) text and outlined take the container's color: use it on dark or colored surfaces (AppBar, banners, calls to action). Contained uses MUI's neutral grey.

{{< mtx-demo title="Inherit on a colored surface" layout="block" >}}
<div class="mtx-bg-primary mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2 mtx-p-2 mtx-rounded">
  <button class="mtx-button mtx-button--text" data-mtx="button" data-color="inherit">Later</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-color="inherit">See plans</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="inherit">Get started</button>
</div>
{{< /mtx-demo >}}

### On a colored surface

`data-surface="primary"` (or `secondary`) adapts the button to a background of that color, such as a call-to-action band or a primary AppBar: contained is inverted (paper background with primary text, `mtx-button--on-primary`) and text/outlined take the container's color, like `inherit`. Use it instead of `inherit` when the contained button must stand out on the colored band. The container sets the text color; the button doesn't change it.

{{< mtx-demo title="Contained and outlined on a primary surface" layout="block" >}}
<div class="mtx-bg-primary mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2 mtx-p-2 mtx-rounded">
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-surface="primary">Start free trial</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-surface="primary">Book a demo</button>
  <button class="mtx-button mtx-button--text" data-mtx="button" data-surface="primary">Later</button>
</div>
{{< /mtx-demo >}}

### AA contrast

Buttons meet WCAG AA (4.5:1) by default: text and outlined buttons use `--mtx-color-{color}-text` (darker `warning`, `info`, `success` and `error` text in light mode) and contained `warning`/`info` use dark text, where MUI's white stays between 3 and 3.9:1; the hover of buttons with dark text lightens instead of darkening. The background colors are MUI's. To get MUI's exact colors, add `data-mtx-contrast="mui"` to `<html>` or a container. See [Color contrast]({{< relref "/guide/accessibility#color-contrast" >}}).

{{< mtx-demo title="Default (AA)" layout="block" >}}
<div class="mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2">
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="warning">Warning</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="info">Info</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-color="warning">Warning</button>
  <button class="mtx-button mtx-button--text" data-mtx="button" data-color="info">Info</button>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Exact MUI colors (opt-out)" layout="block" >}}
<div data-mtx-contrast="mui" class="mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-gap-2">
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="warning">Warning</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="info">Info</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-color="warning">Warning</button>
  <button class="mtx-button mtx-button--text" data-mtx="button" data-color="info">Info</button>
</div>
{{< /mtx-demo >}}

## States

Hover, visible focus (when navigating with <kbd>Tab</kbd>) and press (ripple) are applied automatically. To disable a button, use the native `disabled` attribute: it dims the button, removes it from the tab order and blocks the ripple.

{{< mtx-demo title="Disabled" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" disabled>Contained</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" disabled>Outlined</button>
<button class="mtx-button mtx-button--text" data-mtx="button" disabled>Text</button>
{{< /mtx-demo >}}

## Loading

With `data-loading` the button enters a loading state like MUI's `loading`: it gets disabled (`disabled`, or `aria-disabled` on `<a>`), receives `aria-busy="true"` and shows a decorative 16px [CircularProgress]({{< relref "/components/progress" >}}) in the text color. `data-loading-position` picks the position: `center` (default; the label becomes transparent and the width doesn't change), `start` or `end` (they replace the start or end icon, including the one generated by `data-start-icon` / `data-end-icon`, without changing the width; without an icon, the indicator is added on that side). `data-loading-indicator` shows a text instead of the spinner.

{{< mtx-demo title="Positions and text indicator" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-loading>Save</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-loading data-loading-position="start" data-start-icon="save">Save</button>
<button class="mtx-button mtx-button--text" data-mtx="button" data-loading data-loading-position="end" data-end-icon="send">Send</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-loading data-loading-indicator="Loading…">Download</button>
{{< /mtx-demo >}}

From JavaScript use `setLoading(true|false)` or the `loading` property. When it finishes, the previous state is restored: a button that was already disabled stays disabled. The button keeps its accessible name; to announce progress, add your own `aria-live` region.

{{< mtx-demo title="Click → 2 s loading" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-doc-loading>Save</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-loading data-loading-position="start" data-start-icon="save">Save</button>
<span class="mtx-typography--body2" role="status" aria-live="polite" id="doc-button-loading-status"></span>
{{< /mtx-demo >}}

```javascript
const button = Materix.getInstance(el);
button.setLoading(true);
status.textContent = 'Saving…';         // optional aria-live region
await saveChanges();
button.setLoading(false);
status.textContent = 'Changes saved';
```

<script>
document.addEventListener('DOMContentLoaded', function () {
  var status = document.getElementById('doc-button-loading-status');
  document.querySelectorAll('[data-doc-loading]').forEach(function (el) {
    el.addEventListener('click', function () {
      var btn = Materix.getInstance(el);
      btn.setLoading(true);
      status.textContent = 'Saving…';
      setTimeout(function () { btn.setLoading(false); status.textContent = 'Changes saved'; }, 2000);
    });
  });
});
</script>

## Full width

`mtx-button--full-width` makes the button take up 100% of its container (equivalent to MUI's `fullWidth`).

{{< mtx-demo title="Full width" layout="column" >}}
<button class="mtx-button mtx-button--contained mtx-button--full-width" data-mtx="button" data-size="large">Sign in</button>
<button class="mtx-button mtx-button--outlined mtx-button--full-width" data-mtx="button" data-size="large">Create account</button>
{{< /mtx-demo >}}

## Disable elevation

`mtx-button--disable-elevation` removes the shadow of the contained variant in all its states (equivalent to MUI's `disableElevation`).

{{< mtx-demo title="Disable elevation" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button">With elevation</button>
<button class="mtx-button mtx-button--contained mtx-button--disable-elevation" data-mtx="button">No elevation</button>
{{< /mtx-demo >}}

## Uppercase

Text is displayed as written. Add `mtx-button--uppercase` to get the uppercase style characteristic of Material Design 2.

{{< mtx-demo title="Uppercase" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button">Text as written</button>
<button class="mtx-button mtx-button--contained mtx-button--uppercase" data-mtx="button">Uppercase</button>
{{< /mtx-demo >}}

## As a link

If the action navigates to another URL, use `<a href>` with the same classes: it keeps link semantics (open in a new tab, copy the address) with the look of a button. Since `<a>` doesn't support `disabled`, the `disable()` method applies `aria-disabled="true"`, removes it from the tab order and blocks navigation on click.

{{< mtx-demo title="As a link" >}}
<a class="mtx-button mtx-button--contained" data-mtx="button" href="#as-a-link">View plans</a>
<a class="mtx-button mtx-button--outlined" data-mtx="button" href="#as-a-link">Documentation</a>
{{< /mtx-demo >}}

## Real-world examples

Form footer: a single primary contained action paired with a text action.

{{< mtx-demo title="Form footer" layout="column" >}}
<input data-mtx="text-field" data-label="Project name" type="text" />
<div>
  <button class="mtx-button mtx-button--text" data-mtx="button">Cancel</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-start-icon="check">Create project</button>
</div>
{{< /mtx-demo >}}

A table action bar with small buttons, which line up with 32px chips and filters.

{{< mtx-demo title="Action bar" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-size="small" data-start-icon="add">Add</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" data-start-icon="file_download">Export</button>
<button class="mtx-button mtx-button--text mtx-button--error" data-mtx="button" data-size="small">Delete selected</button>
{{< /mtx-demo >}}

## Full BEM syntax

For SSR or fine-grained control, you can write the size classes (`mtx-button--large`, `--medium`, `--small`) instead of `data-size`, and nest the icon inside `mtx-button__icon`. The instance binds to the element without changing its structure.

```html
<button class="mtx-button mtx-button--contained mtx-button--large" data-mtx="button" type="button">
  <span class="mtx-button__icon" aria-hidden="true">
    <span class="material-icons">save</span>
  </span>
  Save
</button>
```

## Programmatic usage

Every `[data-mtx="button"]` is initialized when the page loads. For content added later, initialize the element or the container:

```javascript
// Initialize a specific element (uses data-mtx or the given name)
const button = Materix.init(element, 'button');

// Instantiate directly
const other = new Materix.Button(element);

// Retrieve the existing instance
const instance = Materix.getInstance(element);

// Initialize a whole container (idempotent)
Materix.initAll(container);

instance.disable();
instance.enable();
console.log(instance.disabled); // false
```

With ES modules:

```javascript
import { init, getInstance, Button } from 'materix-ui';

const button = new Button(document.querySelector('#save'));
button.disable();
```

{{< mtx-demo title="disable() / enable()" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" id="doc-button-target">Controlled button</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-button-disable">disable()</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-size="small" id="doc-button-enable">enable()</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var target = document.getElementById('doc-button-target');
  document.getElementById('doc-button-disable').addEventListener('click', function () {
    Materix.getInstance(target).disable();
  });
  document.getElementById('doc-button-enable').addEventListener('click', function () {
    Materix.getInstance(target).enable();
  });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-mtx` | `button` | — | Enables automatic initialization. |
| `data-size` | `small` \| `medium` \| `large` | `medium` | Adds the `mtx-button--{size}` class (32 / 40 / 48px). |
| `data-small` | boolean | — | Shortcut equivalent to `data-size="small"`. |
| `data-large` | boolean | — | Shortcut equivalent to `data-size="large"`. |
| `data-color` | `secondary` \| `success` \| `error` \| `warning` \| `info` \| `inherit` | `primary` | Adds the `mtx-button--{color}` class. |
| `data-surface` | `primary` \| `secondary` | — | Adds `mtx-button--on-{surface}` for a button placed on a background of that color. |
| `data-loading` | boolean | — | Turns on the loading state on init (`"false"` is ignored). Reflected while loading. |
| `data-loading-position` | `center` \| `start` \| `end` | `center` | Indicator position; `start`/`end` replace the icon on that side. |
| `data-loading-indicator` | text | — | Text instead of the spinner (like MUI's `loadingIndicator`). |
| `data-start-icon` | Material ligature | — | Generates the `mtx-button__icon--start` start icon (like MUI's `startIcon`). Doesn't duplicate an existing one. |
| `data-end-icon` | Material ligature | — | Generates the `mtx-button__icon--end` end icon (like MUI's `endIcon`). |

Relevant native attributes: `disabled` (on `<button>`), `aria-disabled="true"` (on `<a>`), `type`, `href`.

### CSS classes

| Class | Description |
| :--- | :--- |
| `mtx-button` | Base class. Without a variant it behaves like text. |
| `mtx-button--contained` | Filled, elevated variant (high emphasis). |
| `mtx-button--outlined` | Bordered variant (medium emphasis). |
| `mtx-button--text` | Text variant (low emphasis). |
| `mtx-button--secondary` | Secondary color. |
| `mtx-button--success` | Success color. |
| `mtx-button--error` | Error color. |
| `mtx-button--warning` | Warning color. |
| `mtx-button--info` | Info color. |
| `mtx-button--inherit` | Inherits the container color (text/outlined); contained uses neutral grey. For dark or colored surfaces. |
| `mtx-button--on-primary` · `mtx-button--on-secondary` | On a primary/secondary surface: contained with paper background and the color as text; text/outlined inherit the container color. |
| `mtx-button--large` | 48px height. |
| `mtx-button--medium` | 40px height (same as the default). |
| `mtx-button--small` | 32px height. |
| `mtx-button--full-width` | Takes up 100% of the container width. |
| `mtx-button--disable-elevation` | Removes the contained shadow in all states. |
| `mtx-button--uppercase` | Displays the text in uppercase. |
| `mtx-button--icon` | Circular icon-only button (48/40/32px depending on the size). |
| `mtx-button__icon` | Container for the start or end icon. Material Icons at their native 24px; an `<svg>` inside renders at 24 × 24px with `currentColor`. |
| `mtx-button__icon--start` · `mtx-button__icon--end` | MUI offset of the icon towards the edge (−4px; −2px on small). Generated by `data-start-icon` / `data-end-icon`. |
| `mtx-button--loading` | Loading state (with `mtx-button--loading-{center,start,end}`). |
| `mtx-button__loading-indicator` | Indicator container (`aria-hidden`), with `--center`, `--start`, `--end` and `--text`. |
| `mtx-button__icon--loading-hidden` | Hides the icon replaced by the indicator. |

### Methods

| Method | Returns | Description |
| :--- | :--- | :--- |
| `disable()` | `void` | Disables it: `disabled` on `<button>`; `aria-disabled="true"` and `tabindex="-1"` on `<a>`. |
| `enable()` | `void` | Reverts `disable()`. |
| `disabled` (getter) | `boolean` | `true` if it has `disabled` or `aria-disabled="true"`. |
| `destroy()` | `void` | Removes the ripple and click-blocking listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |
| `setLoading(bool)` | instance | Turns loading on or off: `disabled`/`aria-disabled`, `aria-busy="true"` and indicator. Turning it off restores the previous `disabled` state. |
| `loading` (getter/setter) | `boolean` | Current loading state; assigning it is equivalent to `setLoading()`. |

### Events

Button doesn't emit its own events. Listen for the element's native `click` event.

### CSS variables

| Variable | Usage in Button |
| :--- | :--- |
| `--mtx-color-{primary,secondary,success,error,warning,info}` | Contained background. |
| `--mtx-color-{color}-text` | Text and border in outlined and text (AA by default; the main color with `data-mtx-contrast="mui"`). |
| `--mtx-color-{color}-dark` | Contained background on hover. |
| `--mtx-color-{color}-contrast` | Text on contained. |
| `--mtx-color-action-disabled`, `--mtx-color-action-disabled-background` | Disabled text, border and background. |
| `--mtx-size-large-height`, `--mtx-size-medium-height`, `--mtx-size-small-height` | 48 / 40 / 32px heights. |
| `--mtx-shape-radius` | Corner radius (4px). |
| `--mtx-type-button` | Text typography. |
| `--mtx-elevation-2`, `-4`, `-6`, `-8` | Contained shadows (resting, hover, focus, pressed). |
| `--mtx-duration-shorter`, `--mtx-easing-standard` | Transitions. |
| `--mtx-btn-bg`, `--mtx-btn-hover`, `--mtx-btn-fg`, `--mtx-btn-color` | Component-local variables; override them on a specific button for a custom color. |

## Accessibility

- Always use `<button>` for actions and `<a href>` for navigation; don't use `<div role="button">`.
- Icon-only buttons (`mtx-button--icon`) need an `aria-label`. Icons next to text have `aria-hidden="true"` (including the ones generated by `data-start-icon` / `data-end-icon`).
- `disabled` removes the button from the tab order. On links, `disable()` applies `aria-disabled="true"` and `tabindex="-1"`, and blocks the click.
- While loading, the button is disabled with `aria-busy="true"` and keeps its accessible name (with `center` the label only becomes transparent). The indicator is `aria-hidden`; to announce progress, use your own `aria-live` region.
- The ripple respects `prefers-reduced-motion`.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to the next / previous button. |
| <kbd>Enter</kbd> | Activates the button or follows the link. |
| <kbd>Space</kbd> | Activates the button (`<button>`). |
