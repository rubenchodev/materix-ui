---
title: "Divider"
description: "A thin line that separates and groups content in lists, menus and layouts, horizontally or vertically and optionally with text."
group: "data-display"
icon: "horizontal_rule"
weight: 40
example: "divider"
mui: "https://mui.com/material-ui/react-divider/"
---

`Divider` is a 1px line in the theme's `divider` color that separates groups of content. Use it between sections of a list, between blocks of a form or between actions in a toolbar. Don't use it as decoration everywhere: white space often separates better; and if you need a bordered container, use an `outlined` [Paper]({{< relref "/components/paper" >}}).

## Basic usage

An `<hr>` with `data-mtx="divider"`. Being an `<hr>`, it already has the semantic separator role.

{{< mtx-demo title="Horizontal divider" layout="block" >}}
<p>Content of the first section.</p>
<hr data-mtx="divider">
<p>Content of the second section.</p>
{{< /mtx-demo >}}

## Variants

`data-variant` adjusts the side margins: with no value it spans the full width; `middle` leaves 16px on each side; `inset` leaves 72px on the left to align with the text of a list with icons or avatars.

{{< mtx-demo title="Full width, middle and inset" layout="block" >}}
<p>Full width</p>
<hr data-mtx="divider">
<p>Middle</p>
<hr data-mtx="divider" data-variant="middle">
<p>Inset</p>
<hr data-mtx="divider" data-variant="inset">
{{< /mtx-demo >}}

## Vertical orientation

`data-orientation="vertical"` creates a vertical line that stretches to the height of its flex container. Use a `<div>`: the component adds `role="separator"` and `aria-orientation="vertical"` for you. `data-flex-item` makes a divider work as a flex item in containers that don't stretch their children.

{{< mtx-demo title="Separating actions" >}}
<button data-mtx="icon-button" data-icon="format_bold" aria-label="Bold"></button>
<button data-mtx="icon-button" data-icon="format_italic" aria-label="Italic"></button>
<div data-mtx="divider" data-orientation="vertical" data-flex-item></div>
<button data-mtx="icon-button" data-icon="format_align_left" aria-label="Align left"></button>
<button data-mtx="icon-button" data-icon="format_align_center" aria-label="Center"></button>
{{< /mtx-demo >}}

## With text

Write the text as the content of a `<div>` or use `data-text`. `data-text-align` places it on the left or the right (centered by default).

{{< mtx-demo title="Centered, left and right text" layout="column" >}}
<div data-mtx="divider">CENTER</div>
<div data-mtx="divider" data-text="LEFT" data-text-align="left"></div>
<div data-mtx="divider" data-text="RIGHT" data-text-align="right"></div>
{{< /mtx-demo >}}

## In lists

Inside a list, use an `<li>` as the divider to keep the HTML valid; `inset` aligns the line with the item text. The component does **not** give that `<li>` `role="separator"` (a list may only contain list items, axe rule `list`): an empty one is marked `aria-hidden="true"` as decorative, so screen readers don't count it as an item. Alternatively, `data-divider` on each `list-item` draws a bottom border.

{{< mtx-demo title="Inset divider between items" layout="block" >}}
<ul data-mtx="list" aria-label="Mailbox">
  <li data-mtx="list-item" data-icon="inbox">Inbox</li>
  <li data-mtx="divider" data-variant="inset"></li>
  <li data-mtx="list-item" data-icon="drafts">Drafts</li>
  <li data-mtx="divider" data-variant="inset"></li>
  <li data-mtx="list-item" data-icon="send">Sent</li>
</ul>
{{< /mtx-demo >}}

## Real-world examples

An "or" separator between a social sign-in and the classic sign-in form.

{{< mtx-demo title="Sign in" layout="column" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button">Continue with Google</button>
<div data-mtx="divider">or</div>
<input data-mtx="text-field" data-label="Email" data-variant="outlined" type="email">
{{< /mtx-demo >}}

## Full BEM syntax

The classes work without JavaScript; the component only adds them based on the `data-*` attributes and generates the text `<span>`.

```html
<hr class="mtx-divider mtx-divider--middle">

<div class="mtx-divider mtx-divider--vertical mtx-divider--flex-item"
     role="separator" aria-orientation="vertical"></div>

<div class="mtx-divider mtx-divider--text mtx-divider--text-left" role="separator">
  <span class="mtx-divider__text">Section</span>
</div>
```

## Programmatic usage

Divider has no methods or events of its own; you only need to initialize it if you create it dynamically.

```javascript
const divider = document.createElement('div');
divider.setAttribute('data-text', 'New');
container.append(divider);

Materix.init(divider, 'divider');          // or new Materix.Divider(divider)
Materix.getInstance(divider);              // existing instance
Materix.initAll(container);                // everything inside a container
```

With ES modules:

```javascript
import { Divider } from 'materix-ui';
new Divider(document.querySelector('#separator'));
```

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-orientation` | `horizontal`, `vertical` | `horizontal` | Direction of the line. |
| `data-variant` | `middle`, `inset` | full width | Side margins: 16px on each side or 72px on the left. |
| `data-flex-item` | Boolean (presence) | absent | Automatic height and `align-self: stretch` inside a flex container. |
| `data-text` | Text | element content | Central text. If missing, the element's text is used (except on `<hr>`). |
| `data-text-align` | `left`, `right` | centered | Text position. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-divider` | 1px horizontal line with `--mtx-color-divider`. |
| `mtx-divider--vertical` | 1px vertical line that stretches within its container. |
| `mtx-divider--middle` | 16px side margins. |
| `mtx-divider--inset` | 72px left margin. |
| `mtx-divider--flex-item` | Flex item behavior. |
| `mtx-divider--text` | Divider with text (line, text, line). |
| `mtx-divider--text-left` / `--text-right` | Text shifted to one side. |
| `mtx-divider__text` | Generated text (body2, secondary color). |

### Methods

Divider doesn't expose its own methods.

### Events

Divider doesn't emit events.

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-divider` | Line color. |
| `--mtx-color-text-secondary` | Text color. |
| `--mtx-type-body2` | Text typography. |
| `--mtx-spacing-1_5` | Gap between the text and the lines. |

## Accessibility

- `<hr>` has the implicit `separator` role; it's the recommended option for horizontal dividers.
- On a `<div>` (or an `<li>` outside a list), the component adds `role="separator"` (unless you set your own `role`), and `aria-orientation="vertical"` on vertical dividers, as MUI does. Markup without JavaScript (pure CSS classes) must add them by hand.
- An `<li>` divider that is a direct child of `<ul>`, `<ol>` or `role="list"` keeps its list item role; if it's empty it gets `aria-hidden="true"` (decorative), and with text it stays readable.
- A purely decorative divider inside a toolbar can have `aria-hidden="true"`, or `role="presentation"` so the component doesn't add `separator`.
- The text of a divider with text is readable content: write it meaningfully ("or", "Section 2"), not with symbols.
