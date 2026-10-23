---
title: "Drawer"
description: "Side panel for navigation or supplementary content: temporary, persistent, permanent or responsive, with a generated header and footer and an app shell pattern."
group: "navigation"
icon: "menu_open"
weight: 10
example: "drawer"
mui: "https://mui.com/material-ui/react-drawer/"
---

`Drawer` is a panel that slides in from an edge of the screen to show the app's navigation or supplementary content (filters, details, options), like MUI's `Drawer`. Use it for primary navigation on mobile (temporary) or as a fixed sidebar on desktop (permanent). For a decision or a short form that interrupts the flow use a [Dialog]({{< relref "/components/dialog" >}}); for a short list of actions on an item, a [Menu]({{< relref "/components/menu" >}}).

## Basic usage

A `data-mtx="drawer"` container with its content directly inside. `data-title` generates the header with a title and a close button; the content is wrapped in a scrollable panel and a *backdrop* is created. Any element with `data-mtx-drawer-open="id"` opens it.

{{< mtx-demo title="Temporary navigation drawer" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-drawer-open="doc-drawer-basic">Open navigation</button>

<div data-mtx="drawer" id="doc-drawer-basic" data-title="Mail">
  <nav data-mtx="list" aria-label="Main navigation">
    <a data-mtx="list-item-button" data-icon="inbox" href="#" data-selected>Inbox</a>
    <a data-mtx="list-item-button" data-icon="star" href="#">Starred</a>
    <a data-mtx="list-item-button" data-icon="send" href="#">Sent</a>
    <a data-mtx="list-item-button" data-icon="drafts" href="#">Drafts</a>
  </nav>
</div>
{{< /mtx-demo >}}

It closes with <kbd>Escape</kbd>, a click on the backdrop or outside the panel, the X, or any inner element that has `data-mtx-drawer-close`. Clicking a list item selects it (the others are deselected within the drawer).

## App shell (responsive layout)

The main recipe for an application, with no CSS of your own — the same structure as MUI's *Responsive drawer* + *Clipped under the app bar*:

1. A `fixed` [App Bar]({{< relref "/components/app-bar" >}}). Its generated navigation icon becomes the drawer trigger with `data-drawer="id"`.
2. A flex row (`mtx-d-flex`) with the drawer in `data-variant="responsive"` + `data-clipped`: **temporary** (modal, above the App Bar) below `data-breakpoint` and **permanent** (a fixed-width box in the flow, sticky right below the App Bar) from it upwards. Same markup, no duplicated navigation.
3. A `<main class="mtx-flex-1 mtx-min-w-0">` that starts with `.mtx-toolbar-offset` (a spacer as tall as the App Bar: 56px on mobile, 64px from 600px).

```html
<header data-mtx="app-bar" data-position="fixed" data-color="primary"
        data-start-icon="menu" data-drawer="app-nav" data-title="My app">
  <div class="mtx-app-bar-search mtx-app-bar-search--grow" role="search">
    <span class="material-icons" aria-hidden="true">search</span>
    <input type="search" placeholder="Search…" aria-label="Search">
  </div>
</header>

<div class="mtx-d-flex">
  <div data-mtx="drawer" id="app-nav" data-variant="responsive" data-breakpoint="md"
       data-clipped data-width="240px" data-title="My app" data-header="temporary"
       aria-label="Main navigation">
    <nav data-mtx="list" aria-label="Sections">
      <a data-mtx="list-item-button" data-icon="dashboard" href="/" aria-current="page" data-mtx-drawer-close>Overview</a>
      <a data-mtx="list-item-button" data-icon="receipt_long" href="/orders" data-mtx-drawer-close>Orders</a>
    </nav>
    <div class="mtx-mt-auto mtx-p-2">…footer pinned to the bottom…</div>
  </div>

  <main class="mtx-flex-1 mtx-min-w-0">
    <div class="mtx-toolbar-offset"></div>
    …
  </main>
</div>
```

- The menu icon is hidden automatically while the drawer is permanent (`mtx-drawer-trigger--hidden`) and gets `aria-controls`/`aria-expanded`.
- `data-mtx-drawer-close` on the links closes the drawer after navigating on mobile; it does nothing while it's permanent.
- `data-header="temporary"` shows the generated header (title + close button) only in temporary mode, because on desktop the App Bar already shows the brand.
- `.mtx-drawer__content` is a flex column: a child with `mtx-mt-auto` stays pinned to the bottom (upgrade card, version, sign-out…).

Open the [full-screen app shell]({{< example-url "drawer/dashboard.html" >}}) and resize the window. The same pattern inside a container (with `data-absolute`, so the drawer and backdrop stay within the frame):

{{< mtx-demo title="Responsive drawer inside a container" layout="block" height="340px" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary" data-start-icon="menu" data-drawer="doc-drawer-shell" data-title="Mail"></header>
<div class="mtx-d-flex mtx-position-relative mtx-overflow-hidden" style="height: 260px">
  <div data-mtx="drawer" id="doc-drawer-shell" data-variant="responsive" data-breakpoint="md" data-absolute
       data-width="220px" data-title="Mail" data-header="temporary" aria-label="Folders">
    <nav data-mtx="list" aria-label="Folders">
      <a data-mtx="list-item-button" data-icon="inbox" href="#" data-selected data-mtx-drawer-close>Inbox</a>
      <a data-mtx="list-item-button" data-icon="star" href="#" data-mtx-drawer-close>Starred</a>
      <a data-mtx="list-item-button" data-icon="send" href="#" data-mtx-drawer-close>Sent</a>
    </nav>
  </div>
  <div class="mtx-flex-1 mtx-min-w-0 mtx-p-2">Below 900px the menu icon opens the drawer; from 900px it is permanent.</div>
</div>
{{< /mtx-demo >}}

## Variants

`data-variant` chooses the behavior, just like MUI:

- `temporary` (default): modal over the page with a backdrop; it locks `<body>` scrolling, traps focus and returns it on close.
- `persistent`: opens and closes without a backdrop; the page stays interactive.
- `permanent`: always visible and impossible to close. As in MUI, it's a fixed-width box in the flow of a flex row (`flex-shrink: 0`) whose panel is `sticky` and as tall as the viewport (`100dvh`), so it doesn't scroll with the page.
- `responsive`: `temporary` below `data-breakpoint` (`sm` 600px, `md` 900px by default, `lg` 1200px, `xl` 1536px) and `permanent` from it upwards, with the same markup (see "App shell").

With `data-absolute`, the drawer (and its backdrop) are positioned inside the parent container instead of the window, useful for embedded panels like these; a contained `permanent` drawer takes the container's height instead of the viewport's.

{{< mtx-demo title="temporary and persistent inside a container" layout="row" height="300px" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-temporary">temporary</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-toggle="doc-drawer-persistent">persistent (toggle)</button>

<div data-mtx="drawer" id="doc-drawer-temporary" data-absolute data-width="narrow" data-title="Temporary">
  <nav data-mtx="list" aria-label="Temporary navigation">
    <a data-mtx="list-item-button" data-icon="inbox" href="#">Inbox</a>
    <a data-mtx="list-item-button" data-icon="send" href="#">Sent</a>
  </nav>
</div>

<div data-mtx="drawer" id="doc-drawer-persistent" data-variant="persistent" data-absolute data-width="narrow" data-title="Persistent">
  <nav data-mtx="list" aria-label="Persistent navigation">
    <a data-mtx="list-item-button" data-icon="inbox" href="#">Inbox</a>
    <a data-mtx="list-item-button" data-icon="send" href="#">Sent</a>
  </nav>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="permanent (contained)" layout="row" >}}
<div data-mtx="drawer" data-variant="permanent" data-absolute data-width="220px" data-title="Permanent">
  <nav data-mtx="list" aria-label="Permanent navigation">
    <a data-mtx="list-item-button" data-icon="dashboard" href="#" data-selected>Overview</a>
    <a data-mtx="list-item-button" data-icon="shopping_cart" href="#">Orders</a>
    <a data-mtx="list-item-button" data-icon="people" href="#">Customers</a>
  </nav>
</div>
<p>Page content next to the permanent drawer.</p>
{{< /mtx-demo >}}

## Anchors

`data-anchor` sets the edge: `left` (default), `right`, `top` or `bottom`. Top and bottom drawers span the full width and fit their content (equivalent to a *bottom sheet*).

{{< mtx-demo title="Four edges" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-left">left</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-right">right</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-top">top</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-bottom">bottom</button>

<div data-mtx="drawer" id="doc-drawer-left" data-anchor="left" data-title="Left" data-padded="true">
  <p>Main navigation.</p>
</div>
<div data-mtx="drawer" id="doc-drawer-right" data-anchor="right" data-title="Details" data-padded="true">
  <p>Details or filters panel.</p>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-drawer-close>OK</button>
</div>
<div data-mtx="drawer" id="doc-drawer-top" data-anchor="top" data-title="Notice" data-padded="true">
  <p>Global notice dropping down from the top.</p>
</div>
<div data-mtx="drawer" id="doc-drawer-bottom" data-anchor="bottom" data-title="Share">
  <nav data-mtx="list" aria-label="Share">
    <a data-mtx="list-item-button" data-icon="mail" href="#">Email</a>
    <a data-mtx="list-item-button" data-icon="link" href="#">Copy link</a>
  </nav>
</div>
{{< /mtx-demo >}}

## Widths

Without `data-width` the width is responsive: `min(85vw, 320px)` below 600px, 280px from 600px and 300px from 900px. Side drawers never exceed 85% of the window, so part of the page always stays visible.

| `data-width` | Width | Variable |
|---|---|---|
| — | `min(85vw, 320px)` · 280px (≥ 600px) · 300px (≥ 900px) | `--mtx-drawer-width-mobile` · `--mtx-drawer-width-tablet` · `--mtx-drawer-width` |
| `narrow` | 200px | `--mtx-drawer-width-narrow` |
| `wide` | 360px | `--mtx-drawer-width-wide` |
| `full` (or `full-width`) | 100vw | — |
| CSS length (`450px`, `40vw`…) | The given value | written to `width` and `--mtx-drawer-width` |

{{< mtx-demo title="narrow, wide and custom length" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-narrow">narrow</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-wide">wide</button>
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-custom">450px</button>

<div data-mtx="drawer" id="doc-drawer-narrow" data-width="narrow" data-title="200px" data-padded="true"><p>Compact.</p></div>
<div data-mtx="drawer" id="doc-drawer-wide" data-width="wide" data-title="360px" data-padded="true"><p>For forms and filters.</p></div>
<div data-mtx="drawer" id="doc-drawer-custom" data-anchor="right" data-width="450px" data-title="450px" data-padded="true"><p>Arbitrary length.</p></div>
{{< /mtx-demo >}}

## Header and footer

- `data-title` creates a header with a title (`h3`) and a close button; `data-close-button="false"` omits the button (it's never generated in `permanent`).
- `data-user-name`, `data-user-email` and `data-user-avatar` create a user header with an [Avatar]({{< relref "/components/avatar" >}}) (the name's initial by default). It takes precedence over `data-title`.
- `data-footer-version` and `data-footer-action` create a fixed footer with a text and an `error`-colored text button that closes the drawer; `data-footer-action-icon` changes its icon (`logout` by default).
- `data-padded="true"` adds 20px of padding to the content, keeping the header and footer edge to edge.
- `data-header="temporary"` shows the generated header only while the drawer is temporary (useful in `responsive`). Any element can use the `mtx-drawer__temporary-only` / `mtx-drawer__permanent-only` classes for the same purpose.
- `data-subtitle` adds a subtitle stacked under the title (`mtx-drawer__heading`).

The header and footer stay fixed and only the middle section scrolls.

{{< mtx-demo title="User header, subheaders and footer" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-drawer-open="doc-drawer-user">Open account menu</button>

<div data-mtx="drawer" id="doc-drawer-user"
     data-user-name="Anna Garcia" data-user-email="anna@example.com" data-user-avatar="AG"
     data-footer-version="v0.1.0" data-footer-action="Log out" data-footer-action-icon="logout">
  <div data-mtx="list-subheader">General</div>
  <nav data-mtx="list" aria-label="General">
    <a data-mtx="list-item-button" data-icon="dashboard" href="#" data-selected>Dashboard</a>
    <a data-mtx="list-item-button" data-icon="mail" href="#">Messages</a>
  </nav>
  <div data-mtx="list-subheader">Settings</div>
  <nav data-mtx="list" aria-label="Settings">
    <a data-mtx="list-item-button" data-icon="tune" href="#">Preferences</a>
    <a data-mtx="list-item-button" data-icon="help_outline" href="#">Help</a>
  </nav>
</div>
{{< /mtx-demo >}}

## States

Besides open and closed, you can limit the implicit ways a temporary drawer closes:

- `data-disable-backdrop-click`: neither the backdrop nor an outside click closes it.
- `data-disable-escape`: <kbd>Escape</kbd> doesn't close it.
- `data-backdrop="false"` (or `data-hide-backdrop`): no backdrop; an outside click still closes it.

{{< mtx-demo title="Explicit close only" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-locked">Edit without saving</button>

<div data-mtx="drawer" id="doc-drawer-locked" data-title="Unsaved changes"
     data-disable-backdrop-click data-disable-escape data-close-button="false" data-padded="true">
  <p>Choose an option to close.</p>
  <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-drawer-close>Discard</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-drawer-close>Save</button>
</div>
{{< /mtx-demo >}}

## Declarative triggers

| Attribute | Where | Action |
|---|---|---|
| `data-mtx-drawer-open="id"` | Any element | Opens the `id` drawer. |
| `data-mtx-drawer-toggle="id"` | Any element | Toggles the `id` drawer (menu button). |
| `data-mtx-drawer-close="id"` | Any element | Closes the `id` drawer (reason `closeButtonClick`). |
| `data-mtx-drawer-close` (no value) | Inside the drawer | Closes the drawer that contains it. |
| `data-drawer-autofocus` | Inside the drawer | Element that receives focus on open (otherwise, the first focusable one). |

The `open` and `toggle` triggers get `aria-controls` and an `aria-expanded` that stays in sync as the drawer opens and closes. In a `responsive` drawer they also get `mtx-drawer-trigger--hidden` (`display: none`) while it is permanent. An [App Bar]({{< relref "/components/app-bar" >}}) with `data-start-icon` + `data-drawer="id"` generates this trigger for you.

## Clipped under the App Bar

In the *clipped* pattern the [App Bar]({{< relref "/components/app-bar" >}}) spans the full width and the drawer starts below it. `data-clipped` applies to `permanent`, `responsive` (in its permanent mode) and `persistent`: the drawer starts at `--mtx-app-bar-height` (56px on mobile, 64px from 600px) and stacks below the App Bar (`--mtx-z-index-app-bar` − 1). The temporary drawer ignores `clipped`: it's a modal (`--mtx-z-index-modal`) and covers the App Bar, as in MUI. The full-page recipe is in "App shell".

Inside a container, you get the same effect with a contained permanent drawer in the row below the App Bar:

{{< mtx-demo title="Continuous App Bar with a permanent drawer below" layout="block" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary">
  <span class="mtx-toolbar__title">My app</span>
</header>
<div class="mtx-d-flex">
  <div data-mtx="drawer" data-variant="permanent" data-absolute data-width="220px">
    <nav data-mtx="list" aria-label="Application">
      <a data-mtx="list-item-button" data-icon="dashboard" href="#" data-selected>Overview</a>
      <a data-mtx="list-item-button" data-icon="shopping_cart" href="#">Orders</a>
      <a data-mtx="list-item-button" data-icon="bar_chart" href="#">Reports</a>
    </nav>
  </div>
  <div class="mtx-flex-1 mtx-min-w-0 mtx-p-2">Main content</div>
</div>
{{< /mtx-demo >}}

## Responsive drawer

`data-variant="responsive"` replaces the old two-drawer pattern. The drawer watches `(min-width: <breakpoint>)` with `matchMedia` and, when crossing it:

- **to permanent**: releases the modal (backdrop, scroll lock, focus trap) if it was open, sets `role="navigation"` (unless you set your own `role`), removes `role="dialog"`/`aria-modal` from the panel and hides its triggers.
- **to temporary**: closes it, restores the panel's `role="dialog"` + `aria-modal="true"` (named by the drawer's `aria-label` or the header title), `aria-hidden="true"`, shows the triggers and, if focus was inside the drawer, moves it to the trigger.
- Fires `mtx:drawer:mode-change` with `{ mode, previousMode }`. The current mode is in `drawer.mode`.

```html
<div data-mtx="drawer" id="nav" data-variant="responsive" data-breakpoint="lg" aria-label="Main navigation">…</div>
```

Without `matchMedia` (SSR, tests) it behaves as temporary.

## Collapsible submenus

An item with `data-mtx-collapse-trigger="id"` and `aria-expanded` expands an `mtx-collapse` container with a nested list (`data-nested`, 48px indent). The `mtx-collapse-indicator` rotates 90° and `data-no-select` prevents the parent item from becoming selected.

{{< mtx-demo title="Navigation with collapsible sections" >}}
<button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-drawer-open="doc-drawer-nested">Open projects</button>

<div data-mtx="drawer" id="doc-drawer-nested" data-title="Projects">
  <nav data-mtx="list" aria-label="Projects">
    <a data-mtx="list-item-button" data-icon="dashboard" href="#" data-selected>Overview</a>
    <button type="button" data-mtx="list-item-button" data-icon="folder" data-no-select
            data-mtx-collapse-trigger="doc-drawer-sub" aria-expanded="false">
      My projects<span class="material-icons mtx-collapse-indicator" aria-hidden="true">chevron_right</span>
    </button>
    <div id="doc-drawer-sub" class="mtx-collapse" hidden>
      <div data-mtx="list" data-nested>
        <a data-mtx="list-item-button" data-icon="language" href="#">Website</a>
        <a data-mtx="list-item-button" data-icon="smartphone" href="#">Mobile app</a>
      </div>
    </div>
  </nav>
</div>
{{< /mtx-demo >}}

## Real-world examples

A filters panel on the right with a form in a [Grid]({{< relref "/components/grid" >}}):

{{< mtx-demo title="Filters" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" data-mtx-drawer-open="doc-drawer-filters">Filters</button>

<div data-mtx="drawer" id="doc-drawer-filters" data-anchor="right" data-width="wide" data-padded="true" data-title="Filters">
  <div data-mtx="grid" data-spacing="2">
    <div data-mtx="grid" data-xs="12"><input data-mtx="text-field" data-label="Search" data-variant="outlined" type="search"></div>
    <div data-mtx="grid" data-xs="6"><input data-mtx="text-field" data-label="Min. price" data-variant="outlined" type="number"></div>
    <div data-mtx="grid" data-xs="6"><input data-mtx="text-field" data-label="Max. price" data-variant="outlined" type="number"></div>
    <div data-mtx="grid" data-xs="12"><input type="checkbox" data-mtx="checkbox" data-label="In stock only" checked></div>
    <div data-mtx="grid" data-xs="12"><button class="mtx-button mtx-button--contained mtx-button--full-width" data-mtx="button" data-mtx-drawer-close>Apply</button></div>
  </div>
</div>
{{< /mtx-demo >}}

For a complete app layout (fixed App Bar, drawer with profile, submenus and footer, content in a grid) open the [dashboard template]({{< example-url "drawer/dashboard.html" >}}).

## Full BEM syntax

If the HTML already includes the header, content and footer, the component doesn't duplicate anything.

```html
<div class="mtx-drawer mtx-drawer--left mtx-drawer--wide" id="profile" data-mtx="drawer">
  <div class="mtx-drawer__header">
    <h3 class="mtx-drawer__title">Edit profile</h3>
    <button type="button" class="mtx-icon-button mtx-drawer__close" aria-label="Close" data-mtx-drawer-close>
      <span class="material-icons" aria-hidden="true">close</span>
    </button>
  </div>
  <div class="mtx-drawer__content mtx-drawer__content--padded">…</div>
  <div class="mtx-drawer__footer">
    <div class="mtx-drawer__footer-info">Draft saved</div>
    <div class="mtx-drawer__footer-actions">
      <button class="mtx-button mtx-button--text" data-mtx="button" data-mtx-drawer-close>Cancel</button>
      <button class="mtx-button mtx-button--contained" data-mtx="button" data-mtx-drawer-close>Save</button>
    </div>
  </div>
</div>
```

## Programmatic usage

```javascript
const drawer = Materix.getInstance(document.getElementById('profile'));

drawer.open();
drawer.close('saved');   // the reason arrives in event.detail.reason
drawer.toggle();
console.log(drawer.isOpen);

drawer.element.addEventListener('mtx:drawer:open', () => console.log('opened'));
drawer.element.addEventListener('mtx:drawer:close', (event) => {
  console.log(event.detail.reason); // backdropClick | escapeKeyDown | closeButtonClick | clickaway | programmatic | …
});
```

With ES modules:

```javascript
import { Drawer, getInstance } from 'materix-ui';
const drawer = new Drawer(document.getElementById('profile'));
```

{{< mtx-demo title="open(), close() and events" >}}
<button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-drawer-api-open">drawer.open()</button>
<span id="doc-drawer-api-status" aria-live="polite">No events</span>

<div data-mtx="drawer" id="doc-drawer-api" data-anchor="right" data-title="API" data-padded="true">
  <button class="mtx-button mtx-button--contained" data-mtx="button" id="doc-drawer-api-close">close('saved')</button>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-drawer-api');
  const drawer = Materix.getInstance(el);
  const status = document.getElementById('doc-drawer-api-status');
  document.getElementById('doc-drawer-api-open').addEventListener('click', (event) => {
    event.stopPropagation();
    drawer.open();
  });
  document.getElementById('doc-drawer-api-close').addEventListener('click', () => drawer.close('saved'));
  el.addEventListener('mtx:drawer:open', () => { status.textContent = 'mtx:drawer:open'; });
  el.addEventListener('mtx:drawer:close', (event) => { status.textContent = 'mtx:drawer:close · reason=' + event.detail.reason; });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-variant` | `temporary`, `persistent`, `permanent`, `responsive` | `temporary` | Drawer behavior. |
| `data-breakpoint` | `sm`, `md`, `lg`, `xl` | `md` | With `responsive`: width (600/900/1200/1536px) from which it is permanent. |
| `data-anchor` | `left`, `right`, `top`, `bottom` | `left` | Edge it appears from. |
| `data-width` | `narrow`, `wide`, `full`, `full-width` or a CSS length | responsive | Drawer width (see "Widths"). |
| `data-open` | boolean | — | Opens the drawer (temporary or persistent) on initialization. |
| `data-absolute` | boolean | — | Positions the drawer and backdrop inside the parent container; no `<body>` scroll lock. |
| `data-clipped` | boolean | — | In `permanent`, `responsive` and `persistent`: starts under the App Bar (`--mtx-app-bar-height`, 56/64px) and stacks below it. Ignored while temporary. |
| `data-elevation` | `0`–`24` | 16 (temporary) | `--mtx-elevation-{n}` shadow. |
| `data-title` | Text | — | Generates a header with a title and a close button. |
| `data-subtitle` | Text | — | Subtitle stacked below `data-title`. |
| `data-header` | `temporary` | — | Shows the generated header only in temporary mode. |
| `data-user-name` · `data-user-email` · `data-user-avatar` | Text | name initial | User header with avatar. |
| `data-close-button` | `false` | `true` | Omits the generated close button. |
| `data-footer-version` | Text | — | Informational footer text. |
| `data-footer-action` | Text | — | Footer button that closes the drawer. |
| `data-footer-action-icon` | Material Icons name | `logout` | Footer button icon. |
| `data-padded` | `true` | — | 20px padding on the content. |
| `data-backdrop` | `false` | `true` | No backdrop (also `data-hide-backdrop`). |
| `data-disable-backdrop-click` | boolean | — | Neither the backdrop nor an outside click closes the drawer. |
| `data-disable-escape` | boolean | — | <kbd>Escape</kbd> doesn't close it. |

The triggers (`data-mtx-drawer-open`, `-toggle`, `-close`, `data-drawer-autofocus` and `data-mtx-collapse-trigger`) are described in "Declarative triggers" and "Collapsible submenus".

### CSS classes

| Class | Description |
|---|---|
| `mtx-drawer` | Base block (`position: fixed`, flex column, `paper` background, elevation 16). |
| `mtx-drawer--left` / `--right` / `--top` / `--bottom` | Anchor. |
| `mtx-drawer--open` | Open state. |
| `mtx-drawer--animated` | Enables the transition after the first interaction (avoids animating on load). |
| `mtx-drawer--temporary` / `--persistent` / `--permanent` | Current mode (set by JS; in `responsive` it changes with the breakpoint). |
| `mtx-drawer--responsive` | Drawer with the `responsive` variant. |
| `mtx-drawer--narrow` / `--wide` / `--full-width` | 200px, 360px and 100vw widths. |
| `mtx-drawer--clipped` | Under the App Bar. |
| `mtx-drawer--absolute` | Positioned within the parent container. |
| `mtx-drawer--padded` | 20px padding on the content. |
| `mtx-drawer__header` · `__heading` · `__title` · `__subtitle` · `__close` | Fixed header and its parts (the close button is hidden while permanent). |
| `mtx-drawer__temporary-only` · `mtx-drawer__permanent-only` | Inner content visible only in that mode. |
| `mtx-drawer-trigger--hidden` | Added to the triggers of a `responsive` drawer while it is permanent. |
| `mtx-drawer__user` · `__user-avatar` · `__user-info` · `__user-name` · `__user-email` · `__user-role` | User header. |
| `mtx-drawer__content` · `mtx-drawer__content--padded` · `mtx-drawer__body` | Scrollable panel, a flex column (`mtx-mt-auto` pins a child to the bottom). |
| `mtx-drawer__footer` · `__footer--column` · `__footer-info` · `__footer-actions` | Fixed footer. |
| `mtx-drawer__backdrop` · `--open` · `--invisible` · `--absolute` | Backdrop. |
| `mtx-collapse` · `mtx-collapse--open` · `mtx-collapse-indicator` | Collapsible submenus. |

### Methods

| Method | Returns | Description |
|---|---|---|
| `open()` | `void` | Opens the drawer; in `temporary` it locks scrolling, traps focus and focuses the first element (or `[data-drawer-autofocus]`). |
| `close(reason = 'programmatic')` | `void` | Closes the drawer and returns focus to the previous element. Has no effect in `permanent`. |
| `toggle()` | `void` | Toggles open/closed. |
| `isOpen` (getter) | `boolean` | Open state (always `true` while permanent). |
| `mode` (property) | `string` | Current mode: `temporary`, `persistent` or `permanent`. |
| `syncTriggers()` | `void` | Re-syncs `aria-*` and visibility of triggers added later. |
| `destroy()` | `void` | Closes it, removes listeners and removes the backdrop. Unlinks the instance: `getInstance()` then returns `undefined`. |

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:drawer:open` | — | The drawer opens. |
| `mtx:drawer:close` | `{ reason }` | The drawer closes. `reason`: `backdropClick`, `escapeKeyDown`, `closeButtonClick`, `clickaway`, `programmatic` or the value passed to `close()`. |
| `mtx:drawer:mode-change` | `{ mode, previousMode }` | A `responsive` drawer crosses its breakpoint. |

Deprecated alias: `mtx:drawer:modechange` is still dispatched with the same `detail` until 1.0.

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-drawer-width-mobile` · `--mtx-drawer-width-tablet` · `--mtx-drawer-width` | Default width per breakpoint (`min(85vw, 320px)`, 280px, 300px). |
| `--mtx-drawer-width-narrow` · `--mtx-drawer-width-wide` | `narrow` (200px) and `wide` (360px) widths. |
| `--mtx-drawer-elevation` | Shadow of the temporary drawer (`--mtx-elevation-16`). |
| `--mtx-app-bar-height` | App Bar height for `clipped` (56px, 64px from 600px). |
| `--mtx-z-index-modal` · `--mtx-z-index-drawer` · `--mtx-z-index-app-bar` | Stacking: temporary 1300 (backdrop 1299), permanent 1200, clipped permanent 1099, App Bar 1100. |
| `--mtx-color-background-paper` · `--mtx-color-text-primary` · `--mtx-color-text-secondary` · `--mtx-color-divider` · `--mtx-color-action-active` | Surface, text, border and indicator colors. |
| `--mtx-type-h6` · `--mtx-type-body2` | Title and subtitle typography. |
| `--mtx-duration-standard` · `--mtx-duration-shorter` · `--mtx-easing-standard` | Opening and submenu animations. |

## Accessibility

- `temporary`: the inner panel gets `role="dialog"` and `aria-modal="true"`; focus is trapped inside and returns to the trigger on close. The trap always intercepts <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> and moves focus explicitly through the tabbable elements, so links are included even in WebKit/Safari (which skips them with Tab by default). `persistent` gets `role="region"` and `permanent` gets `role="navigation"`. The container keeps `aria-hidden` in sync.
- Give the content a name: a `<nav aria-label="…">` for navigation, or an `aria-label` on the drawer.
- The generated close button's `aria-label` comes from the i18n dictionary (`drawer.close`: "Close" / "Cerrar"), resolved with the language of the drawer or the page.
- `responsive`: the ARIA semantics switch with the mode (see "Responsive drawer") and focus is never left inside a hidden drawer.
- Declarative triggers get `aria-controls` and `aria-expanded`.
- Collapsed submenus (`mtx-collapse`) get `hidden` and `inert`, and an expanded submenu inherits the visibility of the drawer: inside a closed drawer (`aria-hidden="true"`) none of its links are focusable (axe `aria-hidden-focus`).
- The fixed root and its backdrop set `margin: 0`, so margins from page styles (e.g. `* + * { margin-top }`) never shift them.
- Respects `prefers-reduced-motion`: no opening or submenu transitions.

| Key | Action |
|---|---|
| <kbd>Enter</kbd> / <kbd>Space</kbd> on the trigger | Opens, closes or toggles the drawer. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the drawer's elements; in `temporary` focus doesn't leave it. |
| <kbd>Escape</kbd> | Closes the temporary drawer (unless `data-disable-escape` is set). |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on a collapsible item | Expands or collapses the submenu. |
