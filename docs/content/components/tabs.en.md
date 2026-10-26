---
title: "Tabs"
description: "Tabs to switch between views at the same level, with an animated indicator, icons, vertical orientation and full keyboard navigation."
group: "navigation"
icon: "tab"
weight: 40
example: "tabs"
import: "Tabs, Tab, TabPanel, TabContext, TabsContainer"
mui: "https://mui.com/material-ui/react-tabs/"
---

**Tabs** organizes related content into views at the same level and lets users switch between them without leaving the page, with an indicator that slides under the active tab. Use it when there are between two and about seven sibling sections that users consult one at a time (profile, security, notifications). Don't use it for sequential steps or to navigate between top-level pages.

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Tab, TabContext, TabPanel, Tabs, TabsContainer } from '@rubenchodev/materix-react';

<TabContext defaultValue="overview">
  <Tabs aria-label="Project">
    <Tab value="overview" label="Overview" />
    <Tab value="activity" label="Activity" />
  </Tabs>
  <TabPanel value="overview">…</TabPanel>
  <TabPanel value="activity">…</TabPanel>
</TabContext>
```

## Basic usage

`TabContext` shares the active value between `Tabs` and the `TabPanel`s: it generates the ids, links `aria-controls` / `aria-labelledby` and hides the inactive panels with `hidden`. Without `defaultValue`, the first enabled tab is active. `TabsContainer` is optional: it groups tabs and panels on an outlined surface (`.mtx-tabs-container`).

{{< react-demo id="tabs/01-basic" layout="block" >}}

## Variants

By default tabs have their natural width (`variant="standard"`). `variant="fullWidth"` distributes the width among them and `centered` centers them. A `Tab` without `value` receives its index, so a bar without panels only needs `<Tab label>` children. `TabsContainer` adds a bordered surface; with `borderless` it only groups.

{{< react-demo id="tabs/02-variants" layout="block" >}}

## With and without icons

`icon` accepts a Material Icons name (rendered as a decorative `<span class="material-icons mtx-tab__icon">`) or your own node. `iconPosition="start"` (default) or `"end"`. Icon-only tabs need an `aria-label`.

{{< react-demo id="tabs/03-icons" layout="block" >}}

## Colors

The active tab and the indicator use `--mtx-color-primary`; as in vanilla, there are no `textColor` / `indicatorColor` props. For another hue, redefine the token on a container.

{{< react-demo id="tabs/04-colors" layout="block" >}}

## States

A `disabled` tab is dimmed, does not respond to clicks and is skipped by the keyboard. Hover to see the hover background, press to see the ripple (`disableRipple` turns it off) and use <kbd>Tab</kbd> to see the focus ring.

{{< react-demo id="tabs/05-states" layout="block" >}}

## Scrollable

When the tabs don't fit, the bar scrolls horizontally (touch, wheel or keyboard) and the indicator follows the active tab. The scrollbar is hidden and there are no arrow buttons (unlike MUI's `variant="scrollable"`).

{{< react-demo id="tabs/06-scrollable" layout="block" >}}

## Vertical

`orientation="vertical"` stacks the tabs, places the indicator on the right and switches the arrow keys to <kbd>↑</kbd>/<kbd>↓</kbd>. A row [Stack](../stack/) places the panels next to the bar.

{{< react-demo id="tabs/07-vertical" layout="block" >}}

## Manual and automatic activation

By default the arrow keys only move focus and the tab is activated with <kbd>Enter</kbd> or <kbd>Space</kbd> (manual activation, recommended by WAI-ARIA when loading a panel is expensive). With `selectionFollowsFocus` the tab is activated as soon as it receives focus.

{{< react-demo id="tabs/08-activation" layout="block" >}}

## Real-world example

Account settings with full-width tabs, icons and panels with controls.

{{< react-demo id="tabs/09-use-cases" layout="block" >}}

## Grid layout

Two groups inside a [Grid](../grid/): the indicator is recalculated when the width changes (`ResizeObserver` and `resize`).

{{< react-demo id="tabs/10-grid" layout="block" >}}

## Several groups without an id

Ids come from `useId`, so several groups without an `id` (or `TabContext` without `id`) never repeat ids and `aria-controls` / `aria-labelledby` always point to the right element.

{{< react-demo id="tabs/11-groups" layout="block" >}}

## Controlled usage and cancelable change

Control the value with `value` + `onChange` on `TabContext` or on `Tabs`: inside a `TabContext`, the `value` of a controlled `Tabs` is mirrored in the context so the panels follow it (`defaultValue` on `Tabs` is ignored there, with a development warning). `Tab` children wrapped in a `Fragment` are flattened. `onBeforeChange(value, previousValue)` runs before the change: returning `false` cancels it (the equivalent of the cancelable `mtx:tabs:before-change`).

{{< react-demo id="tabs/12-programmatic" layout="block" >}}

```tsx
const [value, setValue] = useState('general');

<Tabs value={value} onChange={(event, next) => setValue(next)} onBeforeChange={(next) => next !== 'locked'}>
  <Tab value="general" label="General" />
  <Tab value="locked" label="Locked" />
</Tabs>;
```

## API reference

### Tabs props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string \| number \| null` | — | Active value (controlled). Inside `TabContext`, it is taken from the context. |
| `defaultValue` | `string \| number \| null` | first enabled | Initial value (uncontrolled, without `TabContext`). |
| `onChange` | `(event, value) => void` | — | Fired after the change (`mtx:tabs:change`). |
| `onBeforeChange` | `(value, previousValue) => boolean \| void` | — | Returning `false` cancels the change (`mtx:tabs:before-change`). |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientation, `aria-orientation` and arrow keys. |
| `variant` | `'standard' \| 'fullWidth'` | `'standard'` | `fullWidth` distributes the width (`mtx-tabs--full`). |
| `centered` | `boolean` | `false` | Centers the tabs. |
| `selectionFollowsFocus` | `boolean` | `false` | Activates the tab when moving with the arrow keys. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the `role="tablist"` element. |

`className`, `style`, `aria-label` and other attributes go to the tablist; its `id` is used as the id prefix when there is no `TabContext`.

### Tab props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string \| number` | index | Tab value. |
| `label` | `ReactNode` | — | Text (`children` works too). |
| `icon` | `string \| ReactNode` | — | Material Icons name or node. |
| `iconPosition` | `'start' \| 'end'` | `'start'` | Icon position. |
| `disabled` | `boolean` | `false` | `disabled` + `aria-disabled`; skipped by the keyboard. |
| `disableRipple` | `boolean` | `false` | Disables the ripple. |
| `ref` | `Ref<HTMLButtonElement>` | — | Ref to the `<button role="tab">`. |

### TabPanel and TabContext props

| Component | Prop | Description |
| :--- | :--- | :--- |
| `TabContext` | `value` / `defaultValue` / `onChange(event, value)` | Shared active value (controlled or not). |
| `TabContext` | `id` | Id prefix (unique by default). |
| `TabsContainer` | `borderless` | Optional surface (`.mtx-tabs-container`); `borderless` removes border and background. |
| `TabPanel` | `value` | Value of the tab that shows the panel. Outside `TabContext`, control `hidden` and the ids yourself. |

In RTL (`dir="rtl"`) the horizontal arrow keys are swapped. If `value` matches no enabled tab, the first enabled one keeps `tabindex="0"` so the bar stays reachable.

`useTabContext()` returns the context (`value`, `idPrefix`, `setValue`…) for custom pieces.

### CSS classes

| Class | Element |
| :--- | :--- |
| `.mtx-tabs` | Tab bar (flex, 48px, bottom divider, horizontal scrolling without a visible scrollbar). |
| `.mtx-tabs--full` / `--centered` / `--vertical` | Full width, centered, vertical. |
| `.mtx-tabs__indicator` | 2px indicator (positioned with `transform` and `width`/`height`). |
| `.mtx-tabs-container` / `--borderless` | `TabsContainer` surface. |
| `.mtx-tab` / `.mtx-tab--active` | Tab and active tab. |
| `.mtx-tab__icon` | Icon generated from `icon`. |
| `.mtx-tab-panel` | Content panel (hidden with `hidden`). |

### CSS variables

| Variable | Usage |
| :--- | :--- |
| `--mtx-color-primary` | Active tab text and indicator. |
| `--mtx-color-text-secondary`, `--mtx-color-text-primary` | Text at rest and on hover. |
| `--mtx-color-action-hover`, `--mtx-color-action-disabled` | Hover background and disabled text. |
| `--mtx-color-divider` | Divider line and container border. |
| `--mtx-duration-standard`, `--mtx-easing-standard` | Indicator animation. |

## Equivalence with vanilla

| Vanilla | React |
| :--- | :--- |
| `<div data-mtx="tabs">` + `<button data-mtx="tab">` | `<Tabs>` + `<Tab label>` |
| `.mtx-tabs-container` | `TabsContainer` |
| `data-panel="#id"` + `.mtx-tab-panel` | `TabContext` + `<TabPanel value>` |
| `data-active` | `defaultValue` / `value` |
| `data-value` | `value` on `Tab` |
| `data-icon="phone"` | `icon="phone"` |
| `data-disabled` | `disabled` |
| `data-orientation`, `data-full`, `data-centered`, `data-selection-follows-focus` | `orientation`, `variant="fullWidth"`, `centered`, `selectionFollowsFocus` |
| `select(value)`, `value` getter | `value` (controlled) |
| `mtx:tabs:before-change` / `onBeforeChange` property | `onBeforeChange(value, previousValue)` returning `false` |
| `mtx:tabs:change` / `onChange` property | `onChange(event, value)` |

## Accessibility

- The bar has `role="tablist"` and `aria-orientation`; each tab `role="tab"`, `aria-selected` and, with a `TabPanel`, `aria-controls`; each panel `role="tabpanel"` and `aria-labelledby`.
- Roving tabindex: only the active tab is in the tab order (`tabindex="0"`); the others are reached with the arrow keys.
- Disabled tabs carry `aria-disabled="true"` and are skipped by the keyboard.
- Name the bar with `aria-label` and give icon-only tabs an `aria-label`; the generated icon is decorative.

| Key | Action |
| :--- | :--- |
| <kbd>Tab</kbd> | Enters the active tab; the next <kbd>Tab</kbd> leaves the bar. |
| <kbd>→</kbd> / <kbd>←</kbd> | Next / previous tab (horizontal), wrapping around. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Next / previous tab (vertical), wrapping around. |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last enabled tab. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the focused tab (manual activation). |
