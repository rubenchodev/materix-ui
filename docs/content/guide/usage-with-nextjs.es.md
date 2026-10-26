---
title: "Uso con Next.js"
description: "Usa Materix UI en el App Router de Next.js: CSS global en el layout raíz, límites 'use client' y getThemeScript para aplicar el tema antes de hidratar."
weight: 30
icon: "dns"
---

Los componentes de Materix se renderizan en el servidor y se hidratan en el cliente. Los componentes interactivos y los proveedores usan hooks, así que son **componentes de cliente** (`'use client'`); aun así puedes renderizarlos desde componentes de servidor.

## Instalar

```bash
npx create-next-app@latest mi-app --ts --app
cd mi-app
npm install @rubenchodev/materix-react
```

## Layout raíz

Importa la hoja de estilos base en `app/layout.tsx` (Next.js solo permite CSS global ahí) y añade el script de tema al `<head>`. `getThemeScript()` devuelve un pequeño script en línea que pone `data-mtx-theme` en `<html>` **antes del primer pintado**, así un tema oscuro guardado no parpadea en claro.

```tsx
// app/layout.tsx (componente de servidor)
import '@rubenchodev/materix-ui/base.css';
import { getThemeScript } from '@rubenchodev/materix-react';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <script dangerouslySetInnerHTML={{ __html: getThemeScript(undefined, { defaultMode: 'system' }) }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` es necesario porque el script cambia atributos de `<html>` antes de que React hidrate.

`getThemeScript(storageKey?, options?)` acepta la misma clave de almacenamiento que `ThemeProvider` (`'mtx-theme'` por defecto) y `{ defaultMode, query }`. Mantén ambos sincronizados si los cambias.

## Proveedores de cliente

```tsx
// app/providers.tsx
'use client';

import { MaterixProvider } from '@rubenchodev/materix-react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <MaterixProvider defaultMode="system">{children}</MaterixProvider>;
}
```

## Usar componentes

Las páginas pueden seguir siendo componentes de servidor y renderizar componentes de Materix directamente. Añade `'use client'` solo a tus propios componentes que usen estado, efectos o manejadores de eventos:

```tsx
// app/page.tsx (componente de servidor)
import { Button } from '@rubenchodev/materix-react';

export default function Page() {
  return <Button variant="contained" href="/dashboard">Abrir panel</Button>;
}
```

```tsx
// app/counter.tsx
'use client';

import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount(count + 1)}>Pulsado {count} veces</Button>;
}
```

{{< callout type="info" title="El render de servidor y cliente coinciden" >}}
Los proveedores leen las APIs del navegador (`localStorage`, `matchMedia`, `?theme=`) en efectos tras hidratar, así que el HTML del servidor y el primer render del cliente son idénticos. Mientras tanto, el script de tema en línea es lo que evita el parpadeo. También puedes renderizarlo como componente: `<ThemeScript />`.
{{< /callout >}}
