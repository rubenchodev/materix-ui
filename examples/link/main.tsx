/**
 * Página de ejemplo de Link: monta todas las demos de demos/link.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/link/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="link"
      title="Link"
      description="MUI-styled text link on a native `<a>`: palette colors and three underline modes, without losing semantics."
      demos={demos}
    />
  </StrictMode>,
);
