---
title: "Link"
description: "MUI-styled text link on a native <a>: palette colors and three underline modes, without losing semantics."
group: "navigation"
icon: "link"
weight: 20
example: "link"
mui: "https://mui.com/material-ui/react-link/"
---

`Link` applies the MUI link style (palette color and an always-visible underline, the MUI v5 default; it inherits the surrounding typography, like `variant="inherit"`) to a native `<a href>`, so it keeps the browser's navigation, focus and context menu. Use it to navigate to another page or section from within text. If the action does not navigate (save, open a dialog, submit a form), use a [Button](../button/) with the `text` variant; for primary app destinations, use a [Drawer](../drawer/) or [Tabs](../tabs/).

## Basic usage

A single `<a>` element with `data-mtx="link"`. The component adds the `mtx-link` class and, if present, the `data-color` and `data-underline` modifiers.

{{< mtx-demo title="Simple link" >}}
<a data-mtx="link" href="#">View documentation</a>
{{< /mtx-demo >}}

## Colors

`data-color` accepts the six palette colors, `text-primary`, `text-secondary` and `inherit`. Without the attribute, the link uses `primary`.

{{< mtx-demo title="Palette and text colors" >}}
<a data-mtx="link" href="#">primary</a>
<a data-mtx="link" data-color="secondary" href="#">secondary</a>
<a data-mtx="link" data-color="error" href="#">error</a>
<a data-mtx="link" data-color="warning" href="#">warning</a>
<a data-mtx="link" data-color="info" href="#">info</a>
<a data-mtx="link" data-color="success" href="#">success</a>
<a data-mtx="link" data-color="text-primary" href="#">text-primary</a>
<a data-mtx="link" data-color="text-secondary" href="#">text-secondary</a>
{{< /mtx-demo >}}

`inherit` takes the color of the surrounding text, which is useful inside alerts, app bars or colored surfaces.

{{< mtx-demo title="Inherited color" >}}
<div data-mtx="alert" data-severity="warning">
  Your subscription expires tomorrow. <a data-mtx="link" data-color="inherit" data-underline="always" href="#">Renew now</a>
</div>
{{< /mtx-demo >}}

{{< callout type="warning" title="Contrast" >}}
On a white background, `warning` (#ed6c02) and `info` (#0288d1) fall below 4.5:1 for 14px text. Use them for secondary links or next to text that already explains the destination, and prefer `primary` for links inside paragraphs.
{{< /callout >}}

## Underline

`data-underline` controls the decoration: `always` (default, as in MUI v5: a soft underline at 40% of the link color that becomes solid on hover; required inside paragraphs), `hover` (only on hover) and `none` (never, not even on hover). Use `hover` or `none` only for links that are not inside running text (navigation, lists, footers).

{{< callout type="warning" title="Behavior change" >}}
Before this version the default was `hover`. To keep the previous look on a specific link, add `data-underline="hover"` (or the `mtx-link--underline-hover` class). Links that [Breadcrumbs](../breadcrumbs/) renders keep the hover underline.
{{< /callout >}}

{{< mtx-demo title="Underline modes" >}}
<a data-mtx="link" href="#">always (default)</a>
<a data-mtx="link" data-underline="hover" href="#">hover</a>
<a data-mtx="link" data-underline="none" href="#">none</a>
{{< /mtx-demo >}}

## Inside a paragraph

In running text, color must not be the only cue: keep the default underline (`always`) so the link can also be told apart without perceiving color.

{{< mtx-demo title="Links in text" layout="block" >}}
<p data-mtx="typography" data-variant="body2">
  By creating an account you agree to the <a data-mtx="link" href="#">terms of service</a>
  and the <a data-mtx="link" href="#">privacy policy</a>.
  You can change your preferences at any time from the settings panel.
</p>
{{< /mtx-demo >}}

{{< callout type="info" title="Link typography" >}}
`mtx-link` inherits the surrounding typography (family, size, weight and line height), like `variant="inherit"` in MUI: it fits `body1` and `body2` paragraphs, captions or form footers alike.
{{< /callout >}}

## States

The interactive states are the browser's native ones. `data-disabled` disables the link: on an `<a>` it sets `aria-disabled="true"`, removes it from the tab order and blocks the click; on a `<button>` it uses `disabled`.

{{< mtx-demo title="Hover, focus and disabled" >}}
<a data-mtx="link" href="#">Hover over it: the underline turns solid</a>
<a data-mtx="link" href="#">Press Tab: visible focus ring</a>
<a data-mtx="link" href="#" data-disabled>Disabled link</a>
{{< /mtx-demo >}}

## As a button

For an action that does not navigate but should look like a link inside text ("Resend code", "Forgot your password?"), use `<button data-mtx="link">` (MUI's `component="button"`): no native background, border or padding, and it takes the surrounding typography. Without a `type`, the component sets `type="button"` so it does not submit forms.

{{< mtx-demo title="Link on a button" >}}
<p class="mtx-typography--body2">Didn't get the code? <button data-mtx="link">Resend code</button></p>
<button data-mtx="link" disabled>Resend in 30 s</button>
{{< /mtx-demo >}}

## External links

To open in a new tab add `target="_blank"` and `rel="noopener noreferrer"`, and announce the change of context in the link text itself (or in its `aria-label`, which replaces the visible text for screen readers).

{{< mtx-demo title="Link to another site" >}}
<a data-mtx="link" href="https://mui.com/material-ui/react-link/" target="_blank" rel="noopener noreferrer">MUI guide (opens in a new tab)</a>
<a data-mtx="link" href="https://github.com/" target="_blank" rel="noopener noreferrer"
   aria-label="Repository on GitHub (opens in a new tab)">Repository on GitHub</a>
{{< /mtx-demo >}}

## Real-world examples

A sign-in form footer with secondary links, and breadcrumbs built with text links.

{{< mtx-demo title="Sign-in form footer" layout="column" >}}
<input data-mtx="text-field" data-label="Email" data-variant="outlined" type="email" autocomplete="email">
<button class="mtx-button mtx-button--contained" data-mtx="button" type="button">Sign in</button>
<p data-mtx="typography" data-variant="body2">
  <a data-mtx="link" href="#">Forgot your password?</a> ·
  <a data-mtx="link" data-color="text-secondary" href="#">Create an account</a>
</p>
{{< /mtx-demo >}}

{{< mtx-demo title="Breadcrumbs" >}}
<nav aria-label="Breadcrumb">
  <a data-mtx="link" data-color="text-secondary" href="#">Home</a> /
  <a data-mtx="link" data-color="text-secondary" href="#">Projects</a> /
  <span aria-current="page">Materix UI</span>
</nav>
{{< /mtx-demo >}}

## Full BEM syntax

The styling is pure CSS: with hand-written classes no JavaScript is needed. `data-mtx="link"` is only required if you want the instance to be registered.

```html
<a class="mtx-link" href="/home">Home</a>
<a class="mtx-link mtx-link--secondary mtx-link--underline-always" href="/terms">Terms</a>
<a class="mtx-link mtx-link--text-secondary mtx-link--underline-none" data-mtx="link" href="/help">Help</a>
```

## Programmatic usage

Declarative links initialize themselves. For dynamically created links:

```javascript
// Initialize an element created at runtime
const anchor = document.createElement('a');
anchor.href = '/profile';
anchor.textContent = 'My profile';
anchor.setAttribute('data-color', 'secondary');
document.querySelector('#actions').append(anchor);
Materix.init(anchor, 'link'); // adds data-mtx="link" and the classes

// Direct instantiation and retrieval
const link = new Materix.Link(document.getElementById('help-link'));
const same = Materix.getInstance(document.getElementById('help-link'));

// Initialize everything inside a container
Materix.initAll(document.getElementById('results'));
```

With ES modules:

```javascript
import { Link, init, getInstance } from '@rubenchodev/materix-ui';
```

Attributes are read only when the instance is created: to change the color afterwards, change the class (`mtx-link--secondary`, etc.) directly.

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `link` | — | Initializes the component on the `<a>` or `<button>`. |
| `data-color` | `primary`, `secondary`, `error`, `warning`, `info`, `success`, `inherit`, `text-primary`, `text-secondary` | `primary` (via CSS) | Adds `mtx-link--{color}` and its alias `mtx-link--color-{color}`. |
| `data-underline` | `always`, `hover`, `none` | `always` (via CSS) | Adds `mtx-link--underline-{value}`. |
| `data-disabled` | boolean | — | Disabled on init (`disabled` on `<button>`; `aria-disabled` and `tabindex="-1"` on `<a>`). |

### CSS classes

| Class | Description |
|---|---|
| `mtx-link` | Base block: primary color, inherited typography (`font: inherit`), soft underline (`text-decoration-color` at 40%) that turns solid on hover, focus ring. On a `<button>` it removes the native background, border and padding. With `:disabled` or `aria-disabled="true"`, disabled text color and no interaction. |
| `mtx-link--primary` … `mtx-link--success` | Palette color (`primary`, `secondary`, `error`, `warning`, `info`, `success`). |
| `mtx-link--text-primary` / `mtx-link--text-secondary` | Primary or secondary text color. |
| `mtx-link--inherit` | Inherits the container color. |
| `mtx-link--color-{color}` | Alias for each color class above (also added by `data-color`). |
| `mtx-link--underline-hover` | Underline only on hover. |
| `mtx-link--underline-always` | Underline always visible (default behavior). |
| `mtx-link--underline-none` | No underline, not even on hover. |

### Methods

| Method | Returns | Description |
|---|---|---|
| `disable()` | `void` | Disables the link (`disabled` or `aria-disabled` depending on the tag). |
| `enable()` | `void` | Enables it again. |
| `disabled` (getter) | `boolean` | Disabled state. |
| `destroy()` | `void` | Removes the listener that blocks clicks while disabled. Unlinks the instance: `getInstance()` then returns `undefined`. |

### Events

`Link` emits no events; use the native `click` event of the `<a>`.

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-text-disabled` | Disabled color. |
| `--mtx-color-primary`, `--mtx-color-secondary`, `--mtx-color-error`, `--mtx-color-warning`, `--mtx-color-info`, `--mtx-color-success` | Color of each variant. |
| `--mtx-color-text-primary`, `--mtx-color-text-secondary` | Text colors. |
| `--mtx-duration-shorter`, `--mtx-easing-standard` | Color transition. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring (`:focus-visible`). |

## Accessibility

- Always use an `<a>` with `href`: that way the link is focusable, activates with <kbd>Enter</kbd> and screen readers announce it as a link. For an action without a destination inside text use `<button data-mtx="link">`; for prominent actions, `Button`.
- The text must describe the destination ("Read the privacy policy"), not "click here".
- Inside paragraphs keep the default underline (`always`) so you don't rely on color alone (WCAG 1.4.1, axe `link-in-text-block`); don't use `hover`/`none` there.
- External links with `target="_blank"`: add `rel="noopener noreferrer"` and announce the change of context in the text or in `aria-label` (Materix does not ship a screen-reader-only text class).
- Keyboard focus shows a `--mtx-focus-ring-width` ring with a 2px offset.

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to the next or previous link. |
| <kbd>Enter</kbd> | Follows the link. |
