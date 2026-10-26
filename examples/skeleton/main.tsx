import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/**
 * Página de ejemplo de Skeleton: monta todas las demos de demos/skeleton.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/skeleton/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="skeleton"
      title="Skeleton"
      description="Content-shaped placeholders shown while data loads, with a pulse or wave animation."
      demos={demos}
    />
  </StrictMode>,
);
