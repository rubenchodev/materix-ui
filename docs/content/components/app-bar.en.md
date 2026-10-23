---
title: "App Bar"
description: "Top bar with the title, navigation and primary actions of the current screen."
group: "surfaces"
icon: "view_headline"
weight: 10
example: "app-bar"
mui: "https://mui.com/material-ui/react-app-bar/"
---

**App Bar** is the application's top bar: it displays the screen title, the navigation button and the most frequent actions inside a **Toolbar**. Use it once per screen as a header. To switch between views at the same level use [Tabs]({{< relref "/components/tabs" >}}), for primary navigation combine it with a [Drawer]({{< relref "/components/drawer" >}}), and for a floating primary action use a [Fab]({{< relref "/components/fab" >}}).

## Basic usage

A `<header data-mtx="app-bar">` with `data-title`, `data-start-icon` and `data-end-icon` generates the `.mtx-toolbar`, the title and the IconButtons. Any children you write are placed after the title. The bar is `fixed` by default; these demos use `data-position="static"` so it stays inside the page.

{{< mtx-demo title="Simplified syntax" layout="block" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary" data-title="News" data-start-icon="menu">
  <button class="mtx-button mtx-button--text" data-mtx="button">Login</button>
</header>
{{< /mtx-demo >}}

## Colors

`data-color` accepts `primary`, `secondary`, `default` (paper surface; the value used when none is set), `transparent` and `inherit`. `data-elevation` changes the shadow (4 by default). With `data-elevation="0"` the bar gets `mtx-app-bar--flat` and, in `default`, a single bottom divider instead of the shadow. `transparent` never has a shadow. Colors derive from the bar's contrast color, so they stay correct in the dark theme (where `primary` is light with dark text).

{{< mtx-demo title="Colors" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <header data-mtx="app-bar" data-position="static" data-color="primary" data-title="Primary" data-start-icon="menu"></header>
  <header data-mtx="app-bar" data-position="static" data-color="secondary" data-title="Secondary" data-start-icon="menu"></header>
  <header data-mtx="app-bar" data-position="static" data-color="default" data-title="Default" data-start-icon="menu"></header>
  <header data-mtx="app-bar" data-position="static" data-color="transparent" data-elevation="0" data-title="Transparent" data-start-icon="menu"></header>
</div>
{{< /mtx-demo >}}

## Sizes

The regular Toolbar is 56 px tall on mobile and 64 px from 600 px up, with 16 and 24 px side gutters. `data-dense` reduces it to 48 px. The `prominent` variant (128 px) is only available with the BEM syntax (`.mtx-toolbar--prominent`).

{{< mtx-demo title="Regular and dense" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <header data-mtx="app-bar" data-position="static" data-color="primary" data-title="Regular" data-start-icon="menu" data-end-icon="search"></header>
  <header data-mtx="app-bar" data-position="static" data-color="primary" data-dense data-title="Dense" data-start-icon="menu" data-end-icon="search"></header>
</div>
{{< /mtx-demo >}}

## With icons

`data-start-icon` adds the navigation button (`.mtx-toolbar__navigation-icon`) and `data-end-icon` a trailing action. Set their accessible names with `data-start-icon-label` and `data-end-icon-label`; without them, the `menu` icon (or any start icon with `data-drawer`) is labeled "Open navigation" from the i18n dictionary and other icons fall back to their name. With `data-drawer="id"` the navigation button toggles that [Drawer]({{< relref "/components/drawer" >}}). For multiple actions write the buttons yourself as children (mark the title with `.mtx-toolbar__title`).

{{< mtx-demo title="Start/end icon and custom buttons" layout="block" >}}
<div class="mtx-stack mtx-stack--col mtx-stack--spacing-2">
  <header data-mtx="app-bar" data-position="static" data-color="primary" data-title="Start and end" data-start-icon="arrow_back" data-end-icon="account_circle"></header>
  <header data-mtx="app-bar" data-position="static" data-color="primary">
    <button class="mtx-toolbar__navigation-icon" data-mtx="icon-button" data-icon="menu" aria-label="Open navigation"></button>
    <span class="mtx-toolbar__title">Photos</span>
    <button data-mtx="icon-button" data-icon="search" aria-label="Search"></button>
    <button data-mtx="icon-button" data-icon="more_vert" aria-label="More options"></button>
  </header>
</div>
{{< /mtx-demo >}}

### Buttons in the bar

Inside the Toolbar, `text` and `outlined` [Buttons]({{< relref "/components/button" >}}) and Icon Buttons inherit the bar color (like `color="inherit"` in MUI), so they read well on `primary`, `secondary` and `default` without extra classes. `contained` buttons keep their background/contrast pair: pick a color that stands out on the bar (e.g. `data-color="secondary"` on a `primary` bar). Disabled buttons keep their state color.

{{< mtx-demo title="Text, outlined and contained on a primary bar" layout="block" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary" data-title="Materix">
  <div class="mtx-d-flex mtx-align-items-center mtx-gap-1">
    <button class="mtx-button mtx-button--text mtx-d-none mtx-d-sm-inline-flex" data-mtx="button">Docs</button>
    <button class="mtx-button mtx-button--outlined" data-mtx="button">Login</button>
    <button class="mtx-button mtx-button--contained" data-mtx="button" data-color="secondary" data-start-icon="rocket_launch">Get started</button>
  </div>
</header>
{{< /mtx-demo >}}

## Position

`data-position` defines how the bar behaves when the page scrolls.

| Value | Behavior |
|---|---|
| `fixed` (default) | Fixed to the top of the viewport (app bar `z-index`). Start the content with `<div class="mtx-toolbar-offset"></div>` to reserve its height (56px, 64px from 600px; `--dense` 48px). |
| `sticky` | Flows with the content and sticks to the top when it reaches it. |
| `static` | Part of the normal flow; scrolls with the page. |
| `absolute` | Anchored to the top of the positioned ancestor; with `.mtx-app-bar--bottom`, to the bottom. |
| `relative` | Relative position, no anchoring. |

{{< mtx-demo title="Sticky inside a scrolling container" layout="block" >}}
<div style="height: 220px; overflow-y: auto; border: 1px solid var(--mtx-color-divider);">
  <p class="mtx-p-2">This paragraph sits above the bar. Scroll the container.</p>
  <header data-mtx="app-bar" data-position="sticky" data-color="secondary" data-title="Sticky"></header>
  <div class="mtx-p-2">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  </div>
</div>
{{< /mtx-demo >}}

### Anchors under the bar

When the page has a `fixed` or `sticky` App Bar, `<html>` automatically gets `scroll-padding-top: var(--mtx-app-bar-height)` (48px when the only Toolbar is `dense`): following an `#anchor` link or moving focus with Tab stops the target below the bar instead of hiding it. Tune the value with `--mtx-scroll-padding-top` (e.g. `<html style="--mtx-scroll-padding-top: 120px">` when there's a second bar) or turn it off with `<html data-mtx-scroll-padding="false">`. For specific targets there's the `mtx-scroll-mt-app-bar` utility, and `mtx-scroll-smooth` on `<html>` enables smooth scrolling while respecting `prefers-reduced-motion` (see [Utilities]({{< relref "/guide/utilities" >}})).

```html
<html class="mtx-scroll-smooth">
<body>
  <header data-mtx="app-bar" data-position="sticky" data-title="Landing">
    <a class="mtx-button mtx-button--text" data-mtx="button" href="#pricing">Pricing</a>
  </header>
  …
  <section id="pricing">…</section> <!-- not hidden under the bar -->
```

## Scroll

`data-elevate-on-scroll` starts without a shadow and applies the elevation on scroll; `data-hide-on-scroll` hides the bar when scrolling down (past 50 px) and shows it when scrolling up. `data-scroll-target` sets the selector of the observed container (the window by default).

{{< mtx-demo title="Hide on scroll inside a container" layout="block" >}}
<div id="doc-app-bar-scroll" style="height: 220px; overflow-y: auto; border: 1px solid var(--mtx-color-divider);">
  <header data-mtx="app-bar" data-position="sticky" data-color="primary" data-hide-on-scroll data-scroll-target="#doc-app-bar-scroll" data-title="Hides on scroll down" data-start-icon="menu"></header>
  <div class="mtx-p-2">
    <p>Scroll down to hide the bar; scroll up to bring it back.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
  </div>
</div>
{{< /mtx-demo >}}

```html
<!-- Full page: the bar observes the window -->
<header data-mtx="app-bar" data-color="default" data-elevate-on-scroll data-title="My app"></header>
```

## Menu and search

Actions can open a [Menu]({{< relref "/components/menu" >}}) with `data-open-menu="#id"`. For search, use the `.mtx-app-bar-search` pattern (40 px tall, with `--grow`, `--right`, `--centered` and `--compact` modifiers) or a [TextField]({{< relref "/components/text-field" >}}) with `data-variant="no-label"` and `data-size="small"` (it can shrink inside the Toolbar). Its fill, text and placeholder derive from the bar's color (`currentColor`), so they keep their contrast on `primary`, `secondary`, `default` and in the dark theme. `--grow` takes the free space up to `--mtx-app-bar-search-max-width` (560px) and doesn't change width on focus.

{{< mtx-demo title="Account menu and search" layout="block" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary">
  <button class="mtx-toolbar__navigation-icon" data-mtx="icon-button" data-icon="menu" aria-label="Open navigation"></button>
  <span class="mtx-toolbar__title">Dashboard</span>
  <div class="mtx-app-bar-search mtx-app-bar-search--right">
    <span class="material-icons" aria-hidden="true">search</span>
    <input type="search" placeholder="Search…" aria-label="Search" />
  </div>
  <button data-mtx="icon-button" data-icon="account_circle" aria-label="User account" data-open-menu="#doc-app-bar-menu"></button>
</header>
<div data-mtx="menu" id="doc-app-bar-menu">
  <div data-mtx="menu-item" data-icon="person">Profile</div>
  <div data-mtx="menu-item" data-icon="logout">Log out</div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Search that grows (--grow)" layout="column" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary" data-start-icon="menu" data-title="Orders">
  <div class="mtx-app-bar-search mtx-app-bar-search--grow" role="search">
    <span class="material-icons" aria-hidden="true">search</span>
    <input type="search" placeholder="Search orders or customers…" aria-label="Search orders or customers" />
  </div>
  <button data-mtx="icon-button" data-icon="notifications" aria-label="Notifications"></button>
</header>
<header data-mtx="app-bar" data-position="static" data-color="default" data-elevation="0" data-start-icon="menu" data-title="Files">
  <div class="mtx-app-bar-search mtx-app-bar-search--grow" role="search">
    <span class="material-icons" aria-hidden="true">search</span>
    <input type="search" placeholder="Search in Drive" aria-label="Search in Drive" />
  </div>
  <button data-mtx="icon-button" data-icon="settings" aria-label="Settings"></button>
</header>
{{< /mtx-demo >}}

## Real-world examples

### Bar with a navigation Drawer

With `data-drawer="id"` the generated navigation button toggles a [Drawer]({{< relref "/components/drawer" >}}) (the same as writing a button with `data-mtx-drawer-toggle="id"`), no JavaScript needed.

{{< mtx-demo title="App Bar + Drawer" layout="block" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary" data-start-icon="menu" data-drawer="doc-app-bar-drawer" data-title="Dashboard with Drawer">
  <button data-mtx="icon-button" data-icon="notifications" aria-label="Notifications"></button>
</header>
<div data-mtx="drawer" id="doc-app-bar-drawer" data-anchor="left" data-title="Dashboard">
  <ul data-mtx="list" aria-label="Main navigation">
    <li data-mtx="list-item-button" data-icon="dashboard">Overview</li>
    <li data-mtx="list-item-button" data-icon="analytics">Analytics</li>
    <li data-mtx="list-item-button" data-icon="settings">Settings</li>
  </ul>
</div>
{{< /mtx-demo >}}

### App shell

For a full application layout — `fixed` App Bar + `responsive` and `clipped` Drawer (temporary on mobile, permanent on desktop) + `.mtx-toolbar-offset` + `<main>` — follow the [App shell recipe]({{< relref "/components/drawer" >}}#app-shell-responsive-layout) of the Drawer. It needs no CSS of your own.

### Responsive navigation

Show text links on wide screens and an icon with a Menu on narrow ones, toggling them with your own visibility classes (the live example at `/examples/app-bar` shows the complete version).

```html
<header data-mtx="app-bar" data-position="static" data-color="primary">
  <span class="nav-mobile">
    <button class="mtx-toolbar__navigation-icon" data-mtx="icon-button" data-icon="menu"
            aria-label="Open navigation" data-open-menu="#nav-menu"></button>
  </span>
  <span class="mtx-toolbar__title">LOGO</span>
  <nav class="nav-desktop" aria-label="Sections">
    <button class="mtx-button mtx-button--text" data-mtx="button">Products</button>
    <button class="mtx-button mtx-button--text" data-mtx="button">Pricing</button>
  </nav>
</header>
```

## Full BEM syntax

If the bar already contains a `.mtx-toolbar`, it isn't auto-scaffolded: write the position and color classes yourself. This is the way to get variants that have no attribute, such as `prominent`, multiple Toolbars or a bottom bar.

```html
<header class="mtx-app-bar mtx-app-bar--static mtx-app-bar--primary" data-mtx="app-bar">
  <div class="mtx-toolbar mtx-toolbar--prominent">
    <button class="mtx-icon-button mtx-toolbar__navigation-icon" data-mtx="icon-button" aria-label="Open navigation">
      <span class="material-icons" aria-hidden="true">menu</span>
    </button>
    <span class="mtx-toolbar__title">Prominent title</span>
    <button class="mtx-icon-button" data-mtx="icon-button" aria-label="Search">
      <span class="material-icons" aria-hidden="true">search</span>
    </button>
  </div>
</header>

<!-- Bottom bar inside a positioned container -->
<header class="mtx-app-bar mtx-app-bar--absolute mtx-app-bar--bottom mtx-app-bar--primary" data-mtx="app-bar">
  <div class="mtx-toolbar">...</div>
</header>
```

## Programmatic usage

Bars initialize when the page loads. The instance exposes `setColor()` and `setPosition()`; it doesn't emit events.

```javascript
// UMD (window.Materix)
const el = document.querySelector('#app-bar');
const appBar = Materix.getInstance(el);   // or: new Materix.AppBar(el)
appBar.setColor('secondary');
appBar.setPosition('sticky');
appBar.destroy();                         // removes the scroll listener and unlinks the instance
```

```javascript
// ES modules
import { AppBar } from '@rubenchodev/materix-ui';
const appBar = new AppBar(document.querySelector('header'));
```

{{< mtx-demo title="setColor()" layout="block" >}}
<header data-mtx="app-bar" data-position="static" data-color="primary" data-title="Dynamic bar" id="doc-app-bar-api"></header>
<div class="mtx-stack mtx-stack--row mtx-stack--spacing-1 mtx-mt-2" style="flex-wrap: wrap;">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-color="primary">primary</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-color="secondary">secondary</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-color="default">default</button>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-app-bar-api');
  if (!el) return;
  document.querySelectorAll('[data-doc-color]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      Materix.getInstance(el).setColor(btn.getAttribute('data-doc-color'));
    });
  });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `app-bar` | — | Initializes the component. |
| `data-title` | text | — | Generates `.mtx-toolbar__title` (only when there's no existing `.mtx-toolbar`). |
| `data-start-icon` | Material Icon name | — | Navigation IconButton at the start. |
| `data-end-icon` | Material Icon name | — | IconButton at the end (after the children). |
| `data-start-icon-label` · `data-end-icon-label` | text | "Open navigation" (`menu`) / icon name | `aria-label` of the generated IconButtons. |
| `data-drawer` | Drawer `id` | — | The generated navigation button toggles that Drawer (`data-mtx-drawer-toggle`, `aria-controls`, `aria-expanded`). |
| `data-dense` | boolean (presence) | absent | 48 px dense Toolbar. |
| `data-position` | `fixed` \| `sticky` \| `static` \| `absolute` \| `relative` | `fixed` | Positioning. |
| `data-color` | `primary` \| `secondary` \| `default` \| `transparent` \| `inherit` | `default` | Background and text color. |
| `data-elevation` | `0`–`8`, `12`, `16`, `24` | `4` | Shadow, written to the `--mtx-app-bar-shadow` variable (so `--transparent` and `--flat` can cancel it). `0` adds `--flat`. |
| `data-elevate-on-scroll` | boolean (presence) | absent | No shadow at the top; elevation on scroll. |
| `data-hide-on-scroll` | boolean (presence) | absent | Hides on scroll down and reappears on scroll up. |
| `data-scroll-target` | CSS selector | window | Container whose scroll is observed. |

### CSS classes

| Class | Description |
|---|---|
| `.mtx-app-bar` | Full-width flex column container. |
| `.mtx-app-bar--fixed` / `--sticky` / `--static` / `--absolute` / `--relative` | Position. |
| `.mtx-app-bar--primary` / `--secondary` / `--default` / `--transparent` / `--inherit` | Color. |
| `.mtx-app-bar--bottom` | Anchors the bar to the bottom (with `fixed` or `absolute`). |
| `.mtx-app-bar--hidden` | Translated out of view (used by `hide-on-scroll`). |
| `.mtx-app-bar--animated` | Enables the shadow, color and hide transitions. JavaScript adds it after the first painted frame so the initial color, theme and elevation are not animated on load. |
| `.mtx-app-bar--clipped` | `z-index` above the clipped Drawer. |
| `.mtx-app-bar--flat` / `--elevation-0` | No shadow; in `default`, a single bottom divider. |
| `.mtx-toolbar` | 56/64 px row with 16/24 px gutters. |
| `.mtx-toolbar--dense` | 48 px tall. |
| `.mtx-toolbar--prominent` | 128 px, title aligned to the bottom. |
| `.mtx-toolbar--disable-gutters` | No side gutters. |
| `.mtx-toolbar__navigation-icon` | Navigation button (−12 px / 16 px margin). |
| `.mtx-toolbar__title` | h6 title that fills the free space, with an ellipsis. |
| `.mtx-toolbar__spacer` | Flexible spacer. |
| `.mtx-app-bar-search` | 40 px search field; `--grow` (fills the free space, max 560px, no width jump on focus), `--right`, `--centered`, `--compact` modifiers. |
| `.mtx-toolbar-offset` · `--dense` | Spacer as tall as the fixed App Bar (56px, 64px from 600px; dense 48px). |

### Methods

| Method | Returns | Description |
|---|---|---|
| `setColor(color)` | `void` | Replaces the color class (`primary`, `secondary`, `default`, `transparent`, `inherit`). |
| `setPosition(position)` | `void` | Replaces the position class (`fixed`, `static`, `sticky`, `absolute`, `relative`). |
| `destroy()` | `void` | Removes the scroll listener, cancels pending frames and unlinks the instance from the registry. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-primary` / `--mtx-color-primary-contrast` | `primary` color. |
| `--mtx-color-secondary` / `--mtx-color-secondary-contrast` | `secondary` color. |
| `--mtx-color-background-paper` / `--mtx-color-text-primary` / `--mtx-color-divider` | `default` color. |
| `--mtx-elevation-{n}` · `--mtx-app-bar-shadow` | Shadow (the variable is set by `data-elevation` and elevate-on-scroll). |
| `--mtx-app-bar-height` | Height used by `.mtx-toolbar-offset` and the clipped Drawer (56px, 64px from 600px). |
| `--mtx-scroll-padding-top` | Overrides the automatic `scroll-padding-top` on `<html>` with a fixed/sticky App Bar (defaults to `--mtx-app-bar-height`). |
| `--mtx-app-bar-search-max-width` | Maximum width of `.mtx-app-bar-search--grow` (560px). |
| `--mtx-z-index-app-bar` / `--mtx-z-index-drawer` | Stacking (1100; `--clipped` uses drawer + 1). |
| `--mtx-spacing-2` / `--mtx-spacing-3` | Toolbar gutters. |
| `--mtx-toolbar-action-gap` | Space between consecutive actions placed directly in the Toolbar (IconButton, Button, Avatar, Badge, ToggleButton). Default `--mtx-spacing-1` (8px), so icons, badges and the avatar don't touch. Use `0` for MUI's flush icon buttons. |
| `--mtx-duration-standard` / `--mtx-easing-standard` | Shadow, color and hide transitions (only with `mtx-app-bar--animated`; none with `prefers-reduced-motion`). |

## Accessibility

- Use `<header>` as the root: it's the `banner` landmark when it sits at the top level of the page.
- IconButtons generated by `data-start-icon`/`data-end-icon` take their `aria-label` from `data-start-icon-label`/`data-end-icon-label`; by default the `menu` icon is "Open navigation" (i18n, `appBar.openNavigation`) and other icons use their name, so always set a label for them. Their icons are `aria-hidden`.
- With `data-drawer`, the navigation button exposes `aria-controls` and an `aria-expanded` kept in sync by the Drawer.
- `.mtx-app-bar-search` shows a 2px focus ring when its field receives keyboard focus; wrap it with `role="search"` and give the input an `aria-label`.
- Group navigation links in a `<nav aria-label="…">`.
- Transitions follow the token durations; with `hide-on-scroll` the bar reappears when scrolling up, so navigation never becomes inaccessible.

| Key | Action |
|---|---|
| `Tab` | Moves through the bar's buttons and fields in visual order. |
| `Enter` / `Space` | Activates the focused button (opens the Menu or the Drawer). |
