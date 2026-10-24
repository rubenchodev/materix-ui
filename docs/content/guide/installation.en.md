---
title: "Installation"
description: "Install @rubenchodev/materix-react, import the base stylesheet, load Roboto and Material Icons, and wrap your app in MaterixProvider."
weight: 10
icon: "download"
---

Materix UI for React ships as **ES modules with TypeScript types**. Styles come from the shared package `@rubenchodev/materix-ui`, which is installed automatically as a dependency.

## Requirements

| Requirement | Version |
|---|---|
| React and React DOM | 18 or later (peer dependencies) |
| Node.js | 18 or later |
| Bundler | Any bundler that understands CSS imports: Vite, Next.js, webpack, Rspack, Parcel… |

## Install the package

```bash
npm install @rubenchodev/materix-react
```

`pnpm add` and `yarn add` work the same way. React is not bundled: your app provides it.

## Import the base stylesheet

Import the base CSS **once**, at the entry point of your app. It contains the `--mtx-*` design tokens, the light and dark themes and the `.mtx-root` base styles. Each component imports its own CSS, so you only ship the styles you use.

```tsx
// main.tsx (or app/layout.tsx in Next.js)
import '@rubenchodev/materix-ui/base.css';
```

## Fonts

Components use **Roboto** and the **Material Icons** font, like MUI. Load them in the `<head>` of your HTML:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```

{{< callout type="tip" title="Self-hosting" >}}
If you prefer not to depend on Google Fonts, install `@fontsource/roboto` and `material-icons` from npm and import their CSS next to `base.css`.
{{< /callout >}}

## Wrap your app

`MaterixProvider` combines the theme (`ThemeProvider`), the language (`I18nProvider`) and the `.mtx-root` container that applies the base typography. It is optional (every component works without it), but it is the recommended starting point.

```tsx
import { MaterixProvider, Button } from '@rubenchodev/materix-react';

export function App() {
  return (
    <MaterixProvider defaultMode="system" locale="en">
      <Button variant="contained">Save</Button>
    </MaterixProvider>
  );
}
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `defaultMode` | `'light' \| 'dark' \| 'system'` | `'light'` | Initial theme when there is no stored value or `?theme=` in the URL. |
| `mode` | `'light' \| 'dark' \| 'system'` | — | Controlled theme. |
| `locale` | `string` | `<html lang>` | Language of the built-in texts (`en`, `es`, `es-MX`…). |
| `messages` | `LocaleMessages` | — | Overrides of the built-in texts, per language. |
| `disableRoot` | `boolean` | `false` | Does not render the `.mtx-root` container. |

## Importing components

Import from the package root, or from `components/{name}` to keep a module boundary explicit:

```tsx
import { Button, TextField } from '@rubenchodev/materix-react';
import { Dialog } from '@rubenchodev/materix-react/components/dialog';
```

Both forms are tree-shakeable.
