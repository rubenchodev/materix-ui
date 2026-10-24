/**
 * Página de ejemplo de Typography: monta todas las demos de demos/typography.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/typography/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="typography"
      title="Typography"
      description="Applies the MUI type scale (h1 to overline) to any element, separating HTML semantics from visual style."
      demos={demos}
    />
  </StrictMode>,
);
