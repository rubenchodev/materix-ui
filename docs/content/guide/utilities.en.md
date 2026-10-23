---
title: "Utilities"
description: "Mobile-first mtx-* classes for display, flex, alignment, gap, spacing, sizing, text, color, position, borders and elevation, to build layouts without custom CSS."
weight: 35
icon: "build"
---

Materix ships a system of single-purpose **utility classes**, Bootstrap-style, with MUI's tokens and look. Together with [Container]({{< relref "/components/container" >}}), [Stack]({{< relref "/components/stack" >}}) and [Grid]({{< relref "/components/grid" >}}) they let you lay out a whole application without writing custom CSS: your stylesheet is left only for branding (illustrations, gradients, charts).

- They all start with `mtx-` and use `!important`, so they always win over component styles.
- Values come from the `--mtx-*` tokens: they follow the light/dark theme and your brand theme.
- They ship in `materix.min.css`; no JavaScript required.

## Breakpoints and infixes

Responsive utilities are *mobile-first*: the class without an infix applies from 0px and the class with an infix applies **from** that width up (`min-width`). The infix goes right after the group: `mtx-d-md-none`, `mtx-p-lg-4`, `mtx-flex-sm-row`, `mtx-text-md-start`.

| Infix | Min width | Example |
|---|---|---|
| (none) | 0px | `mtx-d-none` |
| `sm` | 600px | `mtx-d-sm-block` |
| `md` | 900px | `mtx-flex-md-row` |
| `lg` | 1200px | `mtx-gap-lg-4` |
| `xl` | 1536px | `mtx-px-xl-6` |

{{< mtx-demo title="Resize the window" layout="row" >}}
<span class="mtx-d-sm-none mtx-bg-primary mtx-rounded mtx-px-2 mtx-py-1">xs</span>
<span class="mtx-d-none mtx-d-sm-inline-block mtx-d-md-none mtx-bg-primary mtx-rounded mtx-px-2 mtx-py-1">sm</span>
<span class="mtx-d-none mtx-d-md-inline-block mtx-d-lg-none mtx-bg-primary mtx-rounded mtx-px-2 mtx-py-1">md</span>
<span class="mtx-d-none mtx-d-lg-inline-block mtx-d-xl-none mtx-bg-primary mtx-rounded mtx-px-2 mtx-py-1">lg</span>
<span class="mtx-d-none mtx-d-xl-inline-block mtx-bg-primary mtx-rounded mtx-px-2 mtx-py-1">xl</span>
{{< /mtx-demo >}}

### Spacing scale

Gap, margin and padding use the `{n}` scale = `0`, `0_5`, `1`, `1_5`, `2`, `2_5`, `3`, `4`, `5`, `6`, `8`, `10`, i.e. `n × 8px` through the `--mtx-spacing-{n}` tokens (`0_5` = 4px, `1_5` = 12px, `2_5` = 20px).

## Display

| Classes | Responsive | Property |
|---|---|---|
| `mtx-d-{none, block, inline, inline-block, flex, inline-flex, grid, contents}` | Yes: `mtx-d-{bp}-*` | `display` |

The `hidden` attribute always wins inside `.mtx-root` (`[hidden] { display: none !important }`), even if the element has `mtx-d-flex`.

{{< mtx-demo title="Hide on mobile, show from md" layout="row" >}}
<span class="mtx-d-inline-flex mtx-align-items-center mtx-gap-1"><span class="material-icons" aria-hidden="true">smartphone</span>Always visible</span>
<span class="mtx-d-none mtx-d-md-inline-flex mtx-align-items-center mtx-gap-1"><span class="material-icons" aria-hidden="true">desktop_windows</span>Only from 900px</span>
{{< /mtx-demo >}}

## Flex

| Classes | Responsive | Property |
|---|---|---|
| `mtx-flex-{row, column, row-reverse, column-reverse}` | Yes | `flex-direction` |
| `mtx-flex-wrap` · `mtx-flex-nowrap` | Yes | `flex-wrap` |
| `mtx-flex-1` | No | `flex: 1 1 0%` |
| `mtx-flex-grow-{0,1}` · `mtx-flex-shrink-{0,1}` | No | `flex-grow` / `flex-shrink` |
| `mtx-min-w-0` | No | `min-width: 0` (lets text truncate inside flex) |

{{< mtx-demo title="Column on mobile, row from md, flexible middle" layout="block" >}}
<div class="mtx-d-flex mtx-flex-column mtx-flex-md-row mtx-gap-1">
  <div class="mtx-paper mtx-paper--outlined mtx-p-2 mtx-flex-shrink-0">Fixed</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2 mtx-flex-1 mtx-min-w-0 mtx-text-truncate">Takes the remaining space and truncates a long text that doesn't fit</div>
  <div class="mtx-paper mtx-paper--outlined mtx-p-2 mtx-flex-shrink-0">Fixed</div>
</div>
{{< /mtx-demo >}}

## Alignment

| Classes | Responsive | Property |
|---|---|---|
| `mtx-align-items-{start, center, end, baseline, stretch}` | Yes | `align-items` |
| `mtx-align-self-{start, center, end, stretch}` | Yes | `align-self` |
| `mtx-justify-content-{start, center, end, between, around, evenly}` | Yes | `justify-content` |
| `mtx-align-content-{start, center, between}` | Yes | `align-content` |

{{< mtx-demo title="Bar with title and actions" layout="block" >}}
<div class="mtx-d-flex mtx-justify-content-between mtx-align-items-center mtx-p-2 mtx-border mtx-rounded">
  <span class="mtx-typography--h6">Orders</span>
  <button class="mtx-button mtx-button--contained" data-mtx="button" type="button">New</button>
</div>
{{< /mtx-demo >}}

## Gap

| Classes | Responsive | Property |
|---|---|---|
| `mtx-gap-{n}` | Yes | `gap` |
| `mtx-row-gap-{n}` · `mtx-column-gap-{n}` | Yes | `row-gap` / `column-gap` |

{{< mtx-demo title="gap-1 on mobile, gap-md-4 from 900px" layout="block" >}}
<div class="mtx-d-flex mtx-flex-wrap mtx-gap-1 mtx-gap-md-4">
  <div data-mtx="chip" data-label="One"></div>
  <div data-mtx="chip" data-label="Two"></div>
  <div data-mtx="chip" data-label="Three"></div>
</div>
{{< /mtx-demo >}}

## Spacing

| Classes | Responsive | Property |
|---|---|---|
| `mtx-m-{n}` · `mtx-mx-{n}` · `mtx-my-{n}` | Yes | `margin`, `margin-inline`, `margin-block` |
| `mtx-mt-{n}` · `mtx-mb-{n}` · `mtx-ms-{n}` · `mtx-me-{n}` | Yes | `margin-top`, `margin-bottom`, `margin-inline-start`, `margin-inline-end` |
| `mtx-p-{n}` · `mtx-px-{n}` · `mtx-py-{n}` | Yes | `padding`, `padding-inline`, `padding-block` |
| `mtx-pt-{n}` · `mtx-pb-{n}` · `mtx-ps-{n}` · `mtx-pe-{n}` | No | `padding-top`, `padding-bottom`, `padding-inline-*` |
| `mtx-{m, ms, me, mx, mt, mb}-auto` | Yes | auto margin |
| `mtx-ml-{0..4,auto}` · `mtx-mr-*` · `mtx-pl-{0..4}` · `mtx-pr-*` | No | Legacy (physical) aliases. Prefer `ms`/`me`/`ps`/`pe`. |

`s` (start) and `e` (end) are **logical**: they follow the text direction (in RTL, `ms` is the right margin).

{{< mtx-demo title="mtx-ms-auto pushes to the end" layout="block" >}}
<div class="mtx-d-flex mtx-align-items-center mtx-gap-1 mtx-p-1 mtx-border mtx-rounded">
  <span class="mtx-typography--subtitle2 mtx-px-1">Materix</span>
  <button class="mtx-button mtx-button--text mtx-ms-auto" data-mtx="button" type="button">Log in</button>
  <button class="mtx-button mtx-button--contained" data-mtx="button" type="button">Sign up</button>
</div>
{{< /mtx-demo >}}

## Sizing

| Class | Property |
|---|---|
| `mtx-w-{25, 50, 75, 100, auto}` | `width` |
| `mtx-h-{100, auto}` | `height` |
| `mtx-mw-100` · `mtx-mh-100` | `max-width: 100%` · `max-height: 100%` |
| `mtx-vh-100` · `mtx-min-vh-100` | `height` / `min-height` of `100dvh` (with a `100vh` fallback) |

## Text and typography

| Classes | Responsive | Property |
|---|---|---|
| `mtx-text-{start, center, end}` | Yes | `text-align` (logical) |
| `mtx-text-nowrap` · `mtx-text-wrap` | No | `white-space` |
| `mtx-text-truncate` | No | single line with an ellipsis |
| `mtx-line-clamp-{2, 3}` | No | clamps to 2 or 3 lines |
| `mtx-text-{uppercase, lowercase, capitalize}` · `mtx-text-decoration-none` | No | transform / underline |
| `mtx-fw-{light, regular, medium, bold}` | No | `font-weight` 300 / 400 / 500 / 700 |
| `mtx-tabular-nums` · `mtx-lh-1` | No | tabular figures · `line-height: 1` |
| `mtx-typography--{h1…h6, subtitle1, subtitle2, body1, body2, caption, overline, button}` | No | MUI type scale as a plain class, on any tag, no JS |
| `mtx-typography--{sm, md, lg, xl}-{variant}` | Yes | Switches the variant from that breakpoint up (mobile-first): `mtx-typography--h4 mtx-typography--md-h3` |
| `mtx-typography--responsive` | — | Fluid h1–h6 scale with `clamp()` (like MUI's `responsiveFontSizes`); on the element or any ancestor, including `<html>` |

{{< mtx-demo title="Typography as a class" layout="column" >}}
<h3 class="mtx-typography--h6">An h3 that looks like h6</h3>
<span class="mtx-typography--overline mtx-color-text-secondary">Overline on a span</span>
<p class="mtx-typography--body2 mtx-line-clamp-2">This long paragraph uses mtx-line-clamp-2: Materix UI implements Material UI components with vanilla CSS and JavaScript, without frameworks or Shadow DOM, with accessibility built in and token-based light and dark themes.</p>
<span class="mtx-typography--h5 mtx-tabular-nums mtx-fw-medium">$12,480.00</span>
{{< /mtx-demo >}}

{{< mtx-demo title="Responsive typography" layout="column" >}}
<h3 class="mtx-typography--h5 mtx-typography--md-h4 mtx-typography--lg-h3">h5 on mobile, h4 from 900px, h3 from 1200px</h3>
<h2 class="mtx-typography--h3 mtx-typography--responsive">Fluid headline with clamp()</h2>
{{< /mtx-demo >}}

More details in [Typography]({{< relref "/components/typography" >}}).

## Color

| Classes | Property |
|---|---|
| `mtx-color-{text-primary, text-secondary, text-disabled, primary, secondary, success, error, warning, info, inherit}` | `color` |
| `mtx-bg-{paper, default, action-hover, action-selected, transparent}` | `background-color` |
| `mtx-bg-primary` · `mtx-bg-secondary` | palette background **and** contrast text color |

{{< mtx-demo title="Text and backgrounds" layout="row" >}}
<span class="mtx-color-primary">primary</span>
<span class="mtx-color-success">success</span>
<span class="mtx-color-error">error</span>
<span class="mtx-color-text-secondary">text-secondary</span>
<span class="mtx-bg-primary mtx-rounded mtx-px-2 mtx-py-1">bg-primary</span>
<span class="mtx-bg-action-selected mtx-rounded mtx-px-2 mtx-py-1">bg-action-selected</span>
{{< /mtx-demo >}}

## Accessibility

| Class | Use |
|---|---|
| `mtx-visually-hidden` | Hidden visually; screen readers still read it. For icon-only button labels or section headings. |
| `mtx-visually-hidden-focusable` | Same, but visible when it or a descendant receives focus. |
| `mtx-skip-link` | "Skip to content" link: fixed at the top left, hidden until focused with Tab, styled as a primary contained button. |

```html
<body class="mtx-root">
  <a class="mtx-skip-link" href="#main">Skip to content</a>
  …
  <main id="main" tabindex="-1">…</main>
</body>
```

## Position, layers and overflow

| Class | Property |
|---|---|
| `mtx-position-{static, relative, absolute, fixed, sticky}` | `position` |
| `mtx-sticky-top` · `mtx-sticky-{bp}-top` | `position: sticky` with `top: var(--mtx-app-bar-height)` (56px on mobile, 64px from 600px): sits right below the App Bar |
| `mtx-top-0` · `mtx-bottom-0` · `mtx-start-0` · `mtx-end-0` · `mtx-inset-0` | offsets set to 0 (`start`/`end` are logical) |
| `mtx-z-{0, 1, 2, 3, app-bar, drawer, modal}` | `z-index` (the last three reuse `--mtx-z-index-*`) |
| `mtx-scroll-smooth` | `scroll-behavior: smooth` (usually on `<html>`); turned off under `prefers-reduced-motion: reduce` |
| `mtx-scroll-mt-app-bar` | `scroll-margin-top: var(--mtx-app-bar-height)`: an anchor target does not end up under the App Bar |
| `mtx-overflow-{hidden, auto, visible}` · `mtx-overflow-x-auto` · `mtx-overflow-y-auto` | `overflow` |

Pages with a `fixed` or `sticky` [App Bar]({{< relref "/components/app-bar" >}}) already reserve its height on `<html>` with an automatic `scroll-padding-top`; use `mtx-scroll-mt-app-bar` for specific targets or when that adjustment is turned off.

```html
<html class="mtx-scroll-smooth">
  …
  <section id="pricing" class="mtx-scroll-mt-app-bar">…</section>
```

## Borders, radius and elevation

| Class | Property |
|---|---|
| `mtx-border` · `mtx-border-{top, bottom, start, end}` | 1px border in `--mtx-color-divider` |
| `mtx-border-0` | no border |
| `mtx-border-{primary, error, divider}` | border color |
| `mtx-rounded` · `mtx-rounded-{0, 2, 3}` | 4px radius (`--mtx-shape-radius`), 0, 8px, 12px |
| `mtx-rounded-circle` · `mtx-rounded-pill` | 50% · 9999px |
| `mtx-elevation-{0…8, 12, 16, 24}` | MUI shadows `--mtx-elevation-*` |

{{< mtx-demo title="Borders and elevation" layout="row" >}}
<span class="mtx-border mtx-rounded mtx-p-2">border</span>
<span class="mtx-border mtx-border-primary mtx-rounded-2 mtx-p-2">primary · r2</span>
<span class="mtx-bg-paper mtx-rounded mtx-elevation-2 mtx-p-2">elevation-2</span>
<span class="mtx-bg-paper mtx-rounded mtx-elevation-8 mtx-p-2">elevation-8</span>
{{< /mtx-demo >}}

## Miscellaneous

| Class | Use |
|---|---|
| `mtx-stretched-link` | Stretches the link's clickable area to its nearest `position: relative` ancestor (clickable cards without nesting interactive elements). |
| `mtx-stretched-link-above` | Lifts a control (button, chip, link) above the `mtx-stretched-link` area so it stays clickable. Same as `mtx-position-relative mtx-z-2`. |
| `mtx-list-unstyled` | List without bullets, `padding` or `margin` (for `<ul>`/`<ol>` in flex or grid). Combines with `mtx-m*-{n}`. |
| `mtx-pointer-events-none` · `mtx-user-select-none` · `mtx-cursor-pointer` | Pointer interaction. |
| `mtx-object-cover` | `object-fit: cover` for images and videos. |

### Controls above a stretched link

The `::after` of `mtx-stretched-link` covers the container with `z-index: 1`. As in Bootstrap, controls that must keep working inside the container get `mtx-stretched-link-above` (or `mtx-position-relative mtx-z-2`).

{{< mtx-demo title="Clickable card with its own actions" layout="column" >}}
<article class="mtx-position-relative mtx-bg-paper mtx-border mtx-rounded mtx-p-2 mtx-d-flex mtx-flex-column mtx-gap-1">
  <h3 class="mtx-typography--h6"><a class="mtx-stretched-link mtx-text-decoration-none mtx-color-inherit" href="#controls-above-a-stretched-link">Utilities guide</a></h3>
  <p class="mtx-typography--body2 mtx-color-text-secondary">The whole card opens the article; the actions below stay independent.</p>
  <ul class="mtx-list-unstyled mtx-d-flex mtx-gap-1" role="list">
    <li><a class="mtx-button mtx-button--outlined mtx-stretched-link-above" data-mtx="button" data-size="small" href="#miscellaneous">CSS</a></li>
    <li><button type="button" class="mtx-button mtx-button--text mtx-position-relative mtx-z-2" data-mtx="button" data-size="small" data-start-icon="bookmark_border">Save</button></li>
  </ul>
</article>
{{< /mtx-demo >}}

> `list-style: none` makes Safari/VoiceOver stop announcing the list: add `role="list"` when list semantics matter.

## Recipes

Common patterns built only with Materix utilities and components.

### App shell

Top bar, side navigation visible from 900px and centered main content.

{{< mtx-demo title="App shell" layout="block" height="360px" >}}
<div class="mtx-d-flex mtx-flex-column mtx-border mtx-rounded mtx-overflow-hidden">
  <header data-mtx="app-bar" data-position="static" data-color="primary" data-title="Dashboard" data-start-icon="menu"></header>
  <div class="mtx-d-flex mtx-flex-1">
    <nav class="mtx-d-none mtx-d-md-block mtx-border-end mtx-bg-paper mtx-flex-shrink-0" aria-label="Main">
      <ul data-mtx="list" aria-label="Sections">
        <li data-mtx="list-item" data-icon="dashboard">Overview</li>
        <li data-mtx="list-item" data-icon="shopping_cart">Orders</li>
        <li data-mtx="list-item" data-icon="people">Customers</li>
      </ul>
    </nav>
    <main class="mtx-flex-1 mtx-min-w-0 mtx-py-3">
      <div data-mtx="container" data-max-width="md">
        <h2 class="mtx-typography--h5 mtx-mt-0 mtx-mb-2">Overview</h2>
        <p class="mtx-typography--body2 mtx-color-text-secondary">Content is centered with Container and the side navigation shows from 900px with mtx-d-none mtx-d-md-block.</p>
      </div>
    </main>
  </div>
</div>
{{< /mtx-demo >}}

On a real page use `mtx-min-vh-100` on the wrapper and the [Drawer]({{< relref "/components/drawer" >}}) component for navigation.

### Centered authentication

{{< mtx-demo title="Centered form" layout="block" >}}
<div class="mtx-d-flex mtx-align-items-center mtx-justify-content-center mtx-bg-default mtx-py-5 mtx-px-2">
  <form class="mtx-bg-paper mtx-border mtx-rounded mtx-p-3 mtx-p-sm-4 mtx-w-100" data-mtx="container" data-max-width="xs" data-disable-gutters>
    <div data-mtx="stack" data-spacing="2">
      <div class="mtx-text-center">
        <h2 class="mtx-typography--h5 mtx-mt-0">Sign in</h2>
        <p class="mtx-typography--body2 mtx-color-text-secondary">Access your account</p>
      </div>
      <input data-mtx="text-field" data-label="Email" data-variant="outlined" type="email" autocomplete="email">
      <input data-mtx="text-field" data-label="Password" data-variant="outlined" type="password" autocomplete="current-password">
      <button class="mtx-button mtx-button--contained mtx-w-100" data-mtx="button" type="button">Sign in</button>
    </div>
  </form>
</div>
{{< /mtx-demo >}}

### Empty state

{{< mtx-demo title="No results" layout="block" >}}
<div class="mtx-d-flex mtx-flex-column mtx-align-items-center mtx-text-center mtx-gap-1 mtx-py-5 mtx-px-2 mtx-border mtx-rounded">
  <span class="material-icons mtx-color-text-disabled" aria-hidden="true">inbox</span>
  <h3 class="mtx-typography--subtitle1 mtx-my-0">No messages</h3>
  <p class="mtx-typography--body2 mtx-color-text-secondary">When you get an email it will show up here.</p>
  <button class="mtx-button mtx-button--outlined mtx-mt-1" data-mtx="button" type="button">Compose</button>
</div>
{{< /mtx-demo >}}

### Stat card

{{< mtx-demo title="KPI" layout="block" >}}
<div data-mtx="grid" data-spacing="2">
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div class="mtx-bg-paper mtx-border mtx-rounded mtx-p-2 mtx-d-flex mtx-flex-column mtx-gap-1">
      <div class="mtx-d-flex mtx-justify-content-between mtx-align-items-center">
        <span class="mtx-typography--overline mtx-color-text-secondary">Revenue</span>
        <span class="material-icons mtx-color-success" aria-hidden="true">trending_up</span>
      </div>
      <span class="mtx-typography--h4 mtx-tabular-nums">$48,290</span>
      <span class="mtx-typography--body2 mtx-color-success mtx-fw-medium">+12.4% vs. last month</span>
    </div>
  </div>
  <div data-mtx="grid" data-xs="12" data-sm="6">
    <div class="mtx-bg-paper mtx-border mtx-rounded mtx-p-2 mtx-d-flex mtx-flex-column mtx-gap-1">
      <div class="mtx-d-flex mtx-justify-content-between mtx-align-items-center">
        <span class="mtx-typography--overline mtx-color-text-secondary">Returns</span>
        <span class="material-icons mtx-color-error" aria-hidden="true">trending_down</span>
      </div>
      <span class="mtx-typography--h4 mtx-tabular-nums">1.8%</span>
      <span class="mtx-typography--body2 mtx-color-error mtx-fw-medium">+0.3 pts vs. last month</span>
    </div>
  </div>
</div>
{{< /mtx-demo >}}

## Maintenance

`src/styles/utilities.css` is a **generated** file. To add or change utilities, edit the table in `scripts/gen-utilities.mjs` and run:

```bash
npm run gen:utilities
```

A test checks that the committed file matches the generator.
