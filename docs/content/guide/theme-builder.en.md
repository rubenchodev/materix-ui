---
title: "Theme builder"
description: "Pick your brand palette, light or dark mode, shape and font, preview real Materix components live and export the CSS override."
weight: 45
icon: "palette"
wide: true
toc: false
---

Choose a **main** color for each palette entry. The builder derives `-light` and `-dark` the same way MUI's `augmentColor` does (`lighten(main, 0.2)`, `darken(main, 0.3)`), plus `-contrast` (white or `rgba(0, 0, 0, 0.87)` text on the color) and `-text` (the color for text on the background). In **WCAG AA** contrast mode, the default and the library's own default, `-contrast` uses MUI's `contrastThreshold: 4.5` and `-text` is the main color, or a darker (light mode) or lighter (dark mode) shade of it, until it reaches 4.5:1 on the strictest background (the grey of filled fields). **Exact MUI** mode uses `contrastThreshold: 3` and the main color as `-text`, like MUI's defaults, and flags every combination below **4.5:1**. Light and dark palettes are edited separately: switch the mode to edit and preview each one. Your choices are saved in this browser.

{{< theme-builder >}}

## Using the generated CSS

Save the file (for example `materix-theme.css`) and load it **after** the library stylesheet, so its tokens win over the defaults:

```html
<link rel="stylesheet" href="materix.min.css">
<link rel="stylesheet" href="materix-theme.css">
```

The `:root` block holds the light palette, shape and font; the `[data-mtx-theme="dark"]` block only overrides the palette for the dark theme. If you pick a font other than Roboto or the system font, also add the Google Fonts `<link>` shown in the comment at the top of the file. Every other token (text, background, action states, elevation…) is described in [Theming and customization]({{< relref "/guide/theming" >}}).

{{< callout type="tip" title="Contrast warnings" >}}
Warnings only appear in **Exact MUI** mode (or with colors where neither white nor dark text reaches 4.5:1). A warning on the **contained** text means white or dark text on the main color is below 4.5:1 (MUI's own `warning` and `info` defaults are in that case). A warning on the **background** means text or outlined buttons in that color are hard to read: switch to WCAG AA or pick a darker shade in light mode or a lighter one in dark mode. See [Color contrast]({{< relref "/guide/accessibility#color-contrast" >}}).
{{< /callout >}}
