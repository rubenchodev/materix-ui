---
title: "Link"
description: "MUI-styled text link on a native <a>: palette colors and three underline modes, without losing semantics."
group: "navigation"
icon: "link"
weight: 20
example: "link"
import: "Link"
mui: "https://mui.com/material-ui/react-link/"
---

`Link` applies MUI's link style (primary color, always underlined by default) to a native `<a>`, to a `<button>` for actions that don't navigate, or to your router's link component. It inherits the typography of the surrounding text.

```tsx
import { Link } from '@rubenchodev/materix-react';
// or only this component:
import { Link } from '@rubenchodev/materix-react/components/link';
```

## Basic usage

`<Link href="…">` renders an `<a class="mtx-link">`. With no other props it uses the primary color and is always underlined (MUI v5 default), so it never relies on color alone.

{{< react-demo id="link/01-basic" layout="block" >}}

## Underline

The link's variant is its underline: `underline="always|hover|none"`. `always` is the default: a soft underline (40% of the color) that becomes solid on hover. Use `hover` or `none` only for links outside running text (navigation, lists, footers).

{{< react-demo id="link/02-underline" layout="block" >}}

## Colors

`color` accepts the six palette colors, the text colors (`text-primary`, `text-secondary`) and `inherit`, which takes the color of the surrounding text (here, inside an Alert).

{{< react-demo id="link/03-colors" layout="block" >}}

## States

Hover to see the underline and use <kbd>Tab</kbd> to see the focus ring. `disabled` disables the link: on `<a>` it sets `aria-disabled="true"`, removes it from the tab order and cancels clicks; on `<button>` it uses the native `disabled` attribute.

{{< react-demo id="link/04-states" layout="block" >}}

## As a button

For actions that don't navigate but should look like a link inside text, use `component="button"` (no native background, border or padding, and the typography of the surrounding text). Without `type`, it gets `type="button"` so it doesn't submit forms.

{{< react-demo id="link/05-as-button" layout="block" >}}

## In a paragraph

Inside running text keep the default underline (`always`) so the link doesn't rely on color alone (WCAG 1.4.1). The link inherits the paragraph's typography, so it fits any variant.

{{< react-demo id="link/06-in-paragraph" layout="block" >}}

## External links

With `target="_blank"` always add `rel="noopener noreferrer"` and announce the change of context in the visible text or in an `aria-label` that contains it.

{{< react-demo id="link/07-external" layout="block" >}}

## Real-world examples

Secondary links under a sign-in form and a breadcrumb trail.

{{< react-demo id="link/08-real-world" layout="block" >}}

## In a grid

Footer with columns of links in a `Grid`: one column on mobile, two on tablet and four on desktop.

{{< react-demo id="link/09-grid" layout="block" >}}

## Programmatic usage and router links

Links are created from state (there are no methods). `component` renders the Link style on any component: React Router's `Link`, Next.js `Link`, etc. Their props (`to`, `prefetch`…) are forwarded.

{{< react-demo id="link/10-programmatic" layout="block" >}}

```tsx
import { Link as RouterLink } from 'react-router-dom';

<Link component={RouterLink} to="/dashboard">Dashboard</Link>
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `'primary'` \| `'secondary'` \| `'error'` \| `'warning'` \| `'info'` \| `'success'` \| `'text-primary'` \| `'text-secondary'` \| `'inherit'` | primary (CSS) | Adds `.mtx-link--{color}` and `.mtx-link--color-{color}`. |
| `underline` | `'always'` \| `'hover'` \| `'none'` | `always` (CSS) | Adds `.mtx-link--underline-{mode}`. |
| `disabled` | `boolean` | `false` | `<button>`: `disabled`. Others: `aria-disabled="true"`, `tabIndex={-1}` and clicks cancelled. |
| `component` | `ElementType` | `'a'` | Root element or component (`'button'`, a router link…). |
| `className` | `string` | — | Merged with the component classes. |
| `ref` | `Ref<HTMLElement>` | — | Points to the root element. |

Any other prop (`href`, `target`, `rel`, `onClick`, `aria-*`…) is forwarded to the root element.

### Callbacks

| Callback | Description |
|---|---|
| `onClick(event)` | Native click. It is not called while `disabled`. |

### CSS classes

| Class | Description |
|---|---|
| `.mtx-link` | Base: primary color, `always` underline, focus ring. |
| `.mtx-link--{color}` / `.mtx-link--color-{color}` | Link color. |
| `.mtx-link--underline-{always\|hover\|none}` | Underline mode. |
| `button.mtx-link` | Removes the native button look. |

## Accessibility

- Use `<a href>` for navigation: it is focusable, activates with <kbd>Enter</kbd> and is announced as a link. For an action without a destination inside text use `component="button"`; for prominent actions, Button.
- The text must describe the destination ("Read the privacy policy"), not "click here".
- Inside paragraphs keep the `always` underline (WCAG 1.4.1, axe `link-in-text-block`).
- A disabled `<a>` keeps its `href` but is removed from the tab order and announced as disabled.
- Keyboard focus shows a `--mtx-focus-ring-width` ring with a 2px offset.

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to the next or previous link. |
| <kbd>Enter</kbd> | Follows the link (or runs the action with `component="button"`). |
| <kbd>Space</kbd> | Runs the action with `component="button"`. |

## Vanilla equivalence

| Vanilla (`data-*`) | React |
|---|---|
| `<a data-mtx="link" href="/">` | `<Link href="/">` |
| `<button data-mtx="link">` | `<Link component="button">` |
| `data-color="secondary"` | `color="secondary"` |
| `data-underline="hover"` | `underline="hover"` |
| `data-disabled` / `link.disable()` / `link.enable()` | `disabled` (controlled by the prop) |

The rendered DOM (classes, `type`, `disabled`, `aria-disabled` and `tabindex`) is identical to the vanilla component after initialization.
