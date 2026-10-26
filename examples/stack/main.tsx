import '@rubenchodev/materix-ui/base.css'; // primero: los CSS de componentes (demos) deben ganar a base.css
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage, loadDemos } from '../shared/ExamplePage';

const demos = loadDemos(import.meta.glob(['../../demos/stack/*.tsx', '!../../demos/stack/*.*.tsx'], { eager: true }));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamplePage slug="stack" title="Stack" description="Stacks elements in one direction (column or row) with even spacing, alignment, wrapping, dividers and per-breakpoint changes." demos={demos} />
  </StrictMode>,
);
