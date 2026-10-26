import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/fab/*.tsx', '!../../demos/fab/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="fab" title="Fab" description="Floating action button for a screen's primary action: circular (56/48/40px) or extended with text (48px)." demos={demos} />
  </StrictMode>,
);
