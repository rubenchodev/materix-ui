---
title: "Accordion"
description: "Panels that show and hide related sections of content behind a clickable summary, ideal for FAQs and grouped settings."
group: "surfaces"
icon: "expand_circle_down"
weight: 5
example: "accordion"
import: "Accordion, AccordionSummary, AccordionDetails, AccordionActions, AccordionGroup"
mui: "https://mui.com/material-ui/react-accordion/"
---

`Accordion` organizes content into collapsible panels: a clickable summary (AccordionSummary) shows or hides the details (AccordionDetails) with a height transition. Use it for FAQs, sectioned settings or secondary information that shouldn't take up space permanently. Don't use it for primary navigation (use [Tabs](../tabs/) or a [Drawer](../drawer/)) or to hide content users always need to see.

```tsx
import { Accordion, AccordionGroup } from '@rubenchodev/materix-react';
// or just this component:
import { Accordion, AccordionGroup } from '@rubenchodev/materix-react/components/accordion';
```

## Basic usage

The simplest form: the `summary` prop is the summary text and the children become the details (the equivalent of the vanilla single-element syntax with `data-summary`). It renders the `<h3>` heading, the `<button>` with `aria-expanded` and `aria-controls`, the `expand_more` icon and the collapsible region. Adjacent panels share 1px separators and only the first and last ones get rounded corners.

{{< react-demo id="accordion/01-basic" layout="block" >}}

## From details

`component="details"` renders a native `<details>`/`<summary>`: with server rendering it works even before React hydrates. The panel keeps the MUI look, the height animation and the icon; `defaultExpanded` sets `open`, and the browser's find-in-page (Ctrl+F) opens the panel that contains the match (reported through `onChange`).

{{< react-demo id="accordion/02-details" layout="block" >}}

{{< callout type="info" >}}A `<summary>` can't live inside a heading, so the `details` form doesn't generate an `<h3>`. If the heading outline matters for your page, use the default `div` form.{{< /callout >}}

## Variants

By default the accordion is a [Paper](../paper/) surface with elevation 1. `variant="outlined"` uses a 1px border (adjacent borders are merged), `elevation={0}` makes it flat and `square` removes the rounded corners.

{{< react-demo id="accordion/03-variants" layout="block" >}}

## Summary style

By default the summary uses medium weight (500) and, while the panel is expanded, an `--mtx-color-action-selected` background plus a bottom divider, also in the `outlined` variant. Focus (`--mtx-color-action-focus`) takes precedence over that background. `summaryStyle="plain"` (on the panel or on the group) restores MUI's flat look: regular weight, no background and no divider. Tune it with the `--mtx-accordion-summary-*` CSS variables.

{{< callout type="info" title="Deliberate deviation from MUI" >}}
MUI's `AccordionSummary` uses regular weight and the same background as the details. Materix emphasizes the summary by default so an open panel's heading is easy to tell from its content. Use `summaryStyle="plain"` for the original MUI look.
{{< /callout >}}

{{< react-demo id="accordion/04-summary-style" layout="block" >}}

## Gutters

When expanded, the panel gets a 16px vertical margin and the summary grows from 48px to 64px. `disableGutters` keeps the 48px height and removes the margin.

{{< react-demo id="accordion/05-gutters" layout="block" >}}

## With icons

The expand icon is `expand_more` and rotates 180° when opened. `expandIcon` accepts a Material Icons name or any node (for example an SVG), and `expandIcon={false}` omits it. The rotation angle is set with the `--mtx-accordion-expand-icon-rotation` variable (for example `45deg` for an `add` icon). The `summary` prop also accepts nodes, such as a leading icon.

{{< react-demo id="accordion/06-icons" layout="block" >}}

## States

Keyboard focus paints the summary with the `action.focus` background, like MUI. `disabled` dims the summary to 38%, applies the disabled background and blocks interaction. As in MUI, the summary has no ripple by default; `ripple` enables it. `duration` fixes the collapse time in milliseconds (`'auto'`, the default, derives it from the height with the MUI formula; `0` disables the animation).

{{< react-demo id="accordion/07-states" layout="block" >}}

## Exclusive group

`AccordionGroup` keeps a single panel open (MUI's "Controlled accordion" pattern) and enables arrow, Home and End navigation between summaries. With `exclusive={false}` several panels can be open. The group passes `variant`, `elevation`, `square`, `disableGutters` and `summaryStyle` down to the panels that don't set them. When several panels start with `defaultExpanded` in an exclusive group, only the first one stays open.

{{< react-demo id="accordion/08-exclusive-group" layout="block" >}}

## Actions

An `AccordionActions` child is placed at the bottom of the region, after the details, right-aligned with 8px between buttons. `disableSpacing` removes that spacing.

{{< react-demo id="accordion/09-actions" layout="block" >}}

## Real-world examples

An FAQ built with `component="details"` inside an exclusive group, and settings whose summary carries secondary text (`AccordionSummary` with `secondary`, as in MUI's "Controlled accordion" demo).

{{< react-demo id="accordion/10-use-cases" layout="block" >}}

### Accordions in a grid

{{< react-demo id="accordion/11-grid" layout="block" >}}

## Programmatic usage

The vanilla `expand()`, `collapse()`, `toggle()` and `expanded` setter become the controlled `expanded` prop plus `onChange`, which replaces the `mtx:accordion:change` event. The `AccordionGroup` methods `expandAll()` and `collapseAll()` are available through `actionRef`.

{{< react-demo id="accordion/12-programmatic" layout="block" >}}

```tsx
const [expanded, setExpanded] = useState(false);

<Accordion summary="Panel" expanded={expanded} onChange={(event, next) => setExpanded(next)}>
  Content
</Accordion>;

const group = useRef<AccordionGroupActions>(null);
<AccordionGroup exclusive={false} actionRef={group}>…</AccordionGroup>;
group.current?.collapseAll();
```

## Composition with subcomponents

For full control (the equivalent of the vanilla BEM syntax), compose `AccordionSummary`, `AccordionDetails` and `AccordionActions`. If there is no `AccordionDetails`, the remaining children are wrapped in one; actions always go after the details.

{{< react-demo id="accordion/13-composition" layout="block" >}}

## API reference

### Accordion

| Prop | Type | Default | Description |
|---|---|---|---|
| `summary` | `ReactNode` | — | Summary content (simplified syntax). Ignored when there is an `AccordionSummary` child. |
| `expanded` | `boolean` | — | Expanded state (controlled). |
| `defaultExpanded` | `boolean` | `false` | Initial state (uncontrolled). |
| `onChange` | `(event: SyntheticEvent \| null, expanded: boolean) => void` | — | State change (click, keyboard, find-in-page or closing due to exclusivity). `event` is `null` when it does not come from React (find-in-page, `actionRef`). |
| `disabled` | `boolean` | `false` | Disables the panel. |
| `variant` | `'elevation' \| 'outlined'` | `'elevation'` | Shadow or 1px border. Inherited from the group. |
| `elevation` | `0 \| 1 \| 2 \| 3 \| 4 \| 6 \| 8` | CSS elevation 1 | Surface shadow. Inherited from the group. |
| `square` | `boolean` | `false` | No rounded corners. Inherited from the group. |
| `disableGutters` | `boolean` | `false` | No margin or height change when expanded. Inherited from the group. |
| `summaryStyle` | `'emphasized' \| 'plain'` | `'emphasized'` | `plain`: MUI flat summary. Inherited from the group. |
| `expandIcon` | `ReactNode \| false` | `'expand_more'` | Expand icon (Material Icons name or node); `false` omits it. |
| `headingLevel` | `1`–`6` \| `'none'` | `3` | Heading that wraps the summary (`div` form only). |
| `ripple` | `boolean` | `false` | Ripple when the summary is pressed. |
| `duration` | `number \| 'auto'` | `'auto'` | Collapse duration in ms; `0` = no animation. |
| `component` | `'div' \| 'details'` | `'div'` | `details` uses the native `<details>/<summary>`. |

`ref`, `id`, `className`, `style` and the remaining attributes go to the root. `id` is used as the base of the summary (`{id}-summary`) and region (`{id}-region`) ids.

### AccordionGroup

| Prop | Type | Default | Description |
|---|---|---|---|
| `exclusive` | `boolean` | `true` | Only one open panel. |
| `variant`, `elevation`, `square`, `disableGutters`, `summaryStyle` | as in `Accordion` | — | Options inherited by the panels. |
| `actionRef` | `Ref<AccordionGroupActions>` | — | Receives `expandAll()` (non-exclusive groups only) and `collapseAll()`. |

### Parts

| Component | Props | Description |
|---|---|---|
| `AccordionSummary` | `children`, `secondary`, `expandIcon` | Heading + `<button>` (or `<summary>`); `ref` points to the button. |
| `AccordionDetails` | — | `.mtx-accordion__details`. |
| `AccordionActions` | `disableSpacing` | `.mtx-accordion-actions`, placed after the details. |

### Vanilla equivalence

| Vanilla | React |
|---|---|
| `data-summary` | `summary` |
| `data-expanded` / `details[open]` | `defaultExpanded` (or controlled `expanded`) |
| `data-disabled`, `disable()` / `enable()` | `disabled` |
| `data-variant`, `data-elevation`, `data-square`, `data-disable-gutters`, `data-summary-style` | `variant`, `elevation`, `square`, `disableGutters`, `summaryStyle` |
| `data-expand-icon`, `data-heading-level`, `data-ripple`, `data-duration` | `expandIcon`, `headingLevel`, `ripple`, `duration` |
| `<details data-mtx="accordion">` | `component="details"` |
| `data-mtx="accordion-group"`, `data-exclusive="false"` | `AccordionGroup`, `exclusive={false}` |
| `data-mtx="accordion-actions"`, `data-disable-spacing` | `AccordionActions`, `disableSpacing` |
| `expand()`, `collapse()`, `toggle()`, `expanded` | `expanded` + `onChange` |
| `AccordionGroup#expandAll()` / `collapseAll()` | `actionRef` |
| `mtx:accordion:change` (`detail.expanded`) | `onChange(event, expanded)` |

### CSS classes and variables

The same as the vanilla library: `mtx-accordion` (`--expanded`, `--outlined`, `--elevation-{n}`, `--square`, `--disable-gutters`, `--disabled`, `--plain-summary`), `mtx-accordion__heading`, `__summary`, `__summary-content`, `__summary-secondary`, `__expand-icon`, `__region`, `__details`, `mtx-accordion-actions` (`--disable-spacing`) and `mtx-accordion-group`. Variables: `--mtx-accordion-expand-icon-rotation` (180deg), `--mtx-accordion-gutter` (16px), `--mtx-accordion-summary-font-weight` (500), `--mtx-accordion-summary-expanded-bg` and `--mtx-accordion-summary-expanded-divider`.

## Accessibility

- The summary is a `<button>` (or the native `<summary>`) with `aria-expanded` and `aria-controls`; in the `div` form it sits inside an `<h3>` (configurable with `headingLevel`), as recommended by the WAI-ARIA Accordion pattern.
- The region has `role="region"` and `aria-labelledby` pointing to the summary. When collapsed it is hidden from focus and screen readers, and with `hidden="until-found"` where supported, so Ctrl+F can find and reveal its content.
- Disabled: the `<button>` gets `disabled`; the `<summary>` gets `aria-disabled="true"` and `tabindex="-1"`.
- The transition honors `prefers-reduced-motion`.

| Key | Action |
|---|---|
| `Enter` / `Space` | Toggles the focused panel. |
| `Tab` / `Shift+Tab` | Moves through summaries and the content of open panels. |
| `↓` / `↑` | In an `AccordionGroup`: focus the next / previous summary (wraps, skips disabled ones). |
| `Home` / `End` | In an `AccordionGroup`: focus the first / last summary. |
