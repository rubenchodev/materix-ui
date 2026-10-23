---
title: "Accordion"
description: "Panels that show and hide related sections of content behind a clickable summary, ideal for FAQs and grouped settings."
group: "surfaces"
icon: "expand_circle_down"
weight: 5
example: "accordion"
mui: "https://mui.com/material-ui/react-accordion/"
---

**Accordion** organizes content into collapsible panels: a clickable summary (AccordionSummary) shows or hides the details (AccordionDetails) with a height transition. Use it for FAQs, sectioned settings or secondary information that shouldn't take up space permanently. Don't use it for primary navigation (use [Tabs]({{< relref "/components/tabs" >}}) or a [Drawer]({{< relref "/components/drawer" >}})) or to hide content users always need to see.

## Basic usage

A `<div data-mtx="accordion">` with `data-summary` generates the `<h3>` heading, the button with `aria-expanded` and `aria-controls`, the `expand_more` icon and the collapsible region. The div's content becomes the details. The summary is bold (weight 500) and, when expanded, gets its own background and a divider that separates it from the content (see [Summary style](#summary-style)). Adjacent panels are grouped visually: they share 1px separators and only the first and last ones get rounded corners.

{{< mtx-demo title="Simplified syntax" layout="block" >}}
<div data-mtx="accordion" data-summary="Accordion 1">Adjacent panels share 1px separators, just like MUI.</div>
<div data-mtx="accordion" data-summary="Accordion 2">When expanded, the panel moves 16px away from its neighbors.</div>
<div data-mtx="accordion" data-summary="Accordion 3" data-expanded>This panel starts expanded with data-expanded.</div>
{{< /mtx-demo >}}

## From details

Progressive enhancement: a `<details data-mtx="accordion">` works without JavaScript. On initialization the native element is kept and gets the MUI styling, the height animation and the icon. The `open` attribute sets the initial state, and the browser's find-in-page (Ctrl+F) opens the panel that contains the match.

{{< mtx-demo title="details / summary" layout="block" >}}
<details data-mtx="accordion" open>
  <summary>Does it work without JavaScript?</summary>
  <p>Yes. The native element opens and closes on its own; Materix adds the look, the transition and keyboard support.</p>
</details>
<details data-mtx="accordion">
  <summary>Can the browser's search find the hidden text?</summary>
  <p>Yes: collapsed panels open when Ctrl+F finds a match inside them.</p>
</details>
{{< /mtx-demo >}}

{{< callout type="info" >}}A `<summary>` can't live inside a heading, so the `details` form doesn't generate an `<h3>`. If the heading outline matters for your page, use the `<div>` form.{{< /callout >}}

## Variants

By default the accordion is a [Paper]({{< relref "/components/paper" >}}) surface with elevation 1. `data-variant="outlined"` uses a 1px border (adjacent borders are merged), `data-elevation="0"` makes it flat and `data-square` removes the rounded corners.

{{< mtx-demo title="Elevation, outlined, flat and square" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div data-mtx="accordion" data-summary="Elevation">Elevation 1 shadow.</div>
    <div data-mtx="accordion" data-summary="Returns">30 days to return your order.</div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div data-mtx="accordion" data-variant="outlined" data-summary="Outlined">1px border, no shadow.</div>
    <div data-mtx="accordion" data-variant="outlined" data-summary="Returns">30 days to return your order.</div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div data-mtx="accordion" data-elevation="0" data-summary="Elevation 0">Flat surface.</div>
    <div data-mtx="accordion" data-elevation="0" data-summary="Returns">30 days to return your order.</div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div data-mtx="accordion" data-square data-summary="Square">No rounded corners.</div>
    <div data-mtx="accordion" data-square data-summary="Returns">30 days to return your order.</div>
  </div>
</div>
{{< /mtx-demo >}}

## Summary style

By default the summary uses medium weight (500) and, while the panel is expanded, an `--mtx-color-action-selected` background plus a bottom divider, so the heading stands apart from the content in both light and dark themes. Focus (`--mtx-color-action-focus`) takes precedence over that background, and a disabled panel keeps its reduced opacity. `data-summary-style="plain"` (on the panel or on the group) restores MUI's flat look: regular weight, no background and no divider. Tune it with the `--mtx-accordion-summary-*` CSS variables.

{{< callout type="info" title="Deliberate deviation from MUI" >}}
MUI's `AccordionSummary` uses regular weight and the same background as the details. Materix emphasizes the summary by default so an open panel's heading is easy to tell from its content. Use `data-summary-style="plain"` for the original MUI look.
{{< /callout >}}

<style>.doc-accordion-brand {
  --mtx-accordion-summary-font-weight: 700;
  --mtx-accordion-summary-expanded-bg: color-mix(in srgb, var(--mtx-color-primary) 12%, transparent);
  --mtx-accordion-summary-expanded-divider: var(--mtx-color-primary);
}</style>

{{< mtx-demo title="Summary style" layout="block" >}}
<p class="mtx-typography--overline">Emphasized (default)</p>
<div>
  <div data-mtx="accordion" data-summary="Billing" data-expanded>Invoices are issued on the 1st of every month.</div>
  <div data-mtx="accordion" data-summary="Payment methods">Card, bank transfer and direct debit.</div>
</div>
<p class="mtx-typography--overline mtx-mt-3">data-summary-style="plain"</p>
<div data-mtx="accordion-group" data-summary-style="plain" data-exclusive="false">
  <div data-mtx="accordion" data-summary="Billing" data-expanded>Invoices are issued on the 1st of every month.</div>
  <div data-mtx="accordion" data-summary="Payment methods">Card, bank transfer and direct debit.</div>
</div>
<p class="mtx-typography--overline mtx-mt-3">Custom variables</p>
<div class="doc-accordion-brand">
  <div data-mtx="accordion" data-summary="Billing" data-expanded>Invoices are issued on the 1st of every month.</div>
  <div data-mtx="accordion" data-summary="Payment methods">Card, bank transfer and direct debit.</div>
</div>
{{< /mtx-demo >}}

```html
<div data-mtx="accordion" data-summary="Billing">…</div>
<div data-mtx="accordion" data-summary="Billing" data-summary-style="plain">…</div>
<div data-mtx="accordion-group" data-summary-style="plain">…</div>
```

```css
/* Customization via CSS variables (on the accordion or any ancestor) */
.my-faq {
  --mtx-accordion-summary-font-weight: 700;
  --mtx-accordion-summary-expanded-bg: color-mix(in srgb, var(--mtx-color-primary) 12%, transparent);
  --mtx-accordion-summary-expanded-divider: var(--mtx-color-primary);
}
```

## Gutters

When expanded, the panel gets a 16px vertical margin and the summary grows from 48px to 64px. `data-disable-gutters` keeps the 48px height and removes the margin.

{{< mtx-demo title="With and without gutters" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div data-mtx="accordion" data-summary="First">Collapsed panel.</div>
    <div data-mtx="accordion" data-summary="Second (expanded)" data-expanded>16px apart above and below.</div>
    <div data-mtx="accordion" data-summary="Third">Collapsed panel.</div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div data-mtx="accordion" data-disable-gutters data-summary="First">Collapsed panel.</div>
    <div data-mtx="accordion" data-disable-gutters data-summary="Second (expanded)" data-expanded>No margin and no height change.</div>
    <div data-mtx="accordion" data-disable-gutters data-summary="Third">Collapsed panel.</div>
  </div>
</div>
{{< /mtx-demo >}}

## With icons

The expand icon is `expand_more` and rotates 180° when opened. `data-expand-icon` accepts any Material Icons name and `data-expand-icon="false"` omits it. The rotation angle is set with the `--mtx-accordion-expand-icon-rotation` variable (for example `45deg` for an `add` icon).

{{< mtx-demo title="Expand icon" layout="block" >}}
<div data-mtx="accordion" data-summary="expand_more (default)">Content.</div>
<div data-mtx="accordion" data-expand-icon="arrow_drop_down" data-summary="arrow_drop_down">Content.</div>
<div data-mtx="accordion" data-expand-icon="add" data-summary="add rotating 45°" style="--mtx-accordion-expand-icon-rotation: 45deg">Content.</div>
<div data-mtx="accordion" data-expand-icon="false" data-summary="No icon">Content.</div>
{{< /mtx-demo >}}

## States

Keyboard focus paints the summary with the `action.focus` background, like MUI. `data-disabled` dims the summary to 38%, applies the disabled background and blocks interaction. As in MUI, the summary has no ripple by default; `data-ripple` enables it.

{{< mtx-demo title="Normal, expanded, ripple and disabled" layout="block" >}}
<div data-mtx="accordion" data-summary="Normal">Enabled panel.</div>
<div data-mtx="accordion" data-summary="Expanded" data-expanded>Initially expanded panel.</div>
<div data-mtx="accordion" data-summary="With ripple" data-ripple>The summary shows the ripple when pressed.</div>
<div data-mtx="accordion" data-summary="Disabled" data-disabled>It can't be opened.</div>
{{< /mtx-demo >}}

## Exclusive group

`data-mtx="accordion-group"` keeps a single panel open (MUI's "Controlled accordion" pattern) and enables arrow, Home and End navigation between summaries. With `data-exclusive="false"` several panels can be open. The group propagates `data-variant`, `data-square`, `data-elevation` and `data-disable-gutters` to panels that don't declare them.

{{< mtx-demo title="Only one panel open" layout="block" >}}
<div data-mtx="accordion-group">
  <div data-mtx="accordion" data-summary="General settings" data-expanded>Language, time zone and date format.</div>
  <div data-mtx="accordion" data-summary="Users">Manage members and permissions.</div>
  <div data-mtx="accordion" data-summary="Advanced settings">Integrations, webhooks and API keys.</div>
</div>
{{< /mtx-demo >}}

{{< mtx-demo title="Several open (data-exclusive='false')" layout="block" >}}
<div data-mtx="accordion-group" data-exclusive="false" data-variant="outlined">
  <div data-mtx="accordion" data-summary="Email notifications" data-expanded>Weekly digest and security alerts.</div>
  <div data-mtx="accordion" data-summary="Push notifications" data-expanded>Mentions and direct messages.</div>
  <div data-mtx="accordion" data-summary="SMS">Sign-in verifications only.</div>
</div>
{{< /mtx-demo >}}

## Actions

A `data-mtx="accordion-actions"` child is placed at the bottom of the region, after the details, right-aligned with 8px between buttons (AccordionActions). `data-disable-spacing` removes that spacing.

{{< mtx-demo title="AccordionActions" layout="block" >}}
<div data-mtx="accordion" data-summary="Terms of service" data-expanded>
  <p>By continuing you accept the current terms of use and privacy policy.</p>
  <div data-mtx="accordion-actions">
    <button class="mtx-button mtx-button--text" data-mtx="button">Cancel</button>
    <button class="mtx-button mtx-button--text" data-mtx="button">Agree</button>
  </div>
</div>
{{< /mtx-demo >}}

## Real-world examples

### Frequently asked questions

An FAQ built with `<details>` inside an exclusive group: without JavaScript it reads the same, and with the library only one answer stays open.

{{< mtx-demo title="Billing FAQ" layout="block" >}}
<div data-mtx="accordion-group" data-variant="outlined">
  <details data-mtx="accordion" open>
    <summary>Can I change plans later?</summary>
    <p>Yes. Upgrades take effect immediately and are prorated; downgrades apply at the end of the billing period.</p>
  </details>
  <details data-mtx="accordion">
    <summary>Which payment methods do you accept?</summary>
    <p>Credit cards, Apple Pay and Google Pay. Annual plans can also pay by bank transfer.</p>
  </details>
  <details data-mtx="accordion">
    <summary>Can I cancel at any time?</summary>
    <p>Yes. Monthly plans can be canceled anytime; annual plans get a full refund within 30 days.</p>
  </details>
</div>
{{< /mtx-demo >}}

### Settings with secondary text

The summary accepts custom content: `.mtx-accordion__summary-secondary` applies the secondary text color, as in MUI's "Controlled accordion" demo.

{{< mtx-demo title="Two-column summary" layout="block" >}}
<div data-mtx="accordion-group">
  <div class="mtx-accordion" data-mtx="accordion">
    <h3 class="mtx-accordion__heading">
      <button class="mtx-accordion__summary">
        <span class="mtx-accordion__summary-content">
          <span class="mtx-w-50 mtx-flex-shrink-0">Profile</span>
          <span class="mtx-accordion__summary-secondary mtx-text-truncate">Laura Gomez · laura@acme.com</span>
        </span>
      </button>
    </h3>
    <div class="mtx-accordion__details">Account name, photo and email address.</div>
  </div>
  <div class="mtx-accordion" data-mtx="accordion">
    <h3 class="mtx-accordion__heading">
      <button class="mtx-accordion__summary">
        <span class="mtx-accordion__summary-content">
          <span class="mtx-w-50 mtx-flex-shrink-0">Security</span>
          <span class="mtx-accordion__summary-secondary mtx-text-truncate">2FA enabled</span>
        </span>
      </button>
    </h3>
    <div class="mtx-accordion__details">Password, two-step verification and active sessions.</div>
  </div>
</div>
{{< /mtx-demo >}}

## Full BEM syntax

For SSR, render the full structure; the component reuses it without duplicating nodes, generates any missing `id` and links `aria-controls` / `aria-labelledby`. If the region is missing, `.mtx-accordion__details` and `.mtx-accordion-actions` are wrapped in one. The initial state is read from the summary's `aria-expanded="true"` or the `mtx-accordion--expanded` class.

```html
<div class="mtx-accordion" data-mtx="accordion">
  <h3 class="mtx-accordion__heading">
    <button class="mtx-accordion__summary" type="button" aria-expanded="true">
      <span class="mtx-accordion__summary-content">Full structure</span>
      <span class="mtx-accordion__expand-icon" aria-hidden="true">
        <span class="material-icons">expand_more</span>
      </span>
    </button>
  </h3>
  <div class="mtx-accordion__region">
    <div class="mtx-accordion__details">…</div>
    <div class="mtx-accordion-actions">…</div>
  </div>
</div>
```

## Programmatic usage

`[data-mtx="accordion"]` and `[data-mtx="accordion-group"]` elements initialize themselves. For dynamic content use `Materix.init(el)` or the classes; `Materix.getInstance(el)` returns the instance.

```javascript
// UMD (window.Materix)
const el = document.createElement('div');
el.dataset.summary = 'New panel';
el.textContent = 'Content';
container.append(el);
const accordion = Materix.init(el, 'accordion');   // or: new Materix.Accordion(el)

accordion.expand();
accordion.collapse();
accordion.toggle();
accordion.expanded = true;      // getter/setter
accordion.disable();

el.addEventListener('mtx:accordion:change', (event) => {
  console.log(event.detail.expanded);
});
```

```javascript
// ES modules
import { Accordion, AccordionGroup } from '@rubenchodev/materix-ui';

const group = new AccordionGroup(document.querySelector('#faq'));
group.collapseAll();
```

{{< mtx-demo title="expand(), collapse(), toggle() and event" layout="block" >}}
<div data-mtx="accordion" id="doc-accordion-api" data-summary="Panel controlled by the API">Content managed from JavaScript.</div>
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-1 mtx-mt-2">
  <button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-accordion-expand">expand()</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-accordion-collapse">collapse()</button>
  <button class="mtx-button mtx-button--outlined" data-mtx="button" id="doc-accordion-toggle">toggle()</button>
</div>
<p class="mtx-typography mtx-typography--body2 mtx-mt-2" id="doc-accordion-status" aria-live="polite">expanded = false</p>
{{< /mtx-demo >}}

<script>
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('doc-accordion-api');
  if (!el || !window.Materix) return;
  var accordion = Materix.getInstance(el);
  var status = document.getElementById('doc-accordion-status');
  el.addEventListener('mtx:accordion:change', function (e) {
    status.textContent = 'mtx:accordion:change → expanded = ' + e.detail.expanded;
  });
  document.getElementById('doc-accordion-expand').addEventListener('click', function () { accordion.expand(); });
  document.getElementById('doc-accordion-collapse').addEventListener('click', function () { accordion.collapse(); });
  document.getElementById('doc-accordion-toggle').addEventListener('click', function () { accordion.toggle(); });
});
</script>

## API reference

### Data attributes

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-mtx` | `accordion`, `accordion-group`, `accordion-actions` | — | Initializes the panel, the group or the actions bar. |
| `data-summary` | text | — | Summary text when the component generates it (`<div>` or `<details>` without `<summary>`). |
| `data-expanded` | present, `false` | absent | Initial expanded state (`open` also works on `<details>`). |
| `data-disabled` | present | absent | Disables the panel. |
| `data-variant` | `outlined` | elevation | 1px border instead of a shadow. Inherited from the group. |
| `data-elevation` | `0`–`4`, `6`, `8` | `1` | Surface shadow. Inherited from the group. |
| `data-square` | present | absent | No rounded corners. Inherited from the group. |
| `data-disable-gutters` | present | absent | No 16px margin or height change when expanded. Inherited from the group. |
| `data-expand-icon` | Material Icons name, `false` | `expand_more` | Expand icon; `false` omits it. |
| `data-heading-level` | `1`–`6`, `none` | `3` | Level of the heading that wraps the summary (`<div>` form only). |
| `data-ripple` | present | absent | Enables the ripple when the summary is pressed. |
| `data-duration` | ms, `auto` | `auto` | Collapse duration; `auto` derives it from the height (MUI formula). `0` = no animation. |
| `data-exclusive` | `false` | exclusive | On `accordion-group`: allows several open panels. |
| `data-summary-style` | `plain` | emphasized | `plain`: MUI flat summary (weight 400, no background or divider when expanded). Inherited from the group. |
| `data-disable-spacing` | present | absent | On `accordion-actions`: removes the 8px between actions. |

### CSS classes

| Class | Description |
|---|---|
| `.mtx-accordion` | Root (Paper with elevation 1). |
| `.mtx-accordion--expanded` | Expanded panel (managed by the component). |
| `.mtx-accordion--outlined` | Outlined variant. |
| `.mtx-accordion--elevation-{n}` | Elevation `0`–`4`, `6`, `8`. |
| `.mtx-accordion--square` | No rounded corners. |
| `.mtx-accordion--disable-gutters` | No margin or height change when expanded. |
| `.mtx-accordion--disabled` | Disabled panel. |
| `.mtx-accordion--plain-summary` | MUI flat summary (`data-summary-style="plain"`). |
| `.mtx-accordion__heading` | Unstyled `h1`–`h6` heading that wraps the summary. |
| `.mtx-accordion__summary` | Clickable button or `<summary>` (AccordionSummary). |
| `.mtx-accordion__summary-content` | Summary content. |
| `.mtx-accordion__summary-secondary` | Secondary text inside the summary. |
| `.mtx-accordion__expand-icon` | Expand icon wrapper (rotates when opened). |
| `.mtx-accordion__region` | Collapsible region with `role="region"`. |
| `.mtx-accordion__details` | Details (AccordionDetails), `8px 16px 16px` padding. |
| `.mtx-accordion-actions` | Actions bar (AccordionActions). |
| `.mtx-accordion-actions--disable-spacing` | Actions without spacing. |
| `.mtx-accordion-group` | Group container. |

### Methods

| Method | Returns | Description |
|---|---|---|
| `expand()` | `void` | Expands the panel (in an exclusive group, closes the others). |
| `collapse()` | `void` | Collapses the panel. |
| `toggle()` | `void` | Toggles the state. |
| `expanded` | `boolean` | Getter/setter for the expanded state. |
| `disable()` / `enable()` | `void` | Disables or enables the panel. |
| `disabled` | `boolean` | Whether the panel is disabled. |
| `destroy()` | `void` | Removes listeners and timers. Unlinks the instance: `getInstance()` then returns `undefined`. |
| `AccordionGroup#collapseAll()` | `void` | Collapses every panel in the group. |
| `AccordionGroup#expandAll()` | `void` | Expands every panel (only with `data-exclusive="false"`). |
| `AccordionGroup#accordions` | `Accordion[]` | Instances in the group. |
| `AccordionGroup#exclusive` | `boolean` | Whether the group is exclusive. |

### Events

| Event | detail | Fired when |
|---|---|---|
| `mtx:accordion:change` | `{ expanded }` | The panel changes state (click, keyboard, API, find-in-page or closing due to exclusivity). Bubbles. |

### CSS variables

| Variable | Default | Description |
|---|---|---|
| `--mtx-accordion-expand-icon-rotation` | `180deg` | Icon rotation when expanded. |
| `--mtx-accordion-gutter` | `16px` | Vertical margin of the expanded panel. |
| `--mtx-accordion-summary-font-weight` | `500` | Summary font weight (`400` with `plain`). |
| `--mtx-accordion-summary-expanded-bg` | `var(--mtx-color-action-selected)` | Summary background when expanded (`transparent` with `plain`). |
| `--mtx-accordion-summary-expanded-divider` | `var(--mtx-color-divider)` | Divider between the expanded summary and the details (`transparent` with `plain`). |
| `--mtx-color-background-paper` | — | Panel background. |
| `--mtx-color-divider` | — | Separators and outlined border. |
| `--mtx-color-action-focus` | — | Focused summary background. |
| `--mtx-color-action-active` | — | Expand icon color. |
| `--mtx-color-action-disabled-background` | — | Disabled panel background. |
| `--mtx-elevation-1` | — | Default shadow. |
| `--mtx-overlay-elevation-1` | — | White overlay in the dark theme (MUI elevation 1). |

## Accessibility

- The summary is a `<button>` (or the native `<summary>`) with `aria-expanded` and `aria-controls`; in the `<div>` form it sits inside an `<h3>` (configurable with `data-heading-level`), as recommended by the WAI-ARIA Accordion pattern and as MUI does.
- The region has `role="region"` and `aria-labelledby` pointing to the summary. When collapsed it is hidden with `hidden="until-found"` where supported, so Ctrl+F can find and reveal its content without exposing it to focus.
- Disabled: the `<button>` gets `disabled`; the `<summary>` gets `aria-disabled="true"` and `tabindex="-1"`.
- The transition honors `prefers-reduced-motion`.

| Key | Action |
|---|---|
| `Enter` / `Space` | Toggles the focused panel. |
| `Tab` / `Shift+Tab` | Moves through summaries and the content of open panels. |
| `↓` / `↑` | In an `accordion-group`: focus the next / previous summary (wraps, skips disabled ones). |
| `Home` / `End` | In an `accordion-group`: focus the first / last summary. |
