/** Página de ejemplo de breadcrumbs: monta las demos de demos/breadcrumbs. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/breadcrumbs/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="breadcrumbs"
      title="Breadcrumbs"
      description="Hierarchical navigation trail with `Link` children or an `items` list: text or icon separators, `aria-current` on the current page, a collapse button driven by `maxItems` and a cancelable `onNavigate` for SPA routing."
      demos={demos}
    />
  </StrictMode>,
);
