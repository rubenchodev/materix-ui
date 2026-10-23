---
title: "Breadcrumbs"
description: "Hierarchical navigation trail that shows where the user is and lets them jump back to any parent level."
group: "navigation"
icon: "more_horiz"
weight: 5
example: "breadcrumbs"
mui: "https://mui.com/material-ui/react-breadcrumbs/"
---

`Breadcrumbs` renders the path from the root of the site or app to the current page, like MUI's `Breadcrumbs`: a `<nav>` with an ordered list, separators hidden from assistive technologies and the last item marked with `aria-current="page"`. Use it in hierarchies of three or more levels (catalogs, documentation, file managers). Do not use it as primary navigation or for linear flows: use a [Drawer](../drawer/) or [Tabs](../tabs/) for sections, and a stepper for steps.

## Basic usage

A single `<ol data-mtx="breadcrumbs">`. The component wraps it in `<nav aria-label="breadcrumb">`, turns each `<a>` into a Materix [Link](../link/) (`color="inherit"`, underline on hover), inserts the separators and marks the last item as the current page.

{{< mtx-demo title="Simple trail" layout="column" >}}
<ol data-mtx="breadcrumbs">
  <li><a href="#">Home</a></li>
  <li><a href="#">Catalog</a></li>
  <li>Accessories</li>
</ol>
{{< /mtx-demo >}}

If the last item must stay a link (for example to reload the page), add `aria-current="page"` yourself: the component respects it and does not mark any other item.

{{< mtx-demo title="Current page as a link" layout="column" >}}
<ol data-mtx="breadcrumbs">
  <li><a href="#">Home</a></li>
  <li><a href="#">Catalog</a></li>
  <li><a href="#" aria-current="page">Headphones</a></li>
</ol>
{{< /mtx-demo >}}

## Separators

`data-separator` accepts any text (default `/`) or the name of a Material icon: a value made of lowercase letters, digits and underscores, with three or more characters (`navigate_next`, `chevron_right`), is rendered as an icon.

{{< mtx-demo title="Text and icon separators" layout="column" >}}
<ol data-mtx="breadcrumbs" data-separator="›">
  <li><a href="#">Home</a></li>
  <li><a href="#">Catalog</a></li>
  <li>Accessories</li>
</ol>
<ol data-mtx="breadcrumbs" data-separator="-">
  <li><a href="#">Home</a></li>
  <li><a href="#">Catalog</a></li>
  <li>Accessories</li>
</ol>
<ol data-mtx="breadcrumbs" data-separator="navigate_next">
  <li><a href="#">Home</a></li>
  <li><a href="#">Catalog</a></li>
  <li>Accessories</li>
</ol>
{{< /mtx-demo >}}

## With icons

`data-icon` on the link (or on the text `<span>`) adds a decorative Material icon before the label. As in MUI, the hover underline and the focus ring keep the icon aligned: only the label is underlined.

{{< mtx-demo title="Breadcrumbs with icons" layout="column" >}}
<ol data-mtx="breadcrumbs">
  <li><a href="#" data-icon="home">Home</a></li>
  <li><a href="#" data-icon="whatshot">Projects</a></li>
  <li><span data-icon="grain">Website redesign</span></li>
</ol>
{{< /mtx-demo >}}

## Collapsed breadcrumbs

When there are more items than `data-max-items` (8 by default), only `data-items-before-collapse` (1) and `data-items-after-collapse` (1) are shown, separated by a "Show path" button. Activating it reveals the hidden items and moves focus to the first one.

{{< mtx-demo title="data-max-items" layout="column" >}}
<ol data-mtx="breadcrumbs" data-max-items="2">
  <li><a href="#">Home</a></li>
  <li><a href="#">Catalog</a></li>
  <li><a href="#">Accessories</a></li>
  <li><a href="#">New collection</a></li>
  <li>Belts</li>
</ol>
<ol data-mtx="breadcrumbs" data-max-items="4" data-items-before-collapse="2" data-items-after-collapse="2" data-separator="navigate_next">
  <li><a href="#">Home</a></li>
  <li><a href="#">Documents</a></li>
  <li><a href="#">2026</a></li>
  <li><a href="#">Accounting</a></li>
  <li><a href="#">Q3</a></li>
  <li>Invoices</li>
</ol>
{{< /mtx-demo >}}

## Typography

Like MUI, it uses `body1` in `text.secondary` and the current page in `text.primary`. For a more compact trail, add a Typography class (`mtx-typography--body2`) to the element.

{{< mtx-demo title="body1 and body2" layout="column" >}}
<ol data-mtx="breadcrumbs">
  <li><a href="#">Settings</a></li>
  <li>Security</li>
</ol>
<ol data-mtx="breadcrumbs" class="mtx-typography--body2">
  <li><a href="#">Settings</a></li>
  <li>Security</li>
</ol>
{{< /mtx-demo >}}

## States

Links show the Link states (underline on hover, focus ring with <kbd>Tab</kbd>). A trail link can be disabled with `data-disabled`, and `data-color` on the `<a>` changes its color.

{{< mtx-demo title="Disabled item and link color" layout="column" >}}
<ol data-mtx="breadcrumbs">
  <li><a href="#">Home</a></li>
  <li><a href="#" data-disabled>Archived</a></li>
  <li>Order #4821</li>
</ol>
<ol data-mtx="breadcrumbs">
  <li><a href="#" data-color="primary">Home</a></li>
  <li><a href="#" data-color="primary">Customers</a></li>
  <li>Ana Torres</li>
</ol>
{{< /mtx-demo >}}

## From a list of links

It can also be initialized on a `<nav>` whose direct children are the links: the component creates the `<ol>` and one `<li>` per child. On a `<div>` it adds `role="navigation"`.

{{< mtx-demo title="nav with direct links" layout="column" >}}
<nav data-mtx="breadcrumbs" aria-label="Location in help center">
  <a href="#">Help</a>
  <a href="#">Billing</a>
  <span>Change payment method</span>
</nav>
{{< /mtx-demo >}}

## Real-world examples

Page header of an admin panel: trail, title and main action.

{{< mtx-demo title="Page header" layout="block" >}}
<div class="mtx-d-flex mtx-flex-column mtx-gap-1">
  <ol data-mtx="breadcrumbs" class="mtx-typography--body2">
    <li><a href="#" data-icon="dashboard">Dashboard</a></li>
    <li><a href="#">Users</a></li>
    <li>Edit profile</li>
  </ol>
  <div class="mtx-d-flex mtx-flex-wrap mtx-align-items-center mtx-justify-content-between mtx-gap-2">
    <h3 data-mtx="typography" data-variant="h5">Edit profile</h3>
    <button class="mtx-button mtx-button--contained" data-mtx="button" type="button">Save changes</button>
  </div>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

Pre-rendered structure (SSR). It already looks right without JavaScript; with `data-mtx` the component reuses the nodes and repaints the separators without duplicating them.

```html
<nav class="mtx-breadcrumbs" data-mtx="breadcrumbs" aria-label="breadcrumb">
  <ol class="mtx-breadcrumbs__ol">
    <li class="mtx-breadcrumbs__li"><a class="mtx-link mtx-link--inherit mtx-breadcrumbs__link" href="/">Home</a></li>
    <li class="mtx-breadcrumbs__separator" aria-hidden="true">/</li>
    <li class="mtx-breadcrumbs__li"><a class="mtx-link mtx-link--inherit mtx-breadcrumbs__link" href="/blog">Blog</a></li>
    <li class="mtx-breadcrumbs__separator" aria-hidden="true">/</li>
    <li class="mtx-breadcrumbs__li"><span class="mtx-breadcrumbs__text" aria-current="page">October news</span></li>
  </ol>
</nav>
```

## Programmatic usage

`setItems()` rebuilds the whole trail, which is ideal for SPAs and folder navigation. Items without `href` that are not the current page are rendered as a Link on a `<button>`; `data` is copied to `data-*` attributes and comes back in the event. The `mtx:breadcrumbs:navigate` event is cancelable: call `preventDefault()` to handle navigation yourself.

{{< mtx-demo title="Folder navigation" layout="column" >}}
<ol data-mtx="breadcrumbs" data-separator="chevron_right" data-max-items="4" id="doc-bc-folders">
  <li><span data-icon="folder">My Drive</span></li>
</ol>
<button class="mtx-button mtx-button--outlined" data-mtx="button" type="button" id="doc-bc-open">Open subfolder</button>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var folders = ['My Drive', 'Projects', 'Andina client', 'Deliverables', 'Q3 report'];
  var depth = 0;
  var crumbs = Materix.getInstance(document.getElementById('doc-bc-folders'));
  function render() {
    crumbs.setItems(folders.slice(0, depth + 1).map(function (name, index) {
      return { label: name, icon: index === 0 ? 'folder' : null, data: { depth: index } };
    }));
  }
  crumbs.element.addEventListener('mtx:breadcrumbs:navigate', function (event) {
    event.preventDefault();
    depth = event.detail.index;
    render();
  });
  document.getElementById('doc-bc-open').addEventListener('click', function () {
    depth = Math.min(depth + 1, folders.length - 1);
    render();
  });
});
</script>

```javascript
const crumbs = Materix.getInstance(document.querySelector('#folders'));

crumbs.setItems([
  { label: 'My Drive', icon: 'folder', data: { folder: 'root' } },
  { label: 'Projects', data: { folder: 'p1' } },
  { label: 'Q3 report' }               // last item: current page
]);

crumbs.element.addEventListener('mtx:breadcrumbs:navigate', (event) => {
  event.preventDefault();               // SPA navigation
  openFolder(event.detail.item.data.folder);
});

// Direct instantiation
const trail = new Materix.Breadcrumbs(document.querySelector('ol.trail'));
trail.expand();                         // shows the collapsed items
```

With ES modules:

```javascript
import { Breadcrumbs, getInstance } from 'materix-ui';
```

`Materix.getInstance()` returns the same instance for the original `<ol>` and for the `<nav>` it is wrapped in; `instance.element` is always the `<nav>`.

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `breadcrumbs` | — | Initializes the component on an `<ol>`/`<ul>` (wrapped in `<nav>`), a `<nav>` with an `<ol>`, or a `<nav>`/`<div>` with direct links. |
| `data-separator` | text or icon name | `/` | Separator between items. Lowercase names with `_` and 3+ characters render as a Material icon. |
| `data-max-items` | integer | `8` | Maximum number of visible items before collapsing. `0` disables collapsing. |
| `data-items-before-collapse` | integer | `1` | Items shown before the collapse button. |
| `data-items-after-collapse` | integer | `1` | Items shown after the collapse button. |
| `data-expand-label` | text | i18n `breadcrumbs.showPath` | Accessible label of the collapse button. |
| `data-icon` (on `<a>`, `<span>` or `<li>`) | icon name | — | Decorative icon before the label. |
| `data-color`, `data-underline`, `data-disabled` (on `<a>`) | see [Link](../link/) | `inherit`, `hover` | Link options for each item. |

### CSS classes

| Class | Description |
|---|---|
| `mtx-breadcrumbs` | Root `<nav>`: `body1` typography (zero specificity, so `mtx-typography--*` can override it) in `text.secondary`. |
| `mtx-breadcrumbs--collapsed` | Added while there are hidden items. |
| `mtx-breadcrumbs__ol` | Flex list with wrapping, no bullets or margins. |
| `mtx-breadcrumbs__li` | Item. |
| `mtx-breadcrumbs__link` | Item link (a Materix Link). |
| `mtx-breadcrumbs__text` | Item without a link (usually the current page). |
| `mtx-breadcrumbs__item--with-icon` | Link or text with an icon: reserves 24px + 4px for the icon and keeps the hover underline under the text only. |
| `mtx-breadcrumbs__icon` | Decorative 24px icon (`aria-hidden`), vertically centered and outside the text flow, so it is never underlined. |
| `mtx-breadcrumbs__separator` | Separator `<li>` with `aria-hidden="true"` and 8px horizontal margin. |
| `mtx-breadcrumbs__collapsed` | `<li>` holding the collapse button. |
| `mtx-breadcrumbs__collapse-button` | "Show path" button (MoreHoriz icon 24×16). |

### Methods

| Method | Returns | Description |
|---|---|---|
| `setItems(items)` | `void` | Replaces the trail. `items`: `[{ label, href?, icon?, current?, data? }]`. Without `current`, the last item is the current page. Throws `TypeError` if it is not an array. |
| `getItems()` | `Array` | Copy of the items: `{ label, href, icon, current, data }`. |
| `expand(focus?)` | `void` | Shows all items; with `focus = true` it moves focus to the first revealed item. |
| `collapse()` | `void` | Re-applies collapsing. |
| `expanded` (getter) | `boolean` | Whether the trail was expanded. |
| `maxItems` (getter/setter) | `number` | Maximum number of visible items. |
| `destroy()` | `void` | Removes listeners. Unlinks the instance: `getInstance()` then returns `undefined`. |

### Events

| Event | detail | Emitted when |
|---|---|---|
| `mtx:breadcrumbs:navigate` | `{ index, href, label, current, item, originalEvent }` | A trail link or button is activated. Cancelable: `preventDefault()` cancels the native navigation. |
| `mtx:breadcrumbs:expand` | — | The collapsed items are revealed. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-breadcrumbs-separator-gap` | Horizontal margin of the separator (8px). |
| `--mtx-breadcrumbs-collapse-bg`, `--mtx-breadcrumbs-collapse-bg-hover`, `--mtx-breadcrumbs-collapse-color` | Collapse button colors (grey 100/200/700, inverted in dark theme). |
| `--mtx-type-body1`, `--mtx-color-text-secondary`, `--mtx-color-text-primary` | Typography and colors of the trail and the current page. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring of the collapse button. |

## Accessibility

- Landmark `<nav>` with `aria-label="breadcrumb"` (translated through i18n `breadcrumbs.label`; your own `aria-label` or `aria-labelledby` is kept). On a `<div>`, `role="navigation"` is added.
- Ordered list (`<ol>`): screen readers announce the number of levels.
- Separators are `<li aria-hidden="true">`, so they are not read.
- The current page has `aria-current="page"`.
- The collapse button is a real `<button>` with the translated label "Show path"; after expanding, focus moves to the first revealed item so it is not lost.

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the trail links and the collapse button. |
| <kbd>Enter</kbd> | Follows the link or expands the trail. |
| <kbd>Space</kbd> | Expands the trail (collapse button) or activates an item rendered as a button. |
