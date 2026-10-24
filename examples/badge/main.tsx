/**
 * Página de ejemplo de Badge: monta todas las demos de demos/badge.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/badge/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="badge"
      title="Badge"
      description="Displays a number or a status dot at the corner of an icon, avatar or button to flag new or pending items."
      demos={demos}
    />
  </StrictMode>,
);
