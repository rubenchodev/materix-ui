---
title: "Drawer"
description: "Side panel for navigation or supplementary content: temporary, persistent, permanent or responsive, with a generated header and footer and an app shell pattern."
group: "navigation"
icon: "menu_open"
weight: 10
example: "drawer"
import: "Drawer"
mui: "https://mui.com/material-ui/react-drawer/"
---

**Drawer** is a panel that slides in from an edge of the screen to show the app's navigation or supplementary content (filters, details, options), like MUI's `Drawer`. Use it for primary navigation on mobile (temporary) or as a fixed sidebar on desktop (permanent). For a decision or a short form that interrupts the flow use a Dialog; for a short list of actions on an item, a Menu.

```tsx
import { Drawer } from '@rubenchodev/materix-react/components/drawer';
// pieces for manual composition and the responsive hook:
import { DrawerHeader, DrawerContent, DrawerFooter, DrawerSubmenu, useDrawerMode } from '@rubenchodev/materix-react/components/drawer';
```

## Basic usage

`<Drawer open={…} onClose={…} title="…">` with the content directly inside. `title` generates the header with a title and a close button; the content is wrapped in the scrollable panel `.mtx-drawer__content`, and the temporary drawer adds a [Backdrop](../backdrop/). `open` is controlled: `onClose(event, reason)` asks to close and you update the state.

{{< react-demo id="drawer/01-basic" layout="block" >}}

## App shell: AppBar + responsive Drawer

The main recipe for an application: an [AppBar](../app-bar/), a row with a `variant="responsive"` drawer (temporary below `breakpoint`, permanent above it) and the main content. The AppBar connects to the drawer through its navigation button, the React equivalent of vanilla's `data-drawer="id"`:

- `navigationControls={drawerId}` sets `aria-controls` on the menu button,
- `navigationExpanded={open}` keeps `aria-expanded` in sync,
- `onNavigationClick` toggles the state,
- `useDrawerMode('responsive', 'md')` returns the current mode, so `startIcon={mode === 'temporary' ? 'menu' : undefined}` hides the button while the drawer is permanent (vanilla adds `.mtx-drawer-trigger--hidden`).

The drawer ignores clicks on its own trigger (any element with `aria-controls` pointing to its `id`), so the toggle doesn't close and reopen it. Here the shell lives inside a frame (`absolute`); on a full page use `clipped` and a [ToolbarOffset](../app-bar/) at the top of `<main>`.

{{< react-demo id="drawer/02-app-shell" layout="block" >}}

```tsx
const mode = useDrawerMode('responsive', 'md');
const [open, setOpen] = useState(false);

<AppBar
  position="fixed"
  clipped
  title="My app"
  startIcon={mode === 'temporary' ? 'menu' : undefined}
  navigationControls="app-nav"
  navigationExpanded={open}
  onNavigationClick={() => setOpen((value) => !value)}
/>
<div className="mtx-d-flex">
  <Drawer id="app-nav" variant="responsive" breakpoint="md" clipped width={240}
          title="My app" headerMode="temporary" aria-label="Main navigation"
          open={open} onClose={() => setOpen(false)}>
    <List component="nav" aria-label="Sections">…</List>
  </Drawer>
  <main className="mtx-flex-1 mtx-min-w-0">
    <ToolbarOffset />
    …
  </main>
</div>
```

## Variants

- `temporary` (default): modal over a backdrop. It locks the page scroll, traps focus, closes with <kbd>Escape</kbd>, the backdrop or a click outside, and is rendered in a portal on `document.body`.
- `persistent`: opens without a backdrop and the page stays usable; move the content yourself to make room for it.
- `permanent`: always visible, a fixed-width box in a flex row with a sticky panel of window height. It never asks to close.
- `responsive`: see "Responsive".

With `absolute` the drawer and its backdrop stay inside the positioned parent (no scroll lock), and the permanent drawer takes the container height.

{{< react-demo id="drawer/03-variants" layout="block" >}}

## Widths

Responsive default: `min(85vw, 320px)` on mobile, 280px from 600px and 300px from 900px. `width="narrow" | "wide" | "full"` sets 200px, 360px or 100vw; any number (px) or CSS length (`"40vw"`) is applied as is and also written to `--mtx-drawer-width`. It never exceeds 85% of the window except with `full`.

{{< react-demo id="drawer/04-widths" layout="block" >}}

## Anchors

`anchor="left" | "right" | "top" | "bottom"`. `right` is usually used for details or filters; `top` and `bottom` take the full width and fit their content (bottom sheet). Any element with `data-mtx-drawer-close` inside the drawer asks to close with reason `closeButtonClick`.

{{< react-demo id="drawer/05-anchors" layout="block" >}}

## Header and footer

Without a title the drawer only wraps the content (give it an `aria-label`). `title` and `subtitle` generate a text header; `userName`, `userEmail` and `userAvatar`, a user header with an [Avatar](../avatar/). `footerInfo` and `footerAction` (+ `footerActionIcon`, `onFooterActionClick`) create a fixed footer whose button also closes the drawer; the middle scrolls independently. `closeButton={false}` removes the X.

{{< react-demo id="drawer/06-header-footer" layout="block" >}}

## States

You can prevent implicit closing: `disableBackdropClick` (neither the backdrop nor a click outside closes it), `disableEscapeKeyDown` and `hideBackdrop` (no backdrop; a click outside still closes). The status line shows the `reason` received by `onClose`.

{{< react-demo id="drawer/07-states" layout="block" >}}

## Under the AppBar (clipped)

The AppBar spans the full width and the drawer starts below it. On a full page use `clipped` on a `permanent`, `responsive` or `persistent` drawer: it is placed at `--mtx-app-bar-height` (56px on mobile, 64px from 600px) and stacks under the AppBar (give the AppBar `clipped` too). The temporary drawer ignores `clipped`: it is modal and covers the AppBar, as in MUI. Inside a frame, as here, a permanent `absolute` drawer in the row under the AppBar achieves the same.

{{< react-demo id="drawer/08-clipped" layout="block" >}}

## Responsive

`variant="responsive"` with `breakpoint="sm" | "md" | "lg" | "xl"` (600, 900, 1200, 1536px; default `md`): below it the drawer is temporary and opens with its trigger; from it, permanent. When crossing the breakpoint, classes, ARIA, backdrop and focus are synced without animation, `onModeChange(mode, previousMode)` fires (vanilla `mtx:drawer:mode-change`), and an open temporary drawer asks to close with reason `breakpoint` so it doesn't reappear when going back to mobile. If focus was inside when it becomes temporary, it moves to the visible trigger. The responsive drawer stays mounted and in place (no portal), so its content keeps its state. `headerMode="temporary"` shows the generated header only while it is temporary. Resize the window.

{{< react-demo id="drawer/09-responsive" layout="block" >}}

## Collapsible submenus

`DrawerSubmenu` is the equivalent of vanilla's `data-mtx-collapse-trigger` + `.mtx-collapse`: a list item with `aria-expanded` and `aria-controls`, a `.mtx-collapse-indicator` that rotates 90°, and a nested [List](../list/) animated with `Collapse`. It works controlled (`open` + `onToggle`) or uncontrolled (`defaultOpen`). While collapsed its items are not focusable.

{{< react-demo id="drawer/10-submenus" layout="block" >}}

## Grid layout

A right drawer with `width="wide"` and `padded` containing a form laid out with [Grid](../grid/) and [TextField](../text-field/). `inputProps={{ 'data-drawer-autofocus': '' }}` gives the search field the initial focus (prefer it to `autoFocus`, which would steal the focus before the drawer records the trigger to return to). Buttons with `data-mtx-drawer-close` close it.

{{< react-demo id="drawer/11-grid" layout="block" >}}

## Programmatic usage

The equivalent of `open()`, `close(reason)`, `toggle()` and `isOpen` is the `open` prop. `onOpen` and `onClose(event, reason)` are the equivalents of `mtx:drawer:open` and `mtx:drawer:close`. The log shows the real callbacks: also try <kbd>Escape</kbd>, the backdrop and the X.

{{< react-demo id="drawer/12-programmatic" layout="block" >}}

## Manual BEM composition

With `DrawerHeader`, `DrawerContent` and `DrawerFooter` as children the drawer generates nothing: it places the header and footer outside the scrollable panel and adds the dialog semantics to `DrawerContent`. Name the panel with `aria-labelledby` (or `aria-label`) on the drawer.

{{< react-demo id="drawer/13-bem" layout="block" >}}

## API reference

### Drawer props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | `false` | Open state (controlled). Ignored in `permanent` mode, which is always open. |
| `onClose` | `(event, reason) => void` | — | Close request; `reason`: `backdropClick`, `escapeKeyDown`, `clickaway`, `closeButtonClick` or `breakpoint`. |
| `onOpen` | `() => void` | — | `open` goes from `false` to `true` (not on the initial render). |
| `variant` | `'temporary' \| 'persistent' \| 'permanent' \| 'responsive'` | `'temporary'` | Behavior. |
| `breakpoint` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Breakpoint of `responsive`. |
| `onModeChange` | `(mode, previousMode) => void` | — | The effective mode changed (`responsive`). |
| `anchor` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | Edge it slides from. |
| `width` | `'narrow' \| 'wide' \| 'full' \| number \| string` | — | Canonical width or any length. |
| `elevation` | `number` | — | Shadow `0`–`24`. |
| `clipped` | `boolean` | `false` | Below the AppBar (`permanent`, `persistent`, `responsive`). |
| `absolute` | `boolean` | `false` | Contained in the positioned parent (drawer and backdrop). |
| `title` · `subtitle` | `ReactNode` | — | Generated text header. |
| `userName` · `userEmail` · `userAvatar` | `ReactNode` | — | Generated user header (avatar defaults to the initial). |
| `closeButton` | `boolean` | `true` | Close button in the generated header (never in `permanent`). |
| `headerMode` | `'always' \| 'temporary'` | `'always'` | `temporary`: the header only shows while the drawer is temporary. |
| `footerInfo` · `footerAction` · `footerActionIcon` | `ReactNode` | — / — / `'logout'` | Generated footer. |
| `onFooterActionClick` | `(event) => void` | — | Click on the footer action (it also closes). |
| `padded` | `boolean` | `false` | 20px padding in the panel. |
| `contentProps` | `DrawerContentProps` | — | Props of the scrollable panel. |
| `hideBackdrop` | `boolean` | `false` | No backdrop in temporary mode. |
| `disableBackdropClick` | `boolean` | `false` | Neither the backdrop nor a click outside closes it. |
| `disableEscapeKeyDown` | `boolean` | `false` | Escape doesn't close it. |
| `keepMounted` | `boolean` | `false` | Keeps the closed temporary drawer in the DOM (`responsive` always does). |
| `backdropProps` | `Partial<BackdropProps>` | — | Extra props of the backdrop. |
| `disablePortal` | `boolean` | `false` | Renders the temporary drawer in place. |
| `container` | `Element \| ref \| () => Element` | `document.body` | Portal target. |

`className` is merged; `ref`, `id`, `role`, `style` and any other attribute go to the root `<div>`. A `padding` in `style` is moved to the panel so the header and footer stay edge to edge.

### Other exports

| Export | Description |
|---|---|
| `DrawerHeader` | `.mtx-drawer__header` for manual composition. |
| `DrawerContent` | `.mtx-drawer__content` (`padded`); inside a Drawer it marks the panel. |
| `DrawerFooter` | `.mtx-drawer__footer` (`column` stacks the content). |
| `DrawerSubmenu` | Collapsible submenu: `label`, `icon`, `open` / `defaultOpen`, `onToggle(open, event)`, `nested` (`true` or `2`), `id`, `buttonProps`. |
| `useDrawerMode(variant, breakpoint)` | Effective mode (`temporary`, `persistent` or `permanent`); listens to `matchMedia` in `responsive`. |
| `DRAWER_BREAKPOINTS` | `{ xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 }`. |

### Callbacks

| Callback | Vanilla event | Fired when |
|---|---|---|
| `onOpen()` | `mtx:drawer:open` | `open` goes from `false` to `true`. |
| `onClose(event, reason)` | `mtx:drawer:close` | Escape, backdrop, click outside, `[data-mtx-drawer-close]`, or the breakpoint asks to close. |
| `onModeChange(mode, previousMode)` | `mtx:drawer:mode-change` | `responsive` crosses its breakpoint. |

### CSS classes

| Class | Element |
|---|---|
| `.mtx-drawer` | Root. |
| `.mtx-drawer--left` · `--right` · `--top` · `--bottom` | Anchor. |
| `.mtx-drawer--temporary` · `--persistent` · `--permanent` · `--responsive` | Mode and variant. |
| `.mtx-drawer--open` · `--animated` | Open state and slide transition. |
| `.mtx-drawer--narrow` · `--wide` · `--full-width` | Widths. |
| `.mtx-drawer--clipped` · `--absolute` | Under the AppBar / contained. |
| `.mtx-drawer__header` · `__heading` · `__title` · `__subtitle` · `__close` | Generated header. |
| `.mtx-drawer__user` · `__user-avatar` · `__user-info` · `__user-name` · `__user-email` | User header. |
| `.mtx-drawer__content` · `__content--padded` | Scrollable panel. |
| `.mtx-drawer__footer` · `__footer-info` · `__footer-actions` · `__footer--column` | Footer. |
| `.mtx-drawer__temporary-only` · `__permanent-only` | Content shown only in one mode. |
| `.mtx-collapse-indicator` | Submenu indicator (rotates with `aria-expanded="true"`). |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-drawer-width-mobile` · `--mtx-drawer-width-tablet` · `--mtx-drawer-width` | Default width per breakpoint (`min(85vw, 320px)`, 280px, 300px). |
| `--mtx-drawer-width-narrow` · `--mtx-drawer-width-wide` | `narrow` (200px) and `wide` (360px). |
| `--mtx-drawer-elevation` | Shadow of the temporary drawer (`--mtx-elevation-16`). |
| `--mtx-app-bar-height` | AppBar height for `clipped` (56px, 64px from 600px). |
| `--mtx-z-index-modal` · `--mtx-z-index-drawer` · `--mtx-z-index-app-bar` | Stacking: temporary 1300 (backdrop 1299), permanent 1200, clipped permanent 1099, AppBar 1100. |
| `--mtx-duration-standard` · `--mtx-easing-standard` | Slide (300ms) and submenu indicator. |

## Accessibility

- `temporary`: the panel gets `role="dialog"`, `aria-modal="true"` and `tabindex="-1"`, named by the generated title or the drawer's `aria-label` / `aria-labelledby`. Focus moves to the first element (or the one marked with `data-drawer-autofocus`), <kbd>Tab</kbd> stays inside and focus returns to the trigger on close. `persistent` gets `role="region"` and `permanent` `role="navigation"` (unless you pass `role`). The root keeps `aria-hidden` in sync.
- Give the content a name: a `<List component="nav" aria-label="…">` for navigation, or an `aria-label` on the drawer.
- The generated close button's `aria-label` comes from the i18n dictionary (`drawer.close`: "Close" / "Cerrar").
- Connect the trigger with `aria-controls` and `aria-expanded` (the AppBar does it with `navigationControls` and `navigationExpanded`).
- Escape goes through the shared layer stack: a Menu or Popover opened inside the drawer closes first.
- Respects `prefers-reduced-motion`: no slide or submenu transitions.

| Key | Action |
|---|---|
| <kbd>Enter</kbd> / <kbd>Space</kbd> on the trigger | Opens or closes the drawer. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the drawer; in `temporary` focus doesn't leave it. |
| <kbd>Escape</kbd> | Closes the temporary drawer (unless `disableEscapeKeyDown`). |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on a submenu | Expands or collapses it. |

## Vanilla equivalence

| Vanilla | React |
|---|---|
| `data-mtx="drawer"` + `open()` / `close()` / `toggle()` / `isOpen` | `<Drawer open={…} onClose={…}>` |
| `data-open` | initial `open={true}` |
| `data-variant`, `data-anchor`, `data-breakpoint` | `variant`, `anchor`, `breakpoint` |
| `data-width`, `data-elevation` | `width`, `elevation` |
| `data-clipped`, `data-absolute`, `data-padded` | `clipped`, `absolute`, `padded` |
| `data-title`, `data-subtitle`, `data-close-button="false"` | `title`, `subtitle`, `closeButton={false}` |
| `data-user-name`, `data-user-email`, `data-user-avatar` | `userName`, `userEmail`, `userAvatar` |
| `data-footer-version`, `data-footer-action`, `data-footer-action-icon` | `footerInfo`, `footerAction`, `footerActionIcon` |
| `data-header="temporary"` | `headerMode="temporary"` |
| `data-backdrop="false"` / `data-hide-backdrop` | `hideBackdrop` |
| `data-disable-backdrop-click`, `data-disable-escape` | `disableBackdropClick`, `disableEscapeKeyDown` |
| `data-mtx-drawer-open` / `-toggle="id"` | a button that sets the state (with `aria-controls`) |
| `data-mtx-drawer-close` | same attribute inside the drawer |
| AppBar `data-drawer="id"` | AppBar `navigationControls`, `navigationExpanded`, `onNavigationClick` |
| `data-mtx-collapse-trigger` + `.mtx-collapse` | `DrawerSubmenu` |
| `instance.mode` | `useDrawerMode(variant, breakpoint)` |
| `mtx:drawer:open` / `close` / `mode-change` | `onOpen` / `onClose` / `onModeChange` |
