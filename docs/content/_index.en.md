---
title: "Materix UI · React"
description: "Native React + TypeScript components with the Material UI look: the same CSS and design tokens as Materix UI, without data-mtx attributes or DOM wrappers."
---

## Up and running in a minute

Install the package, import the base stylesheet once and render components as you would with any React library.

```bash
npm install @rubenchodev/materix-react
```

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Button, MaterixProvider } from '@rubenchodev/materix-react';

export function App() {
  return (
    <MaterixProvider defaultMode="system">
      <Button variant="contained">Save</Button>
    </MaterixProvider>
  );
}
```

{{< callout type="info" title="Recommended fonts" >}}
Components use **Roboto** and the **Material Icons** font. Load them from Google Fonts to get the exact MUI look; without them everything still works with the system font. See [Installation]({{< relref "/guide/installation" >}}).
{{< /callout >}}

## Same design system, two flavors

Materix UI · React shares the CSS, the `--mtx-*` design tokens and the visual rules of the [vanilla version](https://qualitycode.dev/materix-ui/vainilla/). What changes is the API: instead of `data-*` attributes and auto-initialization, you get typed React components with props, state, refs and events. If you come from the vanilla library, read [Migrating from vanilla]({{< relref "/guide/migration" >}}).
