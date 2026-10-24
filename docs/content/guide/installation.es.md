---
title: "Instalación"
description: "Instala @rubenchodev/materix-react, importa la hoja de estilos base, carga Roboto y Material Icons y envuelve tu app en MaterixProvider."
weight: 10
icon: "download"
---

Materix UI para React se distribuye como **módulos ES con tipos de TypeScript**. Los estilos provienen del paquete compartido `@rubenchodev/materix-ui`, que se instala automáticamente como dependencia.

## Requisitos

| Requisito | Versión |
|---|---|
| React y React DOM | 18 o superior (dependencias peer) |
| Node.js | 18 o superior |
| Bundler | Cualquiera que entienda imports de CSS: Vite, Next.js, webpack, Rspack, Parcel… |

## Instalar el paquete

```bash
npm install @rubenchodev/materix-react
```

`pnpm add` y `yarn add` funcionan igual. React no se empaqueta: lo aporta tu aplicación.

## Importar la hoja de estilos base

Importa el CSS base **una sola vez**, en el punto de entrada de tu app. Contiene los design tokens `--mtx-*`, los temas claro y oscuro y los estilos base de `.mtx-root`. Cada componente importa su propio CSS, así que solo publicas los estilos que usas.

```tsx
// main.tsx (o app/layout.tsx en Next.js)
import '@rubenchodev/materix-ui/base.css';
```

## Fuentes

Los componentes usan **Roboto** y la fuente **Material Icons**, como MUI. Cárgalas en el `<head>` de tu HTML:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```

{{< callout type="tip" title="Alojarlas tú mismo" >}}
Si prefieres no depender de Google Fonts, instala `@fontsource/roboto` y `material-icons` desde npm e importa su CSS junto a `base.css`.
{{< /callout >}}

## Envolver la aplicación

`MaterixProvider` combina el tema (`ThemeProvider`), el idioma (`I18nProvider`) y el contenedor `.mtx-root` que aplica la tipografía base. Es opcional (todos los componentes funcionan sin él), pero es el punto de partida recomendado.

```tsx
import { MaterixProvider, Button } from '@rubenchodev/materix-react';

export function App() {
  return (
    <MaterixProvider defaultMode="system" locale="es">
      <Button variant="contained">Guardar</Button>
    </MaterixProvider>
  );
}
```

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `defaultMode` | `'light' \| 'dark' \| 'system'` | `'light'` | Tema inicial si no hay valor guardado ni `?theme=` en la URL. |
| `mode` | `'light' \| 'dark' \| 'system'` | — | Tema controlado. |
| `locale` | `string` | `<html lang>` | Idioma de los textos incluidos (`en`, `es`, `es-MX`…). |
| `messages` | `LocaleMessages` | — | Textos que sobrescriben los incluidos, por idioma. |
| `disableRoot` | `boolean` | `false` | No renderiza el contenedor `.mtx-root`. |

## Importar componentes

Importa desde la raíz del paquete o desde `components/{nombre}` si quieres un límite de módulo explícito:

```tsx
import { Button, TextField } from '@rubenchodev/materix-react';
import { Dialog } from '@rubenchodev/materix-react/components/dialog';
```

Ambas formas permiten tree-shaking.
