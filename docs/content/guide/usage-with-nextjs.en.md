---
title: "Usage with Next.js"
description: "Use Materix UI in the Next.js App Router: global CSS in the root layout, 'use client' boundaries and getThemeScript to apply the theme before hydration."
weight: 30
icon: "dns"
---

Materix components render on the server and hydrate on the client. Interactive components and the providers use hooks, so they are **client components** (`'use client'`); you can still render them from server components.

## Install

```bash
npx create-next-app@latest my-app --ts --app
cd my-app
npm install @rubenchodev/materix-react
```

## Root layout

Import the base stylesheet in `app/layout.tsx` (Next.js only allows global CSS there) and add the theme script to `<head>`. `getThemeScript()` returns a small inline script that sets `data-mtx-theme` on `<html>` **before the first paint**, so a stored dark theme does not flash light.

```tsx
// app/layout.tsx (server component)
import '@rubenchodev/materix-ui/base.css';
import { getThemeScript } from '@rubenchodev/materix-react';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` is needed because the script changes `<html>` attributes before React hydrates.

`getThemeScript(storageKey?, options?)` accepts the same storage key as `ThemeProvider` (`'mtx-theme'` by default) and `{ defaultMode, query }`. Keep both in sync if you change them.

## Client providers

```tsx
// app/providers.tsx
'use client';

import { MaterixProvider } from '@rubenchodev/materix-react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <MaterixProvider defaultMode="system">{children}</MaterixProvider>;
}
```

## Using components

Pages can stay server components and render Materix components directly. Add `'use client'` only to your own components that use state, effects or event handlers:

```tsx
// app/page.tsx (server component)
import { Button } from '@rubenchodev/materix-react';

export default function Page() {
  return <Button variant="contained" href="/dashboard">Open dashboard</Button>;
}
```

```tsx
// app/counter.tsx
'use client';

import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount(count + 1)}>Clicked {count} times</Button>;
}
```

{{< callout type="info" title="Server and client render match" >}}
Providers read browser APIs (`localStorage`, `matchMedia`, `?theme=`) in effects after hydration, so the server HTML and the first client render are identical. The inline theme script is what avoids the flash meanwhile. You can also render it as a component: `<ThemeScript />`.
{{< /callout >}}
