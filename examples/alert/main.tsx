import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
/**
 * Página de ejemplo de Alert: monta las demos de demos/alert.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/alert/*.tsx', '!../../demos/alert/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage
      slug="alert"
      title="Alert"
      description="A short, prominent message that reports the outcome of an action or the state of the system without interrupting the user."
      demos={demos}
    />
  </StrictMode>,
);
