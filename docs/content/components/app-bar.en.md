---
title: "App Bar"
description: "Top bar with the title, navigation and primary actions of the current screen."
group: "surfaces"
icon: "view_headline"
weight: 10
example: "app-bar"
import: "AppBar, Toolbar, ToolbarTitle, ToolbarOffset"
mui: "https://mui.com/material-ui/react-app-bar/"
---

`AppBar` is the application's top bar: it displays the screen title, the navigation button and the most frequent actions inside a `Toolbar`. Use it once per screen as a header. To switch between views at the same level use [Tabs](../tabs/), for primary navigation combine it with a [Drawer](../drawer/), and for a floating primary action use a [Fab](../fab/).

```tsx
import { AppBar, Toolbar } from '@rubenchodev/materix-react';
// or just this component:
import { AppBar, Toolbar } from '@rubenchodev/materix-react/components/app-bar';
```

## Basic usage

`title`, `startIcon` and `endIcon` generate the `Toolbar`, the title and the [IconButtons](../icon-button/) (the equivalent of the vanilla single-element syntax). Any children are placed after the title. The bar is `fixed` by default; these demos use `position="static"` so it stays inside the page.

{{< react-demo id="app-bar/01-basic" layout="block" >}}

## Colors

`color` accepts `primary`, `secondary`, `default` (paper surface; the default value), `transparent` and `inherit`. `elevation` changes the shadow (4 by default); it is written to the `--mtx-app-bar-shadow` variable so `transparent` and `--flat` can cancel it. With `elevation={0}` the bar gets `mtx-app-bar--flat` and, in `default`, a single bottom divider instead of the shadow.

{{< react-demo id="app-bar/02-colors" layout="block" >}}

## Sizes

The regular Toolbar is 56px tall on mobile and 64px from 600px up, with 16 and 24px side gutters. `dense` reduces it to 48px and `toolbarVariant="prominent"` raises it to 128px with the title at the bottom. `disableGutters` removes the side gutters.

{{< react-demo id="app-bar/03-sizes" layout="block" >}}

## With and without icons

`startIcon` adds the navigation button (`.mtx-toolbar__navigation-icon`) and `endIcon` a trailing action; both accept a Material Icons name or a node. Set their accessible names with `startIconLabel` and `endIconLabel`; without them, the `menu` icon (or any start icon with `navigationControls`) is labeled "Open navigation" from the i18n dictionary (`appBar.openNavigation`) and other icons fall back to their name. For several actions write them as children and mark the title with `ToolbarTitle`. Inside the Toolbar, `text` and `outlined` [Buttons](../button/) and IconButtons inherit the bar color; `contained` buttons keep their own colors.

{{< react-demo id="app-bar/04-icons" layout="block" >}}

## Position

`position` defines how the bar behaves when the page scrolls.

| Value | Behavior |
|---|---|
| `fixed` (default) | Fixed to the top of the viewport (app bar `z-index`). Start the content with `<ToolbarOffset />` to reserve its height (56px, 64px from 600px; `dense` 48px). |
| `sticky` | Flows with the content and sticks to the top when it reaches it. |
| `static` | Part of the normal flow; scrolls with the page. |
| `absolute` | Anchored to the top of the positioned ancestor; with `bottom`, to the bottom. |
| `relative` | Relative position, no anchoring. |

`clipped` raises the `z-index` above a clipped Drawer. When the page has a `fixed` or `sticky` bar, the CSS adds `scroll-padding-top` to `<html>` so `#anchor` targets aren't hidden under it (tune it with `--mtx-scroll-padding-top`).
In the demo, the `fixed` bar is contained by a `transform` on its frame; on a real page it stays fixed to the window.

{{< react-demo id="app-bar/05-position" layout="block" >}}

## Menu and search

Actions open a [Menu](../menu/) with `useMenu()` (the equivalent of vanilla `data-open-menu`). For search, use the `.mtx-app-bar-search` pattern (40px tall, with `--grow`, `--right`, `--centered` and `--compact` modifiers) or a [TextField](../text-field/) with `variant="no-label"` and `size="small"`, which can shrink inside the Toolbar. Their fill, text and placeholder derive from the bar color, so they keep their contrast on `primary`, `secondary`, `default` and in the dark theme. Wrap the pattern with `role="search"` and give the input an `aria-label`.

{{< react-demo id="app-bar/06-menu-search" layout="block" >}}

## Scroll

`elevateOnScroll` starts without a shadow and applies the elevation on scroll; `hideOnScroll` hides the bar when scrolling down (past 50px) and shows it when scrolling up. The window is observed by default; `scrollTarget` accepts a ref, an element, a function or a CSS selector of the scrolling container. The calculation runs once per frame and the pending frame is canceled on unmount.

{{< react-demo id="app-bar/07-scroll" layout="block" >}}

## Responsive

The Toolbar changes height and gutters at 600px. For navigation, show text links on wide screens and an icon with a Menu on narrow ones, toggling them with the `mtx-d-md-none` / `mtx-d-md-flex` utilities.

{{< react-demo id="app-bar/08-responsive" layout="block" >}}

## With Drawer

In vanilla, `data-drawer="id"` turns the navigation button into the trigger of a Drawer. In React, `onNavigationClick` opens the [Drawer](../drawer/) and `navigationControls` / `navigationExpanded` keep `aria-controls` and `aria-expanded` in sync. For the full app shell (fixed bar + responsive clipped Drawer + `ToolbarOffset`), see the Drawer page.

{{< react-demo id="app-bar/09-drawer" layout="block" >}}

```tsx
const [open, setOpen] = useState(false);

<AppBar
  startIcon="menu"
  title="Dashboard"
  navigationControls="main-drawer"
  navigationExpanded={open}
  onNavigationClick={() => setOpen((value) => !value)}
/>
<Drawer id="main-drawer" open={open} onClose={() => setOpen(false)}>…</Drawer>;
```

## Grid layout

The bar takes 100% of its container width; the screen content is laid out below it with [Grid](../grid/).

{{< react-demo id="app-bar/10-grid" layout="block" >}}

## Programmatic usage

The vanilla `setColor()` and `setPosition()` methods become the `color` and `position` props; any change is a re-render. The vanilla bar emits no events.

{{< react-demo id="app-bar/11-programmatic" layout="block" >}}

## Composition with Toolbar

If the children include a `Toolbar`, no Toolbar is generated (the equivalent of the vanilla full BEM syntax): use it for several Toolbars, `prominent` bars or full control of the content.

{{< react-demo id="app-bar/12-composition" layout="block" >}}

## API reference

### AppBar

| Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `'fixed' \| 'sticky' \| 'static' \| 'absolute' \| 'relative'` | `'fixed'` | Positioning. |
| `color` | `'primary' \| 'secondary' \| 'default' \| 'transparent' \| 'inherit'` | `'default'` | Background and text color. |
| `elevation` | `number` (0–24) | CSS elevation 4 | Shadow via `--mtx-app-bar-shadow`; `0` adds `--flat`. |
| `elevateOnScroll` | `boolean` | `false` | No shadow at the top; elevation on scroll. |
| `hideOnScroll` | `boolean` | `false` | Hides on scroll down (past 50px) and reappears on scroll up. |
| `scrollTarget` | `RefObject \| HTMLElement \| Window \| (() => …) \| string` | `window` | Observed scrolling container. |
| `bottom` | `boolean` | `false` | Anchors the bar to the bottom (`fixed`/`absolute`). |
| `clipped` | `boolean` | `false` | `z-index` above the clipped Drawer. |
| `title` | `ReactNode` | — | Generated `.mtx-toolbar__title`. |
| `startIcon` | `ReactNode` | — | Navigation IconButton. |
| `startIconLabel` | `string` | "Open navigation" (`menu` or node) / icon name | `aria-label` of the navigation button. |
| `onNavigationClick` | `(event) => void` | — | Click on the navigation button (e.g. to open a Drawer). |
| `navigationControls` | `string` | — | `aria-controls` of the navigation button. |
| `navigationExpanded` | `boolean` | `false` | `aria-expanded` of the navigation button (with `navigationControls`). |
| `endIcon` | `ReactNode` | — | Trailing IconButton (after the children). |
| `endIconLabel` | `string` | icon name (node: "More options") | `aria-label` of the trailing button. |
| `onEndIconClick` | `(event) => void` | — | Click on the trailing button. |
| `dense` | `boolean` | `false` | 48px Toolbar. |
| `toolbarVariant` | `'regular' \| 'dense' \| 'prominent'` | `'regular'` | Height of the generated Toolbar. |
| `disableGutters` | `boolean` | `false` | Generated Toolbar without side gutters. |
| `component` | `ElementType` | `'header'` | Root element. |

`ref`, `className`, `style` and the remaining attributes go to the root.

### Toolbar, ToolbarTitle and ToolbarOffset

| Component | Props | Description |
|---|---|---|
| `Toolbar` | `variant` (`regular`, `dense`, `prominent`), `disableGutters`, `component` | `.mtx-toolbar` row. |
| `ToolbarTitle` | `component` (`span`) | `.mtx-toolbar__title`: fills the free space with an ellipsis. |
| `ToolbarOffset` | `dense` | `.mtx-toolbar-offset`: spacer as tall as a fixed bar. |

### Vanilla equivalence

| Vanilla | React |
|---|---|
| `data-position`, `setPosition()` | `position` |
| `data-color`, `setColor()` | `color` |
| `data-elevation` | `elevation` |
| `data-elevate-on-scroll`, `data-hide-on-scroll`, `data-scroll-target` | `elevateOnScroll`, `hideOnScroll`, `scrollTarget` |
| `data-title`, `data-start-icon`, `data-end-icon` | `title`, `startIcon`, `endIcon` |
| `data-start-icon-label`, `data-end-icon-label` | `startIconLabel`, `endIconLabel` |
| `data-drawer="id"` | `onNavigationClick` + `navigationControls` + `navigationExpanded` |
| `data-dense`, `.mtx-toolbar--prominent`, `.mtx-toolbar--disable-gutters` | `dense`, `toolbarVariant="prominent"`, `disableGutters` |
| `.mtx-app-bar--bottom`, `.mtx-app-bar--clipped` | `bottom`, `clipped` |
| Existing `.mtx-toolbar` (BEM syntax) | `Toolbar` child |

### CSS classes and variables

The same as the vanilla library: `mtx-app-bar` (`--fixed`, `--sticky`, `--static`, `--absolute`, `--relative`, `--primary`, `--secondary`, `--default`, `--transparent`, `--inherit`, `--flat`, `--bottom`, `--clipped`, `--hidden`, `--animated`), `mtx-toolbar` (`--dense`, `--prominent`, `--disable-gutters`, `__navigation-icon`, `__title`, `__spacer`), `mtx-toolbar-offset` (`--dense`) and `mtx-app-bar-search` (`--grow`, `--right`, `--centered`, `--compact`). `--animated` is added after the first painted frame so the initial color and elevation are not animated. Variables: `--mtx-app-bar-shadow`, `--mtx-app-bar-height`, `--mtx-scroll-padding-top`, `--mtx-app-bar-search-max-width`, `--mtx-z-index-app-bar` and `--mtx-toolbar-action-gap`.

## Accessibility

- The root is a `<header>`: it's the `banner` landmark when it sits at the top level of the page.
- Generated IconButtons always have an `aria-label` (`startIconLabel`/`endIconLabel`; by default the i18n "Open navigation" for `menu`, `navigationControls` or a node icon, "More options" for a trailing node icon, and otherwise the icon name) and their icons are `aria-hidden`. A node icon without a label logs a warning in development: set explicit labels for icons whose name isn't meaningful.
- With `navigationControls`, the navigation button exposes `aria-controls` and the `aria-expanded` you pass in `navigationExpanded`.
- Group navigation links in a `<nav aria-label="…">`. Transitions follow the token durations and are disabled with `prefers-reduced-motion`; with `hideOnScroll` the bar reappears when scrolling up.

| Key | Action |
|---|---|
| `Tab` | Moves through the bar's buttons and fields in visual order. |
| `Enter` / `Space` | Activates the focused button. |
