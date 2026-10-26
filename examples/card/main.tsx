import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/**
 * Página de ejemplo de Card: monta todas las demos de demos/card.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/card/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="card"
      title="Card"
      description="A surface that groups content and actions about a single subject: header, image, text and buttons."
      demos={demos}
    />
  </StrictMode>,
);
