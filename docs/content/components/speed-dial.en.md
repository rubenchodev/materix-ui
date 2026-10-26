---
title: "Speed Dial"
description: "Floating action button that reveals three to six related, labeled actions in four directions, on click or on hover."
group: "navigation"
icon: "touch_app"
weight: 50
example: "speed-dial"
import: "SpeedDial, SpeedDialAction, SpeedDialIcon"
mui: "https://mui.com/material-ui/react-speed-dial/"
---

`SpeedDial` is a primary [Fab](../fab/) that, when pressed, reveals several secondary actions as small labeled FABs, just like MUI's `SpeedDial`. Use it when a screen's primary action has three to six related variants (create document, spreadsheet, presentation). If there is only one action, use a `Fab`; if there are many options or they are not creation actions, use a [Menu](../menu/).

```tsx
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@rubenchodev/materix-react';
// or only this component:
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@rubenchodev/materix-react/components/speed-dial';
```

## Basic usage

`ariaLabel` names the primary FAB and each `SpeedDialAction` takes an `icon` and a `tooltipTitle`. The component renders the FAB, the actions container and the labels.

{{< react-demo "speed-dial/01-basic" >}}

```tsx
<SpeedDial ariaLabel="Create">
  <SpeedDialAction icon="description" tooltipTitle="Document" />
  <SpeedDialAction icon="table_chart" tooltipTitle="Spreadsheet" />
  <SpeedDialAction icon="slideshow" tooltipTitle="Presentation" />
</SpeedDial>
```

{{< callout type="warning" title="Accessible name for each action" >}}
`tooltipTitle` creates the visible label and, if the action has no `aria-label`, is also used as its `aria-label`, so icon-only actions always have an accessible name. If `tooltipTitle` is not a string, pass `aria-label` yourself.
{{< /callout >}}

When closed, the actions are invisible but still take up their space in the layout flow, as in MUI: place the SpeedDial in a corner with absolute or fixed positioning, for example with the utilities `className="mtx-position-absolute mtx-right-0 mtx-bottom-0 mtx-m-2"` inside a positioned container (see "Hidden and position").

## Directions

`direction` sets where the actions open: `up` (default), `down`, `left` or `right`. Vertically, labels appear to the left of each action; horizontally, above it. The arrow keys follow the direction.

{{< react-demo id="speed-dial/02-directions" layout="block" >}}

## Colors

`color` on the SpeedDial colors the primary FAB (`primary` by default); on each `SpeedDialAction`, it colors that action (`secondary` by default). Both accept the [Fab](../fab/) colors.

{{< react-demo id="speed-dial/03-colors" layout="block" >}}

## States

Closed and open (the primary icon rotates 45°), hover, focus and disabled actions (`disabled`). <kbd>Escape</kbd> closes it and returns focus to the FAB.

{{< react-demo id="speed-dial/04-states" layout="block" >}}

## Labels

By default the labels of all actions are visible while the SpeedDial is open (MUI's `tooltipOpen`), styled with the [Tooltip](../tooltip/) tokens. With `tooltipHover` on the SpeedDial each action uses a real [Tooltip](../tooltip/) that appears on hover **or keyboard focus**, to the left for vertical directions and above for horizontal ones; recommended for horizontal directions so labels do not overlap. On an action, `tooltipOpen` forces one mode and `tooltipPlacement` moves its Tooltip.

{{< react-demo id="speed-dial/05-labels" layout="block" >}}

{{< callout type="info" title="Keyboard" >}}
In both modes the label is visible while moving through the actions: in the persistent mode it always is, and with `tooltipHover` the Tooltip appears on keyboard focus and hides with <kbd>Escape</kbd>. Each action's accessible name is still its `aria-label` (persistent labels are `aria-hidden` so they are not read twice).
{{< /callout >}}

## Opening on hover

`event="hover"` opens the SpeedDial when the mouse enters and closes it when it leaves. Clicking the FAB still toggles it, so it also works on touch screens and with the keyboard.

{{< react-demo id="speed-dial/06-hover" layout="block" >}}

## Icons

Without `icon` the FAB shows `<SpeedDialIcon />` (`add`), which rotates 45° when open. `openIcon` (on the SpeedDial or on `SpeedDialIcon`) replaces it with another icon while open: the closed icon rotates and fades out while the open one rotates into place. Icons can be Material Icons names or nodes such as an `<svg>` (24px).

{{< react-demo id="speed-dial/07-icons" layout="block" >}}

```tsx
<SpeedDial ariaLabel="Edit" icon={<SpeedDialIcon openIcon={<EditIcon />} />}>…</SpeedDial>
<SpeedDial ariaLabel="Messages" icon="chat" openIcon="close">…</SpeedDial>
```

## Real-world examples

Photo gallery: the SpeedDial is controlled, so each action performs its task and closes it.

{{< react-demo id="speed-dial/08-use-cases" layout="block" >}}

## Hidden and position

`hidden` shrinks the primary FAB with a scale transition and closes the actions (for example while scrolling): if it was open, `onClose(null, 'hidden')` is called and it reappears closed. `position="fixed-br"` and `"fixed-bl"` pin it 24px from the bottom-right or bottom-left corner of the viewport, above the content (`z-index` 1050).

{{< react-demo id="speed-dial/09-hidden" layout="block" >}}

```tsx
<SpeedDial ariaLabel="Create" position="fixed-br">
  <SpeedDialAction icon="description" tooltipTitle="Document" />
</SpeedDial>
```

## Grid layout

[Grid](../grid/) panels (one per row on mobile, two from 900px), each with its SpeedDial in the corner.

{{< react-demo id="speed-dial/10-grid" layout="block" >}}

## Programmatic usage

The vanilla `open()`, `close()`, `toggle()` and `direction` become the `open` and `direction` props. In uncontrolled mode use `defaultOpen`; `onOpen` and `onClose` receive the event and the reason.

{{< react-demo id="speed-dial/11-programmatic" layout="block" >}}

```tsx
const [open, setOpen] = useState(false);

<SpeedDial
  ariaLabel="Actions"
  open={open}
  onOpen={(event, reason) => setOpen(true)}   // 'toggle' | 'mouseEnter'
  onClose={(event, reason) => setOpen(false)} // 'toggle' | 'mouseLeave' | 'escapeKeyDown' | 'clickaway' | 'hidden'
>
  …
</SpeedDial>
```

## Manual BEM markup

The CSS also works with plain markup (static HTML or server templates). Without the component you manage the state, `aria-expanded`, `inert` and the keyboard yourself.

{{< react-demo id="speed-dial/12-markup" open="false" >}}

## API reference

### SpeedDial props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `ariaLabel` | `string` | i18n `speedDial.actions` (`Actions` / `Acciones`) | `aria-label` of the primary FAB. |
| `icon` | `ReactNode` | `<SpeedDialIcon />` | Material Icons name, node or `SpeedDialIcon`. |
| `openIcon` | `ReactNode` | — | Icon while open when `icon` is a name or omitted. |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Opening direction. |
| `open` | `boolean` | — | Controlled state. |
| `defaultOpen` | `boolean` | `false` | Initial uncontrolled state. |
| `onOpen` | `(event, reason) => void` | — | Open request (`'toggle' \| 'mouseEnter'`). |
| `onClose` | `(event, reason) => void` | — | Close request (`'toggle' \| 'mouseLeave' \| 'escapeKeyDown' \| 'clickaway' \| 'hidden'`); `event` is `null` with `'hidden'`. |
| `event` | `'click' \| 'hover'` | `'click'` | With `hover` it also opens when the mouse enters and closes when it leaves. |
| `tooltipHover` | `boolean` | `false` | Replaces the persistent labels with one Tooltip per action. |
| `color` | Fab colors | `'primary'` | Color of the primary FAB. |
| `hidden` | `boolean` | `false` | Hides the primary FAB with a scale transition; if it was open, it closes and calls `onClose(null, 'hidden')`, so it does not reappear open. |
| `position` | `'fixed-br' \| 'fixed-bl'` | — | Pinned to a corner of the viewport. |
| `FabProps` | `Partial<FabProps>` | — | Extra props for the primary FAB. |
| `locale` | `string` | — | Language of the default `ariaLabel`. |
| `className`, `style`, `ref`, `on*`… | — | — | Forwarded to the root `<div>`. |

### SpeedDialAction props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `icon` | `ReactNode` | — | Action icon. |
| `tooltipTitle` | `ReactNode` | — | Label; also the `aria-label` when it has none. Without it there is no wrapper or label. |
| `tooltipOpen` | `boolean` | `!tooltipHover` | `true`: persistent label; `false`: Tooltip on hover/focus. |
| `tooltipPlacement` | `Placement` | `'left'` (vertical) / `'top'` (horizontal) | Tooltip placement (hover mode). |
| `TooltipProps` | `Partial<TooltipProps>` | — | Extra props for the Tooltip (hover mode). |
| `color` | Fab colors | `'secondary'` | Color of the action's small FAB. |
| `disabled`, `onClick`, `aria-label`, `ref`… | — | — | Forwarded to the action's [Fab](../fab/). |

### SpeedDialIcon props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `icon` | `ReactNode` | `'add'` | Closed icon. |
| `openIcon` | `ReactNode` | — | Open icon; without it `icon` rotates 45°. |
| `open` | `boolean` | SpeedDial state | Forces the state outside a SpeedDial. |

### Callbacks

| Callback | Vanilla event | Fired when |
|---|---|---|
| `onOpen(event, reason)` | `mtx:speed-dial:open` | It opens (click or hover). |
| `onClose(event, reason)` | `mtx:speed-dial:close` | It closes (click, click away, <kbd>Escape</kbd>, the pointer leaving or `hidden`). |

### CSS classes

| Class | Description |
|---|---|
| `mtx-speed-dial` | Flex container (`z-index` 1050). |
| `mtx-speed-dial--direction-up` / `--down` / `--left` / `--right` | Opening direction. |
| `mtx-speed-dial--open` | Open state: actions visible and primary icon rotated 45°. |
| `mtx-speed-dial--tooltip-hover` | Tooltip label mode (hover/focus). |
| `mtx-speed-dial--fixed-br` / `mtx-speed-dial--fixed-bl` | Pinned 24px from the bottom-right / bottom-left corner. |
| `mtx-speed-dial__fab` | Primary FAB. |
| `mtx-speed-dial__actions` | Actions container (12px gap). |
| `mtx-speed-dial__action` | Small FAB for each action. |
| `mtx-speed-dial__action-wrapper` | Action + label wrapper, with a staggered animation (30 ms per action). Actions without `tooltipTitle` have no wrapper, so they do not animate or get the extra delay beyond the fifth. |
| `mtx-speed-dial__tooltip` | Persistent action label (`aria-hidden`). |
| `mtx-speed-dial__icon` | `SpeedDialIcon` whose `icon` is a node or that has `openIcon` (`--open` while open with `openIcon`). |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-duration-short`, `--mtx-duration-shorter`, `--mtx-easing-standard` | Icon rotation, appearance of actions and labels. |
| `--mtx-tooltip-bg`, `--mtx-tooltip-color`, `--mtx-tooltip-font-size`, `--mtx-tooltip-max-width` | Persistent labels (the same tokens as the [Tooltip](../tooltip/)). |
| `--mtx-z-index-speed-dial` | Stacking level (1050). |

The primary FAB and the actions use the [Fab](../fab/) variables.

## Accessibility

- The primary FAB gets `aria-haspopup="true"`, a synchronized `aria-expanded` and `aria-controls` pointing to the actions container; its name comes from `ariaLabel`.
- Actions are native `<button>` elements with a decorative icon (`aria-hidden`), named by `tooltipTitle` or `aria-label`.
- While closed, the actions container gets `inert` and `aria-hidden="true"` and each action `tabIndex={-1}`, so invisible actions are out of the tab order. If focus is inside the actions when it closes, it returns to the FAB.
- Persistent labels are `aria-hidden` (the name is already in the `aria-label`); in `tooltipHover` mode the Tooltip does not duplicate the name when it matches the text.
- <kbd>Escape</kbd> goes through the shared layer stack: a visible Tooltip hides first, then the SpeedDial closes.
- It respects `prefers-reduced-motion`: the icon rotation and the `openIcon` swap have no transition.

| Key | Action |
|---|---|
| <kbd>Enter</kbd> / <kbd>Space</kbd> on the FAB | Opens or closes the SpeedDial. |
| Arrow in the `direction` | Moves focus to the next action (from the FAB to the first one). |
| Opposite arrow | Moves focus to the previous action, back to the FAB. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the actions. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on an action | Runs the action. |
| <kbd>Escape</kbd> | Closes the SpeedDial and returns focus to the FAB. |

## Vanilla equivalence

| Vanilla | React |
|---|---|
| `data-mtx="speed-dial"` + `data-icon` + `data-label` | `<SpeedDial icon="…" ariaLabel="…">` |
| `<button data-icon data-tooltip data-color>` | `<SpeedDialAction icon tooltipTitle color>` |
| `data-direction`, `data-color` | `direction`, `color` |
| `data-event="hover"` | `event="hover"` |
| `data-tooltip-hover` | `tooltipHover` |
| `mtx-speed-dial--fixed-br` / `--fixed-bl` | `position="fixed-br"` / `"fixed-bl"` |
| `open()`, `close()`, `toggle()`, `isOpen` | `open` / `defaultOpen` + `onOpen` / `onClose` |
| `direction = 'left'` | `direction="left"` |
| `mtx:speed-dial:open` / `mtx:speed-dial:close` | `onOpen` / `onClose` |
