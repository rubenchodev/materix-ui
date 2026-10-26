import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/**
 * Página de ejemplo de Accordion: monta todas las demos de demos/accordion.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob('../../demos/accordion/*.tsx', { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="accordion"
      title="Accordion"
      description="Collapsible panels with a clickable summary and an animated region: elevation and outlined variants, gutters, custom icons, native `details`, exclusive groups with keyboard navigation and actions. Ideal for FAQs and grouped settings."
      demos={demos}
    />
  </StrictMode>,
);
