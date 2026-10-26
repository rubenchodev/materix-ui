import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/**
 * Página de ejemplo de Paper: monta todas las demos de demos/paper.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/paper/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="paper"
      title="Paper"
      description="The base Material Design surface, with background, border radius and shadow, that groups content and expresses elevation."
      demos={demos}
    />
  </StrictMode>,
);
