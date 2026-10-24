---
title: "Usage with Vite"
description: "Create a Vite + React + TypeScript project and add Materix UI: base stylesheet, fonts, provider and the first component."
weight: 20
icon: "bolt"
---

Vite needs no extra configuration: it handles the CSS that each component imports out of the box.

## Create the project

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm install @rubenchodev/materix-react
```

## Add the fonts

Add Roboto and Material Icons to the `<head>` of `index.html`. Setting `lang` also gives the built-in texts the right language:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <title>My app</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Entry point

Import the base stylesheet once and wrap the app in `MaterixProvider`:

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@rubenchodev/materix-ui/base.css';
import { MaterixProvider } from '@rubenchodev/materix-react';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MaterixProvider defaultMode="system">
      <App />
    </MaterixProvider>
  </StrictMode>,
);
```

## First component

```tsx
// src/App.tsx
import { Button, useTheme } from '@rubenchodev/materix-react';

export function App() {
  const { resolvedMode, toggle } = useTheme();
  return (
    <Button variant="contained" onClick={toggle}>
      Switch to {resolvedMode === 'dark' ? 'light' : 'dark'} theme
    </Button>
  );
}
```

Run `npm run dev` and open the URL that Vite prints.

{{< callout type="tip" title="Remove the template styles" >}}
The Vite template ships `index.css` and `App.css` with its own colors and fonts. Delete them (and their imports) so they do not override the Materix tokens.
{{< /callout >}}
