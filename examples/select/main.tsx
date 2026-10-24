/** Página de ejemplo de Select: monta todas las demos de demos/select. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/select/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="select" title="Select"
      description="Select with a custom MUI-style menu: search, multiple selection, bulk actions, groups, limits and icons or images in the options."
      demos={demos} />
  </StrictMode>,
);
