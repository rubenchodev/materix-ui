import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/**
 * Página de ejemplo de Chip: monta las demos de demos/chip.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/chip/*.tsx', '!../../demos/chip/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="chip"
      title="Chip"
      description="A compact element that represents a tag, a filter, an input or an action; it can have an icon, an avatar and a delete button."
      demos={demos}
    />
  </StrictMode>,
);
