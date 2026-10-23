---
title: "Tabs"
description: "Tabs to switch between views at the same level, with an animated indicator, icons, vertical orientation and full keyboard navigation."
group: "navigation"
icon: "tab"
weight: 40
example: "tabs"
mui: "https://mui.com/material-ui/react-tabs/"
---

`Tabs` organizes related content into views at the same level and lets users switch between them without leaving the page, with an indicator that slides under the active tab. Use it when there are between two and about seven sibling sections that users consult one at a time (profile, security, notifications). Don't use it for sequential steps (use a wizard with buttons) or to navigate between top-level pages on mobile (use a [Drawer](../drawer/)).

## Basic usage

A `data-mtx="tabs"` container with `data-mtx="tab"` buttons. Each tab points to its panel with `data-panel="#id"`; the component adds the ARIA roles and the indicator, hides inactive panels and activates the tab marked with `data-active` (or the first enabled one).

{{< mtx-demo title="Tabs with panels" layout="block" >}}
<div class="mtx-tabs-container">
  <div id="doc-tabs-1" data-mtx="tabs">
    <button data-mtx="tab" data-panel="#doc-tab-1" data-active>Overview</button>
    <button data-mtx="tab" data-panel="#doc-tab-2">Activity</button>
    <button data-mtx="tab" data-panel="#doc-tab-3">Settings</button>
  </div>
  <div class="mtx-tab-panel" id="doc-tab-1">Project overview: 12 open tasks.</div>
  <div class="mtx-tab-panel" id="doc-tab-2" hidden>Last activity 5 minutes ago.</div>
  <div class="mtx-tab-panel" id="doc-tab-3" hidden>Project preferences.</div>
</div>
{{< /mtx-demo >}}

`mtx-tabs-container` is optional: it groups tabs and panels on an outlined surface. Without it, the tabs sit on the bottom divider line, as in MUI.

{{< callout type="info" title="Generated ids" >}}
Tab ids are generated from the container's id (`{id}-tab-1`, `{id}-tab-2`…). If the container has no id, a unique prefix per group is generated (`mtx-tabs-1`, `mtx-tabs-2`…), so several groups without an id never produce duplicate ids. Tabs and panels that already have an id keep it.
{{< /callout >}}

## With icons

`data-icon` inserts a Material Icons glyph before the text. If the tab has no text, it becomes an icon-only tab: add an `aria-label` in that case.

{{< mtx-demo title="Icon and text" layout="block" >}}
<div id="doc-tabs-2" data-mtx="tabs">
  <button data-mtx="tab" data-icon="phone" data-active>Recents</button>
  <button data-mtx="tab" data-icon="favorite">Favorites</button>
  <button data-mtx="tab" data-icon="person_pin">Contacts</button>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Icon only" layout="block" >}}
<div id="doc-tabs-3" data-mtx="tabs">
  <button data-mtx="tab" data-icon="phone" aria-label="Recents" data-active></button>
  <button data-mtx="tab" data-icon="favorite" aria-label="Favorites"></button>
  <button data-mtx="tab" data-icon="person_pin" aria-label="Contacts"></button>
</div>
{{< /mtx-demo >}}

The icon is always placed to the left of the text (equivalent to MUI's `iconPosition="start"`); there is no top position.

## Full width and centered

`data-full` distributes the width among all tabs (equivalent to `variant="fullWidth"`), useful on mobile with few tabs. `data-centered` centers them.

{{< mtx-demo title="data-full" layout="block" >}}
<div id="doc-tabs-4" data-mtx="tabs" data-full>
  <button data-mtx="tab" data-active>Inventory</button>
  <button data-mtx="tab">Sales</button>
  <button data-mtx="tab">Customers</button>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="data-centered" layout="block" >}}
<div id="doc-tabs-5" data-mtx="tabs" data-centered>
  <button data-mtx="tab">Yesterday</button>
  <button data-mtx="tab" data-active>Today</button>
  <button data-mtx="tab">Tomorrow</button>
</div>
{{< /mtx-demo >}}

## Scrollable

When the tabs don't fit, the bar scrolls horizontally (touch, wheel or keyboard) and the indicator follows the active tab. The scrollbar is hidden and there are no arrow buttons, unlike MUI's `variant="scrollable"`.

{{< mtx-demo title="Many tabs" layout="block" >}}
<div id="doc-tabs-6" data-mtx="tabs">
  <button data-mtx="tab" data-active>January</button>
  <button data-mtx="tab">February</button>
  <button data-mtx="tab">March</button>
  <button data-mtx="tab">April</button>
  <button data-mtx="tab">May</button>
  <button data-mtx="tab">June</button>
  <button data-mtx="tab">July</button>
  <button data-mtx="tab">August</button>
  <button data-mtx="tab">September</button>
  <button data-mtx="tab">October</button>
  <button data-mtx="tab">November</button>
  <button data-mtx="tab">December</button>
</div>
{{< /mtx-demo >}}

## Vertical

`data-orientation="vertical"` stacks the tabs, places the indicator on the right and switches the navigation arrows to <kbd>↑</kbd>/<kbd>↓</kbd>.

{{< mtx-demo title="Vertical tabs" layout="row" >}}
<div id="doc-tabs-7" data-mtx="tabs" data-orientation="vertical">
  <button data-mtx="tab" data-panel="#doc-vtab-1" data-active>Account</button>
  <button data-mtx="tab" data-panel="#doc-vtab-2">Security</button>
  <button data-mtx="tab" data-panel="#doc-vtab-3">Notifications</button>
</div>
<div class="mtx-tab-panel" id="doc-vtab-1">Account details.</div>
<div class="mtx-tab-panel" id="doc-vtab-2" hidden>Password and two-step verification.</div>
<div class="mtx-tab-panel" id="doc-vtab-3" hidden>Email, push and weekly digest.</div>
{{< /mtx-demo >}}

## States

A tab with `data-disabled` (and `disabled` on the `<button>`) is shown dimmed, does not respond to clicks and is skipped by the keyboard. Hover to see the hover background and press <kbd>Tab</kbd> to see the focus ring.

{{< mtx-demo title="Disabled tab" layout="block" >}}
<div id="doc-tabs-8" data-mtx="tabs">
  <button data-mtx="tab" data-active>Active</button>
  <button data-mtx="tab" data-disabled disabled>Disabled</button>
  <button data-mtx="tab">Available</button>
</div>
{{< /mtx-demo >}}

{{< callout type="info" title="Colors" >}}
The active tab and the indicator always use `--mtx-color-primary`; there are no attributes equivalent to MUI's `textColor` or `indicatorColor`. For another color, redefine `--mtx-color-primary` on a container of the tabs.
{{< /callout >}}

## Automatic and manual activation

By default the arrow keys only move focus and the tab is activated with <kbd>Enter</kbd> or <kbd>Space</kbd> (manual activation, the WAI-ARIA pattern recommended when loading a panel is expensive). With `data-selection-follows-focus` the tab is activated as soon as it receives focus (automatic activation, MUI's default).

{{< mtx-demo title="data-selection-follows-focus" layout="block" >}}
<div id="doc-tabs-9" data-mtx="tabs" data-selection-follows-focus>
  <button data-mtx="tab" data-panel="#doc-auto-1" data-active>Day</button>
  <button data-mtx="tab" data-panel="#doc-auto-2">Week</button>
  <button data-mtx="tab" data-panel="#doc-auto-3">Month</button>
</div>
<div class="mtx-tab-panel" id="doc-auto-1">Daily view.</div>
<div class="mtx-tab-panel" id="doc-auto-2" hidden>Weekly view.</div>
<div class="mtx-tab-panel" id="doc-auto-3" hidden>Monthly view.</div>
{{< /mtx-demo >}}

## Real-world examples

Profile settings with full-width tabs, icons and panels with forms.

{{< mtx-demo title="Account settings" layout="block" >}}
<div class="mtx-tabs-container">
  <div id="doc-tabs-10" data-mtx="tabs" data-full>
    <button data-mtx="tab" data-icon="person" data-panel="#doc-case-1" data-active>Profile</button>
    <button data-mtx="tab" data-icon="lock" data-panel="#doc-case-2">Security</button>
    <button data-mtx="tab" data-icon="notifications" data-panel="#doc-case-3">Alerts</button>
  </div>
  <div class="mtx-tab-panel" id="doc-case-1">
    <input data-mtx="text-field" data-label="Display name" data-variant="outlined" type="text" value="Ana Garcia">
  </div>
  <div class="mtx-tab-panel" id="doc-case-2" hidden>
    <input data-mtx="text-field" data-label="Current password" data-variant="outlined" type="password">
  </div>
  <div class="mtx-tab-panel" id="doc-case-3" hidden>
    <input type="checkbox" data-mtx="switch" data-label="Weekly email digest" checked>
  </div>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

With a hand-written structure the component reuses the existing indicator and honors `mtx-tab--active` as the initial tab.

```html
<div class="mtx-tabs-container">
  <div class="mtx-tabs" data-mtx="tabs">
    <button class="mtx-tab mtx-tab--active" data-mtx="tab" data-panel="#panel-one">
      <span class="material-icons mtx-tab__icon" aria-hidden="true">home</span>One
    </button>
    <button class="mtx-tab" data-mtx="tab" data-panel="#panel-two">Two</button>
    <span class="mtx-tabs__indicator"></span>
  </div>
  <div class="mtx-tab-panel" id="panel-one">Content of panel 1.</div>
  <div class="mtx-tab-panel" id="panel-two" hidden>Content of panel 2.</div>
</div>
```

## Programmatic usage

```javascript
const tabs = Materix.getInstance(document.getElementById('settings'));

tabs.select('security');    // by data-value, id, index (number) or element
console.log(tabs.value);     // data-value, id or index of the active tab

// Cancel a change
tabs.element.addEventListener('mtx:tabs:before-change', (event) => {
  if (formIsDirty) event.preventDefault();
});

// Listen for changes
tabs.element.addEventListener('mtx:tabs:change', (event) => {
  const { tab, panel, previousTab } = event.detail;
});

// Alternative with callbacks
tabs.onBeforeChange = (tab, panel, previousTab, previousPanel) => tab.dataset.value !== 'locked';
tabs.onChange = (tab) => console.log(tab.textContent);
```

With ES modules:

```javascript
import { Tabs, Tab, getInstance } from 'materix-ui';
```

{{< mtx-demo title="select() and events" layout="block" >}}
<div id="doc-tabs-api" data-mtx="tabs">
  <button data-mtx="tab" data-value="general" data-active>General</button>
  <button data-mtx="tab" data-value="advanced">Advanced</button>
  <button data-mtx="tab" data-value="locked">Blocked by event</button>
</div>
<div class="mtx-mt-2">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-tabs-select="general">select('general')</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" data-doc-tabs-select="advanced">select('advanced')</button>
  <span class="mtx-ml-2" id="doc-tabs-status" aria-live="polite"></span>
</div>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('doc-tabs-api');
  const tabs = Materix.getInstance(el);
  const status = document.getElementById('doc-tabs-status');
  document.querySelectorAll('[data-doc-tabs-select]').forEach((btn) => {
    btn.addEventListener('click', () => tabs.select(btn.dataset.docTabsSelect));
  });
  el.addEventListener('mtx:tabs:before-change', (event) => {
    if (event.detail.tab.dataset.value === 'locked') {
      event.preventDefault();
      status.textContent = 'Change canceled with preventDefault()';
    }
  });
  el.addEventListener('mtx:tabs:change', (event) => {
    status.textContent = 'mtx:tabs:change → ' + tabs.value;
  });
});
</script>

## API reference

### Data attributes

**Tabs** (`data-mtx="tabs"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-orientation` | `horizontal`, `vertical` | `horizontal` | Orientation; also sets `aria-orientation` and the navigation arrow keys. |
| `data-full` | boolean | — | Distributes the width among the tabs (`mtx-tabs--full`). |
| `data-centered` | boolean | — | Centers the tabs (`mtx-tabs--centered`). |
| `data-selection-follows-focus` | boolean | — | Activates the tab when moving with the arrow keys (automatic activation). |

**Tab** (`data-mtx="tab"`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-panel` | CSS selector | — | Panel controlled by the tab; it gets `role="tabpanel"` and is hidden when inactive. |
| `data-active` | boolean | first enabled | Initially active tab (the `mtx-tab--active` class also works). |
| `data-icon` | Material Icons name | — | Inserts a decorative icon before the text. |
| `data-value` | Text | id or index | Value returned by `value` and accepted by `select()`. |
| `data-disabled` | boolean | — | Disables the tab (adds `aria-disabled`). Combine it with `disabled` on the `<button>`. |

`data-mtx="tab-panel"` is registered as a generic component: it adds no behavior, and the `mtx-tab-panel` class is written by hand.

### CSS classes

| Class | Description |
|---|---|
| `mtx-tabs` | Tab bar (flex, 48px, bottom divider line, horizontal scrolling without a visible scrollbar). |
| `mtx-tabs--full` | Equal-width tabs. |
| `mtx-tabs--centered` | Centered tabs. |
| `mtx-tabs--vertical` | Vertical orientation with the divider on the right. |
| `mtx-tabs__indicator` | 2px indicator (created if it does not exist). |
| `mtx-tabs-container` | Optional surface with border, radius and `paper` background for tabs + panels. |
| `mtx-tabs-container--borderless` | Container variant without border or background. |
| `mtx-tab` | Tab: 48px-high button, 90px minimum width, uppercase text. |
| `mtx-tab--active` | Active tab (primary color). |
| `mtx-tab__icon` | Icon generated by `data-icon`. |
| `mtx-tab-panel` | Content panel (16px × 24px padding; hidden with `hidden`). |

### Methods

| Method | Returns | Description |
|---|---|---|
| `select(value)` | `void` | Activates the tab by `data-value`, id, numeric index or element. Emits the events. |
| `value` (getter) | `string \| null` | `data-value`, id or index of the active tab. |
| `onBeforeChange` (property) | — | Function `(tab, panel, previousTab, previousPanel)`; if it returns `false`, the change is canceled. |
| `onChange` (property) | — | Function `(tab, panel, previousTab, previousPanel)` called after the change. |
| `destroy()` | `void` | Removes the listeners and the `ResizeObserver`. Unlinks the instance: `getInstance()` then returns `undefined`. |

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:tabs:before-change` | `{ tab, panel, previousTab, previousPanel }` | Before switching tabs. Cancelable with `preventDefault()`. |
| `mtx:tabs:change` | `{ tab, panel, previousTab, previousPanel }` | After another tab is activated (click, keyboard or `select()`). Not fired on the initial activation. |

### CSS variables

| Variable | Usage |
|---|---|
| `--mtx-color-primary` | Active tab text and indicator. |
| `--mtx-color-text-secondary`, `--mtx-color-text-primary` | Text at rest and on hover. |
| `--mtx-color-action-hover` | Hover background. |
| `--mtx-color-action-disabled` | Disabled text. |
| `--mtx-color-divider` | Divider line and container border. |
| `--mtx-color-background-paper`, `--mtx-shape-radius` | Background and radius of `mtx-tabs-container`. |
| `--mtx-focus-ring-width`, `--mtx-focus-ring-color` | Focus ring. |
| `--mtx-duration-standard`, `--mtx-duration-shorter`, `--mtx-easing-standard` | Indicator and color animation. |
| `--mtx-spacing-1`, `--mtx-font-family` | Icon-text gap and typography. |

## Accessibility

- The container gets `role="tablist"` and `aria-orientation`; each tab `role="tab"`, `aria-selected` and `aria-controls`; each panel `role="tabpanel"` and `aria-labelledby`. Ids are generated if missing.
- Only the active tab is in the tab order (`tabindex="0"`); the others use `tabindex="-1"` and are reached with the arrow keys (*roving tabindex*).
- Disabled tabs carry `aria-disabled="true"` and are skipped by the keyboard.
- Icon-only tabs need an `aria-label`; the generated icon is decorative (`aria-hidden`).

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Enters the active tab; the next <kbd>Tab</kbd> leaves the bar. |
| <kbd>→</kbd> / <kbd>←</kbd> | Next / previous tab (horizontal), wrapping around. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Next / previous tab (vertical), wrapping around. |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last enabled tab. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the focused tab (manual activation). |
