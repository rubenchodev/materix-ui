import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/**
 * Página de ejemplo de Divider: monta todas las demos de demos/divider.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/divider/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="divider"
      title="Divider"
      description="A thin line that separates and groups content in lists, menus and layouts, horizontally or vertically and optionally with text."
      demos={demos}
    />
  </StrictMode>,
);
