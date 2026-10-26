import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/** Página de ejemplo de button-group: monta las demos de demos/button-group. */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/button-group/*.tsx', '!../../demos/button-group/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="button-group"
      title="Button Group"
      description="Groups related buttons into a single piece with joined borders, separators and inherited variant, size and color."
      demos={demos}
    />
  </StrictMode>,
);
