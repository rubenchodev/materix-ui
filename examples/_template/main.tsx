import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/**
 * PLANTILLA de página de ejemplo. Cómo usarla:
 *   1. Copiar la carpeta:   cp -r examples/_template examples/{slug}
 *   2. Reemplazar __SLUG__ (slug kebab-case) y __TITLE__ (nombre en inglés) en index.html y main.tsx.
 *      import.meta.glob exige un literal, por eso el slug va escrito a mano en la ruta de abajo.
 *   3. Crear demos/{slug}/NN-name.tsx; cada archivo exporta:
 *        export const title = { en: 'Basic usage', es: 'Uso básico' };
 *        export default function Demo() { return <Button variant="contained">Save</Button>; }
 *      La 01 debe ser la sintaxis más simple (equivalente a la "single-element" de vainilla).
 *   4. `npm run dev` → /examples/{slug}/index.html; `npm run test:e2e` la valida (smoke + axe) en claro y oscuro.
 * Las carpetas que empiezan por "_" no se compilan ni se listan en el índice.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/__SLUG__/*.tsx', '!../../demos/__SLUG__/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="__SLUG__" title="__TITLE__" demos={demos} />
  </StrictMode>,
);
