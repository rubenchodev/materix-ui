---
title: "Uso con Vite"
description: "Crea un proyecto Vite + React + TypeScript y añade Materix UI: hoja de estilos base, fuentes, proveedor y el primer componente."
weight: 20
icon: "bolt"
---

Vite no necesita configuración adicional: procesa de serie el CSS que importa cada componente.

## Crear el proyecto

```bash
npm create vite@latest mi-app -- --template react-ts
cd mi-app
npm install
npm install @rubenchodev/materix-react
```

## Añadir las fuentes

Añade Roboto y Material Icons al `<head>` de `index.html`. Indicar `lang` además da el idioma correcto a los textos incluidos:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <title>Mi app</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Punto de entrada

Importa la hoja de estilos base una vez y envuelve la app en `MaterixProvider`:

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

## Primer componente

```tsx
// src/App.tsx
import { Button, useTheme } from '@rubenchodev/materix-react';

export function App() {
  const { resolvedMode, toggle } = useTheme();
  return (
    <Button variant="contained" onClick={toggle}>
      Cambiar a tema {resolvedMode === 'dark' ? 'claro' : 'oscuro'}
    </Button>
  );
}
```

Ejecuta `npm run dev` y abre la URL que muestra Vite.

{{< callout type="tip" title="Quita los estilos de la plantilla" >}}
La plantilla de Vite trae `index.css` y `App.css` con sus propios colores y fuentes. Bórralos (y sus imports) para que no sobrescriban los tokens de Materix.
{{< /callout >}}
