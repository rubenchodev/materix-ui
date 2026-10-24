/**
 * Página de ejemplo de Drawer: monta las demos de demos/drawer.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/drawer/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="drawer"
      title="Drawer"
      description="Side panel for navigation or supplementary content: temporary, persistent, permanent or responsive, with a generated header and footer and an app shell pattern."
      demos={demos}
    />
  </StrictMode>,
);
