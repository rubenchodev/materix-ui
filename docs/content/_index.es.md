---
title: "Materix UI · React"
description: "Componentes React + TypeScript nativos con la estética de Material UI: el mismo CSS y los mismos design tokens de Materix UI, sin atributos data-mtx ni envoltorios sobre el DOM."
---

## Funcionando en un minuto

Instala el paquete, importa la hoja de estilos base una sola vez y usa los componentes como con cualquier librería de React.

```bash
npm install @rubenchodev/materix-react
```

```tsx
import '@rubenchodev/materix-ui/base.css';
import { Button, MaterixProvider } from '@rubenchodev/materix-react';

export function App() {
  return (
    <MaterixProvider defaultMode="system">
      <Button variant="contained">Guardar</Button>
    </MaterixProvider>
  );
}
```

{{< callout type="info" title="Fuentes recomendadas" >}}
Los componentes usan **Roboto** y la fuente **Material Icons**. Cárgalas desde Google Fonts para obtener el aspecto exacto de MUI; sin ellas todo sigue funcionando con la fuente del sistema. Consulta [Instalación]({{< relref "/guide/installation" >}}).
{{< /callout >}}

## El mismo sistema de diseño, dos sabores

Materix UI · React comparte el CSS, los design tokens `--mtx-*` y las reglas visuales de la [versión vanilla](https://qualitycode.dev/materix-ui/vainilla/). Lo que cambia es la API: en lugar de atributos `data-*` e inicialización automática, tienes componentes React tipados con props, estado, refs y eventos. Si vienes de la librería vanilla, lee [Migración desde vanilla]({{< relref "/guide/migration" >}}).
