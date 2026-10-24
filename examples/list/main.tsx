/**
 * Página de ejemplo de List: monta todas las demos de demos/list.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/list/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="list"
      title="List"
      description="Continuous vertical list of text, icons or avatars, with static or interactive items, subheaders, density and selection."
      demos={demos}
    />
  </StrictMode>,
);
