import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/icon-button/*.tsx', '!../../demos/icon-button/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="icon-button" title="Icon Button" description="Circular icon-only button for compact actions in toolbars, cards and table rows. Always with an aria-label." demos={demos} />
  </StrictMode>,
);
